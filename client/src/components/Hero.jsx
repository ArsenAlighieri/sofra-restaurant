import React from 'react';
import { ArrowUpRight, ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <>
      <section 
        className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        aria-labelledby="hero-title"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left copy column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-brand-terracotta font-bold">
              <span className="w-6 h-0.5 bg-brand-terracotta inline-block" aria-hidden="true" />
              A seat at our table
            </div>

            <h1 
              id="hero-title"
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-brand-green leading-[1.08] tracking-tight"
            >
              Good food. <br />
              <em className="italic font-normal">Good company.</em>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-brand-muted max-w-xl leading-relaxed">
              Seasonal ingredients, Mediterranean roots, and a little time to slow down. Welcome to Sofra.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#reservation"
                className="inline-flex items-center gap-2 bg-brand-green text-white px-7 py-3.5 rounded-full font-medium text-sm tracking-wide shadow-md shadow-brand-green/20 hover:bg-brand-green-light transition-all transform hover:-translate-y-0.5"
              >
                Book a table
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <a
                href="#menu"
                className="inline-flex items-center gap-2 text-brand-green font-semibold text-sm hover:text-brand-terracotta transition-colors px-4 py-3"
              >
                Explore the menu
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>

            <p className="text-xs uppercase tracking-wider text-brand-muted/80 pt-2 font-medium">
              Made for sharing. Meant to be savoured.
            </p>
          </div>

          {/* Right image column */}
          <div className="lg:col-span-5">
            <figure className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-brand-cream-card">
              <img
                src="/assets/restaurant.jpg"
                alt="An elegantly plated dish with fresh herbs in a softly lit restaurant"
                className="w-full aspect-[4/5] object-cover"
                fetchPriority="high"
              />
              <figcaption className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs font-semibold text-brand-green shadow-sm">
                <span>Seasonal by nature</span>
                <span aria-hidden="true" className="text-brand-terracotta">✳</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Values strip */}
      <div className="bg-brand-green text-white/90 py-4 border-y border-brand-green-light/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs sm:text-sm uppercase tracking-widest font-medium">
          <span>Fresh & seasonal</span>
          <span aria-hidden="true" className="text-brand-terracotta">✳</span>
          <span>Mediterranean at heart</span>
          <span aria-hidden="true" className="text-brand-terracotta">✳</span>
          <span>Better together</span>
        </div>
      </div>
    </>
  );
}
