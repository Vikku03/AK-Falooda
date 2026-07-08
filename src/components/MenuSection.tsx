/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MenuItem } from '../types';
import { Search, SlidersHorizontal, Sparkles, Heart, HelpCircle, Plus } from 'lucide-react';

interface MenuSectionProps {
  onAddToOrder: (item: MenuItem) => void;
  menuItems: MenuItem[];
}

type CategoryFilter = 'all' | 'falooda' | 'icecream' | 'beverages';

export const MenuSection: React.FC<MenuSectionProps> = ({ onAddToOrder, menuItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [maxPrice, setMaxPrice] = useState<number>(180);
  const [showFilters, setShowFilters] = useState(false);

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesPrice = item.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [menuItems, searchTerm, activeCategory, maxPrice]);

  const categories: { id: CategoryFilter; label: string; count: number }[] = useMemo(() => {
    const counts = menuItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { id: 'all', label: 'All Delights', count: menuItems.length },
      { id: 'falooda', label: 'Royal Faloodas', count: counts['falooda'] || 0 },
      { id: 'icecream', label: 'Creamy Ice Creams', count: counts['icecream'] || 0 },
      { id: 'beverages', label: 'Beverages & Lassis', count: counts['beverages'] || 0 },
    ];
  }, [menuItems]);

  return (
    <section id="menu" className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-pink-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-pink-600 font-mono text-xs uppercase tracking-widest font-bold">The AK Enjoy Royal Menu</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
            Explore Our Sweet Masterpieces
          </h2>
          <p className="text-stone-600 mt-4 text-sm sm:text-base">
            Every cup is loaded with high-quality ingredients, fresh dairy creams, and pure extracts. Select your favorites below to build your customized dessert tray!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-yellow-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Search and Quick Filters Bar */}
        <div className="bg-pink-50/50 p-4 sm:p-6 rounded-2xl border border-pink-100 backdrop-blur-md mb-10">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search faloodas, badam milk, ice creams..."
                className="w-full bg-white text-stone-800 pl-10 pr-4 py-3 rounded-xl border border-pink-100 focus:border-pink-500/50 focus:outline-none transition-colors text-sm"
                id="menu-search-input"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-stone-800"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Toggle & Price Slider */}
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                  showFilters 
                    ? 'bg-pink-500/10 border-pink-300 text-pink-600' 
                    : 'bg-white border-pink-100 text-stone-700 hover:bg-pink-50'
                }`}
                id="menu-filter-toggle-btn"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Budget & Settings
              </button>
            </div>
          </div>

          {/* Collapsible Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-pink-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              <div>
                <label className="flex justify-between text-xs text-stone-600 uppercase tracking-wider font-semibold mb-2">
                  <span>Maximum Price (Budget)</span>
                  <span className="text-pink-600 font-mono font-bold">₹{maxPrice}/-</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="180"
                  step="5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  id="menu-price-slider"
                />
                <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-1">
                  <span>₹10/- (Butter Milk)</span>
                  <span>₹180/- (Family Pack)</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs text-stone-600">100% Pure Vegetarian</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-pink-500/20 border border-pink-500/50 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  </div>
                  <span className="text-xs text-stone-600">Dairy Specials</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2.5 justify-center md:justify-start mb-8 border-b border-pink-100 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 relative cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/10'
                  : 'bg-white text-stone-600 hover:text-pink-600 border border-pink-100'
              }`}
              id={`category-tab-${cat.id}`}
            >
              <span className="flex items-center gap-2">
                {cat.label}
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-pink-50 text-pink-600 font-bold'
                }`}>
                  {cat.count}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-pink-50/10 rounded-2xl border border-dashed border-pink-200">
            <HelpCircle className="w-10 h-10 text-stone-400 mx-auto mb-4" />
            <h3 className="text-stone-700 font-display font-semibold">No tasty items found</h3>
            <p className="text-stone-500 text-sm mt-2">Try adjusting your search keywords or increasing the budget slider.</p>
            <button 
              onClick={() => { setSearchTerm(''); setMaxPrice(180); setActiveCategory('all'); }}
              className="mt-4 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg text-xs hover:bg-pink-200 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isBahubali = item.id === 'f-bahubali';
              return (
                <div
                  key={item.id}
                  id={`menu-item-${item.id}`}
                  className={`relative overflow-hidden rounded-2xl transition-all duration-300 hover:translate-y-[-4px] flex flex-col justify-between ${
                    isBahubali 
                      ? 'bg-gradient-to-br from-yellow-50 via-pink-50 to-rose-50 border-2 border-yellow-400 shadow-lg col-span-1 md:col-span-2 lg:col-span-3 lg:grid lg:grid-cols-3 lg:gap-6 lg:items-center p-6 text-stone-900'
                      : 'bg-white hover:bg-pink-50/10 border border-pink-100 hover:border-pink-300 p-0 shadow-sm hover:shadow-md text-stone-900'
                  }`}
                >
                  {/* Glowing Premium Highlight for special items */}
                  {item.isSpecial && !isBahubali && (
                    <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none z-10">
                      <div className="absolute top-2 right-[-24px] rotate-45 bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-mono text-[9px] font-bold py-1 w-24 text-center tracking-widest uppercase shadow">
                        Specials
                      </div>
                    </div>
                  )}

                  {isBahubali ? (
                    <>
                      {/* Bahubali Left Column: Image */}
                      <div className="lg:col-span-1 h-56 sm:h-64 lg:h-48 w-full overflow-hidden rounded-xl bg-stone-100 flex-shrink-0 mb-4 lg:mb-0 relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
                            item.isOutOfStock ? 'grayscale opacity-60' : ''
                          }`}
                          referrerPolicy="no-referrer"
                        />
                        {item.isOutOfStock && (
                          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="bg-rose-600 text-white font-mono text-xs font-extrabold uppercase px-3 py-1.5 rounded-lg tracking-widest shadow-md">
                              Not Available
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Bahubali Center Column: Details */}
                      <div className="lg:col-span-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            {/* 100% Vegetarian Green Badge */}
                            <div className="w-4 h-4 border border-emerald-500 flex items-center justify-center rounded bg-white flex-shrink-0" title="100% Pure Vegetarian">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            </div>
                            <h3 className="font-display font-extrabold text-stone-900 text-2xl text-pink-700">
                              {item.name}
                            </h3>
                          </div>
                          
                          {/* Price Display */}
                          <span className="text-pink-600 font-mono font-bold text-lg flex-shrink-0">
                            ₹{item.price}/-
                          </span>
                        </div>

                        <p className="text-stone-600 leading-relaxed font-sans mb-4 text-sm sm:text-base">
                          {item.description}
                        </p>

                        {/* Tags & Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-100 border border-yellow-300 text-[10px] font-bold text-yellow-800 uppercase tracking-widest animate-pulse">
                            <Sparkles className="w-3 h-3" /> Signature Star
                          </span>
                          {item.isPopular && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-100 border border-pink-200 text-[10px] font-semibold text-pink-600">
                              Popular Choice
                            </span>
                          )}
                          {item.tags?.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] border border-stone-200/50">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bahubali Right Column: Actions */}
                      <div className="lg:col-span-1 lg:border-l lg:border-pink-200 lg:pl-6 lg:h-full lg:flex lg:flex-col lg:justify-center">
                        <div className="hidden lg:block text-stone-600 text-xs mb-4 leading-relaxed font-sans">
                          Our crown jewel dessert contains layered rose vermicelli, basil seeds, luxury dry nuts, fresh cream, and traditional saffron essence. Ideal for the true dessert connoisseur.
                        </div>
                        <button
                          onClick={() => !item.isOutOfStock && onAddToOrder(item)}
                          disabled={item.isOutOfStock}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 ${
                            item.isOutOfStock
                              ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
                              : 'cursor-pointer bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-300 hover:to-pink-600 text-pink-950 shadow shadow-pink-500/10'
                          }`}
                          id={`add-btn-${item.id}`}
                        >
                          <Plus className="w-4 h-4" />
                          {item.isOutOfStock ? 'Not Available' : 'Add Signature Feast'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Standard Item Top Image */}
                      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-stone-100 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-105 ${
                            item.isOutOfStock ? 'grayscale opacity-60' : ''
                          }`}
                          referrerPolicy="no-referrer"
                        />
                        {item.isOutOfStock && (
                          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="bg-rose-600 text-white font-mono text-xs font-extrabold uppercase px-3 py-1.5 rounded-lg tracking-widest shadow-md">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Standard Item Text Details & Action Button with Padding */}
                      <div className="p-5 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2">
                              {/* 100% Vegetarian Green Badge */}
                              <div className="w-4 h-4 border border-emerald-500 flex items-center justify-center rounded bg-white flex-shrink-0" title="100% Pure Vegetarian">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                              </div>
                              <h3 className="font-display font-extrabold text-stone-900 text-base sm:text-lg hover:text-pink-600 transition-colors">
                                {item.name}
                              </h3>
                            </div>
                            
                            {/* Price Display */}
                            <span className="text-pink-600 font-mono font-bold text-base sm:text-lg flex-shrink-0">
                              ₹{item.price}/-
                            </span>
                          </div>

                          <p className="text-stone-600 leading-relaxed font-sans mb-4 text-xs sm:text-sm">
                            {item.description}
                          </p>

                          {/* Tags & Badges */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {item.isPopular && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-100 border border-pink-200 text-[10px] font-semibold text-pink-600">
                                Popular Choice
                              </span>
                            )}
                            {item.tags?.map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] border border-stone-200/50">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="w-full pt-2">
                          <button
                            onClick={() => !item.isOutOfStock && onAddToOrder(item)}
                            disabled={item.isOutOfStock}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 ${
                              item.isOutOfStock
                                ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
                                : 'cursor-pointer bg-pink-50 hover:bg-pink-500 text-pink-600 hover:text-white border border-pink-100 hover:border-transparent'
                            }`}
                            id={`add-btn-${item.id}`}
                          >
                            <Plus className="w-4 h-4" />
                            {item.isOutOfStock ? 'Out of Stock' : 'Add to Tray'}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
