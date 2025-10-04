// handlers/menuClickHandlers.ts

// Import path fix - try different options
import { navigationService } from '../services/navidationService';
// OR if above doesn't work, try:
// import { navigationService } from '../../services/navigationService';
// OR if using src folder:
// import { navigationService } from '@/services/navigationService';

export const menuClickHandlers = {
  // Main menu navigation
  handleHomeClick: () => {
    console.log('Home menu clicked');
    navigationService.navigateToHome();
  },

  handleVegClick: () => {
    console.log('Veg menu clicked');
    navigationService.navigateToVeg();
  },

  handleNonVegClick: () => {
    console.log('Non-Veg menu clicked');
    navigationService.navigateTo('/non-veg'); // ✅ Fixed - function ledhu kabatti direct path
  },

  handleBeveragesClick: () => {
    console.log('Beverages menu clicked');
    navigationService.navigateTo('/beverages'); // ✅ Fixed - function ledhu kabatti direct path
  },

  // Dropdown handlers
  handleDropdownToggle: (isOpen: boolean) => {
    console.log(`Dropdown ${isOpen ? 'opened' : 'closed'}`);
    return !isOpen;
  },

  // User action handlers
  handleSearch: (query: string) => {
    console.log(`Searching for: ${query}`);
    navigationService.navigateTo(`/search?q=${encodeURIComponent(query)}`);
  },

  handleContactClick: () => {
    console.log('Contact menu clicked');
    navigationService.navigateTo('/contact');
  },

  handleAboutClick: () => {
    console.log('About menu clicked');
    navigationService.navigateTo('/about');
  }
};