import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ServiceBooking = ({ services, onSubmit, loading }) => {
  const { user } = useAuth();
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingData, setBookingData] = useState({
    serviceDate: '',
    serviceTime: '',
    address: '',
    phone: user?.phone || '',
    notes: '',
  });

  const handleServiceToggle = (service) => {
    const isSelected = selectedServices.find(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...bookingData,
      services: selectedServices,
      totalAmount: getTotalPrice(),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Services</h3>
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedServices.find(s => s.id === service.id)
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleServiceToggle(service)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{service.duration}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-primary">₹{service.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Date
            </label>
            <input
              type="date"
              required
              value={bookingData.serviceDate}
              onChange={(e) => setBookingData({...bookingData, serviceDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Time
            </label>
            <select
              required
              value={bookingData.serviceTime}
              onChange={(e) => setBookingData({...bookingData, serviceTime: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">Select Time</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Address
          </label>
          <input
            type="text"
            required
            placeholder="Enter your address"
            value={bookingData.address}
            onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            required
            value={bookingData.phone}
            onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>

        {selectedServices.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Selected Services:</h4>
            {selectedServices.map((service) => (
              <div key={service.id} className="flex justify-between text-sm">
                <span>{service.name}</span>
                <span>₹{service.price}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
              <span>Total:</span>
              <span>₹{getTotalPrice()}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || selectedServices.length === 0}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Booking...' : `Book Services - ₹${getTotalPrice()}`}
        </button>
      </form>
    </div>
  );
};

export default ServiceBooking;
