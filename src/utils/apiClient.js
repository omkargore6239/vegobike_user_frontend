import axios from 'axios';
import { 
  API_ENDPOINTS, 
  STORAGE_KEYS, 
  HTTP_STATUS, 
  ERROR_MESSAGES,
  APP_CONFIG 
} from './constants';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: APP_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a notification function (you can replace this with your toast library)
const showNotification = (message, type = 'error') => {
  // Replace with your notification library (react-hot-toast, react-toastify, etc.)
  console[type](`[${type.toUpperCase()}]`, message);
  
  // Example with react-hot-toast:
  // import toast from 'react-hot-toast';
  // if (type === 'error') toast.error(message);
  // else if (type === 'success') toast.success(message);
  // else toast(message);
};

// Request Interceptor - Runs before every request
apiClient.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage using constant
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    // Add token to headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp for request tracking
    config.metadata = { startTime: new Date() };
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log request details in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        id: config.headers['X-Request-ID'],
        method: config.method?.toUpperCase(),
        url: config.url,
        headers: config.headers,
        data: config.data,
        timestamp: new Date().toISOString(),
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request setup error:', error);
    showNotification(ERROR_MESSAGES.NETWORK_ERROR, 'error');
    return Promise.reject(error);
  }
);

// Response Interceptor - Runs after every response
apiClient.interceptors.response.use(
  (response) => {
    // Calculate response time
    const responseTime = new Date() - response.config.metadata.startTime;
    
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        id: response.config.headers['X-Request-ID'],
        status: response.status,
        url: response.config.url,
        responseTime: `${responseTime}ms`,
        data: response.data,
        timestamp: new Date().toISOString(),
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle different types of errors
    if (error.response) {
      const { status, data } = error.response;
      
      console.error('❌ API Error:', {
        id: originalRequest?.headers?.['X-Request-ID'],
        status,
        message: data?.message || 'Unknown error',
        url: error.config?.url,
        timestamp: new Date().toISOString(),
      });
      
      // Handle specific status codes using constants
      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          console.log('🔐 Unauthorized access - clearing auth data');
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          
          // Only redirect if we're not already on auth pages
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
            showNotification(ERROR_MESSAGES.UNAUTHORIZED, 'error');
            setTimeout(() => {
              window.location.href = '/login';
            }, 1000);
          }
          break;
          
        case HTTP_STATUS.FORBIDDEN:
          console.log('🚫 Access forbidden');
          showNotification(ERROR_MESSAGES.FORBIDDEN, 'error');
          break;
          
        case HTTP_STATUS.NOT_FOUND:
          console.log('🔍 Resource not found');
          showNotification(ERROR_MESSAGES.NOT_FOUND, 'error');
          break;
          
        case HTTP_STATUS.CONFLICT:
          console.log('⚠️ Data conflict');
          showNotification(data?.message || 'Data conflict occurred', 'error');
          break;
          
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          console.log('💥 Server error');
          showNotification(ERROR_MESSAGES.SERVER_ERROR, 'error');
          break;
          
        case HTTP_STATUS.BAD_GATEWAY:
        case HTTP_STATUS.SERVICE_UNAVAILABLE:
          console.log('🔧 Service unavailable');
          showNotification('Service temporarily unavailable. Please try again later.', 'error');
          break;
          
        default:
          console.log(`⚠️ HTTP ${status} error`);
          showNotification(data?.message || ERROR_MESSAGES.NETWORK_ERROR, 'error');
      }
    } else if (error.request) {
      // Request was made but no response received (network error)
      console.error('🌐 Network error:', error.message);
      showNotification(ERROR_MESSAGES.NETWORK_ERROR, 'error');
    } else {
      // Something else happened in setting up the request
      console.error('⚡ Request configuration error:', error.message);
      showNotification('Request configuration error', 'error');
    }
    
    return Promise.reject(error);
  }
);

// Multipart form data client (for file uploads)
const apiClientMultipart = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: APP_CONFIG.API_TIMEOUT * 2, // Double timeout for file uploads
});

// Add the same interceptors to multipart client
apiClientMultipart.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for multipart, let browser set it
    delete config.headers['Content-Type'];
    
    // Add request tracking
    config.metadata = { startTime: new Date() };
    config.headers['X-Request-ID'] = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (import.meta.env.DEV) {
      console.log('📤 File Upload Request:', {
        id: config.headers['X-Request-ID'],
        method: config.method?.toUpperCase(),
        url: config.url,
        timestamp: new Date().toISOString(),
      });
    }
    
    return config;
  },
  (error) => {
    showNotification(ERROR_MESSAGES.NETWORK_ERROR, 'error');
    return Promise.reject(error);
  }
);

apiClientMultipart.interceptors.response.use(
  (response) => {
    const responseTime = new Date() - response.config.metadata.startTime;
    
    if (import.meta.env.DEV) {
      console.log('✅ File Upload Response:', {
        id: response.config.headers['X-Request-ID'],
        status: response.status,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      });
    }
    
    return response;
  },
  (error) => {
    // Same error handling as regular client
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        showNotification(ERROR_MESSAGES.UNAUTHORIZED, 'error');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    } else {
      showNotification(error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR, 'error');
    }
    return Promise.reject(error);
  }
);

// Helper function to create API calls with consistent error handling
export const createApiCall = (method, url, options = {}) => {
  return async (data = null, config = {}) => {
    try {
      const response = await apiClient[method](url, data, { ...options, ...config });
      return { success: true, data: response.data, response };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR,
        status: error.response?.status 
      };
    }
  };
};

export { apiClient, apiClientMultipart, showNotification };
