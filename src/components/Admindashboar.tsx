// src/components/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';

// Interfaces define cheyali first
interface Seller {
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

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: string;
  image?: string;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  timestamp: string;
  sellerId?: number;
}

interface NotificationType {
  id: number;
  type: 'new_order' | 'status_update' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: number;
}

const AdminDashboard: React.FC = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'sellers' | 'orders'>('sellers');

  useEffect(() => {
    loadSellers();
    loadOrders();
  }, []);

  const loadSellers = () => {
    const savedSellers = JSON.parse(localStorage.getItem('sellers') || '[]');
    setSellers(savedSellers);
  };

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  };

  const approveSeller = (sellerId: number) => {
    const updatedSellersList = sellers.map(seller =>
      seller.id === sellerId ? { ...seller, status: 'approved' } : seller
    );
    
    setSellers(updatedSellersList);
    localStorage.setItem('sellers', JSON.stringify(updatedSellersList));
    
    // Create notification for seller
    const foundSeller = sellers.find(s => s.id === sellerId);
    const sellerNotifications = JSON.parse(localStorage.getItem('sellerNotifications') || '[]');
    sellerNotifications.push({
      id: Date.now(),
      type: 'system',
      message: `🎉 Your restaurant "${foundSeller?.restaurantName}" has been approved! You can now login.`,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('sellerNotifications', JSON.stringify(sellerNotifications));
    
    alert(`Seller ${foundSeller?.restaurantName} approved successfully!`);
  };

  const rejectSeller = (sellerId: number) => {
    const updatedSellersList = sellers.map(seller =>
      seller.id === sellerId ? { ...seller, status: 'rejected' } : seller
    );
    
    setSellers(updatedSellersList);
    localStorage.setItem('sellers', JSON.stringify(updatedSellersList));
    alert('Seller rejected!');
  };

  const pendingSellers = sellers.filter(s => s.status === 'pending');
  const approvedSellers = sellers.filter(s => s.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage sellers and monitor orders</p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{sellers.length}</div>
              <div className="text-green-800 font-semibold">Total Sellers</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{pendingSellers.length}</div>
              <div className="text-yellow-800 font-semibold">Pending Approvals</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{approvedSellers.length}</div>
              <div className="text-blue-800 font-semibold">Approved Sellers</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{orders.length}</div>
              <div className="text-purple-800 font-semibold">Total Orders</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('sellers')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm ${
                  activeTab === 'sellers'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Seller Management
                {pendingSellers.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                    {pendingSellers.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-semibold text-sm ${
                  activeTab === 'orders'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Order Monitoring
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'sellers' && (
              <div>
                {/* Pending Approvals */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Approvals</h2>
                  {pendingSellers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No pending seller approvals
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {pendingSellers.map(seller => (
                        <div key={seller.id} className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-800">{seller.restaurantName}</h3>
                              <p className="text-gray-600">{seller.name} • {seller.email} • {seller.phone}</p>
                              <p className="text-sm text-gray-500 mt-1">{seller.address}</p>
                              {seller.gstNumber && (
                                <p className="text-sm text-gray-500">GST: {seller.gstNumber}</p>
                              )}
                              <p className="text-xs text-yellow-600 mt-2">
                                Registered: {new Date(seller.registrationDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex space-x-2 mt-4 md:mt-0">
                              <button
                                onClick={() => approveSeller(seller.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectSeller(seller.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Approved Sellers */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Approved Sellers</h2>
                  {approvedSellers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No approved sellers yet
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {approvedSellers.map(seller => (
                        <div key={seller.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                          <h3 className="font-bold text-gray-800">{seller.restaurantName}</h3>
                          <p className="text-sm text-gray-600">{seller.name}</p>
                          <p className="text-sm text-gray-500">{seller.email}</p>
                          <p className="text-sm text-gray-500">{seller.phone}</p>
                          <span className="inline-block mt-2 bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
                            Approved
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No orders placed yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 10).map(order => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold">Order #{order.id}</h3>
                            <p className="text-gray-600">{order.customerName}</p>
                            <p className="text-sm text-gray-500">{order.customerEmail}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                            order.status === 'preparing' ? 'bg-blue-200 text-blue-800' :
                            order.status === 'ready' ? 'bg-orange-200 text-orange-800' :
                            'bg-green-200 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{item.quantity}x {item.name}</span>
                              <span>₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                          <span className="font-bold">Total: ₹{order.totalAmount}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(order.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;