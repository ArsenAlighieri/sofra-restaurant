import React from 'react';
import { Minus, Plus } from 'lucide-react';

/**
 * QuantityStepper - Controlled Component
 * 
 * Demonstrates the controlled component pattern in React:
 * - Its displayed number is fully driven by the `value` prop from the parent component.
 * - Any user interaction fires `onChange(newValue)`, allowing the parent to control state updates.
 * - Enforces minimum and maximum bounds.
 */
export default function QuantityStepper({
  value = 0,
  onChange,
  min = 0,
  max = 20,
  ariaLabel = "Quantity"
}) {
  const handleDecrement = (e) => {
    e.stopPropagation();
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div 
      className="inline-flex items-center bg-brand-cream-card border border-brand-cream-border rounded-full p-1 shadow-sm"
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="w-8 h-8 rounded-full flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-green transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green/30"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span 
        className="w-8 text-center font-semibold text-sm text-brand-charcoal select-none tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="w-8 h-8 rounded-full flex items-center justify-center text-brand-green hover:bg-brand-green hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-green transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green/30"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
