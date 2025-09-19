import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { USER_STORAGE_KEY } from '../utils/constants';

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

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Initialize user from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && parsedUser.id) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem(USER_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
        setError('Failed to restore user session');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login with mock simulation
  const login = useCallback(async (credentials) => {
    if (!credentials || !credentials.email || !credentials.password) {
      return { success: false, error: 'Email and password are required' };
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Basic validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email)) {
        throw new Error('Invalid email format');
      }

      if (credentials.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const userData = {
        id: Date.now(),
        email: credentials.email.toLowerCase(),
        name: credentials.name || credentials.email.split('@')[0],
        phone: credentials.phone || '',
        avatar: null,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };
      
      setUser(userData);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Register with mock simulation
  const register = useCallback(async (userData) => {
    if (!userData || !userData.email || !userData.password || !userData.name) {
      return { success: false, error: 'Name, email and password are required' };
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Invalid email format');
      }

      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (userData.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }

      const newUser = {
        id: Date.now(),
        email: userData.email.toLowerCase(),
        name: userData.name.trim(),
        phone: userData.phone || '',
        avatar: null,
        createdAt: new Date().toISOString(),
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      };
      
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    try {
      setUser(null);
      setError(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      return { success: true };
    } catch (error) {
      console.error('Error during logout:', error);
      return { success: false, error: 'Logout failed' };
    }
  }, []);

  // Clear error manually
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
