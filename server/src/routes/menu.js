import express from 'express';
import { query } from '../db/pool.js';

const router = express.Router();

/**
 * GET /api/menu
 * Retrieve all menu dishes
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, category, description, price, dietary, image_url, availability, created_at FROM menu_items ORDER BY id ASC'
    );
    res.json({
      items: result.rows
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/menu/:id
 * Retrieve a single dish
 */
router.get('/:id', async (req, res, next) => {
  try {
    const itemId = parseInt(req.params.id, 10);
    if (isNaN(itemId)) {
      return res.status(400).json({ error: 'Invalid dish ID' });
    }

    const result = await query(
      'SELECT id, name, category, description, price, dietary, image_url, availability FROM menu_items WHERE id = $1',
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({
      item: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
});

export default router;
