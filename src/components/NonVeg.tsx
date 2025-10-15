import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

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

const NonVeg: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [showSignup, setShowSignup] = useState(false);
  const [currentItem, setCurrentItem] = useState<FoodItem | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [signupForm, setSignupForm] = useState<SignupForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);

  // Use global cart context
  const { cartState, addToCart, updateQuantity, removeFromCart, clearCart, getTotalItems } = useCart();

  // Default non-veg items as fallback
  const defaultNonVegItems: FoodItem[] = [
    {
      id: "1",
      name: "Chicken Biryani",
      description: "Fragrant basmati rice with tender chicken and spices",
      price: 320,
      imageUrl: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop",
      category: "Biryani",
      sellerName: "FoodHome Kitchen",
      preparationTime: 30,
      rating: 4.6,
      isAvailable: true
    },
    {
      id: "2",
      name: "Butter Chicken",
      description: "Tender chicken in rich buttery tomato gravy",
      price: 350,
      imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
      category: "Curry",
      sellerName: "FoodHome Kitchen",
      preparationTime: 25,
      rating: 4.5,
      isAvailable: true
    },
    {
      id: "3",
      name: "Chicken Tikka Masala",
      description: "Grilled chicken chunks in spiced creamy sauce",
      price: 380,
      imageUrl: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop",
      category: "Starter",
      sellerName: "FoodHome Kitchen",
      preparationTime: 20,
      rating: 4.4,
      isAvailable: true
    }
  ];

  useEffect(() => {
    const loadFoodItems = () => {
      try {
        setLoading(true);
        
        // Get all food items from localStorage
        const allFoodItems = JSON.parse(localStorage.getItem('foodItems') || '[]');
        
        // Filter only Non-Veg category items that are available
        const nonVegItems = allFoodItems.filter((item: FoodItem) => 
          item.category === 'Non-Veg' && item.isAvailable !== false
        );

        console.log('Loaded non-veg items from storage:', nonVegItems.length);
        
        // If no items in storage, use default items
        if (nonVegItems.length > 0) {
          setFoodItems(nonVegItems);
        } else {
          setFoodItems(defaultNonVegItems);
          console.log('Using default non-veg items');
        }

      } catch (error) {
        console.error('Error loading food items:', error);
        setFoodItems(defaultNonVegItems);
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

  const handleOrder = (item: FoodItem) => {
    setCurrentItem(item);
    setShowSignup(true);
  };

  const handleAddToCart = (item: FoodItem) => {
    // Convert to CartItem format for global cart
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
      category: item.category || 'Non-Veg'
    };
    
    addToCart(cartItem);
    
    // Auto open cart popup after adding item
    setShowCart(true);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleClearCart = () => {
    clearCart();
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
    if (cartState.items.length > 0) {
      // Order all cart items
      const orderData = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        userId: signupForm.email,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      alert(`🎉 Welcome ${signupForm.name}! Your order for ${cartState.items.length} non-veg items has been placed successfully!`);
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
                ? 'bg-gradient-to-br from-red-400 to-red-600' 
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-red-800 font-semibold">Loading delicious non-vegetarian foods...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 relative overflow-hidden">
      {/* Cart Button */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setShowCart(true)}
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-xl">🛒</span>
          {getTotalItems() > 0 && (
            <span className="bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {getTotalItems()}
            </span>
          )}
        </button>
        {getTotalItems() > 0 && (
          <div className="text-right mt-2 text-sm font-semibold text-gray-700">
            Total: ₹{cartState.totalAmount}
          </div>
        )}
      </div>

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingFoodElements />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center pt-8 pb-12 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-red-800 mb-4">
          🍗 Non-Veg Delights
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Delicious and protein-rich non-vegetarian food made with premium ingredients
        </p>
        
        {/* Items count and source info */}
        <div className="mt-4 flex justify-center items-center gap-4">
          {foodItems.length > 0 && (
            <>
              <p className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
                🍗 {foodItems.length} non-veg items available
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
            {foodItems.length} Non-Vegetarian Dishes Available
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
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-red-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Non-Veg
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
                    <span className="text-2xl font-bold text-red-700">
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
                        className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm"
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
              <div className="text-6xl mb-4">🍗</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Non-Vegetarian Items Available</h3>
              <p className="text-gray-600 mb-4">Sellers haven't added any non-veg items yet.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all duration-200 mr-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">🛒 Your Non-Veg Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-white hover:text-gray-200 text-2xl transition-transform hover:scale-110"
                >
                  ✕
                </button>
              </div>
              <p className="text-orange-100 mt-2">
                {cartState.items.length} {cartState.items.length === 1 ? 'item' : 'items'} in cart
              </p>
            </div>

            {/* Cart Items */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {cartState.items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-6xl">🛒</span>
                  <p className="text-xl mt-4">Your cart is empty</p>
                  <p className="text-sm">Add some delicious non-veg items to get started!</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all duration-200"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-red-600 font-bold">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all duration-200"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all duration-200"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">₹{item.price * item.quantity}</p>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
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
            {cartState.items.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Subtotal:</span>
                    <span className="text-xl font-bold text-gray-800">₹{cartState.totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Delivery Fee:</span>
                    <span className="text-xl font-bold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-300 pt-3">
                    <span className="text-xl font-bold">Total Amount:</span>
                    <span className="text-2xl font-bold text-red-600">₹{cartState.totalAmount}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleClearCart}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowSignup(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    Checkout ₹{cartState.totalAmount}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={signupForm.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={signupForm.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signupForm.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={signupForm.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required
              />
              
              <button
                type="submit"
                className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
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

export default NonVeg;