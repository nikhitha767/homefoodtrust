// src/components/Header.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Header.tsx lo
  const menuClickHandlers = {
    handleHomeClick: () => {
      console.log('Home menu clicked');
      navigate('/');
      setIsDropdownOpen(false);
    },

    handleVegClick: () => {
      console.log('Veg menu clicked');
      navigate('/veg');
      setIsDropdownOpen(false);
    },

    handleNonVegClick: () => {
      console.log('Non-Veg menu clicked');
      navigate('/non-veg');
      setIsDropdownOpen(false);
    },

    handleTiffinsClick: () => {
      console.log('Tiffins menu clicked');
      navigate('/tiffins');
      setIsDropdownOpen(false);
    },

    handleBeveragesClick: () => {
      console.log('Beverages menu clicked');
      navigate('/beverages');
      setIsDropdownOpen(false);
    }

  };

  // Handle dropdown item click
  const handleMenuItemClick = (handler: () => void) => {
    handler();
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => handleMenuItemClick(menuClickHandlers.handleHomeClick)}
            className="text-2xl font-bold text-green-700 hover:text-green-800 transition-colors"
          >
            🍽️ FoodApp
          </button>

          {/* Navigation Menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              Menu ▼
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <button
                  onClick={() => handleMenuItemClick(menuClickHandlers.handleHomeClick)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 flex items-center gap-2"
                >
                  🏠 Home
                </button>

                <button
                  onClick={() => handleMenuItemClick(menuClickHandlers.handleVegClick)}
                  className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors border-b border-gray-100 flex items-center gap-2"
                >
                  🍃 Veg
                </button>

                <button
                  onClick={() => handleMenuItemClick(menuClickHandlers.handleNonVegClick)}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors border-b border-gray-100 flex items-center gap-2"
                >
                  🍗 Non-Veg
                </button>

                <button
                  onClick={() => handleMenuItemClick(menuClickHandlers.handleBeveragesClick)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  🧋 Beverages
                </button>
                <button
                  onClick={() => handleMenuItemClick(menuClickHandlers.handleTiffinsClick)}
                  className="w-full text-left px-4 py-3 hover:bg-yellow-50 transition-colors border-b border-gray-100 flex items-center gap-2"
                >
                  🍽️ Tiffins
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;