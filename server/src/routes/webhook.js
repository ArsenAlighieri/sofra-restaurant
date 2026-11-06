import express from 'express';
import Stripe from 'stripe';
import { query } from '../db/pool.js';

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

/**
 * POST /api/webhooks/stripe
 * Dedicated Stripe Webhook endpoint.
 * Requires the raw body buffer for cryptographically verifying Stripe signatures.
 */
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    if (process.env.NODE_ENV === 'production') {
      if (!stripe || !webhookSecret) {
        console.error('FATAL: Stripe credentials missing in production webhook endpoint.');
        return res.status(500).send('Stripe webhook configuration error in production');
      }
      if (!sig) {
        return res.status(400).send('Missing stripe-signature header');
      }
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        console.error('⚠️ Stripe Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      // In development when webhook secret is not set, parse payload directly
      if (stripe && webhookSecret && sig) {
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } catch (err) {
          console.error('⚠️ Stripe Webhook signature verification failed in dev:', err.message);
          return res.status(400).send(`Webhook Error: ${err.message}`);
        }
      } else {
        try {
          const bodyStr = req.body.toString('utf8');
          event = JSON.parse(bodyStr);
          console.log('ℹ Dev webhook received without signature verification:', event.type);
        } catch (err) {
          return res.status(400).send('Invalid JSON payload');
        }
      }
    }

    // Handle payment completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata?.order_id;
      const stripeSessionId = session.id;

      console.log(`✓ Webhook: checkout.session.completed for Order #${orderId}`);

      try {
        // Find existing order
        let order = null;
        if (orderId) {
          const res = await query('SELECT id, status FROM orders WHERE id = $1', [Number(orderId)]);
          order = res.rows[0];
        } else if (stripeSessionId) {
          const res = await query('SELECT id, status FROM orders WHERE stripe_checkout_session_id = $1', [stripeSessionId]);
          order = res.rows[0];
        }

        if (!order) {
          console.warn(`⚠️ Webhook: Order #${orderId} not found in database.`);
          return res.status(200).json({ received: true, note: 'Order not found' });
        }

        // Idempotency: Prevent marking as paid multiple times
        if (order.status === 'paid') {
          console.log(`ℹ Webhook: Order #${order.id} is already marked as paid. Ignoring duplicate event.`);
          return res.status(200).json({ received: true, duplicate: true });
        }

        // Mark order as PAID ONLY via this verified webhook
        await query(
          "UPDATE orders SET status = 'paid', updated_at = CURRENT_TIMESTAMP WHERE id = $1",
          [order.id]
        );

        console.log(`✓ Successfully updated Order #${order.id} status to 'paid'.`);
      } catch (dbErr) {
        console.error('Database error in webhook handler:', dbErr.message);
        return res.status(500).send('Database update error');
      }
    }

    res.status(200).json({ received: true });
  }
);

export default router;
