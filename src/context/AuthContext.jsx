import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient, apiClientMultipart } from '../utils/apiClient';
import { 
  STORAGE_KEYS, 
  API_ENDPOINTS, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  VALIDATION,
  USER_ROLES,
  APP_CONFIG
} from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Clear error after specified time
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), APP_CONFIG.ERROR_TIMEOUT || 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Initialize user from localStorage and verify with backend
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        
        if (savedUser && savedToken) {
          const parsedUser = JSON.parse(savedUser);
          
          // Verify token with backend
          try {
            const response = await apiClient.get(API_ENDPOINTS.AUTH.VERIFY_TOKEN);
            if (response.data?.valid) {
              setUser(parsedUser);
              setIsAuthenticated(true);
            } else {
              // Token is invalid, clear storage
              clearAuthStorage();
            }
          } catch (tokenError) {
            // Token verification failed, clear storage
            clearAuthStorage();
            console.warn('Token verification failed:', tokenError);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthStorage();
        setError(ERROR_MESSAGES.SESSION_EXPIRED);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Helper function to clear auth storage
  const clearAuthStorage = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Helper function to store auth data
  const storeAuthData = useCallback((token, userData) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // Send OTP for login
  const sendLoginOTP = useCallback(async (phoneNumber) => {
    if (!phoneNumber || phoneNumber.trim().length < VALIDATION.PHONE_MIN_LENGTH) {
      const errorMsg = 'Valid phone number is required';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.SEND_LOGIN_OTP, {
        phoneNumber: phoneNumber.trim()
      });

      return { 
        success: true, 
        message: response.data.message || SUCCESS_MESSAGES.OTP_SENT
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || ERROR_MESSAGES.NETWORK_ERROR;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify OTP and login
  const verifyLoginOTP = useCallback(async (phoneNumber, otp) => {
    if (!phoneNumber || !otp || otp.length !== VALIDATION.OTP_LENGTH) {
      const errorMsg = `Phone number and ${VALIDATION.OTP_LENGTH}-digit OTP are required`;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_LOGIN_OTP, {
        phoneNumber: phoneNumber.trim(),
        otp: otp.trim()
      });

      if (response.data.token) {
        const { token, user: userData } = response.data;
        storeAuthData(token, userData);
        return { success: true, user: userData };
      }
      
      throw new Error(ERROR_MESSAGES.VALIDATION_ERROR);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your OTP.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [storeAuthData]);

  // Combined login function (legacy support)
  const login = useCallback(async (credentials) => {
    // If it's phone-based login, redirect to new OTP flow
    if (credentials.phoneNumber) {
      const otpResult = await sendLoginOTP(credentials.phoneNumber);
      if (otpResult.success) {
        return { 
          success: true, 
          requiresOTP: true, 
          message: SUCCESS_MESSAGES.OTP_SENT
        };
      }
      return otpResult;
    }

    // Legacy email/password login (for backward compatibility)
    if (!credentials?.email || !credentials?.password) {
      const errorMsg = 'Email and password are required';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setLoading(true);
    setError(null);

    try {
      // Try admin login endpoint first
      let response;
      try {
        response = await apiClient.post(API_ENDPOINTS.AUTH.ADMIN_LOGIN, {
          email: credentials.email.toLowerCase().trim(),
          password: credentials.password
        });
      } catch (adminError) {
        // If admin login fails with 403, try store manager login
        if (adminError.response?.status === 403) {
          response = await apiClient.post(API_ENDPOINTS.AUTH.STORE_MANAGER_LOGIN, {
            email: credentials.email.toLowerCase().trim(),
            password: credentials.password
          });
        } else {
          throw adminError;
        }
      }

      if (response.data.token) {
        const { token, user: userData } = response.data;
        storeAuthData(token, userData);
        return { success: true, user: userData };
      }
      
      throw new Error(ERROR_MESSAGES.VALIDATION_ERROR);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [sendLoginOTP, storeAuthData]);

  // Send OTP for registration
  const sendRegistrationOTP = useCallback(async (registrationData) => {
    // Validation
    const requiredFields = ['phoneNumber', 'email', 'name'];
    const missingFields = requiredFields.filter(field => !registrationData?.[field]);
    
    if (missingFields.length > 0) {
      const errorMsg = `Required fields missing: ${missingFields.join(', ')}`;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Additional validation
    if (!VALIDATION.EMAIL_REGEX.test(registrationData.email)) {
      const errorMsg = 'Invalid email format';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    if (registrationData.phoneNumber.length < VALIDATION.PHONE_MIN_LENGTH) {
      const errorMsg = 'Invalid phone number';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    if (registrationData.password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      const errorMsg = `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setLoading(true);
    setError(null);

    try {
      // Create FormData for multipart request
      const formData = new FormData();
      
      const payload = {
        name: registrationData.name.trim(),
        phoneNumber: registrationData.phoneNumber.trim(),
        alternateNumber: registrationData.alternateNumber?.trim() || '',
        email: registrationData.email.toLowerCase().trim(),
        address: registrationData.address?.trim() || '',
        accountNumber: registrationData.accountNumber?.trim() || '',
        ifsc: registrationData.ifsc?.trim() || '',
        upiId: registrationData.upiId?.trim() || '',
        password: registrationData.password,
        roleId: USER_ROLES.USER, // User role
        storeId: 0, // Not a store manager
        profileImageName: registrationData.profileImage?.name || ''
      };
      
      formData.append('data', JSON.stringify(payload));
      
      if (registrationData.profileImage) {
        // Validate file size
        if (registrationData.profileImage.size > APP_CONFIG.MAX_FILE_SIZE) {
          const errorMsg = ERROR_MESSAGES.FILE_TOO_LARGE;
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
        
        // Validate file type
        if (!APP_CONFIG.ALLOWED_IMAGE_TYPES.includes(registrationData.profileImage.type)) {
          const errorMsg = ERROR_MESSAGES.INVALID_FILE_TYPE;
          setError(errorMsg);
          return { success: false, error: errorMsg };
        }
        
        formData.append('profileImage', registrationData.profileImage);
      }

      const response = await apiClientMultipart.post(API_ENDPOINTS.AUTH.SEND_REGISTRATION_OTP, formData);

      return { 
        success: true, 
        message: response.data.message || SUCCESS_MESSAGES.REGISTRATION_SUCCESS
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify registration OTP
  const verifyRegistrationOTP = useCallback(async (phoneNumber, otp) => {
    if (!phoneNumber || !otp || otp.length !== VALIDATION.OTP_LENGTH) {
      const errorMsg = `Phone number and ${VALIDATION.OTP_LENGTH}-digit OTP are required`;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_REGISTRATION_OTP, {
        phoneNumber: phoneNumber.trim(),
        otp: otp.trim()
      });

      if (response.data.token) {
        const { token, user: userData } = response.data;
        storeAuthData(token, userData);
        return { success: true, user: userData };
      }
      
      return { success: true, message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration verification failed.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [storeAuthData]);

  // Combined register function
  const register = useCallback(async (userData) => {
    const result = await sendRegistrationOTP(userData);
    if (result.success) {
      return { 
        success: true, 
        requiresOTP: true, 
        message: SUCCESS_MESSAGES.OTP_SENT
      };
    }
    return result;
  }, [sendRegistrationOTP]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Optional: Call backend logout endpoint
      try {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      } catch (logoutError) {
        // Ignore logout endpoint errors
        console.warn('Logout endpoint error:', logoutError);
      }
      
      clearAuthStorage();
      setError(null);
      
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, error: 'Logout failed' };
    }
  }, [clearAuthStorage]);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    if (!isAuthenticated) {
      const errorMsg = ERROR_MESSAGES.UNAUTHORIZED;
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE_PROFILE, profileData);
      
      const updatedUser = { ...user, ...response.data.user };
      setUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser, message: SUCCESS_MESSAGES.PROFILE_UPDATED };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  // Clear error manually
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    
    if (token && userData) {
      try {
        const response = await apiClient.get(API_ENDPOINTS.AUTH.VERIFY_TOKEN);
        if (response.data?.valid) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          return true;
        }
      } catch (error) {
        console.warn('Auth status check failed:', error);
      }
    }
    
    // Clear invalid session
    clearAuthStorage();
    return false;
  }, [clearAuthStorage]);

  // Refresh token (if your backend supports it)
  const refreshToken = useCallback(async () => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
      if (response.data.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
        return { success: true, token: response.data.token };
      }
      throw new Error('No token in refresh response');
    } catch (error) {
      clearAuthStorage();
      return { success: false, error: 'Token refresh failed' };
    }
  }, [clearAuthStorage]);

  // Get user role information
  const getUserRole = useCallback(() => {
    if (!user?.roleId) return null;
    
    return {
      id: user.roleId,
      name: Object.keys(USER_ROLES).find(key => USER_ROLES[key] === user.roleId),
      isAdmin: user.roleId === USER_ROLES.ADMIN,
      isStoreManager: user.roleId === USER_ROLES.STORE_MANAGER,
      isUser: user.roleId === USER_ROLES.USER,
    };
  }, [user]);

  const value = {
    // State
    user,
    loading,
    error,
    isAuthenticated,
    
    // OTP-based functions
    sendLoginOTP,
    verifyLoginOTP,
    sendRegistrationOTP,
    verifyRegistrationOTP,
    
    // Legacy functions (for backward compatibility)
    login,
    register,
    
    // Utility functions
    logout,
    updateProfile,
    clearError,
    checkAuthStatus,
    refreshToken,
    getUserRole,
    
    // Helper functions
    clearAuthStorage,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
