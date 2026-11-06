import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';
import { pool } from './db/pool.js';

import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import checkoutRoutes from './routes/checkout.js';
import ordersRoutes from './routes/orders.js';
import webhookRoutes from './routes/webhook.js';

dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Trust proxy for secure cookies behind reverse proxies (Railway / Heroku / Vercel)
if (isProduction) {
  app.set('trust proxy', 1);
}

// 2. CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      // Allow configured client URL and localhost
      if (
        origin === clientUrl ||
        origin.startsWith('http://localhost') ||
        origin.startsWith('http://127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for practicum demonstration
    },
    credentials: true,
  })
);

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
}

app.use(
  session({
    store: sessionStore, // Fallbacks to MemoryStore if pool is null
    name: 'sofra_session',
    secret: process.env.SESSION_SECRET || 'sofra_super_secret_restaurant_practicum_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// 6. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sofra Restaurant Backend',
    timestamp: new Date().toISOString(),
    postgresConfigured: Boolean(process.env.DATABASE_URL),
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
  });
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
