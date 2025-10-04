// src/components/OrderCard.tsx
import React from 'react';

// Temporary local type definitions
interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  timestamp: string;
}

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: number, status: Order['status']) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusUpdate }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h4 className="font-bold text-lg text-gray-800">Order #{order.id}</h4>
          <p className="text-gray-600">{order.customerName}</p>
          <p className="text-sm text-gray-500">{order.customerPhone}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(order.timestamp).toLocaleString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
            order.status === 'preparing' ? 'bg-blue-200 text-blue-800' :
              order.status === 'ready' ? 'bg-orange-200 text-orange-800' :
                'bg-green-200 text-green-800'
          }`}>
          {order.status}
        </span>
      </div>

      <div className="mb-4">
        {order.items.map((item: OrderItem, index: number) => (
          <div key={item.id || index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
            <div>
              <span className="font-medium">{item.quantity}x {item.name}</span>
              <span className="text-sm text-gray-500 ml-2">(₹{item.price} each)</span>
            </div>
            <span className="font-semibold">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-gray-200 pt-4">
        <div className="font-bold text-lg">Total: ₹{order.totalAmount}</div>
        <div className="flex space-x-2">
          {order.status === 'pending' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'preparing')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200"
            >
              Start Preparing
            </button>
          )}
          {order.status === 'preparing' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'ready')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200"
            >
              Mark Ready
            </button>
          )}
          {order.status === 'ready' && (
            <button
              onClick={() => onStatusUpdate(order.id, 'completed')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200"
            >
              Complete Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;