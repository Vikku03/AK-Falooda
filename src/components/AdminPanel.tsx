/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MenuItem, Order, AppUser, AdminAccount } from '../types';
import { 
  ClipboardList, Users, Shield, Package, LogOut, CheckCircle, 
  MapPin, Phone, Trash2, Edit2, Plus, RefreshCw, IndianRupee,
  Activity, ShoppingBag, Eye, X, ToggleLeft, ToggleRight, Search,
  Truck, UserCheck, Check
} from 'lucide-react';

export interface DeliveryBoy {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  status: 'Active' | 'Inactive';
}

export interface StaffMember {
  id: string;
  name: string;
  phone: string;
  role: string;
  shift: string;
  status: 'On Duty' | 'Off Duty';
}

interface AdminPanelProps {
  orders: Order[];
  currentUserRole?: 'admin' | 'staff' | 'delivery' | 'customer' | null;
  currentUserPhone?: string | null;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onAssignDeliveryBoy?: (orderId: string, deliveryBoyId: string, deliveryBoyName: string) => void;
  onUpdateEstimatedTime?: (orderId: string, timeStr: string) => void;
  onDeleteOrder: (orderId: string) => void;
  
  customers: AppUser[];
  onAddCustomer: (customer: AppUser) => void;
  onUpdateCustomer: (phone: string, updated: Partial<AppUser>) => void;
  onDeleteCustomer: (phone: string) => void;
  
  admins: AdminAccount[];
  onAddAdmin: (admin: AdminAccount) => void;
  onDeleteAdmin: (phone: string) => void;
  
  menuItems: MenuItem[];
  onToggleStock: (id: string) => void;
  onUpdateItemPrice: (id: string, price: number) => void;
  onAddMenuItem?: (item: MenuItem) => void;
  onDeleteMenuItem?: (id: string) => void;
  
  onLogout: () => void;
  onBackToStore: () => void;
}

type AdminTab = 'dashboard' | 'users' | 'admins' | 'items' | 'delivery' | 'staff';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  currentUserRole = 'admin',
  currentUserPhone,
  onUpdateOrderStatus,
  onAssignDeliveryBoy,
  onUpdateEstimatedTime,
  onDeleteOrder,
  
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  
  admins,
  onAddAdmin,
  onDeleteAdmin,
  
  menuItems,
  onToggleStock,
  onUpdateItemPrice,
  onAddMenuItem,
  onDeleteMenuItem,
  
  onLogout,
  onBackToStore,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (currentUserRole === 'delivery') return 'delivery';
    return 'dashboard';
  });
  
  // Dashboard Status Filter
  const [statusFilter, setStatusFilter] = useState<'All' | Order['status']>('All');
  const [orderSearch, setOrderSearch] = useState('');

  // Manage Items states
  const [itemSearch, setItemSearch] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<number>(0);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: 'falooda' as 'falooda' | 'icecream' | 'beverages',
    description: '',
    image: '',
    isSpecial: false,
    isPopular: false
  });

  // Users manage states
  const [userSearch, setUserSearch] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', phone: '', address: '' });
  const [editingUserPhone, setEditingUserPhone] = useState<string | null>(null);
  const [editUser, setEditUser] = useState({ name: '', address: '' });

  // Admins manage states
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', phone: '' });

  // Delivery Boys state
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>(() => {
    const saved = localStorage.getItem('ak_enjoy_falooda_delivery_boys');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'DB01', name: 'Rahul Kumar', phone: '9876543210', vehicle: 'AP39TX1234', status: 'Active' },
      { id: 'DB02', name: 'Suresh Rao', phone: '9988776655', vehicle: 'AP39TY5678', status: 'Active' }
    ];
  });

  const [showAddDeliveryModal, setShowAddDeliveryModal] = useState(false);
  const [newDeliveryBoy, setNewDeliveryBoy] = useState({ name: '', phone: '', vehicle: '', status: 'Active' as 'Active' | 'Inactive' });
  const [editingDeliveryId, setEditingDeliveryId] = useState<string | null>(null);
  const [editDeliveryBoy, setEditDeliveryBoy] = useState({ name: '', phone: '', vehicle: '', status: 'Active' as 'Active' | 'Inactive' });
  const [deliverySearch, setDeliverySearch] = useState('');

  // Staff Members state
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('ak_enjoy_falooda_staff_members');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'ST01', name: 'Ramesh Naidu', phone: '9123456780', role: 'Order Manager', shift: 'Morning Shift', status: 'On Duty' },
      { id: 'ST02', name: 'Priya Sharma', phone: '9234567890', role: 'Dessert Maker', shift: 'Evening Shift', status: 'On Duty' }
    ];
  });

  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', phone: '', role: 'Order Manager', shift: 'Morning Shift', status: 'On Duty' as 'On Duty' | 'Off Duty' });
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editStaff, setEditStaff] = useState({ name: '', phone: '', role: '', shift: '', status: 'On Duty' as 'On Duty' | 'Off Duty' });
  const [staffSearch, setStaffSearch] = useState('');

  const updateDeliveryBoys = (newBoys: DeliveryBoy[]) => {
    setDeliveryBoys(newBoys);
    localStorage.setItem('ak_enjoy_falooda_delivery_boys', JSON.stringify(newBoys));
  };

  const updateStaffMembers = (newStaff: StaffMember[]) => {
    setStaffMembers(newStaff);
    localStorage.setItem('ak_enjoy_falooda_staff_members', JSON.stringify(newStaff));
  };

  // Add Delivery Boy Submit
  const handleAddDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPh = newDeliveryBoy.phone.replace(/\D/g, '');
    if (cleanPh.length < 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    const nextId = 'DB' + String(deliveryBoys.length + 1).padStart(2, '0');
    const updated = [
      ...deliveryBoys,
      {
        id: nextId,
        name: newDeliveryBoy.name,
        phone: cleanPh,
        vehicle: newDeliveryBoy.vehicle || 'N/A',
        status: newDeliveryBoy.status
      }
    ];
    updateDeliveryBoys(updated);
    setNewDeliveryBoy({ name: '', phone: '', vehicle: '', status: 'Active' });
    setShowAddDeliveryModal(false);
  };

  // Edit Delivery Boy Submit
  const handleEditDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPh = editDeliveryBoy.phone.replace(/\D/g, '');
    if (cleanPh.length < 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    const updated = deliveryBoys.map(boy => boy.id === editingDeliveryId ? {
      ...boy,
      name: editDeliveryBoy.name,
      phone: cleanPh,
      vehicle: editDeliveryBoy.vehicle || 'N/A',
      status: editDeliveryBoy.status
    } : boy);
    updateDeliveryBoys(updated);
    setEditingDeliveryId(null);
  };

  // Delete Delivery Boy
  const handleDeleteDeliveryBoy = (id: string) => {
    const updated = deliveryBoys.filter(boy => boy.id !== id);
    updateDeliveryBoys(updated);
  };

  // Add Staff Member Submit
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPh = newStaff.phone.replace(/\D/g, '');
    if (cleanPh.length < 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    const nextId = 'ST' + String(staffMembers.length + 1).padStart(2, '0');
    const updated = [
      ...staffMembers,
      {
        id: nextId,
        name: newStaff.name,
        phone: cleanPh,
        role: newStaff.role,
        shift: newStaff.shift,
        status: newStaff.status
      }
    ];
    updateStaffMembers(updated);
    setNewStaff({ name: '', phone: '', role: 'Order Manager', shift: 'Morning Shift', status: 'On Duty' });
    setShowAddStaffModal(false);
  };

  // Edit Staff Member Submit
  const handleEditStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPh = editStaff.phone.replace(/\D/g, '');
    if (cleanPh.length < 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    const updated = staffMembers.map(st => st.id === editingStaffId ? {
      ...st,
      name: editStaff.name,
      phone: cleanPh,
      role: editStaff.role,
      shift: editStaff.shift,
      status: editStaff.status
    } : st);
    updateStaffMembers(updated);
    setEditingStaffId(null);
  };

  // Delete Staff Member
  const handleDeleteStaffMember = (id: string) => {
    const updated = staffMembers.filter(st => st.id !== id);
    updateStaffMembers(updated);
  };

  // Filtered Delivery Boys
  const filteredDeliveryBoys = useMemo(() => {
    return deliveryBoys.filter(boy => 
      boy.name.toLowerCase().includes(deliverySearch.toLowerCase()) ||
      boy.phone.includes(deliverySearch) ||
      boy.vehicle.toLowerCase().includes(deliverySearch.toLowerCase())
    );
  }, [deliveryBoys, deliverySearch]);

  // Filtered Staff Members
  const filteredStaffMembers = useMemo(() => {
    return staffMembers.filter(st => 
      st.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      st.phone.includes(staffSearch) ||
      st.role.toLowerCase().includes(staffSearch.toLowerCase())
    );
  }, [staffMembers, staffSearch]);

  // Order Details Modal state
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Statistics Computations
  const stats = useMemo(() => {
    const totalCount = orders.length;
    const pending = orders.filter(o => o.status === 'Pending').length;
    const confirmed = orders.filter(o => o.status === 'Confirmed').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const sales = orders
      .filter(o => o.status === 'Delivered' || o.status === 'Confirmed')
      .reduce((sum, o) => sum + o.subtotal, 0);

    return { totalCount, pending, confirmed, delivered, sales };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      const matchesSearch = 
        order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.customerPhone.includes(orderSearch) ||
        order.id.toLowerCase().includes(orderSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, orderSearch]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      c.phone.includes(userSearch) ||
      c.address.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [customers, userSearch]);

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(itemSearch.toLowerCase())
    );
  }, [menuItems, itemSearch]);

  // Add Customer Submit
  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.phone.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    onAddCustomer({
      phone: newUser.phone.replace(/\D/g, ''),
      name: newUser.name,
      address: newUser.address,
      ordersCount: 0
    });
    setNewUser({ name: '', phone: '', address: '' });
    setShowAddUserModal(false);
  };

  // Edit Customer Submit
  const handleEditCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserPhone) {
      onUpdateCustomer(editingUserPhone, editUser);
      setEditingUserPhone(null);
    }
  };

  // Add Admin Submit
  const handleAddAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPh = newAdmin.phone.replace(/\D/g, '');
    if (cleanPh.length < 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    const now = new Date();
    onAddAdmin({
      phone: cleanPh,
      name: newAdmin.name,
      createdDate: now.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    });
    setNewAdmin({ name: '', phone: '' });
    setShowAddAdminModal(false);
  };

  // Add Menu Item Submit
  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) {
      alert('Please fill in the required fields (Name and Price).');
      return;
    }

    const priceNum = Number(newItem.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price.');
      return;
    }

    const fallbackImg = 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&auto=format&fit=crop&q=60';
    const cleanImg = newItem.image.trim() || fallbackImg;

    const addedItem: MenuItem = {
      id: 'menu_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: newItem.name.trim(),
      price: priceNum,
      category: newItem.category,
      description: newItem.description.trim(),
      image: cleanImg,
      isSpecial: newItem.isSpecial,
      isPopular: newItem.isPopular,
      isOutOfStock: false,
      tags: []
    };

    if (onAddMenuItem) {
      onAddMenuItem(addedItem);
    }

    setShowAddItemModal(false);
    setNewItem({
      name: '',
      price: '',
      category: 'falooda',
      description: '',
      image: '',
      isSpecial: false,
      isPopular: false
    });
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar for Desktop / Header Navigation for Mobile */}
      <aside className="w-full md:w-64 bg-pink-600 text-white flex flex-col justify-between shrink-0 shadow-xl z-20">
        <div>
          {/* Admin Header Title */}
          <div className="p-6 border-b border-pink-500/50 flex items-center justify-between">
            <div>
              <h1 className="font-display font-black text-lg tracking-tight">AK ENJOY</h1>
              <p className="text-[10px] text-pink-200 tracking-wider uppercase font-mono font-bold">Manager Hub</p>
            </div>
            <div className="bg-yellow-400 p-2 rounded-lg text-pink-950 font-bold text-xs shadow-md animate-pulse">
              LIVE
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            {(currentUserRole === 'admin' || currentUserRole === 'staff') && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-white/15 shadow-inner text-yellow-300'
                    : 'text-pink-100 hover:bg-white/10 hover:text-white'
                }`}
                id="admin-tab-dashboard"
              >
                <ClipboardList className="w-5 h-5" />
                Orders Dashboard
              </button>
            )}

            {currentUserRole === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-white/15 shadow-inner text-yellow-300'
                      : 'text-pink-100 hover:bg-white/10 hover:text-white'
                  }`}
                  id="admin-tab-users"
                >
                  <Users className="w-5 h-5" />
                  Manage Customers
                </button>
                <button
                  onClick={() => setActiveTab('admins')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'admins'
                      ? 'bg-white/15 shadow-inner text-yellow-300'
                      : 'text-pink-100 hover:bg-white/10 hover:text-white'
                  }`}
                  id="admin-tab-admins"
                >
                  <Shield className="w-5 h-5" />
                  Admin Accounts
                </button>
                <button
                  onClick={() => setActiveTab('staff')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'staff'
                      ? 'bg-white/15 shadow-inner text-yellow-300'
                      : 'text-pink-100 hover:bg-white/10 hover:text-white'
                  }`}
                  id="admin-tab-staff"
                >
                  <UserCheck className="w-5 h-5" />
                  Staff Members
                </button>
              </>
            )}

            {(currentUserRole === 'admin' || currentUserRole === 'delivery') && (
              <button
                onClick={() => setActiveTab('delivery')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'delivery'
                    ? 'bg-white/15 shadow-inner text-yellow-300'
                    : 'text-pink-100 hover:bg-white/10 hover:text-white'
                }`}
                id="admin-tab-delivery"
              >
                <Truck className="w-5 h-5" />
                {currentUserRole === 'delivery' ? 'My Delivery Hub' : 'Delivery Boys'}
              </button>
            )}

            {(currentUserRole === 'admin' || currentUserRole === 'staff') && (
              <button
                onClick={() => setActiveTab('items')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'items'
                    ? 'bg-white/15 shadow-inner text-yellow-300'
                    : 'text-pink-100 hover:bg-white/10 hover:text-white'
                }`}
                id="admin-tab-items"
              >
                <Package className="w-5 h-5" />
                Manage Items
              </button>
            )}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-pink-500/50 space-y-2.5">
          <button
            onClick={onBackToStore}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-yellow-400 hover:bg-yellow-300 text-pink-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow shadow-pink-700 cursor-pointer"
            id="admin-view-store-btn"
          >
            <ShoppingBag className="w-4 h-4" />
            Customer Store View
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer border border-rose-600"
            id="admin-logout-btn"
          >
            <LogOut className="w-4 h-4" />
            Logout Account
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Row */}
        <header className="bg-white border-b border-stone-200 h-16 flex items-center justify-between px-6 sm:px-8 shadow-xs z-10 shrink-0">
          <h2 className="text-stone-800 font-display font-extrabold text-lg capitalize flex items-center gap-2">
            <span>Control Tower</span>
            <span className="text-pink-500 font-bold">/</span>
            <span className="font-medium text-stone-500 text-sm capitalize">
              {activeTab === 'dashboard' && 'Deliveries & Invoices'}
              {activeTab === 'users' && 'Customer Registry'}
              {activeTab === 'admins' && 'Staff Accounts'}
              {activeTab === 'items' && 'Menu Stock & Pricing'}
            </span>
          </h2>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-xs text-stone-500 font-mono">
              Role: <strong className="text-pink-600 font-bold uppercase">SuperAdmin</strong>
            </span>
          </div>
        </header>

        {/* Dynamic Inner Tab Pane */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-h-0 space-y-6">
          
          {/* ==================== DASHBOARD TAB ==================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Stat Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white border border-stone-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="p-3 rounded-xl bg-pink-100 text-pink-600">
                    <ClipboardList className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 font-mono block">All Orders</span>
                    <strong className="text-xl font-bold font-mono text-stone-800">{stats.totalCount}</strong>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 font-mono block">Pending</span>
                    <strong className="text-xl font-bold font-mono text-stone-800">{stats.pending}</strong>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 font-mono block">Confirmed</span>
                    <strong className="text-xl font-bold font-mono text-stone-800">{stats.confirmed}</strong>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 font-mono block">Delivered</span>
                    <strong className="text-xl font-bold font-mono text-stone-800">{stats.delivered}</strong>
                  </div>
                </div>

                <div className="bg-white border border-stone-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm col-span-2 lg:col-span-1">
                  <div className="p-3 rounded-xl bg-yellow-100 text-yellow-700">
                    <IndianRupee className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 font-mono block">Active Sales</span>
                    <strong className="text-xl font-bold font-mono text-stone-800">₹{stats.sales}</strong>
                  </div>
                </div>
              </div>

              {/* Order Filtering and Search Section */}
              <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  
                  {/* Status buttons */}
                  <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                    {['All', 'Pending', 'Confirmed', 'Delivered', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status as any)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          statusFilter === status
                            ? 'bg-pink-600 text-white shadow shadow-pink-500/20'
                            : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  {/* Search box */}
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search Name, Phone or ID..."
                      className="w-full bg-stone-50 pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Orders List / Table */}
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                    <ClipboardList className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                    <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">No Orders Filed</h3>
                    <p className="text-stone-400 text-xs mt-1">There are no orders that match your current search and filters.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase text-[9px] tracking-wider bg-stone-50">
                          <th className="py-3 px-4">Invoice ID</th>
                          <th className="py-3 px-4">Customer Details</th>
                          <th className="py-3 px-4">Ordered Items</th>
                          <th className="py-3 px-4 text-right">Totals</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-center">Dispatch Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredOrders.map((order) => {
                          const statusColors = {
                            Pending: 'bg-amber-100 text-amber-800 border-amber-200/50',
                            Confirmed: 'bg-indigo-100 text-indigo-800 border-indigo-200/50',
                            Preparing: 'bg-blue-100 text-blue-800 border-blue-200/50',
                            'Out for Delivery': 'bg-orange-100 text-orange-800 border-orange-200/50',
                            Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200/50',
                            Cancelled: 'bg-rose-100 text-rose-800 border-rose-200/50',
                          };

                          return (
                            <tr key={order.id} className="hover:bg-pink-50/10 transition-colors">
                              {/* Invoice ID */}
                              <td className="py-4 px-4 font-mono font-bold text-pink-600 align-top">
                                {order.id}
                                <span className="block font-sans font-normal text-[10px] text-stone-400 mt-1">{order.time}</span>
                              </td>

                              {/* Customer Details */}
                              <td className="py-4 px-4 align-top space-y-1">
                                <h4 className="font-bold text-stone-900">{order.customerName}</h4>
                                <p className="text-stone-500 font-mono text-[11px] flex items-center gap-1">
                                  <Phone className="w-3 h-3 text-stone-400" /> {order.customerPhone}
                                </p>
                                <p className="text-stone-500 text-[10px] leading-relaxed max-w-xs flex items-start gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                                  <span>{order.customerAddress}</span>
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.customerAddress)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-600 hover:text-pink-800 transition-colors bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100 cursor-pointer"
                                  >
                                    🗺️ Navigate Address
                                  </a>
                                  {((order as any).latitude && (order as any).longitude) && (
                                    <a 
                                      href={`https://www.google.com/maps/search/?api=1&query=${(order as any).latitude},${(order as any).longitude}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 cursor-pointer"
                                    >
                                      📍 GPS Location
                                    </a>
                                  )}
                                </div>
                              </td>

                              {/* Ordered Items */}
                              <td className="py-4 px-4 align-top">
                                <ul className="space-y-1 max-w-xs">
                                  {order.items.map((item, idx) => (
                                    <li key={idx} className="text-[11px] text-stone-700 leading-normal flex items-start justify-between gap-4">
                                      <span>
                                        <strong className="font-bold text-stone-900">{item.name}</strong> 
                                        <span className="text-stone-400 font-mono ml-1">x{item.quantity}</span>
                                        {item.customizations && (
                                          <span className="block text-[9px] text-pink-500 italic font-medium leading-tight">({item.customizations})</span>
                                        )}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </td>

                              {/* Totals */}
                              <td className="py-4 px-4 text-right align-top font-mono text-[11px] space-y-1">
                                <div className="text-stone-500">Bill: ₹{order.subtotal}.00</div>
                                <div className="text-indigo-600 font-bold">Paid Adv: ₹{order.advancePaid}.00</div>
                                <div className="text-rose-600 font-extrabold border-t border-stone-100 pt-0.5 mt-0.5">COD Due: ₹{order.codBalance}.00</div>
                              </td>

                              {/* Status Display */}
                              <td className="py-4 px-4 text-center align-top space-y-2">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[order.status]}`}>
                                  {order.status}
                                </span>

                                {order.deliveryBoyName ? (
                                  <div className="text-[10px] text-pink-700 bg-pink-50/50 rounded px-1.5 py-0.5 border border-pink-100/30 font-medium">
                                    🛵 <span className="text-stone-400">Rider:</span> <strong className="text-stone-800">{order.deliveryBoyName}</strong>
                                  </div>
                                ) : (
                                  (order.status === 'Confirmed' || order.status === 'Preparing' || order.status === 'Out for Delivery') && (
                                    <div className="text-[9px] text-amber-600 font-bold uppercase tracking-wider">
                                      ⚠️ Rider Pending
                                    </div>
                                  )
                                )}

                                {order.status !== 'Cancelled' && (
                                  <div className="text-[10px] text-stone-500 bg-stone-50 border border-stone-200 rounded-xl p-1.5 mt-2">
                                    <div className="flex items-center justify-between gap-1 text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-1">
                                      <span>Estimate:</span>
                                      <span className="text-pink-600 font-extrabold">{order.estimatedDeliveryTime || '35 mins'}</span>
                                    </div>
                                    {onUpdateEstimatedTime && (
                                      <select
                                        value={order.estimatedDeliveryTime || '35 mins'}
                                        onChange={(e) => onUpdateEstimatedTime(order.id, e.target.value)}
                                        className="w-full text-[9px] px-1 py-0.5 bg-white border border-stone-200 rounded focus:border-pink-500/40 focus:outline-none font-bold text-stone-700 cursor-pointer"
                                      >
                                        <option value="15 mins">15 Mins</option>
                                        <option value="20 mins">20 Mins</option>
                                        <option value="25 mins">25 Mins</option>
                                        <option value="30 mins">30 Mins</option>
                                        <option value="35 mins">35 Mins</option>
                                        <option value="40 mins">40 Mins</option>
                                        <option value="45 mins">45 Mins</option>
                                        <option value="50 mins">50 Mins</option>
                                        <option value="1 hour">1 Hour</option>
                                        <option value="Delivered">Delivered</option>
                                      </select>
                                    )}
                                  </div>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-4 align-top">
                                <div className="flex flex-col gap-1 items-center">
                                  <button
                                    onClick={() => setViewingOrder(order)}
                                    className="w-full py-1 px-2.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1"
                                    title="View Full Bill Invoice"
                                  >
                                    <Eye className="w-3 h-3" /> View Bill
                                  </button>

                                  {order.status === 'Pending' && (
                                    <button
                                      onClick={() => onUpdateOrderStatus(order.id, 'Confirmed')}
                                      className="w-full py-1 px-2.5 rounded bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                    >
                                      Confirm Order
                                    </button>
                                  )}

                                  {order.status === 'Confirmed' && (
                                    <button
                                      onClick={() => onUpdateOrderStatus(order.id, 'Preparing')}
                                      className="w-full py-1 px-2.5 rounded bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                    >
                                      Start Preparing
                                    </button>
                                  )}

                                  {order.status === 'Preparing' && (
                                    <button
                                      onClick={() => onUpdateOrderStatus(order.id, 'Out for Delivery')}
                                      className="w-full py-1 px-2.5 rounded bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                    >
                                      Out for Delivery
                                    </button>
                                  )}

                                  {(order.status === 'Confirmed' || order.status === 'Preparing' || order.status === 'Out for Delivery' || order.status === 'Pending') && (
                                    <button
                                      onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                                      className="w-full py-1 px-2.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                    >
                                      Mark Delivered
                                    </button>
                                  )}

                                  {(order.status === 'Confirmed' || order.status === 'Preparing' || order.status === 'Out for Delivery') && (
                                    <div className="w-full mt-1.5 pt-1.5 border-t border-stone-100">
                                      <label className="block text-[9px] font-bold text-stone-400 uppercase tracking-wider mb-1 text-center">
                                        Allot Rider:
                                      </label>
                                      <select
                                        value={order.deliveryBoyId || ''}
                                        onChange={(e) => {
                                          const selectedId = e.target.value;
                                          const selectedBoy = deliveryBoys.find(b => b.id === selectedId);
                                          if (selectedBoy && onAssignDeliveryBoy) {
                                            onAssignDeliveryBoy(order.id, selectedBoy.id, selectedBoy.name);
                                          }
                                        }}
                                        className="w-full text-[10px] px-1 py-0.5 bg-white border border-stone-200 rounded-md focus:border-pink-500/40 focus:outline-none font-bold text-stone-700 cursor-pointer"
                                      >
                                        <option value="">-- Choose Rider --</option>
                                        {deliveryBoys
                                          .filter(b => b.status === 'Active')
                                          .map((boy) => (
                                            <option key={boy.id} value={boy.id}>
                                              {boy.name}
                                            </option>
                                          ))}
                                      </select>
                                    </div>
                                  )}

                                  {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                                    <button
                                      onClick={() => onUpdateOrderStatus(order.id, 'Cancelled')}
                                      className="w-full py-1 px-2.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                    >
                                      Cancel Order
                                    </button>
                                  )}

                                  {currentUserRole === 'admin' && (
                                    <button
                                      onClick={() => {
                                        onDeleteOrder(order.id);
                                      }}
                                      className="text-stone-400 hover:text-rose-600 text-[10px] py-1 hover:underline cursor-pointer animate-fadeIn"
                                    >
                                      Delete Log
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== USERS (CUSTOMERS) TAB ==================== */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                
                {/* Search / Add Customer row */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search customers by name, phone..."
                      className="w-full bg-stone-50 pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setNewUser({ name: '', phone: '', address: '' });
                      setShowAddUserModal(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow shadow-pink-500/10 cursor-pointer"
                    id="add-customer-trigger"
                  >
                    <Plus className="w-4 h-4" /> Add Customer
                  </button>
                </div>

                {/* Customers registry table */}
                {filteredCustomers.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                    <Users className="w-8 h-8 text-stone-300 mx-auto mb-3" />
                    <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">No Customers Found</h3>
                    <p className="text-stone-400 text-xs mt-1">Try modifying your search keywords.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase text-[9px] tracking-wider bg-stone-50">
                          <th className="py-3 px-4">Customer Name</th>
                          <th className="py-3 px-4">Contact Phone</th>
                          <th className="py-3 px-4">Default Address</th>
                          <th className="py-3 px-4 text-center">Orders Placed</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredCustomers.map((cust) => (
                          <tr key={cust.phone} className="hover:bg-pink-50/10 transition-colors">
                            <td className="py-4 px-4 font-bold text-stone-900">
                              {editingUserPhone === cust.phone ? (
                                <input
                                  type="text"
                                  value={editUser.name}
                                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                  className="bg-white border border-stone-300 px-2.5 py-1.5 rounded-lg text-xs w-full max-w-xs font-semibold"
                                />
                              ) : (
                                cust.name
                              )}
                            </td>
                            <td className="py-4 px-4 font-mono font-bold text-stone-600">+91 {cust.phone}</td>
                            <td className="py-4 px-4 text-stone-600 max-w-sm">
                              {editingUserPhone === cust.phone ? (
                                <textarea
                                  value={editUser.address}
                                  onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
                                  rows={2}
                                  className="bg-white border border-stone-300 px-2.5 py-1.5 rounded-lg text-xs w-full resize-none"
                                />
                              ) : (
                                cust.address
                              )}
                            </td>
                            <td className="py-4 px-4 text-center font-mono font-bold text-indigo-600">
                              {cust.ordersCount}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {editingUserPhone === cust.phone ? (
                                  <>
                                    <button
                                      onClick={handleEditCustomerSubmit}
                                      className="py-1 px-2.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase cursor-pointer"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingUserPhone(null)}
                                      className="py-1 px-2.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-600 text-[10px] font-bold uppercase cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingUserPhone(cust.phone);
                                        setEditUser({ name: cust.name, address: cust.address });
                                      }}
                                      className="p-1 text-stone-400 hover:text-pink-600 rounded hover:bg-stone-50 cursor-pointer"
                                      title="Edit Customer"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        onDeleteCustomer(cust.phone);
                                      }}
                                      className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-50 cursor-pointer"
                                      title="Delete Customer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== ADMINS TAB ==================== */}
          {activeTab === 'admins' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Sales Counter */}
              <div className="bg-gradient-to-tr from-pink-600 to-rose-600 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-yellow-300 animate-pulse" />
                    <h3 className="font-display font-extrabold text-base tracking-tight text-white">Live Business Sales Tracker</h3>
                  </div>
                  <p className="text-pink-100 text-[11px] mt-0.5 font-mono uppercase tracking-wider">Shared dashboard metrics for admin & staff members</p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                  <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-center">
                    <span className="block text-[10px] text-pink-200 uppercase tracking-widest font-bold">Orders Sold</span>
                    <span className="block text-lg font-mono font-black text-yellow-300 mt-0.5">{orders.filter(o => o.status === 'Delivered' || o.status === 'Confirmed').length} Sold</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-center">
                    <span className="block text-[10px] text-pink-200 uppercase tracking-widest font-bold">Total Sold Amount</span>
                    <span className="block text-lg font-mono font-black text-yellow-300 mt-0.5">₹{orders.filter(o => o.status === 'Delivered' || o.status === 'Confirmed').reduce((sum, o) => sum + o.subtotal, 0)}.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-display font-extrabold text-stone-900 text-base">Authorized Admins</h3>
                    <p className="text-xs text-stone-500 mt-1">Phone numbers with complete administrative privileges to access this hub.</p>
                  </div>
                  <button
                    onClick={() => {
                      setNewAdmin({ name: '', phone: '' });
                      setShowAddAdminModal(true);
                    }}
                    className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow shadow-pink-500/10 cursor-pointer"
                    id="add-admin-trigger"
                  >
                    <Plus className="w-4 h-4" /> Add Admin
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase text-[9px] tracking-wider bg-stone-50">
                        <th className="py-3 px-4">Staff Name</th>
                        <th className="py-3 px-4">Login Mobile Number</th>
                        <th className="py-3 px-4">Authorized Date</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {admins.map((adm) => (
                        <tr key={adm.phone} className="hover:bg-pink-50/10 transition-colors">
                          <td className="py-4 px-4 font-bold text-stone-900">{adm.name}</td>
                          <td className="py-4 px-4 font-mono font-bold text-pink-600">+91 {adm.phone}</td>
                          <td className="py-4 px-4 text-stone-500">{adm.createdDate}</td>
                          <td className="py-4 px-4 text-center">
                            {adm.phone === '9985545454' ? (
                              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest px-2 py-1 bg-stone-100 rounded border border-stone-200">
                                Primary Admin
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  onDeleteAdmin(adm.phone);
                                }}
                                className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-50 cursor-pointer"
                                title="Revoke Admin Permissions"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* ==================== STAFF MEMBERS TAB ==================== */}
          {activeTab === 'staff' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Sales Counter */}
              <div className="bg-gradient-to-tr from-pink-600 to-rose-600 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-yellow-300 animate-pulse" />
                    <h3 className="font-display font-extrabold text-base tracking-tight text-white">Live Business Sales Tracker</h3>
                  </div>
                  <p className="text-pink-100 text-[11px] mt-0.5 font-mono uppercase tracking-wider">Shared dashboard metrics for admin & staff members</p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                  <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-center">
                    <span className="block text-[10px] text-pink-200 uppercase tracking-widest font-bold">Orders Sold</span>
                    <span className="block text-lg font-mono font-black text-yellow-300 mt-0.5">{orders.filter(o => o.status === 'Delivered' || o.status === 'Confirmed').length} Sold</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/10 text-center">
                    <span className="block text-[10px] text-pink-200 uppercase tracking-widest font-bold">Total Sold Amount</span>
                    <span className="block text-lg font-mono font-black text-yellow-300 mt-0.5">₹{orders.filter(o => o.status === 'Delivered' || o.status === 'Confirmed').reduce((sum, o) => sum + o.subtotal, 0)}.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-display font-extrabold text-stone-900 text-base">Kitchen & Management Staff</h3>
                    <p className="text-xs text-stone-500 mt-1">Details of active staff members responsible for changing item stocks, preparing faloodas, and handling order pipelines.</p>
                  </div>
                  <button
                    onClick={() => {
                      setNewStaff({ name: '', phone: '', role: 'Order Preparation', shift: 'Morning Shift', status: 'On Duty' });
                      setShowAddStaffModal(true);
                    }}
                    className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow shadow-pink-500/10 cursor-pointer"
                    id="add-staff-trigger"
                  >
                    <Plus className="w-4 h-4" /> Add Staff Member
                  </button>
                </div>

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                      placeholder="Search staff by name, role..."
                      className="w-full bg-stone-50 pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <span className="text-xs text-stone-500 font-mono">
                    Showing <strong className="text-stone-800 font-bold">{filteredStaffMembers.length}</strong> Staff Members
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase text-[9px] tracking-wider bg-stone-50">
                        <th className="py-3 px-4">Staff ID</th>
                        <th className="py-3 px-4">Full Name</th>
                        <th className="py-3 px-4">Phone Number</th>
                        <th className="py-3 px-4">Role/Designation</th>
                        <th className="py-3 px-4">Current Shift</th>
                        <th className="py-3 px-4 text-center">Duty Status</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredStaffMembers.map((st) => (
                        <tr key={st.id} className="hover:bg-pink-50/10 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-stone-400">{st.id}</td>
                          
                          <td className="py-4 px-4 font-bold text-stone-900">
                            {editingStaffId === st.id ? (
                              <input
                                type="text"
                                value={editStaff.name}
                                onChange={(e) => setEditStaff({ ...editStaff, name: e.target.value })}
                                className="bg-white border border-stone-300 px-2 py-1.5 rounded text-xs w-full font-semibold"
                              />
                            ) : (
                              st.name
                            )}
                          </td>

                          <td className="py-4 px-4 font-mono text-stone-600">
                            {editingStaffId === st.id ? (
                              <input
                                type="text"
                                value={editStaff.phone}
                                onChange={(e) => setEditStaff({ ...editStaff, phone: e.target.value })}
                                className="bg-white border border-stone-300 px-2 py-1.5 rounded text-xs w-full font-mono"
                              />
                            ) : (
                              `+91 ${st.phone}`
                            )}
                          </td>

                          <td className="py-4 px-4 font-medium text-stone-700">
                            {editingStaffId === st.id ? (
                              <input
                                type="text"
                                value={editStaff.role}
                                onChange={(e) => setEditStaff({ ...editStaff, role: e.target.value })}
                                className="bg-white border border-stone-300 px-2 py-1.5 rounded text-xs w-full"
                              />
                            ) : (
                              st.role
                            )}
                          </td>

                          <td className="py-4 px-4 text-stone-600">
                            {editingStaffId === st.id ? (
                              <select
                                value={editStaff.shift}
                                onChange={(e) => setEditStaff({ ...editStaff, shift: e.target.value })}
                                className="bg-white border border-stone-300 px-2 py-1.5 rounded text-xs w-full focus:outline-none"
                              >
                                <option value="Morning Shift">Morning Shift</option>
                                <option value="Evening Shift">Evening Shift</option>
                                <option value="Night Shift">Night Shift</option>
                              </select>
                            ) : (
                              st.shift
                            )}
                          </td>

                          <td className="py-4 px-4 text-center">
                            {editingStaffId === st.id ? (
                              <select
                                value={editStaff.status}
                                onChange={(e) => setEditStaff({ ...editStaff, status: e.target.value as 'On Duty' | 'Off Duty' })}
                                className="bg-white border border-stone-300 px-2 py-1.5 rounded text-xs w-full focus:outline-none"
                              >
                                <option value="On Duty">On Duty</option>
                                <option value="Off Duty">Off Duty</option>
                              </select>
                            ) : (
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                st.status === 'On Duty' 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                  : 'bg-stone-50 text-stone-500 border-stone-200'
                              }`}>
                                {st.status}
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {editingStaffId === st.id ? (
                                <>
                                  <button
                                    onClick={handleEditStaffSubmit}
                                    className="py-1 px-2.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase cursor-pointer"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingStaffId(null)}
                                    className="py-1 px-2.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-600 text-[10px] font-bold uppercase cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingStaffId(st.id);
                                      setEditStaff({ name: st.name, phone: st.phone, role: st.role, shift: st.shift, status: st.status });
                                    }}
                                    className="p-1 text-stone-400 hover:text-pink-600 rounded hover:bg-stone-50 cursor-pointer"
                                    title="Edit Staff Member"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleDeleteStaffMember(st.id);
                                    }}
                                    className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-50 cursor-pointer"
                                    title="Delete Staff Member"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* ==================== DELIVERY BOYS TAB ==================== */}
          {activeTab === 'delivery' && (
            currentUserRole === 'delivery' ? (() => {
              const currentRider = deliveryBoys.find(boy => {
                const cleanDb = boy.phone.replace(/[^0-9]/g, '');
                const cleanUser = (currentUserPhone || '').replace(/[^0-9]/g, '');
                const hasPhoneMatch = cleanDb && cleanUser && (cleanDb.endsWith(cleanUser) || cleanUser.endsWith(cleanDb));
                const hasNameMatch = boy.name.toLowerCase() === (localStorage.getItem('ak_enjoy_falooda_user_name') || '').toLowerCase();
                return hasPhoneMatch || hasNameMatch;
              });

              const riderPendingOrders = orders.filter(o => 
                (o.status === 'Confirmed' || o.status === 'Preparing' || o.status === 'Out for Delivery') &&
                (currentRider ? o.deliveryBoyId === currentRider.id : true)
              );

              const riderCompletedOrders = orders.filter(o => 
                o.status === 'Delivered' && 
                (currentRider ? o.deliveryBoyId === currentRider.id : true)
              );

              const totalRiderEarnings = riderCompletedOrders.reduce((sum, o) => sum + o.subtotal, 0);

              return (
                <div className="space-y-6 animate-fadeIn">
                  {/* Rider Welcome Banner */}
                  <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <span className="bg-white/20 text-yellow-300 font-mono text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border border-white/15">
                          Rider Active Portal
                        </span>
                        <h2 className="font-display font-extrabold text-2xl tracking-tight mt-2.5">
                          Hello, {currentRider?.name || localStorage.getItem('ak_enjoy_falooda_user_name') || 'Delivery Partner'}!
                        </h2>
                        <p className="text-pink-100 text-xs mt-1 font-medium max-w-md">
                          Manage your pickup routes, customer coordinates, and mark orders delivered instantly. Keep safe on the roads!
                        </p>
                      </div>
                      <div className="flex gap-2 font-mono text-xs">
                        <span className="bg-stone-900/40 px-3 py-1.5 rounded-xl border border-white/10">
                          Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rider Stats Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border border-stone-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                      <div className="p-3.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100/50">
                        <Truck className="w-5 h-5 animate-bounce" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 font-mono block">Pending Runs</span>
                        <strong className="text-xl font-black font-mono text-stone-800">
                          {riderPendingOrders.length} Orders
                        </strong>
                      </div>
                    </div>

                    <div className="bg-white border border-stone-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                      <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 font-mono block">Completed Today</span>
                        <strong className="text-xl font-black font-mono text-stone-800">
                          {riderCompletedOrders.length} Delivered
                        </strong>
                      </div>
                    </div>

                    <div className="bg-white border border-stone-200 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                      <div className="p-3.5 rounded-xl bg-yellow-50 text-yellow-700 border border-yellow-100/50">
                        <IndianRupee className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400 font-mono block">Cash Collected</span>
                        <strong className="text-xl font-black font-mono text-stone-800">
                          ₹{totalRiderEarnings}.00
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Deliveries Main Container */}
                  <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h3 className="font-display font-extrabold text-stone-900 text-base">Your Active Delivery Routes</h3>
                        <p className="text-xs text-stone-500 mt-0.5">Please check delivery addresses and customer phone numbers carefully.</p>
                      </div>
                    </div>

                    {/* Order List */}
                    {riderPendingOrders.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-stone-200 rounded-xl bg-stone-50/50">
                        <div className="w-12 h-12 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">
                          🛵
                        </div>
                        <h4 className="font-bold text-stone-800 text-sm">No Active Deliveries</h4>
                        <p className="text-stone-500 text-xs mt-1">Excellent job! All orders have been successfully delivered or cleared.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {riderPendingOrders.map((order) => (
                          <div 
                            key={order.id} 
                            className="p-5 border border-stone-200 rounded-2xl hover:border-pink-300 transition-colors bg-stone-50/20 shadow-sm flex flex-col md:flex-row justify-between gap-6"
                          >
                            {/* Left Side: Customer & Address Details */}
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-2.5">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-pink-100 text-pink-700 px-2.5 py-1 rounded-lg">
                                  {order.id}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                                  order.status === 'Out for Delivery' 
                                    ? 'bg-amber-100 text-amber-700' 
                                    : 'bg-indigo-100 text-indigo-700'
                                }`}>
                                  {order.status}
                                </span>
                                <span className="text-[10px] font-mono text-stone-400">
                                  {new Date(order.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>

                              <div className="space-y-1">
                                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Customer Contact</h4>
                                <p className="text-sm font-bold text-stone-900">{order.customerName || 'Anonymous Customer'}</p>
                                <a 
                                  href={`tel:${order.customerPhone}`}
                                  className="inline-flex items-center gap-1.5 text-xs text-pink-600 hover:text-pink-700 font-bold mt-1 font-mono"
                                >
                                  <Phone className="w-3.5 h-3.5" /> +91 {order.customerPhone}
                                </a>
                              </div>

                              <div className="space-y-1 pt-1">
                                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Delivery Address</h4>
                                <div className="flex items-start gap-1.5 text-stone-700 text-xs leading-relaxed max-w-lg mt-0.5">
                                  <MapPin className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                                  <div className="w-full space-y-2">
                                    <p className="font-medium bg-white p-2.5 rounded-xl border border-stone-100 shadow-xs text-stone-800">
                                      {order.customerAddress || 'No address specified'}
                                    </p>
                                    {order.customerAddress && (
                                      <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.customerAddress)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-pink-200 cursor-pointer w-fit"
                                      >
                                        🗺️ Navigate on Google Maps
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Middle Side: Items list */}
                            <div className="md:w-64 border-t md:border-t-0 md:border-l border-stone-100 md:pl-6 pt-4 md:pt-0 flex flex-col justify-between space-y-3">
                              <div>
                                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Order Tray Items</h4>
                                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="text-xs flex justify-between gap-4 font-medium text-stone-700">
                                      <span className="truncate">
                                        <strong className="text-stone-900 font-bold">{item.quantity}x</strong> {item.name}
                                      </span>
                                      <span className="text-stone-400 font-mono text-[11px] flex-shrink-0">
                                        ₹{item.price * item.quantity}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="border-t border-stone-100/80 pt-2.5 flex justify-between items-center">
                                <span className="text-[10px] uppercase font-bold text-stone-400 font-mono">Amount to Collect</span>
                                <strong className="text-base font-black font-mono text-pink-600">₹{order.subtotal}.00</strong>
                              </div>
                            </div>

                            {/* Right Side: Interactive Rider Action */}
                            <div className="md:w-56 border-t md:border-t-0 md:border-l border-stone-100 md:pl-6 pt-4 md:pt-0 flex flex-col justify-center items-stretch gap-2.5">
                              {order.status === 'Confirmed' || order.status === 'Preparing' ? (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'Out for Delivery')}
                                  className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
                                >
                                  <Truck className="w-4 h-4" /> Start Delivery Run
                                </button>
                              ) : order.status === 'Out for Delivery' ? (
                                <button
                                  onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
                                >
                                  <Check className="w-4 h-4" /> Complete Handover
                                </button>
                              ) : (
                                <div className="text-center bg-stone-50 border border-stone-200/50 rounded-xl py-3 px-4">
                                  <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Status Completed</span>
                                  <span className="text-xs font-bold text-emerald-600">✓ Successfully Delivered</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()
            : (
              // ==================== ADMIN VIEW: DELIVERY BOY DIRECTORY ====================
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-display font-extrabold text-stone-900 text-base">Delivery Personnel Directory</h3>
                      <p className="text-xs text-stone-500 mt-1">Manage delivery boys, trace contact numbers, assign vehicles, and check their real-time delivery status.</p>
                    </div>
                    <button
                      onClick={() => {
                        setNewDeliveryBoy({ name: '', phone: '', vehicle: '', status: 'Active' });
                        setShowAddDeliveryModal(true);
                      }}
                      className="px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow shadow-pink-500/10 cursor-pointer"
                      id="add-delivery-trigger"
                    >
                      <Plus className="w-4 h-4" /> Add Delivery Personnel
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        value={deliverySearch}
                        onChange={(e) => setDeliverySearch(e.target.value)}
                        placeholder="Search delivery boys by name, vehicle..."
                        className="w-full bg-stone-50 pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <span className="text-xs text-stone-500 font-mono">
                      Showing <strong className="text-stone-800 font-bold">{filteredDeliveryBoys.length}</strong> Delivery Personnel
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase text-[9px] tracking-wider bg-stone-50">
                          <th className="py-3 px-4">Boy ID</th>
                          <th className="py-3 px-4">Full Name</th>
                          <th className="py-3 px-4">Phone Number</th>
                          <th className="py-3 px-4">Vehicle License Number</th>
                          <th className="py-3 px-4 text-center">Working Status</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredDeliveryBoys.map((boy) => (
                          <tr key={boy.id} className="hover:bg-pink-50/10 transition-colors">
                            <td className="py-4 px-4 font-mono font-bold text-stone-400">{boy.id}</td>
                            
                            <td className="py-4 px-4 font-bold text-stone-900">
                              {editingDeliveryId === boy.id ? (
                                <input
                                  type="text"
                                  value={editDeliveryBoy.name}
                                  onChange={(e) => setEditDeliveryBoy({ ...editDeliveryBoy, name: e.target.value })}
                                  className="bg-white border border-stone-300 px-2 py-1.5 rounded text-xs w-full font-semibold"
                                />
                              ) : (
                                boy.name
                              )}
                            </td>

                            <td className="py-4 px-4 font-mono text-stone-600">
                              {editingDeliveryId === boy.id ? (
                                <input
                                  type="text"
                                  value={editDeliveryBoy.phone}
                                  onChange={(e) => setEditDeliveryBoy({ ...editDeliveryBoy, phone: e.target.value })}
                                  className="bg-white border border-stone-300 px-2 py-1.5 rounded text-xs w-full font-mono"
                                />
                              ) : (
                                `+91 ${boy.phone}`
                              )}
                            </td>

                            <td className="py-4 px-4 font-mono font-bold text-stone-700">
                              {editingDeliveryId === boy.id ? (
                                <input
                                  type="text"
                                  value={editDeliveryBoy.vehicle}
                                  onChange={(e) => setEditDeliveryBoy({ ...editDeliveryBoy, vehicle: e.target.value })}
                                  className="bg-white border border-stone-300 px-2 py-1.5 rounded text-xs w-full uppercase"
                                />
                              ) : (
                                boy.vehicle
                              )}
                            </td>

                            <td className="py-4 px-4 text-center">
                              {editingDeliveryId === boy.id ? (
                                <select
                                  value={editDeliveryBoy.status}
                                  onChange={(e) => setEditDeliveryBoy({ ...editDeliveryBoy, status: e.target.value as 'Active' | 'Inactive' })}
                                  className="bg-white border border-stone-300 px-2 py-1.5 rounded text-xs w-full focus:outline-none"
                                >
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                                </select>
                              ) : (
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                  boy.status === 'Active' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : 'bg-stone-50 text-stone-500 border-stone-200'
                                }`}>
                                  {boy.status}
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {editingDeliveryId === boy.id ? (
                                  <>
                                    <button
                                      onClick={handleEditDeliverySubmit}
                                      className="py-1 px-2.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase cursor-pointer"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingDeliveryId(null)}
                                      className="py-1 px-2.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-600 text-[10px] font-bold uppercase cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingDeliveryId(boy.id);
                                        setEditDeliveryBoy({ name: boy.name, phone: boy.phone, vehicle: boy.vehicle, status: boy.status });
                                      }}
                                      className="p-1 text-stone-400 hover:text-pink-600 rounded hover:bg-stone-50 cursor-pointer"
                                      title="Edit Personnel"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleDeleteDeliveryBoy(boy.id);
                                      }}
                                      className="p-1 text-stone-400 hover:text-rose-600 rounded hover:bg-stone-50 cursor-pointer"
                                      title="Delete Personnel"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            )
          )}

          {/* ==================== MANAGE ITEMS TAB ==================== */}
          {activeTab === 'items' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
                
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="flex flex-1 gap-4 items-center w-full max-w-md">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        value={itemSearch}
                        onChange={(e) => setItemSearch(e.target.value)}
                        placeholder="Search items by name, category..."
                        className="w-full bg-stone-50 pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <span className="text-xs text-stone-500 hidden md:inline">
                      Showing <strong className="text-stone-800 font-bold">{filteredItems.length}</strong> Gourmet menu items
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setNewItem({
                        name: '',
                        price: '',
                        category: 'falooda',
                        description: '',
                        image: '',
                        isSpecial: false,
                        isPopular: false
                      });
                      setShowAddItemModal(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Add Menu Item
                  </button>
                </div>

                {/* Items Grid/List */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase text-[9px] tracking-wider bg-stone-50">
                        <th className="py-3 px-4">Item Thumbnail</th>
                        <th className="py-3 px-4">Menu Item Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4 text-right">Standard Price</th>
                        <th className="py-3 px-4 text-center">Availability Status</th>
                        <th className="py-3 px-4 text-center">Control Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-pink-50/10 transition-colors">
                          
                          {/* Thumbnail */}
                          <td className="py-3 px-4">
                            <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden border border-stone-200">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className={`w-full h-full object-cover ${item.isOutOfStock ? 'grayscale' : ''}`}
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </td>

                          {/* Name / Description */}
                          <td className="py-3 px-4">
                            <h4 className="font-bold text-stone-900">{item.name}</h4>
                            <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{item.description}</p>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-pink-50 text-pink-600 border border-pink-100">
                              {item.category}
                            </span>
                          </td>

                          {/* Price Adjust */}
                          <td className="py-3 px-4 text-right">
                            {editingItemId === item.id ? (
                              <div className="inline-flex items-center gap-1.5 justify-end">
                                <span className="text-xs font-bold">₹</span>
                                <input
                                  type="number"
                                  value={editPriceVal}
                                  onChange={(e) => setEditPriceVal(Math.max(0, Number(e.target.value)))}
                                  className="w-16 bg-white border border-stone-300 px-1.5 py-1 rounded text-right font-mono font-bold text-xs"
                                  autoFocus
                                />
                                <button
                                  onClick={() => {
                                    onUpdateItemPrice(item.id, editPriceVal);
                                    setEditingItemId(null);
                                  }}
                                  className="py-1 px-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingItemId(null)}
                                  className="py-1 px-2 rounded bg-stone-200 hover:bg-stone-300 text-stone-600 font-bold text-[10px] uppercase tracking-wider cursor-pointer"
                                >
                                  X
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 justify-end font-mono font-bold text-stone-800 text-xs">
                                <span>₹{item.price}.00</span>
                                <button
                                  onClick={() => {
                                    setEditingItemId(item.id);
                                    setEditPriceVal(item.price);
                                  }}
                                  className="p-1 text-stone-400 hover:text-pink-600 hover:bg-stone-50 rounded cursor-pointer"
                                  title="Change Price"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Stock Toggle Display */}
                          <td className="py-3 px-4 text-center">
                            {item.isOutOfStock ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-bold uppercase tracking-wider">
                                🔴 Out of Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                                🟢 Available
                              </span>
                            )}
                          </td>

                          {/* Stock Switch Toggle Button */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => onToggleStock(item.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                                  item.isOutOfStock
                                    ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                                    : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                }`}
                              >
                                {item.isOutOfStock ? (
                                  <>
                                    <ToggleLeft className="w-5 h-5 text-rose-600" />
                                    Make Available
                                  </>
                                ) : (
                                  <>
                                    <ToggleRight className="w-5 h-5 text-emerald-500" />
                                    Out of Stock
                                  </>
                                )}
                              </button>

                              {onDeleteMenuItem && (
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete ${item.name} from the menu?`)) {
                                      onDeleteMenuItem(item.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-stone-50 hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-stone-200 hover:border-rose-200 transition-colors cursor-pointer"
                                  title="Delete Menu Item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

        </div>

      </main>

      {/* ==================== BILL INVOICE MODAL OVERLAY ==================== */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 print-overlay">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs no-print" onClick={() => setViewingOrder(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-pink-100 shadow-2xl overflow-hidden z-10 animate-scaleIn flex flex-col max-h-[90vh]" id="printable-invoice-wrapper">
            
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50 no-print">
              <span className="font-mono text-xs font-bold text-pink-600">{viewingOrder.id} - Invoice Details</span>
              <button onClick={() => setViewingOrder(null)} className="text-stone-400 hover:text-stone-700 font-bold p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Invoice Banner */}
              <div className="text-center pb-4 border-b border-stone-100">
                <h3 className="font-display font-black text-stone-900 text-lg uppercase">AK Enjoy Falooda</h3>
                <p className="text-[10px] text-stone-500 font-mono tracking-wide mt-0.5">DIGITAL INVOICE</p>
                <div className="mt-2 text-[10px] text-stone-400 font-mono">
                  <div>Date: {viewingOrder.date}</div>
                  <div>Time: {viewingOrder.time}</div>
                </div>
              </div>

              {/* Delivery info */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[10px] text-stone-400">BILL TO:</h4>
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-150 space-y-1">
                  <div><strong className="font-bold text-stone-900">Name:</strong> {viewingOrder.customerName}</div>
                  <div><strong className="font-bold text-stone-900">Phone:</strong> {viewingOrder.customerPhone}</div>
                  <div>
                    <strong className="font-bold text-stone-900">Delivery Address:</strong> {viewingOrder.customerAddress}
                    {viewingOrder.customerAddress && (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(viewingOrder.customerAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-600 hover:text-pink-800 transition-colors bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100 ml-2 cursor-pointer"
                      >
                        🗺️ Open Map
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <h4 className="font-bold text-stone-800 uppercase tracking-wider text-[10px] text-stone-400">ITEMS ORDERED:</h4>
                <div className="divide-y divide-stone-100">
                  {viewingOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 text-xs flex justify-between items-start gap-4">
                      <div>
                        <strong className="font-bold text-stone-900">{item.name}</strong>
                        <span className="text-stone-400 font-mono text-[10px] ml-1.5">x{item.quantity}</span>
                        {item.customizations && (
                          <div className="text-[10px] text-pink-500 italic mt-0.5">({item.customizations})</div>
                        )}
                      </div>
                      <span className="font-mono text-stone-700">₹{item.price * item.quantity}.00</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Summary */}
              <div className="border-t border-stone-150 pt-4 space-y-1.5 text-xs font-mono text-stone-700">
                <div className="flex justify-between">
                  <span>Subtotal Amount:</span>
                  <span>₹{viewingOrder.subtotal}.00</span>
                </div>
                <div className="flex justify-between text-indigo-600 font-bold">
                  <span>Advance Paid:</span>
                  <span>- ₹{viewingOrder.advancePaid}.00</span>
                </div>
                <div className="flex justify-between text-rose-600 font-extrabold text-sm border-t border-stone-100 pt-1.5 mt-1.5">
                  <span>Balance Due (COD):</span>
                  <span>₹{viewingOrder.codBalance}.00</span>
                </div>
              </div>

            </div>

            <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex justify-end gap-2 shrink-0 no-print">
              <button
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 rounded bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold uppercase transition-colors cursor-pointer shadow"
              >
                Close Bill
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==================== ADD CUSTOMER MODAL ==================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs" onClick={() => setShowAddUserModal(false)} />
          <form 
            onSubmit={handleAddCustomerSubmit}
            className="relative w-full max-w-md bg-white rounded-2xl border border-pink-100 shadow-2xl overflow-hidden z-10 animate-scaleIn p-6 sm:p-8 space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h3 className="font-display font-extrabold text-stone-900 text-base">Register New Customer</h3>
              <button type="button" onClick={() => setShowAddUserModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Customer Name
              </label>
              <input
                type="text"
                required
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="John Doe"
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                required
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="9985545454"
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Delivery Address
              </label>
              <textarea
                required
                rows={3}
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                placeholder="76-16-97, masjid road, urmilanagar"
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow cursor-pointer transition-colors"
            >
              Add Customer
            </button>
          </form>
        </div>
      )}

      {/* ==================== ADD ADMIN MODAL ==================== */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs" onClick={() => setShowAddAdminModal(false)} />
          <form 
            onSubmit={handleAddAdminSubmit}
            className="relative w-full max-w-md bg-white rounded-2xl border border-pink-100 shadow-2xl overflow-hidden z-10 animate-scaleIn p-6 sm:p-8 space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h3 className="font-display font-extrabold text-stone-900 text-base">Add Admin Access</h3>
              <button type="button" onClick={() => setShowAddAdminModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Manager/Admin Name
              </label>
              <input
                type="text"
                required
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                placeholder="Manager Name"
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                required
                value={newAdmin.phone}
                onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                placeholder="9985545454"
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow cursor-pointer transition-colors"
            >
              Grant Access
            </button>
          </form>
        </div>
      )}

      {/* ==================== ADD STAFF MEMBER MODAL ==================== */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs" onClick={() => setShowAddStaffModal(false)} />
          <form 
            onSubmit={handleAddStaffSubmit}
            className="relative w-full max-w-md bg-white rounded-2xl border border-pink-100 shadow-2xl overflow-hidden z-10 animate-scaleIn p-6 sm:p-8 space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h3 className="font-display font-extrabold text-stone-900 text-base">Add Staff Member</h3>
              <button type="button" onClick={() => setShowAddStaffModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Staff Full Name
              </label>
              <input
                type="text"
                required
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                placeholder="Priya Sharma"
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <input
                type="tel"
                required
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                placeholder="9123456789"
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Role/Designation
              </label>
              <input
                type="text"
                required
                value={newStaff.role}
                onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                placeholder="Dessert Maker / Order Manager"
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Assigned Shift
                </label>
                <select
                  value={newStaff.shift}
                  onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value })}
                  className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
                >
                  <option value="Morning Shift">Morning Shift</option>
                  <option value="Evening Shift">Evening Shift</option>
                  <option value="Night Shift">Night Shift</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Duty Status
                </label>
                <select
                  value={newStaff.status}
                  onChange={(e) => setNewStaff({ ...newStaff, status: e.target.value as 'On Duty' | 'Off Duty' })}
                  className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
                >
                  <option value="On Duty">On Duty</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow cursor-pointer transition-colors mt-3"
            >
              Add Staff Member
            </button>
          </form>
        </div>
      )}

      {/* ==================== ADD DELIVERY BOY MODAL ==================== */}
      {showAddDeliveryModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs" onClick={() => setShowAddDeliveryModal(false)} />
          <form 
            onSubmit={handleAddDeliverySubmit}
            className="relative w-full max-w-md bg-white rounded-2xl border border-pink-100 shadow-2xl overflow-hidden z-10 animate-scaleIn p-6 sm:p-8 space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h3 className="font-display font-extrabold text-stone-900 text-base">Add Delivery Personnel</h3>
              <button type="button" onClick={() => setShowAddDeliveryModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Delivery Boy Full Name
              </label>
              <input
                type="text"
                required
                value={newDeliveryBoy.name}
                onChange={(e) => setNewDeliveryBoy({ ...newDeliveryBoy, name: e.target.value })}
                placeholder="Rahul Kumar"
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Contact Mobile Number
              </label>
              <input
                type="tel"
                required
                value={newDeliveryBoy.phone}
                onChange={(e) => setNewDeliveryBoy({ ...newDeliveryBoy, phone: e.target.value })}
                placeholder="9876543210"
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Vehicle License Number
              </label>
              <input
                type="text"
                required
                value={newDeliveryBoy.vehicle}
                onChange={(e) => setNewDeliveryBoy({ ...newDeliveryBoy, vehicle: e.target.value })}
                placeholder="AP39TX1234"
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Working Status
              </label>
              <select
                value={newDeliveryBoy.status}
                onChange={(e) => setNewDeliveryBoy({ ...newDeliveryBoy, status: e.target.value as 'Active' | 'Inactive' })}
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow cursor-pointer transition-colors mt-3"
            >
              Register Personnel
            </button>
          </form>
        </div>
      )}

      {/* ==================== ADD MENU ITEM MODAL ==================== */}
      {showAddItemModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs" onClick={() => setShowAddItemModal(false)} />
          <form 
            onSubmit={handleAddItemSubmit}
            className="relative w-full max-w-md bg-white rounded-2xl border border-pink-100 shadow-2xl overflow-hidden z-10 animate-scaleIn p-6 sm:p-8 space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <h3 className="font-display font-extrabold text-stone-900 text-base">Add New Menu Item</h3>
              <button type="button" onClick={() => setShowAddItemModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="E.g., Royal Kesar Pista Falooda"
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Standard Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="E.g., 180"
                  className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value as 'falooda' | 'icecream' | 'beverages' })}
                  className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
                >
                  <option value="falooda">Falooda</option>
                  <option value="icecream">Ice Cream</option>
                  <option value="beverages">Beverages</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={2}
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Describe the layers, ingredients, or flavor profiles..."
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={newItem.image}
                onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                placeholder="E.g., https://images.unsplash.com/..."
                className="w-full bg-stone-50 text-stone-900 px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:border-pink-500/40 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newItem.isSpecial}
                  onChange={(e) => setNewItem({ ...newItem, isSpecial: e.target.checked })}
                  className="rounded text-pink-600 focus:ring-pink-500 border-stone-300 w-4 h-4"
                />
                <span className="text-[11px] font-medium text-stone-600">Chef Special ⭐</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newItem.isPopular}
                  onChange={(e) => setNewItem({ ...newItem, isPopular: e.target.checked })}
                  className="rounded text-pink-600 focus:ring-pink-500 border-stone-300 w-4 h-4"
                />
                <span className="text-[11px] font-medium text-stone-600">Popular Choice 🔥</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow cursor-pointer transition-colors mt-3"
            >
              Add Gourmet Item
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
