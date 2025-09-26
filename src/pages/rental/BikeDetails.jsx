// pages/rental/BikeDetails.jsx - Complete updated version with login integration
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, BOOKING_STEPS } from '../../utils/constants';

// Updated Color Palette to match BikeList
const colors = {
  primary: '#1A1E82',
  secondary: '#6B7280',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  orange: '#FF6B35',
  dark: '#1F2937',
  light: '#F9FAFB',
  white: '#FFFFFF',
  border: '#E5E7EB',
  text: '#374151',
  textLight: '#6B7280',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
};

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8081';

const BikeDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    isAuthenticated, 
    user, 
    authCheckComplete, 
    loading: authLoading, 
    storeBookingIntent,
    pendingBooking,
    bookingStep,
    clearBookingIntent
  } = useAuth();
  
  // States
  const [selectedImage, setSelectedImage] = useState(0);
  const [bikes, setBikes] = useState([]);
  const [selectedBike, setSelectedBike] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showAuthStatus, setShowAuthStatus] = useState(false);

  // Search parameters from URL
  const searchParams = new URLSearchParams(location.search);

  // Debug logging
  useEffect(() => {
    console.log('🔍 BikeDetails Component Loaded');
    console.log('📍 Current Path:', location.pathname);
    console.log('🔗 Search Params:', location.search);
    console.log('🆔 Bike ID:', id);
    console.log('🔐 Auth Status:', { isAuthenticated, authCheckComplete });
  }, [location, id, isAuthenticated, authCheckComplete]);

  // API helper with enhanced error handling
  const makeApiCall = async (url, options = {}) => {
    try {
      console.log('🔄 Making API call to:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API Response received:', {
        url,
        status: response.status,
        dataType: typeof data,
        hasContent: !!data.content,
        hasData: !!data.data,
        isArray: Array.isArray(data)
      });
      
      return data;
    } catch (err) {
      console.error('❌ API Error:', err);
      throw err;
    }
  };

  // Enhanced image URL helper
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath.trim() === '') return null;
    
    const path = imagePath.trim();
    
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    if (path.startsWith('/uploads/') || path.startsWith('uploads/')) {
      return `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
    }
    
    return `${BASE_URL}/uploads/${path}`;
  };

  // Enhanced fetch single bike by ID
  const fetchSingleBike = useCallback(async (bikeId) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await makeApiCall(`${BASE_URL}/api/bikes/${bikeId}`);
      
      if (response && response.success !== false) {
        const bikeData = response.data || response;
        setSelectedBike(bikeData);
        
        // Set default package if available
        if (bikeData.packages && bikeData.packages.length > 0) {
          setSelectedPackage(bikeData.packages[0]);
        }
        
        console.log('✅ Single bike fetched:', bikeData.bikeName || bikeData.name);
      } else {
        throw new Error(response?.message || 'Bike not found');
      }
      
    } catch (err) {
      console.error('❌ Error fetching single bike:', err);
      setError(`Bike not found: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (id) {
      console.log('🚀 Starting single bike fetch for ID:', id);
      fetchSingleBike(id);
    }
  }, [id, fetchSingleBike]);

  // Show authentication status briefly when user logs in
  useEffect(() => {
    if (isAuthenticated && authCheckComplete) {
      setShowAuthStatus(true);
      const timer = setTimeout(() => {
        setShowAuthStatus(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, authCheckComplete]);

  // Enhanced booking handler with login integration
  const handleBookNow = useCallback(async () => {
    if (!selectedBike) return;
    
    console.log('Attempting to book bike:', selectedBike.id, 'Authentication status:', isAuthenticated);
    
    if (!authCheckComplete) {
      console.log('Authentication check not complete yet');
      return;
    }

    setBookingLoading(true);
    
    try {
      const bookingData = {
        // Search parameters from URL
        startDate: searchParams.get('startDate'),
        endDate: searchParams.get('endDate'),
        city: searchParams.get('city'),
        pickupMode: searchParams.get('pickupMode'),
        store: searchParams.get('store') || '',
        deliveryAddress: searchParams.get('deliveryAddress') || '',
        pickupTime: searchParams.get('pickupTime'),
        dropoffTime: searchParams.get('dropoffTime'),
        
        // Bike and package details
        bikeId: selectedBike.id.toString(),
        packageId: selectedPackage?.id || selectedBike.packages?.[0]?.id || '',
        price: selectedPackage?.price || selectedBike.packages?.[0]?.price || 0,
        deposit: selectedPackage?.deposit || selectedBike.packages?.[0]?.deposit || 0,
        
        // Additional bike info
        bikeName: selectedBike.bikeName || selectedBike.name,
        registrationNumber: selectedBike.registrationNumber,
        storeName: selectedBike.storeName,
        packageName: selectedPackage?.daysDisplay || selectedBike.packages?.[0]?.daysDisplay || '',
        
        // Metadata
        timestamp: new Date().toISOString(),
        source: 'bike-details'
      };

      if (!isAuthenticated) {
        console.log('User not authenticated, storing booking intent and redirecting to login');
        
        // Store booking intent for after login
        storeBookingIntent(bookingData, BOOKING_STEPS.CHECKOUT);
        
        // Create return URL for bike details page
        const bikeDetailsUrl = `/rental/bike/${selectedBike.id}${location.search}`;
        const returnUrl = encodeURIComponent(bikeDetailsUrl);
        
        navigate(`${ROUTES.LOGIN}?returnUrl=${returnUrl}`);
        return;
      }

      // User is authenticated, proceed to booking
      console.log('User authenticated, proceeding to booking page');
      const bookingParams = new URLSearchParams(bookingData).toString();
      navigate(`${ROUTES.RENTAL_BOOKING}/${selectedBike.id}?${bookingParams}`);
      
    } catch (err) {
      console.error('Booking error:', err);
      setError('Unable to proceed with booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  }, [selectedBike, selectedPackage, searchParams, isAuthenticated, authCheckComplete, location, storeBookingIntent, navigate]);

  // Enhanced package selection
  const handlePackageSelect = useCallback((packageData) => {
    setSelectedPackage(packageData);
  }, []);

  // Format price
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price || 0);
  }, []);

  // Clear booking intent handler
  const handleClearBookingIntent = useCallback(() => {
    clearBookingIntent();
  }, [clearBookingIntent]);

  // Booking Intent Banner Component
  const BookingIntentBanner = ({ pendingBooking, bookingStep, onClearIntent }) => {
    if (!pendingBooking) return null;

    const getBannerContent = () => {
      switch (bookingStep) {
        case BOOKING_STEPS.CHECKOUT:
          return {
            icon: '🎯',
            title: 'Booking in Progress',
            message: `Ready to continue booking ${pendingBooking.bikeName || 'selected bike'}`,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: 'text-blue-800'
          };
        case 'bike-details':
          return {
            icon: '📍',
            title: 'Bike Details View',
            message: `Continue viewing ${pendingBooking.bikeName || 'bike'} details`,
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200',
            textColor: 'text-indigo-800'
          };
        default:
          return {
            icon: '📋',
            title: 'Booking Saved',
            message: 'Continue your booking process',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200',
            textColor: 'text-indigo-800'
          };
      }
    };

    const { icon, title, message, bgColor, borderColor, textColor } = getBannerContent();

    return (
      <div className={`${bgColor} border ${borderColor} rounded-lg p-4 mb-6`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <div className="text-2xl mr-3">{icon}</div>
            <div>
              <h3 className={`font-semibold ${textColor} mb-1`}>{title}</h3>
              <p className={`text-sm ${textColor} opacity-90`}>{message}</p>
              {pendingBooking.bikeName && (
                <div className="mt-2 inline-flex items-center bg-white bg-opacity-50 px-2 py-1 rounded text-xs font-medium">
                  <span className={textColor}>Selected: {pendingBooking.bikeName}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClearIntent}
            className={`${textColor} hover:opacity-70 transition-opacity`}
            title="Clear saved booking"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  // Show loading screen while auth is being checked
  if (authLoading && !authCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" 
               style={{ borderColor: colors.primary }}></div>
          <h2 className="text-xl font-semibold" style={{ color: colors.dark }}>
            Loading bike details...
          </h2>
          <p className="text-sm mt-2" style={{ color: colors.textLight }}>
            Please wait while we fetch the bike information
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bike Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => fetchSingleBike(id)}
              className="w-full px-6 py-3 font-medium text-white rounded-lg hover:opacity-90"
              style={{ backgroundColor: colors.primary }}
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/rental/bikes')}
              className="w-full px-6 py-3 font-medium rounded-lg border-2 hover:opacity-80"
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              Back to Bikes
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Individual bike details view
  if (selectedBike) {
    const images = [
      getImageUrl(selectedBike.bikeImage) || getImageUrl(selectedBike.mainImageUrl) || 'https://via.placeholder.com/400x300?text=Bike+Image',
      getImageUrl(selectedBike.bikeImage) || getImageUrl(selectedBike.mainImageUrl) || 'https://via.placeholder.com/400x300?text=Bike+Image+2',
      getImageUrl(selectedBike.bikeImage) || getImageUrl(selectedBike.mainImageUrl) || 'https://via.placeholder.com/400x300?text=Bike+Image+3'
    ];

    const features = selectedBike.features || [
      'Electric Start',
      'LED Headlights', 
      'Digital Speedometer',
      'USB Charging Port',
      'Anti-lock Braking System',
      'Fuel Efficient Engine',
      'Comfortable Seating',
      'Storage Compartment'
    ];

    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Booking Intent Banner */}
          <BookingIntentBanner 
            pendingBooking={pendingBooking} 
            bookingStep={bookingStep}
            onClearIntent={handleClearBookingIntent}
          />

          {/* Authentication Status */}
          {showAuthStatus && isAuthenticated && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium text-green-800">
                  Welcome back, {user?.name || 'User'}! You can now book this bike.
                </p>
              </div>
            </div>
          )}

          {/* Enhanced Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link to="/rental" style={{ color: colors.gray[500] }} className="hover:opacity-70 text-sm">
                  🏠 Home
                </Link>
              </li>
              <li><span style={{ color: colors.gray[500] }}>/</span></li>
              <li>
                <Link 
                  to={`/rental/bikes${location.search}`} 
                  style={{ color: colors.gray[500] }} 
                  className="hover:opacity-70 text-sm"
                >
                  🏍️ Bikes {searchParams.get('city') ? `in ${searchParams.get('city')}` : ''}
                </Link>
              </li>
              <li><span style={{ color: colors.gray[500] }}>/</span></li>
              <li>
                <span className="font-medium text-sm" style={{ color: colors.dark }}>
                  {selectedBike.bikeName || selectedBike.name}
                </span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Enhanced Images Section */}
            <div>
              <div className="rounded-xl shadow-lg overflow-hidden mb-4 relative" style={{ backgroundColor: colors.white }}>
                <img
                  src={images[selectedImage]}
                  alt={selectedBike.bikeName || selectedBike.name}
                  className="w-full h-96 object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Bike+Image';
                  }}
                />
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg text-xs">
                  {selectedImage + 1} / {images.length}
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium text-white"
                     style={{ backgroundColor: colors.success }}>
                  ✅ Available Now
                </div>
              </div>
              
              {/* Enhanced Thumbnail Images */}
              <div className="grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden border-2 transition-all duration-200 hover:shadow-md`}
                    style={{
                      backgroundColor: colors.white,
                      borderColor: selectedImage === index ? colors.primary : colors.border,
                      transform: selectedImage === index ? 'scale(1.05)' : 'scale(1)'
                    }}
                  >
                    <img
                      src={image}
                      alt={`${selectedBike.bikeName || selectedBike.name} view ${index + 1}`}
                      className="w-full h-24 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x80?text=Bike';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Details Section */}
            <div className="rounded-xl shadow-lg p-8" style={{ backgroundColor: colors.white }}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold" style={{ color: colors.dark }}>
                    {selectedBike.bikeName || selectedBike.name}
                  </h1>
                  <div className="flex items-center">
                    <svg className="w-5 h-5" style={{ color: colors.warning }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1" style={{ color: colors.gray[500] }}>4.5</span>
                    <span className="text-xs ml-1" style={{ color: colors.textLight }}>(120 reviews)</span>
                  </div>
                </div>
                
                <div className="flex items-center flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium text-white" 
                        style={{ backgroundColor: colors.primary }}>
                    {selectedBike.brand || 'Premium'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium" 
                        style={{ backgroundColor: colors.gray[100], color: colors.text }}>
                    {selectedBike.bikeType || selectedBike.type || 'Bike'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium" 
                        style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                    ✅ Available Now
                  </span>
                  {selectedBike.model && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium" 
                          style={{ backgroundColor: colors.border, color: colors.text }}>
                      {selectedBike.model}
                    </span>
                  )}
                </div>

                {/* Vehicle Info */}
                <div className="mb-4 space-y-2">
                  <p className="text-sm" style={{ color: colors.textLight }}>
                    <span className="font-medium">Registration:</span> {selectedBike.registrationNumber}
                  </p>
                  <p className="text-sm" style={{ color: colors.textLight }}>
                    <span className="font-medium">Store:</span> {selectedBike.storeName}
                  </p>
                </div>

                {/* Package Selection */}
                {selectedBike.packages && selectedBike.packages.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-base font-semibold mb-3" style={{ color: colors.dark }}>
                      Choose Package
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedBike.packages.map((pkg, index) => {
                        const isSelected = selectedPackage?.id === pkg.id;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => handlePackageSelect(pkg)}
                            className={`p-4 rounded-lg border-2 text-center transition-all ${
                              isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-sm font-medium" style={{ color: colors.dark }}>
                              {pkg.daysDisplay}
                            </div>
                            <div className="text-xl font-bold" style={{ color: colors.primary }}>
                              {formatPrice(pkg.price)}
                            </div>
                            {pkg.hourlyRate && pkg.hourlyChargeAmount && (
                              <div className="text-xs" style={{ color: colors.textLight }}>
                                ₹{pkg.hourlyChargeAmount}/hr
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Security Deposit */}
                {selectedPackage && selectedPackage.deposit && (
                  <div className="mb-4 text-center">
                    <p className="text-sm" style={{ color: colors.danger }}>
                      *Security deposit: {formatPrice(selectedPackage.deposit)} (refundable)
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-3" style={{ color: colors.dark }}>Features</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {features.slice(0, 8).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm" style={{ color: colors.textLight }}>
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Section */}
              <div className="border-t pt-6" style={{ borderColor: colors.border }}>
                <button
                  onClick={handleBookNow}
                  disabled={bookingLoading || (!selectedBike.packages || selectedBike.packages.length === 0)}
                  className="w-full py-4 rounded-lg font-semibold text-white text-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    background: !isAuthenticated 
                      ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                      : colors.primary
                  }}
                >
                  {bookingLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : !isAuthenticated ? (
                    <div className="flex items-center justify-center">
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-2 0V5H5v10h10v-1a1 1 0 112 0v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm7.707 3.293a1 1 0 010 1.414L9.414 10H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Login to Book
                    </div>
                  ) : (
                    <>🚀 Book Now - {selectedPackage ? formatPrice(selectedPackage.price) : formatPrice(selectedBike.pricePerDay || selectedBike.price)}/day</>
                  )}
                </button>
                
                {!isAuthenticated && (
                  <p className="text-xs text-center mt-3 text-gray-500">
                    • Quick login with phone number<br/>
                    • Secure booking process
                  </p>
                )}

                <div className="flex items-center justify-center gap-4 mt-4 text-xs" style={{ color: colors.textLight }}>
                  <span>✅ Free cancellation up to 24 hours</span>
                  <span>•</span>
                  <span>🛡️ Insurance included</span>
                  <span>•</span>
                  <span>🔧 24/7 support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Sections */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "📜 Rental Terms",
                items: [
                  "Valid driving license required",
                  "Minimum age: 18 years", 
                  "Security deposit: ₹2000",
                  "Fuel not included",
                  "Late return charges apply"
                ]
              },
              {
                title: "🎁 What's Included",
                items: [
                  "Helmet (2 pieces)",
                  "Basic insurance coverage",
                  "24/7 roadside assistance",
                  "Free pickup & drop*",
                  "Sanitized bike"
                ]
              },
              {
                title: "📋 Policies",
                items: [
                  "No smoking in vehicle",
                  "Return with same fuel level",
                  "Report damages immediately",
                  "Follow traffic rules",
                  "Maximum 200km/day included"
                ]
              }
            ].map((section, index) => (
              <div key={index} className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow" style={{ backgroundColor: colors.white }}>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.dark }}>{section.title}</h3>
                <ul className="space-y-2" style={{ color: colors.gray[500] }}>
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm">• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Return to bikes list if no bike is selected
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4" style={{ color: colors.dark }}>
          No bike selected
        </h2>
        <button
          onClick={() => navigate('/rental/bikes')}
          className="px-6 py-3 font-medium text-white rounded-lg hover:opacity-90"
          style={{ backgroundColor: colors.primary }}
        >
          Browse Bikes
        </button>
      </div>
    </div>
  );
};

export default BikeDetails;
