/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, MessageSquare, Quote, Heart, Send, Check } from 'lucide-react';

interface FeedbackItem {
  id: string;
  name: string;
  itemOrdered: string;
  rating: number;
  comments: string;
  date: string;
}

export const FeedbackSection: React.FC = () => {
  // Pre-seeded customer reviews to show dynamic content
  const [reviews, setReviews] = useState<FeedbackItem[]>([
    {
      id: 'rev-1',
      name: 'Arvind Kumar',
      itemOrdered: 'Bahubali Falooda',
      rating: 5,
      comments: 'The Bahubali Falooda is literally a masterpiece! Every single layer has a premium delicious surprise. Extremely rich, satisfying, and totally worth the price! 🍨✨',
      date: 'Today'
    },
    {
      id: 'rev-2',
      name: 'Sreeja Reddy',
      itemOrdered: 'Special Badam Palu',
      rating: 5,
      comments: 'Authentic Indian dessert taste. The thickness of the almond milk combined with saffron flavor is pure bliss. Will definitely order every weekend!',
      date: 'Yesterday'
    },
    {
      id: 'rev-3',
      name: 'Rahul K.',
      itemOrdered: 'Mango Falooda',
      rating: 4,
      comments: 'Superb quality and insanely fast delivery! Got my dessert tray within 20 minutes, ice cold and perfectly layered.',
      date: '2 days ago'
    }
  ]);

  // Form State
  const [name, setName] = useState('');
  const [itemOrdered, setItemOrdered] = useState('Bahubali Falooda');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comments, setComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comments) return;

    const newReview: FeedbackItem = {
      id: `rev-${Date.now()}`,
      name,
      itemOrdered,
      rating,
      comments,
      date: 'Just Now'
    };

    setReviews([newReview, ...reviews]);
    setIsSubmitted(true);

    // Reset Form
    setTimeout(() => {
      setName('');
      setComments('');
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section id="feedback" className="w-full bg-pink-50/10 py-16 px-4 sm:px-6 lg:px-8 border-b border-pink-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-pink-600 font-mono text-xs uppercase tracking-widest font-bold">Customer Corner</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
            Ratings & Sweet Stories
          </h2>
          <p className="text-stone-600 mt-4 text-sm sm:text-base">
            Your love keeps us crafting! Read real reviews from Hyderabad dessert connoisseurs, or leave your rating and help us improve.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-yellow-500 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Feedback Form */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-pink-100 shadow-sm">
            <h3 className="font-display font-extrabold text-stone-900 text-lg mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-pink-600" />
              Share Your Experience
            </h3>
            
            {isSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center space-y-3 animate-scaleIn">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-emerald-900 text-sm">Thank You for the Review!</h4>
                <p className="text-xs text-emerald-700">Your feedback has been published instantly below. We appreciate your valuable support!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-pink-50/20 text-stone-950 px-4 py-2.5 rounded-xl border border-pink-100 focus:border-pink-500/50 focus:outline-none text-sm"
                  />
                </div>

                {/* Dish Ordered */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                    Which Item Did You Enjoy?
                  </label>
                  <select
                    value={itemOrdered}
                    onChange={(e) => setItemOrdered(e.target.value)}
                    className="w-full bg-pink-50/20 text-stone-950 px-4 py-2.5 rounded-xl border border-pink-100 focus:border-pink-500/50 focus:outline-none text-sm"
                  >
                    <option value="Bahubali Falooda">Bahubali Falooda 🍨</option>
                    <option value="Dry Fruit Falooda">Dry Fruit Falooda 🌰</option>
                    <option value="Mango Falooda">Mango Falooda 🥭</option>
                    <option value="Gulabjam Falooda">Gulabjam Falooda 🍯</option>
                    <option value="Special Badam Palu">Special Badam Palu 🥛</option>
                    <option value="Dry Fruit Lassi">Dry Fruit Lassi 🥛</option>
                    <option value="Double Ice Cream">Double Ice Cream 🍦</option>
                  </select>
                </div>

                {/* Dynamic Star Selection */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                    Star Rating ({rating} Stars)
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const isHighlighted = hoverRating !== null 
                        ? starValue <= hoverRating 
                        : starValue <= rating;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star 
                            className={`w-6 h-6 transition-colors ${
                              isHighlighted 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-stone-300'
                            }`} 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Review comments */}
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                    Your Thoughts
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Tell us what you liked about our taste and fast service..."
                    className="w-full bg-pink-50/20 text-stone-950 px-4 py-2.5 rounded-xl border border-pink-100 focus:border-pink-500/50 focus:outline-none text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/10 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Live Review
                </button>
              </form>
            )}
          </div>

          {/* Right: Reviews List Showcase */}
          <div className="lg:col-span-7 space-y-4 max-h-[460px] overflow-y-auto pr-2">
            <h3 className="font-display font-extrabold text-stone-900 text-lg mb-2 flex items-center gap-2 sticky top-0 bg-pink-50/10 py-1 z-10">
              <Quote className="w-5 h-5 text-pink-600" />
              Recent Guest Testimonials
            </h3>

            {reviews.map((rev) => (
              <div 
                key={rev.id} 
                className="bg-white p-5 rounded-xl border border-pink-100 shadow-xs hover:border-pink-200 transition-all space-y-3"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-display font-bold text-stone-900 text-sm">{rev.name}</h4>
                    <p className="text-[10px] text-pink-600 font-mono mt-0.5">Ordered: {rev.itemOrdered}</p>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">{rev.date}</span>
                </div>

                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-stone-200'
                      }`} 
                    />
                  ))}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed italic font-sans">
                  "{rev.comments}"
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
