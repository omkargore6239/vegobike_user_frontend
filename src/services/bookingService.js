// services/bookingService.js - COMPLETE & PRODUCTION READY WITH TOKEN VALIDATION
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8081';

// ✅ ADD: JWT decode function (no external library needed)
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('❌ JWT decode error:', error);
    return null;
  }
};

// ✅ ADD: Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      console.error('❌ Invalid token structure');
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const isExpired = decoded.exp < currentTime;
    
    if (isExpired) {
      console.error('❌ Token expired at:', new Date(decoded.exp * 1000));
      console.error('❌ Current time:', new Date(currentTime * 1000));
    } else {
      const minutesUntilExpiry = Math.floor((decoded.exp - currentTime) / 60);
      console.log('✅ Token valid for', minutesUntilExpiry, 'minutes');
    }
    
    return isExpired;
  } catch (error) {
    console.error('❌ Token validation error:', error);
    return true;
  }
};

// ✅ ADD: Clear storage and redirect to login
const handleAuthError = (message = 'Your session has expired. Please login again.') => {
  console.error('🚫 Authentication Error:', message);
  
  // Clear all auth data
  localStorage.removeItem('token');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('auth_user');
  
  // Show alert
  alert(message);
  
  // Redirect to login
  window.location.href = '/login';
};

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

// ✅ UPDATED: Request interceptor - CHECK TOKEN BEFORE EVERY REQUEST
apiClient.interceptors.request.use(
  (config) => {
    const tokenKey = STORAGE_KEYS.TOKEN;
    const token = localStorage.getItem(tokenKey);
    
    if (token) {
      // ✅ CHECK: Validate token before using it
      if (isTokenExpired(token)) {
        console.error('❌ Token expired - blocking request and redirecting to login');
        handleAuthError('Your session has expired. Please login again.');
        return Promise.reject(new Error('Token expired'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Valid token attached to request');
    } else {
      console.warn('⚠️ No token found in storage');
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add refresh token endpoint (if your backend supports it)
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error('❌ No refresh token available');
      throw new Error('No refresh token available');
    }

    console.log('🔄 Attempting to refresh token...');
    const response = await axios.post(`${API_BASE_URL}/api/auth/refreshtoken`, {
      refreshToken: refreshToken
    });

    const { accessToken, token } = response.data;
    const newToken = accessToken || token;
    
    if (!newToken) {
      throw new Error('No token in refresh response');
    }
    
    localStorage.setItem('token', newToken);
    console.log('✅ Token refreshed successfully');
    return newToken;
    
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    handleAuthError('Session expired. Please login again.');
    throw error;
  }
};

// ✅ UPDATED: Response interceptor - Handle 401 with refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 401 error - attempting token refresh...');
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed - redirecting to login');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const bookingService = {
  /**
   * ✅ COMPLETE: Create booking with all required fields + TOKEN VALIDATION
   */
  createBooking: async (bookingData) => {
    try {
      const tokenKey = STORAGE_KEYS.TOKEN;
      const token = localStorage.getItem(tokenKey);
      
      // ✅ VALIDATE: Check token exists
      if (!token) {
        handleAuthError('Please login to continue booking');
        throw new Error('Authentication required. Please login first.');
      }

      // ✅ VALIDATE: Check token is not expired
      if (isTokenExpired(token)) {
        handleAuthError('Your session has expired. Please login again.');
        throw new Error('Token expired. Please login again.');
      }

      // ✅ DEBUG: Log token info
      const decoded = decodeJWT(token);
      console.log('🔐 Token Info:', {
        customerId: decoded?.customerId,
        expiresAt: decoded?.exp ? new Date(decoded.exp * 1000) : 'Unknown',
        issuedAt: decoded?.iat ? new Date(decoded.iat * 1000) : 'Unknown'
      });

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

      console.log('📋 Creating booking request for vehicle ID:', bookingData.vehicleId);
      const response = await apiClient.post('/api/booking-bikes/create', requestPayload);
      console.log('✅ Booking created successfully:', response.data);
      return response.data;

    } catch (error) {
      console.error('❌ Booking creation error:', error);
      
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

   checkDocumentVerification: async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const tokenKey = STORAGE_KEYS.TOKEN;
      const token = localStorage.getItem(tokenKey);
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await apiClient.get(`/api/documents/${userId}`);
      console.log('📄 Document verification response:', response.data);

      const documents = response.data;
      
      if (!documents) {
        return {
          verified: false,
          uploaded: false,
          pending: false,
          rejected: false,
          message: 'No documents uploaded'
        };
      }

      // Backend values: 0=PENDING, 1=VERIFIED, 2=REJECTED
      const adhaarFrontVerified = documents.isAdhaarFrontVerified === 1;
      const adhaarBackVerified = documents.isAdhaarBackVerified === 1;
      const licenseVerified = documents.isLicenseVerified === 1;

      const adhaarFrontPending = documents.isAdhaarFrontVerified === 0;
      const adhaarBackPending = documents.isAdhaarBackVerified === 0;
      const licensePending = documents.isLicenseVerified === 0;

      const adhaarFrontRejected = documents.isAdhaarFrontVerified === 2;
      const adhaarBackRejected = documents.isAdhaarBackVerified === 2;
      const licenseRejected = documents.isLicenseVerified === 2;

      const adhaarFrontUploaded = documents.adhaarFrontImage && documents.adhaarFrontImage.trim() !== '';
      const adhaarBackUploaded = documents.adhaarBackImage && documents.adhaarBackImage.trim() !== '';
      const licenseUploaded = documents.drivingLicenseImage && documents.drivingLicenseImage.trim() !== '';

      const allUploaded = adhaarFrontUploaded && adhaarBackUploaded && licenseUploaded;
      const isVerified = adhaarFrontVerified && adhaarBackVerified && licenseVerified;
      const isPending = adhaarFrontPending || adhaarBackPending || licensePending;
      const isRejected = adhaarFrontRejected || adhaarBackRejected || licenseRejected;

      return {
        verified: isVerified,
        uploaded: allUploaded,
        pending: isPending,
        rejected: isRejected,
        documents: documents,
        message: isVerified ? 'All documents verified' : 
                 isRejected ? 'Some documents rejected' : 
                 isPending ? 'Documents pending verification' : 
                 !allUploaded ? 'Upload all required documents' :
                 'Documents not verified'
      };

    } catch (error) {
      console.error('❌ Document verification check error:', error);
      
      if (error.response?.status === 404) {
        return {
          verified: false,
          uploaded: false,
          pending: false,
          rejected: false,
          message: 'No documents uploaded'
        };
      }

      throw error;
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
