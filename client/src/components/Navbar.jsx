import React, { useState } from 'react';
import { ShoppingBag, User, LogOut, Menu as MenuIcon, X, ArrowUpRight } from 'lucide-react';

export default function Navbar({
  cartCount = 0,
  onOpenCart,
  user = null,
  onOpenAuth,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-brand-cream/90 backdrop-blur-md border-b border-brand-cream-border/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <a 
              href="#top" 
              className="font-serif text-3xl font-bold tracking-tight text-brand-green hover:opacity-90 transition-opacity"
              aria-label="Sofra home"
            >
              sofra<span className="text-brand-terracotta">.</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              <a 
                href="#menu" 
                className="text-sm font-medium text-brand-charcoal hover:text-brand-terracotta transition-colors"
              >
                The menu
              </a>
              <a 
                href="#about" 
                className="text-sm font-medium text-brand-charcoal hover:text-brand-terracotta transition-colors"
              >
                Our story
              </a>
              <a 
                href="#visit" 
                className="text-sm font-medium text-brand-charcoal hover:text-brand-terracotta transition-colors"
              >
                Find us
              </a>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Book a table desktop CTA */}
            <a
              href="#reservation"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-brand-green border border-brand-green/30 hover:border-brand-green px-4 py-2.5 rounded-full transition-colors"
            >
              Book a table <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* User Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs font-semibold text-brand-green bg-brand-cream-card border border-brand-cream-border px-3 py-1.5 rounded-full">
                  Hello, {user.name?.split(' ')[0]}
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  title="Sign out"
                  className="p-2.5 rounded-full text-brand-muted hover:text-red-600 hover:bg-black/5 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-brand-charcoal hover:text-brand-terracotta px-3 py-2 rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative bg-brand-green hover:bg-brand-green-light text-white p-2.5 rounded-full shadow-md shadow-brand-green/15 transition-all transform hover:scale-105"
              aria-label={`Open shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-terracotta text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-brand-charcoal hover:text-brand-green rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-brand-cream-border space-y-3">
            <a
              href="#menu"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-charcoal hover:bg-brand-cream-card rounded-lg"
            >
              The menu
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-charcoal hover:bg-brand-cream-card rounded-lg"
            >
              Our story
            </a>
            <a
              href="#visit"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium text-brand-charcoal hover:bg-brand-cream-card rounded-lg"
            >
              Find us
            </a>
            <a
              href="#reservation"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-semibold text-brand-terracotta hover:bg-brand-cream-card rounded-lg"
            >
              Book a table ↗
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
