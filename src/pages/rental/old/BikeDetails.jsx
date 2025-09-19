// src/pages/rental/Checkout.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RentalCheckout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Mock data for demonstration
  const mockData = {
    bike: {
      id: 1,
      company: "Honda",
      name: "Activa 6G",
      number: "MH12AB1234",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop",
      store_address: "Shop 15, MG Road, Pune - 411001",
      refundable_deposit: 2000
    },
    selectedPackage: {
      label: "Weekly",
      duration: 7,
      discount: 0.1
    },
    packagePrice: 1500,
    dateTimePrice: 150,
    finalPrice: 1200,
    pricingType: "package",
    search: {
      start: new Date('2025-01-15T10:00:00'),
      end: new Date('2025-01-22T10:00:00'),
      locationName: "MG Road, Pune",
      days: 7,
      hours: 168
    }
  };

  const { 
    bike = mockData.bike, 
    selectedPackage = mockData.selectedPackage, 
    packagePrice = mockData.packagePrice, 
    dateTimePrice = mockData.dateTimePrice,
    finalPrice = mockData.finalPrice,
    pricingType = mockData.pricingType,
    search = mockData.search
  } = state || mockData;

  const valid = !!bike && !!finalPrice && !!search;

  // Totals calculation with coupon discount
  const totals = useMemo(() => {
    if (!valid) return {
      subtotal: 0,
      gst: 0,
      discount: 0,
      couponDiscount: 0,
      deposit: 0,
      payableAmount: 0,
      total: 0,
      refundableAmount: 0,
      savings: 0
    };

    const subtotal = finalPrice;
    const gst = Math.round(subtotal * 0.05);
    const discount = (selectedPackage && selectedPackage.duration >= 7) ? Math.round(subtotal * 0.05) : 0;
    const deposit = bike.refundable_deposit;
    const payableAmount = subtotal + gst - discount - couponDiscount;
    const total = payableAmount + deposit;
    const refundableAmount = deposit;
    const savings = discount + couponDiscount;

    return {
      subtotal,
      gst,
      discount,
      couponDiscount,
      deposit,
      payableAmount,
      total,
      refundableAmount,
      savings
    };
  }, [bike, finalPrice, selectedPackage, couponDiscount, valid]);

  const showNotification = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      showNotification('Please enter a coupon code', 'error');
      return;
    }

    const validCoupons = {
      'OFF10': 0.1,
      'SAVE20': 0.2,
      'FIRST50': 50
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      const discountValue = validCoupons[couponCode.toUpperCase()];
      const calculatedDiscount = discountValue < 1 
        ? Math.round(finalPrice * discountValue) 
        : discountValue;
      
      setCouponDiscount(calculatedDiscount);
      showNotification(`Coupon applied! Saved ₹${calculatedDiscount}`, 'success');
    } else {
      showNotification('Invalid coupon code', 'error');
    }
  };

  const removeCoupon = () => {
    setCouponDiscount(0);
    setCouponCode('');
    showNotification('Coupon removed', 'success');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      showNotification('Please select a payment method', 'error');
      return;
    }

    if (!termsAccepted) {
      showNotification('Please accept terms and conditions', 'error');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      navigate("/rental/booking", {
        state: {
          bike,
          selectedPackage,
          packagePrice,
          dateTimePrice,
          finalPrice,
          pricingType,
          search,
          totals,
          paymentMethod,
          couponCode: couponCode || null,
          couponDiscount
        }
      });
      setIsLoading(false);
    }, 1500);
  };

  const formatDateOnly = (date) => {
    if (!date) return "";
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short',
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTimeOnly = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  if (!valid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Invalid Checkout</h2>
          <p className="text-gray-600">Please start from the rental page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Alert */}
      {showAlert && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in-from-right">
          <div className={`bg-white rounded-xl shadow-2xl border-l-4 p-4 max-w-sm ${
            alertType === 'success' ? 'border-green-500' : 'border-red-500'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                alertType === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {alertType === 'success' ? '✓' : '!'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{alertMessage}</p>
              </div>
              <button onClick={() => setShowAlert(false)} className="text-gray-400 hover:text-gray-600 ml-2">
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b backdrop-blur-sm bg-opacity-95 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                <p className="text-sm text-gray-600">Review your booking details</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">✓</span>
                <span>Select</span>
              </div>
              <div className="w-8 border-t border-gray-300"></div>
              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium">2</span>
                <span>Checkout</span>
              </div>
              <div className="w-8 border-t border-gray-300"></div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center text-xs">3</span>
                <span>Confirm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          
          {/* Left Section - Booking Details */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Vehicle Details Card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4">
                <h2 className="text-xl font-bold text-blue-800">Vehicle Details</h2>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Enhanced Bike Image - Made Larger */}
                  <div className="flex-shrink-0">
                    <img 
                      src={bike.image} 
                      alt={`${bike.company} ${bike.name}`} 
                      className="w-full sm:w-56 h-40 sm:h-48 object-cover rounded-xl shadow-lg"
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='224' height='192' viewBox='0 0 224 192'%3E%3Crect width='224' height='192' fill='%23f3f4f6'/%3E%3Ctext x='112' y='96' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='16' fill='%236b7280'%3E${bike.company}%3C/text%3E%3C/svg%3E`;
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {bike.company} {bike.name}
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium">Vehicle Number</p>
                              <p className="text-sm font-semibold text-gray-900">{bike.number}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Pickup Location</p>
                            <p className="text-sm font-semibold text-gray-900 max-w-xs">{bike.store_address}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 text-center min-w-[120px]">
                        <p className="text-sm text-gray-600 mb-1">
                          {pricingType === 'package' && selectedPackage 
                            ? `${selectedPackage.label} Package`
                            : `${search.days || 1} day${(search.days || 1) > 1 ? 's' : ''}`
                          }
                        </p>
                        <p className="text-3xl font-bold text-blue-600">₹{finalPrice.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Base Price</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Details Card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4">
                <h2 className="text-xl font-bold text-blue-800">Trip Details</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Pickup Details - Blue Background */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="text-blue-600 font-bold">Pickup</h3>
                        <p className="text-xs text-blue-600 font-medium">Start your journey</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{formatDateOnly(search.start)}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{formatTimeOnly(search.start)}</p>
                      </div>
                      
                      <div className="flex items-start gap-2 mt-2">
                        <p className="text-sm text-gray-700 font-medium">{search.locationName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Return Details - Blue Background */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="text-blue-600 font-bold">Return</h3>
                        <p className="text-xs text-blue-600 font-medium">End your journey</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{formatDateOnly(search.end)}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{formatTimeOnly(search.end)}</p>
                      </div>
                      
                      <div className="flex items-start gap-2 mt-2">
                        <p className="text-sm text-gray-700 font-medium">{search.locationName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary & Payment */}
          <div className="w-full xl:w-96 xl:flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-24 overflow-hidden">
              
              {/* Order Summary Header */}
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-4">
                <h2 className="text-xl font-bold text-blue-800">Order Summary</h2>
                <p className="text-blue-700 text-sm">Review your total charges</p>
              </div>

              <div className="p-6 space-y-6">

                {/* Payment Method Selection in Order Summary */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Select Payment Method</h4>
                  <div className="space-y-3">
                    
                    {/* Cash on Delivery */}
                    <label className={`relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'cod' 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          paymentMethod === 'cod' ? 'bg-blue-600' : 'bg-gray-100'
                        }`}>
                          <div className={`w-4 h-4 rounded ${paymentMethod === 'cod' ? 'bg-white' : 'bg-gray-600'}`}></div>
                        </div>
                        
                        <div className="flex-1">
                          <div className={`font-medium text-sm ${paymentMethod === 'cod' ? 'text-blue-800' : 'text-gray-900'}`}>
                            Cash on Delivery
                          </div>
                          <div className="text-xs text-gray-600">Pay when you pick up the bike</div>
                        </div>
                      </div>
                      
                      {paymentMethod === 'cod' && (
                        <div className="absolute top-2 right-2">
                          <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </label>

                    {/* Online Payment */}
                    <label className={`relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      paymentMethod === 'online' 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          paymentMethod === 'online' ? 'bg-blue-600' : 'bg-gray-100'
                        }`}>
                          <div className={`w-4 h-4 rounded ${paymentMethod === 'online' ? 'bg-white' : 'bg-gray-600'}`}></div>
                        </div>
                        
                        <div className="flex-1">
                          <div className={`font-medium text-sm ${paymentMethod === 'online' ? 'text-blue-800' : 'text-gray-900'}`}>
                            Pay Online
                          </div>
                          <div className="text-xs text-gray-600">UPI, Cards, Net Banking</div>
                        </div>
                      </div>
                      
                      {paymentMethod === 'online' && (
                        <div className="absolute top-2 right-2">
                          <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                
                {/* Price Breakdown */}
                <div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Subtotal</span>
                      <span className="font-semibold text-gray-900">₹{totals.subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">GST (5%)</span>
                      <span className="font-semibold text-gray-900">₹{totals.gst.toLocaleString()}</span>
                    </div>
                    
                    {couponDiscount > 0 && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <span className="text-green-700">Coupon Discount</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                            {couponCode}
                          </span>
                        </div>
                        <span className="font-semibold text-green-600">-₹{couponDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Rental Amount</span>
                        <span className="font-bold text-gray-900">₹{totals.payableAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center bg-blue-50 -mx-2 px-2 py-2 rounded-lg">
                      <span className="text-red-700 font-medium">Security Deposit (Refundable)</span>
                      <span className="font-bold text-red-700">₹{totals.deposit.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="border-t-2 border-gray-300 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total Payable</span>
                      <span className="text-2xl font-bold text-blue-600">₹{totals.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Have a Coupon?</h3>
                  
                  {/* Applied Coupon Display with Remove Option */}
                  {couponDiscount > 0 ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800">Coupon Applied: {couponCode}</p>
                          <p className="text-xs text-green-600">Saved ₹{couponDiscount.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-red-600 hover:text-red-800 text-sm font-medium underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Enter coupon code"
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          className="px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-900 hover:to-blue-900 text-white shadow-lg hover:shadow-xl hover:scale-102"
                        >
                          Apply
                        </button>
                      </div>
                      
                      {/* Sample Coupons */}
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Available coupons:</p>
                        <div className="flex gap-2 flex-wrap">
                          {['OFF10', 'SAVE20', 'FIRST50'].map((code) => (
                            <button
                              key={code}
                              onClick={() => setCouponCode(code)}
                              className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-xs font-medium text-gray-700 transition-colors"
                            >
                              {code}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                        Terms & Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                {/* Pay Button */}
                <button
                  onClick={onSubmit}
                  disabled={!paymentMethod || !termsAccepted || isLoading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                    paymentMethod && termsAccepted && !isLoading
                      ? 'bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-900 hover:to-blue-900 text-white shadow-lg hover:shadow-xl hover:scale-102 focus:ring-blue-500 active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Payment...</span>
                    </div>
                  ) : !paymentMethod ? (
                    'Select Payment Method'
                  ) : !termsAccepted ? (
                    'Accept Terms to Continue'
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Pay ₹{totals.total.toLocaleString()}</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
