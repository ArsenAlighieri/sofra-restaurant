import express from 'express';
import Stripe from 'stripe';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../db/pool.js';

const router = express.Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

/**
 * POST /api/checkout
 * Validates cart server-side, inserts order snapshot into database,
 * and creates a Stripe Checkout Session.
 */
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.userId;
    const { items } = req.body;

    // 1. Validation
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    for (const item of items) {
      if (!item.menuItemId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({ error: 'Invalid items or quantities in cart payload.' });
      }
    }

    // 2. Fetch prices from PostgreSQL - NEVER trust client prices
    const itemIds = items.map(i => Number(i.menuItemId));
    const dbResult = await query(
      'SELECT id, name, price, availability FROM menu_items WHERE id = ANY($1)',
      [itemIds]
    );

    const dbItemsMap = new Map();
    dbResult.rows.forEach(row => {
      dbItemsMap.set(Number(row.id), row);
    });

    // 3. Check existence and availability
    for (const item of items) {
      const dbItem = dbItemsMap.get(Number(item.menuItemId));
      if (!dbItem) {
        return res.status(404).json({ error: `Dish #${item.menuItemId} is no longer found in menu.` });
      }
      if (dbItem.availability === false) {
        return res.status(400).json({ error: `"${dbItem.name}" is currently sold out.` });
      }
    }

    // 4. Calculate total in integer minor units (pence for GBP)
    let totalPence = 0;
    const validatedOrderItems = [];
    const stripeLineItems = [];

    for (const item of items) {
      const dbItem = dbItemsMap.get(Number(item.menuItemId));
      const unitPricePence = Math.round(Number(dbItem.price) * 100);
      const lineTotalPence = unitPricePence * item.quantity;
      totalPence += lineTotalPence;

      validatedOrderItems.push({
        menuItemId: dbItem.id,
        name: dbItem.name,
        quantity: item.quantity,
        unitPrice: unitPricePence,
        totalPrice: lineTotalPence
      });

      stripeLineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: dbItem.name,
            description: `Sofra Restaurant — Freshly prepared dining`,
          },
          unit_amount: unitPricePence,
        },
        quantity: item.quantity,
      });
    }

    // 5. Create pending order in database
    const orderResult = await query(
      `INSERT INTO orders (user_id, total_amount, currency, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id, status, total_amount, currency`,
      [userId, totalPence, 'gbp']
    );

    const order = orderResult.rows[0];

    // 6. Insert snapshot order_items
    for (const orderItem of validatedOrderItems) {
      await query(
        `INSERT INTO order_items (order_id, menu_item_id, item_name, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, orderItem.menuItemId, orderItem.name, orderItem.quantity, orderItem.unitPrice, orderItem.totalPrice]
      );
    }

    // 7. Create Stripe Checkout Session
    let sessionUrl = '';
    let sessionId = '';

    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: stripeLineItems,
        mode: 'payment',
        success_url: `${clientUrl}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
        cancel_url: `${clientUrl}/order-cancelled?order_id=${order.id}&cancelled=true`,
        metadata: {
          order_id: String(order.id),
          user_id: String(userId),
        },
      });

      sessionUrl = session.url;
      sessionId = session.id;
    } else {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('FATAL: STRIPE_SECRET_KEY is required in production. Simulated checkout is disabled.');
      }
      // In local development only when STRIPE_SECRET_KEY is not yet populated
      sessionId = `mock_session_${Date.now()}`;
      sessionUrl = `${clientUrl}/order-success?session_id=${sessionId}&order_id=${order.id}`;
      console.warn('ℹ STRIPE_SECRET_KEY not set. Using test checkout redirect in dev mode.');
    }

    // 8. Associate Stripe session ID with order
    await query(
      'UPDATE orders SET stripe_checkout_session_id = $1 WHERE id = $2',
      [sessionId, order.id]
    );

    res.json({
      url: sessionUrl,
      orderId: order.id,
      sessionId
    });
  } catch (err) {
    next(err);
  }
});

export default router;
