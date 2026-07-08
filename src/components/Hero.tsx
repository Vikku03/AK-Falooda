/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, ArrowRight, Star, Heart, Flame } from 'lucide-react';

interface HeroProps {
  onNavigateToMenu: () => void;
  onNavigateToBuilder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToMenu, onNavigateToBuilder }) => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 py-16 md:py-24 px-4 sm:px-6 lg:px-8 border-b border-pink-100">
      {/* Visual background ambient circles */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-pink-300/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-amber-200/30 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Content Block */}
        <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Voted the Ultimate Desert Hub in Town!
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 leading-tight tracking-tight">
            Indulge in the Layers of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 font-serif italic">
              Pure Happiness!
            </span>
          </h2>

          <p className="mt-6 text-stone-600 text-base sm:text-lg max-w-xl leading-relaxed">
            Welcome to <strong className="text-pink-600">AK Enjoy Falooda</strong>, where every scoop tells a sweet story. Experience our royal dessert creations loaded with sweet basil seeds, premium vermicelli, natural floral syrups, and the richest ice creams. Crafted to refresh your soul!
          </p>

          {/* Key Badges */}
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-pink-100 text-xs text-stone-700 shadow-sm">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span><strong>4.9/5</strong> Star Reviews</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-pink-100 text-xs text-stone-700 shadow-sm">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>100% Vegetarian</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-pink-100 text-xs text-stone-700 shadow-sm">
              <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
              <span>Premium Ingredients</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
            <button
              onClick={onNavigateToMenu}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 transition-all duration-300 group cursor-pointer"
              id="hero-order-now-btn"
            >
              Order Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onNavigateToBuilder}
              className="px-8 py-4 bg-white hover:bg-pink-50 text-pink-600 font-bold rounded-xl flex items-center justify-center gap-2 border border-pink-200 hover:border-pink-300 transition-colors duration-300 shadow-sm cursor-pointer"
              id="hero-design-btn"
            >
              Design-A-Falooda
            </button>
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-stone-500">
            <span>Direct WhatsApp Helpline:</span>
            <a 
              href="https://wa.me/919985545454?text=Hi%20AK%20Enjoy%20Falooda!%20I'd%20like%20to%20place%20an%20order." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-emerald-600 hover:text-emerald-500 font-mono font-bold flex items-center gap-1 transition-colors"
              id="hero-whatsapp-number-link"
            >
              <Phone className="w-4 h-4 fill-emerald-500/10" />
              +91 9985545454
            </a>
          </div>
        </div>

        {/* Right Side: Creative CSS Glass Layered Falooda Visual */}
        <div className="lg:col-span-5 flex justify-center items-center relative z-10 select-none">
          {/* Back Glowing Sunburst */}
          <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-pink-500 to-amber-500 opacity-30 blur-3xl animate-pulse" />

          {/* Interactive Sweet Glass Container */}
          <div className="relative bg-white p-8 rounded-3xl border border-pink-100 shadow-xl flex flex-col items-center max-w-sm w-full">
            {/* Top Cherry floating animation */}
            <div className="absolute -top-6 w-12 h-12 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center shadow-lg shadow-rose-600/30 animate-bounce">
              <span className="text-xl">🍒</span>
              <div className="absolute -top-3 right-3 w-0.5 h-6 bg-amber-800 origin-bottom transform rotate-12" />
            </div>

            {/* The Glass Container */}
            <div className="w-36 h-72 relative bg-pink-50/10 border-x-4 border-b-4 border-pink-300/30 rounded-b-3xl rounded-t-lg overflow-hidden flex flex-col justify-end mt-4 shadow-inner">
              {/* Layer 5: Almonds & Cream Scoop (Top) */}
              <div className="h-14 bg-amber-50 flex items-center justify-center text-xs text-amber-800 font-bold border-b border-amber-200/40 animate-pulse">
                🍦 Vanilla Scoop & Nuts
              </div>
              
              {/* Layer 4: Strawberry/Mango Swirl */}
              <div className="h-16 bg-gradient-to-r from-rose-500 via-pink-400 to-amber-400 flex items-center justify-center text-[10px] text-stone-100 font-semibold border-b border-rose-400/30">
                🥭 Mango & Rose Swirl
              </div>

              {/* Layer 3: Vermicelli noodles (Sev) */}
              <div className="h-14 bg-amber-100/95 flex flex-col items-center justify-center text-[9px] text-amber-900/80 font-bold border-b border-amber-200/40 relative">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_45%,#e11d48_50%,transparent_55%)] bg-[size:10px_10px] opacity-20" />
                🍜 Silky Vermicelli (Sev)
              </div>

              {/* Layer 2: Basil Seeds / Sabja */}
              <div className="h-14 bg-stone-900 flex flex-col items-center justify-center text-[9px] text-stone-200 font-mono relative border-b border-stone-800">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_15%,transparent_20%)] bg-[size:6px_6px] opacity-40 animate-pulse" />
                ⚫ Chilled Basil Seeds (Sabja)
              </div>

              {/* Layer 1: Rose Syrup Base (Bottom) */}
              <div className="h-14 bg-gradient-to-t from-rose-600 to-pink-500 flex items-center justify-center text-xs text-white font-serif italic">
                🌹 Rose Syrup Base
              </div>
            </div>

            {/* Stem & Base of Glass */}
            <div className="w-12 h-6 bg-pink-100/50 mx-auto" />
            <div className="w-24 h-3 bg-pink-200/60 rounded-full mx-auto shadow-md" />

            {/* Price Tag Overlay */}
            <div className="absolute bottom-10 right-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white px-4 py-1.5 rounded-full font-mono font-extrabold text-sm shadow-lg ring-4 ring-white flex items-center gap-1">
              <span>SPECIAL</span>
              <span className="text-yellow-100">₹150/-</span>
            </div>

            <p className="mt-6 text-xs text-stone-500 font-mono text-center">
              Featured: The Magnificent <span className="text-pink-600">Bahubali Falooda</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
