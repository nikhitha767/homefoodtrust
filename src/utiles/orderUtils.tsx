// src/types/index.ts
export interface Seller {
  id: number;
  name: string;
  email: string;
  phone: string;
  restaurantName: string;
  address: string;
  gstNumber: string;
  password: string;
  status: 'pending' | 'approved' | 'rejected';
  registrationDate: string;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  timestamp: string;
  sellerId?: number; // For assigning to specific seller
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: string;
  image?: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface Notification {
  id: number;
  type: 'new_order' | 'status_update' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: number;
}