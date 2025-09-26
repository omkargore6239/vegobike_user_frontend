// pages/rental/BikeList.jsx - Updated to redirect to checkout page
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, BOOKING_STEPS } from '../../utils/constants';

// Updated Color Palette
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
  cardShadow: 'rgba(0, 0, 0, 0.1)'
};

// API configuration
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8081';

// Default fallback images for different categories
const DEFAULT_IMAGES = {
  1: "https://via.placeholder.com/400x280/10B981/FFFFFF?text=Sport+Bike",
  2: "https://via.placeholder.com/400x280/EF4444/FFFFFF?text=Cruiser",
  3: "https://via.placeholder.com/400x280/7748E5/FFFFFF?text=Touring",
  default: "https://via.placeholder.com/400x280/6B7280/FFFFFF?text=Bike+Image"
};

// API Service class for standardized API calls
class BikeApiService {
  static async fetchAvailableBikes(startDate, endDate, page = 0, size = 12, addressType = '', search = '') {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        page: page.toString(),
        size: size.toString(),
      });

      if (addressType) params.append('addressType', addressType);
      if (search) params.append('search', search);

      console.log('🚀 BIKE_API - Fetching bikes with params:', params.toString());

      const response = await fetch(`${BASE_URL}/api/bikes/available?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ BIKE_API - Raw API response:', data);
      return data;
    } catch (error) {
      console.error('❌ BIKE_API - Error fetching bikes:', error);
      throw error;
    }
  }

  static async fetchAllBikes() {
    try {
      const response = await fetch(`${BASE_URL}/api/bikes/all`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ BIKE_API - All bikes response:', data);
      return data;
    } catch (error) {
      console.error('❌ BIKE_API - Error fetching all bikes:', error);
      throw error;
    }
  }

  static getImageUrl(imageUrl) {
    if (!imageUrl || !imageUrl.trim()) {
      return null;
    }
    
    const url = imageUrl.trim();
    
    if (url.startsWith('http')) {
      return url;
    }
    
    if (url.startsWith('/')) {
      return `${BASE_URL}${url}`;
    }
    
    return `${BASE_URL}/${url}`;
  }
}

// Enhanced Image Component
const BikeImage = React.memo(({ src, alt, className, categoryId, bikeId }) => {
  const [imageState, setImageState] = useState({
    loading: true,
    error: false,
    loaded: false
  });

  const processedImageUrl = useMemo(() => {
    return BikeApiService.getImageUrl(src);
  }, [src]);

  const fallbackImage = useMemo(() => {
    return DEFAULT_IMAGES[categoryId] || DEFAULT_IMAGES.default;
  }, [categoryId]);

  const handleImageLoad = useCallback(() => {
    console.log(`📷 BIKE_IMAGE - Image loaded successfully for bike ${bikeId}`);
    setImageState({ loading: false, error: false, loaded: true });
  }, [bikeId]);

  const handleImageError = useCallback(() => {
    console.warn(`⚠️ BIKE_IMAGE - Failed to load image for bike ${bikeId}, using fallback`);
    setImageState({ loading: false, error: true, loaded: false });
  }, [bikeId]);

  useEffect(() => {
    if (processedImageUrl) {
      setImageState({ loading: true, error: false, loaded: false });
    }
  }, [processedImageUrl]);

  if (!processedImageUrl || imageState.error) {
    return (
      <img 
        src={fallbackImage} 
        alt={alt} 
        className={className}
        style={{ objectFit: 'cover' }}
        onLoad={() => console.log(`📷 BIKE_IMAGE - Fallback image loaded for bike ${bikeId}`)}
      />
    );
  }

  return (
    <div className="relative w-full h-full">
      {imageState.loading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center animate-pulse rounded-t-2xl z-10">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={processedImageUrl}
        alt={alt}
        className={`${className} ${imageState.loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        style={{ objectFit: 'cover' }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
});

BikeImage.displayName = 'BikeImage';

// Enhanced Authentication Status Component with booking context
const AuthenticationStatus = React.memo(({ isAuthenticated, user, pendingBooking }) => {
  if (!isAuthenticated) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-green-800">
            ✅ Welcome back, {user?.name || user?.phoneNumber || 'User'}! 
            {pendingBooking ? ' Continuing your booking...' : ' You\'re ready to book bikes.'}
          </p>
        </div>
      </div>
    </div>
  );
});

AuthenticationStatus.displayName = 'AuthenticationStatus';

// Booking Intent Banner Component
const BookingIntentBanner = React.memo(({ pendingBooking, bookingStep, onClearIntent }) => {
  if (!pendingBooking) return null;

  const getBannerContent = () => {
    switch (bookingStep) {
      case BOOKING_STEPS.CHECKOUT:
        return {
          icon: '🎯',
          title: 'Checkout Ready',
          message: `Ready to complete booking for ${pendingBooking.bikeName || 'selected bike'}`,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800'
        };
      case BOOKING_STEPS.BIKES:
        return {
          icon: '🚲',
          title: 'Bike Selection Saved',
          message: 'Continue with your bike selection and checkout',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-800'
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
});

BookingIntentBanner.displayName = 'BookingIntentBanner';

export default function BikeList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { 
    isAuthenticated, 
    authCheckComplete, 
    user, 
    loading: authLoading,
    storeBookingIntent,
    pendingBooking,
    bookingStep,
    clearBookingIntent
  } = useAuth();
  
  // State management
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddressType, setSelectedAddressType] = useState('');
  const [selectedPackages, setSelectedPackages] = useState({});
  const [showAuthStatus, setShowAuthStatus] = useState(false);

  // Extract search parameters from URL
  const searchFilters = useMemo(() => {
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const city = searchParams.get('city');
    const pickupMode = searchParams.get('pickupMode');
    const store = searchParams.get('store');
    const deliveryAddress = searchParams.get('deliveryAddress');
    const pickupTime = searchParams.get('pickupTime');
    const dropoffTime = searchParams.get('dropoffTime');
    
    return {
      startDate,
      endDate,
      city,
      pickupMode,
      store,
      deliveryAddress,
      pickupTime,
      dropoffTime
    };
  }, [searchParams]);

  // Get bike display name - MOVED UP BEFORE IT'S USED
  const getBikeDisplayName = useCallback((bike) => {
    if (bike.brand && bike.model) {
      return `${bike.brand} ${bike.model}`;
    }
    
    if (bike.name) {
      return bike.name;
    }
    
    const reg = bike.registrationNumber || 'Unknown Bike';
    return reg;
  }, []);

  // Format price
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price || 0);
  }, []);

  // Format dates for display
  const formatDisplayDate = useCallback((dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  }, []);

  const formatDisplayTime = useCallback((timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }, []);

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

  // Fetch available bikes
  const fetchAvailableBikes = useCallback(async (page = 0, size = 12) => {
    if (!searchFilters.startDate || !searchFilters.endDate) {
      setError('Start date and end date are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const responseData = await BikeApiService.fetchAvailableBikes(
        searchFilters.startDate,
        searchFilters.endDate,
        page,
        size,
        selectedAddressType,
        searchQuery.trim()
      );

      if (responseData && responseData.content) {
        setBikes(responseData.content);
        setTotalPages(responseData.totalPages || 0);
        setTotalElements(responseData.totalElements || 0);
        setCurrentPage(responseData.number || 0);
        setPageSize(responseData.size || 12);
        
        const initialPackages = {};
        responseData.content.forEach(bike => {
          if (bike.packages && bike.packages.length > 0) {
            initialPackages[bike.id] = bike.packages[0];
          }
        });
        setSelectedPackages(initialPackages);
      } else {
        setBikes([]);
        setTotalPages(0);
        setTotalElements(0);
        setCurrentPage(0);
      }
    } catch (err) {
      console.error('❌ BIKE_LIST - Error fetching bikes:', err);
      setError(`Failed to fetch available bikes: ${err.message}`);
      setBikes([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [searchFilters, selectedAddressType, searchQuery]);

  // Fetch all bikes
  const fetchAllBikes = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const allBikes = await BikeApiService.fetchAllBikes();
      
      if (Array.isArray(allBikes)) {
        setBikes(allBikes);
        setTotalElements(allBikes.length);
        setTotalPages(Math.ceil(allBikes.length / pageSize));
        setCurrentPage(0);
        
        const initialPackages = {};
        allBikes.forEach(bike => {
          if (bike.packages && bike.packages.length > 0) {
            initialPackages[bike.id] = bike.packages[0];
          }
        });
        setSelectedPackages(initialPackages);
      }
    } catch (err) {
      console.error('❌ BIKE_LIST - Error fetching all bikes:', err);
      setError(`Failed to fetch bikes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  // Initial load
  useEffect(() => {
    if (searchFilters.startDate && searchFilters.endDate) {
      fetchAvailableBikes(0, pageSize);
    } else {
      fetchAllBikes();
    }
  }, [fetchAvailableBikes, fetchAllBikes, searchFilters, pageSize]);

  // Enhanced handleBookBike to redirect directly to checkout
  const handleBookBike = useCallback((bike) => {
    console.log('🚲 BIKE_LIST - Attempting to book bike:', bike.id, 'Auth status:', isAuthenticated);
    
    if (!authCheckComplete) {
      console.log('⏳ BIKE_LIST - Auth check not complete yet');
      return;
    }

    // Get selected package
    const selectedPackage = selectedPackages[bike.id];
    
    // Prepare booking data for checkout
    const bookingData = {
      // Search parameters
      startDate: searchFilters.startDate,
      endDate: searchFilters.endDate,
      city: searchFilters.city,
      pickupMode: searchFilters.pickupMode,
      store: searchFilters.store || '',
      deliveryAddress: searchFilters.deliveryAddress || '',
      pickupTime: searchFilters.pickupTime,
      dropoffTime: searchFilters.dropoffTime,
      
      // Bike and package details
      bikeId: bike.id.toString(),
      packageId: selectedPackage?.id || bike.packages?.[0]?.id || '',
      price: selectedPackage?.price || bike.packages?.[0]?.price || 0,
      deposit: selectedPackage?.deposit || bike.packages?.[0]?.deposit || 2000,
      
      // Additional bike info for checkout
      bikeName: getBikeDisplayName(bike),
      bikeImage: bike.mainImageUrl || bike.image || '',
      registrationNumber: bike.registrationNumber || '',
      storeName: bike.storeName || '',
      packageName: selectedPackage?.daysDisplay || bike.packages?.[0]?.daysDisplay || '',
      
      // Booking metadata
      timestamp: new Date().toISOString(),
      source: 'bike-list'
    };

    if (!isAuthenticated) {
      console.log('🚫 BIKE_LIST - User not authenticated, storing booking intent and redirecting to login');
      
      // Store booking intent for after login
      storeBookingIntent(bookingData, BOOKING_STEPS.CHECKOUT);
      
      // Create return URL that will redirect to checkout after login
      const checkoutParams = new URLSearchParams(bookingData).toString();
      const checkoutUrl = `${ROUTES.RENTAL}/checkout?${checkoutParams}`;
      const returnUrl = encodeURIComponent(checkoutUrl);
      
      navigate(`${ROUTES.LOGIN}?returnUrl=${returnUrl}`);
      return;
    }

    // User is authenticated, proceed directly to checkout
    console.log('✅ BIKE_LIST - User authenticated, proceeding to checkout');
    
    const checkoutParams = new URLSearchParams(bookingData).toString();
    navigate(`${ROUTES.RENTAL}/checkout?${checkoutParams}`);
    
  }, [
    searchFilters, 
    selectedPackages, 
    navigate, 
    isAuthenticated, 
    authCheckComplete, 
    storeBookingIntent, 
    getBikeDisplayName
  ]);

  // Handle booking intent from URL parameters (after login redirect)
  useEffect(() => {
    if (isAuthenticated && authCheckComplete && bikes.length > 0) {
      const urlParams = new URLSearchParams(location.search);
      const bikeId = urlParams.get('bikeId');
      const action = urlParams.get('action');
      
      if (bikeId && action === 'book') {
        const bike = bikes.find(b => b.id.toString() === bikeId);
        
        if (bike) {
          console.log('🎯 BIKE_LIST - Processing booking intent from URL for bike:', bike.id);
          
          // Clean URL
          const newParams = new URLSearchParams(location.search);
          newParams.delete('bikeId');
          newParams.delete('action');
          const cleanUrl = `${location.pathname}${newParams.toString() ? '?' + newParams.toString() : ''}`;
          window.history.replaceState({}, '', cleanUrl);
          
          // Show welcome message and proceed to checkout
          setShowAuthStatus(true);
          setTimeout(() => {
            handleBookBike(bike);
          }, 1000);
        }
      }
    }
  }, [isAuthenticated, authCheckComplete, bikes, handleBookBike, location]);

  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      
      if (searchFilters.startDate && searchFilters.endDate) {
        fetchAvailableBikes(newPage, pageSize);
      } else {
        fetchAllBikes();
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, totalPages, fetchAvailableBikes, fetchAllBikes, pageSize, searchFilters]);

  // Handle search
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setCurrentPage(0);
    
    if (searchFilters.startDate && searchFilters.endDate) {
      fetchAvailableBikes(0, pageSize);
    } else {
      fetchAllBikes();
    }
  }, [fetchAvailableBikes, fetchAllBikes, pageSize, searchFilters]);

  // Handle package selection
  const handlePackageSelect = useCallback((bikeId, packageData) => {
    setSelectedPackages(prev => ({
      ...prev,
      [bikeId]: packageData
    }));
  }, []);

  // Handle login navigation
  const handleLoginClick = useCallback(() => {
    const currentPath = `${location.pathname}${location.search}`;
    const returnUrl = encodeURIComponent(currentPath);
    navigate(`${ROUTES.LOGIN}?returnUrl=${returnUrl}`);
  }, [navigate, location]);

  // Handle clear booking intent
  const handleClearBookingIntent = useCallback(() => {
    clearBookingIntent();
  }, [clearBookingIntent]);

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 }, 
      (_, i) => startPage + i
    );

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-4 py-2 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          style={{ borderColor: colors.border, color: colors.text }}
        >
          Previous
        </button>
        
        {startPage > 0 && (
          <>
            <button
              onClick={() => handlePageChange(0)}
              className="px-4 py-2 rounded-lg border-2 transition-all hover:bg-gray-50"
              style={{ borderColor: colors.border, color: colors.text }}
            >
              1
            </button>
            {startPage > 1 && <span className="px-2">...</span>}
          </>
        )}

        {pageNumbers.map((pageNum) => {
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className="px-4 py-2 rounded-lg border-2 transition-all hover:opacity-80"
              style={{
                borderColor: isActive ? colors.primary : colors.border,
                backgroundColor: isActive ? colors.primary : 'transparent',
                color: isActive ? colors.white : colors.text
              }}
            >
              {pageNum + 1}
            </button>
          );
        })}

        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages - 1)}
              className="px-4 py-2 rounded-lg border-2 transition-all hover:bg-gray-50"
              style={{ borderColor: colors.border, color: colors.text }}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="px-4 py-2 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          style={{ borderColor: colors.border, color: colors.text }}
        >
          Next
        </button>
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
      {/* Header Section */}
      <div style={{ backgroundColor: colors.primary }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Available Bikes</h1>
            <p className="text-white opacity-90">
              {searchFilters.startDate && searchFilters.endDate ? (
                <>
                  {formatDisplayDate(searchFilters.startDate)} {formatDisplayTime(searchFilters.pickupTime)} - 
                  {formatDisplayDate(searchFilters.endDate)} {formatDisplayTime(searchFilters.dropoffTime)}
                </>
              ) : (
                'Browse all available bikes'
              )}
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <form onSubmit={handleSearch} className="flex gap-4 flex-wrap items-center">
              <div className="flex-1 min-w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bikes by registration number, store name..."
                  className="w-full p-3 border-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: colors.border,
                    focusRingColor: colors.primary 
                  }}
                />
              </div>
              
              <select
                value={selectedAddressType}
                onChange={(e) => setSelectedAddressType(e.target.value)}
                className="p-3 border-2 rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{ 
                  borderColor: colors.border,
                  focusRingColor: colors.primary 
                }}
              >
                <option value="">All Address Types</option>
                <option value="pickup">Pickup Only</option>
                <option value="delivery">Delivery Available</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 font-medium text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                style={{ backgroundColor: colors.primary }}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(ROUTES.RENTAL_SEARCH)}
                className="px-6 py-3 font-medium rounded-lg border-2 transition-all hover:opacity-80"
                style={{ 
                  borderColor: colors.primary,
                  color: colors.primary 
                }}
              >
                New Search
              </button>

              {/* Login/User Status */}
              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className="px-6 py-3 font-medium text-white rounded-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: colors.success }}
                >
                  Login
                </button>
              ) : (
                <div className="flex items-center bg-green-100 px-4 py-2 rounded-lg">
                  <svg className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">
                    Hi, {user?.name || user?.phoneNumber || 'User'}!
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Booking Intent Banner */}
        <BookingIntentBanner 
          pendingBooking={pendingBooking} 
          bookingStep={bookingStep}
          onClearIntent={handleClearBookingIntent}
        />

        {/* Authentication Status Message */}
        {showAuthStatus && isAuthenticated && (
          <AuthenticationStatus 
            isAuthenticated={isAuthenticated} 
            user={user} 
            pendingBooking={pendingBooking}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 border rounded-lg" style={{ backgroundColor: '#FEF2F2', borderColor: colors.danger }}>
            <p className="text-sm" style={{ color: colors.danger }}>{error}</p>
            <button
              onClick={() => {
                setError('');
                if (searchFilters.startDate && searchFilters.endDate) {
                  fetchAvailableBikes(currentPage, pageSize);
                } else {
                  fetchAllBikes();
                }
              }}
              className="text-sm underline mt-2 hover:opacity-80"
              style={{ color: colors.danger }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Results Info */}
        {!loading && !error && (
          <div className="mb-6 flex justify-between items-center">
            <div>
              <p style={{ color: colors.text }}>
                Showing {bikes.length} of {totalElements} available bikes
                {totalPages > 1 && ` (Page ${currentPage + 1} of ${totalPages})`}
              </p>
            </div>
            {totalPages > 1 && (
              <div className="text-sm" style={{ color: colors.textLight }}>
                {pageSize} bikes per page
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="ml-3" style={{ color: colors.text }}>Loading available bikes...</span>
          </div>
        )}

        {/* Bikes Grid */}
        {!loading && !error && bikes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {bikes.map((bike) => {
              const selectedPackage = selectedPackages[bike.id] || bike.packages?.[0];
              
              return (
                <div
                  key={bike.id}
                  className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{ 
                    boxShadow: `0 8px 25px ${colors.cardShadow}`,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  {/* Bike Image */}
                  <div className="relative w-full h-64 overflow-hidden rounded-t-2xl">
                    <BikeImage
                      src={bike.mainImageUrl}
                      alt={getBikeDisplayName(bike)}
                      className="w-full h-full"
                      categoryId={bike.categoryId}
                      bikeId={bike.id}
                    />
                    
                    {/* Orange badge */}
                    <div 
                      className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.orange }}
                    >
                      <svg 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="white"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    {/* Bike Name */}
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.dark }}>
                      {getBikeDisplayName(bike)}
                    </h3>

                    {/* Vehicle Registration and Store Info */}
                    <div className="mb-2">
                      <p className="text-sm" style={{ color: colors.textLight }}>
                        <span className="font-medium">Vehicle:</span> {bike.registrationNumber}
                      </p>
                      <p className="text-sm" style={{ color: colors.textLight }}>
                        <span className="font-medium">Store:</span> {bike.storeName}
                      </p>
                    </div>

                    {/* Choose Package Section */}
                    <div className="mb-4">
                      <h4 className="text-base font-semibold mb-3" style={{ color: colors.dark }}>
                        Choose Package
                      </h4>
                      
                      {bike.packages && bike.packages.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {bike.packages.map((pkg, index) => {
                            const isSelected = selectedPackage?.days === pkg.days && 
                                             selectedPackage?.hourlyRate === pkg.hourlyRate;
                            
                            return (
                              <button
                                key={index}
                                onClick={() => handlePackageSelect(bike.id, pkg)}
                                className={`p-3 rounded-lg border-2 text-center transition-all ${
                                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="text-sm font-medium" style={{ color: colors.dark }}>
                                  {pkg.daysDisplay}
                                </div>
                                <div className="text-lg font-bold" style={{ color: colors.primary }}>
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
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm" style={{ color: colors.textLight }}>
                            No packages available for this bike
                          </p>
                          <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                            Please contact support for pricing
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Security Deposit */}
                    {selectedPackage && selectedPackage.deposit && (
                      <div className="mb-4 text-center">
                        <p className="text-sm" style={{ color: colors.danger }}>
                          *Security deposit: {formatPrice(selectedPackage.deposit)} (refundable)
                        </p>
                      </div>
                    )}

                    {/* Book Now Button - Updated to indicate checkout redirect */}
                    <button
                      onClick={() => handleBookBike(bike)}
                      disabled={!bike.packages || bike.packages.length === 0}
                      className={`w-full py-4 rounded-lg font-semibold text-white text-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${
                        !isAuthenticated ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' : ''
                      }`}
                      style={{ 
                        backgroundColor: isAuthenticated ? colors.primary : undefined
                      }}
                    >
                      {!isAuthenticated ? (
                        <div className="flex items-center justify-center">
                          <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-2 0V5H5v10h10v-1a1 1 0 112 0v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm7.707 3.293a1 1 0 010 1.414L9.414 10H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Login to Checkout
                        </div>
                      ) : (
                        bike.packages && bike.packages.length > 0 ? (
                          <div className="flex items-center justify-center">
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                            </svg>
                            Proceed to Checkout
                          </div>
                        ) : 'Contact for Pricing'
                      )}
                    </button>
                    
                    {/* Authentication hint */}
                    {!isAuthenticated && (bike.packages && bike.packages.length > 0) && (
                      <p className="text-xs text-center mt-2 text-gray-500">
                        Quick login with OTP • Direct checkout process
                      </p>
                    )}
                    
                    {/* Checkout hint for authenticated users */}
                    {isAuthenticated && (bike.packages && bike.packages.length > 0) && (
                      <p className="text-xs text-center mt-2 text-blue-600">
                        Click to review details and complete payment
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && bikes.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto" style={{ color: colors.textLight }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.35 0-4.438-.784-6.131-2.1.454-.28.94-.526 1.47-.709C8.483 9.26 10.196 9 12 9s3.517.26 4.661 1.191c.53.183 1.016.43 1.47.709A7.962 7.962 0 0112 15z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: colors.dark }}>
              No Bikes Available
            </h3>
            <p className="mb-6" style={{ color: colors.textLight }}>
              Sorry, we couldn't find any bikes matching your search criteria.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate(ROUTES.RENTAL_SEARCH)}
                className="px-6 py-3 font-medium text-white rounded-lg hover:opacity-90"
                style={{ backgroundColor: colors.primary }}
              >
                Try Different Search
              </button>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedAddressType('');
                  fetchAllBikes();
                }}
                className="block mx-auto px-6 py-3 font-medium rounded-lg border-2 hover:opacity-80"
                style={{ borderColor: colors.primary, color: colors.primary }}
              >
                Show All Bikes
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
}
