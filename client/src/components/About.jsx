import React from 'react';
import { ArrowUpRight, Phone, Clock, Users } from 'lucide-react';

export default function About() {
  return (
    <>
      <section 
        id="about" 
        aria-labelledby="about-title"
        className="py-20 bg-brand-cream-card/60 border-y border-brand-cream-border/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Interior image */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <figure className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="/assets/interior.jpg"
                  alt="A warm restaurant interior with wooden tables, pendant lights and green plants"
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
                <figcaption className="absolute bottom-4 left-4 bg-brand-green/90 text-white backdrop-blur-md px-4 py-2 rounded-xl text-xs font-medium">
                  A place to settle in.
                </figcaption>
              </figure>
            </div>

            {/* Story copy */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <p className="text-xs uppercase font-bold tracking-widest text-brand-terracotta">
                The story behind the table
              </p>
              <h2 
                id="about-title"
                className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-green leading-tight"
              >
                More than a meal. <br />
                <em className="italic font-normal">A moment together.</em>
              </h2>
              <div className="space-y-4 text-brand-muted text-base sm:text-lg leading-relaxed">
                <p>
                  <strong className="text-brand-charcoal font-semibold">“Sofra”</strong> means a table set for a meal. It is the core idea at the heart of our kitchen: good things happen when friends, family, and travellers sit down together.
                </p>
                <p>
                  Our kitchen takes its inspiration from sunny coastal traditions — bright fresh herbs, cold-pressed olive oil, and quality ingredients that speak for themselves. Our dining room is designed for unhurried lunches, long lively conversations, and just one more bite.
                </p>
              </div>
              <div className="pt-2">
                <a 
                  href="#reservation"
                  className="inline-flex items-center gap-2 text-brand-terracotta hover:text-brand-terracotta-hover font-semibold text-sm transition-colors"
                >
                  There's a place for you here
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation section */}
      <section 
        id="reservation" 
        aria-labelledby="reservation-title"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center"
      >
        <p className="text-xs uppercase font-bold tracking-widest text-brand-terracotta mb-2">
          Come hungry. Leave happy.
        </p>
        <h2 
          id="reservation-title"
          className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-green mb-4"
        >
          Your table <em className="italic font-normal">is waiting.</em>
        </h2>
        <p className="text-brand-muted text-base sm:text-lg mb-8 max-w-xl mx-auto">
          A quiet dinner for two or a gathering of your favourite people. We would love to welcome you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <a
            href="tel:+442079460123"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-green text-white px-8 py-4 rounded-full font-medium text-base shadow-lg shadow-brand-green/20 hover:bg-brand-green-light transition-all transform hover:-translate-y-0.5"
          >
            <Phone className="w-5 h-5 text-brand-terracotta" />
            <span>Call to book a table</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-brand-muted font-medium">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-brand-green" />
            Tuesday–Sunday · 12:00–22:00
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-green" />
            Parties of 1–6 guests
          </span>
        </div>

        <p className="text-xs text-brand-muted/70 mt-6 max-w-md mx-auto">
          Fictional UK example reservation line for demonstration. For takeout or immediate dining, select dishes from the menu above to order online.
        </p>
      </section>
    </>
  );
}
