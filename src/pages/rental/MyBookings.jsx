import React from 'react';
import { Link } from 'react-router-dom';
import { useRental } from '../../context/RentalContext';

const MyBookings = () => {
  const { bookings } = useRental();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
          
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No bookings yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start exploring our bikes and make your first booking
            </p>
            <Link
              to="/rental"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Bikes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <Link
            to="/rental"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Book Another Bike
          </Link>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {booking.bikeName}
                  </h3>
                  <p className="text-gray-600">Booking ID: #{booking.id}</p>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">
                      ₹{booking.totalAmount}
                    </div>
                    <div className="text-sm text-gray-500">
                      {booking.totalDays} days
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Pickup Date</div>
                  <div className="font-medium">
                    {new Date(booking.startDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">{booking.startTime}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Return Date</div>
                  <div className="font-medium">
                    {new Date(booking.endDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">{booking.endTime}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Pickup Location</div>
                  <div className="font-medium text-sm">
                    {booking.pickupLocation}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Drop Location</div>
                  <div className="font-medium text-sm">
                    {booking.dropLocation}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
                {booking.status === 'pending' && (
                  <>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors">
                      Cancel Booking
                    </button>
                    <button className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors">
                      Modify Booking
                    </button>
                  </>
                )}
                
                {booking.status === 'active' && (
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                    Contact Support
                  </button>
                )}

                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors">
                  Download Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
