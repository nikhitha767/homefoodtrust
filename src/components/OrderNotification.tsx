// src/components/OrderNotifications.tsx
import React from 'react';
import { Order } from '../types';

interface OrderNotificationsProps {
    newOrders: Order[];
    onOrderAcknowledge: (orderId: number) => void;
}

const OrderNotifications: React.FC<OrderNotificationsProps> = ({
    newOrders,
    onOrderAcknowledge
}) => {
    if (newOrders.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 bg-yellow-100 border border-yellow-400 rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-yellow-800">New Orders!</h3>
                <span className="bg-yellow-500 text-white rounded-full px-2 py-1 text-xs">
                    {newOrders.length}
                </span>
            </div>
            <p className="text-yellow-700 text-sm mb-3">
                You have {newOrders.length} new order(s) waiting for acknowledgment.
            </p>
            <button
                onClick={() => newOrders.forEach(order => onOrderAcknowledge(order.id))}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm w-full"
            >
                Acknowledge All
            </button>
        </div>
    );
};

export default OrderNotifications;