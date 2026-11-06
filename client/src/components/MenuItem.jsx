import React from 'react';
import QuantityStepper from './QuantityStepper';

export default function MenuItem({ item, quantity = 0, onQuantityChange }) {
  const { id, name, description, price, dietary, imageUrl, availability = true } = item;

  return (
    <article 
      className={`bg-white rounded-2xl overflow-hidden border border-brand-cream-border/70 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
        !availability ? 'opacity-60 grayscale' : ''
      }`}
      aria-labelledby={`item-title-${id}`}
    >
      <div>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-cream-card">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/restaurant.jpg';
            }}
          />
          {dietary && (
            <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-sm ${
              dietary === 'House favourite'
                ? 'bg-brand-terracotta text-white'
                : dietary === 'Vegan'
                ? 'bg-emerald-700 text-white'
                : 'bg-white/90 text-brand-green'
            }`}>
              {dietary}
            </span>
          )}
          {!availability && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-baseline justify-between gap-3 mb-2">
            <h3 
              id={`item-title-${id}`}
              className="font-serif text-xl font-bold text-brand-green tracking-tight"
            >
              {name}
            </h3>
            <span className="font-semibold text-lg text-brand-terracotta tabular-nums">
              £{Number(price).toFixed(2)}
            </span>
          </div>
          <p className="text-brand-muted text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-brand-cream-border/40 pt-4">
        <span className="text-xs uppercase tracking-wider text-brand-muted font-medium">
          {quantity > 0 ? `Selected: ${quantity}` : 'Add to order'}
        </span>
        <QuantityStepper
          value={quantity}
          onChange={onQuantityChange}
          min={0}
          max={20}
          ariaLabel={`Quantity for ${name}`}
        />
      </div>
    </article>
  );
}
