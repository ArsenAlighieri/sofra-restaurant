import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';
import { pool, query } from './db/pool.js';

import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import checkoutRoutes from './routes/checkout.js';
import ordersRoutes from './routes/orders.js';
import webhookRoutes from './routes/webhook.js';

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

if (isProduction && (!process.env.CLIENT_URL || !process.env.SESSION_SECRET)) {
  throw new Error('FATAL: CLIENT_URL and SESSION_SECRET are required in production.');
}

// 1. Trust proxy for secure cookies behind reverse proxies (Railway / Vercel)
if (isProduction) {
  app.set('trust proxy', 1);
}

// 2. CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server, or same-origin)
      if (!origin) return callback(null, true);

      // Normalize origin
      const lowerOrigin = origin.toLowerCase();

      // Check allowed origins
      if (lowerOrigin === clientUrl.toLowerCase()) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use((req, res, next) => {
  if (req.headers.origin && req.headers.origin.toLowerCase() !== clientUrl.toLowerCase()) {
    return res.status(403).json({ error: 'Origin not allowed.' });
  }
  next();
});

// 3. Webhook routes (Raw body parser MUST run BEFORE express.json())
app.use('/api/webhooks', webhookRoutes);

// 4. Standard body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 5. Session configuration
let sessionStore;
if (pool) {
  const PgSession = connectPgSimple(session);
  sessionStore = new PgSession({
    pool,
    tableName: 'session',
    createTableIfMissing: true,
  });
} else if (isProduction) {
  throw new Error('FATAL: connect-pg-simple requires an active PostgreSQL pool in production.');
}

app.use(
  session({
    store: sessionStore, // Backed by PostgreSQL in production; fallback to MemoryStore in dev only
    name: 'sofra_session',
    secret: process.env.SESSION_SECRET || 'sofra_super_secret_restaurant_practicum_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: process.env.COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax'),
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// 6. Production-grade Health check endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let dbError = null;

  try {
    const dbCheck = await query('SELECT 1 as alive');
    if (dbCheck && dbCheck.rows && dbCheck.rows.length > 0) {
      dbStatus = pool ? 'connected (postgresql)' : 'fallback (memory-store)';
    }
  } catch (err) {
    dbStatus = 'error';
    dbError = err.message;
  }

  const isHealthy = !isProduction || dbStatus.includes('postgresql');

  const responsePayload = {
    status: isHealthy ? 'ok' : 'degraded',
    service: 'Sofra Restaurant Backend',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      error: dbError,
    },
    stripe: {
      configured: Boolean(process.env.STRIPE_SECRET_KEY),
      webhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    },
  };

  return res.status(isHealthy ? 200 : 503).json(responsePayload);
});

// 7. Mount Application API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', ordersRoutes);

// 8. 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// 9. Central error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack || err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'An unexpected internal server error occurred.'
  });
});

export default app;
