// src/components/FoodItemsForm.tsx - UPDATED WITH BACK BUTTON
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FoodItem {
  id?: string;
  imageUrl: string;
  itemName: string;
  description: string;
  address: string;
  price: number;
  rating: number;
  category: 'Veg' | 'Non-Veg' | 'tiffins' | 'Sandwich' | 'Soup' | 'Others' | '';
  imageFile?: File;
  sellerId?: string;
  sellerName?: string;
  preparationTime?: number;
  isAvailable?: boolean;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const FoodItemForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [foodItem, setFoodItem] = useState<FoodItem>({
    imageUrl: '',
    itemName: '',
    description: '',
    address: '',
    price: 0,
    rating: 0,
    category: '',
    preparationTime: 30,
    isAvailable: true
  });

  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Veg', 'Non-Veg', 'tiffins', 'Sandwich', 'Soup', 'Others'];

  // Toast system
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFoodItem(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' || name === 'preparationTime' ? parseFloat(value) || 0 : value
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageFile(files[0]);
    }
  };

  const handleImageFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      // Convert file to base64 for proper storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        setPreviewUrl(base64Image);
        setFoodItem(prev => ({
          ...prev,
          imageFile: file,
          imageUrl: base64Image
        }));
        showToast('Image uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    } else {
      showToast('Please upload a valid image file', 'error');
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFoodItem(prev => ({ ...prev, imageUrl: url }));
    setPreviewUrl(url);
  };

  const handleRatingClick = (rating: number) => {
    setFoodItem(prev => ({ ...prev, rating }));
  };

  const handleCategorySelect = (category: FoodItem['category']) => {
    setFoodItem(prev => ({ ...prev, category }));
  };

  // CORRECTED: Save handler - Seller Dashboard ki redirect avuthundi
  const handleSave = async () => {
    if (!user) {
      showToast('Please sign in to add food items', 'error');
      navigate('/seller-login');
      return;
    }

    // Validate required fields
    if (!foodItem.itemName.trim()) {
      showToast('Please enter item name', 'error');
      return;
    }
    if (!foodItem.description.trim()) {
      showToast('Please enter description', 'error');
      return;
    }
    if (!foodItem.imageUrl) {
      showToast('Please add an image', 'error');
      return;
    }
    if (!foodItem.category) {
      showToast('Please select food category', 'error');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create food item object with proper image handling
      const newFoodItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...foodItem,
        sellerId: user.id.toString(),
        sellerName: user.name,
        isAvailable: true,
        // Ensure imageUrl is properly set (either base64 or URL)
        imageUrl: foodItem.imageUrl
      };

      // Get existing food items from localStorage
      const existingFoodItems = JSON.parse(localStorage.getItem('foodItems') || '[]');
      
      // Add new food item
      const updatedFoodItems = [...existingFoodItems, newFoodItem];
      localStorage.setItem('foodItems', JSON.stringify(updatedFoodItems));

      showToast(`"${foodItem.itemName}" added to ${foodItem.category} menu! 🎉`, 'success');
      
      // CORRECTED: Redirect to seller dashboard after save
      setTimeout(() => {
        navigate('/seller-dashboard');
        setIsSubmitting(false);
      }, 1500);
      
    } catch (error) {
      showToast('Failed to save food item. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    setFoodItem({
      imageUrl: '',
      itemName: '',
      description: '',
      address: '',
      price: 0,
      rating: 0,
      category: '',
      preparationTime: 30,
      isAvailable: true
    });
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showToast('Form cleared', 'info');
  };

  // ADDED: Back to Dashboard handler
  const handleBackToDashboard = () => {
    navigate('/seller-dashboard');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const openFullscreenPreview = () => {
    if (previewUrl) {
      setShowFullscreenPreview(true);
    }
  };

  const closeFullscreenPreview = () => {
    setShowFullscreenPreview(false);
  };

  // Seller info display
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Seller Access Required</h2>
          <p className="text-gray-600 mb-6">Please sign in as a seller to add food items</p>
          <button 
            onClick={() => navigate('/seller-login')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            Sign In as Seller
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8 px-4">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`transform transition-all duration-300 ease-in-out ${
              toast.type === 'success' 
                ? 'bg-green-500 border-green-600' 
                : toast.type === 'error'
                ? 'bg-red-500 border-red-600'
                : 'bg-blue-500 border-blue-600'
            } text-white px-6 py-3 rounded-lg shadow-lg border-l-4 flex items-center space-x-2 animate-slide-in`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Fullscreen Image Preview */}
      {showFullscreenPreview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-40 flex items-center justify-center p-4 animate-fade-in"
          onClick={closeFullscreenPreview}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeFullscreenPreview}
              className="absolute -top-12 right-0 text-white hover:text-orange-300 transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={previewUrl}
              alt="Fullscreen preview"
              className="max-w-full max-h-full object-contain rounded-lg transform scale-95 hover:scale-100 transition-transform duration-500"
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* ADDED: Back to Dashboard Button */}
        <div className="mb-6">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:shadow-2xl transition-all duration-300">
          {/* Header with Animated Gradient */}
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="relative">
              <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in-up">
                Add New Food Item
              </h1>
              <p className="text-orange-100 text-lg animate-fade-in-up animation-delay-100">
                Sell your delicious food to our customers
              </p>
              <div className="mt-2 text-orange-200 animate-fade-in-up animation-delay-200">
                Seller: <span className="font-semibold">{user.name}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              {/* Left Column - Form */}
              <div className="space-y-8">
                {/* Image Upload Section */}
                <div className="space-y-4 animate-fade-in-up animation-delay-200">
                  <label className="block text-lg font-semibold text-gray-800">
                    Food Image *
                  </label>
                  
                  {/* Drag and Drop Area */}
                  <div
                    className={`border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 transform ${
                      isDragging 
                        ? 'border-orange-500 bg-orange-50 scale-105 shadow-lg' 
                        : 'border-gray-300 hover:border-orange-400 hover:scale-102'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInput}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg text-gray-700 font-medium">
                          <span className="text-orange-500 font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* OR Divider with Animation */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-4 bg-white text-gray-500 text-sm font-medium transform -translate-y-1">
                        OR
                      </span>
                    </div>
                  </div>

                  {/* Image URL Input */}
                  <div className="transform transition-all duration-300 hover:scale-101">
                    <input
                      type="url"
                      placeholder="Paste image URL here..."
                      value={foodItem.imageUrl}
                      onChange={handleImageUrlChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="animate-fade-in-up animation-delay-300">
                  <label className="block text-lg font-semibold text-gray-800 mb-4">
                    Food Category *
                  </label>
                  <select
                    name="category"
                    value={foodItem.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm transform hover:scale-101"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Item Name */}
                <div className="animate-fade-in-up animation-delay-400">
                  <label className="block text-lg font-semibold text-gray-800 mb-2">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    value={foodItem.itemName}
                    onChange={handleInputChange}
                    placeholder="Enter delicious food name..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm transform hover:scale-101"
                    required
                  />
                </div>

                {/* Description */}
                <div className="animate-fade-in-up animation-delay-500">
                  <label className="block text-lg font-semibold text-gray-800 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={foodItem.description}
                    onChange={handleInputChange}
                    placeholder="Describe the taste, ingredients, and special features..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm resize-none transform hover:scale-101"
                    required
                  />
                </div>

                {/* Address and Preparation Time */}
                <div className="grid grid-cols-2 gap-6 animate-fade-in-up animation-delay-600">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={foodItem.address}
                      onChange={handleInputChange}
                      placeholder="Restaurant or location address..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">
                      Prep Time (mins)
                    </label>
                    <input
                      type="number"
                      name="preparationTime"
                      value={foodItem.preparationTime || ''}
                      onChange={handleInputChange}
                      placeholder="30"
                      min="1"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm"
                    />
                  </div>
                </div>

                {/* Price and Rating */}
                <div className="grid grid-cols-2 gap-6 animate-fade-in-up animation-delay-700">
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={foodItem.price || ''}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-3 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">
                      Rating
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          className="p-1 transition-all duration-300 transform hover:scale-125 hover:rotate-12"
                        >
                          <svg
                            className={`w-8 h-8 transition-all duration-300 ${
                              star <= foodItem.rating
                                ? 'text-yellow-400 fill-current transform scale-110'
                                : 'text-gray-300 hover:text-yellow-200'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-800 animate-fade-in-up">
                  Live Preview
                </h3>
                
                {/* Preview Card */}
                <div 
                  className="bg-white border-2 border-gray-200 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:scale-102 cursor-pointer"
                  onClick={openFullscreenPreview}
                >
                  {/* Image Preview */}
                  <div className="relative">
                    <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-gray-100 to-gray-200">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-64 object-cover transition-transform duration-700 hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-64 flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Category Badge */}
                    {foodItem.category && (
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg ${
                        foodItem.category === 'Veg' ? 'bg-green-500' :
                        foodItem.category === 'Non-Veg' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}>
                        {foodItem.category}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-2xl font-bold text-gray-900 line-clamp-1">
                        {foodItem.itemName || 'Delicious Food Item'}
                      </h4>
                      <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
                        <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">
                          {foodItem.rating > 0 ? foodItem.rating.toFixed(1) : '0.0'}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 leading-relaxed line-clamp-2">
                      {foodItem.description || 'A wonderful description of this amazing food item will appear here...'}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{foodItem.preparationTime || 30} mins</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="truncate max-w-32">{foodItem.address || 'Location not specified'}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-3xl font-bold text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        ₹{foodItem.price > 0 ? foodItem.price.toFixed(2) : '0.00'}
                      </span>
                      <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        By {user.name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4 animate-fade-in-up animation-delay-800">
                  <button
                    onClick={handleDiscard}
                    disabled={isSubmitting}
                    className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl relative overflow-hidden"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Add to {foodItem.category || 'Menu'}</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .hover-scale-101:hover { transform: scale(1.01); }
        .hover-scale-102:hover { transform: scale(1.02); }
        .text-gradient { background-clip: text; -webkit-background-clip: text; }
      `}</style>
    </div>
  );
};

export default FoodItemForm;