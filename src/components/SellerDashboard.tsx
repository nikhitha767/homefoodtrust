// src/components/SellerDashboard.tsx
import React, { useState, useEffect } from "react";

// Local type definitions - temporary fix
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
    sellerId?: number;
}

interface Seller {
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

const SellerDashboard: React.FC = () => {
    const [seller, setSeller] = useState<Seller | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get current logged-in seller
        const currentSeller = JSON.parse(localStorage.getItem("currentSeller") || "null");
        setSeller(currentSeller);

        // Load orders for this seller
        if (currentSeller) {
            const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
            const sellerOrders = allOrders.filter((order: Order) => order.sellerId === currentSeller.id);
            setOrders(sellerOrders);
        }

        setLoading(false);
    }, []);

    const handleStatusUpdate = (orderId: number, newStatus: Order['status']) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);

        // Update in localStorage
        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
        const updatedAllOrders = allOrders.map((order: Order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        localStorage.setItem("orders", JSON.stringify(updatedAllOrders));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl text-red-600">Please login as seller</div>
            </div>
        );
    }

    const pendingOrders = orders.filter(order => order.status === 'pending');
    const preparingOrders = orders.filter(order => order.status === 'preparing');
    const readyOrders = orders.filter(order => order.status === 'ready');

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome, {seller.restaurantName}!
                    </h1>
                    <p className="text-gray-600">Manage your orders and track your business</p>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
                            <div className="text-blue-800 font-semibold">Total Orders</div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <div className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</div>
                            <div className="text-yellow-800 font-semibold">Pending</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <div className="text-2xl font-bold text-orange-600">{preparingOrders.length}</div>
                            <div className="text-orange-800 font-semibold">Preparing</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <div className="text-2xl font-bold text-green-600">{readyOrders.length}</div>
                            <div className="text-green-800 font-semibold">Ready</div>
                        </div>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders</h2>

                    {orders.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg">No orders yet</div>
                            <p className="text-gray-400 mt-2">Orders will appear here when customers place them</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {orders.map((order) => (
                                <div key={order.id} className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow duration-200">
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
                                                    onClick={() => handleStatusUpdate(order.id, 'preparing')}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200"
                                                >
                                                    Start Preparing
                                                </button>
                                            )}
                                            {order.status === 'preparing' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'ready')}
                                                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200"
                                                >
                                                    Mark Ready
                                                </button>
                                            )}
                                            {order.status === 'ready' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'completed')}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-200"
                                                >
                                                    Complete Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;