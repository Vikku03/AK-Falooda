/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { CustomFaloodaBuilder } from './components/CustomFaloodaBuilder';
import { ContactSection } from './components/ContactSection';
import { FeedbackSection } from './components/FeedbackSection';
import { TrackingSection } from './components/TrackingSection';
import { OrderTray } from './components/OrderTray';
import { Footer } from './components/Footer';
import { MenuItem, CartItem, Order, AppUser, AdminAccount } from './types';
import { MENU_ITEMS } from './data/menu';
import { Login } from './components/Login';
import { AdminPanel } from './components/AdminPanel';
import { ShoppingBag, Star, Sparkles, X, ChevronRight, Check } from 'lucide-react';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeSection, setActiveSection] = useState('hero');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Auth & Profile Persistence States
  const [currentUserPhone, setCurrentUserPhone] = useState<string | null>(() => {
    return localStorage.getItem('ak_enjoy_falooda_user_phone');
  });
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'staff' | 'delivery' | 'customer' | null>(() => {
    return localStorage.getItem('ak_enjoy_falooda_user_role') as any;
  });
  const [currentUserName, setCurrentUserName] = useState<string>(() => {
    return localStorage.getItem('ak_enjoy_falooda_user_name') || '';
  });
  const [currentUserAddress, setCurrentUserAddress] = useState<string>(() => {
    return localStorage.getItem('ak_enjoy_falooda_user_address') || '';
  });
  const [currentView, setCurrentView] = useState<'store' | 'admin'>(() => {
    return (localStorage.getItem('ak_enjoy_falooda_current_view') as any) || 'store';
  });

  // Persistent Menu Items
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('ak_enjoy_falooda_menu');
    if (saved) {
      try { return JSON.parse(saved); } catch(e){}
    }
    return MENU_ITEMS;
  });

  // Persistent Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ak_enjoy_falooda_orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const uniqueOrders: Order[] = [];
          const seenIds = new Set<string>();
          for (const ord of parsed) {
            let item = { ...ord };
            if (seenIds.has(item.id)) {
              item.id = 'INV-' + Math.floor(100000 + Math.random() * 900000);
              while (seenIds.has(item.id)) {
                item.id = 'INV-' + Math.floor(100000 + Math.random() * 900000);
              }
            }
            seenIds.add(item.id);
            uniqueOrders.push(item);
          }
          return uniqueOrders;
        }
      } catch(e){}
    }
    return [];
  });

  // Persistent Customers
  const [customers, setCustomers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('ak_enjoy_falooda_customers');
    if (saved) {
      try { return JSON.parse(saved); } catch(e){}
    }
    return [
      {
        name: 'Vikranth',
        phone: '9985545454',
        address: '76-16-97, masjid road, urmilanagar',
        ordersCount: 1,
        lastOrderDate: 'Thursday, 2 July 2026'
      }
    ];
  });

  // Persistent Admin Accounts
  const [admins, setAdmins] = useState<AdminAccount[]>(() => {
    const saved = localStorage.getItem('ak_enjoy_falooda_admins');
    if (saved) {
      try { return JSON.parse(saved); } catch(e){}
    }
    return [
      {
        phone: '9985545454',
        name: 'Primary Admin',
        createdDate: 'Thursday, 2 July 2026'
      }
    ];
  });

  const updateMenuItems = (newItems: MenuItem[]) => {
    setMenuItems(newItems);
    localStorage.setItem('ak_enjoy_falooda_menu', JSON.stringify(newItems));
  };

  const updateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('ak_enjoy_falooda_orders', JSON.stringify(newOrders));
  };

  const updateCustomers = (newCustomers: AppUser[]) => {
    setCustomers(newCustomers);
    localStorage.setItem('ak_enjoy_falooda_customers', JSON.stringify(newCustomers));
  };

  const updateAdmins = (newAdmins: AdminAccount[]) => {
    setAdmins(newAdmins);
    localStorage.setItem('ak_enjoy_falooda_admins', JSON.stringify(newAdmins));
  };

  // Custom Premium Toast Notification System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showOrderConfirmedModal, setShowOrderConfirmedModal] = useState(false);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Auth Success Callback
  const handleLoginSuccess = (phone: string, role: 'admin' | 'staff' | 'delivery' | 'customer', name?: string, address?: string) => {
    setCurrentUserPhone(phone);
    setCurrentUserRole(role);
    localStorage.setItem('ak_enjoy_falooda_user_phone', phone);
    localStorage.setItem('ak_enjoy_falooda_user_role', role);

    const user_name = name || '';
    setCurrentUserName(user_name);
    localStorage.setItem('ak_enjoy_falooda_user_name', user_name);

    if (role === 'admin' || role === 'staff' || role === 'delivery') {
      setCurrentView('admin');
      localStorage.setItem('ak_enjoy_falooda_current_view', 'admin');
      
      const roleLabel = role === 'admin' ? 'Admin' : (role === 'staff' ? 'Staff Member' : 'Delivery Personnel');
      triggerToast(`Welcome back, ${user_name || roleLabel}! Access granted.`);
    } else {
      const user_addr = address || '';
      setCurrentUserAddress(user_addr);
      localStorage.setItem('ak_enjoy_falooda_user_address', user_addr);
      setCurrentView('store');
      localStorage.setItem('ak_enjoy_falooda_current_view', 'store');
      
      // Update customer table if not exists
      const phoneClean = phone.replace(/\D/g, '');
      if (!customers.some(c => c.phone === phoneClean)) {
        const newCust: AppUser = {
          phone: phoneClean,
          name: user_name,
          address: user_addr,
          ordersCount: 0
        };
        updateCustomers([...customers, newCust]);
      }
      triggerToast(`Welcome back, ${user_name || 'Customer'}!`);
    }
    setIsLoginOpen(false);
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentUserPhone(null);
    setCurrentUserRole(null);
    setCurrentUserName('');
    setCurrentUserAddress('');
    setCurrentView('store');
    localStorage.removeItem('ak_enjoy_falooda_user_phone');
    localStorage.removeItem('ak_enjoy_falooda_user_role');
    localStorage.removeItem('ak_enjoy_falooda_user_name');
    localStorage.removeItem('ak_enjoy_falooda_user_address');
    localStorage.setItem('ak_enjoy_falooda_current_view', 'store');
    triggerToast('Logged out successfully.');
  };

  // Admin Panel callbacks
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    updateOrders(updated);
    triggerToast(`Order status updated to ${status}!`);
  };

  const handleAssignDeliveryBoy = (orderId: string, deliveryBoyId: string, deliveryBoyName: string) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, deliveryBoyId, deliveryBoyName } : o);
    updateOrders(updated);
    triggerToast(`Assigned ${deliveryBoyName} to order ${orderId}!`);
  };

  const handleUpdateEstimatedTime = (orderId: string, estimatedDeliveryTime: string) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, estimatedDeliveryTime } : o);
    updateOrders(updated);
    triggerToast(`Updated delivery estimate for ${orderId} to ${estimatedDeliveryTime}!`);
  };

  const handleDeleteOrder = (orderId: string) => {
    const updated = orders.filter(o => o.id !== orderId);
    updateOrders(updated);
    triggerToast(`Order record deleted.`);
  };

  const handleAddCustomer = (cust: AppUser) => {
    if (customers.some(c => c.phone === cust.phone)) {
      triggerToast(`Phone number is already registered!`);
      return;
    }
    updateCustomers([...customers, cust]);
    triggerToast(`Customer ${cust.name} added.`);
  };

  const handleUpdateCustomer = (phone: string, updatedFields: Partial<AppUser>) => {
    const updated = customers.map(c => c.phone === phone ? { ...c, ...updatedFields } : c);
    updateCustomers(updated);
    triggerToast(`Customer info updated.`);
    if (currentUserPhone === phone) {
      if (updatedFields.name) {
        setCurrentUserName(updatedFields.name);
        localStorage.setItem('ak_enjoy_falooda_user_name', updatedFields.name);
      }
      if (updatedFields.address) {
        setCurrentUserAddress(updatedFields.address);
        localStorage.setItem('ak_enjoy_falooda_user_address', updatedFields.address);
      }
    }
  };

  const handleDeleteCustomer = (phone: string) => {
    updateCustomers(customers.filter(c => c.phone !== phone));
    triggerToast(`Customer deleted.`);
  };

  const handleAddAdmin = (newAdmin: AdminAccount) => {
    if (admins.some(a => a.phone === newAdmin.phone)) {
      triggerToast(`Access already granted for this number.`);
      return;
    }
    updateAdmins([...admins, newAdmin]);
    triggerToast(`Staff access granted for +91 ${newAdmin.phone}.`);
  };

  const handleDeleteAdmin = (phone: string) => {
    updateAdmins(admins.filter(a => a.phone !== phone));
    triggerToast(`Staff access revoked.`);
  };

  const handleToggleStock = (itemId: string) => {
    const updated = menuItems.map(item => {
      if (item.id === itemId) {
        const nextState = !item.isOutOfStock;
        triggerToast(`${item.name} is now ${nextState ? 'Out of Stock' : 'Available'}!`);
        return { ...item, isOutOfStock: nextState };
      }
      return item;
    });
    updateMenuItems(updated);
  };

  const handleUpdateItemPrice = (itemId: string, newPrice: number) => {
    const updated = menuItems.map(item => {
      if (item.id === itemId) {
        triggerToast(`Updated price of ${item.name} to ₹${newPrice}/-`);
        return { ...item, price: newPrice };
      }
      return item;
    });
    updateMenuItems(updated);
  };

  const handleAddItem = (item: MenuItem) => {
    updateMenuItems([...menuItems, item]);
    triggerToast(`${item.name} added to the menu!`);
  };

  const handleDeleteItem = (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    const updated = menuItems.filter(i => i.id !== itemId);
    updateMenuItems(updated);
    if (item) {
      triggerToast(`${item.name} removed from the menu.`);
    }
  };

  // Placing Order callback (called when clicking checkout from Tray)
  const handlePlaceOrder = (order: Order) => {
    let finalOrder = { ...order, estimatedDeliveryTime: '35 mins' };
    if (orders.some(o => o.id === finalOrder.id)) {
      finalOrder.id = 'INV-' + Math.floor(100000 + Math.random() * 900000);
      while (orders.some(o => o.id === finalOrder.id)) {
        finalOrder.id = 'INV-' + Math.floor(100000 + Math.random() * 900000);
      }
    }
    const nextOrders = [finalOrder, ...orders];
    updateOrders(nextOrders);

    // Update customer stats
    const phoneClean = order.customerPhone.replace(/\D/g, '');
    const existing = customers.find(c => c.phone === phoneClean);
    if (existing) {
      const updatedCusts = customers.map(c => 
        c.phone === phoneClean 
          ? { ...c, ordersCount: c.ordersCount + 1, lastOrderDate: order.date } 
          : c
      );
      updateCustomers(updatedCusts);
    } else {
      const newCust: AppUser = {
        name: order.customerName,
        phone: phoneClean,
        address: order.customerAddress,
        ordersCount: 1,
        lastOrderDate: order.date
      };
      updateCustomers([...customers, newCust]);
    }
    // Save to local device history for guest order tracking
    localStorage.setItem('ak_enjoy_falooda_last_customer_phone', phoneClean);
    try {
      const existingIdsRaw = localStorage.getItem('ak_enjoy_falooda_my_order_ids');
      const existingIds = existingIdsRaw ? JSON.parse(existingIdsRaw) : [];
      if (Array.isArray(existingIds)) {
        localStorage.setItem('ak_enjoy_falooda_my_order_ids', JSON.stringify([finalOrder.id, ...existingIds]));
      } else {
        localStorage.setItem('ak_enjoy_falooda_my_order_ids', JSON.stringify([finalOrder.id]));
      }
    } catch (e) {}

    setIsCartOpen(false);
    setCartItems([]);
    setShowOrderConfirmedModal(true);
    triggerToast(`Order submitted and sent to WhatsApp!`);
  };

  // Standard Item Adding
  const handleAddToOrder = (item: MenuItem) => {
    if (item.isOutOfStock) {
      triggerToast(`Sorry, ${item.name} is currently Out of Stock.`);
      return;
    }
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.item.id === item.id);
      if (existing) {
        return prevItems.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { item, quantity: 1 }];
    });
    triggerToast(`Added ${item.name} to your Dessert Tray!`);
  };

  // Custom Created Falooda Adding
  const handleAddCustomFalooda = (customItem: MenuItem, customizations: string) => {
    setCartItems((prevItems) => {
      return [...prevItems, { item: customItem, quantity: 1, customizations }];
    });
    triggerToast(`Added custom masterpiece "${customItem.name}" to your Tray!`);
  };

  // Update quantity in tray
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((i) => {
          if (i.item.id === id) {
            const nextQty = i.quantity + delta;
            return { ...i, quantity: nextQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0);
    });
  };

  // Remove completely
  const handleRemoveItem = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.item.id !== id));
  };

  // Clear order
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Scroll navigation helper
  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'admin_view_trigger_section') {
      if (currentUserRole === 'admin' || currentUserRole === 'staff' || currentUserRole === 'delivery') {
        setCurrentView('admin');
        localStorage.setItem('ak_enjoy_falooda_current_view', 'admin');
      } else {
        setIsLoginOpen(true);
      }
      return;
    }
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Listen to scrolls to auto-highlight correct navigation tabs
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'menu', 'builder', 'tracking', 'feedback', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if ((currentUserRole === 'admin' || currentUserRole === 'staff' || currentUserRole === 'delivery') && currentView === 'admin') {
    return (
      <AdminPanel
        orders={orders}
        currentUserRole={currentUserRole}
        currentUserPhone={currentUserPhone}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onAssignDeliveryBoy={handleAssignDeliveryBoy}
        onUpdateEstimatedTime={handleUpdateEstimatedTime}
        onDeleteOrder={handleDeleteOrder}
        customers={customers}
        onAddCustomer={handleAddCustomer}
        onUpdateCustomer={handleUpdateCustomer}
        onDeleteCustomer={handleDeleteCustomer}
        admins={admins}
        onAddAdmin={handleAddAdmin}
        onDeleteAdmin={handleDeleteAdmin}
        menuItems={menuItems}
        onToggleStock={handleToggleStock}
        onUpdateItemPrice={handleUpdateItemPrice}
        onAddMenuItem={handleAddItem}
        onDeleteMenuItem={handleDeleteItem}
        onLogout={handleLogout}
        onBackToStore={() => {
          setCurrentView('store');
          localStorage.setItem('ak_enjoy_falooda_current_view', 'store');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-pink-50/20 text-stone-900 font-sans selection:bg-pink-500 selection:text-white">
      
      {/* Sticky Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        currentUserPhone={currentUserPhone}
        currentUserRole={currentUserRole}
        currentUserName={currentUserName}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Sections */}
      <main>
        {/* Hero Section Container */}
        <div id="hero">
          <Hero
            onNavigateToMenu={() => handleNavigate('menu')}
            onNavigateToBuilder={() => handleNavigate('builder')}
          />
        </div>

        {/* Promo Features Banner / Highlights */}
        <section className="bg-white border-y border-pink-100 py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl bg-pink-50/30 hover:bg-pink-50/70 border border-pink-100/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xl flex-shrink-0">
                🌱
              </div>
              <div>
                <h4 className="font-display font-extrabold text-stone-800 text-sm">100% Vegetarian</h4>
                <p className="text-stone-500 text-xs mt-1">Our faloodas and ice creams are strictly gelatine-free and pure vegetarian.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl bg-pink-50/30 hover:bg-pink-50/70 border border-pink-100/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-xl flex-shrink-0">
                🌰
              </div>
              <div>
                <h4 className="font-display font-extrabold text-stone-800 text-sm">Premium Dry Fruits</h4>
                <p className="text-stone-500 text-xs mt-1">Loaded with hand-selected almonds, cashews, pistachios, and saffron strands.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl bg-pink-50/30 hover:bg-pink-50/70 border border-pink-100/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl flex-shrink-0">
                💬
              </div>
              <div>
                <h4 className="font-display font-extrabold text-stone-800 text-sm">Instant WhatsApp Orders</h4>
                <p className="text-stone-500 text-xs mt-1">Select your dishes, click send, and get them delivered hot or cold directly!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <div id="menu">
          <MenuSection menuItems={menuItems} onAddToOrder={handleAddToOrder} />
        </div>

        {/* Custom Falooda Interactive Builder */}
        <div id="builder">
          <CustomFaloodaBuilder onAddCustomFalooda={handleAddCustomFalooda} />
        </div>

        {/* Order Tracking Tab / Section */}
        <div id="tracking">
          <TrackingSection orders={orders} currentUserPhone={currentUserPhone} />
        </div>

        {/* Ratings & Feedback Section */}
        <div id="feedback">
          <FeedbackSection />
        </div>

        {/* Store Location & Helpdesk Support Section */}
        <div id="contact">
          <ContactSection />
        </div>
      </main>

      {/* Slide-out Order Summary Tray (Cart) */}
      <OrderTray
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        defaultName={currentUserName}
        defaultPhone={currentUserPhone || ''}
        defaultAddress={currentUserAddress}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Footer Branding Links */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Call-To-Action (Floating order cart badge) */}
      {totalCartCount > 0 && !isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold p-4 rounded-2xl shadow-2xl flex items-center gap-2 border border-pink-400/25 hover:scale-105 active:scale-95 transition-all duration-300 animate-bounce cursor-pointer"
          title="Open Order Tray"
          id="floating-cart-btn"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="font-mono text-sm font-bold">₹{cartItems.reduce((acc, item) => acc + (item.item.price * item.quantity), 0)}/-</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-mono">{totalCartCount}</span>
        </button>
      )}

      {/* Elegant Toast Notifications */}
      {showToast && toastMessage && (
        <div 
          className="fixed bottom-6 left-6 z-50 bg-white border border-pink-100 text-stone-900 px-5 py-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 max-w-sm animate-slideUp"
          id="custom-toast-notification"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <h5 className="font-semibold text-pink-600 text-xs uppercase tracking-wider">Added to Order</h5>
              <p className="text-xs text-stone-600 mt-0.5">{toastMessage}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowToast(false)} 
            className="text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Order Confirmed Modal */}
      {showOrderConfirmedModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs animate-fadeIn" 
            onClick={() => setShowOrderConfirmedModal(false)} 
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-emerald-100 shadow-2xl p-6 sm:p-8 text-center z-10 animate-scaleIn space-y-4">
            <button 
              type="button" 
              onClick={() => setShowOrderConfirmedModal(false)} 
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner animate-pulse">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-extrabold text-stone-900 text-lg">Your Order Confirmed!</h3>
              <p className="text-xs text-stone-500 font-medium">
                Thank you for ordering with AK Enjoy Falooda!
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-150 rounded-xl p-3 text-xs text-stone-600 space-y-1 text-left">
              <p className="flex justify-between font-mono text-[11px]">
                <span className="text-stone-400">Order Status:</span>
                <span className="text-emerald-600 font-bold uppercase">Pending Confirmation</span>
              </p>
              <p className="text-[10px] text-stone-500 leading-normal pt-1.5 border-t border-stone-100 mt-1">
                Your order summary has been prepared and sent to WhatsApp. Please complete the ₹50 advance payment to confirm your booking!
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1.5">
              <button
                onClick={() => {
                  setShowOrderConfirmedModal(false);
                  handleNavigate('tracking');
                }}
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-pink-600/10 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                Track Your Order 🛵
              </button>
              <button
                onClick={() => setShowOrderConfirmedModal(false)}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs uppercase tracking-widest rounded-xl cursor-pointer transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login / Auth Portal */}
      {isLoginOpen && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsLoginOpen(false)}
          adminPhones={admins.map(a => a.phone)}
        />
      )}

    </div>
  );
}
