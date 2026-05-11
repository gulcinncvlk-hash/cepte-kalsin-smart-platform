export interface Product {
  id: string;
  name: string;
  store: string;
  distance: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  expiryDate: string;
  daysLeft: number;
  stock: number;
  category: string;
  emoji: string;
  latitude: number;
  longitude: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  tag: string;
  time: string;
  unread: boolean;
  urgent: boolean;
  emoji: string;
}

export interface Store {
  id: string;
  name: string;
  distance: string;
  hours: string;
  productCount: number;
  urgentCount?: number;
  maxDiscount?: number;
  emoji: string;
  latitude: number;
  longitude: number;
}

export interface Reservation {
  id: string;
  product: Product;
  status: 'active' | 'completed' | 'cancelled';
  reservedAt: string;
  expiresAt: string;
  code: string;
}

export interface User {
  name: string;
  email: string;
  emoji: string;
  totalShopping: number;
  totalSaving: number;
  savedKg: number;
  points: number;
}