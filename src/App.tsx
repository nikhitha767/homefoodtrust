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
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';
import Signin from './components/Signin';
import FoodItemsForm from './components/FoodItemsForm';
import Sandwich from './components/Sandwish';
import { AuthProvider } from './context/AuthContext';
import MyProfile from './components/MyProfile';

// AppContent component should be inside Router
const AppContent: React.FC = () => {
  const location = useLocation();
  const showNavbar = !['/', '/signin'].includes(location.pathname);

  return (
    <div className="App"> 
      {showNavbar && <Navbar />}
      <Routes> 
        <Route path="/" element={<Signin />} />
        <Route path="/home" element={<HomeBody />} />
        <Route path="/veg" element={<Veg />} />
        <Route path="/non-veg" element={<NonVeg />} />
        <Route path="/tiffins" element={<Tiffins />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/seller/auth" element={<SellerAuth />} /> 
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/FoodItemsForm" element={<FoodItemsForm />} /> 
        <Route path="/signin" element={<Signin />} /> 
        <Route path="/sandwich" element={<Sandwich />} />
        <Route path="*" element={<HomeBody />} />
        <Route path="/profile" element={<MyProfile />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return ( 
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  ); 
};

export default App;