// =================================
// STORAGE KEYS
// =================================
export const STORAGE_KEYS = {
  USER: 'vegobike_user',
  TOKEN: 'vegobike_token',
  CART: 'vegobike_cart',
  RENTAL_CART: 'vegobike_rental_cart',
  SERVICING_CART: 'vegobike_servicing_cart',
  SPAREPARTS_CART: 'vegobike_spareparts_cart',
  THEME: 'vegobike_theme',
  LANGUAGE: 'vegobike_language',
  LAST_VISIT: 'vegobike_last_visit',
};

// Legacy support (keep for backward compatibility)
export const USER_STORAGE_KEY = STORAGE_KEYS.USER;
export const CART_STORAGE_KEY = STORAGE_KEYS.CART;
export const TOKEN_STORAGE_KEY = STORAGE_KEYS.TOKEN;

// =================================
// ROUTES
// =================================
export const ROUTES = {
  // Main Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  
  // Module Routes
  RENTAL: '/rental',
  SERVICING: '/servicing',
  SPAREPARTS: '/spareparts',
  BUYSELL: '/buysell',
  
  // Rental Sub-routes
  RENTAL_HOME: '/rental',
  RENTAL_SEARCH: '/search',
  RENTAL_BIKES: '/bikes',
  RENTAL_BOOKING: '/rental/booking',
  RENTAL_MY_BOOKINGS: '/rental/my-bookings',
  
  // Servicing Sub-routes
  SERVICING_HOME: '/servicing',
  SERVICING_HOMEPAGE: '/servicing/home',
  SERVICING_SERVICES: '/servicing/services',
  SERVICING_PROFILE: '/servicing/profile',
  SERVICING_CART: '/servicing/cart',
  SERVICING_CHECKOUT: '/servicing/checkout',
  SERVICING_PACKAGES: '/servicing/service-packages',
  
  // Spareparts Sub-routes
  SPAREPARTS_HOME: '/spareparts',
  SPAREPARTS_PART_DETAILS: '/spareparts/part',
  SPAREPARTS_CHECKOUT: '/spareparts/checkout',
  SPAREPARTS_ORDERS: '/spareparts/orders',
  
  // BuySell Sub-routes
  BUYSELL_HOME: '/buysell',
  BUYSELL_POST: '/buysell/post',
  BUYSELL_LISTING: '/buysell/listing',
  BUYSELL_MY_LISTINGS: '/buysell/my-listings',
  
  // Static Pages
  TERMS: '/servicing/terms',
  REFUND_POLICY: '/servicing/refund',
  PRIVACY_POLICY: '/privacy',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
};

// =================================
// MODULES
// =================================
export const MODULES = {
  RENTAL: 'rental',
  SERVICING: 'servicing',
  SPAREPARTS: 'spareparts',
  BUYSELL: 'buysell',
  AUTH: 'auth',
  USER: 'user',
};

// =================================
// USER ROLES
// =================================
export const USER_ROLES = {
  ADMIN: 1,
  STORE_MANAGER: 2,
  USER: 3,
};

export const ROLE_NAMES = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.STORE_MANAGER]: 'Store Manager',
  [USER_ROLES.USER]: 'User',
};

// =================================
// API ENDPOINTS
// =================================
export const API_ENDPOINTS = {
  // Base
  BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:8080',
  
  // Authentication
  AUTH: {
    HEALTH: '/api/auth/health',
    TEST: '/api/auth/test',
    SEND_LOGIN_OTP: '/api/auth/send-login-otp',
    VERIFY_LOGIN_OTP: '/api/auth/verify-login-otp',
    SEND_REGISTRATION_OTP: '/api/auth/send-registration-otp',
    VERIFY_REGISTRATION_OTP: '/api/auth/verify-registration-otp',
    ADMIN_LOGIN: '/api/auth/admin/login',
    STORE_MANAGER_LOGIN: '/api/auth/store-manager/login',
    ADMIN_REGISTER: '/api/auth/admin/register',
    VERIFY_TOKEN: '/api/auth/verify-token',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh-token',
  },
  
  // User Management
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
    CHANGE_PASSWORD: '/api/user/change-password',
    UPLOAD_AVATAR: '/api/user/avatar',
    DELETE_ACCOUNT: '/api/user/delete',
  },
  
  // Rental
  RENTAL: {
    BIKES: '/api/rental/bikes',
    BIKE_DETAILS: '/api/rental/bikes/{id}',
    SEARCH: '/api/rental/search',
    BOOK: '/api/rental/book',
    BOOKINGS: '/api/rental/bookings',
    CANCEL_BOOKING: '/api/rental/bookings/{id}/cancel',
    EXTEND_BOOKING: '/api/rental/bookings/{id}/extend',
    CATEGORIES: '/api/rental/categories',
    LOCATIONS: '/api/rental/locations',
  },
  
  // Servicing
  SERVICING: {
    SERVICES: '/api/servicing/services',
    PACKAGES: '/api/servicing/packages',
    BOOK_SERVICE: '/api/servicing/book',
    SERVICE_HISTORY: '/api/servicing/history',
    CANCEL_SERVICE: '/api/servicing/{id}/cancel',
    RESCHEDULE_SERVICE: '/api/servicing/{id}/reschedule',
  },
  
  // Spareparts
  SPAREPARTS: {
    PARTS: '/api/spareparts/parts',
    PART_DETAILS: '/api/spareparts/parts/{id}',
    CATEGORIES: '/api/spareparts/categories',
    BRANDS: '/api/spareparts/brands',
    SEARCH: '/api/spareparts/search',
    ORDER: '/api/spareparts/order',
    ORDERS: '/api/spareparts/orders',
    CART: '/api/spareparts/cart',
  },
  
  // Buy & Sell
  BUYSELL: {
    LISTINGS: '/api/buysell/listings',
    LISTING_DETAILS: '/api/buysell/listings/{id}',
    POST_LISTING: '/api/buysell/listings',
    MY_LISTINGS: '/api/buysell/my-listings',
    UPDATE_LISTING: '/api/buysell/listings/{id}',
    DELETE_LISTING: '/api/buysell/listings/{id}',
    SEARCH: '/api/buysell/search',
    FEATURED: '/api/buysell/featured',
  },
  
  // Admin
  ADMIN: {
    USERS: '/api/admin/users',
    STORE_MANAGERS: '/api/auth/store-managers',
    ANALYTICS: '/api/admin/analytics',
    REPORTS: '/api/admin/reports',
    SETTINGS: '/api/admin/settings',
  },
};

// =================================
// HTTP STATUS CODES
// =================================
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// =================================
// APP CONFIGURATION
// =================================
export const APP_CONFIG = {
  NAME: 'VegoBike',
  VERSION: '1.0.0',
  DESCRIPTION: 'Complete bike rental, servicing, and marketplace solution',
  AUTHOR: 'VegoBike Team',
  
  // Timeouts
  API_TIMEOUT: 15000, // 15 seconds
  OTP_RESEND_TIMEOUT: 30, // 30 seconds
  SESSION_TIMEOUT: 86400000, // 24 hours in milliseconds
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // File Upload
  MAX_FILE_SIZE: 5242880, // 5MB in bytes
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
};

// =================================
// FORM VALIDATION
// =================================
export const VALIDATION = {
  // Phone number
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  
  // Password
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  
  // Name
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  
  // OTP
  OTP_LENGTH: 4,
  OTP_EXPIRY: 300, // 5 minutes in seconds
  
  // Text areas
  DESCRIPTION_MAX_LENGTH: 1000,
  ADDRESS_MAX_LENGTH: 200,
  
  // Email regex
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s-()]+$/,
};

// =================================
// UI CONSTANTS
// =================================
export const UI = {
  // Themes
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
  },
  
  // Breakpoints (Tailwind CSS)
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
  
  // Animation durations
  ANIMATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
  },
  
  // Z-index layers
  Z_INDEX: {
    DROPDOWN: 1000,
    MODAL: 1050,
    POPOVER: 1100,
    TOOLTIP: 1150,
    TOAST: 1200,
  },
};

// =================================
// BUSINESS LOGIC CONSTANTS
// =================================
export const BUSINESS = {
  // Rental
  RENTAL: {
    MIN_RENTAL_HOURS: 1,
    MAX_RENTAL_DAYS: 30,
    CANCELLATION_WINDOW: 2, // hours before start time
    LATE_RETURN_GRACE_PERIOD: 15, // minutes
  },
  
  // Servicing
  SERVICING: {
    BOOKING_ADVANCE_DAYS: 30,
    CANCELLATION_WINDOW: 24, // hours
    SERVICE_TYPES: ['BASIC', 'PREMIUM', 'CUSTOM'],
  },
  
  // Payment
  PAYMENT: {
    CURRENCIES: ['INR', 'USD', 'EUR'],
    DEFAULT_CURRENCY: 'INR',
    PAYMENT_METHODS: ['CARD', 'UPI', 'NET_BANKING', 'WALLET'],
  },
};

// =================================
// ERROR MESSAGES
// =================================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a supported file.',
};

// =================================
// SUCCESS MESSAGES
// =================================
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTRATION_SUCCESS: 'Registration completed successfully!',
  OTP_SENT: 'OTP sent successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  BOOKING_CONFIRMED: 'Booking confirmed successfully!',
  SERVICE_BOOKED: 'Service booked successfully!',
  ORDER_PLACED: 'Order placed successfully!',
  LISTING_POSTED: 'Listing posted successfully!',
  CHANGES_SAVED: 'Changes saved successfully!',
};

// =================================
// NOTIFICATION TYPES
// =================================
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// =================================
// LOCAL STORAGE EXPIRY
// =================================
export const CACHE_DURATION = {
  SHORT: 300000, // 5 minutes
  MEDIUM: 1800000, // 30 minutes
  LONG: 3600000, // 1 hour
  VERY_LONG: 86400000, // 24 hours
};

// =================================
// FEATURE FLAGS
// =================================
export const FEATURES = {
  DARK_MODE: true,
  NOTIFICATIONS: true,
  ANALYTICS: true,
  CHAT_SUPPORT: false,
  REFERRAL_PROGRAM: false,
  SOCIAL_LOGIN: false,
  MULTI_LANGUAGE: false,
};

// Freeze objects to prevent accidental modifications
Object.freeze(STORAGE_KEYS);
Object.freeze(ROUTES);
Object.freeze(MODULES);
Object.freeze(USER_ROLES);
Object.freeze(ROLE_NAMES);
Object.freeze(API_ENDPOINTS);
Object.freeze(HTTP_STATUS);
Object.freeze(APP_CONFIG);
Object.freeze(VALIDATION);
Object.freeze(UI);
Object.freeze(BUSINESS);
Object.freeze(ERROR_MESSAGES);
Object.freeze(SUCCESS_MESSAGES);
Object.freeze(NOTIFICATION_TYPES);
Object.freeze(CACHE_DURATION);
Object.freeze(FEATURES);
