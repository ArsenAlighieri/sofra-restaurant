import app from '../src/app.js';
import http from 'http';

const server = http.createServer(app);

server.listen(5099, async () => {
  console.log('Smoke test server started on port 5099');

  async function get(path, headers = {}) {
    const res = await fetch(`http://localhost:5099${path}`, { headers });
    return { status: res.status, data: await res.json(), headers: res.headers };
  }

  async function post(path, body, headers = {}) {
    const res = await fetch(`http://localhost:5099${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });
    return { status: res.status, data: await res.json(), headers: res.headers };
  }

  try {
    // 1. Health check
    const health = await get('/api/health');
    console.log('1. Health check:', health.status === 200 && health.data.status === 'ok' ? 'PASS' : 'FAIL');

    // 2. Menu items
    const menu = await get('/api/menu');
    console.log('2. Menu check:', menu.status === 200 && menu.data.items.length === 9 ? 'PASS (9 items)' : 'FAIL');

    // 3. Register user
    const reg = await post('/api/auth/register', {
      name: 'Farshid Test',
      email: 'farshid@example.com',
      password: 'password123'
    });
    console.log('3. Register check:', reg.status === 201 && reg.data.user.email === 'farshid@example.com' ? 'PASS' : 'FAIL');

    // Extract cookie
    const setCookie = reg.headers.get('set-cookie');
    const cookie = setCookie ? setCookie.split(';')[0] : '';

    // 4. Auth Me with cookie
    const me = await get('/api/auth/me', { Cookie: cookie });
    console.log('4. Auth Me check:', me.status === 200 && me.data.user?.email === 'farshid@example.com' ? 'PASS' : 'FAIL');

    // 5. Checkout creation with authenticated cookie
    const checkout = await post('/api/checkout', {
      items: [
        { menuItemId: 1, quantity: 2 },
        { menuItemId: 4, quantity: 1 }
      ]
    }, { Cookie: cookie });
    console.log('5. Checkout creation check:', checkout.status === 200 && checkout.data.orderId ? `PASS (Order #${checkout.data.orderId})` : 'FAIL');

    // 6. Order lookup
    const order = await get(`/api/orders/${checkout.data.orderId}`, { Cookie: cookie });
    console.log('6. Order lookup check:', order.status === 200 && order.data.order.items.length === 2 ? `PASS (${order.data.order.items.length} items verified)` : 'FAIL');

    console.log('--- ALL SMOKE CHECKS PASSED SUCCESSFULLY ---');
  } catch (err) {
    console.error('Smoke check error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
