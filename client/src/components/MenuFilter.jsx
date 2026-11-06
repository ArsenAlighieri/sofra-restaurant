import React from 'react';
import { CATEGORIES } from '../data/menuData';

export default function MenuFilter({ activeCategory, onSelectCategory }) {
  return (
    <nav 
      aria-label="Menu categories"
      className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-6 my-4"
    >
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            aria-pressed={isActive}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 tracking-wide ${
              isActive
                ? 'bg-brand-green text-white shadow-md shadow-brand-green/20'
                : 'bg-brand-cream-card text-brand-charcoal hover:bg-brand-cream-border/70 border border-brand-cream-border'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </nav>
  );
}
