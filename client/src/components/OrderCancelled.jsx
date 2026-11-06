import React from 'react';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export default function OrderCancelled({ onBackToHome }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-brand-cream-border p-8 sm:p-10 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-brand-green">
            Order Not Completed
          </h2>
          <p className="text-sm text-brand-muted leading-relaxed">
            Your checkout session was cancelled. No charges were made to your card. Your selected dishes remain available in your cart whenever you are ready.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-light text-white px-8 py-3.5 rounded-full font-semibold text-sm transition-all shadow-md shadow-brand-green/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Menu
        </button>
      </div>
    </div>
  );
}
