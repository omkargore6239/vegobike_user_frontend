import React, { createContext, useContext, useState } from 'react';
import { spareparts } from '../data/spareparts';

const SparepartsContext = createContext();

export const useSpareparts = () => {
  const context = useContext(SparepartsContext);
  if (!context) {
    throw new Error('useSpareparts must be used within a SparepartsProvider');
  }
  return context;
};

export const SparepartsProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceRange: [0, 5000],
    inStock: false
  });

  const addToCart = (part, quantity = 1) => {
    const existingItem = cart.find(item => item.id === part.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === part.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...part, quantity }]);
    }
  };

  const removeFromCart = (partId) => {
    setCart(cart.filter(item => item.id !== partId));
  };

  const updateQuantity = (partId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(partId);
      return;
    }
    
    setCart(cart.map(item =>
      item.id === partId
        ? { ...item, quantity }
        : item
    ));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getFilteredParts = () => {
    return spareparts.filter(part => {
      if (filters.category && part.category !== filters.category) return false;
      if (filters.brand && part.brand !== filters.brand) return false;
      if (part.price < filters.priceRange[0] || part.price > filters.priceRange[1]) return false;
      if (filters.inStock && !part.inStock) return false;
      return true;
    });
  };

  const placeOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      ...orderData,
      items: [...cart],
      status: 'ordered',
      createdAt: new Date().toISOString()
    };
    
    setOrders([...orders, newOrder]);
    setCart([]); // Clear cart after order
    return newOrder;
  };

  const value = {
    spareparts,
    cart,
    orders,
    filters,
    setFilters,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getFilteredParts,
    placeOrder,
    clearCart: () => setCart([])
  };

  return (
    <SparepartsContext.Provider value={value}>
      {children}
    </SparepartsContext.Provider>
  );
};
