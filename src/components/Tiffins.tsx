// src/components/Tiffins.tsx
import React, { useState, useEffect } from "react";

interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: string;
  image: string;
}

interface SignupForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Tiffins: React.FC = () => {
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

  useEffect(() => {
    const fetchTiffinItems = () => {
      const items: FoodItem[] = [
        {
          id: 1,
          name: "Idli Sambar",
          description: "Soft rice cakes with lentil soup and coconut chutney",
          price: 60,
          image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop",
          category: "Breakfast"
        },
        {
          id: 2,
          name: "Masala Dosa",
          description: "Crispy crepe with spiced potato filling and chutneys",
          price: 80,
          image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&h=300&fit=crop",
          category: "Breakfast"
        },
        {
          id: 3,
          name: "Pongal",
          description: "Comforting rice and lentil dish with ghee and spices",
          price: 70,
          image: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=400&h=300&fit=crop",
          category: "Breakfast"
        },
        {
          id: 4,
          name: "Upma",
          description: "Savory semolina porridge with vegetables and spices",
          price: 50,
          image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop",
          category: "Breakfast"
        },
        {
          id: 5,
          name: "Puri Bhaji",
          description: "Deep fried bread with spiced potato curry",
          price: 75,
          image: "https://images.unsplash.com/photo-1551782455-6b0a6b4e415a?w=400&h=300&fit=crop",
          category: "Breakfast"
        },
        {
          id: 6,
          name: "Vada Sambar",
          description: "Crispy lentil donuts with aromatic lentil soup",
          price: 65,
          image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
          category: "Breakfast"
        },
        {
          id: 7,
          name: "Uttapam",
          description: "Thick savory pancake with vegetables and chutneys",
          price: 85,
          image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
          category: "Breakfast"
        },
        {
          id: 8,
          name: "Medu Vada",
          description: "Soft and fluffy lentil donuts with coconut chutney",
          price: 55,
          image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop",
          category: "Snack"
        }
      ];
      setFoodItems(items);
    };

    // Load cart from localStorage
    const savedCart = localStorage.getItem('tiffinCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    fetchTiffinItems();
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
        type: 'tiffin',
        image: item.image
      };
      updatedCart = [...cartItems, newCartItem];
    }
    
    setCartItems(updatedCart);
    localStorage.setItem('tiffinCart', JSON.stringify(updatedCart));
    
    // Auto open cart popup after adding item
    setShowCart(true);
  };

  const updateCartQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item if quantity is 0
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCart);
      localStorage.setItem('tiffinCart', JSON.stringify(updatedCart));
    } else {
      // Update quantity
      const updatedCart = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      localStorage.setItem('tiffinCart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (itemId: number) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('tiffinCart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('tiffinCart');
    setShowCart(false); // Close cart after clearing
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
      alert(`🎉 Welcome ${signupForm.name}! Your order for ${cartItems.length} tiffin items has been placed successfully!`);
      clearCart(); // Clear cart after successful order
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
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
                : index % 3 === 1 
                ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                : 'bg-gradient-to-br from-amber-400 to-amber-600'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 relative overflow-hidden">
      {/* Cart Button */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setShowCart(true)}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-xl">🛒</span>
          {cartItems.length > 0 && (
            <span className="bg-white text-yellow-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </span>
          )}
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
        <h1 className="text-4xl md:text-6xl font-bold text-yellow-800 mb-4">
          🍽️ Tiffin Delights
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Fresh and delicious breakfast tiffins to start your day with energy
        </p>
      </div>

      {/* Food Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {foodItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-2xl">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    {item.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              <div className="p-5 sm:p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-yellow-700">
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
                      className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Popup */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">🛒 Your Tiffin Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-white hover:text-gray-200 text-2xl transition-transform hover:scale-110"
                >
                  ✕
                </button>
              </div>
              <p className="text-orange-100 mt-2">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
              </p>
            </div>

            {/* Cart Items */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-6xl">🛒</span>
                  <p className="text-xl mt-4">Your cart is empty</p>
                  <p className="text-sm">Add some delicious tiffin items to get started!</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-all duration-200"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-yellow-600 font-bold">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all duration-200"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all duration-200"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm mt-1 transition-all duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Subtotal:</span>
                    <span className="text-xl font-bold text-gray-800">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Delivery Fee:</span>
                    <span className="text-xl font-bold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-300 pt-3">
                    <span className="text-xl font-bold">Total Amount:</span>
                    <span className="text-2xl font-bold text-yellow-600">₹{totalAmount}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowSignup(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    Checkout ₹{totalAmount}
                  </button>
                </div>
                
                <button
                  onClick={() => setShowCart(false)}
                  className="w-full mt-3 bg-transparent hover:bg-gray-200 text-gray-600 py-2 px-6 rounded-lg font-semibold transition-all duration-200 border border-gray-300"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Signup Popup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {/* Animated Background Images - Black Background lo Top to Bottom Moving */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Moving tiffin food images from top to bottom in black background */}
            <div className="absolute -top-8 left-10 w-8 h-8 opacity-30 animate-moveDown1">
              <span className="text-2xl">🍽️</span>
            </div>
            <div className="absolute -top-16 right-12 w-7 h-7 opacity-40 animate-moveDown2">
              <span className="text-xl">🥘</span>
            </div>
            <div className="absolute -top-24 left-20 w-9 h-9 opacity-35 animate-moveDown3">
              <span className="text-2xl">🍛</span>
            </div>
            <div className="absolute -top-32 right-24 w-6 h-6 opacity-30 animate-moveDown4">
              <span className="text-lg">🥗</span>
            </div>
            <div className="absolute -top-40 left-32 w-8 h-8 opacity-45 animate-moveDown5">
              <span className="text-xl">🍲</span>
            </div>
            <div className="absolute -top-48 right-16 w-7 h-7 opacity-35 animate-moveDown6">
              <span className="text-xl">🥣</span>
            </div>
            <div className="absolute -top-56 left-28 w-6 h-6 opacity-40 animate-moveDown7">
              <span className="text-lg">🍴</span>
            </div>
            <div className="absolute -top-64 right-28 w-9 h-9 opacity-30 animate-moveDown8">
              <span className="text-2xl">🍽️</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-auto relative z-10">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-t-2xl p-4 text-white">
              <h2 className="text-xl font-bold text-center">
                🍽️ Sign Up to Order
              </h2>
              {currentItem && (
                <p className="text-center text-orange-100 text-sm mt-1">
                  Ordering: <span className="font-semibold">{currentItem.name}</span>
                </p>
              )}
              {cartItems.length > 0 && (
                <p className="text-center text-orange-100 text-sm mt-1">
                  Total: <span className="font-semibold">₹{totalAmount}</span>
                </p>
              )}
            </div>

            <form onSubmit={handleSignupSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={signupForm.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={signupForm.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={signupForm.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={signupForm.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create password"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={signupForm.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm password"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSignup(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105"
                >
                  {cartItems.length > 0 ? `Pay ₹${totalAmount}` : 'Sign Up & Order'}
                </button>
              </div>

              <p className="text-center text-xs text-gray-500 mt-2">
                By signing up, you agree to our Terms
              </p>
            </form>
          </div>

          {/* Custom Animations for Moving Images */}
          <style>{`
            @keyframes moveDown1 {
              0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
              10% { opacity: 0.3; }
              90% { opacity: 0.3; }
              100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
            @keyframes moveDown2 {
              0% { transform: translateY(-150px) rotate(0deg); opacity: 0; }
              15% { opacity: 0.4; }
              85% { opacity: 0.4; }
              100% { transform: translateY(100vh) rotate(-360deg); opacity: 0; }
            }
            @keyframes moveDown3 {
              0% { transform: translateY(-200px) rotate(0deg); opacity: 0; }
              20% { opacity: 0.35; }
              80% { opacity: 0.35; }
              100% { transform: translateY(100vh) rotate(180deg); opacity: 0; }
            }
            @keyframes moveDown4 {
              0% { transform: translateY(-120px) rotate(0deg); opacity: 0; }
              25% { opacity: 0.3; }
              75% { opacity: 0.3; }
              100% { transform: translateY(100vh) rotate(-180deg); opacity: 0; }
            }
            @keyframes moveDown5 {
              0% { transform: translateY(-180px) rotate(0deg); opacity: 0; }
              30% { opacity: 0.45; }
              70% { opacity: 0.45; }
              100% { transform: translateY(100vh) rotate(270deg); opacity: 0; }
            }
            @keyframes moveDown6 {
              0% { transform: translateY(-140px) rotate(0deg); opacity: 0; }
              35% { opacity: 0.35; }
              65% { opacity: 0.35; }
              100% { transform: translateY(100vh) rotate(-270deg); opacity: 0; }
            }
            @keyframes moveDown7 {
              0% { transform: translateY(-160px) rotate(0deg); opacity: 0; }
              40% { opacity: 0.4; }
              60% { opacity: 0.4; }
              100% { transform: translateY(100vh) rotate(90deg); opacity: 0; }
            }
            @keyframes moveDown8 {
              0% { transform: translateY(-220px) rotate(0deg); opacity: 0; }
              45% { opacity: 0.3; }
              55% { opacity: 0.3; }
              100% { transform: translateY(100vh) rotate(-90deg); opacity: 0; }
            }
            
            .animate-moveDown1 { animation: moveDown1 12s infinite linear; }
            .animate-moveDown2 { animation: moveDown2 15s infinite linear; }
            .animate-moveDown3 { animation: moveDown3 18s infinite linear; }
            .animate-moveDown4 { animation: moveDown4 10s infinite linear; }
            .animate-moveDown5 { animation: moveDown5 14s infinite linear; }
            .animate-moveDown6 { animation: moveDown6 16s infinite linear; }
            .animate-moveDown7 { animation: moveDown7 11s infinite linear; }
            .animate-moveDown8 { animation: moveDown8 20s infinite linear; }
          `}</style>
        </div>
      )}

      <style>{`
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.1; }
          90% { opacity: 0.1; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        .animate-float { animation: float 15s infinite linear; }
      `}</style>
    </div>
  );
};

export default Tiffins;