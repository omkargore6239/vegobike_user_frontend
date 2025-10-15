import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Updated Color Palette with your dark blue
const colors = {
  primary: '#1A1E82',       // Your requested dark blue
  secondary: '#6B7280',     // Gray-500
  success: '#10B981',       // Emerald-500
  danger: '#EF4444',        // Red-500
  warning: '#F59E0B',       // Amber-500
  dark: '#1F2937',          // Gray-800
  light: '#F9FAFB',         // Gray-50
  white: '#FFFFFF',         // White
  border: '#E5E7EB',        // Gray-200
  text: '#374151',          // Gray-700
  textLight: '#6B7280'      // Gray-500
};

// API configuration
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8081';

// Default fallback images
const DEFAULT_IMAGES = {
  city: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMUExRTgyIi8+CjxyZWN0IHg9IjUwIiB5PSIxMDAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjU5RTBCIiBvcGFjaXR5PSIwLjMiLz4KPHA+dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q2l0eTwvdGV4dD4KPC9zdmc+',
  bike1: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoNDVkZWcsICMxMEI5ODEsICMxQTFFODIpIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Ik0xMzAgMTYwTDI3MCA4MEwyODUgMTAwTTI3MCA4MEwyNDAgNjAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHA+dGV4dCB4PSIyMDAiIHk9IjIxMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TcG9ydCBCaWtlPC90ZXh0Pgo8L3N2Zz4=',
  bike2: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRUY0NDQ0Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0Ci8+CjxwYXRoIGQ9Ik0xMzAgMTYwTDI3MCA4MEwyODUgMTAwTTI3MCA4MEwyNDAgNjAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHA+dGV4dCB4PSIyMDAiIHk9IjIxMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Dcml1aXNlcjwvdGV4dD4KPC9zdmc+',
  bike3: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjNzc0OEU1Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSI0Ci8+CjxwYXRoIGQ9Ik0xMzAgMTYwTDI3MCA4MEwyODUgMTAwTTI3MCA4MEwyNDAgNjAiIHN0cm9rZT0iI0ZGRkZGZiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHA+dGV4dCB4PSIyMDAiIHk9IjIxMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Ub3VyaW5nPC90ZXh0Pgo8L3N2Zz4=',
  bike4: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjRjU5RTBCIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFGMjkzNyIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjE2MCIgcj0iMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFGMjkzNyIgc3Ryb2tlLXdpZHRoPSI0Ci8+CjxwYXRoIGQ9Ik0xMzAgMTYwTDI3MCA4MEwyODUgMTAwTTI3MCA4MEwyNDAgNjAiIHN0cm9rZT0iIzFGMjkzNyIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHA+dGV4dCB4PSIyMDAiIHk9IjIxMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMUYyOTM3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BZHZlbnR1cmU8L3RleHQ+Cjwvc3ZnPg=='
};

export default function RentalSearch() {
  const navigate = useNavigate();
  
  // All fields start blank
  const [selectedCity, setSelectedCity] = useState('');
  const [pickupMode, setPickupMode] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Data state for backend integration
  const [cities, setCities] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calendar navigation state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Simplified dropdown states
  const [showCityModal, setShowCityModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Configuration
  const API_ENDPOINTS = useMemo(() => ({
    getActiveCities: `${BASE_URL}/api/cities/active`,
    getActiveStores: `${BASE_URL}/api/stores/active`,
    getAvailableBikes: `${BASE_URL}/api/bikes/available`
  }), []);

  const makeApiCall = useCallback(async (url, options = {}) => {
    const defaultHeaders = {
      'Accept': 'application/json'
    };

    const defaultOptions = {
      method: 'GET',
      headers: {
        ...defaultHeaders,
        ...options.headers
      },
      ...options
    };

    try {
      console.log('🔄 Making API call to:', url);
      const response = await fetch(url, defaultOptions);
      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      console.log('✅ API Response data:', responseData);
      
      if (responseData.success === false) {
        throw new Error(responseData.message || 'API returned error');
      }
      
      return responseData;
      
    } catch (error) {
      console.error('💥 API Call Error:', error);
      throw error;
    }
  }, []);

  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath || imagePath.trim() === '') return null;
    
    const path = imagePath.trim();
    
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    
    if (path.startsWith('/uploads/') || path.startsWith('uploads/')) {
      return `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
    }
    
    return `${BASE_URL}/uploads/${path}`;
  }, []);

  const ImageWithFallback = React.memo(({ src, alt, className, fallback = DEFAULT_IMAGES.city }) => {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const imageUrl = useMemo(() => {
      return src ? getImageUrl(src) : null;
    }, [src, getImageUrl]);

    const handleImageError = useCallback(() => {
      console.log(`⚠️ Failed to load image:`, imageUrl);
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

  const fetchActiveCities = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('🔄 Fetching active cities from:', API_ENDPOINTS.getActiveCities);
      const responseData = await makeApiCall(API_ENDPOINTS.getActiveCities);
      
      const citiesData = responseData?.data || responseData || [];
      const validCitiesData = Array.isArray(citiesData) ? citiesData : [];
      
      setCities(validCitiesData);
      console.log('✅ Cities data updated:', validCitiesData.length, 'cities');
      
    } catch (err) {
      setError('Failed to fetch cities: ' + err.message);
      console.error('❌ Error fetching cities:', err);
    } finally {
      setLoading(false);
    }
  }, [API_ENDPOINTS.getActiveCities, makeApiCall, loading]);

  const fetchActiveStores = useCallback(async () => {
    try {
      console.log('🔄 Fetching active stores from:', API_ENDPOINTS.getActiveStores);
      const responseData = await makeApiCall(API_ENDPOINTS.getActiveStores);
      
      let storesData = [];
      if (responseData && typeof responseData === 'object') {
        storesData = responseData.data || responseData || [];
      } else {
        storesData = responseData || [];
      }
      
      const validStoresData = Array.isArray(storesData) ? storesData : [];
      
      setStores(validStoresData);
      console.log('✅ Stores data updated:', validStoresData.length, 'stores');
      
    } catch (err) {
      console.error('❌ Error fetching stores:', err);
    }
  }, [API_ENDPOINTS.getActiveStores, makeApiCall]);

  useEffect(() => {
    console.log('🚀 Component mounted, API Base URL:', BASE_URL);
    
    fetchActiveCities();
    fetchActiveStores();
    window.scrollTo(0, 0);
  }, []);

  const getCurrentDateTime = () => {
    const now = new Date();
    const bufferTime = new Date(now.getTime() + (15 * 60000));
    
    const minutes = bufferTime.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 5) * 5;
    const nextAvailableTime = new Date(bufferTime);
    
    if (roundedMinutes >= 60) {
      nextAvailableTime.setHours(nextAvailableTime.getHours() + 1);
      nextAvailableTime.setMinutes(0);
    } else {
      nextAvailableTime.setMinutes(roundedMinutes);
    }
    nextAvailableTime.setSeconds(0);
    nextAvailableTime.setMilliseconds(0);
    
    const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const minTime = `${String(nextAvailableTime.getHours()).padStart(2, '0')}:${String(nextAvailableTime.getMinutes()).padStart(2, '0')}`;
    
    return { currentDate, minTime, currentDateTime: now, nextAvailableTime };
  };

  const { currentDate, minTime, currentDateTime, nextAvailableTime } = getCurrentDateTime();

  const monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];

  const generateCalendarDays = (month = selectedMonth, year = selectedYear) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();
    const days = [];

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
    
    for (let i = startDate - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const prevDateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: prevDateStr,
        isPast: prevDateStr < currentDate,
        isToday: false
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: dayDateStr,
        isToday: dayDateStr === currentDate,
        isPast: dayDateStr < currentDate
      });
    }

    const totalCells = Math.ceil(days.length / 7) * 7;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    for (let day = 1; days.length < totalCells; day++) {
      const nextDateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: nextDateStr,
        isPast: nextDateStr < currentDate,
        isToday: false
      });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const generateTimeSlots = (selectedDateStr = null) => {
    const slots = [];
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(2000, 0, 1, hour, minute).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        let isAvailable = true;
        
        if (selectedDateStr && selectedDateStr === currentDate) {
          isAvailable = time >= minTime;
        }
        
        if (isAvailable) {
          slots.push({ value: time, display: displayTime });
        }
      }
    }
    
    return slots;
  };

  const calculateDropoffDateTime = (pickupDateStr, pickupTimeStr) => {
    if (!pickupDateStr || !pickupTimeStr) return { date: '', time: '' };
    
    const pickupDateTime = new Date(`${pickupDateStr}T${pickupTimeStr}:00`);
    const dropoffDateTime = new Date(pickupDateTime.getTime() + (24 * 60 * 60 * 1000));
    
    const dropoffDateStr = `${dropoffDateTime.getFullYear()}-${String(dropoffDateTime.getMonth() + 1).padStart(2, '0')}-${String(dropoffDateTime.getDate()).padStart(2, '0')}`;
    const dropoffTimeStr = `${String(dropoffDateTime.getHours()).padStart(2, '0')}:${String(dropoffDateTime.getMinutes()).padStart(2, '0')}`;
    
    return { date: dropoffDateStr, time: dropoffTimeStr };
  };

  const closeAllDropdowns = () => {
    setActiveDropdown('');
  };

  const handleCitySelect = (cityId) => {
    setSelectedCity(cityId);
    setSelectedStore('');
    setPickupMode('');
    setShowCityModal(false);
    
    setTimeout(() => {
      document.querySelector('input[name="pickupMode"]')?.focus();
    }, 100);
  };

  const handleStoreSelect = (storeId) => {
    setSelectedStore(storeId);
    closeAllDropdowns();
    setTimeout(() => setActiveDropdown('pickupDate'), 200);
  };

  const handleDateSelect = (date, type) => {
    if (date < currentDate) return;
    
    if (type === 'pickup') {
      setPickupDate(date);
      if (date === currentDate && pickupTime && pickupTime < minTime) {
        setPickupTime('');
      }
      
      if (pickupTime) {
        const { date: autoDropoffDate, time: autoDropoffTime } = calculateDropoffDateTime(date, pickupTime);
        setDropoffDate(autoDropoffDate);
        setDropoffTime(autoDropoffTime);
      }
      
      setActiveDropdown('');
      setTimeout(() => setActiveDropdown('pickupTime'), 200);
    } else {
      if (pickupDate && date < pickupDate) return;
      
      setDropoffDate(date);
      if (date === currentDate && dropoffTime && dropoffTime < minTime) {
        setDropoffTime('');
      }
      
      setActiveDropdown('');
      setTimeout(() => setActiveDropdown('dropoffTime'), 200);
    }
  };

  const handleTimeSelect = (time, type) => {
    if (type === 'pickup') {
      if (pickupDate === currentDate && time < minTime) return;
      
      setPickupTime(time);
      
      if (pickupDate) {
        const { date: autoDropoffDate, time: autoDropoffTime } = calculateDropoffDateTime(pickupDate, time);
        setDropoffDate(autoDropoffDate);
        setDropoffTime(autoDropoffTime);
      }
      
      setActiveDropdown('');
      setTimeout(() => setActiveDropdown('dropoffDate'), 200);
    } else {
      if (dropoffDate === currentDate && time < minTime) return;
      if (dropoffDate === pickupDate && pickupTime && time <= pickupTime) return;
      
      setDropoffTime(time);
      setActiveDropdown('');
    }
  };

  const handleSelectToday = (type) => {
    setSelectedMonth(currentDateTime.getMonth());
    setSelectedYear(currentDateTime.getFullYear());
    handleDateSelect(currentDate, type);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date(2000, 0, 1, parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const getBikeImage = (index) => {
    const bikeImages = [
      '/bike1.jpg',
      '/bike2.png',
      '/bike3.png',
    ];
    return bikeImages[index % bikeImages.length];
  };

  const selectedCityData = cities.find(city => city.id === selectedCity);

  const cityStores = useMemo(() => {
    if (!selectedCity || !stores.length) {
      return [];
    }
    
    return stores;
  }, [stores, selectedCity]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const startDate = new Date(`${pickupDate}T${pickupTime}:00`);
      const endDate = new Date(`${dropoffDate}T${dropoffTime}:00`);
      
      const params = new URLSearchParams({
        city: selectedCity,
        pickupMode,
        store: pickupMode === 'store' ? selectedStore : '',
        deliveryAddress: pickupMode === 'delivery' ? deliveryAddress : '',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        pickupTime,
        dropoffTime
      });
      
      navigate(`/bikes?${params.toString()}`);
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedCity && pickupMode && 
    (pickupMode === 'delivery' ? deliveryAddress : selectedStore) && 
    pickupDate && pickupTime && dropoffDate && dropoffTime;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        closeAllDropdowns();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.light }}>
      {/* Hero Section with Side-by-Side Layout - FULL HEIGHT */}
      <div className="flex-1 flex" style={{ backgroundColor: colors.primary }}>
        <div className="w-full max-w-7xl mx-auto px-4 py-8 flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 items-center w-full">
            {/* Left Side - Booking Form */}
            <div className="order-2 lg:order-1 h-full flex items-center">
              <div className="rounded-2xl p-6 shadow-xl w-full" style={{ backgroundColor: colors.white }}>
                <h3 className="text-lg font-semibold mb-6" style={{ color: colors.dark }}>
                  Search your next ride
                </h3>
                
                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 border rounded-lg" style={{ backgroundColor: `${colors.danger}15`, borderColor: colors.danger }}>
                    <p className="text-sm" style={{ color: colors.danger }}>{error}</p>
                    <button 
                      onClick={() => {
                        setError('');
                        fetchActiveCities();
                      }}
                      className="text-sm underline mt-1 hover:opacity-80"
                      style={{ color: colors.danger }}
                    >
                      Try again
                    </button>
                  </div>
                )}
                
                <form onSubmit={onSubmit} className="space-y-4">
                  {/* City Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      City
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCityModal(true)}
                      disabled={loading}
                      className="w-full text-left p-3 border-2 rounded-lg transition-colors text-sm font-medium"
                      style={{
                        borderColor: selectedCity ? colors.primary : colors.border,
                        backgroundColor: selectedCity ? `${colors.primary}15` : colors.white,
                        color: selectedCity ? colors.dark : colors.textLight,
                        opacity: loading ? 0.5 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? 'Loading cities...' : (selectedCityData?.cityName || 'Select City')}
                    </button>
                  </div>

                  {/* Pickup Mode Selection */}
                  {selectedCity && (
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        Pickup or Delivery Option
                      </label>
                      <div className="flex gap-4 mb-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="pickupMode"
                            value="store"
                            checked={pickupMode === 'store'}
                            onChange={() => setPickupMode('store')}
                            style={{ accentColor: colors.primary }}
                          />
                          <span className="text-sm font-medium" style={{ color: colors.text }}>
                            Pickup at Store
                          </span>
                        </label>
                        {/* <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="pickupMode"
                            value="delivery"
                            checked={pickupMode === 'delivery'}
                            onChange={() => setPickupMode('delivery')}
                            style={{ accentColor: colors.primary }}
                          />
                          <span className="text-sm font-medium" style={{ color: colors.text }}>
                            Delivery at Location
                          </span>
                        </label> */}
                      </div>
                    </div>
                  )}

                  {/* Store Selection */}
                  {selectedCity && pickupMode === 'store' && (
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        Store ({cityStores.length} available)
                      </label>
                      <select
                        value={selectedStore}
                        onChange={(e) => handleStoreSelect(e.target.value)}
                        className="w-full p-3 border-2 rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-0"
                        style={{
                          borderColor: selectedStore ? colors.primary : colors.border,
                          backgroundColor: selectedStore ? `${colors.primary}15` : colors.white,
                          color: selectedStore ? colors.dark : colors.textLight
                        }}
                      >
                        <option value="">Select Store</option>
                        {cityStores.map(store => (
                          <option key={store.id} value={store.id}>
                            {store.storeName} - {store.storeAddress}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Delivery Address */}
                  {selectedCity && pickupMode === 'delivery' && (
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Enter delivery address"
                        className="w-full p-3 border-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2"
                        style={{
                          borderColor: colors.border
                        }}
                      />
                    </div>
                  )}

                  {/* Pickup Section */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.success }}></span>
                        Pickup
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Pickup Date - ✅ DROPDOWN OPENS UPWARD */}
                      <div className="dropdown-container relative">
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(activeDropdown === 'pickupDate' ? '' : 'pickupDate')}
                          className="w-full p-3 border-2 rounded-lg transition-colors text-sm font-medium"
                          style={{
                            borderColor: pickupDate ? colors.primary : colors.border,
                            backgroundColor: pickupDate ? `${colors.primary}15` : colors.white,
                            color: pickupDate ? colors.dark : colors.textLight,
                            boxShadow: activeDropdown === 'pickupDate' ? `0 0 0 3px ${colors.primary}50` : 'none'
                          }}
                        >
                          {pickupDate ? formatDate(pickupDate) : 'Select Date'}
                        </button>

                        {/* ✅ Calendar Opens ABOVE - Changed from mt-2 to bottom-full mb-2 */}
                        {activeDropdown === 'pickupDate' && (
                          <div 
                            className="absolute left-0 right-0 z-50 bottom-full mb-2 border-2 rounded-xl shadow-2xl" 
                            style={{ 
                              backgroundColor: colors.white, 
                              borderColor: colors.border,
                              maxWidth: '320px'
                            }}
                          >
                            <div className="p-3">
                              {/* Month/Year Navigation */}
                              <div className="flex items-center justify-between mb-3">
                                <button
                                  type="button"
                                  onClick={() => navigateMonth('prev')}
                                  className="p-1 rounded-full transition-colors hover:bg-gray-100"
                                >
                                  <svg className="w-4 h-4" style={{ color: colors.textLight }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                                
                                <div className="flex items-center gap-2">
                                  <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    className="text-xs font-semibold bg-transparent border-none focus:outline-none cursor-pointer"
                                    style={{ color: colors.dark }}
                                  >
                                    {monthNames.map((month, index) => (
                                      <option key={index} value={index}>{month}</option>
                                    ))}
                                  </select>
                                  <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="text-xs font-semibold bg-transparent border-none focus:outline-none cursor-pointer"
                                    style={{ color: colors.dark }}
                                  >
                                    {Array.from({length: 3}, (_, i) => currentDateTime.getFullYear() + i).map(year => (
                                      <option key={year} value={year}>{year}</option>
                                    ))}
                                  </select>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => navigateMonth('next')}
                                  className="p-1 rounded-full transition-colors hover:bg-gray-100"
                                >
                                  <svg className="w-4 h-4" style={{ color: colors.textLight }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => setActiveDropdown('')}
                                  className="text-lg hover:bg-gray-100 rounded p-1"
                                  style={{ color: colors.textLight }}
                                >
                                  ×
                                </button>
                              </div>

                              {/* Calendar Grid */}
                              <div className="grid grid-cols-7 gap-1 mb-3">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                  <div key={day} className="text-center text-xs p-1 font-medium" style={{ color: colors.textLight }}>
                                    {day}
                                  </div>
                                ))}
                                {generateCalendarDays(selectedMonth, selectedYear).map((day, index) => {
                                  const isClickable = day.isCurrentMonth && !day.isPast;
                                  const isSelected = pickupDate === day.fullDate;
                                  const isToday = day.isToday && day.isCurrentMonth;
                                  
                                  return (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={isClickable ? () => handleDateSelect(day.fullDate, 'pickup') : undefined}
                                      disabled={!isClickable}
                                      className="p-1.5 text-xs rounded-lg transition-colors"
                                      style={{
                                        backgroundColor: isSelected ? colors.primary : isToday ? colors.warning : 'transparent',
                                        color: isSelected || isToday ? colors.white : isClickable ? colors.dark : colors.textLight,
                                        cursor: isClickable ? 'pointer' : 'not-allowed',
                                        fontWeight: isSelected || isToday ? 'bold' : 'normal'
                                      }}
                                    >
                                      {day.date}
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="flex justify-center pt-2 border-t" style={{ borderColor: colors.border }}>
                                <button
                                  type="button"
                                  onClick={() => handleSelectToday('pickup')}
                                  className="font-medium text-xs px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                  style={{ color: colors.primary }}
                                >
                                  Select Today
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Pickup Time - ✅ DROPDOWN OPENS UPWARD */}
                      <div className="dropdown-container relative">
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(activeDropdown === 'pickupTime' ? '' : 'pickupTime')}
                          className="w-full p-3 border-2 rounded-lg transition-colors text-sm font-medium"
                          style={{
                            borderColor: pickupTime ? colors.primary : colors.border,
                            backgroundColor: pickupTime ? `${colors.primary}15` : colors.white,
                            color: pickupTime ? colors.dark : colors.textLight,
                            boxShadow: activeDropdown === 'pickupTime' ? `0 0 0 3px ${colors.primary}50` : 'none'
                          }}
                        >
                          {pickupTime ? formatTime(pickupTime) : 'Select Time'}
                        </button>

                        {/* ✅ Time Opens ABOVE */}
                        {activeDropdown === 'pickupTime' && (
                          <div 
                            className="absolute left-0 right-0 z-50 bottom-full mb-2 border-2 rounded-xl shadow-2xl max-h-48 overflow-y-auto"
                            style={{ 
                              backgroundColor: colors.white, 
                              borderColor: colors.border,
                              maxWidth: '240px'
                            }}
                          >
                            <div className="p-2">
                              {generateTimeSlots(pickupDate).map(slot => {
                                const isDisabled = pickupDate === currentDate && slot.value < minTime;
                                const isSelected = pickupTime === slot.value;
                                return (
                                  <button
                                    key={slot.value}
                                    type="button"
                                    onClick={!isDisabled ? () => handleTimeSelect(slot.value, 'pickup') : undefined}
                                    disabled={isDisabled}
                                    className="w-full text-left px-3 py-2 text-xs transition-colors rounded-lg"
                                    style={{
                                      backgroundColor: isSelected ? colors.primary : 'transparent',
                                      color: isDisabled ? colors.textLight : isSelected ? colors.white : colors.dark,
                                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                                      fontWeight: isSelected ? 'bold' : 'normal'
                                    }}
                                  >
                                    {slot.display}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dropoff Section */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.danger }}></span>
                        Dropoff
                        {dropoffDate && dropoffTime && (
                          <span className="text-xs ml-2" style={{ color: colors.textLight }}>(24h later)</span>
                        )}
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Dropoff Date - ✅ DROPDOWN OPENS UPWARD */}
                      <div className="dropdown-container relative">
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(activeDropdown === 'dropoffDate' ? '' : 'dropoffDate')}
                          className="w-full p-3 border-2 rounded-lg transition-colors text-sm font-medium"
                          style={{
                            borderColor: dropoffDate ? colors.primary : colors.border,
                            backgroundColor: dropoffDate ? `${colors.primary}15` : colors.white,
                            color: dropoffDate ? colors.dark : colors.textLight,
                            boxShadow: activeDropdown === 'dropoffDate' ? `0 0 0 3px ${colors.primary}50` : 'none'
                          }}
                        >
                          {dropoffDate ? formatDate(dropoffDate) : 'Select Date'}
                          {dropoffDate && <span className="ml-2 text-xs" style={{ color: colors.primary }}>✓</span>}
                        </button>

                        {/* ✅ Calendar Opens ABOVE */}
                        {activeDropdown === 'dropoffDate' && (
                          <div 
                            className="absolute left-0 right-0 z-50 bottom-full mb-2 border-2 rounded-xl shadow-2xl"
                            style={{ 
                              backgroundColor: colors.white, 
                              borderColor: colors.border,
                              maxWidth: '320px'
                            }}
                          >
                            <div className="p-3">
                              <div className="flex items-center justify-between mb-3">
                                <button
                                  type="button"
                                  onClick={() => navigateMonth('prev')}
                                  className="p-1 rounded-full transition-colors hover:bg-gray-100"
                                >
                                  <svg className="w-4 h-4" style={{ color: colors.textLight }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                                
                                <div className="flex items-center gap-2">
                                  <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    className="text-xs font-semibold bg-transparent border-none focus:outline-none cursor-pointer"
                                    style={{ color: colors.dark }}
                                  >
                                    {monthNames.map((month, index) => (
                                      <option key={index} value={index}>{month}</option>
                                    ))}
                                  </select>
                                  <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="text-xs font-semibold bg-transparent border-none focus:outline-none cursor-pointer"
                                    style={{ color: colors.dark }}
                                  >
                                    {Array.from({length: 3}, (_, i) => currentDateTime.getFullYear() + i).map(year => (
                                      <option key={year} value={year}>{year}</option>
                                    ))}
                                  </select>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => navigateMonth('next')}
                                  className="p-1 rounded-full transition-colors hover:bg-gray-100"
                                >
                                  <svg className="w-4 h-4" style={{ color: colors.textLight }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => setActiveDropdown('')}
                                  className="text-lg hover:bg-gray-100 rounded p-1"
                                  style={{ color: colors.textLight }}
                                >
                                  ×
                                </button>
                              </div>

                              <div className="grid grid-cols-7 gap-1 mb-3">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                  <div key={day} className="text-center text-xs p-1 font-medium" style={{ color: colors.textLight }}>
                                    {day}
                                  </div>
                                ))}
                                {generateCalendarDays(selectedMonth, selectedYear).map((day, index) => {
                                  const isClickable = day.isCurrentMonth && !day.isPast && (!pickupDate || day.fullDate >= pickupDate);
                                  const isSelected = dropoffDate === day.fullDate;
                                  const isToday = day.isToday && day.isCurrentMonth && isClickable;
                                  
                                  return (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={isClickable ? () => handleDateSelect(day.fullDate, 'dropoff') : undefined}
                                      disabled={!isClickable}
                                      className="p-1.5 text-xs rounded-lg transition-colors"
                                      style={{
                                        backgroundColor: isSelected ? colors.primary : isToday ? colors.warning : 'transparent',
                                        color: isSelected || isToday ? colors.white : isClickable ? colors.dark : colors.textLight,
                                        cursor: isClickable ? 'pointer' : 'not-allowed',
                                        fontWeight: isSelected || isToday ? 'bold' : 'normal'
                                      }}
                                    >
                                      {day.date}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Dropoff Time - ✅ DROPDOWN OPENS UPWARD */}
                      <div className="dropdown-container relative">
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(activeDropdown === 'dropoffTime' ? '' : 'dropoffTime')}
                          className="w-full p-3 border-2 rounded-lg transition-colors text-sm font-medium"
                          style={{
                            borderColor: dropoffTime ? colors.primary : colors.border,
                            backgroundColor: dropoffTime ? `${colors.primary}15` : colors.white,
                            color: dropoffTime ? colors.dark : colors.textLight,
                            boxShadow: activeDropdown === 'dropoffTime' ? `0 0 0 3px ${colors.primary}50` : 'none'
                          }}
                        >
                          {dropoffTime ? formatTime(dropoffTime) : 'Select Time'}
                          {dropoffTime && <span className="ml-2 text-xs" style={{ color: colors.primary }}>✓</span>}
                        </button>

                        {/* ✅ Time Opens ABOVE */}
                        {activeDropdown === 'dropoffTime' && (
                          <div 
                            className="absolute left-0 right-0 z-50 bottom-full mb-2 border-2 rounded-xl shadow-2xl max-h-48 overflow-y-auto"
                            style={{ 
                              backgroundColor: colors.white, 
                              borderColor: colors.border,
                              maxWidth: '240px'
                            }}
                          >
                            <div className="p-2">
                              {generateTimeSlots(dropoffDate).map(slot => {
                                const isDisabled = (dropoffDate === currentDate && slot.value < minTime) ||
                                                 (dropoffDate === pickupDate && pickupTime && slot.value <= pickupTime);
                                const isSelected = dropoffTime === slot.value;
                                return (
                                  <button
                                    key={slot.value}
                                    type="button"
                                    onClick={!isDisabled ? () => handleTimeSelect(slot.value, 'dropoff') : undefined}
                                    disabled={isDisabled}
                                    className="w-full text-left px-3 py-2 text-xs transition-colors rounded-lg"
                                    style={{
                                      backgroundColor: isSelected ? colors.primary : 'transparent',
                                      color: isDisabled ? colors.textLight : isSelected ? colors.white : colors.dark,
                                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                                      fontWeight: isSelected ? 'bold' : 'normal'
                                    }}
                                  >
                                    {slot.display}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Search Button */}
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm transform hover:scale-105"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.white
                    }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Searching Available Bikes...</span>
                      </div>
                    ) : (
                      'Search Available Bikes'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Side - Hero Content and Images */}
            <div className="text-center lg:text-left order-1 lg:order-2">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.warning }}></span>
                  <span className="text-sm font-medium text-white">VEGO BIKE Premium Rentals</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  <span style={{ color: colors.warning }}>A DECADE</span>
                  <br />
                  <span>ON THE ROAD</span>
                </h1>
                <p className="text-lg text-white opacity-90 mb-8">
                  Premium bike rentals across Maharashtra with instant booking and 24/7 support
                </p>
              </div>

              {/* Bike Images Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={getBikeImage(0)}
                      alt="Sport Bike" 
                      className="w-full h-40 object-cover"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={getBikeImage(1)}
                      alt="Cruiser Bike" 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-6">
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={getBikeImage(2)}
                      alt="Touring Bike" 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={getBikeImage(3)}
                      alt="Adventure Bike" 
                      className="w-full h-40 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* City Selection Modal */}
      {showCityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl" style={{ backgroundColor: colors.white }}>
            <div className="sticky top-0 border-b px-6 py-4 rounded-t-2xl" style={{ backgroundColor: colors.white, borderColor: colors.border }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: colors.dark }}>Select Your City</h3>
                  <p className="text-sm mt-1" style={{ color: colors.text }}>Choose from our premium locations</p>
                </div>
                <button
                  onClick={() => setShowCityModal(false)}
                  className="ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                  style={{ backgroundColor: colors.light, color: colors.textLight }}
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" 
                       style={{ borderColor: colors.primary }}></div>
                  <span className="ml-3" style={{ color: colors.text }}>Loading cities...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="mb-4" style={{ color: colors.danger }}>{error}</p>
                  <button 
                    onClick={() => {
                      setError('');
                      fetchActiveCities();
                    }}
                    className="px-4 py-2 rounded-lg hover:opacity-80 transition-colors"
                    style={{ backgroundColor: colors.primary, color: colors.white }}
                  >
                    Try Again
                  </button>
                </div>
              ) : cities.length === 0 ? (
                <div className="text-center py-12">
                  <p style={{ color: colors.textLight }}>No active cities available at the moment.</p>
                  <button 
                    onClick={fetchActiveCities}
                    className="px-4 py-2 mt-4 rounded-lg hover:opacity-80 transition-colors"
                    style={{ backgroundColor: colors.primary, color: colors.white }}
                  >
                    Refresh
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {cities.map((city) => {
                    return (
                      <button
                        key={city.id}
                        onClick={() => handleCitySelect(city.id)}
                        className={`group relative overflow-hidden rounded-xl transition-all hover:scale-105 hover:shadow-lg ${
                          selectedCity === city.id ? 'ring-3' : ''
                        }`}
                        style={{ ringColor: selectedCity === city.id ? colors.primary : 'transparent' }}
                      >
                        <div className="aspect-[4/3] relative">
                          <ImageWithFallback 
                            src={city.cityImage}
                            alt={city.cityName}
                            className="w-full h-full object-cover"
                            fallback={DEFAULT_IMAGES.city}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black opacity-70 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-3 left-3 text-white">
                          <div className="text-lg font-bold">{city.cityName}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
