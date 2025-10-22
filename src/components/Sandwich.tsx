// src/components/Sandwich.tsx
import React, { useState, useEffect } from "react";
import { useCart } from '../context/CartContext'; // ✅ ADD CartContext

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

const Sandwich: React.FC = () => {
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

  // ✅ ADD THIS LINE - Global cart context
  const { addToCart: addToGlobalCart, getTotalItems } = useCart();

  useEffect(() => {
    const fetchSandwichItems = () => {
      const items: FoodItem[] = [
        {
          id: 1,
          name: "Classic Veg Sandwich",
          description: "Fresh bread with cucumber, tomato, lettuce and mayo",
          price: 120,
          image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop",
          category: "Classic"
        },
        {
          id: 2,
          name: "Grilled Cheese Sandwich",
          description: "Toasted bread with melted cheese and butter",
          price: 150,
          image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
          category: "Grilled"
        },
        {
          id: 3,
          name: "Club Sandwich",
          description: "Triple decker with veggies, cheese and sauces",
          price: 180,
          image: "https://images.unsplash.com/photo-1548340747-4761b75b90d9?w=400&h=300&fit=crop",
          category: "Premium"
        },
        {
          id: 4,
          name: "Paneer Tikka Sandwich",
          description: "Spiced cottage cheese with mint chutney in toasted bread",
          price: 160,
          image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop",
          category: "Indian"
        },
        {
          id: 5,
          name: "Bombay Masala Sandwich",
          description: "Spicy potato masala with chutneys and sev",
          price: 140,
          image: "https://images.unsplash.com/photo-1565310022181-41bc6d2d2750?w=400&h=300&fit=crop",
          category: "Street Style"
        },
        {
          id: 6,
          name: "Veggie Delight Sandwich",
          description: "Assorted fresh vegetables with herb mayo",
          price: 130,
          image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop",
          category: "Healthy"
        },
        {
          id: 7,
          name: "Corn & Cheese Sandwich",
          description: "Sweet corn with melted cheese and herbs",
          price: 145,
          image: "https://images.unsplash.com/photo-1481070555726-e2fe8357725c?w=400&h=300&fit=crop",
          category: "Cheesy"
        },
        {
          id: 8,
          name: "Italian Sub Sandwich",
          description: "Herbed bread with olives, tomatoes and dressing",
          price: 170,
          image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop",
          category: "Italian"
        },
        {
          id: 9,
          name: "Mexican Wrap Sandwich",
          description: "Tortilla wrap with beans, corn and salsa",
          price: 165,
          image: "https://images.unsplash.com/photo-1565299585323-38174c13fae8?w=400&h=300&fit=crop",
          category: "Wrap"
        },
        {
          id: 10,
          name: "BBQ Veg Sandwich",
          description: "Grilled vegetables with BBQ sauce and cheese",
          price: 155,
          image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
          category: "Grilled"
        },
        {
          id: 11,
          name: "Cucumber Tea Sandwich",
          description: "Elegant thin bread with cucumber and cream cheese",
          price: 110,
          image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=300&fit=crop",
          category: "Tea Time"
        },
        {
          id: 12,
          name: "Garlic Bread Sandwich",
          description: "Garlic butter toasted bread with herb filling",
          price: 135,
          image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400&h=300&fit=crop",
          category: "Garlic"
        }
      ];
      setFoodItems(items);
    };

    // Load cart from localStorage
    const savedCart = localStorage.getItem('sandwichCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    fetchSandwichItems();
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
        type: 'sandwich',
        image: item.image
      };
      updatedCart = [...cartItems, newCartItem];
    }
    
    setCartItems(updatedCart);
    localStorage.setItem('sandwichCart', JSON.stringify(updatedCart));
    
    // ✅ ADD THIS: Global cart lo kuda add chey
    const globalCartItem = {
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      category: 'sandwich'
    };
    addToGlobalCart(globalCartItem);
    
    // Auto open cart popup after adding item
    setShowCart(true);
  };

  const updateCartQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item if quantity is 0
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCart);
      localStorage.setItem('sandwichCart', JSON.stringify(updatedCart));
    } else {
      // Update quantity
      const updatedCart = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      localStorage.setItem('sandwichCart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (itemId: number) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('sandwichCart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('sandwichCart');
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
      alert(`🎉 Welcome ${signupForm.name}! Your order for ${cartItems.length} sandwich items has been placed successfully!`);
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
                ? 'bg-gradient-to-br from-amber-400 to-amber-600' 
                : index % 3 === 1 
                ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                : 'bg-gradient-to-br from-yellow-400 to-yellow-600'
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 relative overflow-hidden">
      {/* Cart Button - ✅ MODIFIED: Global cart count show chey */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setShowCart(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-xl">🛒</span>
          {/* ✅ CHANGED: Global cart count use chey */}
          <span className="bg-white text-amber-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
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
        <h1 className="text-4xl md:text-6xl font-bold text-amber-800 mb-4">
          🥪 Sandwich Corner
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Freshly made sandwiches with premium ingredients and delicious fillings
        </p>
        <p className="text-sm text-amber-600 mt-4">
          {foodItems.length} delicious sandwich varieties available
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
                  onError={(e) => {
                    // Fallback image if original fails
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
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
                  <span className="text-2xl font-bold text-amber-700">
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
                      className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm"
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
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">🛒 Your Sandwich Cart</h2>
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
                  <p className="text-sm">Add some delicious sandwiches to get started!</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-all duration-200"
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
                        <p className="text-amber-600 font-bold">₹{item.price} each</p>
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
                    <span className="text-2xl font-bold text-amber-600">₹{totalAmount}</span>
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
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
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

      {/* Signup Form Popup */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Complete Your Order</h2>
                <button
                  onClick={() => setShowSignup(false)}
                  className="text-white hover:text-gray-200 text-2xl transition-transform hover:scale-110"
                >
                  ✕
                </button>
              </div>
              <p className="text-orange-100 mt-2">
                {currentItem ? `Ordering: ${currentItem.name}` : `Ordering ${cartItems.length} items`}
              </p>
            </div>

            <form onSubmit={handleSignupSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={signupForm.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={signupForm.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={signupForm.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={signupForm.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={signupForm.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                {currentItem ? `Order ${currentItem.name} - ₹${currentItem.price}` : `Place Order - ₹${totalAmount}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sandwich;