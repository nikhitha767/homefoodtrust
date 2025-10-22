import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  cartItemsCount?: number;
  favoriteItemsCount?: number;
}

const foodItems = [
  "Veg", "Non-Veg", "Tiffins", "Sandwich", "Soup", "Others"
];

export default function Navbar({ 
  cartItemsCount = 0, 
  favoriteItemsCount = 0 
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [filteredItems, setFilteredItems] = React.useState<string[]>([]);
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();

  // Check if user is seller
  const isSeller = React.useMemo(() => {
    const currentSeller = JSON.parse(localStorage.getItem('currentSeller') || 'null');
    return currentSeller !== null;
  }, []);

  // Get seller name separately
  const sellerName = React.useMemo(() => {
    const currentSeller = JSON.parse(localStorage.getItem('currentSeller') || 'null');
    return currentSeller ? currentSeller.name || currentSeller.restaurantName : null;
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsCategoryMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMenus();
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('currentSeller');
    navigate('/signin');
  };

  // Seller logout function
  const handleSellerLogout = () => {
    localStorage.removeItem('currentSeller');
    navigate('/seller-login');
  };

  // Seller button handler
  const handleSellerClick = () => {
    if (isSeller) {
      navigate('/seller-dashboard');
    } else {
      navigate('/seller-login');
    }
  };

  const handleCategoryMenuEnter = () => {
    setIsCategoryMenuOpen(true);
  };

  const handleCategoryMenuLeave = () => {
    setIsCategoryMenuOpen(false);
  };

  const handleMenuItemClick = (item: string) => {
    if (item === 'Veg') {
      navigate('/veg');
    } else if (item === 'Non-Veg') {
      navigate('/non-veg');
    } else if (item === 'Tiffins') {
      navigate('/tiffins');
    } else if (item === 'Sandwich') {
      navigate('/sandwich');
    } else {
      navigate(`/search?q=${encodeURIComponent(item)}`);
    }
    setIsCategoryMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      const filtered = foodItems.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setFilteredItems([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setSearchQuery('');
    }
  };

  const handleSuggestionClick = (item: string) => {
    setSearchQuery(item);
    navigate(`/search?q=${encodeURIComponent(item)}`);
    setShowSuggestions(false);
  };

  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-800 font-serif">
              FoodHome
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <button 
              onClick={() => handleNavigation('/')}
              className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium rounded-lg transition-colors duration-200"
            >
              Home
            </button>
            
            {/* Category Menu */}
            <div 
              className="relative"
              onMouseEnter={handleCategoryMenuEnter}
              onMouseLeave={handleCategoryMenuLeave}
            >
              <button 
                className="flex items-center px-4 py-2 text-gray-700 hover:text-orange-600 font-medium rounded-lg transition-colors duration-200"
              >
                Menu
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCategoryMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-2">
                    {foodItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleMenuItemClick(item)}
                        className="flex items-center w-full px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200 text-sm"
                      >
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => handleNavigation('/deals')}
              className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium rounded-lg transition-colors duration-200"
            >
              Deals
            </button>

            <button 
              onClick={() => handleNavigation('/about')}
              className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium rounded-lg transition-colors duration-200"
            >
              About
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4 relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for dishes, restaurants..."
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </form>

            {/* Search Suggestions */}
            {showSuggestions && filteredItems.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {filteredItems.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-orange-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showSuggestions && searchQuery && filteredItems.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="px-4 py-3 text-gray-500 text-center">
                  No food items found for "{searchQuery}"
                </div>
              </div>
            )}
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Seller Button */}
            <button 
              onClick={handleSellerClick}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              title={isSeller ? "Seller Dashboard" : "Seller Login"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm font-medium">
                {isSeller ? "Seller" : "Seller"}
              </span>
            </button>

            {/* Admin Button */}
            <button 
              onClick={() => handleNavigation('/admin/dashboard')}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
              title="Admin Panel"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Admin</span>
            </button>

            {/* Favorites Button */}
            <button 
              onClick={() => handleNavigation('/favorites')}
              className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoriteItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoriteItemsCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              onClick={() => handleNavigation('/cart')}
              className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Profile Menu */}
            <div className="relative">
              {isSeller ? (
                <div>
                  <button 
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-orange-600 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{sellerName || "Seller"}</span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button 
                        onClick={() => navigate('/seller-dashboard')}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Seller Dashboard
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button 
                        onClick={handleSellerLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Seller Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : user ? (
                <div>
                  <button 
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-orange-600 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{user.name}</span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button 
                        onClick={() => handleNavigation('/profile')}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </button>
                      <button 
                        onClick={() => handleNavigation('/orders')}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Orders
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => handleNavigation('/signin')}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-orange-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="px-4 py-2 space-y-1">
              <button 
                onClick={() => handleNavigation('/')}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </button>
              
              <div className="border-t border-gray-100 pt-2">
                <div className="px-2 py-1 text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Menu Items
                </div>
                {foodItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleMenuItemClick(item)}
                    className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    {item}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => handleNavigation('/deals')}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l-3-3m0 0l3-3m-3 3h8m3-5v.8A2.2 2.2 0 0115 7h2a2.2 2.2 0 012.2 2.2v6.6A2.2 2.2 0 0117 18h-2a2.2 2.2 0 01-2.2-2.2V15" />
                </svg>
                Deals
              </button>
              <button 
                onClick={() => handleNavigation('/favorites')}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Favorites
                {favoriteItemsCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favoriteItemsCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => handleNavigation('/cart')}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Cart
                {getTotalItems() > 0 && (
                  <span className="ml-auto bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              <button 
                onClick={() => handleNavigation('/profile')}
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={closeMenus}
        ></div>
      )}
    </nav>
  );
}