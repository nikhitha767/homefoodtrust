import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

export default function HomeBody() {
  const navigate = useNavigate();
  
  // Direct navigation function
  const navigateToFoodForm = () => {
    navigate('/food-item-form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Delicious Food
                <span className="text-orange-600 block">Delivered to</span>
                Your Doorstep
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Experience the finest cuisine from top restaurants in your city.
                Fresh, hot, and ready when you are.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/veg')}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Order Now
                </button>
                <button
                  onClick={() => navigate('/veg')}
                  className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                >
                  View Menu
                </button>
                <button
                  onClick={navigateToFoodForm}
                  className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Add Food
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Delicious Pizza"
                  className="rounded-2xl shadow-2xl w-full h-80 md:h-96 object-cover"
                />
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-400 rounded-full opacity-20 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FoodHome?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We bring the best dining experience to your home with quality, speed, and convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your food delivered in 30 minutes or less. Hot, fresh, and on time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Assured</h3>
              <p className="text-gray-600">
                Every dish is prepared with the finest ingredients and highest standards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Payment</h3>
              <p className="text-gray-600">
                Multiple payment options including cash, card, and digital wallets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600">Explore our wide range of delicious food categories</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Category 1 - Veg */}
            <div
              className="bg-white rounded-2xl p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/veg')}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥗</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Vegetarian</h3>
              <p className="text-sm text-gray-600">Fresh & healthy</p>
            </div>

            {/* Category 2 - Non Veg */}
            <div
              className="bg-white rounded-2xl p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/non-veg')}
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍗</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Non-Veg</h3>
              <p className="text-sm text-gray-600">Juicy and delicious</p>
            </div>

            {/* Category 3 - Tiffins */}
            <div
              className="bg-white rounded-2xl p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/tiffins')}
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍛</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tiffins</h3>
              <p className="text-sm text-gray-600">Quick meals</p>
            </div>

            {/* Category 4 */}
            <div
              className="bg-white rounded-2xl p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/veg')}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍰</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Desserts</h3>
              <p className="text-sm text-gray-600">Sweet treats</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Special Offer"
                className="rounded-2xl shadow-2xl w-full h-80 object-cover transform hover:scale-105 transition-transform duration-500"
              />
              {/* Badge */}
              <div className="absolute -top-4 -right-4 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-lg animate-pulse">
                50% OFF
              </div>
            </div>

            {/* Right Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Special Weekend Offer!
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Enjoy 50% off on all orders above $30. Use code:
                <span className="font-bold text-orange-500"> WEEKEND50</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Valid on weekends only
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Minimum order $30
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free delivery included
                </li>
              </ul>
              <button
                onClick={() => navigate('/veg')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Grab This Offer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Download App */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Download Our Mobile App
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Get exclusive app-only deals and faster ordering. Available on iOS and Android.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.924 17.315c-.057.174-.193.332-.348.367-.156.035-.34-.053-.483-.227-.143-.174-.186-.395-.129-.569.057-.174.193-.332.348-.367.156-.035.34.053.483.227.143.174.186.395.129.569zm-1.564-3.266c-.114.348-.4.624-.695.69-.295.066-.614-.078-.82-.402-.206-.324-.252-.734-.138-1.082.114-.348.4-.624.695-.69.295-.066.614.078.82.402.206.324.252.734.138 1.082zm-2.36-4.12c-.171.52-.598.93-1.054 1.017-.456.087-.95-.163-1.23-.614-.28-.45-.342-1.02-.171-1.54.171-.52.598-.93 1.054-1.017.456-.087.95.163 1.23.614.28.45.342 1.02.171 1.54zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.5 14.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
              App Store
            </button>
            <button className="bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 10.937a.99.99 0 01-.264.187l10.2-13.426zm-2.302-2.302L10.2 7.083 2.734 1.608a.99.99 0 01.187.264l10.278 10.533zM21.392 2.734L15.907 7.08 13.792 12l2.115 4.92 5.485 4.346a.99.99 0 01.187-.264l-10.2-13.426 10.2-13.426a.99.99 0 01-.187.264z" />
              </svg>
              Google Play
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}