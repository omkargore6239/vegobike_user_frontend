// services/bookingService.js - COMPLETE & PRODUCTION READY WITH KILOMETER SUPPORT
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8081';

// Auto-detect token key
const detectTokenKey = () => {
  const possibleKeys = ['token', 'auth_token', 'authToken', 'jwt_token', 'accessToken'];
  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);
    if (value && value.trim() !== '') {
      return key;
    }
  }
  return 'token';
};

const STORAGE_KEYS = {
  get TOKEN() {
    return detectTokenKey();
  },
  USER: 'auth_user'
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const tokenKey = STORAGE_KEYS.TOKEN;
    const token = localStorage.getItem(tokenKey);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const bookingService = {
  /**
   * ✅ COMPLETE: Create booking with all required fields
   */
  createBooking: async (bookingData) => {
    try {
      const tokenKey = STORAGE_KEYS.TOKEN;
      const token = localStorage.getItem(tokenKey);
      
      if (!token) {
        throw new Error('Authentication required. Please login first.');
      }

      // Validate required fields
      const requiredFields = {
        vehicleId: 'Vehicle ID',
        startDate: 'Start date',
        endDate: 'End date',
        pickupTime: 'Pickup time',
        dropoffTime: 'Dropoff time'
      };

      for (const [field, label] of Object.entries(requiredFields)) {
        if (!bookingData[field]) {
          throw new Error(`${label} is required`);
        }
      }

      // Validate price data
      if (!bookingData.subtotal || bookingData.subtotal <= 0) {
        throw new Error('Price calculation required before booking');
      }

      // Validate duration
      const start = new Date(`${bookingData.startDate}T${bookingData.pickupTime}`);
      const end = new Date(`${bookingData.endDate}T${bookingData.dropoffTime}`);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date or time format');
      }

      const totalHours = (end - start) / (1000 * 60 * 60);

      if (totalHours <= 0) {
        throw new Error('Dropoff time must be after pickup time');
      }

      if (totalHours < 1) {
        throw new Error('Minimum rental duration is 1 hour');
      }

      if (totalHours > 720) {
        throw new Error('Maximum rental duration is 30 days');
      }

      // ✅ COMPLETE PAYLOAD: All required fields for backend
      const requestPayload = {
        // Vehicle
        vehicleId: parseInt(bookingData.vehicleId, 10),
        
        // ✅ Date fields - Both TIMESTAMP and DATE formats
        startDate: `${bookingData.startDate}T${bookingData.pickupTime}:00`,
        endDate: `${bookingData.endDate}T${bookingData.dropoffTime}:00`,
        startDate1: bookingData.startDate,  // YYYY-MM-DD
        endDate1: bookingData.endDate,      // YYYY-MM-DD
        
        // ✅ Price fields (required by backend validation)
        charges: parseFloat(bookingData.subtotal) || 0,
        gst: parseFloat(bookingData.gst) || 0,
        totalCharges: parseFloat(bookingData.totalCharges) || parseFloat(bookingData.subtotal),
        finalAmount: parseFloat(bookingData.finalAmount) || parseFloat(bookingData.total),
        advanceAmount: parseFloat(bookingData.deposit) || 0,
        
        // ✅ Duration
        totalHours: parseFloat(totalHours.toFixed(2)),
        additionalHours: 0,
        
        // Payment
        paymentType: bookingData.paymentType || 1,
        paymentStatus: bookingData.paymentStatus || 'PENDING',
        
        // Address
        addressType: bookingData.addressType || 'Self Pickup',
        address: bookingData.address || '',
        deliveryType: bookingData.addressType === 'Delivery' ? 'Home Delivery' : null,
        
        // Locations
        pickupLocationId: parseInt(bookingData.pickupLocationId) || 1,
        dropLocationId: parseInt(bookingData.dropLocationId) || 1,
        
        // Coupon
        couponCode: bookingData.couponCode || null,
        couponId: bookingData.couponCode ? (parseInt(bookingData.couponId) || 0) : 0,
        couponAmount: parseFloat(bookingData.couponAmount) || 0,
        
        // Additional charges
        additionalCharges: 0,
        additionalChargesDetails: null,
        deliveryCharges: 0,
        
        // Other
        km: 0,
        lateFeeCharges: 0,
        lateEndDate: null,
        merchantTransactionId: null,
        transactionId: null,
        bookingStatus: bookingData.bookingStatus || 1
      };

      const response = await apiClient.post('/api/booking-bikes/create', requestPayload);
      return response.data;

    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        const status = error.response.status;

        const errorMessages = {
          'BOOKING_001': 'You already have an active booking. Please complete or cancel it first.',
          'BOOKING_002': errorData.message || 'Document verification required.',
          'BOOKING_003': errorData.message || 'Invalid booking data.'
        };

        if (errorData.errorCode && errorMessages[errorData.errorCode]) {
          throw new Error(errorMessages[errorData.errorCode]);
        }

        const statusMessages = {
          400: errorData.message || 'Invalid request data',
          401: 'Authentication failed. Please login again.',
          403: 'You do not have permission to perform this action.',
          404: 'Vehicle not found',
          409: errorData.message || 'Booking conflict detected',
          500: errorData.message || 'Server error. Please try again later.'
        };

        if (statusMessages[status]) {
          throw new Error(statusMessages[status]);
        }

        throw new Error(errorData.message || `Booking failed with status ${status}`);
      }

      if (error.request) {
        throw new Error('Network error. Please check your internet connection.');
      }

      throw error;
    }
  },

  /**
   * Verify Razorpay payment
   */
  verifyPayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/api/payments/verify', paymentData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
  },

  /**
   * Get all bookings
   */
  getAllBookings: async () => {
    try {
      const response = await apiClient.get('/api/booking-bikes/allBooking');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch bookings');
    }
  },

  /**
   * Get bookings by customer
   */
  getBookingsByCustomer: async (customerId, page = 0, size = 10, sortBy = 'latest') => {
    try {
      const response = await apiClient.get('/api/booking-bikes/by-customer', {
        params: { customerId, page, size, sortBy }
      });

      if (response.data && Array.isArray(response.data)) {
        response.data = response.data.map(booking => ({
          ...booking,
          durationDisplay: formatDuration(booking.totalHours)
        }));
      }

      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch bookings');
    }
  },

  /**
   * Get booking by ID
   */
  getBookingById: async (id) => {
    try {
      const response = await apiClient.get(`/api/booking-bikes/getById/${id}`);

      if (response.data && response.data.totalHours) {
        response.data.durationDisplay = formatDuration(response.data.totalHours);
      }

      return response.data;
    } catch (error) {
      throw new Error('Booking not found');
    }
  },

  /**
   * Accept booking
   */
  acceptBooking: async (bookingId) => {
    try {
      const response = await apiClient.post(`/api/booking-bikes/${bookingId}/accept`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to accept booking');
    }
  },

  /**
   * ✅ UPDATED: Start trip with images and kilometer reading
   */
  startTrip: async (bookingId, images, startTripKm) => {
    try {
      console.log('🚗 START_TRIP Service - Booking:', bookingId, 'Images:', images.length, 'KM:', startTripKm);
      
      // Validate inputs
      if (!bookingId) {
        throw new Error('Booking ID is required');
      }
      
      if (!images || images.length !== 4) {
        throw new Error('All 4 bike images are required');
      }
      
      if (!startTripKm || startTripKm <= 0) {
        throw new Error('Valid kilometer reading is required');
      }

      const formData = new FormData();
      
      // Append all 4 images
      images.forEach((image, index) => {
        if (image) {
          formData.append('images', image);
        }
      });
      
      // Append kilometer reading
      formData.append('startTripKm', startTripKm.toString());

      console.log('🚗 START_TRIP FormData - Images count:', images.length, 'KM:', startTripKm);

      const response = await apiClient.post(
        `/api/booking-bikes/${bookingId}/start`,
        formData,
        { 
          headers: { 
            'Content-Type': 'multipart/form-data' 
          } 
        }
      );

      console.log('🚗 START_TRIP Response:', response.data);
      return response.data;

    } catch (error) {
      console.error('💥 START_TRIP Service Error:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error(error.message || 'Failed to start trip');
    }
  },

  /**
   * ✅ UPDATED: End trip with images and kilometer reading
   */
  endTrip: async (bookingId, images, endTripKm) => {
    try {
      console.log('🏁 END_TRIP Service - Booking:', bookingId, 'Images:', images.length, 'KM:', endTripKm);
      
      // Validate inputs
      if (!bookingId) {
        throw new Error('Booking ID is required');
      }
      
      if (!images || images.length !== 4) {
        throw new Error('All 4 bike images are required');
      }
      
      if (!endTripKm || endTripKm <= 0) {
        throw new Error('Valid kilometer reading is required');
      }

      const formData = new FormData();
      
      // Append all 4 images
      images.forEach((image, index) => {
        if (image) {
          formData.append('images', image);
        }
      });
      
      // Append kilometer reading
      formData.append('endTripKm', endTripKm.toString());

      console.log('🏁 END_TRIP FormData - Images count:', images.length, 'KM:', endTripKm);

      const response = await apiClient.post(
        `/api/booking-bikes/${bookingId}/end`,
        formData,
        { 
          headers: { 
            'Content-Type': 'multipart/form-data' 
          } 
        }
      );

      console.log('🏁 END_TRIP Response:', response.data);
      return response.data;

    } catch (error) {
      console.error('💥 END_TRIP Service Error:', error);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error(error.message || 'Failed to end trip');
    }
  },

  /**
   * Get vehicle documents
   */
  getVehicleDocuments: async (vehicleId) => {
    try {
      if (!vehicleId) {
        throw new Error('Vehicle ID is required');
      }

      const response = await apiClient.get(`/api/bikes/view-documents/${vehicleId}`);
      return response.data;

    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Vehicle documents not found');
      } else if (error.response?.status === 403) {
        throw new Error('Permission denied');
      }
      throw new Error('Failed to fetch documents');
    }
  },

  /**
   * Cancel booking
   */
  cancelBooking: async (bookingId, cancelledBy = 'USER') => {
    try {
      const response = await apiClient.post(
        `/api/booking-bikes/${bookingId}/cancel`,
        null,
        { params: { cancelledBy } }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
  },

  /**
   * Complete booking
   */
  completeBooking: async (bookingId) => {
    try {
      const response = await apiClient.post(`/api/booking-bikes/${bookingId}/complete`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to complete booking');
    }
  },

  /**
   * Get invoice
   */
  getInvoice: async (bookingId) => {
    try {
      const response = await apiClient.get(
        `/api/booking-bikes/${bookingId}/invoice`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch invoice');
    }
  },

  /**
   * Validate booking dates
   */
  validateBookingDates: (startDate, endDate, pickupTime, dropoffTime) => {
    const start = new Date(`${startDate}T${pickupTime}`);
    const end = new Date(`${endDate}T${dropoffTime}`);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date or time format');
    }

    if (start < now) {
      throw new Error('Start date and time cannot be in the past');
    }

    if (end <= start) {
      throw new Error('End date and time must be after start date and time');
    }

    const diffInHours = (end - start) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      throw new Error('Minimum rental duration is 1 hour');
    }

    if (diffInHours > 720) {
      throw new Error('Maximum rental duration is 30 days');
    }

    return Math.ceil(diffInHours);
  },

  /**
   * Calculate rental price
   */
  calculateRentalPrice: (hourlyRate, totalHours) => {
    if (!hourlyRate || !totalHours) return 0;
    return Math.round(hourlyRate * totalHours);
  },

  /**
   * Format price
   */
  formatPrice: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  }
};

/**
 * Format duration helper
 */
const formatDuration = (hours) => {
  if (!hours || hours <= 0) return 'N/A';

  if (hours < 24) {
    const roundedHours = Math.round(hours);
    return `${roundedHours} hour${roundedHours !== 1 ? 's' : ''}`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);

  if (remainingHours === 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }

  return `${days}d ${remainingHours}h`;
};

export default bookingService;
