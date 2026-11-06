import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

let pool = null;
let isConnected = false;

if (connectionString) {
  const isNeonOrCloud = connectionString.includes('neon.tech') || connectionString.includes('sslmode=require');
  pool = new Pool({
    connectionString,
    ssl: isNeonOrCloud || isProduction ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err.message);
  });
}

// In-Memory fallback store for standalone local dev when PostgreSQL is not running
const fallbackStore = {
  users: [],
  menu_items: [
    {
      id: 1,
      name: "Whipped feta",
      category: "starters",
      description: "Roasted grapes, thyme honey, and warm freshly baked sourdough.",
      price: 9.00,
      dietary: "Vegetarian",
      image_url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      availability: true,
      created_at: new Date()
    },
    {
      id: 2,
      name: "Charred aubergine",
      category: "starters",
      description: "Tahini, pomegranate seeds, fresh flat-leaf parsley & a squeeze of lemon.",
      price: 10.00,
      dietary: "Vegan",
      image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      availability: true,
      created_at: new Date()
    },
    {
      id: 3,
      name: "Crispy calamari",
      category: "starters",
      description: "Golden and tender squid rings, with homemade garlic lemon aioli & sea salt.",
      price: 12.00,
      dietary: null,
      image_url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
      availability: true,
      created_at: new Date()
    },
    {
      id: 4,
      name: "Lemon roast chicken",
      category: "mains",
      description: "Rosemary roasted potatoes, seasonal tender greens & rich natural pan juices.",
      price: 22.00,
      dietary: "House favourite",
      image_url: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80",
      availability: true,
      created_at: new Date()
    },
    {
      id: 5,
      name: "Seared sea bass",
      category: "mains",
      description: "Silky white bean purée, blistered cherry tomatoes & fragrant fresh basil oil.",
      price: 25.00,
      dietary: null,
      image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
      availability: true,
      created_at: new Date()
    },
    {
      id: 6,
      name: "Wild mushroom orzo",
      category: "mains",
      description: "Slow-roasted wild forest mushrooms, aged parmesan cheese & garden thyme.",
      price: 19.00,
      dietary: "Vegetarian",
      image_url: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=800&q=80",
      availability: true,
      created_at: new Date()
    },
    {
      id: 7,
      name: "Pistachio baklava",
      category: "desserts",
      description: "Crispy delicate filo layers, wild orange blossom syrup & strained Greek yoghurt.",
      price: 8.00,
      dietary: "Vegetarian",
      image_url: "https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80",
      availability: true,
      created_at: new Date()
    },
    {
      id: 8,
      name: "Olive oil cake",
      category: "desserts",
      description: "Infused with lemon zest, served with macerated seasonal berries & crème fraîche.",
      price: 8.00,
      dietary: "Vegetarian",
      image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      availability: true,
      created_at: new Date()
    },
    {
      id: 9,
      name: "Dark chocolate mousse",
      category: "desserts",
      description: "Valrhona 70% cocoa, flaky Cornish sea salt, roasted crushed hazelnuts.",
      price: 9.00,
      dietary: "Vegetarian",
      image_url: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
      availability: true,
      created_at: new Date()
    }
  ],
  orders: [],
  order_items: [],
  nextUserId: 1,
  nextOrderId: 1001,
  nextOrderItemId: 1
};

export async function query(text, params = []) {
  if (pool) {
    try {
      const start = Date.now();
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      return res;
    } catch (err) {
      console.warn('PostgreSQL query error, falling back to local memory store:', err.message);
    }
  }

  // Emulate parameterized queries in fallback store
  return executeInMemoryQuery(text, params);
}

function executeInMemoryQuery(text, params) {
  const clean = text.trim();

  // 1. SELECT * FROM menu_items
  if (clean.includes('FROM menu_items') && clean.startsWith('SELECT')) {
    if (clean.includes('WHERE id = $1')) {
      const item = fallbackStore.menu_items.find(i => i.id === Number(params[0]));
      return { rows: item ? [item] : [], rowCount: item ? 1 : 0 };
    }
    if (clean.includes('WHERE id = ANY')) {
      const ids = params[0].map(Number);
      const items = fallbackStore.menu_items.filter(i => ids.includes(i.id));
      return { rows: items, rowCount: items.length };
    }
    return { rows: fallbackStore.menu_items, rowCount: fallbackStore.menu_items.length };
  }

  // 2. Users queries
  if (clean.includes('FROM users')) {
    if (clean.includes('WHERE email = $1')) {
      const user = fallbackStore.users.find(u => u.email.toLowerCase() === params[0].toLowerCase());
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }
    if (clean.includes('WHERE id = $1')) {
      const user = fallbackStore.users.find(u => u.id === Number(params[0]));
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }
  }

  // 3. INSERT INTO users
  if (clean.startsWith('INSERT INTO users')) {
    const [name, email, password_hash] = params;
    const existing = fallbackStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const err = new Error('duplicate key value violates unique constraint "users_email_key"');
      err.code = '23505';
      throw err;
    }
    const newUser = {
      id: fallbackStore.nextUserId++,
      name,
      email,
      password_hash,
      created_at: new Date()
    };
    fallbackStore.users.push(newUser);
    return { rows: [newUser], rowCount: 1 };
  }

  // 4. INSERT INTO orders
  if (clean.startsWith('INSERT INTO orders')) {
    const [user_id, total_amount, currency, status] = params;
    const newOrder = {
      id: fallbackStore.nextOrderId++,
      user_id: Number(user_id),
      total_amount: Number(total_amount),
      currency: currency || 'gbp',
      status: status || 'pending',
      stripe_checkout_session_id: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    fallbackStore.orders.push(newOrder);
    return { rows: [newOrder], rowCount: 1 };
  }

  // 5. UPDATE orders SET stripe_checkout_session_id
  if (clean.includes('UPDATE orders SET stripe_checkout_session_id')) {
    const [sessionId, orderId] = params;
    const order = fallbackStore.orders.find(o => o.id === Number(orderId));
    if (order) {
      order.stripe_checkout_session_id = sessionId;
      order.updated_at = new Date();
      return { rows: [order], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 6. UPDATE orders SET status = 'paid' (Webhook)
  if (clean.includes("SET status = 'paid'")) {
    const [orderId] = params;
    const order = fallbackStore.orders.find(o => o.id === Number(orderId));
    if (order) {
      order.status = 'paid';
      order.updated_at = new Date();
      return { rows: [order], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 7. Orders lookup
  if (clean.includes('FROM orders WHERE id = $1')) {
    const order = fallbackStore.orders.find(o => o.id === Number(params[0]));
    return { rows: order ? [order] : [], rowCount: order ? 1 : 0 };
  }

  // 8. INSERT INTO order_items
  if (clean.startsWith('INSERT INTO order_items')) {
    const [order_id, menu_item_id, item_name, quantity, unit_price, total_price] = params;
    const newItem = {
      id: fallbackStore.nextOrderItemId++,
      order_id: Number(order_id),
      menu_item_id: Number(menu_item_id),
      item_name,
      quantity: Number(quantity),
      unit_price: Number(unit_price),
      total_price: Number(total_price)
    };
    fallbackStore.order_items.push(newItem);
    return { rows: [newItem], rowCount: 1 };
  }

  // 9. Order items lookup
  if (clean.includes('FROM order_items WHERE order_id = $1')) {
    const items = fallbackStore.order_items.filter(i => i.order_id === Number(params[0]));
    return { rows: items, rowCount: items.length };
  }

  return { rows: [], rowCount: 0 };
}

export { pool };
