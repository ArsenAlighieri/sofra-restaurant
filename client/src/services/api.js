/**
 * API Service for Sofra Restaurant
 * Communicates with the Express backend using cookie-based authentication.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // Ensures HTTP-only session cookies are sent
  };

  const response = await fetch(url, config);
  let data;
  try {
    data = await response.json();
  } catch {
    data = { error: 'Invalid response from server' };
  }

  if (!response.ok) {
    const errorMsg = data?.error || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Health
  getHealth: () => request('/api/health'),

  // Menu
  getMenu: () => request('/api/menu'),
  getMenuItem: (id) => request(`/api/menu/${id}`),

  // Auth
  register: ({ name, email, password }) => 
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: ({ email, password }) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request('/api/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () => request('/api/auth/me'),

  // Checkout & Orders
  createCheckout: ({ items }) =>
    request('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),

  getOrder: (id) => request(`/api/orders/${id}`),
};
