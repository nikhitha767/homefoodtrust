// handlers/vegClickHandlers.ts

// Simple version without navigationService - remove import
// import { navigationService } from '../services/navigationService';

export const vegClickHandlers = {
  // Navigation handlers (without navigationService)
  handleVegMenuClick: () => {
    console.log('Veg menu item clicked - redirecting to veg page');
    // Simple navigation without service
    if (window.location.pathname !== '/veg') {
      window.location.href = '/veg';
    }
  },

  handleVegCategoryClick: (category: string) => {
    console.log(`Veg category selected: ${category}`);
    // Simple navigation without service
    window.location.href = `/veg/${category.toLowerCase()}`;
  },

  // Order handlers
  handleVegOrderClick: (itemId: number, itemName: string, price: number) => {
    console.log(`Order placed for veg item: ${itemName} (ID: ${itemId}) - Price: ₹${price}`);
    
    const orderData = {
      itemId,
      itemName,
      price,
      timestamp: new Date().toISOString()
    };

    // Save to localStorage or send to API
    localStorage.setItem('lastVegOrder', JSON.stringify(orderData));
    
    // Show confirmation
    alert(`✅ Order placed for ${itemName}! \n💰 Price: ₹${price}`);
  },

  handleAddToCart: (itemId: number, itemName: string, price: number) => {
    console.log(`Adding to cart: ${itemName}`);
    
    const cartItem = {
      id: itemId,
      name: itemName,
      price: price,
      quantity: 1,
      type: 'veg'
    };

    // Get existing cart or initialize
    const existingCart = JSON.parse(localStorage.getItem('vegCart') || '[]');
    
    // Check if item already exists in cart - TypeScript fix
    //const existingItemIndex = existingCart.findIndex((item: any) => item.id === itemId);
    const existingItemIndex = existingCart.findIndex((item: { id: number }) => item.id === itemId);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push(cartItem);
    }
    
    // Save back to localStorage
    localStorage.setItem('vegCart', JSON.stringify(existingCart));
    
    // Show success message
    alert(`🛒 ${itemName} added to cart!`);
  },

  // Utility handlers (without navigationService)
  handleVegItemClick: (itemId: number, itemName: string) => {
    console.log(`Veg item clicked: ${itemName}`);
    // Navigate to item details page
    window.location.href = `/veg/item/${itemId}`;
  },

  handleViewDetails: (itemId: number) => {
    console.log(`View details for veg item: ${itemId}`);
    window.location.href = `/veg/details/${itemId}`;
  }
};