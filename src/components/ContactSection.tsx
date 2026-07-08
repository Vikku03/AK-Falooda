/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, Mail, Clock, MapPin, Send, MessageCircle, Heart } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Catering / Party Order Inquiry',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format message
    const emailBody = `Hello AK Enjoy Falooda Team,\n\nMy name is ${formData.name}.\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}\n\nSent from AK Enjoy Falooda Website.`;
    
    // Direct Mail Link to the user's email
    const mailUrl = `mailto:vikranthabv@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailUrl, '_blank');
  };

  const handleWhatsAppQuickChat = () => {
    const text = `Hi AK Enjoy Falooda! I'd like to ask a quick question about your menu and delivery services.`;
    window.open(`https://wa.me/919985545454?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="contact" className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-pink-600 font-mono text-xs uppercase tracking-widest font-bold">Get In Touch</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-stone-900 mt-2">
            We Value Your Sweet Feedback
          </h2>
          <p className="text-stone-600 mt-4 text-sm sm:text-base">
            Have a catering request, wedding party order, or simply want to say hello? Contact us directly via WhatsApp, email, or send a message using the form.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-yellow-500 mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Direct Helpline & Location Card */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="bg-pink-50/25 p-6 sm:p-8 rounded-2xl border border-pink-100 flex flex-col h-full justify-between space-y-6 shadow-sm">
              
              <div>
                <h3 className="font-display font-bold text-stone-900 text-lg sm:text-xl mb-4">
                  AK Enjoy Falooda HQ
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  Experience premium dessert craftsmanship. Feel free to reach out directly to our managers for prompt support.
                </p>
              </div>

              {/* Contact Channels list */}
              <div className="space-y-4">
                
                {/* Physical Location */}
                <div className="flex items-start gap-4 p-3 rounded-xl bg-white border border-pink-100 shadow-xs">
                  <div className="p-2.5 rounded-lg bg-pink-100 text-pink-700 mt-1">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Store Location</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      48-10-12/B2, Sevice Rd, Nagarjuna Nagar, currency nagar, Kanuru, Andhra Pradesh 520008
                    </p>
                  </div>
                </div>

                {/* WhatsApp Chat Support */}
                <div 
                  onClick={handleWhatsAppQuickChat}
                  className="flex items-start gap-4 p-3 rounded-xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-300 transition-all cursor-pointer group shadow-xs"
                >
                  <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 mt-1 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5 fill-emerald-500/10" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                      WhatsApp Live Chat
                      <span className="text-[9px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Fastest</span>
                    </h4>
                    <p className="text-xs text-emerald-700 font-mono font-bold mt-1">+91 99855 45454</p>
                    <p className="text-[10px] text-stone-500 mt-1">Click to instantly initiate a WhatsApp conversation</p>
                  </div>
                </div>

                {/* Email Support */}
                <a 
                  href="mailto:vikranthabv@gmail.com"
                  className="flex items-start gap-4 p-3 rounded-xl bg-white border border-pink-100 hover:border-pink-300 transition-all shadow-xs"
                >
                  <div className="p-2.5 rounded-lg bg-pink-100 text-pink-700 mt-1">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Email Support</h4>
                    <p className="text-xs text-pink-600 font-mono font-bold mt-1">vikranthabv@gmail.com</p>
                    <p className="text-[10px] text-stone-500 mt-1 font-sans">We usually respond to written inquiries within 12 hours.</p>
                  </div>
                </a>

                {/* Opening Hours */}
                <div className="flex items-start gap-4 p-3 rounded-xl bg-white border border-pink-100 shadow-xs">
                  <div className="p-2.5 rounded-lg bg-yellow-100 text-yellow-700 mt-1">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">Operating Hours</h4>
                    <p className="text-xs text-stone-600 mt-1">Open 7 days a week</p>
                    <p className="text-xs text-yellow-700 font-mono font-bold mt-0.5">05:00 PM - 12:00 PM (IST)</p>
                  </div>
                </div>

              </div>

              {/* Heart Disclaimer */}
              <div className="pt-4 border-t border-pink-100 text-center text-xs text-stone-500 flex items-center justify-center gap-1">
                <span>Made with</span>
                <Heart className="w-3.5 h-3.5 text-pink-600 fill-pink-600 animate-pulse" />
                <span>for AK Enjoy Falooda lovers.</span>
              </div>

            </div>
          </div>

          {/* Right Column: Custom Mail Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-pink-50/25 p-6 sm:p-8 rounded-2xl border border-pink-100 h-full flex flex-col justify-between shadow-sm">
              <div>
                <h3 className="font-display font-bold text-stone-900 text-lg sm:text-xl mb-2">
                  Send a Support or Party Request
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm mb-6 leading-relaxed">
                  Fill in your details and we will pre-format a direct email or WhatsApp message depending on your selection. Perfect for catering bookings or menu inquiries!
                </p>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-white text-stone-900 px-4 py-2.5 rounded-xl border border-pink-100 focus:border-pink-500/50 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-white text-stone-900 px-4 py-2.5 rounded-xl border border-pink-100 focus:border-pink-500/50 focus:outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full bg-white text-stone-900 px-4 py-2.5 rounded-xl border border-pink-100 focus:border-pink-500/50 focus:outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                        Inquiry Reason
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full bg-white text-stone-900 px-4 py-2.5 rounded-xl border border-pink-100 focus:border-pink-500/50 focus:outline-none text-sm"
                      >
                        <option value="Catering / Party Order Inquiry">Party / Catering Event</option>
                        <option value="General Store Inquiry">General Store Inquiry</option>
                        <option value="Feedback / Suggetions">Store Feedback</option>
                        <option value="Franchise Opportunity">Franchise Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please details what you would like to ask or custom order..."
                      className="w-full bg-white text-stone-900 px-4 py-2.5 rounded-xl border border-pink-100 focus:border-pink-500/50 focus:outline-none text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/10 transition-colors cursor-pointer"
                    id="contact-submit-btn"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit via Email Support
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
