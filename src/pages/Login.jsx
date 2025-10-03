// pages/Login.jsx - FULLY UPDATED with proper JWT token handling for booking
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  PhoneIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

import { api, showNotification, NOTIFICATION_TYPES } from '../utils/apiClient';
import {
  API_ENDPOINTS,
  STORAGE_KEYS
} from '../utils/constants';

// Enhanced OTP Input Component
const OTPInput = ({ length = 4, onComplete, loading = false, showHint = false }) => {
  const inputRef = useRef([]);
  const [otp, setOTP] = useState(Array(length).fill(''));

  useEffect(() => {
    if (inputRef.current[0]) {
      inputRef.current[0].focus();
    }
  }, []);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value && index < length - 1) {
      inputRef.current[index + 1]?.focus();
    }
    if (!value && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
    if (newOTP.every(digit => digit !== '') && newOTP.join('').length === length) {
      onComplete(newOTP.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOTP = Array(length).fill('');
    pastedData.split('').forEach((digit, idx) => {
      if (idx < length) newOTP[idx] = digit;
    });
    setOTP(newOTP);
    
    const lastIndex = Math.min(pastedData.length - 1, length - 1);
    if (inputRef.current[lastIndex]) {
      inputRef.current[lastIndex].focus();
    }
    
    if (newOTP.join('').length === length) {
      onComplete(newOTP.join(''));
    }
  };

  const fillTestOTP = () => {
    const testOTP = ['1', '2', '3', '4'];
    setOTP(testOTP);
    setTimeout(() => onComplete(testOTP.join('')), 500);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-3">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index]}
            onChange={e => handleChange(e.target.value, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            onPaste={handlePaste}
            ref={ref => (inputRef.current[index] = ref)}
            disabled={loading}
            className={`w-14 h-14 text-center text-xl font-semibold border-2 rounded-lg 
            ${otp[index] ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'} 
            focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
            placeholder="•"
          />
        ))}
      </div>
      
      {showHint && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start">
            <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">Development Mode</p>
              <p className="text-xs text-blue-700 mb-2">Use test OTP: <span className="font-mono font-bold">1234</span></p>
              <button
                type="button"
                onClick={fillTestOTP}
                disabled={loading}
                className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded disabled:opacity-50 transition-colors"
              >
                Auto-fill Test OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Login = () => {
  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [debugMode, setDebugMode] = useState(true);
  const [developmentMode, setDevelopmentMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      if (location.state.phoneNumber) {
        setPhoneNumber(location.state.phoneNumber);
      }
    }
  }, [location]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validateForm = () => {
    const phone = phoneNumber.trim();
    
    if (!phone) {
      setError('Phone number is required');
      return false;
    }
    
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    
    const firstDigit = phone[0];
    if (!['6', '7', '8', '9'].includes(firstDigit)) {
      setError('Phone number should start with 6, 7, 8, or 9');
      return false;
    }
    
    return true;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('📱 LOGIN - Sending OTP for:', phoneNumber);

      const result = await api.post(API_ENDPOINTS.AUTH.SEND_LOGIN_OTP, {
        phoneNumber: phoneNumber.trim()
      });

      console.log('✅ LOGIN - OTP Response:', result);

      if (result && (result.status === 'true' || result.success !== false)) {
        const responseData = result.data || result;
        setSuccess(responseData.message || 'OTP sent successfully');
        setDevelopmentMode(responseData.developmentMode === 'true' || false);
        
        setStep('otp');
        setCountdown(30);
      } else {
        throw new Error(result?.message || 'Failed to send OTP');
      }

    } catch (err) {
      console.error('❌ LOGIN - Send OTP Error:', err);
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (err.response?.status === 404) {
        errorMessage = 'Phone number not registered. Please register first.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }
      
      setError(errorMessage);
      showNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Properly extract token from backend response
  const handleVerifyOTP = async (otpCode) => {
    console.log('🔐 LOGIN - Verifying OTP:', otpCode);
    setOtpLoading(true);
    setOtpError('');
    
    try {
      const result = await api.post(API_ENDPOINTS.AUTH.VERIFY_LOGIN_OTP, {
        phoneNumber: phoneNumber.trim(),
        otp: otpCode.trim()
      });

      console.log('✅ LOGIN - Full Response:', JSON.stringify(result, null, 2));

      // ✅ CRITICAL FIX: Token is in result.data.token
      const token = result.data?.token || result.token;
      const message = result.data?.message || result.message || 'Login successful';
      const success = result.data?.success || result.success;

      console.log('🔍 Extracted Values:');
      console.log('  - Token:', token ? 'EXISTS ✅' : 'MISSING ❌');
      console.log('  - Success:', success);
      console.log('  - Message:', message);

      if (!token) {
        console.error('❌ No token in response. Full response:', result);
        throw new Error('No token received from server');
      }

      // ✅ Store JWT token
      console.log('🔐 Storing JWT token in localStorage');
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);

      // ✅ Try to load user profile using the token
      try {
        console.log('👤 Fetching user profile with token...');
        const profileResult = await api.get(API_ENDPOINTS.AUTH.PROFILE);
        
        if (profileResult && profileResult.success && profileResult.data) {
          const userData = profileResult.data;
          console.log('✅ User profile loaded:', userData.name || userData.phoneNumber);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
        } else {
          throw new Error('Profile load failed');
        }
      } catch (profileError) {
        console.warn('⚠️ Profile load failed, using minimal user data');
        const minimalUser = {
          phoneNumber: phoneNumber.trim(),
          loginTime: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(minimalUser));
      }
      
      setSuccess(message);
      showNotification(message, NOTIFICATION_TYPES.SUCCESS);
      
      // ✅ Check if there's a return URL (for booking flow)
      const urlParams = new URLSearchParams(location.search);
      const returnUrl = urlParams.get('returnUrl');
      
      setTimeout(() => {
        if (returnUrl) {
          console.log('🚀 Redirecting to return URL:', returnUrl);
          window.location.href = decodeURIComponent(returnUrl);
        } else {
          console.log('🚀 Redirecting to home page...');
          window.location.href = '/';
        }
      }, 1500);

    } catch (err) {
      console.error('❌ LOGIN - Verification Error:', err);
      console.error('❌ Error Details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.message === 'No token received from server') {
        errorMessage = 'Server error: Authentication token not received. Please contact support.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error during login. Please try again.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid or expired OTP. Please try again.';
      } else if (err.response?.status === 404) {
        errorMessage = 'User not found. Please register first.';
      } else {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }
      
      setOtpError(errorMessage);
      showNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpLoading(true);
    setOtpError('');

    try {
      const result = await api.post(API_ENDPOINTS.AUTH.SEND_LOGIN_OTP, {
        phoneNumber: phoneNumber.trim()
      });

      if (result && (result.status === 'true' || result.success !== false)) {
        setSuccess('OTP resent successfully');
        setCountdown(30);
        showNotification('New OTP sent to your phone', NOTIFICATION_TYPES.SUCCESS);
      } else {
        setOtpError('Failed to resend OTP');
      }
    } catch (err) {
      setOtpError('Failed to resend OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        
        {debugMode && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-xs">
            <div className="flex justify-between items-center mb-2">
              <strong>Debug Panel - Login</strong>
              <button onClick={() => setDebugMode(false)} className="text-red-600 hover:text-red-800">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p><strong>Step:</strong> {step}</p>
                <p><strong>Phone:</strong> {phoneNumber}</p>
                <p><strong>Token:</strong> {localStorage.getItem(STORAGE_KEYS.TOKEN) ? '✅' : '❌'}</p>
              </div>
              <div>
                <p><strong>Test OTP:</strong> <span className="font-mono font-bold text-green-600">1234</span></p>
                <p><strong>Dev Mode:</strong> {developmentMode ? '✅' : '❌'}</p>
              </div>
            </div>
          </div>
        )}

        {step === 'phone' ? (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <PhoneIcon className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your VegoBike account with OTP</p>
              <p className="text-sm text-green-600 mt-2 font-medium">🔒 Passwordless login</p>
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
              <form onSubmit={handleSendOTP} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">+91</span>
                    </div>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      maxLength={10}
                      required
                      className="block w-full pl-16 pr-3 py-4 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors text-lg"
                      placeholder="9876543210"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || phoneNumber.length !== 10}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <PhoneIcon className="h-5 w-5 mr-2" />
                      Send Login OTP
                    </>
                  )}
                </button>
              </form>
              
              <div className="text-center mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Phone</h2>
              <p className="text-gray-600 mb-2">Enter the 4-digit code sent to</p>
              <p className="text-indigo-600 font-semibold">+91 {phoneNumber}</p>
              {developmentMode && (
                <p className="text-sm text-green-600 mt-2 font-medium">🧪 Test OTP: 1234</p>
              )}
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
              <div className="space-y-6">
                {otpError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{otpError}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                    Enter Verification Code
                  </label>
                  <OTPInput
                    length={4}
                    onComplete={handleVerifyOTP}
                    loading={otpLoading}
                    showHint={developmentMode}
                  />
                </div>

                <div className="flex justify-center space-x-4">
                  {countdown > 0 ? (
                    <div className="flex items-center text-gray-500 text-sm">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      <span>Resend OTP in {countdown}s</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={otpLoading}
                      className="text-indigo-600 hover:text-indigo-500 font-medium disabled:opacity-50 transition-colors text-sm"
                    >
                      {otpLoading ? 'Sending...' : 'Resend OTP'}
                    </button>
                  )}
                </div>

                <div className="text-center pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setError('');
                      setOtpError('');
                      setSuccess('');
                    }}
                    className="flex items-center justify-center text-gray-600 hover:text-gray-500 font-medium mx-auto transition-colors text-sm"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Change Phone Number
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
