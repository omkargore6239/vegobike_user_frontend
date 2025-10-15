// utils/constants.js - Fully updated with Document Verification (2025)

// =================================
// STORAGE KEYS
// =================================
export const STORAGE_KEYS = {
  // Authentication
  TOKEN: 'auth_token',
  USER: 'user',
  REFRESH_TOKEN: 'refresh_token',
  
  // Booking & Application State
  PENDING_BOOKING: 'pending_booking',
  BOOKING_STEP: 'booking_step',
  RENTAL_SEARCH: 'rental_search_data',
  SELECTED_BIKE: 'selected_bike',
  CART: 'cart_items',
  
  // User Preferences
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
  LOCATION: 'user_location',
  
  // Cache Keys
  BIKES_CACHE: 'bikes_cache',
  LOCATIONS_CACHE: 'locations_cache',
  CATEGORIES_CACHE: 'categories_cache',
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
  DASHBOARD: '/dashboard',
  MYBOOKINGS: '/rental/mybookings',
  DOCUMENT_VERIFICATION: '/document-verification', // ✅ NEW
  
  // Module Routes
  RENTAL: '/rental',
  SERVICING: '/servicing',
  SPAREPARTS: '/spareparts',
  BUYSELL: '/buysell',
  
  // Rental Sub-routes
  RENTAL_HOME: '/rental',
  RENTAL_SEARCH: '/rental/search',
  RENTAL_BIKES: '/rental/bikes',
  RENTAL_BOOKING: '/rental/booking',
  RENTAL_MY_BOOKINGS: '/rental/my-bookings',
  RENTAL_HISTORY: '/rental/history',
  
  // Servicing Sub-routes
  SERVICING_HOME: '/servicing',
  SERVICING_SERVICES: '/servicing/services',
  SERVICING_PROFILE: '/servicing/profile',
  SERVICING_CART: '/servicing/cart',
  SERVICING_CHECKOUT: '/servicing/checkout',
  SERVICING_PACKAGES: '/servicing/service-packages',
  SERVICING_HISTORY: '/servicing/history',
  
  // Spareparts Sub-routes
  SPAREPARTS_HOME: '/spareparts',
  SPAREPARTS_PART_DETAILS: '/spareparts/part',
  SPAREPARTS_CHECKOUT: '/spareparts/checkout',
  SPAREPARTS_ORDERS: '/spareparts/orders',
  SPAREPARTS_CART: '/spareparts/cart',
  
  // BuySell Sub-routes
  BUYSELL_HOME: '/buysell',
  BUYSELL_POST: '/buysell/post',
  BUYSELL_LISTING: '/buysell/listing',
  BUYSELL_MY_LISTINGS: '/buysell/my-listings',
  BUYSELL_CATEGORIES: '/buysell/categories',
  
  // Admin Routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_STORE_MANAGERS: '/admin/store-managers',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Store Manager Routes
  STORE_MANAGER: '/store-manager',
  STORE_MANAGER_DASHBOARD: '/store-manager/dashboard',
  STORE_MANAGER_RENTALS: '/store-manager/rentals',
  STORE_MANAGER_INVENTORY: '/store-manager/inventory',
  
  // Static Pages
  TERMS: '/terms',
  PRIVACY_POLICY: '/privacy',
  REFUND_POLICY: '/refund',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  HELP: '/help',
};

// =================================
// BOOKING STEPS
// =================================
export const BOOKING_STEPS = {
  SEARCH: 'search',
  BIKES: 'bikes', 
  DETAILS: 'details',
  CHECKOUT: 'checkout',
  PAYMENT: 'payment',
  CONFIRMATION: 'confirmation',
  COMPLETED: 'completed'
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
  ADMIN: 'admin',
  STORE_MANAGER: 'store-manager',
  DOCUMENTS: 'documents', // ✅ NEW
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

export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: ['*'], // All permissions
  [USER_ROLES.STORE_MANAGER]: ['rental:manage', 'inventory:manage', 'bookings:manage'],
  [USER_ROLES.USER]: ['rental:book', 'profile:manage', 'orders:view', 'documents:upload']
};

// =================================
// API ENDPOINTS - UPDATED WITH DOCUMENT VERIFICATION
// =================================
export const API_ENDPOINTS = {
  // Base URL - Updated to match your backend port
  BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:8081',
  
  // ✅ UPDATED: Authentication Endpoints (Now includes profile management)
  AUTH: {
    HEALTH: '/api/auth/health',
    TEST: '/api/auth/test',
    
    // OTP Authentication
    SEND_LOGIN_OTP: '/api/auth/send-login-otp',
    VERIFY_LOGIN_OTP: '/api/auth/verify-login-otp',
    SEND_REGISTRATION_OTP: '/api/auth/send-registration-otp',
    VERIFY_REGISTRATION_OTP: '/api/auth/verify-registration-otp',
    
    // Admin & Store Manager Authentication
    ADMIN_LOGIN: '/api/auth/admin/login',
    STORE_MANAGER_LOGIN: '/api/auth/store-manager/login',
    ADMIN_REGISTER: '/api/auth/admin/register',
    
    // Token Management
    VERIFY_TOKEN: '/api/auth/verify-token',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    LOGOUT: '/api/auth/logout',
    
    // Profile Management
    PROFILE: '/api/auth/profile',
    UPDATE_PROFILE: '/api/auth/profile',
    CHANGE_PASSWORD: '/api/auth/change-password',
    
    // Debug (Development only)
    DEBUG_OTP: '/api/auth/debug/otp',
  },

  // ✅ UPDATED: Document Management - Matching Backend API
  DOCUMENTS: {
    BASE: '/api/documents',
    
    // Get user documents - GET /api/documents/{userId}
    GET_USER_DOCUMENTS: '/api/documents', // Will append /{userId}
    
    // Upload documents (JSON-based) - POST /api/documents/upload
    UPLOAD: '/api/documents/upload',
    
    // Upload documents (File-based MultipartFile) - POST /api/documents/upload-files
    UPLOAD_FILES: '/api/documents/upload-files',
    
    // Verify documents - PATCH /api/documents/verify/{userId}
    VERIFY: '/api/documents/verify', // Will append /{userId}
    
    // FormData parameter names (must match backend @RequestParam)
    PARAM_NAMES: {
      ADHAAR_FRONT: 'adhaarFront',
      ADHAAR_BACK: 'adhaarBack',
      DRIVING_LICENSE: 'drivingLicense',
      USER_ID: 'userId'
    }
  },
  
  // User Management
  USER: {
    // Profile management now uses AUTH endpoints
    PROFILE: '/api/auth/profile',
    UPDATE_PROFILE: '/api/auth/profile',
    CHANGE_PASSWORD: '/api/auth/change-password',
    
    // Admin-only user management endpoints
    PROFILE_BY_ID: '/api/user/profile/{userId}',
    UPDATE_PROFILE_BY_ID: '/api/user/profile/{userId}',
    UPLOAD_AVATAR: '/api/user/avatar',
    DELETE_ACCOUNT: '/api/user/delete',
    
    // User list endpoints (admin use)
    LIST_USERS: '/api/user/list',
    USER_DETAILS: '/api/user/{userId}',
    TOGGLE_USER_STATUS: '/api/user/{userId}/toggle-status',
  },
  
  // Rental Module
  RENTAL: {
    BIKES: '/api/rental/bikes',
    BIKE_DETAILS: '/api/rental/bikes/{id}',
    SEARCH: '/api/rental/search',
    BOOK: '/api/rental/book',
    BOOKINGS: '/api/rental/bookings',
    MY_BOOKINGS: '/api/rental/my-bookings',
    BOOKINGS_BY_CUSTOMER: '/api/booking-bikes/by-customer',
    CANCEL_BOOKING: '/api/rental/bookings/{id}/cancel',
    EXTEND_BOOKING: '/api/rental/bookings/{id}/extend',
    CATEGORIES: '/api/rental/categories',
    LOCATIONS: '/api/rental/locations',
    AVAILABILITY: '/api/rental/availability',
  },
  
  // Servicing Module
  SERVICING: {
    SERVICES: '/api/servicing/services',
    PACKAGES: '/api/servicing/packages',
    BOOK_SERVICE: '/api/servicing/book',
    SERVICE_HISTORY: '/api/servicing/history',
    MY_SERVICES: '/api/servicing/my-services',
    CANCEL_SERVICE: '/api/servicing/{id}/cancel',
    RESCHEDULE_SERVICE: '/api/servicing/{id}/reschedule',
    SERVICE_CENTERS: '/api/servicing/centers',
  },
  
  // Spareparts Module
  SPAREPARTS: {
    PARTS: '/api/spareparts/parts',
    PART_DETAILS: '/api/spareparts/parts/{id}',
    CATEGORIES: '/api/spareparts/categories',
    BRANDS: '/api/spareparts/brands',
    SEARCH: '/api/spareparts/search',
    ORDER: '/api/spareparts/order',
    ORDERS: '/api/spareparts/orders',
    MY_ORDERS: '/api/spareparts/my-orders',
    CART: '/api/spareparts/cart',
    ADD_TO_CART: '/api/spareparts/cart/add',
    REMOVE_FROM_CART: '/api/spareparts/cart/remove',
  },
  
  // Buy & Sell Module
  BUYSELL: {
    LISTINGS: '/api/buysell/listings',
    LISTING_DETAILS: '/api/buysell/listings/{id}',
    POST_LISTING: '/api/buysell/listings',
    MY_LISTINGS: '/api/buysell/my-listings',
    UPDATE_LISTING: '/api/buysell/listings/{id}',
    DELETE_LISTING: '/api/buysell/listings/{id}',
    SEARCH: '/api/buysell/search',
    FEATURED: '/api/buysell/featured',
    CATEGORIES: '/api/buysell/categories',
  },
  
  // Admin Endpoints
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    USERS: '/api/admin/users',
    ANALYTICS: '/api/admin/analytics',
    REPORTS: '/api/admin/reports',
    SETTINGS: '/api/admin/settings',
    SYSTEM_HEALTH: '/api/admin/health',
  },
  
  // File Upload
  UPLOAD: {
    IMAGE: '/api/upload/image',
    DOCUMENT: '/api/upload/document',
    AVATAR: '/api/upload/avatar',
    PROFILE_IMAGE: '/api/upload/profile-image',
  }
};

// =================================
// HTTP STATUS CODES
// =================================
export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  
  // Client Error
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // Server Error
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// =================================
// APP CONFIGURATION
// =================================
export const APP_CONFIG = {
  // Basic Info
  NAME: 'VegoBike',
  VERSION: '2.0.0',
  DESCRIPTION: 'Complete bike rental, servicing, and marketplace solution',
  AUTHOR: 'VegoBike Team',
  SUPPORT_EMAIL: 'support@vegobike.com',
  SUPPORT_PHONE: '+91-9999999999',
  
  // Timeouts (in milliseconds)
  API_TIMEOUT: 15000, // 15 seconds
  FILE_UPLOAD_TIMEOUT: 60000, // 60 seconds for file uploads
  OTP_RESEND_TIMEOUT: 30, // 30 seconds
  SESSION_TIMEOUT: 86400000, // 24 hours
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // File Upload Limits
  MAX_FILE_SIZE: 5242880, // 5MB in bytes
  MAX_IMAGE_SIZE: 2097152, // 2MB for images
  MAX_DOCUMENT_SIZE: 10485760, // 10MB for documents
  
  // Allowed file types
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  
  // Development settings
  ENABLE_LOGGING: import.meta.env.DEV || false,
  ENABLE_DEBUG_PANEL: import.meta.env.DEV || false,
  API_BASE_RETRY_COUNT: 3,
  API_RETRY_DELAY: 1000, // 1 second
};

// =================================
// FORM VALIDATION - ENHANCED
// =================================
export const VALIDATION = {
  // Phone number
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 15,
  PHONE_REGEX: /^[6-9]\d{9}$/, // Indian mobile numbers
  
  // Password
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  PASSWORD_REGEX: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/, // At least one letter and one number
  
  // Name - Updated for profile
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  NAME_REGEX: /^[a-zA-Z\s]+$/, // Only letters and spaces
  
  // OTP
  OTP_LENGTH: 4,
  OTP_EXPIRY: 300, // 5 minutes in seconds
  OTP_REGEX: /^\d{4}$/, // Exactly 4 digits
  
  // Email
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  // Profile specific validations
  // Address
  ADDRESS_MIN_LENGTH: 10,
  ADDRESS_MAX_LENGTH: 200,
  
  // Banking details
  ACCOUNT_NUMBER_MIN_LENGTH: 9,
  ACCOUNT_NUMBER_MAX_LENGTH: 18,
  ACCOUNT_NUMBER_REGEX: /^\d{9,18}$/,
  
  // IFSC Code
  IFSC_LENGTH: 11,
  IFSC_REGEX: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  
  // UPI ID
  UPI_REGEX: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/,
  
  // Text areas
  DESCRIPTION_MAX_LENGTH: 1000,
  TITLE_MAX_LENGTH: 100,
  
  // Numbers
  PRICE_MIN: 0,
  PRICE_MAX: 999999,
  QUANTITY_MIN: 1,
  QUANTITY_MAX: 100,
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
  
  // Tailwind CSS Breakpoints
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
    VERY_SLOW: '1000ms',
  },
  
  // Z-index layers
  Z_INDEX: {
    DROPDOWN: 1000,
    MODAL: 1050,
    POPOVER: 1100,
    TOOLTIP: 1150,
    TOAST: 1200,
    LOADING_OVERLAY: 1250,
  },
  
  // Colors (Tailwind CSS classes)
  COLORS: {
    PRIMARY: 'indigo',
    SECONDARY: 'gray',
    SUCCESS: 'green',
    WARNING: 'yellow',
    ERROR: 'red',
    INFO: 'blue',
  },
  
  // Component sizes
  SIZES: {
    XS: 'xs',
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
  },
};

// =================================
// BUSINESS LOGIC CONSTANTS
// =================================
export const BUSINESS = {
  // Rental Configuration
  RENTAL: {
    MIN_RENTAL_HOURS: 1,
    MAX_RENTAL_DAYS: 30,
    CANCELLATION_WINDOW: 2, // hours before start time
    LATE_RETURN_GRACE_PERIOD: 15, // minutes
    BOOKING_ADVANCE_LIMIT: 30, // days in advance
    DEFAULT_RENTAL_DURATION: 24, // hours
  },
  
  // Servicing Configuration
  SERVICING: {
    BOOKING_ADVANCE_DAYS: 30,
    CANCELLATION_WINDOW: 24, // hours
    RESCHEDULE_LIMIT: 2, // number of times
    SERVICE_TYPES: ['BASIC', 'PREMIUM', 'CUSTOM', 'EMERGENCY'],
    SERVICE_DURATION_HOURS: {
      BASIC: 2,
      PREMIUM: 4,
      CUSTOM: 6,
      EMERGENCY: 1,
    },
  },
  
  // Payment Configuration
  PAYMENT: {
    CURRENCIES: ['INR', 'USD', 'EUR'],
    DEFAULT_CURRENCY: 'INR',
    PAYMENT_METHODS: ['CARD', 'UPI', 'NET_BANKING', 'WALLET', 'CASH'],
    PAYMENT_TIMEOUT: 300, // 5 minutes in seconds
    REFUND_PROCESSING_DAYS: 7,
  },
  
  // OTP Configuration
  OTP: {
    LENGTH: 4,
    EXPIRY_MINUTES: 5,
    RESEND_TIMEOUT_SECONDS: 30,
    MAX_ATTEMPTS: 3,
    DEFAULT_TEST_OTP: '1234',
    RATE_LIMIT_PER_HOUR: 10, // Max OTP requests per phone per hour
  },
  
  // Profile Configuration
  PROFILE: {
    MAX_PROFILE_IMAGE_SIZE: 2097152, // 2MB
    ALLOWED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
    PROFILE_COMPLETION_FIELDS: ['name', 'phoneNumber', 'email', 'address'],
    BANKING_FIELDS: ['accountNumber', 'ifsc', 'upiId'],
  },
  
  // File Upload Configuration
  UPLOAD: {
    MAX_FILES_PER_REQUEST: 5,
    SUPPORTED_FORMATS: {
      IMAGES: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
      DOCUMENTS: ['.pdf', '.doc', '.docx'],
    },
  },
};

// =================================
// DOCUMENT VERIFICATION - ENHANCED
// =================================
export const VERIFICATION_STATUS = {
  NOT_UPLOADED: 'NOT_UPLOADED',
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

export const DOCUMENT_TYPES = {
  ADHAAR_FRONT: 'adhaarFront',
  ADHAAR_BACK: 'adhaarBack',
  DRIVING_LICENSE: 'drivingLicense'
};

// ✅ NEW: Document validation rules
export const DOCUMENT_VALIDATION = {
  MAX_FILE_SIZE: 5242880, // 5MB in bytes
  MIN_FILE_SIZE: 10240, // 10KB minimum
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf'],
  IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  PDF_TYPE: 'application/pdf',
  
  // Validation messages
  MESSAGES: {
    FILE_TOO_LARGE: 'File size must be less than 5MB',
    FILE_TOO_SMALL: 'File size must be at least 10KB',
    INVALID_TYPE: 'Only JPG, PNG, and PDF files are allowed',
    NO_FILE_SELECTED: 'Please select a file to upload',
    UPLOAD_SUCCESS: 'Document uploaded successfully',
    UPLOAD_FAILED: 'Failed to upload document',
    ALL_REQUIRED: 'All three documents are required for verification'
  }
};

// =================================
// ERROR MESSAGES - ENHANCED WITH DOCUMENT MESSAGES
// =================================
export const ERROR_MESSAGES = {
  // Network & General
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  
  // Authentication
  UNAUTHORIZED: 'You are not authorized to perform this action. Please log in.',
  FORBIDDEN: 'Access denied. You don\'t have permission to access this resource.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid credentials. Please check your login details.',
  
  // Validation
  VALIDATION_ERROR: 'Please check your input and try again.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid 10-digit phone number.',
  INVALID_OTP: 'Please enter a valid 4-digit OTP.',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long.',
  
  // Profile specific error messages
  INVALID_NAME: 'Name can only contain letters and spaces.',
  NAME_TOO_SHORT: 'Name must be at least 2 characters long.',
  NAME_TOO_LONG: 'Name cannot exceed 50 characters.',
  ADDRESS_TOO_SHORT: 'Address must be at least 10 characters long.',
  ADDRESS_TOO_LONG: 'Address cannot exceed 200 characters.',
  INVALID_ACCOUNT_NUMBER: 'Please enter a valid bank account number (9-18 digits).',
  INVALID_IFSC: 'Please enter a valid IFSC code (e.g., SBIN0123456).',
  INVALID_UPI: 'Please enter a valid UPI ID (e.g., user@paytm).',
  PROFILE_IMAGE_TOO_LARGE: 'Profile image must be smaller than 2MB.',
  INVALID_IMAGE_FORMAT: 'Please select a valid image format (JPG, PNG, WebP).',
  
  // ✅ NEW: Document verification error messages
  DOCUMENT_UPLOAD_FAILED: 'Failed to upload document. Please try again.',
  DOCUMENT_TOO_LARGE: 'Document file size must be less than 5MB.',
  DOCUMENT_TOO_SMALL: 'Document file size must be at least 10KB.',
  DOCUMENT_INVALID_FORMAT: 'Only JPG, PNG, and PDF formats are accepted.',
  DOCUMENTS_NOT_COMPLETE: 'Please upload all required documents.',
  DOCUMENT_VERIFICATION_FAILED: 'Failed to submit verification request.',
  DOCUMENT_LOAD_FAILED: 'Failed to load existing documents.',
  DOCUMENT_DELETE_FAILED: 'Failed to delete document.',
  NO_DOCUMENT_SELECTED: 'Please select a document to upload.',
  DOCUMENT_ALREADY_UPLOADED: 'This document has already been uploaded.',
  
  // OTP Related
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  OTP_NOT_FOUND: 'OTP not found. Please request a new one.',
  INVALID_OTP_FORMAT: 'OTP must be a 4-digit number.',
  TOO_MANY_OTP_ATTEMPTS: 'Too many failed attempts. Please request a new OTP.',
  OTP_SEND_FAILED: 'Failed to send OTP. Please try again.',
  
  // Business Logic
  NOT_FOUND: 'The requested resource was not found.',
  ALREADY_EXISTS: 'This resource already exists.',
  BOOKING_UNAVAILABLE: 'This bike is not available for the selected time.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction.',
  PROFILE_INCOMPLETE: 'Please complete your profile to continue.',
  
  // File Upload
  FILE_TOO_LARGE: 'File size exceeds the maximum limit of 5MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a supported file format.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  
  // Server Errors
  SERVER_ERROR: 'Server error. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable. Please try again later.',
  MAINTENANCE_MODE: 'System is under maintenance. Please try again later.',
  PROFILE_SERVICE_UNAVAILABLE: 'Profile service temporarily unavailable. Using cached data if available.',
};

// =================================
// SUCCESS MESSAGES - ENHANCED WITH DOCUMENT MESSAGES
// =================================
export const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Welcome back! Login successful.',
  LOGOUT_SUCCESS: 'You have been logged out successfully.',
  REGISTRATION_SUCCESS: 'Account created successfully! Welcome to VegoBike.',
  OTP_SENT: 'OTP sent successfully to your phone.',
  OTP_VERIFIED: 'OTP verified successfully.',
  
  // Profile & Account messages
  PROFILE_UPDATED: 'Your profile has been updated successfully.',
  PROFILE_LOADED: 'Profile loaded successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
  AVATAR_UPDATED: 'Profile picture updated successfully.',
  BANKING_DETAILS_UPDATED: 'Banking details updated successfully.',
  PERSONAL_INFO_UPDATED: 'Personal information updated successfully.',
  ADDRESS_UPDATED: 'Address updated successfully.',
  
  // ✅ NEW: Document verification success messages
  DOCUMENT_UPLOADED: 'Document uploaded successfully!',
  ALL_DOCUMENTS_UPLOADED: 'All documents uploaded successfully!',
  VERIFICATION_SUBMITTED: 'Verification request submitted successfully!',
  DOCUMENT_DELETED: 'Document deleted successfully.',
  DOCUMENTS_LOADED: 'Documents loaded successfully.',
  DOCUMENTS_VERIFIED: 'Your documents have been verified successfully!',
  
  // Booking & Orders
  BOOKING_CONFIRMED: 'Your booking has been confirmed successfully!',
  BOOKING_CANCELLED: 'Booking cancelled successfully.',
  SERVICE_BOOKED: 'Service appointment booked successfully!',
  ORDER_PLACED: 'Your order has been placed successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully.',
  
  // Listings & Content
  LISTING_POSTED: 'Your listing has been posted successfully!',
  LISTING_UPDATED: 'Listing updated successfully.',
  LISTING_DELETED: 'Listing deleted successfully.',
  
  // General
  CHANGES_SAVED: 'All changes have been saved successfully.',
  DATA_SYNCED: 'Your data has been synchronized successfully.',
  OPERATION_COMPLETED: 'Operation completed successfully.',
};

// utils/constants.js - Add these constants to your existing file

export const BOOKING_TYPES = {
  HOURLY: 'hourly',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
};

export const PACKAGE_CONFIG = {
  HOURLY: {
    label: 'Hourly',
    minHours: 3,
    maxHours: 72,
    priceKey: 'hourlyRate'
  },
  DAILY: {
    label: 'Daily',
    minDays: 1,
    maxDays: 30,
    priceKey: 'dailyRate'
  },
  WEEKLY: {
    label: 'Weekly',
    minWeeks: 1,
    maxWeeks: 4,
    priceKey: 'weeklyRate'
  },
  MONTHLY: {
    label: 'Monthly',
    minMonths: 1,
    maxMonths: 12,
    priceKey: 'monthlyRate'
  }
};

// ... rest of your existing constants

// =================================
// CACHE DURATION (in milliseconds)
// =================================
export const CACHE_DURATION = {
  SHORT: 300000, // 5 minutes
  MEDIUM: 1800000, // 30 minutes
  LONG: 3600000, // 1 hour
  VERY_LONG: 86400000, // 24 hours
  PERMANENT: 31536000000, // 1 year
};

// =================================
// FEATURE FLAGS
// =================================
export const FEATURES = {
  // UI Features
  DARK_MODE: true,
  NOTIFICATIONS: true,
  OFFLINE_SUPPORT: false,
  PWA_FEATURES: false,
  
  // Authentication Features
  SOCIAL_LOGIN: false,
  TWO_FACTOR_AUTH: false,
  BIOMETRIC_LOGIN: false,
  
  // Profile Features
  PROFILE_IMAGE_UPLOAD: true,
  BANKING_DETAILS: true,
  ADDRESS_AUTOCOMPLETE: false,
  PROFILE_COMPLETION_TRACKING: true,
  
  // ✅ NEW: Document Features
  DOCUMENT_VERIFICATION: true,
  DOCUMENT_AUTO_VERIFY: false,
  DOCUMENT_OCR: false,
  
  // Business Features
  MULTI_LANGUAGE: false,
  REFERRAL_PROGRAM: false,
  LOYALTY_PROGRAM: false,
  CHAT_SUPPORT: false,
  VIDEO_CALLS: false,
  
  // Analytics & Monitoring
  ANALYTICS: true,
  ERROR_REPORTING: true,
  PERFORMANCE_MONITORING: true,
  A_B_TESTING: false,
  
  // Development Features
  DEBUG_MODE: import.meta.env.DEV || false,
  API_MOCKING: false,
  FEATURE_FLAGS: true,
};

// =================================
// ENVIRONMENT CONFIGURATION
// =================================
export const ENV = {
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
  API_BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:8081',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  VERSION: import.meta.env.VITE_APP_VERSION || '2.0.0',
};

// =================================
// NOTIFICATION TYPES (for apiClient.js)
// =================================
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// =================================
// EXPORT GROUPS FOR EASY IMPORTING
// =================================
export const AUTH_CONSTANTS = {
  STORAGE_KEYS,
  USER_ROLES,
  ROLE_NAMES,
  ROLE_PERMISSIONS,
  API_ENDPOINTS: API_ENDPOINTS.AUTH,
  VALIDATION,
  BUSINESS: BUSINESS.OTP,
};

export const PROFILE_CONSTANTS = {
  API_ENDPOINTS: {
    PROFILE: API_ENDPOINTS.AUTH.PROFILE,
    UPDATE_PROFILE: API_ENDPOINTS.AUTH.UPDATE_PROFILE,
    CHANGE_PASSWORD: API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
  },
  VALIDATION: {
    NAME_MIN_LENGTH: VALIDATION.NAME_MIN_LENGTH,
    NAME_MAX_LENGTH: VALIDATION.NAME_MAX_LENGTH,
    NAME_REGEX: VALIDATION.NAME_REGEX,
    ADDRESS_MIN_LENGTH: VALIDATION.ADDRESS_MIN_LENGTH,
    ADDRESS_MAX_LENGTH: VALIDATION.ADDRESS_MAX_LENGTH,
    ACCOUNT_NUMBER_REGEX: VALIDATION.ACCOUNT_NUMBER_REGEX,
    IFSC_REGEX: VALIDATION.IFSC_REGEX,
    UPI_REGEX: VALIDATION.UPI_REGEX,
  },
  BUSINESS: BUSINESS.PROFILE,
  FEATURES: {
    PROFILE_IMAGE_UPLOAD: FEATURES.PROFILE_IMAGE_UPLOAD,
    BANKING_DETAILS: FEATURES.BANKING_DETAILS,
    PROFILE_COMPLETION_TRACKING: FEATURES.PROFILE_COMPLETION_TRACKING,
  },
};

// ✅ NEW: Document Constants Export
export const DOCUMENT_CONSTANTS = {
  API_ENDPOINTS: API_ENDPOINTS.DOCUMENTS,
  VERIFICATION_STATUS,
  DOCUMENT_TYPES,
  DOCUMENT_VALIDATION,
  FEATURES: {
    DOCUMENT_VERIFICATION: FEATURES.DOCUMENT_VERIFICATION,
    DOCUMENT_AUTO_VERIFY: FEATURES.DOCUMENT_AUTO_VERIFY,
    DOCUMENT_OCR: FEATURES.DOCUMENT_OCR,
  },
};

export const UI_CONSTANTS = {
  THEMES: UI.THEMES,
  BREAKPOINTS: UI.BREAKPOINTS,
  ANIMATION: UI.ANIMATION,
  Z_INDEX: UI.Z_INDEX,
  COLORS: UI.COLORS,
  SIZES: UI.SIZES,
};

export const API_CONSTANTS = {
  ENDPOINTS: API_ENDPOINTS,
  HTTP_STATUS,
  APP_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};

// =================================
// FREEZE OBJECTS (prevent mutations)
// =================================
Object.freeze(STORAGE_KEYS);
Object.freeze(ROUTES);
Object.freeze(BOOKING_STEPS);
Object.freeze(MODULES);
Object.freeze(USER_ROLES);
Object.freeze(ROLE_NAMES);
Object.freeze(ROLE_PERMISSIONS);
Object.freeze(API_ENDPOINTS);
Object.freeze(HTTP_STATUS);
Object.freeze(APP_CONFIG);
Object.freeze(VALIDATION);
Object.freeze(UI);
Object.freeze(BUSINESS);
Object.freeze(VERIFICATION_STATUS);
Object.freeze(DOCUMENT_TYPES);
Object.freeze(DOCUMENT_VALIDATION);
Object.freeze(ERROR_MESSAGES);
Object.freeze(SUCCESS_MESSAGES);
Object.freeze(CACHE_DURATION);
Object.freeze(FEATURES);
Object.freeze(ENV);
Object.freeze(NOTIFICATION_TYPES);

// Export default for convenience
export default {
  STORAGE_KEYS,
  ROUTES,
  BOOKING_STEPS,
  MODULES,
  USER_ROLES,
  ROLE_NAMES,
  API_ENDPOINTS,
  HTTP_STATUS,
  APP_CONFIG,
  VALIDATION,
  UI,
  BUSINESS,
  VERIFICATION_STATUS,
  DOCUMENT_TYPES,
  DOCUMENT_VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CACHE_DURATION,
  FEATURES,
  ENV,
  NOTIFICATION_TYPES,
};
