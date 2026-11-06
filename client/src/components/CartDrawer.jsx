import React from 'react';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import QuantityStepper from './QuantityStepper';

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  quantities = {},
  onQuantityChange,
  onClearCart,
  onCheckout,
  isCheckingOut = false,
  user = null,
  onOpenAuth
}) {
  if (!isOpen) return null;

  // Filter items that have quantity > 0
  const cartItems = items
    .filter(item => (quantities[item.id] || 0) > 0)
    .map(item => ({
      ...item,
      quantity: quantities[item.id],
      lineTotal: Number(item.price) * quantities[item.id]
    }));

  const totalAmount = cartItems.reduce((acc, curr) => acc + curr.lineTotal, 0);
  const totalItemsCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleCheckoutClick = () => {
    if (!user) {
      onOpenAuth('login');
    } else {
      onCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-brand-cream-card border-b border-brand-cream-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-green text-white rounded-full">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-brand-green">Your Order</h2>
                <p className="text-xs text-brand-muted">
                  {totalItemsCount === 1 ? '1 item' : `${totalItemsCount} items`} selected
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-brand-muted hover:text-brand-charcoal rounded-full hover:bg-black/5 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart item list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-brand-muted space-y-4 py-16">
                <div className="w-16 h-16 rounded-full bg-brand-cream-card flex items-center justify-center text-brand-green">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-lg font-bold text-brand-charcoal">Your order is empty</p>
                  <p className="text-sm">Select dishes from the menu to start your order.</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 text-sm font-semibold text-brand-green underline hover:text-brand-terracotta transition-colors"
                >
                  Browse our menu
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-brand-cream/50 rounded-xl border border-brand-cream-border/70"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover bg-brand-cream-card shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/restaurant.jpg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif font-bold text-sm text-brand-charcoal truncate">
                        {item.name}
                      </h4>
                      <span className="text-sm font-semibold text-brand-green tabular-nums shrink-0">
                        £{item.lineTotal.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted mb-2">
                      £{Number(item.price).toFixed(2)} each
                    </p>
                    <div className="flex items-center justify-between">
                      <QuantityStepper
                        value={item.quantity}
                        onChange={(newQty) => onQuantityChange(item.id, newQty)}
                        min={0}
                        max={20}
                        ariaLabel={`Adjust ${item.name}`}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer summary */}
          {cartItems.length > 0 && (
            <div className="p-6 bg-brand-cream-card border-t border-brand-cream-border space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-brand-muted">
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium text-brand-charcoal">
                    £{totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-brand-green pt-2 border-t border-brand-cream-border">
                  <span>Estimated Total</span>
                  <span className="text-xl text-brand-terracotta tabular-nums">
                    £{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {!user && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl flex items-center justify-between">
                  <span>Sign in required to place order</span>
                  <button
                    type="button"
                    onClick={() => onOpenAuth('login')}
                    className="font-bold underline hover:text-amber-900"
                  >
                    Sign in
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={handleCheckoutClick}
                disabled={isCheckingOut}
                className="w-full bg-brand-green hover:bg-brand-green-light text-white py-3.5 px-6 rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-green/20 disabled:opacity-50 transition-all transform hover:-translate-y-0.5"
              >
                {isCheckingOut ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Connecting to Stripe...</span>
                  </>
                ) : (
                  <>
                    <span>{user ? 'Proceed to Stripe Checkout' : 'Sign In & Checkout'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-brand-muted pt-1">
                <span>Secure test payment powered by Stripe</span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-red-600 hover:underline inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
