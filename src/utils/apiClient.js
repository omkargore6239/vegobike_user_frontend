// utils/apiClient.js - Fixed version with proper exports
import axios from 'axios';
import { 
  API_ENDPOINTS, 
  STORAGE_KEYS, 
  HTTP_STATUS, 
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  APP_CONFIG,
  ENV
} from './constants';

// =================================
// NOTIFICATION TYPES (Define here to avoid circular imports)
// =================================
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading',
};

// =================================
// NOTIFICATION SYSTEM
// =================================
export const showNotification = (message, type = NOTIFICATION_TYPES.ERROR, duration = 4000) => {
  // For development - console logging
  if (ENV.IS_DEVELOPMENT) {
    const emoji = {
      [NOTIFICATION_TYPES.SUCCESS]: '✅',
      [NOTIFICATION_TYPES.ERROR]: '❌',
      [NOTIFICATION_TYPES.WARNING]: '⚠️',
      [NOTIFICATION_TYPES.INFO]: 'ℹ️',
      [NOTIFICATION_TYPES.LOADING]: '⏳'
    };
    console[type === NOTIFICATION_TYPES.ERROR ? 'error' : 'log'](
      `${emoji[type]} [${type.toUpperCase()}]`, 
      message
    );
  }
  
  // For now, creating custom browser notifications for errors only
  if ('Notification' in window && Notification.permission === 'granted' && type === NOTIFICATION_TYPES.ERROR) {
    new Notification('VegoBike Error', {
      body: message,
      icon: '/favicon.ico',
      tag: 'vegobike-error'
    });
  }
};

// =================================
// CREATE AXIOS INSTANCES
// =================================

// Main API Client
const apiClient = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: APP_CONFIG.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': APP_CONFIG.VERSION,
    'X-Client-Type': 'web'
  },
});

// Multipart form data client (for file uploads)
const apiClientMultipart = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: APP_CONFIG.FILE_UPLOAD_TIMEOUT || APP_CONFIG.API_TIMEOUT * 2,
  headers: {
    'Accept': 'application/json',
    'X-Client-Version': APP_CONFIG.VERSION,
    'X-Client-Type': 'web'
  },
});

// =================================
// UTILITY FUNCTIONS
// =================================

// Generate request ID for tracking
const generateRequestId = (prefix = 'req') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Check if we're on auth pages
const isAuthPage = () => {
  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  return authPaths.some(path => window.location.pathname.includes(path));
};

// Clear auth data
export const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.PENDING_BOOKING);
  localStorage.removeItem(STORAGE_KEYS.BOOKING_STEP);
};

// Redirect to login
export const redirectToLogin = (message = ERROR_MESSAGES.UNAUTHORIZED, delay = 1000) => {
  if (!isAuthPage()) {
    showNotification(message, NOTIFICATION_TYPES.ERROR);
    setTimeout(() => {
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
      window.location.href = loginUrl;
    }, delay);
  }
};

// Handle specific error responses
const handleErrorResponse = (error) => {
  const { status, data } = error.response;
  const errorMessage = data?.message || data?.error || ERROR_MESSAGES.UNKNOWN_ERROR;
  
  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
      console.log('🔐 Unauthorized access - clearing auth data');
      clearAuthData();
      redirectToLogin(errorMessage);
      break;
      
    case HTTP_STATUS.FORBIDDEN:
      console.log('🚫 Access forbidden');
      showNotification(errorMessage || ERROR_MESSAGES.FORBIDDEN, NOTIFICATION_TYPES.ERROR);
      break;
      
    case HTTP_STATUS.NOT_FOUND:
      console.log('🔍 Resource not found');
      showNotification(errorMessage || ERROR_MESSAGES.NOT_FOUND, NOTIFICATION_TYPES.WARNING);
      break;
      
    case HTTP_STATUS.CONFLICT:
      console.log('⚠️ Data conflict');
      showNotification(errorMessage || ERROR_MESSAGES.ALREADY_EXISTS, NOTIFICATION_TYPES.WARNING);
      break;
      
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      console.log('📝 Validation error');
      showNotification(errorMessage || ERROR_MESSAGES.VALIDATION_ERROR, NOTIFICATION_TYPES.WARNING);
      break;
      
    case HTTP_STATUS.TOO_MANY_REQUESTS:
      console.log('🚫 Rate limited');
      showNotification('Too many requests. Please try again later.', NOTIFICATION_TYPES.WARNING);
      break;
      
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      console.log('💥 Internal server error');
      showNotification(ERROR_MESSAGES.SERVER_ERROR, NOTIFICATION_TYPES.ERROR);
      break;
      
    case HTTP_STATUS.BAD_GATEWAY:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
    case HTTP_STATUS.GATEWAY_TIMEOUT:
      console.log('🔧 Service unavailable');
      showNotification(ERROR_MESSAGES.SERVICE_UNAVAILABLE, NOTIFICATION_TYPES.ERROR);
      break;
      
    default:
      console.log(`⚠️ HTTP ${status} error`);
      showNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
  }
  
  return errorMessage;
};

// =================================
// REQUEST INTERCEPTORS
// =================================

// Main API Client Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get auth token
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    // Add authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request metadata
    config.metadata = { startTime: new Date() };
    config.headers['X-Request-ID'] = generateRequestId();
    
    // Add user agent info if available
    if (navigator.userAgent) {
      config.headers['X-User-Agent'] = navigator.userAgent;
    }
    
    // Log request in development
    if (ENV.IS_DEVELOPMENT && APP_CONFIG.ENABLE_LOGGING) {
      console.log('🚀 API Request:', {
        id: config.headers['X-Request-ID'],
        method: config.method?.toUpperCase(),
        url: config.url,
        hasToken: !!token,
        headers: config.headers,
        data: config.data,
        timestamp: new Date().toISOString(),
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request setup error:', error);
    showNotification(ERROR_MESSAGES.NETWORK_ERROR, NOTIFICATION_TYPES.ERROR);
    return Promise.reject(error);
  }
);

// Multipart Client Request Interceptor
apiClientMultipart.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for multipart, let browser handle it
    delete config.headers['Content-Type'];
    
    // Add request metadata
    config.metadata = { startTime: new Date() };
    config.headers['X-Request-ID'] = generateRequestId('upload');
    
    if (ENV.IS_DEVELOPMENT && APP_CONFIG.ENABLE_LOGGING) {
      console.log('📤 File Upload Request:', {
        id: config.headers['X-Request-ID'],
        method: config.method?.toUpperCase(),
        url: config.url,
        hasToken: !!token,
        timestamp: new Date().toISOString(),
      });
    }
    
    return config;
  },
  (error) => {
    showNotification(ERROR_MESSAGES.UPLOAD_FAILED, NOTIFICATION_TYPES.ERROR);
    return Promise.reject(error);
  }
);

// =================================
// RESPONSE INTERCEPTORS
// =================================

// Main API Client Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Calculate response time
    const responseTime = new Date() - response.config.metadata.startTime;
    
    // Log successful responses in development
    if (ENV.IS_DEVELOPMENT && APP_CONFIG.ENABLE_LOGGING) {
      console.log('✅ API Response:', {
        id: response.config.headers['X-Request-ID'],
        status: response.status,
        url: response.config.url,
        responseTime: `${responseTime}ms`,
        data: response.data,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Show success message for specific endpoints
    if (response.config.showSuccessMessage && response.data?.message) {
      showNotification(response.data.message, NOTIFICATION_TYPES.SUCCESS);
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const responseTime = originalRequest?.metadata ? 
      new Date() - originalRequest.metadata.startTime : 0;
    
    // Log error details
    if (ENV.IS_DEVELOPMENT) {
      console.error('❌ API Error:', {
        id: originalRequest?.headers?.['X-Request-ID'],
        method: originalRequest?.method?.toUpperCase(),
        url: originalRequest?.url,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
        stack: error.stack,
      });
    }
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      handleErrorResponse(error);
    } else if (error.request) {
      // Request was made but no response received
      console.error('🌐 Network error:', error.message);
      showNotification(ERROR_MESSAGES.NETWORK_ERROR, NOTIFICATION_TYPES.ERROR);
    } else {
      // Something else happened
      console.error('⚡ Request configuration error:', error.message);
      showNotification(ERROR_MESSAGES.UNKNOWN_ERROR, NOTIFICATION_TYPES.ERROR);
    }
    
    return Promise.reject(error);
  }
);

// Multipart Client Response Interceptor
apiClientMultipart.interceptors.response.use(
  (response) => {
    const responseTime = new Date() - response.config.metadata.startTime;
    
    if (ENV.IS_DEVELOPMENT && APP_CONFIG.ENABLE_LOGGING) {
      console.log('✅ File Upload Response:', {
        id: response.config.headers['X-Request-ID'],
        status: response.status,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Show success message for uploads
    if (response.data?.message) {
      showNotification(response.data.message, NOTIFICATION_TYPES.SUCCESS);
    }
    
    return response;
  },
  (error) => {
    // Handle upload-specific errors
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      clearAuthData();
      redirectToLogin();
    } else if (error.response?.data?.message) {
      showNotification(error.response.data.message, NOTIFICATION_TYPES.ERROR);
    } else {
      showNotification(ERROR_MESSAGES.UPLOAD_FAILED, NOTIFICATION_TYPES.ERROR);
    }
    
    return Promise.reject(error);
  }
);

// =================================
// API HELPER FUNCTIONS
// =================================

// Create standardized API calls
export const createApiCall = (method, url, options = {}) => {
  return async (data = null, config = {}) => {
    try {
      const client = options.isMultipart ? apiClientMultipart : apiClient;
      const response = await client[method](url, data, { 
        ...options, 
        ...config,
        showSuccessMessage: options.showSuccessMessage || false
      });
      
      return { 
        success: true, 
        data: response.data, 
        response,
        status: response.status 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || ERROR_MESSAGES.NETWORK_ERROR,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  };
};

// Specific API methods
export const api = {
  // GET requests
  get: (url, config = {}) => createApiCall('get', url, config)(null, config),
  
  // POST requests
  post: (url, data, config = {}) => createApiCall('post', url, config)(data, config),
  
  // PUT requests
  put: (url, data, config = {}) => createApiCall('put', url, config)(data, config),
  
  // PATCH requests
  patch: (url, data, config = {}) => createApiCall('patch', url, config)(data, config),
  
  // DELETE requests
  delete: (url, config = {}) => createApiCall('delete', url, config)(null, config),
  
  // File upload
  upload: (url, formData, config = {}) => createApiCall('post', url, { 
    ...config, 
    isMultipart: true 
  })(formData, config),
};

// Health check function
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.HEALTH, { 
      timeout: 5000,
      silent: true 
    });
    return { healthy: true, data: response.data };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
};

// Token refresh function (if you implement refresh tokens)
export const refreshAuthToken = async () => {
  try {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken
    }, { silent: true });
    
    const { token, refreshToken: newRefreshToken } = response.data;
    
    // Update stored tokens
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    if (newRefreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
    }
    
    return { success: true, token };
  } catch (error) {
    clearAuthData();
    redirectToLogin(ERROR_MESSAGES.SESSION_EXPIRED);
    return { success: false, error: error.message };
  }
};

// =================================
// EXPORT MAIN CLIENTS
// =================================
export { 
  apiClient, 
  apiClientMultipart
};

// Default export for convenience
export default apiClient;
