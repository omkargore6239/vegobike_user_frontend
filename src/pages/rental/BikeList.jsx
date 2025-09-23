import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Updated Color Palette with your dark blue
const colors = {
  primary: '#1A1E82', // Your requested dark blue
  secondary: '#6B7280', // Gray-500
  success: '#10B981', // Emerald-500
  danger: '#EF4444', // Red-500
  warning: '#F59E0B', // Amber-500
  dark: '#1F2937', // Gray-800
  light: '#F9FAFB', // Gray-50
  white: '#FFFFFF', // White
  border: '#E5E7EB', // Gray-200
  text: '#374151', // Gray-700
  textLight: '#6B7280' // Gray-500
};

// API configuration
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8081';

// Default fallback images
const DEFAULT_IMAGES = {
  bike1: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICMxMEI5ODEsICMxQTFFODIpIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Ik0xMzAgMTYwTDI3MCA4MEwyODUgMTAwTTI3MCA4MEwyNDAgNjAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHA+dGV4dCB4PSIyMDAiIHk9IjIxMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TcG9ydCBCaWtlPC90ZXh0Pgo8L3N2Zz4=",
  bike2: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRUY0NDQ0Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Ik0xMzAgMTYwTDI3MCA4MEwyODUgMTAwTTI3MCA4MEwyNDAgNjAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHA+dGV4dCB4PSIyMDAiIHk9IjIxMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Dcml1aXNlcjwvdGV4dD4KPC9zdmc=",
  bike3: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjNzc0OEU1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Ik0xMzAgMTYwTDI3MCA4MEwyODUgMTAwTTI3MCA4MEwyNDAgNjAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHA+dGV4dCB4PSIyMDAiIHk9IjIxMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Ub3VyaW5nPC90ZXh0Pgo8L3N2Zz4=",
  bike4: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjU5RTBCIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFGMjkzNyIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFGMjkzNyIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Ik0xMzAgMTYwTDI3MCA4MEwyODUgMTAwTTI3MCA4MEwyNDAgNjAiIHN0cm9rZT0iIzFGMjkzNyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHA+dGV4dCB4PSIyMDAiIHk9IjIxMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMUYyOTM3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BZHZlbnR1cmU8L3RleHQ+Cjwvc3ZnPg=="
};

export default function BikeList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // State management
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddressType, setSelectedAddressType] = useState('');
  
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

  // API call function
  const makeApiCall = useCallback(async (url, options = {}) => {
    const defaultHeaders = {
      'Accept': 'application/json',
    };
    
    const defaultOptions = {
      method: 'GET',
      headers: { ...defaultHeaders, ...options.headers },
      ...options
    };

    try {
      console.log('Making API call to:', url);
      const response = await fetch(url, defaultOptions);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log('API Response data:', responseData);
      
      return responseData;
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  }, []);

  // Image URL helper function
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath || !imagePath.trim()) return null;
    const path = imagePath.trim();
    
    // If it's already a full URL
    if (path.startsWith('http') || path.startsWith('https')) return path;
    
    // If it starts with uploads
    if (path.startsWith('/uploads') || path.startsWith('uploads')) {
      return `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
    }
    
    // Default assume it's in uploads directory
    return `${BASE_URL}/uploads/${path}`;
  }, []);

  // Image Component with error handling
  const ImageWithFallback = React.memo(({ src, alt, className, fallback = DEFAULT_IMAGES.bike1 }) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const imageUrl = useMemo(() => {
      return src ? getImageUrl(src) : null;
    }, [src, getImageUrl]);

    const handleImageError = useCallback(() => {
      console.log('Failed to load image:', imageUrl);
      setHasError(true);
      setIsLoading(false);
    }, [imageUrl]);

    const handleImageLoad = useCallback(() => {
      setHasError(false);
      setIsLoading(false);
    }, []);

    useEffect(() => {
      if (imageUrl) {
        setHasError(false);
        setIsLoading(true);
      }
    }, [imageUrl]);

    if (!imageUrl || hasError) {
      return <img src={fallback} alt={alt} className={className} />;
    }

    return (
      <div className="relative">
        {isLoading && (
          <div className={`${className} bg-gray-100 flex items-center justify-center absolute inset-0 animate-pulse`}>
            <span className="text-xs text-gray-400">Loading...</span>
          </div>
        )}
        <img
          src={imageUrl}
          alt={alt}
          className={className}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
    );
  });

  ImageWithFallback.displayName = 'ImageWithFallback';

  // Fetch available bikes
  const fetchAvailableBikes = useCallback(async (page = 0, size = 12) => {
    if (!searchFilters.startDate || !searchFilters.endDate) {
      setError('Start date and end date are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        startDate: searchFilters.startDate,
        endDate: searchFilters.endDate,
        page: page.toString(),
        size: size.toString(),
      });

      if (searchFilters.addressType || selectedAddressType) {
        params.append('addressType', searchFilters.addressType || selectedAddressType);
      }
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const url = `${BASE_URL}/api/bikes/available?${params.toString()}`;
      const responseData = await makeApiCall(url);

      // Handle Spring Boot Page response format
      if (responseData.content) {
        setBikes(responseData.content);
        setTotalPages(responseData.totalPages || 0);
        setTotalElements(responseData.totalElements || 0);
        setCurrentPage(responseData.number || 0);
      } else if (Array.isArray(responseData)) {
        setBikes(responseData);
        setTotalPages(1);
        setTotalElements(responseData.length);
        setCurrentPage(0);
      } else {
        setBikes([]);
        setTotalPages(0);
        setTotalElements(0);
        setCurrentPage(0);
      }

      console.log(`Loaded ${responseData.content?.length || responseData.length || 0} bikes for page ${page}`);
    } catch (err) {
      console.error('Error fetching bikes:', err);
      setError('Failed to fetch available bikes. Please try again.');
      setBikes([]);
    } finally {
      setLoading(false);
    }
  }, [searchFilters, selectedAddressType, searchQuery, makeApiCall]);

  // Initial load
  useEffect(() => {
    console.log('BikeList component mounted, search filters:', searchFilters);
    if (searchFilters.startDate && searchFilters.endDate) {
      fetchAvailableBikes(0, 12);
    }
  }, [fetchAvailableBikes, searchFilters]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      fetchAvailableBikes(newPage, 12);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchAvailableBikes(0, 12);
  };

  // Handle bike booking
  const handleBookBike = (bike) => {
    const bookingParams = new URLSearchParams({
      ...searchFilters,
      bikeId: bike.id.toString()
    });
    
    navigate(`/rental/booking/${bike.id}?${bookingParams.toString()}`);
  };

  // Get bike image fallback
  const getBikeImage = (index) => {
    const bikeImages = [DEFAULT_IMAGES.bike1, DEFAULT_IMAGES.bike2, DEFAULT_IMAGES.bike3, DEFAULT_IMAGES.bike4];
    return bikeImages[index % bikeImages.length];
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price || 0);
  };

  // Format dates for display
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDisplayTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
      {/* Header Section */}
      <div style={{ backgroundColor: colors.primary }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Available Bikes</h1>
            <p className="text-white opacity-90">
              {searchFilters.startDate && searchFilters.endDate && (
                <>
                  {formatDisplayDate(searchFilters.startDate)} {formatDisplayTime(searchFilters.pickupTime)} - 
                  {formatDisplayDate(searchFilters.endDate)} {formatDisplayTime(searchFilters.dropoffTime)}
                </>
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
                  placeholder="Search bikes by model, brand, or features..."
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
                className="px-6 py-3 font-medium text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.primary }}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/search')}
                className="px-6 py-3 font-medium rounded-lg border-2 transition-all"
                style={{ 
                  borderColor: colors.primary,
                  color: colors.primary 
                }}
              >
                New Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 border rounded-lg" style={{ backgroundColor: '#FEF2F2', borderColor: colors.danger }}>
            <p className="text-sm" style={{ color: colors.danger }}>{error}</p>
            <button
              onClick={() => {
                setError('');
                fetchAvailableBikes(currentPage, 12);
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
              </p>
            </div>
            {totalPages > 1 && (
              <div className="text-sm" style={{ color: colors.textLight }}>
                Page {currentPage + 1} of {totalPages}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: colors.primary }}></div>
            <span className="ml-3" style={{ color: colors.text }}>Loading available bikes...</span>
          </div>
        )}

        {/* Bikes Grid */}
        {!loading && !error && bikes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {bikes.map((bike, index) => (
              <div
                key={bike.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {/* Bike Image */}
                <div className="aspect-video relative">
                  <ImageWithFallback
                    src={bike.images?.[0] || bike.image}
                    alt={`${bike.brand} ${bike.model}`}
                    className="w-full h-full object-cover"
                    fallback={getBikeImage(index)}
                  />
                  {bike.isPopular && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: colors.warning }}>
                      Popular
                    </div>
                  )}
                </div>

                {/* Bike Details */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg" style={{ color: colors.dark }}>
                      {bike.brand} {bike.model}
                    </h3>
                    <p className="text-sm" style={{ color: colors.textLight }}>
                      {bike.type} • {bike.year}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {bike.engineCapacity && (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: colors.primary + '15', color: colors.primary }}>
                          {bike.engineCapacity}cc
                        </span>
                      )}
                      {bike.fuelType && (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: colors.success + '15', color: colors.success }}>
                          {bike.fuelType}
                        </span>
                      )}
                      {bike.transmissionType && (
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: colors.warning + '15', color: colors.warning }}>
                          {bike.transmissionType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                        {formatPrice(bike.pricePerDay)}
                      </span>
                      <span className="text-sm" style={{ color: colors.textLight }}>
                        /day
                      </span>
                    </div>
                    {bike.weeklyDiscount > 0 && (
                      <p className="text-xs mt-1" style={{ color: colors.success }}>
                        {bike.weeklyDiscount}% off weekly rentals
                      </p>
                    )}
                  </div>

                  {/* Availability Status */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success }}></span>
                      <span className="text-sm" style={{ color: colors.success }}>
                        Available for your dates
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => handleBookBike(bike)}
                    className="w-full font-medium py-3 rounded-lg transition-all hover:opacity-90 text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
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
              Sorry, we couldn't find any bikes matching your search criteria for the selected dates.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/search')}
                className="px-6 py-3 font-medium text-white rounded-lg"
                style={{ backgroundColor: colors.primary }}
              >
                Try Different Dates
              </button>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedAddressType('');
                  fetchAvailableBikes(0, 12);
                }}
                className="block mx-auto px-6 py-3 font-medium rounded-lg border-2"
                style={{ borderColor: colors.primary, color: colors.primary }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: colors.border, color: colors.text }}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = Math.max(0, Math.min(currentPage - 2, totalPages - 5)) + i;
              const isActive = pageNum === currentPage;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className="px-4 py-2 rounded-lg border-2 transition-all"
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
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: colors.border, color: colors.text }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
