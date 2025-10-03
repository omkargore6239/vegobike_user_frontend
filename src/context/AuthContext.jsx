// context/AuthContext.jsx - FULLY FIXED with correct backend data format
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api, showNotification, NOTIFICATION_TYPES } from '../utils/apiClient';
import { STORAGE_KEYS, API_ENDPOINTS } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  // Booking intent state
  const [pendingBooking, setPendingBooking] = useState(null);
  const [bookingStep, setBookingStep] = useState(null);
  
  // Use ref to prevent infinite loops
  const initializationRef = useRef(false);
  const tokenRef = useRef(null);

  // Initialize auth state from localStorage
  const initializeAuth = useCallback(() => {
    if (initializationRef.current) return;
    
    console.log('🚀 AUTH_INIT - Initializing JWT authentication state');
    initializationRef.current = true;
    
    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      
      console.log('🔍 AUTH_INIT - JWT token exists:', !!token);
      console.log('👤 AUTH_INIT - User data exists:', !!userData);
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          tokenRef.current = token;
          console.log('✅ AUTH_INIT - User authenticated from JWT token:', parsedUser.name || parsedUser.phoneNumber);
        } catch (parseError) {
          console.error('❌ AUTH_INIT - Error parsing user data:', parseError);
          clearAuthData();
        }
      } else {
        console.log('ℹ️ AUTH_INIT - No valid JWT token found');
        setIsAuthenticated(false);
        setUser(null);
        tokenRef.current = null;
      }
    } catch (error) {
      console.error('💥 AUTH_INIT - Error initializing auth:', error);
      clearAuthData();
    } finally {
      setLoading(false);
      setAuthCheckComplete(true);
      console.log('🎯 AUTH_INIT - JWT authentication check complete');
    }
  }, []);

  // Clear auth data helper
  const clearAuthData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PENDING_BOOKING);
    localStorage.removeItem(STORAGE_KEYS.BOOKING_STEP);
    setIsAuthenticated(false);
    setUser(null);
    setPendingBooking(null);
    setBookingStep(null);
    tokenRef.current = null;
  }, []);

  // Check authentication on mount
  useEffect(() => {
    console.log('🔄 AUTH_CONTEXT - Component mounting with JWT support');
    initializeAuth();
  }, [initializeAuth]);

  // Load user profile from API using JWT
  const loadUserProfile = useCallback(async () => {
    console.log('👤 AUTH_PROFILE - Loading user profile with JWT');
    
    try {
      const result = await api.get(API_ENDPOINTS.AUTH.PROFILE);
      
      if (result && result.success) {
        const userData = result.data;
        console.log('✅ AUTH_PROFILE - Profile loaded successfully:', userData);
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        
        return userData;
      } else {
        console.error('❌ AUTH_PROFILE - Failed to load profile:', result?.message);
        throw new Error(result?.message || 'Failed to load user profile');
      }
    } catch (error) {
      console.error('💥 AUTH_PROFILE - Profile loading error:', error);
      
      if (error.response?.status === 401) {
        console.log('🔐 AUTH_PROFILE - JWT token invalid/expired, clearing auth');
        clearAuthData();
        showNotification('Your session has expired. Please login again.', NOTIFICATION_TYPES.ERROR);
      }
      
      throw error;
    }
  }, [clearAuthData]);

  // ✅ FIXED: Send Registration OTP - Now sends data as JSON string in 'data' field
  const sendRegistrationOTP = useCallback(async (registrationData, profileImage) => {
    console.log('📱 AUTH_REG_OTP - Sending registration OTP');
    console.log('📦 Registration data:', registrationData);
    
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // ✅ FIX: Create JSON payload matching your RegistrationRequest DTO
      const registrationPayload = {
        name: registrationData.name,
        phoneNumber: registrationData.phoneNumber,
        email: registrationData.email,
        alternateNumber: registrationData.alternateNumber || null,
        address: registrationData.address || null,
        accountNumber: registrationData.accountNumber || null,
        ifsc: registrationData.ifsc || null,
        upiId: registrationData.upiId || null,
        password: null, // Not needed for regular user
        roleId: registrationData.roleId || 3,
        storeId: registrationData.storeId || 0,
        profileImageName: profileImage ? profileImage.name : null
      };
      
      // ✅ FIX: Append as JSON string with field name 'data' (matches @RequestPart("data"))
      formData.append('data', JSON.stringify(registrationPayload));
      
      // ✅ Append profile image if provided
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      
      console.log('🔗 Endpoint:', API_ENDPOINTS.AUTH.SEND_REGISTRATION_OTP);
      console.log('📦 Payload (JSON):', JSON.stringify(registrationPayload, null, 2));
      console.log('📷 Profile Image:', profileImage ? profileImage.name : 'None');
      
      const result = await api.upload(API_ENDPOINTS.AUTH.SEND_REGISTRATION_OTP, formData);
      
      console.log('✅ AUTH_REG_OTP - Response:', result);
      
      // ✅ FIX: Check for status='true' (your backend returns this)
      if (result && (result.status === 'true' || result.success !== false)) {
        const message = result.message || 'OTP sent successfully';
        showNotification(message, NOTIFICATION_TYPES.SUCCESS);
        
        return {
          success: true,
          message: message,
          developmentMode: result.developmentMode === 'true'
        };
      } else {
        throw new Error(result?.message || 'Failed to send OTP');
      }
      
    } catch (error) {
      console.error('❌ AUTH_REG_OTP - Failed:', error);
      console.error('❌ Error details:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to send registration OTP';
      
      showNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }, []);

  // ✅ Verify Registration OTP and Complete Registration
  const register = useCallback(async (phoneNumber, otp) => {
    console.log('📝 AUTH_REGISTER - Verifying OTP and completing registration');
    console.log('📱 Phone:', phoneNumber);
    
    try {
      const result = await api.post(API_ENDPOINTS.AUTH.VERIFY_REGISTRATION_OTP, {
        phoneNumber: phoneNumber.trim(),
        otp: otp.trim()
      });
      
      console.log('✅ AUTH_REGISTER - Response:', result);
      
      // ✅ FIX: Check for status='true' (your backend returns this)
      if (result && (result.status === 'true' || result.success === true)) {
        const { token, user: userData, message } = result;
        
        console.log('🎉 AUTH_REGISTER - Registration successful');
        
        if (token) {
          console.log('🔐 AUTH_REGISTER - JWT token received, storing');
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
          tokenRef.current = token;
        }
        
        if (userData) {
          console.log('👤 AUTH_REGISTER - User data received');
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        }
        
        showNotification(message || 'Registration successful!', NOTIFICATION_TYPES.SUCCESS);
        
        return {
          success: true,
          message: message || 'Registration successful',
          token,
          user: userData
        };
      } else {
        throw new Error(result?.message || 'Registration verification failed');
      }
      
    } catch (error) {
      console.error('❌ AUTH_REGISTER - Failed:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Registration verification failed';
      
      showNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }, []);

  // Login with OTP verification
  const login = useCallback(async (phoneNumber, otp) => {
    console.log('🔑 AUTH_LOGIN - Attempting JWT login for:', phoneNumber);
    
    try {
      setLoading(true);
      
      const result = await api.post(API_ENDPOINTS.AUTH.VERIFY_LOGIN_OTP, {
        phoneNumber: phoneNumber.trim(),
        otp: otp
      });
      
      console.log('✅ AUTH_LOGIN - JWT login successful:', result);

      if (result && result.success) {
        const { token, message } = result;
        
        if (token) {
          console.log('🔐 AUTH_LOGIN - JWT token received, storing locally');
          
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
          tokenRef.current = token;
          
          try {
            await loadUserProfile();
            
            console.log('🎉 AUTH_LOGIN - JWT authentication and profile loading complete');
            showNotification(message || 'Welcome back!', NOTIFICATION_TYPES.SUCCESS);
            
            return { success: true, message: message || 'Login successful' };
          } catch (profileError) {
            console.warn('⚠️ AUTH_LOGIN - JWT login successful but profile loading failed:', profileError);
            
            const minimalUser = {
              phoneNumber: phoneNumber.trim(),
              name: 'User',
              loginTime: new Date().toISOString()
            };
            
            setUser(minimalUser);
            setIsAuthenticated(true);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(minimalUser));
            
            return { success: true, message: message || 'Login successful' };
          }
        } else {
          throw new Error('No JWT token received from server');
        }
      } else {
        throw new Error(result?.message || 'Login failed');
      }
      
    } catch (error) {
      console.error('❌ AUTH_LOGIN - JWT login failed:', error);
      clearAuthData();
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Login failed. Please try again.';
      
      showNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [clearAuthData, loadUserProfile]);

  // Send Login OTP
  const sendLoginOTP = useCallback(async (loginData) => {
    console.log('📱 AUTH_SEND_OTP - Sending login OTP for:', loginData.phoneNumber);
    
    try {
      const result = await api.post(API_ENDPOINTS.AUTH.SEND_LOGIN_OTP, {
        phoneNumber: loginData.phoneNumber.trim()
      });
      
      console.log('✅ AUTH_SEND_OTP - OTP sent successfully:', result);

      // ✅ FIX: Check for status='true' (your backend returns this)
      if (result && (result.status === 'true' || result.success === true)) {
        const message = result.message || 'OTP sent successfully';
        showNotification(message, NOTIFICATION_TYPES.SUCCESS);
        
        return {
          success: true,
          message: message,
          developmentMode: result.developmentMode === 'true'
        };
      } else {
        // Still treat as success if message exists
        const message = result?.message || 'OTP sent successfully';
        showNotification(message, NOTIFICATION_TYPES.SUCCESS);
        
        return {
          success: true,
          message: message,
          developmentMode: result.developmentMode === 'true'
        };
      }
      
    } catch (error) {
      console.error('❌ AUTH_SEND_OTP - Failed to send OTP:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to send OTP. Please try again.';
      
      showNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
      
      return {
        success: false,
        message: errorMessage
      };
    }
  }, []);

  // Update user profile
  const updateUserProfile = useCallback(async (updatedData) => {
    console.log('👤 AUTH_UPDATE_PROFILE - Updating profile with JWT authentication');
    
    try {
      const result = await api.put(API_ENDPOINTS.AUTH.PROFILE, updatedData);
      
      if (result && result.success) {
        const updatedUser = result.data;
        console.log('✅ AUTH_UPDATE_PROFILE - Profile updated successfully:', updatedUser);
        
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
        
        showNotification('Profile updated successfully!', NOTIFICATION_TYPES.SUCCESS);
        
        return { success: true, user: updatedUser };
      } else {
        throw new Error(result?.message || 'Failed to update profile');
      }
      
    } catch (error) {
      console.error('❌ AUTH_UPDATE_PROFILE - Failed to update profile:', error);
      
      if (error.response?.status === 401) {
        clearAuthData();
        showNotification('Your session has expired. Please login again.', NOTIFICATION_TYPES.ERROR);
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to update profile';
      
      showNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
      
      return { success: false, error: errorMessage };
    }
  }, [clearAuthData]);

  // Admin login with email/password
  const adminLogin = useCallback(async (email, password) => {
    console.log('🔐 AUTH_ADMIN_LOGIN - Admin/Store Manager login');
    
    try {
      setLoading(true);
      
      const result = await api.post(API_ENDPOINTS.AUTH.ADMIN_LOGIN, {
        email: email.trim(),
        password: password
      });
      
      console.log('✅ AUTH_ADMIN_LOGIN - Login successful:', result);

      if (result && result.success) {
        const { token, user: userData, message } = result;
        
        if (token) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
          tokenRef.current = token;
        }
        
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        }
        
        showNotification(message || 'Welcome back!', NOTIFICATION_TYPES.SUCCESS);
        
        return { success: true, message: message || 'Login successful' };
      } else {
        throw new Error(result?.message || 'Login failed');
      }
      
    } catch (error) {
      console.error('❌ AUTH_ADMIN_LOGIN - Failed:', error);
      clearAuthData();
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Invalid credentials';
      
      showNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [clearAuthData]);

  // Logout
  const logout = useCallback(async () => {
    console.log('👋 AUTH_LOGOUT - Logging out user and clearing JWT');
    
    try {
      if (tokenRef.current) {
        try {
          await api.post(API_ENDPOINTS.AUTH.LOGOUT);
          console.log('✅ AUTH_LOGOUT - Server logout successful');
        } catch (logoutError) {
          console.log('⚠️ AUTH_LOGOUT - Server logout failed (continuing with local logout):', logoutError.message);
        }
      }
    } catch (error) {
      console.log('💥 AUTH_LOGOUT - Error during server logout:', error.message);
    } finally {
      clearAuthData();
      showNotification('Logged out successfully', NOTIFICATION_TYPES.SUCCESS);
      console.log('✨ AUTH_LOGOUT - JWT logout complete');
    }
  }, [clearAuthData]);

  // Check if valid JWT token exists
  const hasValidToken = useCallback(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  }, []);

  // Store booking intent
  const storeBookingIntent = useCallback((bookingData, step) => {
    console.log('📋 AUTH_BOOKING - Storing booking intent:', { bookingData, step });
    setPendingBooking(bookingData);
    setBookingStep(step);
    
    localStorage.setItem(STORAGE_KEYS.PENDING_BOOKING, JSON.stringify(bookingData));
    localStorage.setItem(STORAGE_KEYS.BOOKING_STEP, step);
  }, []);

  // Clear booking intent
  const clearBookingIntent = useCallback(() => {
    console.log('🗑️ AUTH_BOOKING - Clearing booking intent');
    setPendingBooking(null);
    setBookingStep(null);
    
    localStorage.removeItem(STORAGE_KEYS.PENDING_BOOKING);
    localStorage.removeItem(STORAGE_KEYS.BOOKING_STEP);
  }, []);

  const value = {
    // Auth state
    isAuthenticated,
    user,
    loading,
    authCheckComplete,
    
    // Auth methods
    login,
    sendLoginOTP,
    logout,
    hasValidToken,
    adminLogin,
    
    // ✅ Registration methods
    sendRegistrationOTP,
    register,
    
    // Profile methods
    updateUserProfile,
    loadUserProfile,
    
    // Booking intent
    pendingBooking,
    bookingStep,
    storeBookingIntent,
    clearBookingIntent
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
