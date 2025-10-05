// src/components/Veg.tsx
import React, { useState, useEffect } from "react";
import { productService, Product } from '../services/productService';
import { useCart } from '../context/CartContext'; // ✅ ADD THIS IMPORT

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

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: string;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  timestamp: string;
  sellerId?: number;
}

interface Notification {
  id: number;
  type: 'new_order' | 'status_update' | 'system';
  message: string;
  timestamp: string;
  read: boolean;
  orderId?: number;
}

const Veg: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
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
  const [dbError, setDbError] = useState(false); // ✅ NEW: Track database error

  // ✅ ADD THIS LINE - Global cart context
  const { addToCart: addToGlobalCart, getTotalItems } = useCart();

  // ✅ IMPROVED: Default veg items
  const defaultVegItems: FoodItem[] = [
    {
      id: 1,
      name: "Paneer Butter Masala",
      description: "Cottage cheese in rich tomato gravy with butter and cream",
      price: 280,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
      category: "Main Course"
    },
    {
      id: 2,
      name: "Aloo Paratha",
      description: "Whole wheat bread stuffed with spiced potatoes, served with curd",
      price: 120,
      image: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=400&h=300&fit=crop",
      category: "Bread"
    },
    {
      id: 3,
      name: "Vegetable Biryani",
      description: "Fragrant basmati rice cooked with fresh vegetables and aromatic spices",
      price: 220,
      image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
      category: "Rice Dish"
    },
    {
      id: 4,
      name: "Dal Makhani",
      description: "Creamy black lentils slow-cooked with butter and spices",
      price: 180,
      image: "https://images.unsplash.com/photo-1585937421612-70ca4e89d68e?w=400&h=300&fit=crop",
      category: "Curry"
    },
    {
      id: 5,
      name: "Masala Dosa",
      description: "Crispy rice crepe filled with spiced potatoes, served with sambar",
      price: 150,
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop",
      category: "South Indian"
    },
    {
      id: 6,
      name: "Chole Bhature",
      description: "Spicy chickpeas curry served with fluffy fried bread",
      price: 160,
      image: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=400&h=300&fit=crop",
      category: "North Indian"
    },
    {
      id: 7,
      name: "Vegetable Fried Rice",
      description: "Stir-fried rice with mixed vegetables and soy sauce",
      price: 190,
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
      category: "Chinese"
    },
    {
      id: 8,
      name: "Gulab Jamun",
      description: "Sweet milk dumplings soaked in rose-flavored sugar syrup",
      price: 100,
      image: "https://images.unsplash.com/photo-1563724292870-7e44e61a4b98?w=400&h=300&fit=crop",
      category: "Dessert"
    }
  ];

  // ✅ IMPROVED: Fetch products from database with better error handling
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setDbError(false);
        
        const response = await productService.getProducts('veg');
        console.log('Database response:', response); // Debug log
        
        if (response && response.success && response.products) {
          setDbProducts(response.products);
          
          // Convert database products to FoodItem format
          const convertedProducts: FoodItem[] = response.products.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image_url || 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
            category: product.category || 'Main Course'
          }));
          
          setFoodItems(convertedProducts);
          console.log('Loaded from database:', convertedProducts.length, 'items');
        } else {
          // If database fails, use default items
          throw new Error('Database response not valid');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setDbError(true);
        // Use default items if database fails
        setFoodItems(defaultVegItems);
        console.log('Using default items:', defaultVegItems.length, 'items');
      } finally {
        setLoading(false);
      }
    };

    // Load cart from localStorage
    const savedCart = localStorage.getItem('vegCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    fetchProducts();
  }, []);

  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // ✅ NEW FUNCTION: Save order to system for sellers
  const saveOrderToSystem = () => {
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const newOrder: Order = {
      id: Date.now(),
      customerName: signupForm.name,
      customerEmail: signupForm.email,
      customerPhone: signupForm.phone,
      items: cartItems.length > 0 ? cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        type: item.type
      })) : [{
        id: currentItem?.id || 0,
        name: currentItem?.name || '',
        price: currentItem?.price || 0,
        quantity: 1,
        type: 'veg'
      }],
      totalAmount: totalAmount,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    existingOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    // Create notification for sellers
    const notifications = JSON.parse(localStorage.getItem('sellerNotifications') || '[]');
    notifications.push({
      id: Date.now(),
      type: 'new_order',
      message: `🆕 New order #${newOrder.id} from ${signupForm.name} - ₹${totalAmount}`,
      timestamp: new Date().toISOString(),
      read: false,
      orderId: newOrder.id
    });
    localStorage.setItem('sellerNotifications', JSON.stringify(notifications));
  };

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
        type: 'veg',
        image: item.image
      };
      updatedCart = [...cartItems, newCartItem];
    }
    
    setCartItems(updatedCart);
    localStorage.setItem('vegCart', JSON.stringify(updatedCart));
    
    // ✅ ADD THIS: Global cart lo kuda add chey
    const globalCartItem = {
      id: item.id.toString(),
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      category: 'veg'
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

  const removeFromCart = (itemId: number) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('vegCart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('vegCart');
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
    
    // ✅ CALL THE NEW FUNCTION TO SAVE ORDER FOR SELLERS
    saveOrderToSystem();
    
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
      {/* Cart Button - ✅ MODIFIED: Global cart count show chey */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setShowCart(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-xl">🛒</span>
          {/* ✅ CHANGED: Global cart count use chey */}
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
        
        {/* ✅ IMPROVED: Database status display */}
        <div className="mt-4 flex justify-center items-center gap-4">
          {dbProducts.length > 0 ? (
            <p className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              🗃️ Connected to database - {dbProducts.length} items loaded
            </p>
          ) : dbError ? (
            <p className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              ⚠️ Using demo items - Database connection failed
            </p>
          ) : (
            <p className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              📱 Demo vegetarian items loaded
            </p>
          )}
          <p className="text-sm text-gray-600">
            Showing {foodItems.length} delicious items
          </p>
        </div>
      </div>

      {/* Food Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
        {/* ✅ ADDED: Items count header */}
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
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    onError={(e) => {
                      // Fallback image if original fails
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
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
            // ✅ ADDED: Fallback when no items
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🍃</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Vegetarian Items Found</h3>
              <p className="text-gray-600">Please check your database connection or try refreshing the page.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-all duration-200"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Rest of your existing code for Cart Popup and Signup Modal remains same */}
      {/* ... (Cart Popup code) ... */}
      {/* ... (Signup Popup code) ... */}
    </div>
  );
};

export default Veg;