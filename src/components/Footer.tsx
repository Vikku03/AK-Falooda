/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MessageSquare, Mail, Phone, Heart, Star } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-pink-50/50 border-t border-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4 col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('hero')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
              AK
            </div>
            <span className="font-display font-extrabold text-base text-stone-900 tracking-tight">
              AK Enjoy <span className="text-pink-600 font-normal italic">Falooda</span>
            </span>
          </div>
          <p className="text-xs text-stone-600 max-w-sm leading-relaxed">
            Pioneering premium dessert experiences. From our royal signature Bahubali Falooda to our cardamom-infused badam milks, we commit to using pure ingredients and classic Indian recipes.
          </p>
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>Andhra Pradesh, India - Since 2020</span>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="text-stone-900 font-display font-bold text-xs uppercase tracking-wider mb-4">
            Navigations
          </h4>
          <ul className="space-y-2 text-xs text-stone-600">
            <li>
              <button onClick={() => onNavigate('hero')} className="hover:text-pink-600 transition-colors cursor-pointer">
                Home Portfolio
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('menu')} className="hover:text-pink-600 transition-colors cursor-pointer">
                Gourmet Menu
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('builder')} className="hover:text-pink-600 transition-colors cursor-pointer">
                Design-A-Falooda Lab
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('feedback')} className="hover:text-pink-600 transition-colors cursor-pointer">
                Reviews & Ratings
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="hover:text-pink-600 transition-colors cursor-pointer">
                Contact & Support
              </button>
            </li>
          </ul>
        </div>

        {/* Customer Helpdesk */}
        <div>
          <h4 className="text-stone-900 font-display font-bold text-xs uppercase tracking-wider mb-4">
            Direct Helpdesk
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-600 font-mono font-bold">
            <li className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <a 
                href="https://wa.me/919985545454" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-emerald-600 transition-colors"
              >
                +91 99855 45454
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-pink-500" />
              <a href="mailto:vikranthabv@gmail.com" className="hover:text-pink-600 transition-colors">
                vikranthabv@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-yellow-500" />
              <span>+91 99855 45454</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto h-px bg-pink-100 my-8" />

      {/* Copyright Disclaimer */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-xs text-center sm:text-left">
        <div>
          &copy; {new Date().getFullYear()} AK Enjoy Falooda. All rights reserved.
        </div>
        <div className="flex items-center gap-1">
          <span>Crafted with pure cream &</span>
          <Heart className="w-3.5 h-3.5 text-pink-600 fill-pink-600" />
          <span>in Andhra Pradesh, India.</span>
        </div>
      </div>
    </footer>
  );
};
