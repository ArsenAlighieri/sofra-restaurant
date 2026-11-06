# Sofra — Full-Stack Restaurant Application

A modern, responsive full-stack restaurant website built for the **Mayerfeld Consulting Frontend Developer Practicum** fulfilling all requirements across Weeks 1–4.

Sofra represents a fictional neighbourhood restaurant celebrating seasonal Mediterranean cuisine, evolving from a semantic HTML/CSS design into a full-stack React, Express, PostgreSQL, and Stripe Checkout application.

---

## 🏛️ Project Architecture & Evolution

```text
sofra-restaurant/
├── client/                      # React 18 + Vite + Tailwind CSS frontend
│   ├── public/assets/           # Restaurant visual assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Header with mobile menu, cart count & auth
│   │   │   ├── Hero.jsx         # Accessible hero with single h1
│   │   │   ├── Menu.jsx         # Dynamic menu grid & status feedback
│   │   │   ├── MenuItem.jsx     # Food item cards with dietary tags & stepper
│   │   │   ├── MenuFilter.jsx   # Controlled category filtering
│   │   │   ├── QuantityStepper.jsx # Reusable controlled stepper component
│   │   │   ├── About.jsx        # Story & reservation section
│   │   │   ├── Footer.jsx       # Hours, location, contact & skip links
│   │   │   ├── CartDrawer.jsx   # Interactive cart drawer & checkout trigger
│   │   │   ├── AuthModal.jsx    # Sign in & registration modal
│   │   │   ├── OrderSuccess.jsx # Polling order confirmation page
│   │   │   └── OrderCancelled.jsx # Checkout cancellation view
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Session-based auth state & persistence
│   │   ├── services/
│   │   │   └── api.js           # REST API client with cookie credentials
│   │   ├── data/
│   │   │   └── menuData.js      # Initial menu seed dataset
│   │   ├── App.jsx              # Main application coordinator
│   │   ├── main.jsx             # React DOM root entry
│   │   └── index.css            # Tailwind directives & CSS variables
│   ├── package.json
│   └── vite.config.js
├── server/                      # Node.js + Express REST API backend
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.sql       # PostgreSQL schema (users, menu, orders, sessions)
│   │   │   ├── pool.js          # Neon/Postgres pool with fallback store
│   │   │   ├── migrate.js       # Database migration runner
│   │   │   └── seed.js          # Menu database seeder
│   │   ├── middleware/
│   │   │   └── auth.js          # requireAuth session middleware
│   │   ├── routes/
│   │   │   ├── auth.js          # POST /register, POST /login, POST /logout, GET /me
│   │   │   ├── menu.js          # GET /menu, GET /menu/:id
│   │   │   ├── checkout.js      # POST /checkout with server-side price validation
│   │   │   ├── orders.js        # GET /orders/:id with ownership verification
│   │   │   └── webhook.js       # POST /webhooks/stripe (raw body signature check)
│   │   ├── app.js               # Express application configuration
│   │   └── index.js             # HTTP listener & database bootstrap
│   ├── scripts/
│   │   └── smoke-test.js        # Automated API & auth smoke verification
│   └── package.json
├── dist/                        # Original Week 1 plain HTML/CSS static foundation
├── .env.example                 # Environment variables template
├── package.json                 # Monorepo root management scripts
└── README.md
```

---

## 📋 Course Milestones (Weeks 1–4)

### Week 1 — Responsive Restaurant Website
- Preserved in `dist/index.html` and `dist/styles.css`.
- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- Exactly one `<h1>` in the hero section.
- Responsive CSS Grid and Flexbox layouts tested from 320px to 1920px without horizontal overflow.
- Accessible keyboard skip links and global `border-box` box sizing.

### Week 2 — React, Vite & Tailwind CSS
- Fully modular component tree (`Navbar`, `Hero`, `Menu`, `MenuItem`, `MenuFilter`, `QuantityStepper`, `About`, `Footer`).
- Controlled `QuantityStepper` component managing state via parent props (`value`, `onChange`) with bound enforcement.
- Data-driven menu dynamically rendered from structured JavaScript objects.
- Interactive category filtering (`All`, `Starters`, `Mains`, `Desserts`) powered by React state.
- Tailwind CSS styling using custom restaurant theme tokens.

### Week 3 — Express Backend & PostgreSQL
- Express.js REST API with structured modular routing.
- PostgreSQL relational schema (`users`, `menu_items`, `orders`, `order_items`, `session`).
- Parameterized SQL queries preventing SQL injection vulnerabilities.
- Neon-compatible connection pooling with SSL support.
- Genuine user authentication with `bcryptjs` password hashing (cost factor 10).
- HTTP-only session cookies with `sameSite: 'lax'` / `'none'` and `secure` in production.
- Protected endpoints using `requireAuth` middleware.
- Full frontend integration with loading spinners, empty states, and refresh persistence.

### Week 4 — Stripe Checkout in TEST MODE
- Authenticated `POST /api/checkout` endpoint.
- Server-side price calculation: reads prices strictly from PostgreSQL, never trusting client-submitted values.
- Checks dish availability before creating pending order records.
- Creates order and item snapshots in `orders` and `order_items` tables.
- Creates a Stripe Hosted Checkout Session and associates it with the pending order.
- Signature-verified Stripe Webhook (`POST /api/webhooks/stripe` using raw request body).
- **Security guarantee**: The webhook is the only mechanism that marks an order as paid; browser redirects are never treated as proof of payment.
- Idempotent webhook handling avoiding duplicate updates.
- Success page (`/order-success`) with retry polling querying `GET /api/orders/:id` until payment is confirmed.

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)
- (Optional) PostgreSQL database (e.g., Neon or local postgres)
- (Optional) Stripe account in test mode

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/ArsenAlighieri/sofra-restaurant.git
cd sofra-restaurant

# Install all dependencies (both client and server)
npm run install:all
```

### 3. Environment Setup
Copy the `.env.example` file to `.env`:
```bash
cp .env.example server/.env
```

Fill in the environment variables:
```ini
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require
SESSION_SECRET=your_super_secret_session_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
*(Note: If `DATABASE_URL` is omitted, the server automatically starts with an in-memory fallback store for zero-friction local inspection).*

### 4. Running the Development Servers
In two separate terminals (or with `npm run dev`):

**Terminal 1 — Backend:**
```bash
npm run server:dev
# Running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
npm run client:dev
# Running on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Verification & Smoke Testing

Run the automated backend smoke verification:
```bash
node server/scripts/smoke-test.js
```

Build the frontend for production:
```bash
npm run client:build
```

---

## 💳 Stripe Test Card Information

When testing checkout in Stripe Test Mode:
- **Card number:** `4242 4242 4242 4242`
- **Expiration:** Any future date (e.g. `12/28`)
- **CVC:** Any 3 digits (e.g. `123`)
- **Postal code:** Any postal code

---

## 🚢 Deployment Guide

- **Frontend (Vercel):**
  - Root directory: `client`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_API_URL=https://your-backend.railway.app`
- **Backend (Railway):**
  - Root directory: `server`
  - Start command: `npm start`
  - Environment variables: `DATABASE_URL`, `SESSION_SECRET`, `CLIENT_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- **Database (Neon):**
  - Provision serverless PostgreSQL on Neon.tech and paste connection string into `DATABASE_URL`.
- **Stripe Webhooks:**
  - In Stripe Dashboard (Test Mode) -> Webhooks -> Add endpoint: `https://your-backend.railway.app/api/webhooks/stripe`
  - Select event: `checkout.session.completed`
  - Copy Signing Secret into `STRIPE_WEBHOOK_SECRET`.
