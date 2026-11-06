import React from 'react';
import { ArrowUpRight, ArrowUp, MapPin, Phone, Clock } from 'lucide-react';

export default function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="visit" className="bg-brand-dark text-white/90 pt-16 pb-12 border-t border-brand-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand info */}
          <div className="space-y-4">
            <a 
              href="#top" 
              onClick={scrollToTop}
              className="inline-block font-serif text-3xl font-bold tracking-tight text-white hover:text-brand-terracotta transition-colors"
            >
              sofra<span className="text-brand-terracotta">.</span>
            </a>
            <p className="text-white/70 text-sm leading-relaxed">
              Good food. Good company.<br />
              A seat for everyone at our neighbourhood table.
            </p>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide">
              Find our table
            </h3>
            <address className="not-italic text-sm text-white/70 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-terracotta mt-0.5 shrink-0" />
                <span>18 Olive Lane, London<br />Fictional dining location</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-brand-terracotta shrink-0" />
                <a href="tel:+442079460123" className="hover:text-white transition-colors">
                  +44 20 7946 0123
                </a>
              </div>
            </address>
          </div>

          {/* Opening hours */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide">
              Opening hours
            </h3>
            <dl className="text-sm text-white/70 space-y-2">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-brand-terracotta" />
                  Tuesday–Sunday
                </dt>
                <dd className="font-medium text-white">12:00–22:00</dd>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                <dt>Monday</dt>
                <dd className="text-brand-terracotta font-medium">Closed</dd>
              </div>
            </dl>
          </div>

          {/* Quick links & booking */}
          <div className="space-y-3">
            <h3 className="font-serif text-lg font-semibold text-white tracking-wide">
              Stay a little longer
            </h3>
            <div className="flex flex-col space-y-2 text-sm text-white/70">
              <a 
                href="#reservation" 
                className="inline-flex items-center gap-1.5 text-brand-terracotta font-medium hover:underline"
              >
                Book a table <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a href="#menu" className="hover:text-white transition-colors">Browse the menu</a>
              <a href="#about" className="hover:text-white transition-colors">Our kitchen philosophy</a>
            </div>
          </div>
        </div>

        {/* Bottom copyright and back to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} Sofra Restaurant. Built for Mayerfeld Consulting Practicum.</p>
          <a
            href="#top"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
          >
            Back to top <ArrowUp className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
