/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  Bike, 
  Check, 
  Package, 
  MapPin, 
  Calendar, 
  HelpCircle, 
  ArrowRight, 
  History, 
  ChevronDown,
  ChevronUp,
  Sparkles, 
  ShoppingBag,
  Info
} from 'lucide-react';
import { Order } from '../types';

interface TrackingSectionProps {
  orders: Order[];
  currentUserPhone?: string | null;
}

export const TrackingSection: React.FC<TrackingSectionProps> = ({ orders, currentUserPhone }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrders, setSearchedOrders] = useState<Order[] | null>(null);
  const [localOrderIds, setLocalOrderIds] = useState<string[]>([]);
  const [localLastPhone, setLocalLastPhone] = useState<string>('');
  const [showSearchBox, setShowSearchBox] = useState(false);
  
  // Track which orders are expanded
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  // Clean phone helper
  const cleanPhone = (ph: string) => ph.replace(/\D/g, '');

  // Load guest order details from localStorage on mount & when orders change
  useEffect(() => {
    try {
      const storedLastPhone = localStorage.getItem('ak_enjoy_falooda_last_customer_phone') || '';
      setLocalLastPhone(storedLastPhone);

      const storedIdsRaw = localStorage.getItem('ak_enjoy_falooda_my_order_ids');
      if (storedIdsRaw) {
        const parsed = JSON.parse(storedIdsRaw);
        if (Array.isArray(parsed)) {
          setLocalOrderIds(parsed);
          
          // Auto-expand newly placed orders or active orders by default
          const initialExpanded: Record<string, boolean> = {};
          parsed.forEach((id) => {
            initialExpanded[id] = true;
          });
          setExpandedOrders(prev => ({ ...initialExpanded, ...prev }));
        }
      }
    } catch (e) {
      console.error("Failed to parse local storage order tracking keys", e);
    }
  }, [orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (!query) return;

    // Search by order ID exactly, or by phone number
    const found = orders.filter(
      (order) =>
        order.id.toUpperCase() === query ||
        cleanPhone(order.customerPhone) === cleanPhone(query) ||
        order.customerPhone.includes(query)
    );

    setSearchedOrders(found);

    // Auto-expand all searched orders
    if (found.length > 0) {
      const expanded: Record<string, boolean> = {};
      found.forEach(o => {
        expanded[o.id] = true;
      });
      setExpandedOrders(prev => ({ ...prev, ...expanded }));
    }
  };

  // Determine standard orders for this user/device
  const getAutoDetectedOrders = () => {
    const cleanedUserPhone = currentUserPhone ? cleanPhone(currentUserPhone) : '';
    const cleanedGuestPhone = localLastPhone ? cleanPhone(localLastPhone) : '';

    return orders.filter((order) => {
      const orderPhoneClean = cleanPhone(order.customerPhone);
      
      // Match by logged-in user phone
      if (cleanedUserPhone && orderPhoneClean === cleanedUserPhone) {
        return true;
      }
      // Match by guest checkout phone saved on this device
      if (cleanedGuestPhone && orderPhoneClean === cleanedGuestPhone) {
        return true;
      }
      // Match by order ID saved on this device
      if (localOrderIds.includes(order.id)) {
        return true;
      }
      return false;
    });
  };

  const autoOrders = getAutoDetectedOrders();
  const displayOrders = searchedOrders !== null ? searchedOrders : autoOrders;

  // Set default expansions for active orders on first load
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = { ...expandedOrders };
    let hasChanges = false;
    
    displayOrders.forEach((o) => {
      const isActive = o.status !== 'Delivered' && o.status !== 'Cancelled';
      if (isActive && initialExpanded[o.id] === undefined) {
        initialExpanded[o.id] = true;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setExpandedOrders(initialExpanded);
    }
  }, [displayOrders]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Categorize orders into Active and Previous
  const activeOrders = displayOrders.filter(
    (o) => o.status !== 'Delivered' && o.status !== 'Cancelled'
  );
  const previousOrders = displayOrders.filter(
    (o) => o.status === 'Delivered' || o.status === 'Cancelled'
  );

  // Status mapping to progress steps
  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 0;
      case 'Confirmed':
        return 1;
      case 'Preparing':
        return 2;
      case 'Out for Delivery':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return -1; // Cancelled
    }
  };

  const steps = [
    { label: 'Pending', desc: 'Awaiting Advance', emoji: '⏳' },
    { label: 'Confirmed', desc: 'Payment Verified', emoji: '✅' },
    { label: 'Preparing', desc: 'Crafting Desserts', emoji: '🧑‍🍳' },
    { label: 'Out for Delivery', desc: 'Rider on the Way', emoji: '🛵' },
    { label: 'Delivered', desc: 'Enjoy your Falooda!', emoji: '🎉' },
  ];

  // Render collapsible order card details
  const renderOrderCard = (order: Order, isPast: boolean) => {
    const isExpanded = !!expandedOrders[order.id];
    const currentStepIdx = getStatusStep(order.status);
    const isCancelled = order.status === 'Cancelled';

    // Summary of items text
    const itemsSummary = order.items.map(i => `${i.name} (x${i.quantity})`).join(', ');

    return (
      <div
        key={order.id}
        className="bg-white rounded-3xl border border-pink-100 shadow-lg shadow-pink-100/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-pink-200/60"
      >
        {/* Clickable Header */}
        <div 
          onClick={() => toggleExpand(order.id)}
          className="bg-stone-50/70 hover:bg-stone-50/100 px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none transition-colors duration-200 border-b border-stone-100"
        >
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono font-extrabold text-stone-900 text-sm">{order.id}</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                isCancelled
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : order.status === 'Delivered'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse'
              }`}>
                ● {order.status}
              </span>
              
              {/* Items summary preview (hidden when expanded) */}
              {!isExpanded && (
                <span className="text-stone-400 text-[11px] truncate max-w-[200px] sm:max-w-[300px] font-medium hidden sm:inline">
                  | {itemsSummary}
                </span>
              )}
            </div>
            
            <p className="text-[11px] text-stone-400 flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5" /> {order.date} at {order.time}
            </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-stone-100 pt-3 md:pt-0 shrink-0">
            <div className="flex gap-4 items-center">
              <div className="bg-pink-50/60 border border-pink-100/40 rounded-xl px-3 py-1.5 text-right flex flex-col items-end">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                  Total Paid
                </span>
                <span className="font-mono font-extrabold text-stone-900 text-xs mt-0.5">
                  ₹{order.subtotal}/-
                </span>
              </div>

              {!isCancelled && (
                <div className="bg-pink-50/50 border border-pink-100/50 rounded-xl px-3 py-1.5 text-right flex flex-col items-end">
                  <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                    {order.status === 'Delivered' ? 'Delivery' : 'Estimate'}
                  </span>
                  <span className="font-display font-extrabold text-pink-600 text-xs flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" /> 
                    {order.status === 'Delivered' ? 'Completed' : (order.estimatedDeliveryTime || '35 mins')}
                  </span>
                </div>
              )}
            </div>

            {/* Toggle Arrow Indicator */}
            <button
              type="button"
              className={`w-8 h-8 rounded-full bg-white border border-stone-150 flex items-center justify-center text-stone-500 hover:text-pink-600 hover:border-pink-200 shadow-sm transition-transform duration-300 shrink-0 ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              }`}
            >
              <ChevronDown className="w-4 h-4 transition-colors" />
            </button>
          </div>
        </div>

        {/* Collapsible Content Area */}
        {isExpanded && (
          <div className="p-6 sm:p-8 space-y-8 border-t border-stone-50 animate-fadeIn">
            
            {/* Graphical Timeline Step Status */}
            {!isCancelled ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Live Tracking Status Timeline
                  </h4>
                  <span className="text-[10px] font-mono text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-md">
                    Step {currentStepIdx >= 0 ? currentStepIdx + 1 : 0} of 5
                  </span>
                </div>

                {/* Desktop Timeline */}
                <div className="hidden md:grid grid-cols-5 relative pt-4 pb-2">
                  {/* Background connection line */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-100 -translate-y-1/2 z-0 rounded-full" />
                  {/* Foreground progress line */}
                  <div
                    className="absolute top-1/2 left-0 h-1 bg-pink-500 -translate-y-1/2 z-0 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.max(0, (currentStepIdx / 4) * 100)}%` }}
                  />

                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isActive = idx === currentStepIdx;

                    return (
                      <div key={idx} className="flex flex-col items-center text-center z-10 relative">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow transition-all duration-500 ${
                            isActive
                              ? 'bg-pink-600 text-white ring-4 ring-pink-100 animate-bounce'
                              : isCompleted
                              ? 'bg-pink-600 text-white ring-4 ring-pink-100'
                              : 'bg-white border border-stone-200 text-stone-400'
                          }`}
                        >
                          {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : step.emoji}
                        </div>
                        <span className={`text-[11px] font-bold mt-2.5 ${
                          isActive ? 'text-pink-600 animate-pulse' : isCompleted ? 'text-stone-800' : 'text-stone-400'
                        }`}>
                          {step.label}
                        </span>
                        <span className="text-[9px] text-stone-400 leading-none mt-0.5 font-medium max-w-[100px]">
                          {step.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile vertical timeline */}
                <div className="md:hidden space-y-5 pl-2">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIdx;
                    const isActive = idx === currentStepIdx;

                    return (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow shrink-0 ${
                              isCompleted
                                ? 'bg-pink-600 text-white ring-4 ring-pink-100'
                                : 'bg-white border border-stone-200 text-stone-400'
                            }`}
                          >
                            {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.emoji}
                          </div>
                          {idx < steps.length - 1 && (
                            <div className={`w-0.5 h-10 my-1 ${
                              idx < currentStepIdx ? 'bg-pink-500' : 'bg-stone-100'
                            }`} />
                          )}
                        </div>
                        <div className="pt-0.5 flex flex-col justify-center">
                          <span className={`text-xs font-bold leading-tight ${
                            isActive ? 'text-pink-600 font-extrabold' : isCompleted ? 'text-stone-800 font-semibold' : 'text-stone-400'
                          }`}>
                            {step.label} {isActive && '⚡'}
                          </span>
                          <span className="text-[10px] text-stone-400 leading-tight">
                            {step.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3 text-rose-700">
                <span className="text-2xl shrink-0">⚠️</span>
                <div className="text-xs leading-relaxed">
                  <h4 className="font-extrabold uppercase tracking-wide">This Order Has Been Cancelled</h4>
                  <p className="text-rose-500 mt-0.5 font-medium">Please contact our support hotline (+91 99855 45454) for any queries or refund status.</p>
                </div>
              </div>
            )}

            {/* Delivery Boy Details */}
            {order.deliveryBoyName && !isCancelled && (
              <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-lg shrink-0">
                    🛵
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-stone-800 text-xs">Allotted Delivery Rider</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      <strong className="text-stone-700 font-bold">{order.deliveryBoyName}</strong> is heading your way!
                    </p>
                  </div>
                </div>
                <a
                  href={`tel:+919985545454`}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl shadow cursor-pointer transition-colors shrink-0"
                >
                  Contact Rider
                </a>
              </div>
            )}

            {/* Items & Bill calculation details */}
            <div className="border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-stone-50 px-4 py-3 border-b border-stone-100 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-stone-400" />
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  Items Ordered
                </span>
              </div>
              <div className="p-4 space-y-3.5 divide-y divide-stone-50">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs pt-3.5 first:pt-0">
                    <div>
                      <p className="font-bold text-stone-800">
                        {item.name} <span className="text-pink-600 font-normal">x{item.quantity}</span>
                      </p>
                      {item.customizations && (
                        <p className="text-[10px] text-pink-500/80 font-mono mt-0.5 italic leading-normal">
                          ✨ {item.customizations}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-stone-600 font-bold">₹{item.price * item.quantity}/-</span>
                  </div>
                ))}

                <div className="pt-3.5 space-y-1.5 text-xs">
                  <p className="flex justify-between text-stone-500 font-medium">
                    <span>Subtotal Amount:</span>
                    <span className="font-mono">₹{order.subtotal}/-</span>
                  </p>
                  <p className="flex justify-between text-emerald-600 font-bold">
                    <span>Advance Paid (Verified):</span>
                    <span className="font-mono">-₹{order.advancePaid}/-</span>
                  </p>
                  <p className="flex justify-between text-stone-800 font-extrabold text-sm pt-2 border-t border-dashed border-stone-200">
                    <span>Balance COD Amount:</span>
                    <span className="font-mono text-pink-600">₹{order.codBalance}/-</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Address Block */}
            <div className="flex gap-2.5 text-stone-600 text-xs bg-stone-50/50 p-4 rounded-2xl border border-stone-100">
              <MapPin className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-800 block mb-0.5 font-bold">Delivery Destination Address:</strong>
                <span className="text-stone-500 leading-relaxed font-medium">{order.customerAddress}</span>
              </div>
            </div>

            {/* Support / Quick Reorder links */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-2 gap-4 border-t border-stone-100">
              <a
                href={`https://wa.me/919985545454?text=${encodeURIComponent(`Hi, checking on order status: ${order.id}.`)}`}
                target="_blank"
                rel="noreferrer referrer"
                className="inline-flex items-center gap-1.5 text-stone-500 hover:text-pink-600 text-xs font-bold uppercase tracking-wider transition-all"
              >
                <HelpCircle className="w-4 h-4" /> Need Help? Chat with support
              </a>

              {isPast && (
                <a
                  href={`https://wa.me/919985545454?text=${encodeURIComponent(`Hi, I would like to re-order items from past Invoice: ${order.id}.`)}`}
                  target="_blank"
                  rel="noreferrer referrer"
                  className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4" /> Re-Order This Falooda
                </a>
              )}
            </div>

          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-pink-50/10 border-t border-pink-100" id="tracking">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Title Block */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100/60 border border-pink-200/50 text-pink-600 text-[10px] font-bold uppercase tracking-wider">
            🛵 Live Status Track
          </div>
          <h2 className="font-display font-extrabold text-stone-900 text-3xl sm:text-4xl tracking-tight">
            Track Your <span className="text-pink-600">Royal Order</span>
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Real-time status tracking for your delicious faloodas. View active status updates, estimated arrival times, and past order history with our interactive tracking cards.
          </p>
        </div>

        {/* Search Collapsible Trigger (only if there are auto orders) */}
        {autoOrders.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowSearchBox(!showSearchBox)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-50 text-stone-700 hover:text-pink-600 rounded-full border border-stone-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Search className="w-4 h-4" />
              {showSearchBox ? 'Hide Lookup Form' : 'Track another phone / Invoice ID'}
            </button>
          </div>
        )}

        {/* Search Lookup Form (shown if no orders auto-detected, or when user toggles) */}
        {(autoOrders.length === 0 || showSearchBox || searchedOrders !== null) && (
          <div className="bg-white rounded-3xl border border-pink-100 shadow-xl shadow-pink-100/20 p-6 sm:p-8 animate-fadeIn">
            <div className="mb-4">
              <h3 className="font-display font-bold text-stone-800 text-sm flex items-center gap-2">
                <span>🔎</span> Track Order Manually
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Don't see your order below? Search using the phone number entered at checkout or the Invoice number.
              </p>
            </div>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter 10-digit Phone or Invoice ID (e.g. INV-123456)..."
                  className="w-full bg-stone-50 text-stone-900 pl-11 pr-4 py-3.5 rounded-2xl border border-stone-200 text-xs sm:text-sm focus:border-pink-500/40 focus:bg-white focus:outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 bg-pink-600 hover:bg-pink-700 active:scale-98 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-pink-600/15 cursor-pointer transition-all flex items-center justify-center gap-2 shrink-0"
              >
                Find Order
              </button>
            </form>

            {searchedOrders !== null && (
              <div className="mt-3 flex justify-between items-center">
                <p className="text-[10px] text-pink-600 font-bold">
                  Showing search results for "{searchQuery}"
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchedOrders(null);
                  }}
                  className="text-stone-400 hover:text-pink-600 text-[10px] font-extrabold uppercase tracking-wider transition-colors"
                >
                  Back to Device History
                </button>
              </div>
            )}
          </div>
        )}

        {/* Live Active Order Status Tracker */}
        {activeOrders.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 pl-1">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h3 className="font-display font-extrabold text-stone-900 text-sm uppercase tracking-wider">
                Current Active Orders ({activeOrders.length})
              </h3>
            </div>

            <div className="space-y-6">
              {activeOrders.map((order) => renderOrderCard(order, false))}
            </div>
          </div>
        )}

        {/* Previous / Past Orders History List */}
        {previousOrders.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 pl-1">
              <History className="w-4 h-4 text-stone-500" />
              <h3 className="font-display font-extrabold text-stone-800 text-sm uppercase tracking-wider">
                Past Order History ({previousOrders.length})
              </h3>
            </div>

            <div className="space-y-6">
              {previousOrders.map((order) => renderOrderCard(order, true))}
            </div>
          </div>
        )}

        {/* Empty State: No active or previous orders found at all */}
        {activeOrders.length === 0 && previousOrders.length === 0 && (
          <div className="bg-white rounded-3xl border border-pink-100 p-10 text-center space-y-5 shadow-xl shadow-pink-100/10">
            <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto text-2xl animate-pulse">
              🍨
            </div>
            <div className="space-y-1.5">
              <h4 className="font-display font-extrabold text-stone-800 text-lg">No Orders Detected Yet</h4>
              <p className="text-stone-500 text-xs max-w-sm mx-auto leading-relaxed">
                We couldn't detect any active or past orders for this session. Explore our royal dessert menu and submit your first order!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('menu');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-pink-600/15 transition-all cursor-pointer"
              >
                Browse Our Menu
              </button>
              
              {/* Manual search toggle button */}
              {!showSearchBox && (
                <button
                  type="button"
                  onClick={() => setShowSearchBox(true)}
                  className="px-5 py-3 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs uppercase tracking-wider rounded-2xl border border-stone-200 transition-all cursor-pointer"
                >
                  Lookup Manually
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
