import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">🍽️ Welcome to FoodHome</h1>
          <p className="text-xl mb-8">Delicious food delivered to your doorstep</p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link 
              to="/veg" 
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              🥗 Vegetarian
            </Link>
            <Link 
              to="/non-veg" 
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              🍗 Non-Vegetarian
            </Link>
            <Link 
              to="/tiffins" 
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              🥘 Tiffins
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold mb-4">Fast Delivery</h3>
            <p className="text-gray-600 text-lg">Get your food delivered in 30 minutes or less</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🍃</div>
            <h3 className="text-2xl font-bold mb-4">Fresh Ingredients</h3>
            <p className="text-gray-600 text-lg">100% fresh and hygienic food prepared daily</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-2xl font-bold mb-4">Best Prices</h3>
            <p className="text-gray-600 text-lg">Affordable prices with great quality</p>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Categories</h2>
          <p className="text-xl text-gray-600 mb-8">Explore our delicious food categories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/veg" className="group">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-6xl text-white">🥗</span>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Vegetarian</h3>
                <p className="text-gray-600">Healthy and delicious veg options</p>
              </div>
            </div>
          </Link>

          <Link to="/non-veg" className="group">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                <span className="text-6xl text-white">🍗</span>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Non-Vegetarian</h3>
                <p className="text-gray-600">Tasty chicken and meat dishes</p>
              </div>
            </div>
          </Link>

          <Link to="/tiffins" className="group">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <span className="text-6xl text-white">🥘</span>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Tiffins</h3>
                <p className="text-gray-600">Quick and healthy breakfast options</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;