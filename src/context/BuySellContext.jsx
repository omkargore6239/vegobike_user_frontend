import React, { createContext, useContext, useState } from 'react';

const BuySellContext = createContext();

export const useBuySell = () => {
  const context = useContext(BuySellContext);
  if (!context) {
    throw new Error('useBuySell must be used within a BuySellProvider');
  }
  return context;
};

export const BuySellProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [chats, setChats] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    location: '',
    priceRange: [0, 500000],
    condition: ''
  });

  const addListing = (listing) => {
    const newListing = {
      id: Date.now(),
      ...listing,
      status: 'active',
      createdAt: new Date().toISOString(),
      views: 0,
      interested: 0
    };
    
    setListings([...listings, newListing]);
    setMyListings([...myListings, newListing]);
    return newListing;
  };

  const updateListing = (listingId, updates) => {
    setListings(listings.map(listing =>
      listing.id === listingId
        ? { ...listing, ...updates }
        : listing
    ));
    
    setMyListings(myListings.map(listing =>
      listing.id === listingId
        ? { ...listing, ...updates }
        : listing
    ));
  };

  const deleteListing = (listingId) => {
    setListings(listings.filter(listing => listing.id !== listingId));
    setMyListings(myListings.filter(listing => listing.id !== listingId));
  };

  const getFilteredListings = () => {
    return listings.filter(listing => {
      if (filters.type && listing.type !== filters.type) return false;
      if (filters.brand && listing.brand !== filters.brand) return false;
      if (filters.location && listing.location !== filters.location) return false;
      if (filters.condition && listing.condition !== filters.condition) return false;
      if (listing.price < filters.priceRange[0] || listing.price > filters.priceRange[1]) return false;
      return true;
    });
  };

  const startChat = (listingId, sellerId, message) => {
    const newChat = {
      id: Date.now(),
      listingId,
      sellerId,
      messages: [{
        id: Date.now(),
        message,
        senderId: 'current_user',
        timestamp: new Date().toISOString()
      }],
      createdAt: new Date().toISOString()
    };
    
    setChats([...chats, newChat]);
    return newChat;
  };

  const addMessage = (chatId, message, senderId) => {
    setChats(chats.map(chat =>
      chat.id === chatId
        ? {
            ...chat,
            messages: [...chat.messages, {
              id: Date.now(),
              message,
              senderId,
              timestamp: new Date().toISOString()
            }]
          }
        : chat
    ));
  };

  const value = {
    listings,
    myListings,
    chats,
    filters,
    setFilters,
    addListing,
    updateListing,
    deleteListing,
    getFilteredListings,
    startChat,
    addMessage
  };

  return (
    <BuySellContext.Provider value={value}>
      {children}
    </BuySellContext.Provider>
  );
};
