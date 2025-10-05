// src/components/Tiffins.tsx
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
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
  const [showCart, setShowCart] = useState(false);
  const [signupForm, setSignupForm] = useState<SignupForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Use global cart context
  const { cartState, addToCart, updateQuantity, removeFromCart, clearCart, getTotalItems } = useCart();

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

    fetchTiffinItems();
  }, []);

  // Calculate total amount from global cart
  const totalAmount = cartState.totalAmount;

  const handleOrder = (item: FoodItem) => {
    setCurrentItem(item);
    setShowSignup(true);
  };

  const handleAddToCart = (item: FoodItem) => {
    // Convert to CartItem format for global cart
    const cartItem = {
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      category: item.category
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
    if (cartState.items.length > 0) {
      // Order all cart items
      const orderData = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        userId: signupForm.email,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      alert(`🎉 Welcome ${signupForm.name}! Your order for ${cartState.items.length} tiffin items has been placed successfully!`);
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
          {getTotalItems() > 0 && (
            <span className="bg-white text-yellow-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {getTotalItems()}
            </span>
          )}
        </button>
        {getTotalItems() > 0 && (
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
                {cartState.items.length} {cartState.items.length === 1 ? 'item' : 'items'} in cart
              </p>
            </div>

            {/* Cart Items */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {cartState.items.length === 0 ? (
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
                  {cartState.items.map((item) => (
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
                    <span className="text-2xl font-bold text-yellow-600">₹{cartState.totalAmount}</span>
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
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
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

    </div>
  );
};

export default Tiffins;