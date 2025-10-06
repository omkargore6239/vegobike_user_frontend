// services/bookingService.js - FULLY UPDATED WITH VEHICLE DOCUMENTS
import axios from 'axios';


// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8081';


console.log('🔗 API Base URL:', API_BASE_URL);


// ✅ Consistent token keys
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user'
};

class BookingService {
  async createBooking(bookingData) {
    try {
      console.log('🚀 Creating booking with data:', bookingData);
      console.log('🔍 Payment Type being sent:', bookingData.paymentType);
      
      const response = await axios.post(
        `${API_BASE_URL}/booking/create`,
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // If using JWT
          }
        }
      );

      console.log('✅ Booking created:', response.data);
      console.log('🔍 Response paymentType:', response.data.paymentType);
      console.log('🔍 Response has razorpayOrderDetails:', !!response.data.razorpayOrderDetails);
      
      return response.data;
    } catch (error) {
      console.error('❌ Booking creation failed:', error);
      throw error;
    }
  }
}


// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});


// ✅ Request interceptor with JWT token
apiClient.interceptors.request.use(
  (config) => {
    console.log('📤 Making API request to:', config.baseURL + config.url);
    console.log('📤 Request method:', config.method?.toUpperCase());
    
    // ✅ Add JWT token from localStorage
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 JWT token attached to request');
    } else {
      console.warn('⚠️ No JWT token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('📤 Request interceptor error:', error);
    return Promise.reject(error);
  }
);


// ✅ Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 API response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('📥 API response error:', error.response?.status, error.config?.url, error.message);
    
    if (error.response) {
      console.error('📥 Response data:', error.response.data);
      console.error('📥 Response headers:', error.response.headers);
      
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        console.error('🔐 Authentication failed - redirecting to login');
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);


export const bookingService = {
  // ✅ Create booking with JSON body
  createBooking: async (bookingData) => {
    try {
      console.log('🚀 Creating booking with data:', bookingData);
      
      // Check if user is authenticated
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) {
        throw new Error('Authentication required. Please login first.');
      }
      
      // ✅ Validate required fields
      if (!bookingData.vehicleId) {
        throw new Error('Vehicle ID is required');
      }
      if (!bookingData.startDate) {
        throw new Error('Start date is required');
      }
      if (!bookingData.endDate) {
        throw new Error('End date is required');
      }
      if (!bookingData.finalAmount || bookingData.finalAmount <= 0) {
        throw new Error('Final amount must be greater than 0');
      }
      
      // ✅ Create JSON payload
      const requestPayload = {
        vehicleId: parseInt(bookingData.vehicleId),
        customerId: parseInt(bookingData.customerId || 33),
        
        startDate: bookingData.startDate instanceof Date 
          ? bookingData.startDate.toISOString() 
          : new Date(bookingData.startDate).toISOString(),
        endDate: bookingData.endDate instanceof Date 
          ? bookingData.endDate.toISOString() 
          : new Date(bookingData.endDate).toISOString(),
        startDate1: bookingData.startDate instanceof Date 
          ? bookingData.startDate.toISOString().split('T')[0] 
          : bookingData.startDate,
        endDate1: bookingData.endDate instanceof Date 
          ? bookingData.endDate.toISOString().split('T')[0] 
          : bookingData.endDate,
        
        charges: parseFloat(bookingData.charges || bookingData.subtotal || 1000),
        finalAmount: parseFloat(bookingData.finalAmount),
        advanceAmount: parseFloat(bookingData.advanceAmount || bookingData.deposit || 1000),
        gst: parseFloat(bookingData.gst || 0),
        totalCharges: parseFloat(bookingData.totalCharges || bookingData.finalAmount),
        
        bookingStatus: 1,
        paymentStatus: bookingData.paymentStatus || 'PENDING',
        paymentType: bookingData.paymentType === 'online' ? 2 : 1,
        
        address: bookingData.address || bookingData.deliveryAddress || bookingData.storeName || 'N/A',
        addressType: bookingData.addressType || (bookingData.pickupMode === 'delivery' ? 'Delivery' : 'Self Pickup'),
        deliveryType: bookingData.deliveryType || (bookingData.pickupMode === 'delivery' ? 'Home Delivery' : null),
        pickupLocationId: parseInt(bookingData.pickupLocationId || 1),
        dropLocationId: parseInt(bookingData.dropLocationId || 1),
        
        totalHours: parseFloat(bookingData.totalHours || 0),
        additionalHours: parseFloat(bookingData.additionalHours || 0),
        additionalCharges: parseFloat(bookingData.additionalCharges || 0),
        additionalChargesDetails: bookingData.additionalChargesDetails || null,
        couponCode: bookingData.couponCode || null,
        couponId: parseInt(bookingData.couponId || 0),
        couponAmount: parseFloat(bookingData.couponAmount || 0),
        deliveryCharges: parseFloat(bookingData.deliveryCharges || 0),
        km: parseFloat(bookingData.km || 0),
        lateFeeCharges: parseInt(bookingData.lateFeeCharges || 0),
        lateEndDate: bookingData.lateEndDate || null,
        merchantTransactionId: bookingData.merchantTransactionId || null,
        transactionId: bookingData.transactionId || null,
      };
      
      console.log('📦 Request payload:', requestPayload);
      
      const response = await apiClient.post('/api/booking-bikes/create', requestPayload);
      
      console.log('✅ Booking created successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (errorData.errorCode === 'BOOKING_001') {
          throw new Error('You already have an active booking. Please complete or cancel it first.');
        } else if (errorData.errorCode === 'BOOKING_002') {
          throw new Error(errorData.message || 'Document verification failed. Please upload valid documents.');
        } else if (errorData.errorCode === 'BOOKING_003') {
          throw new Error(errorData.message || 'Invalid booking data. Please check all fields.');
        } else if (errorData.errorCode === 'BOOKING_999') {
          throw new Error('Failed to create booking. Please try again later.');
        } else if (status === 400) {
          throw new Error(errorData.message || 'Invalid request data');
        } else if (status === 401) {
          throw new Error('Authentication failed. Please login again.');
        } else if (status === 409) {
          throw new Error(errorData.message || 'Conflict: Booking already exists');
        } else if (status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(errorData.message || `HTTP ${status}: Unknown error`);
        }
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to server. Please check your connection.');
      } else {
        throw error;
      }
    }
  },


  // ✅ Get all bookings
  getAllBookings: async () => {
    try {
      console.log('📋 Fetching all bookings...');
      const response = await apiClient.get('/api/booking-bikes/allBooking');
      console.log('✅ Bookings fetched:', response.data?.length || 0, 'bookings');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  },


  // ✅ Get bookings by customer
  getBookingsByCustomer: async (customerId, options = {}) => {
    try {
      const { page = 0, size = 10, sortBy = 'latest' } = options;
      console.log(`📋 Fetching bookings for customer ${customerId}`);
      
      const params = { customerId, page, size, sortBy };
      const response = await apiClient.get('/api/booking-bikes/by-customer', { params });
      
      console.log('✅ Customer bookings fetched:', response.data?.length || 0);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching customer bookings:', error);
      throw new Error('Failed to fetch your bookings');
    }
  },


  // ✅ Get booking by ID
  getBookingById: async (id) => {
    try {
      console.log('🔍 Fetching booking by ID:', id);
      const response = await apiClient.get(`/api/booking-bikes/getById/${id}`);
      console.log('✅ Booking fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching booking:', error);
      throw new Error('Booking not found');
    }
  },


  // ✅ Accept booking
  acceptBooking: async (bookingId) => {
    try {
      console.log('✅ Accepting booking:', bookingId);
      const response = await apiClient.post(`/api/booking-bikes/${bookingId}/accept`);
      console.log('✅ Booking accepted');
      return response.data;
    } catch (error) {
      console.error('❌ Error accepting booking:', error);
      throw new Error('Failed to accept booking');
    }
  },


  // ✅ FIXED: Start Trip (with 4 images)
  startTrip: async (bookingId, images) => {
    try {
      console.log('🚗 START_TRIP - Booking:', bookingId, 'Images:', images.length);


      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append('images', image);
        console.log(`📷 Image ${index + 1}:`, image.name, image.size);
      });


      // ✅ Use apiClient instead of api
      const response = await apiClient.post(
        `/api/booking-bikes/${bookingId}/start`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );


      console.log('✅ START_TRIP - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('💥 START_TRIP - Error:', error.response?.data || error.message);
      throw error;
    }
  },


  // ✅ FIXED: End Trip (with 4 images)
  endTrip: async (bookingId, images) => {
    try {
      console.log('🏁 END_TRIP - Booking:', bookingId, 'Images:', images.length);


      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append('images', image);
        console.log(`📷 Image ${index + 1}:`, image.name, image.size);
      });


      // ✅ Use apiClient instead of api
      const response = await apiClient.post(
        `/api/booking-bikes/${bookingId}/end`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );


      console.log('✅ END_TRIP - Success:', response.data);
      return response.data;
    } catch (error) {
      console.error('💥 END_TRIP - Error:', error.response?.data || error.message);
      throw error;
    }
  },


  // ✅ NEW: Get Vehicle Documents
  getVehicleDocuments: async (vehicleId) => {
    try {
      console.log('📄 GET_VEHICLE_DOCUMENTS - Vehicle ID:', vehicleId);
      
      // Validate vehicleId
      if (!vehicleId) {
        throw new Error('Vehicle ID is required');
      }
      
      const response = await apiClient.get(`/api/bikes/view-documents/${vehicleId}`);
      
      console.log('✅ GET_VEHICLE_DOCUMENTS - Success:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('💥 GET_VEHICLE_DOCUMENTS - Error:', error.response?.data || error.message);
      
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        if (status === 404) {
          throw new Error('Vehicle documents not found');
        } else if (status === 401) {
          throw new Error('Authentication required to view documents');
        } else if (status === 403) {
          throw new Error('You do not have permission to view these documents');
        } else if (status === 500) {
          throw new Error('Server error while fetching documents');
        } else {
          throw new Error(errorData.message || 'Failed to fetch vehicle documents');
        }
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to server');
      } else {
        throw error;
      }
    }
  },


  // ✅ Cancel booking
  cancelBooking: async (bookingId, cancelledBy = 'USER') => {
    try {
      console.log('❌ Cancelling booking:', bookingId);
      const response = await apiClient.post(
        `/api/booking-bikes/${bookingId}/cancel`,
        null,
        { params: { cancelledBy } }
      );
      console.log('✅ Booking cancelled');
      return response.data;
    } catch (error) {
      console.error('❌ Error cancelling booking:', error);
      throw new Error('Failed to cancel booking');
    }
  },


  // ✅ Complete booking
  completeBooking: async (bookingId) => {
    try {
      console.log('🏁 Completing booking:', bookingId);
      const response = await apiClient.post(`/api/booking-bikes/${bookingId}/complete`);
      console.log('✅ Booking completed');
      return response.data;
    } catch (error) {
      console.error('❌ Error completing booking:', error);
      throw new Error('Failed to complete booking');
    }
  },


  // ✅ Get invoice
  getInvoice: async (bookingId) => {
    try {
      console.log('📄 Fetching invoice for booking:', bookingId);
      const response = await apiClient.get(
        `/api/booking-bikes/${bookingId}/invoice`,
        { responseType: 'blob' }
      );
      console.log('✅ Invoice fetched');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching invoice:', error);
      throw new Error('Failed to fetch invoice');
    }
  }
};


export default bookingService;
