// pages/Booking.jsx - Fixed version with proper authentication handling
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useRental } from '../../context/RentalContext';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, BOOKING_STEPS } from '../../utils/constants';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { availableBikes, addBooking } = useRental();
  const { 
    isAuthenticated, 
    authCheckComplete, 
    user, 
    storeBookingIntent 
  } = useAuth();

  // Find bike with memoization to prevent recalculation
  const bike = useMemo(() => {
    return availableBikes?.find(b => b.id === parseInt(id));
  }, [availableBikes, id]);

  // State management
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
  const [authCheckDone, setAuthCheckDone] = useState(false);
  const [error, setError] = useState('');

  // Authentication check effect - runs once when auth is complete
  useEffect(() => {
    if (authCheckComplete && !authCheckDone) {
      console.log('🔐 BOOKING - Auth check complete, authenticated:', isAuthenticated);
      
      if (!isAuthenticated) {
        console.log('🚫 BOOKING - User not authenticated, storing booking intent and redirecting to login');
        
        // Store booking intent before redirecting
        if (bike) {
          const bookingIntent = {
            bikeId: bike.id,
            bikeName: bike.name,
            bikeImage: bike.image,
            bikePrice: bike.price,
            returnUrl: location.pathname + location.search
          };
          
          storeBookingIntent(bookingIntent, BOOKING_STEPS.CHECKOUT);
        }
        
        // Redirect to login with return URL
        const returnUrl = encodeURIComponent(location.pathname + location.search);
        navigate(`${ROUTES.LOGIN}?returnUrl=${returnUrl}`, { replace: true });
        return;
      }
      
      setAuthCheckDone(true);
    }
  }, [authCheckComplete, isAuthenticated, authCheckDone, bike, location, navigate, storeBookingIntent]);

  // Date change handler with better calculation
  const handleDateChange = useCallback((field, value) => {
    setBookingData(prevData => {
      const newData = { ...prevData, [field]: value };
      
      if (newData.startDate && newData.endDate && bike) {
        const start = new Date(newData.startDate);
        const end = new Date(newData.endDate);
        const timeDiff = end.getTime() - start.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        
        newData.totalDays = daysDiff > 0 ? daysDiff : 0;
        newData.totalAmount = newData.totalDays * bike.price;
      }
      
      return newData;
    });
  }, [bike]);

  // Form submission handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please login to continue booking');
      return;
    }

    if (!user) {
      setError('User information not available');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📋 BOOKING - Submitting booking:', bookingData);
      
      const booking = {
        bikeId: bike.id,
        bikeName: bike.name,
        bikeImage: bike.image,
        userId: user.id || user.phoneNumber, // Use phoneNumber as fallback ID
        userName: user.name || 'User',
        userEmail: user.email || '',
        userPhone: user.phoneNumber,
        ...bookingData,
        bookingDate: new Date().toISOString(),
        status: 'pending'
      };

      console.log('📤 BOOKING - Adding booking to context:', booking);
      await addBooking(booking);
      
      console.log('✅ BOOKING - Booking successful, navigating to my-bookings');
      navigate('/rental/my-bookings');
    } catch (error) {
      console.error('❌ BOOKING - Booking failed:', error);
      setError(error.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, bike, bookingData, addBooking, navigate]);

  // Show loading while checking authentication
  if (!authCheckComplete || !authCheckDone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show error if bike not found
  if (!bike) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Bike Not Found</h1>
          <p className="text-gray-600 mb-6">The bike you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/rental/bikes')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View All Bikes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Bike</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.startDate}
                      onChange={(e) => handleDateChange('startDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.endDate}
                      onChange={(e) => handleDateChange('endDate', e.target.value)}
                      min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={bookingData.startTime}
                      onChange={(e) => setBookingData(prev => ({...prev, startTime: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={bookingData.endTime}
                      onChange={(e) => setBookingData(prev => ({...prev, endTime: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter pickup address"
                      value={bookingData.pickupLocation}
                      onChange={(e) => setBookingData(prev => ({...prev, pickupLocation: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Drop Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter drop address"
                      value={bookingData.dropLocation}
                      onChange={(e) => setBookingData(prev => ({...prev, dropLocation: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !bookingData.totalDays || bookingData.totalDays <= 0}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : `Confirm Booking - ₹${bookingData.totalAmount + 2000}`}
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
                  src={bike.image || 'https://via.placeholder.com/64x64/10B981/FFFFFF?text=Bike'}
                  alt={bike.name}
                  className="w-16 h-16 rounded-lg object-cover mr-4"
                  onError={(e) => {
                    console.log('📷 BOOKING - Image load failed, using fallback');
                    e.target.src = 'https://via.placeholder.com/64x64/10B981/FFFFFF?text=Bike';
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
                      <span className="text-gray-600">Rental amount</span>
                      <span className="font-medium">₹{bookingData.totalAmount}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Security deposit</span>
                      <span className="font-medium">₹2,000</span>
                    </div>

                    <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span className="text-indigo-600">₹{bookingData.totalAmount + 2000}</span>
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
