// src/pages/rental/BookingConfirmation.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [bookingId, setBookingId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { bike, selectedPackage, packagePrice, search, totals, paymentMethod } = state || {};
  const valid = !!bike && !!selectedPackage && !!totals && !!paymentMethod;

  useEffect(() => {
    if (!valid) {
      navigate("/rental", { replace: true });
      return;
    }

    // Generate booking ID and simulate payment processing
    const newBookingId = 'BK' + Date.now().toString().slice(-6);
    setBookingId(newBookingId);

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 3000);
  }, [valid, navigate]);

  const handleViewBookings = () => {
    // Create the new booking object to pass to booking history
    const newBooking = {
      id: bookingId,
      bike: {
        company: bike.company,
        name: bike.name,
        number: bike.number,
        image: bike.image
      },
      location: search.locationName,
      startDate: search.start?.toISOString(),
      endDate: search.end?.toISOString(),
      paymentMethod: paymentMethod,
      amount: totals.total,
      status: "Confirmed",
      tripStarted: false,
      tripEnded: false,
      packageType: selectedPackage.label
    };

    // Navigate to booking history with new booking data
    navigate("/rental/bookings", { 
      state: { newBooking },
      replace: true 
    });
  };

  if (!valid) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {isProcessing ? (
          // Processing State
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Booking</h1>
            <p className="text-gray-600 mb-4">
              {paymentMethod === 'cod' 
                ? 'Confirming your cash on delivery booking...' 
                : 'Processing your payment securely...'
              }
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secured by 256-bit SSL encryption
            </div>
          </div>
        ) : (
          // Success State
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2">🎉 Booking Confirmed!</h1>
              <p className="text-green-100">
                {paymentMethod === 'cod' 
                  ? 'Your cash on delivery booking has been confirmed' 
                  : 'Payment successful! Your booking is confirmed'
                }
              </p>
            </div>

            <div className="p-8">
              {/* Booking Details */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Booking Details</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-bold text-gray-900 ml-2">{bookingId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-bold text-gray-900 ml-2">
                      {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-green-600 ml-2">Rs. {totals.total}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="font-bold text-green-600 ml-2">Confirmed</span>
                  </div>
                </div>
              </div>

              {/* Bike & Trip Summary */}
              <div className="border rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">🚲 Your Booking</h2>
                <div className="flex gap-4 mb-4">
                  <img 
                    src={bike.image} 
                    alt={`${bike.company} ${bike.name}`} 
                    className="w-20 h-14 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' viewBox='0 0 120 80'%3E%3Crect width='120' height='80' fill='%23f3f4f6'/%3E%3Ctext x='60' y='40' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='10' fill='%236b7280'%3E${bike.company} ${bike.name}%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{bike.company} {bike.name}</h3>
                    <p className="text-sm text-gray-600">Vehicle: {bike.number}</p>
                    <p className="text-sm text-gray-600">Package: {selectedPackage.label}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-1">🚀 Pickup</h4>
                    <p className="text-green-800">
                      {search.start?.toLocaleString('en-IN', { 
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true 
                      })}
                    </p>
                    <p className="text-xs text-green-700 mt-1">{bike.store_address}</p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-1">🏁 Return</h4>
                    <p className="text-red-800">
                      {search.end?.toLocaleString('en-IN', { 
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', hour12: true 
                      })}
                    </p>
                    <p className="text-xs text-red-700 mt-1">Same location</p>
                  </div>
                </div>
              </div>

              {/* Important Instructions */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
                <h2 className="text-lg font-semibold text-blue-900 mb-4">📋 Important Instructions</h2>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">📱</span>
                    <p>A confirmation SMS and email has been sent with all details</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">🆔</span>
                    <p>Please carry a valid ID proof (Driving License/Aadhar) during pickup</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">⏰</span>
                    <p>Please arrive 15 minutes before your pickup time</p>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600">💵</span>
                      <p>Keep exact cash amount ready: Rs. {totals.total}</p>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">📞</span>
                    <p>Contact support: +91-9876543210 for any queries</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleViewBookings}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  View My Bookings
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  📄 Print Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
