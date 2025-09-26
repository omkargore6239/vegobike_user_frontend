// context/AuthContext.jsx - Fixed version to prevent infinite loops
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../utils/apiClient';

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

  // Initialize auth state from localStorage (only once)
  const initializeAuth = useCallback(() => {
    if (initializationRef.current) return;
    
    console.log('🚀 AUTH_INIT - Initializing authentication state (one time)');
    initializationRef.current = true;
    
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user');
      
      console.log('🔍 AUTH_INIT - Token exists:', !!token);
      console.log('👤 AUTH_INIT - User data exists:', !!userData);
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          tokenRef.current = token;
          console.log('✅ AUTH_INIT - User authenticated from localStorage:', parsedUser.name || parsedUser.phoneNumber);
        } catch (parseError) {
          console.error('❌ AUTH_INIT - Error parsing user data:', parseError);
          // Clear invalid data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
          tokenRef.current = null;
        }
      } else {
        console.log('ℹ️ AUTH_INIT - No valid authentication data found');
        setIsAuthenticated(false);
        setUser(null);
        tokenRef.current = null;
      }
    } catch (error) {
      console.error('💥 AUTH_INIT - Error initializing auth:', error);
      setIsAuthenticated(false);
      setUser(null);
      tokenRef.current = null;
    } finally {
      setLoading(false);
      setAuthCheckComplete(true);
      console.log('🎯 AUTH_INIT - Authentication check complete');
    }
  }, []); // Empty dependency array - only runs once

  // Check authentication on mount (only once)
  useEffect(() => {
    console.log('🔄 AUTH_CONTEXT - Component mounting');
    initializeAuth();
  }, [initializeAuth]);

  // Login function with proper error handling
  const login = useCallback(async (phoneNumber, otp) => {
    console.log('🔑 AUTH_LOGIN - Attempting login for:', phoneNumber);
    
    try {
      setLoading(true);
      
      const response = await apiClient.post('/api/auth/verify-login-otp', {
        phoneNumber: phoneNumber.trim(),
        otp: otp
      });
      
      console.log('✅ AUTH_LOGIN - Login successful:', response.data);
      
      const { token, message } = response.data;
      
      if (token) {
        // Store authentication data
        localStorage.setItem('auth_token', token);
        tokenRef.current = token;
        
        // Create user object
        const userData = {
          phoneNumber: phoneNumber.trim(),
          token: token,
          name: 'User',
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        setIsAuthenticated(true);
        
        console.log('🎉 AUTH_LOGIN - Authentication state updated');
        return { success: true, message: message || 'Login successful' };
      } else {
        throw new Error('No token received from server');
      }
      
    } catch (error) {
      console.error('❌ AUTH_LOGIN - Login failed:', error);
      
      // Clear any existing auth data on failed login
      logout();
      
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    console.log('👋 AUTH_LOGOUT - Logging out user');
    
    try {
      // Try to call logout endpoint if it exists
      if (tokenRef.current) {
        try {
          await apiClient.post('/api/auth/logout', {}, {
            headers: {
              'Authorization': `Bearer ${tokenRef.current}`
            }
          });
          console.log('✅ AUTH_LOGOUT - Server logout successful');
        } catch (logoutError) {
          console.log('⚠️ AUTH_LOGOUT - Server logout failed (continuing with local logout):', logoutError.message);
        }
      }
    } catch (error) {
      console.log('💥 AUTH_LOGOUT - Error during server logout:', error.message);
    } finally {
      // Always clear local state regardless of server response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      setPendingBooking(null);
      setBookingStep(null);
      tokenRef.current = null;
      console.log('✨ AUTH_LOGOUT - Local logout complete');
    }
  }, []);

  // Check if token exists (simple check without server verification)
  const hasValidToken = useCallback(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    return !!(token && userData);
  }, []);

  // Store booking intent with debouncing
  const storeBookingIntent = useCallback((bookingData, step) => {
    console.log('📋 AUTH_BOOKING - Storing booking intent:', { bookingData, step });
    setPendingBooking(prevBooking => {
      // Only update if different
      if (JSON.stringify(prevBooking) !== JSON.stringify(bookingData)) {
        return bookingData;
      }
      return prevBooking;
    });
    
    setBookingStep(prevStep => {
      if (prevStep !== step) {
        return step;
      }
      return prevStep;
    });
    
    // Store in localStorage for persistence
    localStorage.setItem('pending_booking', JSON.stringify(bookingData));
    localStorage.setItem('booking_step', step);
  }, []);

  // Clear booking intent
  const clearBookingIntent = useCallback(() => {
    console.log('🗑️ AUTH_BOOKING - Clearing booking intent');
    setPendingBooking(null);
    setBookingStep(null);
    
    localStorage.removeItem('pending_booking');
    localStorage.removeItem('booking_step');
  }, []);

  // Restore booking intent from localStorage (only once)
  const restoreBookingIntent = useCallback(() => {
    try {
      const savedBooking = localStorage.getItem('pending_booking');
      const savedStep = localStorage.getItem('booking_step');
      
      if (savedBooking && savedStep) {
        const bookingData = JSON.parse(savedBooking);
        console.log('📥 AUTH_BOOKING - Restored booking intent from localStorage');
        setPendingBooking(bookingData);
        setBookingStep(savedStep);
      }
    } catch (error) {
      console.error('💥 AUTH_BOOKING - Error restoring booking intent:', error);
      // Clear invalid data
      localStorage.removeItem('pending_booking');
      localStorage.removeItem('booking_step');
    }
  }, []);

  // Initialize booking intent on mount (only once)
  useEffect(() => {
    console.log('📋 AUTH_BOOKING - Restoring booking intent on mount');
    restoreBookingIntent();
  }, []); // Empty dependency array

  // Refresh auth (simplified version) - prevents loops
  const refreshAuth = useCallback(() => {
    console.log('🔄 AUTH_REFRESH - Refreshing authentication state');
    
    // Only refresh if not already initialized
    if (!initializationRef.current) {
      initializeAuth();
    } else {
      // Quick check without re-initialization
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user');
      
      if (token && userData && !isAuthenticated) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          tokenRef.current = token;
        } catch (error) {
          console.error('❌ AUTH_REFRESH - Error parsing user data:', error);
          logout();
        }
      }
    }
  }, [isAuthenticated, logout]);

  const value = {
    // Auth state
    isAuthenticated,
    user,
    loading,
    authCheckComplete,
    
    // Auth methods
    login,
    logout,
    refreshAuth,
    hasValidToken,
    
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
