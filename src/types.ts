/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'falooda' | 'icecream' | 'beverages';
  description: string;
  isSpecial?: boolean;
  isPopular?: boolean;
  tags?: string[];
  image?: string;
  isOutOfStock?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  customizations?: string;
}

export interface CustomFalooda {
  baseSyrup: string;
  milkType: string;
  vermicelliLevel: 'light' | 'normal' | 'extra';
  sabjaLevel: 'light' | 'normal' | 'extra';
  scoops: string[];
  toppings: string[];
  price: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  customizations?: string;
}

export interface Order {
  id: string; // e.g. INV-123456
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  latitude?: number | null;
  longitude?: number | null;
  items: OrderItem[];
  subtotal: number;
  advancePaid: number;
  codBalance: number;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  date: string;
  time: string;
  deliveryBoyId?: string;
  deliveryBoyName?: string;
  estimatedDeliveryTime?: string;
}

export interface AppUser {
  phone: string;
  name: string;
  address: string;
  ordersCount: number;
  lastOrderDate?: string;
}

export interface AdminAccount {
  phone: string;
  name: string;
  createdDate: string;
}

