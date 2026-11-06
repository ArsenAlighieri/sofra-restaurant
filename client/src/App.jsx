import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import About from './components/About';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import OrderSuccess from './components/OrderSuccess';
import OrderCancelled from './components/OrderCancelled';
import { initialMenuItems } from './data/menuData';
import { api } from './services/api';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, login, register, logout, error: authError, clearError } = useAuth();

  // Route state derived from query params
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    const search = window.location.search;
    if (path.includes('order-success') || search.includes('session_id')) {
      return 'success';
    }
    if (path.includes('order-cancelled') || search.includes('cancelled=true')) {
      return 'cancelled';
    }
    return 'home';
  });

  // Menu items state
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(null);

  // Controlled Cart Quantities: { [itemId]: number }
  const [quantities, setQuantities] = useState(() => {
    try {
      const saved = localStorage.getItem('sofra_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [authModalState, setAuthModalState] = useState({ isOpen: false, mode: 'login' });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sofra_cart', JSON.stringify(quantities));
    } catch {
      // LocalStorage unavailable
    }
  }, [quantities]);

  // Fetch real menu from backend, fallback to initial data
  useEffect(() => {
    let isMounted = true;
    async function loadMenu() {
      setIsMenuLoading(true);
      try {
        const data = await api.getMenu();
        if (isMounted && data && Array.isArray(data.items) && data.items.length > 0) {
          // Normalize properties from DB (e.g. image_url -> imageUrl)
          const normalized = data.items.map(item => ({
            ...item,
            imageUrl: item.image_url || item.imageUrl,
            price: Number(item.price)
          }));
          setMenuItems(normalized);
        }
      } catch (err) {
        // Fallback to static seed items when backend is disconnected
        if (isMounted) {
          console.warn('Backend menu unavailable, displaying initial menu:', err.message);
        }
      } finally {
        if (isMounted) setIsMenuLoading(false);
      }
    }

    loadMenu();
    return () => { isMounted = false; };
  }, []);

  // Controlled Quantity Change
  const handleQuantityChange = (itemId, newQuantity) => {
    setQuantities(prev => {
      const updated = { ...prev };
      if (newQuantity <= 0) {
        delete updated[itemId];
      } else {
        updated[itemId] = newQuantity;
      }
      return updated;
    });
  };

  const handleClearCart = () => {
    setQuantities({});
  };

  const totalCartCount = Object.values(quantities).reduce((acc, qty) => acc + qty, 0);

  // Stripe Checkout Flow
  const handleCheckout = async () => {
    if (!user) {
      setAuthModalState({ isOpen: true, mode: 'login' });
      return;
    }

    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id, quantity]) => ({
        menuItemId: Number(id),
        quantity
      }));

    if (items.length === 0) return;

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const data = await api.createCheckout({ items });
      if (data && data.url) {
        // Clear local cart and redirect to Stripe Checkout
        localStorage.removeItem('sofra_cart');
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from server.');
      }
    } catch (err) {
      setCheckoutError(err.message || 'Checkout failed. Please try again.');
      alert(err.message || 'Checkout failed. Please ensure the backend server and Stripe keys are configured.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', window.location.pathname.split('?')[0]);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream selection:bg-brand-terracotta selection:text-white">
      {/* Skip link for keyboard accessibility */}
      <a className="skip-link" href="#main">Skip to main content</a>

      {/* Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        onOpenAuth={(mode) => setAuthModalState({ isOpen: true, mode })}
        onLogout={logout}
      />

      <main id="main" className="flex-1">
        {currentPage === 'success' ? (
          <OrderSuccess onBackToHome={navigateToHome} />
        ) : currentPage === 'cancelled' ? (
          <OrderCancelled onBackToHome={navigateToHome} />
        ) : (
          <>
            <Hero />
            <Menu
              items={menuItems}
              quantities={quantities}
              onQuantityChange={handleQuantityChange}
              isLoading={isMenuLoading}
              error={menuError}
            />
            <About />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={menuItems}
        quantities={quantities}
        onQuantityChange={handleQuantityChange}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
        isCheckingOut={isCheckingOut}
        user={user}
        onOpenAuth={(mode) => {
          setIsCartOpen(false);
          setAuthModalState({ isOpen: true, mode });
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState({ isOpen: false, mode: 'login' })}
        onLogin={login}
        onRegister={register}
        error={authError}
        clearError={clearError}
      />
    </div>
  );
}
