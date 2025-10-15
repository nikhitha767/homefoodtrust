import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  cartState: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex > -1) {
        // Item already exists, update quantity
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          totalAmount: state.totalAmount + (action.payload.price * action.payload.quantity)
        };
      } else {
        // New item
        return {
          ...state,
          items: [...state.items, action.payload],
          totalAmount: state.totalAmount + (action.payload.price * action.payload.quantity)
        };
      }

    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        totalAmount: state.totalAmount - (itemToRemove ? itemToRemove.price * itemToRemove.quantity : 0)
      };

    case 'UPDATE_QUANTITY':
      const itemToUpdate = state.items.find(item => item.id === action.payload.id);
      if (!itemToUpdate) return state;
      
      const quantityDiff = action.payload.quantity - itemToUpdate.quantity;
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        totalAmount: state.totalAmount + (itemToUpdate.price * quantityDiff)
      };

    case 'CLEAR_CART':
      return {
        items: [],
        totalAmount: 0
      };

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, {
    items: [],
    totalAmount: 0
  });

  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return cartState.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartState,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};