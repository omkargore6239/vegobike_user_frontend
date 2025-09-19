import React, { createContext, useContext, useState } from 'react';
import { services } from '../data/services';

const ServicingContext = createContext();

export const useServicing = () => {
  const context = useContext(ServicingContext);
  if (!context) {
    throw new Error('useServicing must be used within a ServicingProvider');
  }
  return context;
};

export const ServicingProvider = ({ children }) => {
  const [serviceBookings, setServiceBookings] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const addServiceBooking = (booking) => {
    const newBooking = {
      id: Date.now(),
      ...booking,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    setServiceBookings([...serviceBookings, newBooking]);
    return newBooking;
  };

  const addToSelectedServices = (service) => {
    setSelectedServices([...selectedServices, service]);
  };

  const removeFromSelectedServices = (serviceId) => {
    setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  const value = {
    services,
    serviceBookings,
    selectedServices,
    addServiceBooking,
    addToSelectedServices,
    removeFromSelectedServices,
    getTotalPrice,
    clearSelectedServices: () => setSelectedServices([])
  };

  return (
    <ServicingContext.Provider value={value}>
      {children}
    </ServicingContext.Provider>
  );
};
