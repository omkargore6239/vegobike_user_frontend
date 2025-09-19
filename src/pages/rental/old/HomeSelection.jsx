import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Maharashtra cities data
const MAHARASHTRA_CITIES = [
  {
    id: "mumbai",
    name: "Mumbai",
    image: "https://images.unsplash.com/photo-1595675024853-0f3ec9098ac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    stores: [
      { id: "mumbai-1", name: "Andheri Hub", address: "Near Metro Station, Andheri East", bikes: 45 },
      { id: "mumbai-2", name: "Bandra Center", address: "Linking Road, Bandra West", bikes: 38 },
      { id: "mumbai-3", name: "Powai Junction", address: "Hiranandani, Powai", bikes: 32 }
    ]
  },
  {
    id: "pune",
    name: "Pune",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    stores: [
      { id: "pune-1", name: "Koregaon Park Hub", address: "North Main Road, Koregaon Park", bikes: 28 },
      { id: "pune-2", name: "Hinjewadi Center", address: "Phase 1, Hinjewadi IT Park", bikes: 35 }
    ]
  },
  {
    id: "nashik",
    name: "Nashik",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    stores: [
      { id: "nashik-1", name: "City Center Hub", address: "Main Road, Nashik Road", bikes: 20 }
    ]
  },
  {
    id: "nagpur",
    name: "Nagpur",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    stores: [
      { id: "nagpur-1", name: "Sitabuldi Hub", address: "Central Nagpur, Sitabuldi", bikes: 22 }
    ]
  },
  {
    id: "aurangabad",
    name: "Aurangabad",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    stores: [
      { id: "aurangabad-1", name: "CIDCO Hub", address: "CIDCO Area, Aurangabad", bikes: 15 }
    ]
  },
  {
    id: "kolhapur",
    name: "Kolhapur",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    stores: [
      { id: "kolhapur-1", name: "Mahadwar Hub", address: "Near Palace, Mahadwar Road", bikes: 12 }
    ]
  }
];

export default function RentalSearch() {
  const navigate = useNavigate();
  
  // All fields start blank
  const [selectedCity, setSelectedCity] = useState("");
  const [pickupMode, setPickupMode] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  
  // Calendar navigation state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Simplified dropdown states - only one can be open at a time
  const [showCityModal, setShowCityModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fixed: Get current date and time with proper timezone handling
  const getCurrentDateTime = () => {
    const now = new Date();
    // Add 30 minutes buffer for booking
    const bufferTime = new Date(now.getTime() + 30 * 60000);
    
    // Use local date string to avoid timezone issues
    const currentDate = now.getFullYear() + '-' + 
                       String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(now.getDate()).padStart(2, '0');
    
    const currentTime = String(bufferTime.getHours()).padStart(2, '0') + ':' + 
                       String(bufferTime.getMinutes()).padStart(2, '0');
    
    return {
      currentDate,
      currentTime,
      currentDateTime: now,
      bufferDateTime: bufferTime
    };
  };

  const { currentDate, currentTime, currentDateTime, bufferDateTime } = getCurrentDateTime();

  // Month names for display
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Fixed: Generate calendar days with proper date handling for any month/year
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
      const prevDateStr = prevYear + '-' + 
                         String(prevMonth + 1).padStart(2, '0') + '-' + 
                         String(day).padStart(2, '0');
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
      const dayDateStr = year + '-' + 
                        String(month + 1).padStart(2, '0') + '-' + 
                        String(day).padStart(2, '0');
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
      const nextDateStr = nextYear + '-' + 
                         String(nextMonth + 1).padStart(2, '0') + '-' + 
                         String(day).padStart(2, '0');
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
        
        // Filter times based on selected date
        let isAvailable = true;
        if (selectedDateStr && selectedDateStr === currentDate) {
          // For today, only allow times after current time + buffer
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
    if (!pickupDateStr || !pickupTimeStr) return { date: "", time: "" };
    
    const [hours, minutes] = pickupTimeStr.split(':');
    const pickupDateTime = new Date(pickupDateStr + 'T' + pickupTimeStr + ':00');
    
    // Add 24 hours (24 * 60 * 60 * 1000 milliseconds)
    const dropoffDateTime = new Date(pickupDateTime.getTime() + 24 * 60 * 60 * 1000);
    
    const dropoffDateStr = dropoffDateTime.getFullYear() + '-' + 
                          String(dropoffDateTime.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(dropoffDateTime.getDate()).padStart(2, '0');
    
    const dropoffTimeStr = String(dropoffDateTime.getHours()).padStart(2, '0') + ':' + 
                          String(dropoffDateTime.getMinutes()).padStart(2, '0');
    
    return { date: dropoffDateStr, time: dropoffTimeStr };
  };

  const calendarDays = generateCalendarDays();
  const allTimeSlots = generateTimeSlots();

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setActiveDropdown("");
  };

  // Enhanced auto-flow functions with better UX
  const handleCitySelect = (cityId) => {
    setSelectedCity(cityId);
    setSelectedStore("");
    setPickupMode("");
    setShowCityModal(false);
    
    // If only one store, auto-select it and move to date selection
    const cityData = MAHARASHTRA_CITIES.find(city => city.id === cityId);
    if (cityData?.stores.length === 1 && pickupMode === "store") {
      setSelectedStore(cityData.stores[0].id);
      // Auto-open pickup date after a brief delay
      setTimeout(() => setActiveDropdown("pickupDate"), 300);
    }
  };

  const handleStoreSelect = (storeId) => {
    setSelectedStore(storeId);
    closeAllDropdowns();
    // Auto-open pickup date selection
    setTimeout(() => setActiveDropdown("pickupDate"), 200);
  };

  // Fixed: Date selection with proper validation and auto-close
  const handleDateSelect = (date, type) => {
    // Prevent selection of past dates
    if (date < currentDate) {
      return;
    }

    if (type === "pickup") {
      setPickupDate(date);
      // Reset pickup time if date changed to today (to ensure valid time selection)
      if (date === currentDate && pickupTime && pickupTime < currentTime) {
        setPickupTime("");
      }
      
      // If pickup time is already set, auto-calculate dropoff
      if (pickupTime) {
        const { date: autoDropoffDate, time: autoDropoffTime } = calculateDropoffDateTime(date, pickupTime);
        setDropoffDate(autoDropoffDate);
        setDropoffTime(autoDropoffTime);
      }
      
      // Close calendar and auto-open pickup time
      setActiveDropdown("");
      setTimeout(() => setActiveDropdown("pickupTime"), 200);
    } else {
      // Prevent dropoff date before pickup date
      if (pickupDate && date < pickupDate) {
        return;
      }
      
      setDropoffDate(date);
      // Reset dropoff time if date changed to today
      if (date === currentDate && dropoffTime && dropoffTime < currentTime) {
        setDropoffTime("");
      }
      
      // Close calendar and auto-open dropoff time
      setActiveDropdown("");
      setTimeout(() => setActiveDropdown("dropoffTime"), 200);
    }
  };

  // Enhanced time selection with validation and auto-calculation
  const handleTimeSelect = (time, type) => {
    if (type === "pickup") {
      // Validate time for today's date
      if (pickupDate === currentDate && time < currentTime) {
        return; // Don't allow past times for today
      }
      
      setPickupTime(time);
      
      // Auto-calculate dropoff date and time (24 hours later)
      if (pickupDate) {
        const { date: autoDropoffDate, time: autoDropoffTime } = calculateDropoffDateTime(pickupDate, time);
        setDropoffDate(autoDropoffDate);
        setDropoffTime(autoDropoffTime);
      }
      
      // Close and auto-open dropoff date
      setActiveDropdown("");
      setTimeout(() => setActiveDropdown("dropoffDate"), 200);
    } else {
      // Validate dropoff time
      if (dropoffDate === currentDate && time < currentTime) {
        return; // Don't allow past times for today
      }
      
      // Validate dropoff time is after pickup time on same date
      if (dropoffDate === pickupDate && pickupTime && time <= pickupTime) {
        return; // Dropoff must be after pickup on same date
      }
      
      setDropoffTime(time);
      // Close dropdown - booking complete
      setActiveDropdown("");
    }
  };

  // Fixed: Select today's date function
  const handleSelectToday = (type) => {
    // Reset to current month/year when selecting today
    setSelectedMonth(currentDateTime.getMonth());
    setSelectedYear(currentDateTime.getFullYear());
    handleDateSelect(currentDate, type);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00'); // Add time to avoid timezone issues
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
        store: pickupMode === "store" ? selectedStore : "",
        deliveryAddress: pickupMode === "delivery" ? deliveryAddress : "",
        pickupDate,
        pickupTime,
        dropoffDate,
        dropoffTime
      });
      navigate(`/rental/results?${params.toString()}`);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = selectedCity && pickupMode && (pickupMode === "delivery" ? deliveryAddress : selectedStore) && pickupDate && pickupTime && dropoffDate && dropoffTime;

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Side-by-Side Layout */}
      <div className="bg-gradient-to-br from-[#000099] to-[#1a1a66] py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            
            {/* Left Side - Booking Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Search your next ride</h3>
                
                <form onSubmit={onSubmit} className="space-y-5">
                  
                  {/* City Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <button
                      type="button"
                      onClick={() => setShowCityModal(true)}
                      className={`w-full text-left p-3 border-2 rounded-lg transition-colors text-sm font-medium ${
                        selectedCity 
                          ? 'border-yellow-500 bg-yellow-50 text-gray-900' 
                          : 'border-gray-300 hover:border-yellow-400 text-gray-700'
                      }`}
                    >
                      {selectedCityData?.name || 'Select City'}
                    </button>
                  </div>

                  {/* Pickup Mode Selection */}
                  {selectedCity && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup or Delivery Option
                      </label>
                      <div className="flex gap-4 mb-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="pickupMode"
                            value="store"
                            checked={pickupMode === "store"}
                            onChange={() => setPickupMode("store")}
                            className="accent-yellow-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Pickup at Store</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="pickupMode"
                            value="delivery"
                            checked={pickupMode === "delivery"}
                            onChange={() => setPickupMode("delivery")}
                            className="accent-yellow-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Delivery at Location</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Store Selection (conditional) */}
                  {selectedCity && pickupMode === "store" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Store</label>
                      <select
                        value={selectedStore}
                        onChange={(e) => handleStoreSelect(e.target.value)}
                        disabled={!selectedCity}
                        className={`w-full p-3 border-2 rounded-lg transition-colors text-sm font-medium ${
                          selectedStore
                            ? 'border-yellow-500 bg-yellow-50 text-gray-900'
                            : selectedCity
                              ? 'border-gray-300 hover:border-yellow-400 text-gray-700'
                              : 'border-gray-200 bg-gray-50 text-gray-400'
                        } focus:outline-none focus:ring-0`}
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

                  {/* Delivery Address (conditional) */}
                  {selectedCity && pickupMode === "delivery" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Enter delivery address"
                        className="w-full p-3 border-2 rounded-lg text-sm font-medium border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                      />
                    </div>
                  )}

                  {/* Pickup Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                        Pickup
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Pickup Date */}
                      <div className="dropdown-container relative">
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(activeDropdown === "pickupDate" ? "" : "pickupDate")}
                          className={`w-full p-3 border-2 rounded-lg transition-colors text-sm font-medium ${
                            pickupDate 
                              ? 'border-yellow-500 bg-yellow-50 text-gray-900' 
                              : 'border-gray-300 hover:border-yellow-400 text-gray-500'
                          } ${activeDropdown === "pickupDate" ? 'ring-2 ring-yellow-200' : ''}`}
                        >
                          {pickupDate ? formatDate(pickupDate) : 'Select Date'}
                        </button>
                        
                        {/* Enhanced Date Dropdown with 12 Month Navigation */}
                        {activeDropdown === "pickupDate" && (
                          <div className="absolute z-50 mt-2 w-80 bg-white border-2 border-gray-200 rounded-xl shadow-2xl">
                            <div className="p-4">
                              {/* Month/Year Navigation */}
                              <div className="flex items-center justify-between mb-4">
                                <button
                                  type="button"
                                  onClick={() => navigateMonth('prev')}
                                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                                
                                <div className="flex items-center gap-4">
                                  <select 
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    className="text-sm font-semibold bg-transparent border-none focus:outline-none cursor-pointer"
                                  >
                                    {monthNames.map((month, index) => (
                                      <option key={index} value={index}>{month}</option>
                                    ))}
                                  </select>
                                  
                                  <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="text-sm font-semibold bg-transparent border-none focus:outline-none cursor-pointer"
                                  >
                                    {Array.from({length: 3}, (_, i) => currentDateTime.getFullYear() + i).map(year => (
                                      <option key={year} value={year}>{year}</option>
                                    ))}
                                  </select>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => navigateMonth('next')}
                                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => setActiveDropdown("")}
                                  className="text-gray-400 hover:text-gray-600 text-xl ml-2"
                                >
                                  ×
                                </button>
                              </div>

                              <div className="grid grid-cols-7 gap-1 mb-4">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                  <div key={day} className="text-center text-xs text-gray-500 p-2 font-medium">
                                    {day}
                                  </div>
                                ))}
                                
                                {generateCalendarDays(selectedMonth, selectedYear).map((day, index) => {
                                  const isClickable = day.isCurrentMonth && !day.isPast;
                                  return (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={() => isClickable && handleDateSelect(day.fullDate, "pickup")}
                                      disabled={!isClickable}
                                      className={`p-2 text-sm rounded-lg transition-colors ${
                                        day.isToday && day.isCurrentMonth
                                          ? 'bg-yellow-400 text-black font-bold cursor-pointer hover:bg-yellow-500'
                                          : day.isCurrentMonth && !day.isPast
                                            ? 'hover:bg-yellow-100 text-gray-900 cursor-pointer'
                                            : day.isCurrentMonth
                                              ? 'text-gray-300 cursor-not-allowed'
                                              : 'text-gray-300'
                                      } ${
                                        pickupDate === day.fullDate
                                          ? 'bg-yellow-500 text-white font-bold'
                                          : ''
                                      }`}
                                    >
                                      {day.date}
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="flex justify-center pt-3 border-t border-gray-200">
                                <button
                                  type="button"
                                  onClick={() => handleSelectToday("pickup")}
                                  className="text-yellow-600 hover:text-yellow-700 font-medium text-sm px-4 py-2 rounded-lg hover:bg-yellow-50"
                                >
                                  ⭐ Select Today
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
                          onClick={() => setActiveDropdown(activeDropdown === "pickupTime" ? "" : "pickupTime")}
                          className={`w-full p-3 border-2 rounded-lg transition-colors text-sm font-medium ${
                            pickupTime 
                              ? 'border-yellow-500 bg-yellow-50 text-gray-900' 
                              : 'border-gray-300 hover:border-yellow-400 text-gray-500'
                          } ${activeDropdown === "pickupTime" ? 'ring-2 ring-yellow-200' : ''}`}
                        >
                          {pickupTime ? formatTime(pickupTime) : 'Select Time'}
                        </button>
                        
                        {activeDropdown === "pickupTime" && (
                          <div className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                            <div className="p-2">
                              {generateTimeSlots(pickupDate).map(slot => {
                                const isDisabled = pickupDate === currentDate && slot.value < currentTime;
                                return (
                                  <button
                                    key={slot.value}
                                    type="button"
                                    onClick={() => !isDisabled && handleTimeSelect(slot.value, "pickup")}
                                    disabled={isDisabled}
                                    className={`w-full text-left px-4 py-3 text-sm transition-colors rounded-lg ${
                                      isDisabled
                                        ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                                        : pickupTime === slot.value
                                          ? 'bg-yellow-400 text-black font-bold'
                                          : 'text-gray-700 hover:bg-yellow-50'
                                    }`}
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
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        Dropoff
                        {dropoffDate && dropoffTime && (
                          <span className="text-xs text-gray-500 ml-2">(24h later)</span>
                        )}
                      </span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Dropoff Date */}
                      <div className="dropdown-container relative">
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(activeDropdown === "dropoffDate" ? "" : "dropoffDate")}
                          className={`w-full p-3 border-2 rounded-lg transition-colors text-sm font-medium ${
                            dropoffDate 
                              ? 'border-yellow-500 bg-yellow-50 text-gray-900' 
                              : 'border-gray-300 hover:border-yellow-400 text-gray-500'
                          } ${activeDropdown === "dropoffDate" ? 'ring-2 ring-yellow-200' : ''}`}
                        >
                          {dropoffDate ? formatDate(dropoffDate) : 'Select Date'}
                          {dropoffDate && (
                            <span className="ml-2 text-xs text-blue-600">✎</span>
                          )}
                        </button>
                        
                        {activeDropdown === "dropoffDate" && (
                          <div className="absolute z-50 mt-2 w-80 bg-white border-2 border-gray-200 rounded-xl shadow-2xl">
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-4">
                                <button
                                  type="button"
                                  onClick={() => navigateMonth('prev')}
                                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>
                                
                                <div className="flex items-center gap-4">
                                  <select 
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                    className="text-sm font-semibold bg-transparent border-none focus:outline-none cursor-pointer"
                                  >
                                    {monthNames.map((month, index) => (
                                      <option key={index} value={index}>{month}</option>
                                    ))}
                                  </select>
                                  
                                  <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className="text-sm font-semibold bg-transparent border-none focus:outline-none cursor-pointer"
                                  >
                                    {Array.from({length: 3}, (_, i) => currentDateTime.getFullYear() + i).map(year => (
                                      <option key={year} value={year}>{year}</option>
                                    ))}
                                  </select>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => navigateMonth('next')}
                                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => setActiveDropdown("")}
                                  className="text-gray-400 hover:text-gray-600 text-xl ml-2"
                                >
                                  ×
                                </button>
                              </div>

                              <div className="grid grid-cols-7 gap-1 mb-4">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                  <div key={day} className="text-center text-xs text-gray-500 p-2 font-medium">
                                    {day}
                                  </div>
                                ))}
                                
                                {generateCalendarDays(selectedMonth, selectedYear).map((day, index) => {
                                  const isClickable = day.isCurrentMonth && !day.isPast && (!pickupDate || day.fullDate >= pickupDate);
                                  return (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={() => isClickable && handleDateSelect(day.fullDate, "dropoff")}
                                      disabled={!isClickable}
                                      className={`p-2 text-sm rounded-lg transition-colors ${
                                        day.isToday && day.isCurrentMonth && isClickable
                                          ? 'bg-yellow-400 text-black font-bold cursor-pointer hover:bg-yellow-500'
                                          : isClickable
                                            ? 'hover:bg-yellow-100 text-gray-900 cursor-pointer'
                                            : day.isCurrentMonth
                                              ? 'text-gray-300 cursor-not-allowed'
                                              : 'text-gray-300'
                                      } ${
                                        dropoffDate === day.fullDate
                                          ? 'bg-yellow-500 text-white font-bold'
                                          : ''
                                      }`}
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
                          onClick={() => setActiveDropdown(activeDropdown === "dropoffTime" ? "" : "dropoffTime")}
                          className={`w-full p-3 border-2 rounded-lg transition-colors text-sm font-medium ${
                            dropoffTime 
                              ? 'border-yellow-500 bg-yellow-50 text-gray-900' 
                              : 'border-gray-300 hover:border-yellow-400 text-gray-500'
                          } ${activeDropdown === "dropoffTime" ? 'ring-2 ring-yellow-200' : ''}`}
                        >
                          {dropoffTime ? formatTime(dropoffTime) : 'Select Time'}
                          {dropoffTime && (
                            <span className="ml-2 text-xs text-blue-600">✎</span>
                          )}
                        </button>
                        
                        {activeDropdown === "dropoffTime" && (
                          <div className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                            <div className="p-2">
                              {generateTimeSlots(dropoffDate).map(slot => {
                                const isDisabled = 
                                  (dropoffDate === currentDate && slot.value < currentTime) ||
                                  (dropoffDate === pickupDate && pickupTime && slot.value <= pickupTime);
                                
                                return (
                                  <button
                                    key={slot.value}
                                    type="button"
                                    onClick={() => !isDisabled && handleTimeSelect(slot.value, "dropoff")}
                                    disabled={isDisabled}
                                    className={`w-full text-left px-4 py-3 text-sm transition-colors rounded-lg ${
                                      isDisabled
                                        ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                                        : dropoffTime === slot.value
                                          ? 'bg-yellow-400 text-black font-bold'
                                          : 'text-gray-700 hover:bg-yellow-50'
                                    }`}
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
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm">Booking Ready!</h4>
                          <p className="text-xs text-gray-600">
                            {formatDate(pickupDate)} {formatTime(pickupTime)} → {formatDate(dropoffDate)} {formatTime(dropoffTime)}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">24 hours rental period</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Search Button */}
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
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
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span className="text-sm font-medium text-white">VEGO BIKE Premium Rentals</span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    A DECADE
                  </span>
                  <br />
                  <span>ON THE ROAD</span>
                </h1>
                
                <p className="text-lg text-white/90 mb-8">
                  Premium bike rentals across Maharashtra with instant booking and 24/7 support
                </p>
              </div>

              {/* Bike Images Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src="https://www.yamaha-motor.com/content/dam/yamaha/products/sport/r15/2022-Yamaha-YZF-R15-EU-Icon_Blue-Studio-001-03.jpg"
                      alt="Yamaha R15"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src="https://www.kawasaki.com/content/dam/kawasaki/products/motorcycles/2023/ninja-650/ninja-650-krt-edition/2023-Ninja-650-KRT-Edition-GN1_A.jpg"
                      alt="Kawasaki Ninja"
                      className="w-full h-24 object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 mt-6">
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src="https://www.suzuki.com.au/-/media/project/suzuki-main-site/main/motorcycles/road/sport/gsx-r150/2022-gsx-r150-blue/2022_gsx-r150_blue_action_1.jpg"
                      alt="Suzuki GSX-R"
                      className="w-full h-24 object-cover"
                    />
                  </div>
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src="https://www.honda.com/content/dam/site/honda/powersports/street/sport/cbr300r/2022/overview/22_CBR300R_Red_1.jpg"
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

      {/* Enhanced Steps Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Book Your Perfect Ride</h2>
          <p className="text-lg text-gray-600">Simple steps to get your motorcycle rental</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Choose Your Location",
              description: "Select your preferred city and pickup store from our network across Maharashtra.",
              details: [
                "Browse available cities",
                "Select convenient store location",
                "Check bike availability",
                "View store timings & contact"
              ],
              icon: "🌆",
              color: "from-blue-500 to-cyan-500"
            },
            {
              step: "2",
              title: "Pick Date & Time",
              description: "Choose your pickup and return schedule with our smart auto-flow system.",
              details: [
                "Select pickup date & time",
                "Auto-set return schedule",
                "Minimum 24-hour rental",
                "Flexible timing options"
              ],
              icon: "📅",
              color: "from-green-500 to-emerald-500"
            },
            {
              step: "3",
              title: "Select Your Bike",
              description: "Browse our premium fleet and choose the perfect motorcycle for your journey.",
              details: [
                "View available bikes",
                "Compare models & features",
                "Check real-time pricing",
                "Read bike specifications"
              ],
              icon: "🏍️",
              color: "from-orange-500 to-red-500"
            },
            {
              step: "4",
              title: "Book & Pay Securely",
              description: "Complete your booking with secure payment and get instant confirmation.",
              details: [
                "Review booking summary",
                "Upload required documents",
                "Make secure payment",
                "Get instant confirmation"
              ],
              icon: "💳",
              color: "from-purple-500 to-pink-500"
            }
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg relative`}>
                  <span className="text-2xl">{item.icon}</span>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-sm font-bold text-black">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>
              </div>
              
              <div className="space-y-2">
                {item.details.map((detail, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Benefits */}
        <div className="mt-12 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Why Choose VEGO BIKE?</h3>
            <p className="text-gray-600">Premium features that make us the best choice for your bike rental needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🛡️</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">100% Safe & Insured</h4>
              <p className="text-gray-600 text-sm">All bikes are fully insured with comprehensive coverage for your peace of mind.</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">⚡</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Booking</h4>
              <p className="text-gray-600 text-sm">Book your bike in minutes with our streamlined process and get instant confirmation.</p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🎯</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-gray-600 text-sm">Round-the-clock customer support and roadside assistance whenever you need help.</p>
            </div>
          </div>
        </div>
      </div>

      {/* City Selection Modal */}
      {showCityModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Select Your City</h3>
                  <p className="text-gray-600 text-sm mt-1">Choose from our premium locations across Maharashtra</p>
                  <input
                    type="text"
                    placeholder="Search or type city to select"
                    className="w-full mt-3 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                  />
                </div>
                <button
                  onClick={() => setShowCityModal(false)}
                  className="ml-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
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
                      selectedCity === city.id ? 'ring-3 ring-yellow-400' : ''
                    }`}
                  >
                    <div className="aspect-[4/3] relative">
                      <img 
                        src={city.image} 
                        alt={city.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 text-white">
                        <div className="text-lg font-bold">{city.name}</div>
                        <div className="text-sm opacity-90">{city.stores.length} locations</div>
                        <div className="text-xs mt-1 bg-yellow-400 text-black px-2 py-1 rounded-full inline-block font-medium">
                          {city.stores.reduce((acc, store) => acc + store.bikes, 0)} bikes
                        </div>
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
