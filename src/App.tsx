import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
import Navbar from './components/Navbar'; 
import HomeBody from './components/HomeBody'; 
import Veg from './components/Veg'; 
import NonVeg from './components/NonVeg';
import Tiffins from './components/Tiffins'; 
import SellerAuth from './components/SellerAuth';
import SellerDashboard from './components/SellerDashboard';
import AdminDashboard from './components/AdminDashboard';
import Cart from './components/Cart'; // ✅ Add this
import { CartProvider } from './context/CartContext'; // ✅ Add this
import Signin from './components/Signin';
import FoodItemsForm from './components/FoodItemsForm';
import Sandwich from './components/Sandwish';

const AppContent: React.FC = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <div className="App"> 
      {showNavbar && <Navbar />}
      <Routes> 
        <Route path="/" element={<Signin />} />
     
        <Route path="/veg" element={<Veg />} />
        <Route path="/non-veg" element={<NonVeg />} />
        <Route path="/tiffins" element={<Tiffins />} />
        <Route path="/cart" element={<Cart />} /> {/* ✅ Add cart route */}
        <Route path="/seller/auth" element={<SellerAuth />} /> 
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<HomeBody />} /> 
          <Route path="/FoodItemsForm" element={<FoodItemsForm />} /> 
          <Route path="/signin" element={<Signin/>} /> 
          <Route path="/Sandwich" element={<Sandwich/>} /> 

      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return ( 
    <CartProvider> {/* ✅ Wrap with CartProvider */}
      <Router> 
        <AppContent />
      </Router>
    </CartProvider>
  ); 
};

export default App;