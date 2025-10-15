import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cartState, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    alert('Proceeding to checkout!');
    // Add your checkout logic here
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Cart</h1>
            <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
            <button
              onClick={() => navigate('/veg')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition duration-300"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Your Cart</h1>
          <button
            onClick={clearCart}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-6">
          {cartState.items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              
              <div className="flex-1 ml-6">
                <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">${item.price} each</p>
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  item.category === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.category}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-300"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition duration-300"
                  >
                    +
                  </button>
                </div>
                
                <span className="text-xl font-bold text-gray-800 w-20 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-orange-600">${cartState.totalAmount.toFixed(2)}</span>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/veg')}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition duration-300"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;