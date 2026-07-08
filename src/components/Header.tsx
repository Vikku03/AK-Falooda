/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Clock, Phone, Sparkles } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  currentUserPhone?: string | null;
  currentUserRole?: 'admin' | 'staff' | 'delivery' | 'customer' | null;
  currentUserName?: string | null;
  onOpenLogin?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  activeSection,
  onNavigate,
  currentUserPhone = null,
  currentUserRole = null,
  currentUserName = '',
  onOpenLogin,
  onLogout,
}) => {
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'builder', label: 'Design-A-Falooda' },
    { id: 'tracking', label: 'Track Order' },
    { id: 'feedback', label: 'Reviews & Ratings' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-pink-600 shadow-lg text-white">
      {/* Top Notification Bar - Announcement */}
      <div className="w-full bg-yellow-400 px-4 py-1.5 text-center text-xs font-bold text-pink-950 flex items-center justify-center gap-4">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> Open Daily: 05:00 PM - 12:00 PM
        </span>
        <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-pink-600 animate-pulse" />
        <span className="hidden md:flex items-center gap-1">
          <Phone className="w-3.5 h-3.5" /> Order Hotline: +91 99855 45454
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-2 cursor-pointer group"
          id="brand-logo"
        >
          <div className="relative w-10 h-10 rounded-xl bg-white flex items-center justify-center text-pink-600 shadow-md group-hover:scale-105 transition-transform">
            <span className="font-display font-black text-lg">AK</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg sm:text-xl text-white tracking-tight leading-none group-hover:text-yellow-200 transition-colors">
              AK Enjoy <span className="text-yellow-300 font-normal italic">Falooda</span>
            </h1>
            <p className="text-[10px] text-pink-200 font-mono tracking-widest uppercase">Indias Royal Treats</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`font-sans text-sm font-semibold transition-all duration-300 relative py-2 ${
                activeSection === item.id 
                  ? 'text-yellow-300' 
                  : 'text-pink-100 hover:text-yellow-200'
              }`}
              id={`nav-link-${item.id}`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-300 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Action Button & Shopping Cart */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('menu')}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-pink-950 bg-yellow-400 hover:bg-yellow-300 rounded-xl shadow transition-all duration-300"
            id="header-explore-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-700" />
            Explore Menu
          </button>

          {/* User Auth controls */}
          {currentUserPhone ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] text-pink-200 font-mono font-bold leading-none">Logged In As</span>
                <span className="text-xs font-bold text-yellow-300 truncate max-w-[120px] mt-0.5" title={currentUserName || currentUserPhone}>
                  {currentUserRole === 'admin' 
                    ? '👑 Admin' 
                    : currentUserRole === 'staff'
                    ? `🧑‍🍳 Staff: ${currentUserName}`
                    : currentUserRole === 'delivery'
                    ? `🛵 Rider: ${currentUserName}`
                    : (currentUserName || `+91 ${currentUserPhone}`)}
                </span>
              </div>
              {currentUserRole === 'admin' || currentUserRole === 'staff' || currentUserRole === 'delivery' ? (
                <button
                  onClick={() => onNavigate('admin_view_trigger_section')}
                  className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-white bg-pink-700 hover:bg-pink-800 rounded-xl border border-pink-500/40 transition-colors shadow-sm cursor-pointer"
                  id="header-admin-hub-btn"
                >
                  {currentUserRole === 'admin' ? 'Admin Hub' : (currentUserRole === 'staff' ? 'Staff Hub' : 'Delivery Hub')}
                </button>
              ) : (
                <button
                  onClick={onLogout}
                  className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-pink-100 hover:text-white hover:bg-pink-700 rounded-xl transition-all cursor-pointer border border-transparent hover:border-pink-500/20"
                  id="header-logout-btn"
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-pink-100 hover:text-yellow-200 hover:bg-pink-700 rounded-xl border border-pink-500/40 transition-all cursor-pointer"
              id="header-login-btn"
            >
              Sign In
            </button>
          )}

          {/* Glowing Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-xl bg-pink-700 hover:bg-pink-850 text-white border border-pink-500/30 transition-all duration-300 hover:scale-105 group"
            title="View Order Tray"
            id="order-tray-toggle"
          >
            <ShoppingBag className="w-5 h-5 group-hover:text-yellow-300 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-yellow-400 text-pink-950 rounded-full text-[10px] font-bold flex items-center justify-center ring-4 ring-pink-600 animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
