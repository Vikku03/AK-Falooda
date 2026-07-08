/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, User, MapPin, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (phone: string, role: 'admin' | 'staff' | 'delivery' | 'customer', name?: string, address?: string) => void;
  onClose: () => void;
  adminPhones: string[];
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onClose, adminPhones }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const cleanPhone = (val: string) => {
    return val.replace(/\D/g, '');
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = cleanPhone(phone);
    if (formattedPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Check if the phone is an Admin phone
    if (adminPhones.includes(formattedPhone) || formattedPhone === '9985545454') {
      onLoginSuccess(formattedPhone, 'admin', 'Admin');
    } else {
      // Check if the phone belongs to a registered Staff Member
      const savedStaffStr = localStorage.getItem('ak_enjoy_falooda_staff_members');
      const savedStaff = savedStaffStr ? JSON.parse(savedStaffStr) : [
        { id: 'ST01', name: 'Ramesh Naidu', phone: '9123456780', role: 'Order Manager', shift: 'Morning Shift', status: 'On Duty' },
        { id: 'ST02', name: 'Priya Sharma', phone: '9234567890', role: 'Dessert Maker', shift: 'Evening Shift', status: 'On Duty' }
      ];
      const matchedStaff = savedStaff.find((s: any) => cleanPhone(s.phone) === formattedPhone);

      if (matchedStaff) {
        onLoginSuccess(formattedPhone, 'staff', matchedStaff.name, matchedStaff.role);
        return;
      }

      // Check if the phone belongs to a registered Delivery Boy
      const savedDeliveryStr = localStorage.getItem('ak_enjoy_falooda_delivery_boys');
      const savedDelivery = savedDeliveryStr ? JSON.parse(savedDeliveryStr) : [
        { id: 'DB01', name: 'Rahul Kumar', phone: '9876543210', vehicle: 'AP39TX1234', status: 'Active' },
        { id: 'DB02', name: 'Suresh Rao', phone: '9988776655', vehicle: 'AP39TY5678', status: 'Active' }
      ];
      const matchedDelivery = savedDelivery.find((d: any) => cleanPhone(d.phone) === formattedPhone);

      if (matchedDelivery) {
        onLoginSuccess(formattedPhone, 'delivery', matchedDelivery.name, matchedDelivery.vehicle);
        return;
      }

      // Check if user is already saved as customer in localStorage
      const savedCustomersStr = localStorage.getItem('ak_enjoy_falooda_customers');
      const savedCustomers = savedCustomersStr ? JSON.parse(savedCustomersStr) : [];
      const existing = savedCustomers.find((c: any) => cleanPhone(c.phone) === formattedPhone);

      if (existing) {
        // Instant login
        onLoginSuccess(formattedPhone, 'customer', existing.name, existing.address);
      } else {
        // Ask for registration details for prefilling order tray
        setIsNewCustomer(true);
        setStep(2);
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = cleanPhone(phone);
    onLoginSuccess(formattedPhone, 'customer', name, address);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Black Translucent Overlay */}
      <div 
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Login Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-pink-100 shadow-2xl overflow-hidden z-10 animate-scaleIn">
        {/* Header Ribbon */}
        <div className="h-2 bg-gradient-to-r from-pink-500 via-yellow-400 to-rose-500 w-full" />
        
        {/* Close and Back Button Row */}
        <div className="p-4 flex items-center justify-between border-b border-pink-50/50">
          {step === 2 ? (
            <button 
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-pink-600 font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-rose-600 text-xs font-mono font-bold uppercase transition-colors cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-stone-50"
          >
            Cancel
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* Brand/Logo inside Login */}
          <div className="text-center mb-6">
            <div className="inline-flex w-12 h-12 rounded-xl bg-pink-100 text-pink-600 items-center justify-center font-black text-xl shadow-inner mb-3">
              AK
            </div>
            <h2 className="font-display font-extrabold text-stone-900 text-xl sm:text-2xl tracking-tight">
              AK Enjoy <span className="text-pink-600 font-normal italic">Falooda</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {step === 1 
                ? 'Enter your mobile number for instant login' 
                : 'Complete your profile for fast delivery prefilling'}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-stone-500 border-r border-stone-200 pr-2.5">
                    <span className="text-xs font-bold font-mono">+91</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder=""
                    maxLength={15}
                    className="w-full bg-stone-50 text-stone-900 pl-18 pr-4 py-3 rounded-xl border border-stone-200 focus:border-pink-500/50 focus:bg-white focus:outline-none text-base font-mono font-bold tracking-wide"
                    id="login-phone-input"
                  />
                </div>

              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/15 transition-all cursor-pointer hover:scale-[1.02]"
                id="login-submit-btn"
              >
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200/50 rounded-xl p-3 text-[11px] text-yellow-800 leading-relaxed mb-1 flex items-start gap-2">
                <span>✨</span>
                <div>
                  Welcome! This looks like your first time. Let us know your name and delivery address to save time on your orders.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vikranth"
                    className="w-full bg-stone-50 text-stone-900 pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-pink-500/50 focus:bg-white focus:outline-none text-sm font-semibold"
                    id="register-name-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Default Delivery Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="76-16-97, masjid road, urmilanagar"
                    className="w-full bg-stone-50 text-stone-900 pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-pink-500/50 focus:bg-white focus:outline-none text-sm resize-none"
                    id="register-address-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/15 transition-all cursor-pointer"
                id="register-submit-btn"
              >
                Register & Enter Store <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
