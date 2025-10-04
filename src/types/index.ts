// src/types/index.ts

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  timestamp: string;
  sellerId?: number;
}

export interface Seller {
  id: number;
  name: string;
  phone: string;
  email: string;
  restaurantName: string;
  address: string;
  password: string;
  status: 'pending' | 'approved' | 'rejected';
  registrationDate: string;
  gstNumber?: string;
}