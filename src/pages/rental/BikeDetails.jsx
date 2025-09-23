import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Color palette
const colors = {
  primary: '#405791',
  secondary: '#ffffff',
  accent: '#f8fafc',
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
  },
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  light: '#f9fafb',
  white: '#ffffff',
  dark: '#1f2937',
  border: '#e5e7eb',
  text: '#374151',
  textLight: '#6b7280',
};

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8081';

const BikeDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // States
  const [selectedImage, setSelectedImage] = useState(0);
  const [bikes, setBikes] = useState([]);
  const [selectedBike, setSelectedBike] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    bikeType: '',
    priceRange: '',
    sortBy: 'name'
  });
  
  // Search parameters from URL
  const searchParams = new URLSearchParams(location.search);
  const isListView = !id; // If no ID in URL, show list view

  // Debug logging
  useEffect(() => {
    console.log('🔍 BikeDetails Component Loaded');
    console.log('📍 Current Path:', location.pathname);
    console.log('🔗 Search Params:', location.search);
    console.log('🆔 Bike ID:', id);
    console.log('📊 Search Params Object:', Object.fromEntries(searchParams));
  }, [location, id, searchParams]);

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

  // Enhanced fetch all bikes with proper backend mapping
  const fetchAllBikes = async () => {
    try {
      setLoading(true);
      setError('');
      
      let apiUrl = `${BASE_URL}/api/bikes/all`;
      
      // If we have search parameters, use the available bikes endpoint
      if (searchParams.toString()) {
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const city = searchParams.get('city');
        const addressType = searchParams.get('addressType') || 
                           (searchParams.get('pickupMode') === 'store' ? 'STORE' : 'DELIVERY');
        
        // Build parameters for the available bikes API
        const params = new URLSearchParams({
          page: '0',
          size: '50',
          sort: 'bikeName,asc'
        });
        
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (addressType) params.append('addressType', addressType);
        if (city) params.append('search', city);
        
        apiUrl = `${BASE_URL}/api/bikes/available?${params.toString()}`;
        console.log('🔍 Using filtered bikes API:', apiUrl);
      } else {
        console.log('📋 Using all bikes API:', apiUrl);
      }

      const response = await makeApiCall(apiUrl);
      
      // Handle different response formats from your backend
      let bikesData;
      if (response && response.success !== false) {
        // Handle paginated response for available bikes
        if (response.content) {
          bikesData = response.content; // Spring Boot Page response
          console.log(`📄 Paginated response: ${response.totalElements} total bikes, ${bikesData.length} in current page`);
        } else if (Array.isArray(response)) {
          bikesData = response; // Direct array response
          console.log(`📋 Direct array response: ${bikesData.length} bikes`);
        } else if (response.data) {
          bikesData = Array.isArray(response.data) ? response.data : [response.data];
          console.log(`📦 Data wrapper response: ${bikesData.length} bikes`);
        } else {
          bikesData = [];
          console.warn('⚠️ Unexpected response format:', response);
        }
      } else {
        throw new Error(response?.message || 'Failed to fetch bikes');
      }
      
      const validBikes = Array.isArray(bikesData) ? bikesData : [];
      setBikes(validBikes);
      
      console.log(`✅ Successfully loaded ${validBikes.length} bikes`);
      
      // If we have a specific bike ID, find and set it
      if (id) {
        const bike = validBikes.find(b => b.id === parseInt(id));
        if (!bike) {
          console.log(`🔍 Bike ${id} not found in list, fetching individually...`);
          await fetchSingleBike(id);
        } else {
          setSelectedBike(bike);
          console.log('✅ Found bike in list:', bike.bikeName || bike.name);
        }
      }
      
    } catch (err) {
      console.error('❌ Error fetching bikes:', err);
      setError(`Failed to load bikes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single bike by ID
  const fetchSingleBike = async (bikeId) => {
    try {
      const response = await makeApiCall(`${BASE_URL}/api/bikes/${bikeId}`);
      
      if (response && response.success !== false) {
        const bikeData = response.data || response;
        setSelectedBike(bikeData);
        console.log('✅ Single bike fetched:', bikeData.bikeName || bikeData.name);
      } else {
        throw new Error(response?.message || 'Bike not found');
      }
      
    } catch (err) {
      console.error('❌ Error fetching single bike:', err);
      setError(`Bike not found: ${err.message}`);
    }
  };

  // Fetch packages with proper error handling
  const fetchPackages = async () => {
    try {
      const response = await makeApiCall(`${BASE_URL}/api/packages`);
      
      if (response && response.success !== false) {
        const packagesData = response.data || response || [];
        setPackages(Array.isArray(packagesData) ? packagesData : []);
        console.log('📦 Packages loaded:', packagesData.length);
      }
    } catch (err) {
      console.log('ℹ️ Packages not available:', err.message);
      // Don't set error for packages as they might not be implemented yet
    }
  };

  // Initial data fetch
  useEffect(() => {
    console.log('🚀 Starting data fetch...');
    fetchAllBikes();
    fetchPackages();
  }, [id, location.search]);

  // Enhanced filter bikes
  const filteredBikes = bikes.filter(bike => {
    const matchesSearch = !filters.search || [
      bike.bikeName,
      bike.name, 
      bike.brand,
      bike.bikeType,
      bike.type,
      bike.model,
      bike.description
    ].some(field => 
      field?.toLowerCase().includes(filters.search.toLowerCase())
    );
    
    const matchesType = !filters.bikeType || 
      bike.bikeType === filters.bikeType || 
      bike.type === filters.bikeType;
    
    const matchesPrice = !filters.priceRange || (() => {
      const price = bike.pricePerDay || bike.price || 0;
      switch (filters.priceRange) {
        case 'low': return price < 500;
        case 'medium': return price >= 500 && price < 1000;
        case 'high': return price >= 1000;
        default: return true;
      }
    })();
    
    return matchesSearch && matchesType && matchesPrice;
  }).sort((a, b) => {
    const priceA = a.pricePerDay || a.price || 0;
    const priceB = b.pricePerDay || b.price || 0;
    const nameA = a.bikeName || a.name || '';
    const nameB = b.bikeName || b.name || '';
    
    switch (filters.sortBy) {
      case 'price-low': return priceA - priceB;
      case 'price-high': return priceB - priceA;
      case 'name': return nameA.localeCompare(nameB);
      default: return 0;
    }
  });

  // Enhanced booking handler
  const handleBookNow = async (bikeId, bikeName = 'this bike') => {
    setBookingLoading(true);
    
    try {
      if (!isAuthenticated) {
        setLoginModalOpen(true);
        return;
      }

      if (!user?.id) {
        setError('User authentication error. Please login again.');
        navigate('/login', { 
          state: { 
            from: { pathname: `/rental/booking/${bikeId}` },
            message: 'Please login to continue with your booking'
          } 
        });
        return;
      }

      // Navigate to booking page with state including search parameters
      navigate(`/rental/booking/${bikeId}`, {
        state: {
          bikeId,
          bikeName,
          returnUrl: location.pathname + location.search,
          searchParams: {
            city: searchParams.get('city'),
            store: searchParams.get('store'),
            pickupMode: searchParams.get('pickupMode'),
            deliveryAddress: searchParams.get('deliveryAddress'),
            startDate: searchParams.get('startDate'),
            endDate: searchParams.get('endDate'),
            pickupTime: searchParams.get('pickupTime'),
            dropoffTime: searchParams.get('dropoffTime')
          }
        }
      });
      
    } catch (err) {
      console.error('Booking error:', err);
      setError('Unable to proceed with booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Login modal handler
  const handleLoginRedirect = () => {
    setLoginModalOpen(false);
    navigate('/login', { 
      state: { 
        from: { pathname: location.pathname },
        message: 'Please login to book a bike'
      } 
    });
  };

  // Get bike types from fetched bikes for filter
  const availableBikeTypes = [...new Set(
    bikes.map(bike => bike.bikeType || bike.type).filter(Boolean)
  )];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" 
               style={{ borderColor: colors.primary }}></div>
          <h2 className="text-xl font-semibold" style={{ color: colors.dark }}>
            Loading bikes...
          </h2>
          <p className="text-sm mt-2" style={{ color: colors.textLight }}>
            {searchParams.get('city') ? `Searching in ${searchParams.get('city')}` : 'Please wait while we fetch the latest bikes'}
          </p>
          <div className="mt-4 text-xs text-gray-500">
            <p>API URL: {`${BASE_URL}/api/bikes/${searchParams.toString() ? 'available' : 'all'}`}</p>
          </div>
        </div>
      </div>
    );
  }

  // Individual bike details view
  if (selectedBike && id) {
    const images = [
      getImageUrl(selectedBike.bikeImage) || 'https://via.placeholder.com/400x300?text=Bike+Image',
      getImageUrl(selectedBike.bikeImage) || 'https://via.placeholder.com/400x300?text=Bike+Image+2',
      getImageUrl(selectedBike.bikeImage) || 'https://via.placeholder.com/400x300?text=Bike+Image+3'
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
          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <p><strong>Debug Info:</strong></p>
              <p>Path: {location.pathname}</p>
              <p>Search: {location.search}</p>
              <p>ID: {id || 'none'}</p>
              <p>Bikes loaded: {bikes.length}</p>
              <p>Selected bike: {selectedBike?.bikeName || 'none'}</p>
            </div>
          )}

          {/* Enhanced Breadcrumb with search context */}
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
                  to={`/rental/bike${location.search}`} 
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
                {/* Availability badge */}
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
                        style={{ backgroundColor: colors.accent, color: colors.text }}>
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

                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl font-bold" style={{ color: colors.primary }}>
                    ₹{selectedBike.pricePerDay || selectedBike.price}
                    <span className="text-lg font-normal" style={{ color: colors.gray[500] }}>/day</span>
                  </div>
                  {selectedBike.originalPrice && selectedBike.originalPrice > (selectedBike.pricePerDay || selectedBike.price) && (
                    <div className="text-lg line-through" style={{ color: colors.textLight }}>
                      ₹{selectedBike.originalPrice}
                    </div>
                  )}
                </div>

                {/* Search context info */}
                {searchParams.get('startDate') && (
                  <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: colors.accent }}>
                    <p className="text-sm" style={{ color: colors.text }}>
                      📅 Available for: {searchParams.get('startDate')} to {searchParams.get('endDate')}
                    </p>
                    {searchParams.get('city') && (
                      <p className="text-xs mt-1" style={{ color: colors.textLight }}>
                        📍 Location: {searchParams.get('city')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.dark }}>🔧 Features & Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 mr-2" style={{ color: colors.success }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm" style={{ color: colors.text }}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.dark }}>📋 Specifications</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Engine Capacity', value: selectedBike.engineCapacity },
                    { label: 'Fuel Type', value: selectedBike.fuelType },
                    { label: 'Transmission', value: selectedBike.transmission },
                    { label: 'Mileage', value: selectedBike.mileage ? `${selectedBike.mileage} km/l` : null },
                    { label: 'Max Speed', value: selectedBike.maxSpeed ? `${selectedBike.maxSpeed} km/h` : null },
                    { label: 'Seating Capacity', value: selectedBike.seatingCapacity || '2 persons' }
                  ].filter(spec => spec.value).map((spec, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b" style={{ borderColor: colors.border }}>
                      <span style={{ color: colors.gray[500] }}>{spec.label}:</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.dark }}>📍 Pickup Location</h3>
                <p style={{ color: colors.gray[500] }}>
                  {selectedBike.location || selectedBike.address || searchParams.get('city') || 'Multiple locations available'}
                </p>
                {selectedBike.pickupInstructions && (
                  <p className="text-sm mt-1" style={{ color: colors.textLight }}>
                    {selectedBike.pickupInstructions}
                  </p>
                )}
              </div>

              {/* Booking Section */}
              <div className="border-t pt-6" style={{ borderColor: colors.border }}>
                <button
                  onClick={() => handleBookNow(selectedBike.id, selectedBike.bikeName || selectedBike.name)}
                  disabled={bookingLoading}
                  className="w-full py-3 rounded-lg font-semibold transition-all duration-200 text-white hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: colors.primary }}
                >
                  {bookingLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : isAuthenticated ? (
                    <>🚀 Book Now - ₹{selectedBike.pricePerDay || selectedBike.price}/day</>
                  ) : (
                    <>🔐 Login to Book</>
                  )}
                </button>
                
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

          {/* Additional Info */}
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

        {/* Login Modal */}
        {loginModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="rounded-2xl w-full max-w-md shadow-2xl" style={{ backgroundColor: colors.white }}>
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                  <svg className="w-8 h-8" style={{ color: colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.dark }}>Login Required</h3>
                <p className="mb-6" style={{ color: colors.gray[500] }}>
                  Please login to your account to book this bike and enjoy our premium services.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLoginModalOpen(false)}
                    className="flex-1 py-2 px-4 rounded-lg border transition-colors"
                    style={{ borderColor: colors.border, color: colors.gray[500] }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLoginRedirect}
                    className="flex-1 py-2 px-4 rounded-lg text-white transition-colors"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Login Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Enhanced Bikes listing view
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>Path: {location.pathname}</p>
            <p>Search: {location.search}</p>
            <p>ID: {id || 'none'}</p>
            <p>Bikes loaded: {bikes.length}</p>
            <p>Selected bike: {selectedBike?.bikeName || 'none'}</p>
          </div>
        )}

        {/* Enhanced Header with search context */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: colors.dark }}>
                🏍️ Available Bikes
              </h1>
              <p style={{ color: colors.gray[500] }}>
                {filteredBikes.length} bike{filteredBikes.length !== 1 ? 's' : ''} available
                {searchParams.get('city') && ` in ${searchParams.get('city')}`}
                {searchParams.get('startDate') && ` for ${searchParams.get('startDate')} to ${searchParams.get('endDate')}`}
              </p>
            </div>
            <div className="flex gap-3">
              <Link 
                to="/rental"
                className="px-4 py-2 rounded-lg transition-colors text-white hover:shadow-lg"
                style={{ backgroundColor: colors.primary }}
              >
                🔍 New Search
              </Link>
              <button
                onClick={() => {
                  setError('');
                  fetchAllBikes();
                }}
                className="px-4 py-2 rounded-lg transition-colors border hover:shadow-lg"
                style={{ borderColor: colors.border, color: colors.gray[500] }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Enhanced Search context display */}
          {(searchParams.get('city') || searchParams.get('startDate')) && (
            <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: colors.accent }}>
              <h3 className="font-semibold text-sm mb-2" style={{ color: colors.dark }}>Search Criteria:</h3>
              <div className="flex flex-wrap gap-2">
                {searchParams.get('city') && (
                  <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: colors.primary, color: colors.white }}>
                    📍 {searchParams.get('city')}
                  </span>
                )}
                {searchParams.get('startDate') && (
                  <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: colors.success, color: colors.white }}>
                    📅 {searchParams.get('startDate')} to {searchParams.get('endDate')}
                  </span>
                )}
                {searchParams.get('pickupMode') && (
                  <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: colors.warning, color: colors.dark }}>
                    🚚 {searchParams.get('pickupMode') === 'store' ? 'Store Pickup' : 'Delivery'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Filters */}
          <div className="rounded-xl p-6 mb-6 shadow-lg" style={{ backgroundColor: colors.white }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.dark }}>🎯 Filter & Sort</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  🔍 Search Bikes
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  placeholder="Search by name, brand, type..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    borderColor: colors.border,
                    focusRingColor: colors.primary 
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  🏍️ Bike Type
                </label>
                <select
                  value={filters.bikeType}
                  onChange={(e) => setFilters({...filters, bikeType: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: colors.border }}
                >
                  <option value="">All Types</option>
                  {availableBikeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
                                <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  💰 Price Range
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: colors.border }}
                >
                  <option value="">All Prices</option>
                  <option value="low">Under ₹500</option>
                  <option value="medium">₹500 - ₹1000</option>
                  <option value="high">Above ₹1000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  📊 Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: colors.border }}
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Error State */}
        {error && (
          <div className="mb-6 p-4 rounded-lg border shadow-lg" 
               style={{ backgroundColor: `${colors.error}15`, borderColor: colors.error }}>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" style={{ color: colors.error }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p style={{ color: colors.error }}>{error}</p>
            </div>
            <button
              onClick={() => {
                setError('');
                fetchAllBikes();
              }}
              className="text-sm underline mt-2 hover:opacity-80"
              style={{ color: colors.error }}
            >
              🔄 Try again
            </button>
          </div>
        )}

        {/* Enhanced Bikes Grid */}
        {filteredBikes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.border }}>
              <svg className="w-8 h-8" style={{ color: colors.textLight }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.824-2.562" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.dark }}>No bikes found</h3>
            <p className="mb-4" style={{ color: colors.gray[500] }}>
              No bikes match your current criteria. Try adjusting your filters or search terms.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setFilters({ search: '', bikeType: '', priceRange: '', sortBy: 'name' })}
                className="px-6 py-3 rounded-lg text-white transition-colors hover:shadow-lg"
                style={{ backgroundColor: colors.primary }}
              >
                🗑️ Clear Filters
              </button>
              <Link
                to="/rental"
                className="px-6 py-3 rounded-lg transition-colors border hover:shadow-lg"
                style={{ borderColor: colors.border, color: colors.gray[500] }}
              >
                🔍 New Search
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBikes.map((bike) => {
              const bikeName = bike.bikeName || bike.name || 'Unknown Bike';
              const bikePrice = bike.pricePerDay || bike.price || 0;
              const bikeType = bike.bikeType || bike.type || 'Bike';
              
              return (
                <div key={bike.id} className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
                     style={{ backgroundColor: colors.white }}>
                  <div className="relative">
                    <img
                      src={getImageUrl(bike.bikeImage) || 'https://via.placeholder.com/300x200?text=Bike+Image'}
                      alt={bikeName}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Bike+Image';
                      }}
                    />
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <div className="px-2 py-1 rounded-full text-xs font-medium text-white"
                           style={{ backgroundColor: colors.success }}>
                        ✅ Available
                      </div>
                      {bike.featured && (
                        <div className="px-2 py-1 rounded-full text-xs font-medium text-white"
                             style={{ backgroundColor: colors.warning }}>
                          ⭐ Featured
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1" style={{ color: colors.dark }}>
                          {bikeName}
                        </h3>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" style={{ color: colors.warning }} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm" style={{ color: colors.gray[500] }}>4.5</span>
                          <span className="text-xs" style={{ color: colors.textLight }}>(120)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: colors.primary }}>
                        {bike.brand || 'Premium'}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium"
                            style={{ backgroundColor: colors.accent, color: colors.text }}>
                        {bikeType}
                      </span>
                      {bike.fuelType && (
                        <span className="px-2 py-1 rounded text-xs font-medium"
                              style={{ backgroundColor: colors.border, color: colors.text }}>
                          {bike.fuelType}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm mb-4 line-clamp-2" style={{ color: colors.gray[500] }}>
                      {bike.description || `Experience the thrill of riding this premium ${bikeType.toLowerCase()} with excellent performance and comfort for your journey.`}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                          ₹{bikePrice}
                        </span>
                        <span className="text-sm" style={{ color: colors.gray[500] }}>/day</span>
                        {bike.originalPrice && bike.originalPrice > bikePrice && (
                          <div className="text-sm line-through" style={{ color: colors.textLight }}>
                            ₹{bike.originalPrice}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Link
                          to={`/rental/bike/${bike.id}${location.search}`}
                          className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                          style={{ backgroundColor: colors.accent, color: colors.primary }}
                        >
                          👁️ View
                        </Link>
                        <button
                          onClick={() => handleBookNow(bike.id, bikeName)}
                          disabled={bookingLoading}
                          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:shadow-md disabled:opacity-50"
                          style={{ backgroundColor: colors.primary }}
                        >
                          {bookingLoading ? '⏳' : '🚀'} Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Enhanced Packages Section */}
        {packages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: colors.dark }}>
              🎁 Special Packages & Deals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <div key={pkg.id || index} className="rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow" 
                     style={{ backgroundColor: colors.white }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                      <span style={{ color: colors.primary }}>🎁</span>
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: colors.dark }}>
                      {pkg.name || pkg.title}
                    </h3>
                  </div>
                  <p className="text-sm mb-4" style={{ color: colors.gray[500] }}>
                    {pkg.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold" style={{ color: colors.primary }}>
                      ₹{pkg.price}
                      {pkg.originalPrice && (
                        <span className="text-sm line-through ml-2" style={{ color: colors.textLight }}>
                          ₹{pkg.originalPrice}
                        </span>
                      )}
                    </div>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:shadow-md"
                            style={{ backgroundColor: colors.primary }}>
                      Select Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Login Modal for list view */}
        {loginModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="rounded-2xl w-full max-w-md shadow-2xl" style={{ backgroundColor: colors.white }}>
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
                  <svg className="w-8 h-8" style={{ color: colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: colors.dark }}>Login Required</h3>
                <p className="mb-6" style={{ color: colors.gray[500] }}>
                  Please login to your account to book bikes and access our premium services.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLoginModalOpen(false)}
                    className="flex-1 py-2 px-4 rounded-lg border transition-colors"
                    style={{ borderColor: colors.border, color: colors.gray[500] }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLoginRedirect}
                    className="flex-1 py-2 px-4 rounded-lg text-white transition-colors"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Login Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Support Section */}
        <div className="mt-12 text-center">
          <div className="rounded-xl p-8" style={{ backgroundColor: colors.white }}>
            <h3 className="text-2xl font-bold mb-4" style={{ color: colors.dark }}>
              Need Help Choosing?
            </h3>
            <p className="mb-6" style={{ color: colors.gray[500] }}>
              Our bike experts are here to help you find the perfect ride for your journey.
            </p>
            <div className="flex justify-center gap-4">
              <button className="px-6 py-3 rounded-lg text-white transition-colors hover:shadow-lg"
                      style={{ backgroundColor: colors.primary }}>
                📞 Call Us: +91 98765 43210
              </button>
              <button className="px-6 py-3 rounded-lg border transition-colors hover:shadow-lg"
                      style={{ borderColor: colors.border, color: colors.text }}>
                💬 Chat Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeDetails;
