// src/components/Veg.tsx
import React, { useState, useEffect } from "react";
import { useCart } from '../context/CartContext';

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  sellerName: string;
  preparationTime: number;
  rating: number;
  isAvailable: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface SignupForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Veg: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [showSignup, setShowSignup] = useState(false);
  const [currentItem, setCurrentItem] = useState<FoodItem | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [signupForm, setSignupForm] = useState<SignupForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);

  // Global cart context
  const { addToCart: addToGlobalCart, getTotalItems } = useCart();

  // Default veg items as fallback
  const defaultVegItems: FoodItem[] = [
    {
      id: "1",
      name: "Paneer Butter Masala",
      description: "Cottage cheese in rich tomato gravy with butter and cream",
      price: 280,
      imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
      category: "Main Course",
      sellerName: "FoodHome Kitchen",
      preparationTime: 25,
      rating: 4.5,
      isAvailable: true
    },
    {
      id: "2",
      name: "Aloo Paratha",
      description: "Whole wheat bread stuffed with spiced potatoes, served with curd",
      price: 120,
      imageUrl: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=400&h=300&fit=crop",
      category: "Bread",
      sellerName: "FoodHome Kitchen",
      preparationTime: 15,
      rating: 4.3,
      isAvailable: true
    },
    {
      id: "3",
      name: "Vegetable Biryani",
      description: "Fragrant basmati rice cooked with fresh vegetables and aromatic spices",
      price: 220,
      imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
      category: "Rice Dish",
      sellerName: "FoodHome Kitchen",
      preparationTime: 30,
      rating: 4.6,
      isAvailable: true
    }
  ];

  // Load food items from localStorage
  useEffect(() => {
    const loadFoodItems = () => {
      try {
        setLoading(true);
        
        // Get all food items from localStorage
        const allFoodItems = JSON.parse(localStorage.getItem('foodItems') || '[]');
        
        // Filter only Veg category items that are available
        const vegItems = allFoodItems.filter((item: FoodItem) => 
          item.category === 'Veg' && item.isAvailable !== false
        );

        console.log('Loaded veg items from storage:', vegItems.length);
        
        // If no items in storage, use default items
        if (vegItems.length > 0) {
          setFoodItems(vegItems);
        } else {
          setFoodItems(defaultVegItems);
          console.log('Using default veg items');
        }

        // Load cart from localStorage
        const savedCart = localStorage.getItem('vegCart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }

      } catch (error) {
        console.error('Error loading food items:', error);
        setFoodItems(defaultVegItems);
      } finally {
        setLoading(false);
      }
    };

    loadFoodItems();

    // Listen for storage changes (when new items are added)
    const handleStorageChange = () => {
      loadFoodItems();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleOrder = (item: FoodItem) => {
    setCurrentItem(item);
    setShowSignup(true);
  };

  const handleAddToCart = (item: FoodItem) => {
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    
    let updatedCart: CartItem[];
    
    if (existingItemIndex >= 0) {
      // Item already in cart, increase quantity
      updatedCart = cartItems.map((cartItem, index) => 
        index === existingItemIndex 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      // New item to cart
      const newCartItem: CartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        imageUrl: item.imageUrl
      };
      updatedCart = [...cartItems, newCartItem];
    }
    
    setCartItems(updatedCart);
    localStorage.setItem('vegCart', JSON.stringify(updatedCart));
    
    // ✅ FIXED: Add to global cart with correct object structure
    const globalCartItem = {
  id: item.id,
  name: item.name,
  price: item.price,
  quantity: 1,
  imageUrl: item.imageUrl,
  category: item.category || 'Veg'
};
addToGlobalCart(globalCartItem);
    
    // Auto open cart popup after adding item
    setShowCart(true);
  };

   const updateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item if quantity is 0
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCart);
      localStorage.setItem('vegCart', JSON.stringify(updatedCart));
    } else {
      // Update quantity
      const updatedCart = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      localStorage.setItem('vegCart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('vegCart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('vegCart');
    setShowCart(false);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!signupForm.email || !signupForm.name || !signupForm.phone) {
      alert("Please fill all required fields!");
      return;
    }

    const userData = {
      ...signupForm,
      signupDate: new Date().toISOString()
    };

    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Handle order from cart or single item
    if (cartItems.length > 0) {
      // Order all cart items
      const orderData = {
        items: cartItems,
        totalAmount: totalAmount,
        userId: signupForm.email,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      alert(`🎉 Welcome ${signupForm.name}! Your order for ${cartItems.length} items has been placed successfully!`);
      clearCart();
    } else if (currentItem) {
      // Single item order
      const orderData = {
        itemId: currentItem.id,
        itemName: currentItem.name,
        price: currentItem.price,
        userId: signupForm.email,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      alert(`🎉 Welcome ${signupForm.name}! Your order for ${currentItem.name} has been placed successfully!`);
    }

    setSignupForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setShowSignup(false);
    setCurrentItem(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const FloatingFoodElements = () => {
    return (
      <>
        {[...Array(15)].map((_, index) => (
          <div
            key={index}
            className={`absolute w-8 h-8 sm:w-10 sm:h-10 rounded-full opacity-10 animate-float ${
              index % 3 === 0 
                ? 'bg-gradient-to-br from-green-400 to-green-600' 
                : index % 3 === 1 
                ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                : 'bg-gradient-to-br from-blue-400 to-blue-600'
            }`}
            style={{
              left: `${(index * 7) % 100}%`,
              animationDelay: `${index * 2}s`,
              animationDuration: `${15 + (index % 10)}s`
            }}
          ></div>
        ))}
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-800 font-semibold">Loading delicious vegetarian foods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 relative overflow-hidden">
      {/* Cart Button */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setShowCart(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-xl">🛒</span>
          <span className="bg-white text-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
            {getTotalItems()}
          </span>
        </button>
        {cartItems.length > 0 && (
          <div className="text-right mt-2 text-sm font-semibold text-gray-700">
            Total: ₹{totalAmount}
          </div>
        )}
      </div>

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingFoodElements />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pt-8 pb-12 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-4">
          🍃 Vegetarian Delights
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Fresh, healthy, and delicious vegetarian food made with love and traditional recipes
        </p>
        
        {/* Items count and source info */}
        <div className="mt-4 flex justify-center items-center gap-4">
          {foodItems.length > 0 && (
            <>
              <p className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                🍃 {foodItems.length} vegetarian items available
              </p>
              {foodItems.some(item => item.sellerName && item.sellerName !== 'FoodHome Kitchen') && (
                <p className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  🛍️ Items from multiple sellers
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Food Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-700">
            {foodItems.length} Vegetarian Dishes Available
          </h2>
          <p className="text-gray-600 mt-2">Click "Add to Cart" to add items to your cart</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {foodItems.length > 0 ? (
            foodItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-2xl">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Veg
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  {/* Seller and prep time info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>By {item.sellerName}</span>
                    <span>{item.preparationTime} mins</span>
                  </div>

                  {/* Rating */}
                  {item.rating > 0 && (
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'fill-current' : 'text-gray-300'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">({item.rating})</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-700">
                      ₹{item.price}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleOrder(item)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🍃</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Vegetarian Items Available</h3>
              <p className="text-gray-600 mb-4">Sellers haven't added any vegetarian items yet.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-all duration-200 mr-2"
              >
                Refresh
              </button>
              <button
                onClick={() => window.location.href = '/FoodItemsForm'}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all duration-200"
              >
                Add Food Items
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cart Popup */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Your Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center space-x-3">
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-green-600 font-bold">₹{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {cartItems.length > 0 && (
              <div className="p-6 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-green-700">₹{totalAmount}</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => setShowSignup(true)}
                    className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Signup Popup */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Complete Your Order</h3>
                <button
                  onClick={() => setShowSignup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSignupSubmit} className="p-6 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={signupForm.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={signupForm.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={signupForm.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signupForm.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={signupForm.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
              
              <button
                type="submit"
                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                Place Order
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Veg;