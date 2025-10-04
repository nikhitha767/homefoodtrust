import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeBody from './components/HomeBody';
import Veg from './components/Veg';
import NonVeg from './components/NonVeg';
import Tiffins from './components/Tiffins';
import SellerAuth from './components/SellerAuth';
import SellerDashboard from './components/SellerDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';
import FoodItemForm from './components/FoodItemForm';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<HomeBody />} />
           <Route path="/" element={<FoodItemForm />} />
          
          <Route path="/veg" element={<Veg />} />
          <Route path="/non-veg" element={<NonVeg />} />
          <Route path="/tiffins" element={<Tiffins />} />

          {/* Seller Routes */}
          <Route path="/seller/auth" element={<SellerAuth />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Fallback route */}
          <Route path="*" element={<HomeBody />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;