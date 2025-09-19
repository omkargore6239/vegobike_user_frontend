import React, { useState, useRef, useEffect } from 'react';
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

// Maharashtra cities data
const MAHARASHTRA_CITIES = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    image: 'https://images.unsplash.com/photo-1595675024853-0f3ec9098ac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    stores: [
      { id: 'mumbai-1', name: 'Andheri Hub', address: 'Near Metro Station, Andheri East', bikes: 45 },
      { id: 'mumbai-2', name: 'Bandra Center', address: 'Linking Road, Bandra West', bikes: 38 },
      { id: 'mumbai-3', name: 'Powai Junction', address: 'Hiranandani, Powai', bikes: 32 }
    ]
  },
  {
    id: 'pune',
    name: 'Pune',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    stores: [
      { id: 'pune-1', name: 'Koregaon Park Hub', address: 'North Main Road, Koregaon Park', bikes: 28 },
      { id: 'pune-2', name: 'Hinjewadi Center', address: 'Phase 1, Hinjewadi IT Park', bikes: 35 }
    ]
  },
  {
    id: 'nashik',
    name: 'Nashik',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    stores: [
      { id: 'nashik-1', name: 'City Center Hub', address: 'Main Road, Nashik Road', bikes: 20 }
    ]
  },
  {
    id: 'nagpur',
    name: 'Nagpur',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    stores: [
      { id: 'nagpur-1', name: 'Sitabuldi Hub', address: 'Central Nagpur, Sitabuldi', bikes: 22 }
    ]
  },
  {
    id: 'aurangabad',
    name: 'Aurangabad',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    stores: [
      { id: 'aurangabad-1', name: 'CIDCO Hub', address: 'CIDCO Area, Aurangabad', bikes: 15 }
    ]
  },
  {
    id: 'kolhapur',
    name: 'Kolhapur',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    stores: [
      { id: 'kolhapur-1', name: 'Mahadwar Hub', address: 'Near Palace, Mahadwar Road', bikes: 12 }
    ]
  }
];

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

  // Calendar navigation state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Simplified dropdown states - only one can be open at a time
  const [showCityModal, setShowCityModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get current date and time with proper timezone handling
  const getCurrentDateTime = () => {
    const now = new Date();
    const bufferTime = new Date(now.getTime() + (30 * 60000));
    
    const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const currentTime = `${String(bufferTime.getHours()).padStart(2, '0')}:${String(bufferTime.getMinutes()).padStart(2, '0')}`;
    
    return { currentDate, currentTime, currentDateTime: now, bufferDateTime: bufferTime };
  };

  const { currentDate, currentTime, currentDateTime } = getCurrentDateTime();

  // Month names for display
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];

  // Generate calendar days with proper date handling for any month/year
  const generateCalendarDays = (month = selectedMonth, year = selectedYear) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();
    const days = [];

    // Previous month days
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
    
    for (let i = startDate - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const prevDate = new Date(prevYear, prevMonth, day);
      const prevDateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: prevDateStr,
        isPast: prevDateStr < currentDate,
        isToday: false
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const dayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: dayDateStr,
        isToday: dayDateStr === currentDate,
        isPast: dayDateStr < currentDate
      });
    }

    // Next month days to fill the grid
    const totalCells = Math.ceil(days.length / 7) * 7;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    
    for (let day = 1; days.length < totalCells; day++) {
      const nextDate = new Date(nextYear, nextMonth, day);
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

  // Navigate months
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

  // Generate time slots with filtering based on selected date
  const generateTimeSlots = (selectedDateStr = null) => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(2000, 0, 1, hour, minute).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        
        let isAvailable = true;
        if (selectedDateStr && selectedDateStr === currentDate) {
          isAvailable = time >= currentTime;
        }
        
        if (isAvailable) {
          slots.push({ value: time, display: displayTime });
        }
      }
    }
    return slots;
  };

  // Auto-calculate 24 hours later date and time
  const calculateDropoffDateTime = (pickupDateStr, pickupTimeStr) => {
    if (!pickupDateStr || !pickupTimeStr) return { date: '', time: '' };
    
    const pickupDateTime = new Date(`${pickupDateStr}T${pickupTimeStr}:00`);
    const dropoffDateTime = new Date(pickupDateTime.getTime() + (24 * 60 * 60 * 1000));
    
    const dropoffDateStr = `${dropoffDateTime.getFullYear()}-${String(dropoffDateTime.getMonth() + 1).padStart(2, '0')}-${String(dropoffDateTime.getDate()).padStart(2, '0')}`;
    const dropoffTimeStr = `${String(dropoffDateTime.getHours()).padStart(2, '0')}:${String(dropoffDateTime.getMinutes()).padStart(2, '0')}`;
    
    return { date: dropoffDateStr, time: dropoffTimeStr };
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setActiveDropdown('');
  };

  // Enhanced auto-flow functions with better UX
  const handleCitySelect = (cityId) => {
    setSelectedCity(cityId);
    setSelectedStore('');
    setPickupMode('');
    setShowCityModal(false);
    
    const cityData = MAHARASHTRA_CITIES.find(city => city.id === cityId);
    if (cityData?.stores.length === 1 && pickupMode === 'store') {
      setSelectedStore(cityData.stores[0].id);
      setTimeout(() => setActiveDropdown('pickupDate'), 300);
    }
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
      if (date === currentDate && pickupTime && pickupTime < currentTime) {
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
      if (date === currentDate && dropoffTime && dropoffTime < currentTime) {
        setDropoffTime('');
      }
      
      setActiveDropdown('');
      setTimeout(() => setActiveDropdown('dropoffTime'), 200);
    }
  };

  const handleTimeSelect = (time, type) => {
    if (type === 'pickup') {
      if (pickupDate === currentDate && time < currentTime) {
        return;
      }
      
      setPickupTime(time);
      
      if (pickupDate) {
        const { date: autoDropoffDate, time: autoDropoffTime } = calculateDropoffDateTime(pickupDate, time);
        setDropoffDate(autoDropoffDate);
        setDropoffTime(autoDropoffTime);
      }
      
      setActiveDropdown('');
      setTimeout(() => setActiveDropdown('dropoffDate'), 200);
    } else {
      if (dropoffDate === currentDate && time < currentTime) {
        return;
      }
      
      if (dropoffDate === pickupDate && pickupTime && time <= pickupTime) {
        return;
      }
      
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

  const selectedCityData = MAHARASHTRA_CITIES.find(city => city.id === selectedCity);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const params = new URLSearchParams({
        city: selectedCity,
        pickupMode,
        store: pickupMode === 'store' ? selectedStore : '',
        deliveryAddress: pickupMode === 'delivery' ? deliveryAddress : '',
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime
      });
      
      navigate(`/rental?${params.toString()}`);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedCity && pickupMode && 
    (pickupMode === 'delivery' ? deliveryAddress : selectedStore) && 
    pickupDate && pickupTime && dropoffDate && dropoffTime;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        closeAllDropdowns();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown when pressing Escape
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeAllDropdowns();
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
      {/* Hero Section with Side-by-Side Layout - Using your dark blue color */}
      <div style={{ backgroundColor: colors.primary }}>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Booking Form */}
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl p-6 shadow-xl" style={{ backgroundColor: colors.white }}>
                <h3 className="text-lg font-semibold mb-6" style={{ color: colors.dark }}>
                  Search your next ride
                </h3>
                
                <form onSubmit={onSubmit} className="space-y-5">
                  {/* City Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                      City
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCityModal(true)}
                      className="w-full text-left p-3 border-2 rounded-lg transition-colors text-sm font-medium"
                      style={{
                        borderColor: selectedCity ? colors.primary : colors.border,
                        backgroundColor: selectedCity ? `${colors.primary}15` : colors.white,
                        color: selectedCity ? colors.dark : colors.textLight
                      }}
                    >
                      {selectedCityData?.name || 'Select City'}
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
                        <label className="flex items-center gap-2">
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
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Store Selection */}
                  {selectedCity && pickupMode === 'store' && (
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                        Store
                      </label>
                      <select
                        value={selectedStore}
                        onChange={(e) => handleStoreSelect(e.target.value)}
                        disabled={!selectedCity}
                        className="w-full p-3 border-2 rounded-lg transition-colors text-sm font-medium focus:outline-none focus:ring-0"
                        style={{
                          borderColor: selectedStore ? colors.primary : colors.border,
                          backgroundColor: selectedStore ? `${colors.primary}15` : colors.white,
                          color: selectedStore ? colors.dark : colors.textLight
                        }}
                      >
                        <option value="">Select Store</option>
                        {selectedCityData?.stores.map(store => (
                          <option key={store.id} value={store.id}>
                            {store.name}
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
                    <label className="block text-sm font-medium mb-3" style={{ color: colors.text }}>
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.success }}></span>
                        Pickup
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Pickup Date */}
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

                        {/* Date Dropdown */}
                        {activeDropdown === 'pickupDate' && (
                          <div className="absolute z-50 mt-2 w-80 border-2 rounded-xl shadow-2xl" 
                               style={{ backgroundColor: colors.white, borderColor: colors.border }}>
                            <div className="p-4">
                              {/* Month/Year Navigation */}
                              <div className="flex items-center justify-between mb-4">
                                <button
                                  type="button"
                                  onClick={() => navigateMonth('prev')}
                                  className="p-1 rounded-full transition-colors hover:bg-gray-100"
                                >
                                  <svg className="w-5 h-5" style={{ color: colors.textLight }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                                
                                <div className="flex items-center gap-4">
                                  <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    className="text-sm font-semibold bg-transparent border-none focus:outline-none cursor-pointer"
                                    style={{ color: colors.dark }}
                                  >
                                    {monthNames.map((month, index) => (
                                      <option key={index} value={index}>{month}</option>
                                    ))}
                                  </select>
                                  <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="text-sm font-semibold bg-transparent border-none focus:outline-none cursor-pointer"
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
                                  <svg className="w-5 h-5" style={{ color: colors.textLight }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => setActiveDropdown('')}
                                  className="text-xl ml-2 hover:bg-gray-100 rounded p-1"
                                  style={{ color: colors.textLight }}
                                >
                                  ×
                                </button>
                              </div>

                              {/* Calendar Grid */}
                              <div className="grid grid-cols-7 gap-1 mb-4">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                  <div key={day} className="text-center text-xs p-2 font-medium" style={{ color: colors.textLight }}>
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
                                      className="p-2 text-sm rounded-lg transition-colors"
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

                              <div className="flex justify-center pt-3 border-t" style={{ borderColor: colors.border }}>
                                <button
                                  type="button"
                                  onClick={() => handleSelectToday('pickup')}
                                  className="font-medium text-sm px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                                  style={{ color: colors.primary }}
                                >
                                  Select Today
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Pickup Time */}
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

                        {activeDropdown === 'pickupTime' && (
                          <div className="absolute z-50 mt-2 w-full border-2 rounded-xl shadow-2xl max-h-48 overflow-y-auto"
                               style={{ backgroundColor: colors.white, borderColor: colors.border }}>
                            <div className="p-2">
                              {generateTimeSlots(pickupDate).map(slot => {
                                const isDisabled = pickupDate === currentDate && slot.value < currentTime;
                                const isSelected = pickupTime === slot.value;
                                return (
                                  <button
                                    key={slot.value}
                                    type="button"
                                    onClick={!isDisabled ? () => handleTimeSelect(slot.value, 'pickup') : undefined}
                                    disabled={isDisabled}
                                    className="w-full text-left px-4 py-3 text-sm transition-colors rounded-lg"
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
                    <label className="block text-sm font-medium mb-3" style={{ color: colors.text }}>
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.danger }}></span>
                        Dropoff
                        {dropoffDate && dropoffTime && (
                          <span className="text-xs ml-2" style={{ color: colors.textLight }}>(24h later)</span>
                        )}
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Dropoff Date */}
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

                        {activeDropdown === 'dropoffDate' && (
                          <div className="absolute z-50 mt-2 w-80 border-2 rounded-xl shadow-2xl"
                               style={{ backgroundColor: colors.white, borderColor: colors.border }}>
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <button
                                  type="button"
                                  onClick={() => navigateMonth('prev')}
                                  className="p-1 rounded-full transition-colors hover:bg-gray-100"
                                >
                                  <svg className="w-5 h-5" style={{ color: colors.textLight }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                                
                                <div className="flex items-center gap-4">
                                  <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    className="text-sm font-semibold bg-transparent border-none focus:outline-none cursor-pointer"
                                    style={{ color: colors.dark }}
                                  >
                                    {monthNames.map((month, index) => (
                                      <option key={index} value={index}>{month}</option>
                                    ))}
                                  </select>
                                  <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="text-sm font-semibold bg-transparent border-none focus:outline-none cursor-pointer"
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
                                  <svg className="w-5 h-5" style={{ color: colors.textLight }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => setActiveDropdown('')}
                                  className="text-xl ml-2 hover:bg-gray-100 rounded p-1"
                                  style={{ color: colors.textLight }}
                                >
                                  ×
                                </button>
                              </div>

                              <div className="grid grid-cols-7 gap-1 mb-4">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                  <div key={day} className="text-center text-xs p-2 font-medium" style={{ color: colors.textLight }}>
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
                                      className="p-2 text-sm rounded-lg transition-colors"
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

                      {/* Dropoff Time */}
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

                        {activeDropdown === 'dropoffTime' && (
                          <div className="absolute z-50 mt-2 w-full border-2 rounded-xl shadow-2xl max-h-48 overflow-y-auto"
                               style={{ backgroundColor: colors.white, borderColor: colors.border }}>
                            <div className="p-2">
                              {generateTimeSlots(dropoffDate).map(slot => {
                                const isDisabled = (dropoffDate === currentDate && slot.value < currentTime) ||
                                                 (dropoffDate === pickupDate && pickupTime && slot.value <= pickupTime);
                                const isSelected = dropoffTime === slot.value;
                                return (
                                  <button
                                    key={slot.value}
                                    type="button"
                                    onClick={!isDisabled ? () => handleTimeSelect(slot.value, 'dropoff') : undefined}
                                    disabled={isDisabled}
                                    className="w-full text-left px-4 py-3 text-sm transition-colors rounded-lg"
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

                  {/* Smart Booking Summary */}
                  {pickupDate && pickupTime && dropoffDate && dropoffTime && (
                    <div className="border-2 rounded-xl p-4" style={{ backgroundColor: `${colors.success}15`, borderColor: colors.success }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.success}25` }}>
                          <span className="font-bold" style={{ color: colors.success }}>✓</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm" style={{ color: colors.dark }}>Booking Ready!</h4>
                          <p className="text-xs" style={{ color: colors.text }}>
                            {formatDate(pickupDate)} {formatTime(pickupTime)} → {formatDate(dropoffDate)} {formatTime(dropoffTime)}
                          </p>
                          <p className="text-xs mt-1" style={{ color: colors.primary }}>24 hours rental period</p>
                        </div>
                      </div>
                    </div>
                  )}

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
                      src="https://www.yamaha-motor.com/content/dam/yamaha/products/sport/r15/2022-Yamaha-YZF-R15-EU-IconBlue-Studio-001-03.jpg" 
                      alt="Yamaha R15" 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src="https://www.kawasaki.com/content/dam/kawasaki/products/motorcycles/2023/ninja-650/ninja-650-krt-edition/2023-Ninja-650-KRT-Edition-GN1A.jpg" 
                      alt="Kawasaki Ninja" 
                      className="w-full h-24 object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-6">
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src="https://www.suzuki.com.au/-/media/project/suzuki-main-site/main/motorcycles/road/sport/gsx-r150/2022-gsx-r150-blue/2022gsx-r150blueaction1.jpg" 
                      alt="Suzuki GSX-R" 
                      className="w-full h-24 object-cover"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src="https://www.honda.com/content/dam/site/honda/powersports/street/sport/cbr300r/2022/overview/22CBR300RRed1.jpg" 
                      alt="Honda CBR" 
                      className="w-full h-32 object-cover"
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
                  <p className="text-sm mt-1" style={{ color: colors.text }}>Choose from our premium locations across Maharashtra</p>
                  <input
                    type="text"
                    placeholder="Search or type city to select"
                    className="w-full mt-3 px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 text-sm"
                    style={{ borderColor: colors.border, focusRingColor: colors.primary }}
                  />
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MAHARASHTRA_CITIES.map(city => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city.id)}
                    className={`group relative overflow-hidden rounded-xl transition-all hover:scale-105 hover:shadow-lg ${
                      selectedCity === city.id ? 'ring-3' : ''
                    }`}
                    style={{ ringColor: selectedCity === city.id ? colors.primary : 'transparent' }}
                  >
                    <div className="aspect-[4/3] relative">
                      <img 
                        src={city.image} 
                        alt={city.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black opacity-70 to-transparent"></div>
                    </div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="text-lg font-bold">{city.name}</div>
                      <div className="text-sm opacity-90">{city.stores.length} locations</div>
                      <div className="text-xs mt-1 px-2 py-1 rounded-full inline-block font-medium" style={{ backgroundColor: colors.warning, color: colors.dark }}>
                        {city.stores.reduce((acc, store) => acc + store.bikes, 0)} bikes
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
