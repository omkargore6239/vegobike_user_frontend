// pages/rental/BikeList.jsx - Professional, Mobile Responsive with Pagination
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8081';

const DEFAULT_IMAGES = {
  1: "https://via.placeholder.com/400x280/10B981/FFFFFF?text=Sport+Bike",
  2: "https://via.placeholder.com/400x280/EF4444/FFFFFF?text=Cruiser",
  3: "https://via.placeholder.com/400x280/7748E5/FFFFFF?text=Touring",
  default: "https://via.placeholder.com/400x280/6B7280/FFFFFF?text=Bike+Image"
};

class BikeApiService {
  static async fetchAvailableBikes(startDate, endDate, page = 0, size = 12) {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        page: page.toString(),
        size: size.toString(),
      });

      const response = await fetch(`${BASE_URL}/api/bikes/available?${params.toString()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  static getImageUrl(imageUrl) {
    if (!imageUrl || !imageUrl.trim()) return null;
    const url = imageUrl.trim();
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return `${BASE_URL}${url}`;
    return `${BASE_URL}/${url}`;
  }
}

const BikeImage = React.memo(({ src, alt, className, categoryId }) => {
  const [imageState, setImageState] = useState({ loading: true, error: false });
  const processedImageUrl = useMemo(() => BikeApiService.getImageUrl(src), [src]);
  const fallbackImage = useMemo(() => DEFAULT_IMAGES[categoryId] || DEFAULT_IMAGES.default, [categoryId]);

  if (!processedImageUrl || imageState.error) {
    return <img src={fallbackImage} alt={alt} className={className} style={{ objectFit: 'cover' }} />;
  }

  return (
    <div className="relative w-full h-full">
      {imageState.loading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center animate-pulse z-10">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={processedImageUrl}
        alt={alt}
        className={`${className} ${imageState.loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        onLoad={() => setImageState({ loading: false, error: false })}
        onError={() => setImageState({ loading: false, error: true })}
        loading="lazy"
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
});

BikeImage.displayName = 'BikeImage';

export default function BikeList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, authCheckComplete, authLoading } = useAuth();
  
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPackages, setSelectedPackages] = useState({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(12);

  const searchFilters = useMemo(() => ({
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    pickupTime: searchParams.get('pickupTime') || '10:00',
    dropoffTime: searchParams.get('dropoffTime') || '19:00',
    city: searchParams.get('city') || '',
    pickupMode: searchParams.get('pickupMode') || 'self-pickup',
    deliveryAddress: searchParams.get('deliveryAddress') || ''
  }), [searchParams]);

  const calculateDuration = useCallback(() => {
    const { startDate, endDate, pickupTime, dropoffTime } = searchFilters;
    if (!startDate || !endDate || !pickupTime || !dropoffTime) return null;
    
    const start = new Date(`${startDate}T${pickupTime}`);
    const end = new Date(`${endDate}T${dropoffTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    
    return {
      totalHours: hours,
      days: Math.floor(hours / 24),
      remainingHours: Math.floor(hours % 24),
      isHourly: hours <= 6,
      isDaily: hours > 6 && hours <= 144,
      isWeekly: hours > 144
    };
  }, [searchFilters]);

  const duration = calculateDuration();

  const getBookingType = useCallback((packageData) => {
    if (!packageData) return 'CUSTOM';
    if (packageData.days === 0) return 'HOURLY';
    if (packageData.days === 1) return 'DAILY';
    if (packageData.days === 7) return 'WEEKLY';
    return 'CUSTOM';
  }, []);

  const getBookingTypeBadge = useCallback((bookingType) => {
    switch (bookingType) {
      case 'HOURLY':
        return { bg: 'bg-green-100', text: 'text-green-700', label: 'HOURLY' };
      case 'DAILY':
        return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'DAILY' };
      case 'WEEKLY':
        return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'WEEKLY' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'CUSTOM' };
    }
  }, []);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price || 0);
  }, []);

  const formatDisplayDate = useCallback((dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  }, []);

  const formatDisplayTime = useCallback((timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }, []);

  const getBikeDisplayName = useCallback((bike) => {
    if (bike.brand && bike.model) return `${bike.brand} ${bike.model}`;
    if (bike.name) return bike.name;
    return bike.registrationNumber || 'Unknown Bike';
  }, []);

  const handlePackageSelect = useCallback((bikeId, packageData) => {
    setSelectedPackages(prev => ({
      ...prev,
      [bikeId]: packageData
    }));
  }, []);

  const fetchBikes = useCallback(async (page = 0) => {
    const { startDate, endDate } = searchFilters;
    if (!startDate || !endDate) {
      setError('Start date and end date are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const responseData = await BikeApiService.fetchAvailableBikes(startDate, endDate, page, pageSize);
      setBikes(responseData?.content || []);
      setTotalPages(responseData?.totalPages || 0);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError('Unable to load bikes at this moment. Please try again.');
      setBikes([]);
    } finally {
      setLoading(false);
    }
  }, [searchFilters, pageSize]);

  useEffect(() => {
    if (searchFilters.startDate && searchFilters.endDate) {
      fetchBikes(0);
    }
  }, [searchFilters, fetchBikes]);

  const handleBookBike = useCallback((bike) => {
    if (!authCheckComplete) return;
    
    if (!searchFilters.startDate || !searchFilters.endDate) {
      alert('Please select valid dates');
      return;
    }
    
    if (!searchFilters.pickupTime || !searchFilters.dropoffTime) {
      alert('Please select valid times');
      return;
    }
    
    const selectedPackage = selectedPackages[bike.id];
    
    const bookingData = {
      bikeId: bike.id.toString(),
      bikeName: getBikeDisplayName(bike),
      bikeImage: bike.mainImageUrl || bike.image || '',
      registrationNumber: bike.registrationNumber || '',
      storeName: bike.storeName || '',
      categoryId: bike.categoryId?.toString() || '',
      
      startDate: searchFilters.startDate,
      endDate: searchFilters.endDate,
      pickupTime: searchFilters.pickupTime,
      dropoffTime: searchFilters.dropoffTime,
      
      city: searchFilters.city || '',
      pickupMode: searchFilters.pickupMode || 'self-pickup',
      deliveryAddress: searchFilters.deliveryAddress || '',
      
      totalHours: (duration?.totalHours || 0).toString(),
      
      packageId: selectedPackage?.id?.toString() || '',
      packageName: selectedPackage?.daysDisplay || (duration?.isHourly ? 'Hourly Booking' : duration?.isDaily ? 'Daily Booking' : 'Weekly Booking'),
      packagePrice: selectedPackage?.price?.toString() || '',
      packageDeposit: selectedPackage?.deposit?.toString() || '',
      
      bookingType: selectedPackage ? getBookingType(selectedPackage) : (duration?.isHourly ? 'HOURLY' : duration?.isDaily ? 'DAILY' : 'WEEKLY'),
      
      hasPackageSelected: selectedPackage ? 'true' : 'false',
      timestamp: new Date().toISOString(),
      source: 'bike-list'
    };
    
    const checkoutParams = new URLSearchParams();
    Object.entries(bookingData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        checkoutParams.set(key, value.toString());
      }
    });

    if (!isAuthenticated) {
      const checkoutUrl = `${ROUTES.RENTAL}/checkout?${checkoutParams.toString()}`;
      const returnUrl = encodeURIComponent(checkoutUrl);
      navigate(`${ROUTES.LOGIN}?returnUrl=${returnUrl}`);
      return;
    }

    navigate(`${ROUTES.RENTAL}/checkout?${checkoutParams.toString()}`);
  }, [
    searchFilters,
    duration,
    selectedPackages,
    navigate,
    isAuthenticated,
    authCheckComplete,
    getBikeDisplayName,
    getBookingType
  ]);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      fetchBikes(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      fetchBikes(currentPage + 1);
    }
  };

  if (authLoading && !authCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div style={{ backgroundColor: colors.primary }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
          <div className="text-center mb-3 sm:mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Available Bikes</h1>
            <p className="text-white opacity-90 text-xs sm:text-sm">
              {searchFilters.startDate && searchFilters.endDate ? (
                <>
                  {formatDisplayDate(searchFilters.startDate)} {formatDisplayTime(searchFilters.pickupTime)} - 
                  {formatDisplayDate(searchFilters.endDate)} {formatDisplayTime(searchFilters.dropoffTime)}
                  {duration && (
                    <span className="ml-2 px-2 sm:px-3 py-1 bg-white bg-opacity-20 rounded-full inline-block mt-2 sm:mt-0 text-xs">
                      {duration.totalHours.toFixed(1)} hours
                      {duration.isHourly && ' (Hourly)'}
                      {duration.isDaily && ' (Daily)'}
                    </span>
                  )}
                </>
              ) : 'Select dates to view bikes'}
            </p>
          </div>
        </div>
      </div>

      {/* Bikes Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {loading && (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600 text-sm">Loading bikes...</span>
          </div>
        )}

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 border rounded-lg bg-red-50 border-red-200">
            <p className="text-xs sm:text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && bikes.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {bikes.map((bike) => {
                const selectedPackage = selectedPackages[bike.id];
                const bookingType = getBookingType(selectedPackage);
                const badge = getBookingTypeBadge(bookingType);
                
                return (
                  <div key={bike.id} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg">
                    <div className="relative w-full h-40 sm:h-48 lg:h-56 overflow-hidden">
                      <BikeImage
                        src={bike.mainImageUrl}
                        alt={getBikeDisplayName(bike)}
                        className="w-full h-full"
                        categoryId={bike.categoryId}
                      />
                    </div>

                    <div className="p-3 sm:p-4 lg:p-6">
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 text-gray-900 line-clamp-1">
                        {getBikeDisplayName(bike)}
                      </h3>

                      <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Vehicle:</span> {bike.registrationNumber}</p>
                        <p><span className="font-medium">Store:</span> {bike.storeName}</p>
                      </div>

                      {/* Package Selection */}
                      <div className="mb-3 sm:mb-4">
                       
                        
                        {bike.packages && bike.packages.length > 0 ? (
                          <div className="grid grid-cols-2 gap-2">
                            {bike.packages.map((pkg, index) => {
                              const isSelected = selectedPackage?.id === pkg.id;
                              const pkgBookingType = getBookingType(pkg);
                              const pkgBadge = getBookingTypeBadge(pkgBookingType);
                              
                              return (
                                <button
                                  key={index}
                                  onClick={() => handlePackageSelect(bike.id, pkg)}
                                  className={`p-2 sm:p-3 rounded-lg border-2 text-center transition-all ${
                                    isSelected 
                                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                  }`}
                                >
                                  <div className="flex items-center justify-center mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pkgBadge.bg} ${pkgBadge.text}`}>
                                      {pkgBadge.label}
                                    </span>
                                  </div>
                                  
                                  <div className="text-xs sm:text-sm font-medium text-gray-700">
                                    {pkg.daysDisplay}
                                  </div>
                                  
                                  <div className="text-base sm:text-lg font-bold text-blue-600">
                                    {formatPrice(pkg.price)}
                                  </div>
                                  
                                  {pkg.days === 0 && (
                                    <div className="text-xs text-gray-500 mt-1">Per hour</div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-3">
                            <p className="text-xs sm:text-sm text-gray-500">No packages available</p>
                          </div>
                        )}
                      </div>



                      {/* Security Deposit */}
                      {selectedPackage && selectedPackage.deposit && (
                        <div className="mb-3 sm:mb-4 text-center">
                          <p className="text-xs text-red-600">
                            Deposit: {formatPrice(selectedPackage.deposit)}
                          </p>
                        </div>
                      )}

                      {/* Book Button */}
                      <button
                        onClick={() => handleBookBike(bike)}
                        className="w-full py-2 sm:py-3 lg:py-4 rounded-lg font-semibold text-white text-sm sm:text-base transition-all hover:opacity-90"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {!isAuthenticated ? 'Login to Book' : 'Checkout'}
                      </button>

                     
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 lg:mt-12">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  className="p-2 sm:p-3 rounded-lg border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-1 sm:gap-2">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => fetchBikes(idx)}
                      className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                        currentPage === idx
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 sm:p-3 rounded-lg border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                >
                  <ChevronRight size={20} />
                </button>

                <span className="text-xs sm:text-sm text-gray-600 ml-2 sm:ml-4">
                  Page {currentPage + 1} of {totalPages}
                </span>
              </div>
            )}
          </>
        )}

        {!loading && !error && bikes.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-600 mb-4 text-sm sm:text-base">No bikes available for selected dates</p>
            <button
              onClick={() => navigate(ROUTES.RENTAL)}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium hover:opacity-90 transition-all text-sm sm:text-base"
              style={{ backgroundColor: colors.primary }}
            >
              Search Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}