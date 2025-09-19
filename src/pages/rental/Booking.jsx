import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRental } from '../../context/RentalContext';
import { useAuth } from '../../context/AuthContext';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { availableBikes, addBooking } = useRental();
  const { user } = useAuth();

  const bike = availableBikes.find(b => b.id === parseInt(id));

  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    pickupLocation: '',
    dropLocation: '',
    totalDays: 0,
    totalAmount: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleDateChange = (field, value) => {
    const newData = { ...bookingData, [field]: value };
    
    if (newData.startDate && newData.endDate) {
      const start = new Date(newData.startDate);
      const end = new Date(newData.endDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      
      newData.totalDays = daysDiff > 0 ? daysDiff : 0;
      newData.totalAmount = newData.totalDays * bike.price;
    }
    
    setBookingData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const booking = {
        bikeId: bike.id,
        bikeName: bike.name,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        ...bookingData,
      };

      await addBooking(booking);
      navigate('/rental/my-bookings');
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!bike) {
    return <div>Bike not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Your Bike</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.startDate}
                      onChange={(e) => handleDateChange('startDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.endDate}
                      onChange={(e) => handleDateChange('endDate', e.target.value)}
                      min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      required
                      value={bookingData.startTime}
                      onChange={(e) => setBookingData({...bookingData, startTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      required
                      value={bookingData.endTime}
                      onChange={(e) => setBookingData({...bookingData, endTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter pickup address"
                      value={bookingData.pickupLocation}
                      onChange={(e) => setBookingData({...bookingData, pickupLocation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Drop Location
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter drop address"
                      value={bookingData.dropLocation}
                      onChange={(e) => setBookingData({...bookingData, dropLocation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !bookingData.totalDays}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Confirm Booking - ₹${bookingData.totalAmount}`}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              {/* Bike Info */}
              <div className="flex items-center mb-4">
                <img
                  src={bike.image}
                  alt={bike.name}
                  className="w-16 h-16 rounded-lg object-cover mr-4"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/64x64?text=Bike';
                  }}
                />
                <div>
                  <h4 className="font-medium text-gray-900">{bike.name}</h4>
                  <p className="text-sm text-gray-600">{bike.brand} • {bike.type}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per day</span>
                  <span className="font-medium">₹{bike.price}</span>
                </div>

                {bookingData.totalDays > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total days</span>
                      <span className="font-medium">{bookingData.totalDays}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Security deposit</span>
                      <span className="font-medium">₹2,000</span>
                    </div>

                    <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span className="text-primary">₹{bookingData.totalAmount + 2000}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p className="mb-2">• Security deposit will be refunded after return</p>
                <p className="mb-2">• Free cancellation up to 24 hours</p>
                <p>• Fuel charges not included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
