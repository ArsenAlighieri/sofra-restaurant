import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../db/pool.js';

const router = express.Router();

/**
 * GET /api/orders/:id
 * Retrieve order details and historical snapshot items.
 * Enforces ownership: only the user who created the order can retrieve it.
 */
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id, 10);
    const userId = req.userId;

    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID.' });
    }

    // Retrieve order
    const orderResult = await query(
      'SELECT id, user_id, status, total_amount, currency, stripe_checkout_session_id, created_at, updated_at FROM orders WHERE id = $1',
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = orderResult.rows[0];

    // Enforce ownership: order must belong to logged-in user
    if (order.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied: You do not have permission to view this order.' });
    }

    // Retrieve snapshot items
    const itemsResult = await query(
      'SELECT id, order_id, menu_item_id, item_name, quantity, unit_price, total_price FROM order_items WHERE order_id = $1',
      [orderId]
    );

    res.json({
      order: {
        ...order,
        items: itemsResult.rows
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
