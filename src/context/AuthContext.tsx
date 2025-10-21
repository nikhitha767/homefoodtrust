// src/components/SellerAuth.tsx - CORRECTED
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SellerForm {
  name: string;
  email: string;
  phone: string;
  restaurantName: string;
  address: string;
  gstNumber: string;
  password: string;
}

const SellerAuth: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<SellerForm>({
    name: '',
    email: '',
    phone: '',
    restaurantName: '',
    address: '',
    gstNumber: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSellerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSeller = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      registrationDate: new Date().toISOString()
    };

    // Save to localStorage
    const existingSellers = JSON.parse(localStorage.getItem('sellers') || '[]');
    const sellerExists = existingSellers.find((s: any) => s.email === formData.email);
    
    if (sellerExists) {
      alert('Seller with this email already exists!');
      return;
    }

    existingSellers.push(newSeller);
    localStorage.setItem('sellers', JSON.stringify(existingSellers));
    
    alert('🎉 Registration submitted! Waiting for admin approval.');
    setFormData({ name: '', email: '', phone: '', restaurantName: '', address: '', gstNumber: '', password: '' });
    
    // Auto switch to login after registration
    setIsLogin(true);
  };

  const handleSellerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sellers = JSON.parse(localStorage.getItem('sellers') || '[]');
    const seller = sellers.find((s: any) => 
      s.email === formData.email && s.password === formData.password
    );

    if (!seller) {
      alert('Invalid email or password!');
      return;
    }

    if (seller.status !== 'approved') {
      alert('❌ Your account is pending admin approval. Please wait.');
      return;
    }

    // Save current seller to localStorage
    localStorage.setItem('currentSeller', JSON.stringify(seller));
    alert(`✅ Welcome back, ${seller.restaurantName || seller.name}!`);
    
    // CORRECTED: Use correct route path
    navigate('/seller-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Seller Login' : 'Seller Registration'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Access your restaurant dashboard' : 'Join our food platform'}
          </p>
        </div>

        <form onSubmit={isLogin ? handleSellerLogin : handleSellerRegister}>
          {!isLogin && (
            <>
              <div className="space-y-4 mb-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Full Name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleInputChange}
                  placeholder="Restaurant Name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Restaurant Address"
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                />
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  placeholder="GST Number (Optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </>
          )}

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg font-semibold text-lg mt-6 transition-all duration-200 transform hover:scale-105"
          >
            {isLogin ? 'Login to Dashboard' : 'Register Restaurant'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
          >
            {isLogin ? "Don't have an account? Register here" : 'Already have an account? Login here'}
          </button>
        </div>

        {!isLogin && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-sm text-center">
              ⏳ After registration, your account will be reviewed by admin. You'll receive approval within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerAuth;