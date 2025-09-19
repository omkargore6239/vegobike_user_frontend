import React, { createContext, useContext, useState } from 'react';
import { bikes } from '../data/bikes';

const RentalContext = createContext();

export const useRental = () => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental must be used within a RentalProvider');
  }
  return context;
};

export const RentalProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    priceRange: [0, 3000],
    brand: ''
  });

  const addBooking = (booking) => {
    const newBooking = {
      id: Date.now(),
      ...booking,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setBookings([...bookings, newBooking]);
    return newBooking;
  };

  const getFilteredBikes = () => {
    return bikes.filter(bike => {
      if (filters.location && bike.location !== filters.location) return false;
      if (filters.type && bike.type !== filters.type) return false;
      if (filters.brand && bike.brand !== filters.brand) return false;
      if (bike.price < filters.priceRange[0] || bike.price > filters.priceRange[1]) return false;
      return true;
    });
  };

  const value = {
    bookings,
    filters,
    setFilters,
    addBooking,
    getFilteredBikes,
    availableBikes: bikes
  };

  return (
    <RentalContext.Provider value={value}>
      {children}
    </RentalContext.Provider>
  );
};
