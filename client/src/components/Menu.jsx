import React, { useState, useMemo } from 'react';
import MenuItem from './MenuItem';
import MenuFilter from './MenuFilter';

export default function Menu({ 
  items = [], 
  quantities = {}, 
  onQuantityChange,
  isLoading = false,
  error = null 
}) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return items;
    return items.filter(item => item.category === activeCategory);
  }, [items, activeCategory]);

  return (
    <section 
      id="menu" 
      aria-labelledby="menu-heading"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <p className="text-xs uppercase font-bold tracking-widest text-brand-terracotta mb-2">
          From our kitchen
        </p>
        <h2 
          id="menu-heading"
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-green tracking-tight mb-4"
        >
          A little of everything. <br />
          <em className="italic font-normal">A lot of flavour.</em>
        </h2>
        <p className="text-brand-muted text-base sm:text-lg">
          Familiar favourites with a seasonal Mediterranean twist. Pick something for yourself, or share something with the whole table.
        </p>
      </div>

      <MenuFilter 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory} 
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mb-4" />
          <p className="text-brand-muted text-sm font-medium">Preparing the seasonal menu...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-200 p-6 max-w-lg mx-auto">
          <p className="text-red-700 font-medium mb-2">Unable to load the latest menu</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 text-brand-muted">
          <p className="text-lg">No dishes found in this category at this moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredItems.map(item => (
            <MenuItem
              key={item.id}
              item={item}
              quantity={quantities[item.id] || 0}
              onQuantityChange={(newQty) => onQuantityChange(item.id, newQty)}
            />
          ))}
        </div>
      )}

      <p className="text-center text-xs text-brand-muted mt-12 max-w-xl mx-auto leading-relaxed">
        All prices are in GBP (£). Please notify our team of any food allergies or dietary preferences before placing your order.
      </p>
    </section>
  );
}
