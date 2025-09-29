import axios from 'axios';

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8081';

console.log('🔗 API Base URL:', API_BASE_URL);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add request interceptor to include auth token if needed
apiClient.interceptors.request.use(
  (config) => {
    console.log('📤 Making API request to:', config.baseURL + config.url);
    console.log('📤 Request params:', config.params);
    
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('📤 Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 API response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('📥 API response error:', error.response?.status, error.config?.url, error.message);
    
    // Log more detailed error information
    if (error.response) {
      console.error('📥 Response data:', error.response.data);
      console.error('📥 Response headers:', error.response.headers);
    }
    
    return Promise.reject(error);
  }
);

export const bookingService = {
  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      console.log('🚀 Creating booking with data:', bookingData);
      
      // Validate required fields before sending
      if (!bookingData.finalAmount || bookingData.finalAmount <= 0) {
        throw new Error('Final amount must be greater than 0');
      }
      if (!bookingData.startDate) {
        throw new Error('Start date is required');
      }
      if (!bookingData.endDate) {
        throw new Error('End date is required');
      }
      
      const response = await apiClient.post('/api/booking-bikes/create', bookingData);
      console.log('✅ Booking created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating booking:', error);
      
      // Provide more specific error messages
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data || 'Unknown server error';
        
        if (status === 400) {
          throw new Error(`Validation Error: ${message}`);
        } else if (status === 500) {
          throw new Error(`Server Error: ${message}`);
        } else {
          throw new Error(`HTTP ${status}: ${message}`);
        }
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to server');
      } else {
        throw error;
      }
    }
  },

  // Get all bookings for the user (legacy - kept for backwards compatibility)
  getAllBookings: async () => {
    try {
      console.log('📋 Fetching all bookings...');
      const response = await apiClient.get('/api/booking-bikes/allBooking');
      console.log('✅ Bookings fetched successfully:', response.data?.length || 0, 'bookings');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      throw error;
    }
  },

  // NEW: Get bookings by customer with pagination and sorting
  getBookingsByCustomer: async (customerId, options = {}) => {
    try {
      const {
        page = 0,
        size = 10,
        sortBy = 'latest'
      } = options;

      console.log(`📋 Fetching bookings for customer ${customerId} - page: ${page}, size: ${size}, sortBy: ${sortBy}`);
      
      const params = {
        customerId,
        page,
        size,
        sortBy
      };

      const response = await apiClient.get('/api/booking-bikes/by-customer', { params });
      console.log('✅ Customer bookings fetched successfully:', response.data?.length || 0, 'bookings');
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching customer bookings:', error);
      throw error;
    }
  },

  // Get booking by ID
  getBookingById: async (id) => {
    try {
      console.log('🔍 Fetching booking by ID:', id);
      const response = await apiClient.get(`/api/booking-bikes/getById/${id}`);
      console.log('✅ Booking fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching booking:', error);
      throw error;
    }
  },

  // Accept booking
  acceptBooking: async (bookingId) => {
    try {
      console.log('✅ Accepting booking:', bookingId);
      const response = await apiClient.post(`/api/booking-bikes/${bookingId}/accept`);
      console.log('✅ Booking accepted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error accepting booking:', error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (bookingId, cancelledBy = 'USER') => {
    try {
      console.log('❌ Cancelling booking:', bookingId, 'by:', cancelledBy);
      const response = await apiClient.post(`/api/booking-bikes/${bookingId}/cancel`, null, {
        params: { cancelledBy }
      });
      console.log('✅ Booking cancelled successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error cancelling booking:', error);
      throw error;
    }
  },

  // Complete booking
  completeBooking: async (bookingId) => {
    try {
      console.log('🏁 Completing booking:', bookingId);
      const response = await apiClient.post(`/api/booking-bikes/${bookingId}/complete`);
      console.log('✅ Booking completed successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error completing booking:', error);
      throw error;
    }
  }
};
