/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Plus, Minus, Trash2, Send, MessageSquare, Sparkles, User, MapPin, Phone, FileText, Printer } from 'lucide-react';

interface OrderTrayProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onPlaceOrder?: (order: any) => void;
  defaultName?: string;
  defaultPhone?: string;
  defaultAddress?: string;
}

export const OrderTray: React.FC<OrderTrayProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  defaultName = '',
  defaultPhone = '',
  defaultAddress = '',
}) => {
  const [showPolicies, setShowPolicies] = useState(false);
  const [customerName, setCustomerName] = useState(defaultName);
  const [customerPhone, setCustomerPhone] = useState(defaultPhone);
  const [customerAddress, setCustomerAddress] = useState(defaultAddress);

  React.useEffect(() => {
    if (defaultName) setCustomerName(defaultName);
  }, [defaultName]);

  React.useEffect(() => {
    if (defaultPhone) setCustomerPhone(defaultPhone);
  }, [defaultPhone]);

  React.useEffect(() => {
    if (defaultAddress) setCustomerAddress(defaultAddress);
  }, [defaultAddress]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [invoiceNo, setInvoiceNo] = useState(() => 'INV-' + Math.floor(100000 + Math.random() * 900000));

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please allow location access in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('The request to get user location timed out.');
            break;
          default:
            setLocationError('An error occurred while retrieving location.');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  if (!isOpen) return null;

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.item.price * item.quantity), 0);
  const isMinimumMet = subtotal >= 100;

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Formatted Message Generator
  const generateOrderSummaryText = () => {
    let text = `*AK ENJOY FALOODA - NEW ORDER*\n`;
    text += `=================================\n`;
    text += `*Invoice No:* #${invoiceNo}\n`;
    text += `*Customer Name:* ${customerName || 'Guest Customer'}\n`;
    text += `*Phone:* ${customerPhone || 'Not Provided'}\n`;
    text += `*Delivery Address:* ${customerAddress || 'Not Provided'}\n`;
    if (latitude && longitude) {
      text += `*GPS Location Link:* https://www.google.com/maps?q=${latitude},${longitude}\n`;
    }
    text += `=================================\n\n`;
    
    text += `Hello! I would like to place an order. I am attaching my saved Digital Invoice PDF/Image file to this chat.\n\n`;
    text += `*PAYMENT STATUS DETAILS:*\n`;
    text += `- *Total Bill Amount:* Rs. ${subtotal}.00\n`;
    text += `- *Advance Payment:* Rs. 50.00 (Need to pay advance 50 rupees to confirm the order)\n`;
    text += `- *Remaining COD Balance on Delivery:* Rs. ${Math.max(0, subtotal - 50)}.00\n\n`;
    
    text += `Please find the attached invoice file above. Thank you!`;
    
    return encodeURIComponent(text);
  };

  const registerOrderInApp = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const orderObj = {
      id: invoiceNo,
      customerName: customerName || 'Guest Customer',
      customerPhone: customerPhone || 'Not Provided',
      customerAddress: customerAddress || 'Not Provided',
      latitude: latitude,
      longitude: longitude,
      items: cartItems.map(ci => ({
        name: ci.item.name,
        quantity: ci.quantity,
        price: ci.item.price,
        customizations: ci.customizations
      })),
      subtotal: subtotal,
      advancePaid: 50,
      codBalance: Math.max(0, subtotal - 50),
      status: 'Pending',
      date: dateStr,
      time: timeStr
    };

    if (onPlaceOrder) {
      onPlaceOrder(orderObj);
    }
    setInvoiceNo('INV-' + Math.floor(100000 + Math.random() * 900000));
  };

  const handleWhatsAppOrder = () => {
    if (!isMinimumMet) return;
    registerOrderInApp();
    const encodedText = generateOrderSummaryText();
    const whatsappUrl = `https://wa.me/919985545454?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailInquiry = () => {
    registerOrderInApp();
    const encodedText = generateOrderSummaryText();
    const mailUrl = `mailto:vikranthabv@gmail.com?subject=New Dessert Order - AK Enjoy Falooda&body=${encodedText}`;
    window.open(mailUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
      {/* Black Translucent Overlay */}
      <div 
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Cart Container Centered Modal */}
      <div className="relative w-full max-w-5xl max-h-[95vh] bg-white rounded-2xl border border-pink-100 shadow-2xl flex flex-col z-10 animate-scaleIn overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-pink-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-pink-100 text-pink-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-stone-900 text-base sm:text-lg">Your Dessert Tray</h2>
              <p className="text-[10px] text-stone-500 font-mono">AK ENJOY FALOODA SPECIALS</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {cartItems.length > 0 && (
              <button 
                onClick={onClearCart}
                className="text-[10px] font-mono font-bold text-stone-400 hover:text-rose-600 transition-colors cursor-pointer py-1 px-2 hover:bg-rose-50 rounded-lg"
              >
                Clear Tray
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 hover:text-pink-800 transition-colors cursor-pointer"
              id="close-order-tray-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0 bg-stone-50/20">
          {cartItems.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-pink-300">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-stone-800 font-display font-bold text-sm">Your tray is empty</h3>
              <p className="text-stone-500 text-xs max-w-xs">Explore our rich menus and add some delicious cooling Faloodas or Lassis to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Added Items List & Client Information Inputs */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* Section header */}
                <div className="space-y-3 bg-white p-4 rounded-xl border border-stone-150 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-extrabold text-stone-900 text-sm flex items-center gap-2">
                      🛒 Selected Delights ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
                    </h3>
                    <div className="bg-pink-50 border border-pink-100 rounded-lg px-2 py-0.5 text-pink-800 text-[10px] font-semibold flex items-center gap-1">
                      <span>⚡</span>
                      <span>30-Min Fast Delivery</span>
                    </div>
                  </div>

                  {/* Minimum Order Value Alert */}
                  {!isMinimumMet && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-amber-800 text-[11px] flex items-start gap-2 animate-pulse">
                      <span>⚠️</span>
                      <div>
                        <strong className="font-bold">Minimum order is ₹100 required.</strong>
                        <p className="mt-0.5 text-amber-700">Add ₹{100 - subtotal} more to place your order.</p>
                      </div>
                    </div>
                  )}

                  {/* List of items */}
                  <div className="space-y-2.5 max-h-[30vh] overflow-y-auto pr-1">
                    {cartItems.map((cartItem) => (
                      <div 
                        key={cartItem.item.id}
                        className="p-2 rounded-lg border border-stone-100 bg-stone-50/30 flex items-center gap-2.5"
                      >
                        <img 
                          src={cartItem.item.image} 
                          alt={cartItem.item.name} 
                          className="w-10 h-10 rounded-md object-cover bg-stone-100 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-bold text-stone-900 text-xs truncate">
                            {cartItem.item.name}
                          </h4>
                          <p className="text-[10px] text-stone-500 font-mono">
                            ₹{cartItem.item.price} × {cartItem.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                            className="p-1 rounded bg-pink-50 hover:bg-pink-100 text-pink-700 cursor-pointer"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-bold text-stone-900 w-4 text-center font-mono">{cartItem.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(cartItem.item.id, 1)}
                            className="p-1 rounded bg-pink-50 hover:bg-pink-100 text-pink-700 cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                          <button 
                            onClick={() => onRemoveItem(cartItem.item.id)}
                            className="text-stone-300 hover:text-pink-600 p-1 transition-colors cursor-pointer ml-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Billing & Shipping Details Form */}
                <div className="bg-white p-4 rounded-xl border border-stone-150 shadow-xs space-y-3">
                  <h3 className="font-display font-extrabold text-stone-900 text-sm flex items-center gap-1.5 border-b border-stone-100 pb-2">
                    <User className="w-4 h-4 text-pink-600" />
                    Delivery & Billing Info
                  </h3>
                  
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Customer Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Your full name (e.g. Vikranth)"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition-all placeholder:text-stone-300 font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">WhatsApp Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Contact phone (e.g. +91 99855 45454)"
                          className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition-all placeholder:text-stone-300 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Complete Delivery Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
                        <textarea
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="Apartment, Street name, Area, City (e.g. Jubilee Hills, Hyderabad)"
                          rows={2}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition-all placeholder:text-stone-300 font-sans resize-none"
                        />
                      </div>
                    </div>

                    {/* GPS Location Button & Status */}
                    <div className="pt-1">
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">GPS Delivery Location (Maps)</label>
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={isLocating}
                          className="text-[10px] text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1 cursor-pointer focus:outline-none bg-pink-50 hover:bg-pink-100 px-2.5 py-1 rounded-lg border border-pink-100 transition-colors"
                        >
                          <MapPin className="w-3 h-3 text-pink-600 animate-bounce" />
                          {isLocating ? 'Securing GPS...' : 'Get GPS Location'}
                        </button>
                      </div>
                      
                      <div className="p-2.5 rounded-lg border border-stone-150 bg-stone-50/50 flex flex-col gap-1">
                        {latitude && longitude ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              <span>GPS Coordinates Secured!</span>
                            </div>
                            <p className="text-[10px] font-mono text-stone-500 leading-none">
                              {latitude.toFixed(6)}, {longitude.toFixed(6)}
                            </p>
                            <a
                              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                            >
                              <span>🔗 View on Google Maps</span>
                            </a>
                          </div>
                        ) : (
                          <div className="text-[10px] text-stone-400 font-medium leading-normal">
                            {locationError ? (
                              <span className="text-rose-500 font-semibold">{locationError}</span>
                            ) : (
                              <span>Click "Get GPS Location" to share your live delivery location via Google Maps.</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ordering policies section */}
                <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 text-amber-900">
                  <button 
                    type="button"
                    onClick={() => setShowPolicies(!showPolicies)}
                    className="w-full flex items-center justify-between font-bold text-[10px] text-amber-950 hover:text-pink-600 transition-colors cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>🛡️</span>
                      <span>Ordering & Refund Policies</span>
                    </div>
                    <span className="text-[9px] font-mono font-normal text-stone-500 bg-white border border-stone-200 px-1.5 py-0.5 rounded-md">
                      {showPolicies ? '▲ Hide' : '▼ Expand'}
                    </span>
                  </button>
                  
                  {showPolicies && (
                    <ul className="list-disc pl-4 mt-2 space-y-1 text-[10px] text-amber-800 leading-normal font-sans animate-scaleIn">
                      <li><strong className="text-amber-950">Cash on Delivery (COD):</strong> Only COD is accepted for the balance amount.</li>
                      <li><strong className="text-amber-950">₹50 Advance:</strong> Must pay an advance of ₹50 via WhatsApp Pay to confirm the order.</li>
                      <li><strong className="text-amber-950">Cancellation:</strong> Refundable only if cancelled <strong className="text-amber-950">before the item is packed</strong>.</li>
                      <li><strong className="text-amber-950">No Return/Exchange:</strong> No return or exchange is accepted once delivered.</li>
                    </ul>
                  )}
                </div>

              </div>

              {/* Right Column: High Fidelity Invoice/Bill Preview & Quick Actions */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Print Stylesheet injection to print ONLY the invoice card */}
                <style>{`
                  @media print {
                    /* Hide everything in the body */
                    body * {
                      visibility: hidden !important;
                    }
                    /* Show only the invoice bill paper card and all its contents */
                    .print-invoice-bill, .print-invoice-bill * {
                      visibility: visible !important;
                    }
                    /* Reset position of the printable invoice container to top-left with no borders or shadows */
                    .print-invoice-bill {
                      position: absolute !important;
                      left: 0 !important;
                      top: 0 !important;
                      width: 100% !important;
                      margin: 0 !important;
                      padding: 24px !important;
                      border: none !important;
                      box-shadow: none !important;
                      background: white !important;
                    }
                  }
                `}</style>

                {/* Reference styled Invoice Paper with printable selector */}
                <div className="print-invoice-bill bg-white border border-stone-200/80 rounded-xl p-5 sm:p-6 shadow-md flex flex-col justify-between font-sans text-stone-800 text-xs relative overflow-hidden">
                  
                  {/* Subtle Invoice overlay stamp */}
                  <div className="absolute right-6 bottom-24 opacity-5 pointer-events-none select-none">
                    <FileText className="w-56 h-56 text-stone-900 rotate-12" />
                  </div>

                  {/* Header: Company & Title / Logo */}
                  <div className="flex justify-between items-start gap-4 pb-5 border-b border-stone-200/80">
                    <div>
                      <h1 className="text-xl font-extrabold tracking-tight text-stone-900 uppercase">Invoice</h1>
                      <div className="mt-2 space-y-0.5 text-[10px] text-stone-500 font-medium">
                        <p className="font-bold text-stone-800 text-[11px]">AK Enjoy Falooda</p>
                        <p>vikranthabv@gmail.com</p>
                        <p>Helpline: +91 99855 45454</p>
                        <p>Hyderabad, Telangana, India</p>
                      </div>
                    </div>
                    
                    {/* Logo styled exactly like the geometric triangle ARTGROUP logo in the image */}
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 text-stone-800 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
                          {/* Inner nested triangles matching the reference logo */}
                          <polygon points="50,15 15,75 85,75" />
                          <polygon points="50,30 28,70 72,70" />
                          <polygon points="50,45 41,65 59,65" />
                          {/* Horizontal dividing bars inside the triangle */}
                          <line x1="15" y1="75" x2="85" y2="75" />
                          {/* Geometric hatchings */}
                          <line x1="50" y1="15" x2="50" y2="75" />
                        </svg>
                      </div>
                      <span className="text-[8px] font-bold tracking-widest uppercase mt-1 text-stone-900 font-mono">AK FALOODA</span>
                    </div>
                  </div>

                  {/* Invoice Details: Bill To & Invoice Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-[10px] border-b border-stone-100 mb-2">
                    <div>
                      <h3 className="font-bold text-stone-400 uppercase tracking-wider mb-1.5 text-[9px]">Bill To:</h3>
                      <p className="font-semibold text-stone-800 text-xs">{customerName || 'Your Client / Guest'}</p>
                      {customerPhone && <p className="text-stone-500 mt-0.5">{customerPhone}</p>}
                      <p className="text-stone-500 mt-1 leading-relaxed max-w-[240px] whitespace-pre-wrap">{customerAddress || 'Please fill in address details'}</p>
                      {latitude && longitude && (
                        <div className="mt-2.5 p-2 bg-stone-50 rounded-lg border border-stone-150 text-[9px] text-stone-600 font-mono space-y-0.5">
                          <p className="font-bold text-stone-800 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 rounded-full bg-emerald-500" />
                            GPS Location Pin:
                          </p>
                          <p>{latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
                          <p className="text-blue-600 break-all select-all font-semibold">https://www.google.com/maps?q={latitude},{longitude}</p>
                        </div>
                      )}
                    </div>
                    <div className="sm:text-right space-y-1">
                      <p><span className="font-semibold text-stone-400">Invoice #:</span> <span className="font-mono text-stone-900 font-bold">{invoiceNo}</span></p>
                      <p><span className="font-semibold text-stone-400">Date:</span> <span className="text-stone-900">{formattedDate}</span></p>
                      <p><span className="font-semibold text-stone-400">Due Date:</span> <span className="text-stone-900">30 Mins (Immediate)</span></p>
                    </div>
                  </div>

                  {/* Table of items matching the exact design and headers of the reference image */}
                  <div className="overflow-x-auto my-2 border border-stone-200 rounded-lg">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-stone-50 text-stone-700 uppercase text-[9px] font-bold tracking-wider border-b border-stone-200">
                          <th className="py-2.5 px-3 text-center w-12">No.</th>
                          <th className="py-2.5 px-3">Description</th>
                          <th className="py-2.5 px-3 text-center w-20">Quantity</th>
                          <th className="py-2.5 px-3 text-right w-24">Unit Price</th>
                          <th className="py-2.5 px-3 text-right w-24">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {cartItems.map((cartItem, idx) => (
                          <tr key={cartItem.item.id} className="hover:bg-stone-50/50 text-[11px] text-stone-800 font-medium">
                            <td className="py-2.5 px-3 text-center font-mono text-stone-400">{idx + 1}</td>
                            <td className="py-2.5 px-3">
                              <span className="font-bold text-stone-900">{cartItem.item.name}</span>
                              {cartItem.customizations && (
                                <span className="block text-[9px] text-pink-600 font-mono font-medium mt-0.5">
                                  ({cartItem.customizations})
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold">{cartItem.quantity}</td>
                            <td className="py-2.5 px-3 text-right font-mono">₹{cartItem.item.price}.00</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">₹{cartItem.item.price * cartItem.quantity}.00</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Totals with Paid Advance & COD Balance */}
                  <div className="flex flex-col items-end gap-1.5 mt-4 text-[11px] border-t border-stone-100 pt-3">
                    <div className="flex justify-between w-64 text-stone-600">
                      <span>Sub Total:</span>
                      <span className="font-mono font-bold text-stone-900">₹{subtotal}.00</span>
                    </div>
                    <div className="flex justify-between w-64 text-pink-600 font-semibold">
                      <span>Required Advance Payment:</span>
                      <span className="font-mono font-bold">- ₹50.00</span>
                    </div>
                    <div className="flex justify-between w-64 text-emerald-700 font-bold border-b border-dashed border-stone-200 pb-1.5">
                      <span>Remaining Balance (COD):</span>
                      <span className="font-mono">₹{Math.max(0, subtotal - 50)}.00</span>
                    </div>
                    <div className="bg-stone-900 text-white rounded-xl py-2 px-4 flex justify-between items-center w-64 shadow-md transition-transform mt-2">
                      <span className="font-bold uppercase tracking-wider text-[9px]">Total Invoice:</span>
                      <span className="font-mono font-extrabold text-sm">₹{subtotal}.00</span>
                    </div>
                  </div>
                </div>

                {/* Send Buttons directly underneath the invoice layout */}
                <div className="space-y-2 pt-1 print:hidden">
                  {/* WhatsApp Order Action */}
                  <button
                    onClick={handleWhatsAppOrder}
                    disabled={!isMinimumMet}
                    className={`w-full py-3.5 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors ${
                      isMinimumMet 
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10 cursor-pointer animate-pulse' 
                        : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                    }`}
                    id="whatsapp-order-btn"
                  >
                    <MessageSquare className="w-4 h-4 fill-white/10" />
                    Send Bill & Order to WhatsApp
                  </button>

                  <div className="flex flex-col gap-2">
                    {/* Print / Save Bill Option */}
                    <button
                      onClick={() => window.print()}
                      className="py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-stone-800 transition-colors cursor-pointer w-full"
                      id="print-invoice-btn"
                    >
                      <Printer className="w-4 h-4" />
                      Print / Save Bill
                    </button>
                  </div>

                  <p className="text-[9px] text-stone-400 text-center font-mono leading-tight pt-1">
                    Your digital invoice is generated locally and sent directly to our WhatsApp service.
                  </p>
                </div>

              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

