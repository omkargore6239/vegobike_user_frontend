// context/RentalContext.jsx - Updated to handle bookings properly
import React, { createContext, useContext, useState, useCallback } from 'react';

const RentalContext = createContext();

export const useRental = () => {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental must be used within RentalProvider');
  }
  return context;
};

export const RentalProvider = ({ children }) => {
  const [availableBikes, setAvailableBikes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add booking function
  const addBooking = useCallback(async (bookingData) => {
    console.log('📋 RENTAL_CONTEXT - Adding new booking:', bookingData);
    
    try {
      setLoading(true);
      
      // Generate a unique booking ID
      const bookingId = Date.now().toString();
      
      const newBooking = {
        ...bookingData,
        id: bookingId,
        bookingNumber: `BK${bookingId.slice(-6)}`,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      
      // Add to bookings list
      setBookings(prevBookings => [newBooking, ...prevBookings]);
      
      // Store in localStorage for persistence
      const existingBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
      const updatedBookings = [newBooking, ...existingBookings];
      localStorage.setItem('user_bookings', JSON.stringify(updatedBookings));
      
      console.log('✅ RENTAL_CONTEXT - Booking added successfully:', newBooking);
      return newBooking;
      
    } catch (error) {
      console.error('❌ RENTAL_CONTEXT - Error adding booking:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load bookings from localStorage
  const loadBookings = useCallback(() => {
    try {
      const savedBookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
      setBookings(savedBookings);
      console.log('📥 RENTAL_CONTEXT - Loaded bookings from localStorage:', savedBookings.length);
    } catch (error) {
      console.error('❌ RENTAL_CONTEXT - Error loading bookings:', error);
      setBookings([]);
    }
  }, []);

  const value = {
    availableBikes,
    setAvailableBikes,
    bookings,
    setBookings,
    addBooking,
    loadBookings,
    loading
  };

  return (
    <RentalContext.Provider value={value}>
      {children}
    </RentalContext.Provider>
  );
};
