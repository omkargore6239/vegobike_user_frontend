// pages/rental/RentalCheckout.jsx - PRODUCTION READY VERSION
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { ROUTES } from '../../utils/constants';

export default function RentalCheckout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { isAuthenticated, authCheckComplete, user } = useAuth();
  
  // State management
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceRates, setPriceRates] = useState(null);
  const [depositAmount, setDepositAmount] = useState(2000);
  const [gstRate] = useState(0.05);

  // Extract booking data from URL params
  const bookingData = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    
    return {
      bikeId: params.bikeId || '',
      bikeName: params.bikeName || 'Unknown Bike',
      bikeImage: params.bikeImage || '',
      registrationNumber: params.registrationNumber || '',
      storeName: params.storeName || '',
      categoryId: params.categoryId || '',
      startDate: params.startDate || '',
      endDate: params.endDate || '',
      pickupTime: params.pickupTime || '10:00',
      dropoffTime: params.dropoffTime || '19:00',
      city: params.city || '',
      pickupMode: params.pickupMode || 'self-pickup',
      deliveryAddress: params.deliveryAddress || '',
      totalHours: parseFloat(params.totalHours) || 0,
      bookingType: params.bookingType || 'HOURLY',
      packageId: params.packageId || '',
      packageName: params.packageName || '',
      packagePrice: parseFloat(params.packagePrice) || 0,
      packageDeposit: parseFloat(params.packageDeposit) || 0,
      hasPackageSelected: params.hasPackageSelected === 'true',
      timestamp: params.timestamp || '',
      source: params.source || ''
    };
  }, [searchParams]);

  // Calculate duration information
  const durationInfo = useMemo(() => {
    if (!bookingData.startDate || !bookingData.endDate || 
        !bookingData.pickupTime || !bookingData.dropoffTime) {
      return null;
    }
    
    try {
      const start = new Date(`${bookingData.startDate}T${bookingData.pickupTime}`);
      const end = new Date(`${bookingData.endDate}T${bookingData.dropoffTime}`);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error('Invalid date/time format');
        return null;
      }
      
      const hours = (end - start) / (1000 * 60 * 60);
      
      if (hours <= 0) {
        console.error('Invalid duration - end time must be after start time');
        return null;
      }
      
      const days = Math.floor(hours / 24);
      const remainingHours = Math.floor(hours % 24);
      
      return {
        totalHours: hours,
        days,
        remainingHours,
        bookingType: hours <= 6 ? 'HOURLY' : hours <= 144 ? 'DAILY' : 'WEEKLY',
        displayDuration: days > 0 
          ? `${days} day${days > 1 ? 's' : ''}${remainingHours > 0 ? ` ${remainingHours}h` : ''}`
          : `${hours.toFixed(1)} hours`
      };
    } catch (error) {
      console.error('Error calculating duration:', error);
      return null;
    }
  }, [bookingData]);

  // Validate booking has required data
  const isValidBooking = useMemo(() => {
    const required = ['bikeId', 'bikeName', 'startDate', 'endDate', 'categoryId'];
    const isValid = required.every(field => bookingData[field]) && durationInfo !== null;
    
    if (!isValid) {
      console.warn('Invalid booking data:', { bookingData, durationInfo });
    }
    
    return isValid;
  }, [bookingData, durationInfo]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authCheckComplete && !isAuthenticated) {
      console.warn('User not authenticated, redirecting to login');
      const returnUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`${ROUTES.LOGIN}?returnUrl=${returnUrl}`);
    }
  }, [isAuthenticated, authCheckComplete, navigate, location]);

  // Fetch price rates for the vehicle category
  useEffect(() => {
    const fetchPriceRates = async () => {
      if (!bookingData.categoryId) {
        console.warn('No category ID available');
        return;
      }
      
      try {
        console.log('Fetching price rates for category:', bookingData.categoryId);
        
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/prices/category/${bookingData.categoryId}`,
          {
            method: 'GET',
            headers: { 
              'Accept': 'application/json', 
              'Content-Type': 'application/json' 
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const responseData = await response.json();
        const priceList = responseData.success ? responseData.data : responseData;
        
        if (!Array.isArray(priceList) || priceList.length === 0) {
          throw new Error('No pricing data available');
        }
        
        let hourlyRate = 0;
        let dailyRate = 0;
        let fetchedDeposit = 2000;
        
        priceList.forEach(price => {
          if (price.days === 0) {
            hourlyRate = price.price;
            if (price.deposit) fetchedDeposit = price.deposit;
          } else if (price.days === 1) {
            dailyRate = price.price;
            if (price.deposit) fetchedDeposit = price.deposit;
          }
        });
        
        if (hourlyRate === 0 && dailyRate === 0) {
          throw new Error('No valid rates found in pricing data');
        }
        
        console.log('✅ Price rates fetched:', { hourlyRate, dailyRate, fetchedDeposit });
        
        setPriceRates({ hourlyRate, dailyRate });
        setDepositAmount(
          bookingData.hasPackageSelected && bookingData.packageDeposit > 0 
            ? bookingData.packageDeposit 
            : fetchedDeposit
        );
        
      } catch (error) {
        console.error('Failed to fetch price rates:', error);
        showNotification('Unable to fetch pricing information', 'error');
        // Set fallback rates
        setPriceRates({ hourlyRate: 100, dailyRate: 1000 });
        setDepositAmount(2000);
      }
    };
    
    if (bookingData.categoryId) {
      fetchPriceRates();
    }
  }, [bookingData.categoryId, bookingData.hasPackageSelected, bookingData.packageDeposit]);

  // Calculate estimated price
  useEffect(() => {
    const calculatePrice = () => {
      if (!isValidBooking || !durationInfo) {
        console.log('Skipping price calculation - invalid booking or duration');
        return;
      }
      
      if (!priceRates && !bookingData.hasPackageSelected) {
        console.log('Waiting for price rates...');
        return;
      }
      
      setPriceLoading(true);
      
      try {
        if (bookingData.hasPackageSelected && bookingData.packagePrice > 0) {
          console.log('Using package pricing:', bookingData.packagePrice);
          setEstimatedPrice({
            subtotal: bookingData.packagePrice,
            deposit: bookingData.packageDeposit || depositAmount,
            isPackagePrice: true,
            packageName: bookingData.packageName,
            totalHours: durationInfo.totalHours,
            bookingType: bookingData.bookingType
          });
        } else if (priceRates) {
          let subtotal;
          
          if (durationInfo.totalHours <= 6) {
            // Hourly pricing
            subtotal = Math.ceil(durationInfo.totalHours) * priceRates.hourlyRate;
            console.log('Hourly pricing:', { hours: durationInfo.totalHours, rate: priceRates.hourlyRate, subtotal });
          } else {
            // Daily pricing
            const days = Math.ceil(durationInfo.totalHours / 24);
            subtotal = days * priceRates.dailyRate;
            console.log('Daily pricing:', { days, rate: priceRates.dailyRate, subtotal });
          }
          
          setEstimatedPrice({
            subtotal,
            deposit: depositAmount,
            hourlyRate: priceRates.hourlyRate,
            dailyRate: priceRates.dailyRate,
            isPackagePrice: false,
            totalHours: durationInfo.totalHours,
            bookingType: durationInfo.bookingType
          });
        }
      } catch (error) {
        console.error('Error calculating price:', error);
        showNotification('Error calculating price', 'error');
      } finally {
        setPriceLoading(false);
      }
    };
    
    calculatePrice();
  }, [bookingData, durationInfo, isValidBooking, priceRates, depositAmount]);

  // ✅ NEW: Check documents AFTER booking is created
// ✅ NEW: Check documents AFTER booking is created
const checkDocumentsAfterBooking = async (bookingResponse) => {
  try {
    const customerId = user?.id || user?.data?.id || user?.userId;
    
    if (!customerId) {
      // If no user ID, just show success and navigate
      showNotification('Booking created successfully!', 'success');
      setTimeout(() => {
        navigate(ROUTES.RENTAL + '/my-bookings', {
          state: { newBooking: bookingResponse, showSuccess: true },
          replace: true
        });
      }, 1500);
      return;
    }

    console.log('📄 Checking documents for user:', customerId);
    const docStatus = await bookingService.checkDocumentVerification(customerId);
    
    console.log('📄 Document status:', docStatus);

    // ✅ CASE 1: No documents uploaded
    if (!docStatus.uploaded) {
      const confirmed = window.confirm(
        '✅ Booking Created Successfully!\n\n' +
        '⚠️ Documents Required for Admin Approval:\n\n' +
        'To get admin approval, please upload:\n' +
        '• Aadhaar Card (Front & Back)\n' +
        '• Driving License\n\n' +
        'Admin can only accept your booking after document verification.\n\n' +
        'Click OK to upload documents now, or Cancel to upload later.'
      );
      
      if (confirmed) {
        navigate('/document-verification', {
          state: { 
            fromBooking: true,
            bookingId: bookingResponse.bookingId || bookingResponse.id
          }
        });
      } else {
        navigate(ROUTES.RENTAL + '/my-bookings', {
          state: { 
            newBooking: bookingResponse,
            showSuccess: true,
            showDocumentWarning: true,
            bookingId: bookingResponse.bookingId || bookingResponse.id 
          },
          replace: true
        });
      }
      return;
    }

    // ✅ CASE 2: Documents rejected
    if (docStatus.rejected) {
      const confirmed = window.confirm(
        '✅ Booking Created Successfully!\n\n' +
        '❌ Some Documents Were Rejected:\n\n' +
        'Please re-upload the rejected documents.\n' +
        'Your booking will be approved after document verification.\n\n' +
        'Click OK to re-upload documents now.'
      );
      
      if (confirmed) {
        navigate('/document-verification', {
          state: { 
            fromBooking: true,
            bookingId: bookingResponse.bookingId || bookingResponse.id
          }
        });
      } else {
        navigate(ROUTES.RENTAL + '/my-bookings', {
          state: { 
            newBooking: bookingResponse,
            showSuccess: true,
            showDocumentWarning: true,
            bookingId: bookingResponse.bookingId || bookingResponse.id 
          },
          replace: true
        });
      }
      return;
    }

    // ✅ CASE 3: Documents pending verification
    if (docStatus.pending) {
      alert(
        '✅ Booking Created Successfully!\n\n' +
        '⏳ Documents Pending Admin Review:\n\n' +
        'Your documents are being reviewed by our admin team.\n' +
        'Your booking will be approved after document verification.\n\n' +
        'This usually takes 24-48 hours.'
      );
      
      navigate(ROUTES.RENTAL + '/my-bookings', {
        state: { 
          newBooking: bookingResponse,
          showSuccess: true,
          bookingId: bookingResponse.bookingId || bookingResponse.id 
        },
        replace: true
      });
      return;
    }

    // ✅ CASE 4: Documents not verified (edge case)
    if (!docStatus.verified) {
      const confirmed = window.confirm(
        '✅ Booking Created Successfully!\n\n' +
        '⚠️ Document Verification Required:\n\n' +
        'Please ensure your documents are verified by admin.\n\n' +
        'Click OK to check your documents now.'
      );
      
      if (confirmed) {
        navigate('/document-verification', {
          state: { 
            fromBooking: true,
            bookingId: bookingResponse.bookingId || bookingResponse.id
          }
        });
      } else {
        navigate(ROUTES.RENTAL + '/my-bookings', {
          state: { 
            newBooking: bookingResponse,
            showSuccess: true,
            showDocumentWarning: true,
            bookingId: bookingResponse.bookingId || bookingResponse.id 
          },
          replace: true
        });
      }
      return;
    }

    // ✅ CASE 5: All documents verified - Normal success
    showNotification('Booking created successfully!', 'success');
    setTimeout(() => {
      navigate(ROUTES.RENTAL + '/my-bookings', {
        state: { 
          newBooking: bookingResponse,
          showSuccess: true,
          bookingId: bookingResponse.bookingId || bookingResponse.id 
        },
        replace: true
      });
    }, 1500);

  } catch (error) {
    console.error('❌ Document check error:', error);
    
    // If document check fails, show warning and redirect
    const confirmed = window.confirm(
      '✅ Booking Created Successfully!\n\n' +
      '⚠️ Unable to check document status.\n\n' +
      'Please ensure your documents are uploaded for admin approval.\n\n' +
      'Click OK to upload documents now.'
    );
    
    if (confirmed) {
      navigate('/document-verification', {
        state: { 
          fromBooking: true,
          bookingId: bookingResponse?.bookingId || bookingResponse?.id
        }
      });
    } else {
      navigate(ROUTES.RENTAL + '/my-bookings', {
        state: { 
          newBooking: bookingResponse,
          showSuccess: true,
          showDocumentWarning: true,
          bookingId: bookingResponse?.bookingId || bookingResponse?.id
        },
        replace: true
      });
    }
  }
};



  // Calculate final totals
  const totals = useMemo(() => {
    if (!estimatedPrice) {
      return { 
        subtotal: 0, 
        gst: 0, 
        couponDiscount: 0, 
        deposit: depositAmount, 
        payableAmount: 0, 
        total: 0 
      };
    }

    const subtotal = estimatedPrice.subtotal || 0;
    const gst = Math.round(subtotal * gstRate);
    const deposit = estimatedPrice.deposit || depositAmount;
    const payableAmount = Math.max(0, subtotal + gst - couponDiscount);
    const total = payableAmount + deposit;

    return { subtotal, gst, couponDiscount, deposit, payableAmount, total };
  }, [estimatedPrice, couponDiscount, gstRate, depositAmount]);

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 4000);
  };

  // Apply coupon code
  const applyCouponCode = async () => {
    if (!couponCode.trim()) {
      showNotification('Please enter a coupon code', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token') || 
                    localStorage.getItem('auth_token') || 
                    localStorage.getItem('authToken');
                    
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/offers/validate`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            couponCode: couponCode.toUpperCase(),
            customerId: user?.id,
            vehicleId: parseInt(bookingData.bikeId, 10),
            originalPrice: totals.subtotal
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid or expired coupon');
      }

      const data = await response.json();
      const discountAmount = Math.min(totals.subtotal - data.discountedPrice, totals.subtotal);
      
      setCouponDiscount(discountAmount);
      setAppliedCoupon({ 
        code: couponCode.toUpperCase(), 
        discount: discountAmount 
      });
      
      showNotification(
        `Coupon applied! Saved ₹${discountAmount.toLocaleString()}`, 
        'success'
      );
    } catch (error) {
      console.error('Coupon application failed:', error);
      showNotification(error.message || 'Invalid coupon code', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setCouponDiscount(0);
    setCouponCode('');
    setAppliedCoupon(null);
    showNotification('Coupon removed', 'success');
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if already loaded
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Initialize Razorpay payment
  const initializeRazorpay = async (orderData) => {
    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
      showNotification('Payment gateway failed to load', 'error');
      setIsLoading(false);
      return;
    }

    try {
      const razorpayOrder = JSON.parse(orderData.razorpayOrderDetails);
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Vego Rentals',
        description: `Bike Rental - ${bookingData.bikeName}`,
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            console.log('Payment successful, verifying...', response);
            
            await bookingService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: orderData.bookingId
            });
            
            showNotification('Payment successful!', 'success');
            
            setTimeout(() => {
              navigate(ROUTES.RENTAL + '/my-bookings', { 
                state: { newBooking: orderData, showSuccess: true },
                replace: true
              });
            }, 1500);
          } catch (error) {
            console.error('Payment verification failed:', error);
            showNotification('Payment verification failed', 'error');
            setIsLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phoneNumber || ''
        },
        theme: { 
          color: '#1A1E82' 
        },
        modal: {
          ondismiss: () => {
            console.log('Payment cancelled by user');
            showNotification('Payment cancelled', 'error');
            setIsLoading(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      
    } catch (error) {
      console.error('Payment initialization failed:', error);
      showNotification('Payment initialization failed', 'error');
      setIsLoading(false);
    }
  };

  // Prepare booking request payload
  // In Checkout.jsx - Update prepareBookingRequest
const prepareBookingRequest = () => {
  return {
    vehicleId: parseInt(bookingData.bikeId, 10),
    startDate: bookingData.startDate,
    endDate: bookingData.endDate,
    pickupTime: bookingData.pickupTime,
    dropoffTime: bookingData.dropoffTime,
    
    // ✅ ADD: Price data (required by backend)
    subtotal: totals.subtotal,
    gst: totals.gst,
    deposit: totals.deposit,
    totalCharges: totals.payableAmount,
    finalAmount: totals.total,
    
    couponCode: appliedCoupon?.code || null,
    paymentType: paymentMethod === 'online' ? 2 : 1,
    paymentStatus: paymentMethod === 'online' ? 'INITIATED' : 'PENDING',
    addressType: bookingData.pickupMode === 'delivery' ? 'Delivery' : 'Self Pickup',
    address: bookingData.deliveryAddress || bookingData.storeName || bookingData.city || '',
    bookingStatus: 1
  };
};


  // Handle form submission
  const onSubmit = async (e) => {
  e.preventDefault();

  // Validation checks
  if (!paymentMethod) {
    showNotification('Please select a payment method', 'error');
    return;
  }

  if (!termsAccepted) {
    showNotification('Please accept terms and conditions', 'error');
    return;
  }

  if (!isValidBooking) {
    showNotification('Invalid booking data', 'error');
    return;
  }

  setIsLoading(true);

  try {
    console.log('📋 Creating booking...');
    const bookingRequest = prepareBookingRequest();
    console.log('📋 Booking request:', bookingRequest);
    
    // ✅ STEP 1: Create booking
    const bookingResponse = await bookingService.createBooking(bookingRequest);
    console.log('✅ Booking response:', bookingResponse);

    // ✅ STEP 2: Handle payment based on method
    if (paymentMethod === 'online' && bookingResponse.razorpayOrderDetails) {
      console.log('💳 Initiating online payment...');
      await initializeRazorpay(bookingResponse);
      // Note: Document check happens after payment success in Razorpay handler
    } else {
      console.log('💵 Cash on delivery booking confirmed');
      
      // ✅ STEP 3: Check documents AFTER successful booking
      await checkDocumentsAfterBooking(bookingResponse);
    }
  } catch (error) {
    console.error('❌ Booking submission failed:', error);
    showNotification(
      error.message || 'Booking failed. Please try again.', 
      'error'
    );
    setIsLoading(false);
  }
};


  // Format date display
  const formatDateOnly = (date) => {
    if (!date) return '';
    try {
      return new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
        weekday: 'short', 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric'
      });
    } catch (error) {
      return date;
    }
  };

  // Format time display
  const formatTimeOnly = (time) => {
    if (!time) return '';
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date(2000, 0, 1, parseInt(hours, 10), parseInt(minutes, 10));
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      });
    } catch (error) {
      return time;
    }
  };

  // Loading state
  if (!authCheckComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Invalid booking state
  if (!isValidBooking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Invalid Checkout</h2>
          <p className="text-gray-600 mb-6">Booking information is missing or invalid</p>
          <button
            onClick={() => navigate(ROUTES.RENTAL)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Rental Search
          </button>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Alert Notification */}
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
              <p className="text-sm font-medium text-gray-800">{alertMessage}</p>
              <button 
                onClick={() => setShowAlert(false)} 
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                <p className="text-sm text-gray-600">Review and confirm your booking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          
          {/* Left Column - Booking Details */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Vehicle Card */}
            <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-blue-800">Vehicle Details</h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={bookingData.bikeImage || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="224" height="192"><rect fill="%23f3f4f6" width="224" height="192"/></svg>'}
                      alt={bookingData.bikeName}
                      className="w-full sm:w-56 h-40 sm:h-48 object-cover rounded-xl shadow-lg"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="224" height="192"><rect fill="%23f3f4f6" width="224" height="192"/></svg>';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{bookingData.bikeName}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Vehicle Number</p>
                          <p className="text-sm font-semibold text-gray-900">{bookingData.registrationNumber}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Location</p>
                          <p className="text-sm font-semibold text-gray-900">{bookingData.storeName}</p>
                        </div>
                      </div>
                    </div>
                    
                    {bookingData.hasPackageSelected && bookingData.packageName && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">Selected Package</p>
                        <p className="text-lg font-bold text-blue-600">{bookingData.packageName}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Details Card */}
            <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-blue-800">Trip Details</h2>
                  {durationInfo && (
                    <span className="text-sm font-medium text-blue-700">
                      {durationInfo.displayDuration}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Pickup Info */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-green-700 font-bold">Pickup</h3>
                        <p className="text-xs text-green-600 font-medium">Start journey</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">{formatDateOnly(bookingData.startDate)}</p>
                      <p className="font-semibold text-gray-900">{formatTimeOnly(bookingData.pickupTime)}</p>
                    </div>
                  </div>

                  {/* Dropoff Info */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-2 border-red-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-red-700 font-bold">Return</h3>
                        <p className="text-xs text-red-600 font-medium">End journey</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">{formatDateOnly(bookingData.endDate)}</p>
                      <p className="font-semibold text-gray-900">{formatTimeOnly(bookingData.dropoffTime)}</p>
                    </div>
                  </div>
                </div>

                {/* Duration Summary */}
                {durationInfo && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Rental Duration</p>
                        <p className="text-xs text-blue-700 mt-1">
                          {bookingData.hasPackageSelected 
                            ? `Package: ${bookingData.packageName}`
                            : durationInfo.bookingType === 'HOURLY' 
                              ? 'Hourly booking • Flexible duration'
                              : durationInfo.bookingType === 'DAILY' 
                                ? 'Daily booking • Best value'
                                : 'Weekly booking • Extended discount'
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{durationInfo.displayDuration}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Price & Payment */}
          <div className="w-full xl:w-96 xl:flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border sticky top-24 overflow-hidden">
              
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Order Summary</h2>
                <p className="text-blue-100 text-sm">
                  {bookingData.hasPackageSelected ? 'Package Price' : 'Duration-based Price'}
                </p>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Price Breakdown */}
                {priceLoading ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-sm text-gray-600">Calculating price...</p>
                  </div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Rental Charges</span>
                      <span className="font-semibold text-gray-900">₹{totals.subtotal.toLocaleString()}</span>
                    </div>
                    
                    {estimatedPrice && !estimatedPrice.isPackagePrice && priceRates && durationInfo && (
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        {durationInfo.totalHours <= 6 ? (
                          <p>💰 Hourly: ₹{priceRates.hourlyRate}/hr × {Math.ceil(durationInfo.totalHours)} hrs</p>
                        ) : (
                          <p>💰 Daily: ₹{priceRates.dailyRate}/day × {Math.ceil(durationInfo.totalHours / 24)} days</p>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">GST (5%)</span>
                      <span className="font-semibold text-gray-900">₹{totals.gst.toLocaleString()}</span>
                    </div>
                    
                    {couponDiscount > 0 && (
                      <div className="flex justify-between items-center bg-green-50 -mx-2 px-2 py-2 rounded">
                        <span className="text-green-700 font-medium">Coupon Discount</span>
                        <span className="font-bold text-green-600">-₹{couponDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="border-t-2 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900">Rental Amount</span>
                        <span className="font-bold text-lg text-gray-900">₹{totals.payableAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Coupon Section */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Have a Coupon?</h3>
                  
                  {appliedCoupon ? (
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-green-800">{appliedCoupon.code}</p>
                          <p className="text-xs text-green-600">Saved ₹{appliedCoupon.discount.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={removeCoupon} 
                          className="text-red-600 hover:text-red-800 transition-colors"
                          disabled={isLoading}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase disabled:opacity-50"
                        maxLength={20}
                      />
                      <button
                        onClick={applyCouponCode}
                        disabled={isLoading || !couponCode.trim()}
                        className="px-6 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Payment Method Selection */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Payment Method</h4>
                  <div className="space-y-3">
                    
                    {/* Cash on Delivery */}
                    <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={isLoading}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          paymentMethod === 'cod' ? 'bg-blue-600' : 'bg-gray-200'
                        }`}>
                          <svg className={`w-6 h-6 ${paymentMethod === 'cod' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm text-gray-900">Cash on Delivery</div>
                          <div className="text-xs text-gray-600">Pay at pickup</div>
                        </div>
                      </div>
                    </label>

                    {/* Online Payment */}
                    <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'online' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        value="online"
                        checked={paymentMethod === 'online'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={isLoading}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          paymentMethod === 'online' ? 'bg-blue-600' : 'bg-gray-200'
                        }`}>
                          <svg className={`w-6 h-6 ${paymentMethod === 'online' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm text-gray-900">Pay Online</div>
                          <div className="text-xs text-gray-600">UPI, Cards, Net Banking</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Security Deposit */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-orange-900">Security Deposit</p>
                      <p className="text-xs text-orange-700">Refundable</p>
                    </div>
                    <span className="text-xl font-bold text-orange-900">₹{totals.deposit.toLocaleString()}</span>
                  </div>
                </div>

                {/* Final Total */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Payable</p>
                      <p className="text-xs text-blue-200 mt-1">Including deposit & GST</p>
                    </div>
                    <p className="text-3xl font-bold text-white">₹{totals.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      disabled={isLoading}
                      className="mt-1 w-5 h-5 text-blue-600 border-2 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the{' '}
                      <a 
                        href="/terms" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Terms & Conditions
                      </a>
                      {' '}and{' '}
                      <a 
                        href="/privacy" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  onClick={onSubmit}
                  disabled={!paymentMethod || !termsAccepted || isLoading || priceLoading}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                    paymentMethod && termsAccepted && !isLoading && !priceLoading
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : priceLoading ? (
                    'Calculating...'
                  ) : (
                    `Pay ₹${totals.total.toLocaleString()}`
                  )}
                </button>

                {/* Additional Info */}
                <div className="text-center text-xs text-gray-500 space-y-1">
                  <p>🔒 Secure payment gateway</p>
                  <p>By proceeding, you agree to our rental terms</p>
                </div>
              </div>
            </div>

            {/* Important Notes (Mobile Bottom) */}
            <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 xl:hidden">
              <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Important Information
              </h4>
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>• Valid driving license required at pickup</li>
                <li>• Security deposit is fully refundable</li>
                <li>• Fuel charges not included</li>
                <li>• Late return charges may apply</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Notes (Desktop) */}
        <div className="hidden xl:block mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
          <h4 className="font-bold text-yellow-900 mb-3 flex items-center gap-2 text-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Important Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-yellow-900">Valid License</p>
                <p className="text-xs text-yellow-700">Required at pickup</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-yellow-900">Deposit</p>
                <p className="text-xs text-yellow-700">Fully refundable</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-yellow-900">Fuel</p>
                <p className="text-xs text-yellow-700">Charges not included</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-yellow-900">Late Return</p>
                <p className="text-xs text-yellow-700">Additional charges apply</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}