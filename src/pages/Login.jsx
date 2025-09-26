// pages/Login.jsx - Fixed version to prevent infinite loops
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES, BOOKING_STEPS } from '../utils/constants';
import {
  PhoneIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

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
    setTimeout(() => {
      onComplete(testOTP.join(''));
    }, 500);
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
            autoFocus={index === 0}
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
  
  // Prevent infinite redirects
  const [redirectHandled, setRedirectHandled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    isAuthenticated,
    authCheckComplete,
    pendingBooking,
    bookingStep,
    login,
    loading: authLoading
  } = useAuth();

  // Enhanced URL parameter handling - memoized to prevent recalculation
  const urlInfo = React.useMemo(() => {
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get('returnUrl');
    const bikeId = params.get('bikeId');
    const action = params.get('action');
    
    return {
      returnUrl,
      returnPath: returnUrl ? decodeURIComponent(returnUrl) : null,
      bikeId,
      action,
      hasBookingIntent: !!(bikeId && action)
    };
  }, [location.search]);

  // Enhanced redirect logic after successful login - prevent loops
  const handleSuccessfulLogin = React.useCallback(() => {
    if (redirectHandled) return;
    
    console.log('🚀 LOGIN - Handling successful login redirect');
    setRedirectHandled(true);
    
    let redirectPath = ROUTES.RENTAL;
    
    if (urlInfo.returnUrl) {
      redirectPath = decodeURIComponent(urlInfo.returnUrl);
      console.log('🔄 LOGIN - Redirecting to return URL:', redirectPath);
    } else if (pendingBooking) {
      switch (bookingStep) {
        case BOOKING_STEPS.CHECKOUT:
          if (pendingBooking.bikeId) {
            redirectPath = `/rental/booking/${pendingBooking.bikeId}`;
          }
          break;
        case BOOKING_STEPS.BIKES:
          redirectPath = `${ROUTES.RENTAL}/bikes`;
          break;
        default:
          redirectPath = ROUTES.RENTAL;
      }
      console.log('📋 LOGIN - Redirecting based on pending booking:', redirectPath);
    } else if (urlInfo.hasBookingIntent) {
      if (urlInfo.action === 'book' && urlInfo.bikeId) {
        redirectPath = `/rental/bike/${urlInfo.bikeId}`;
      } else {
        redirectPath = `${ROUTES.RENTAL}/bikes`;
      }
      console.log('🎯 LOGIN - Redirecting based on URL booking intent:', redirectPath);
    }
    
    setSuccess('Login successful! Redirecting...');
    
    setTimeout(() => {
      console.log('🔀 LOGIN - Navigating to:', redirectPath);
      navigate(redirectPath, { replace: true });
    }, 1000);
  }, [redirectHandled, urlInfo, pendingBooking, bookingStep, navigate]);

  // Redirect if already authenticated - prevent infinite loops
  useEffect(() => {
    if (isAuthenticated && authCheckComplete && !redirectHandled) {
      console.log('✅ LOGIN - User already authenticated, triggering redirect');
      handleSuccessfulLogin();
    }
  }, [isAuthenticated, authCheckComplete, redirectHandled, handleSuccessfulLogin]);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Form validation
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

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');
    setOtpError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate OTP sending - replace with actual API call if needed
      console.log('📱 LOGIN - Sending OTP to:', phoneNumber);
      setSuccess('OTP sent successfully! Use test OTP: 1234');
      setStep('otp');
      setCountdown(30);
      
    } catch (err) {
      console.error('❌ LOGIN - Send OTP error:', err);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced OTP verification using AuthContext login
  const handleVerifyOTP = async (otpCode) => {
    console.log('🔐 LOGIN - Verifying OTP:', otpCode);
    setOtpLoading(true);
    setOtpError('');
    
    try {
      const result = await login(phoneNumber.trim(), otpCode);
      
      if (result.success) {
        console.log('✅ LOGIN - OTP verification successful');
        handleSuccessfulLogin();
      } else {
        console.error('❌ LOGIN - OTP verification failed:', result.message);
        setOtpError(result.message || 'Invalid OTP. Please try again.');
      }
      
    } catch (err) {
      console.error('💥 LOGIN - Verify OTP error:', err);
      setOtpError('Invalid OTP. Please try again. (Test OTP: 1234)');
    } finally {
      setOtpLoading(false);
    }
  };

  // Show loading screen while auth is being checked
  if (authLoading || !authCheckComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        
        {/* Token Display in Console */}
        {isAuthenticated && (
          <script>
            {console.log('🔑 CURRENT TOKEN:', localStorage.getItem('auth_token'))}
          </script>
        )}
        
        {debugMode && (
          <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-xs">
            <div className="flex justify-between items-center mb-2">
              <strong>Debug Panel</strong>
              <button onClick={() => setDebugMode(false)} className="text-red-600 hover:text-red-800">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p><strong>Step:</strong> {step}</p>
                <p><strong>Phone:</strong> {phoneNumber}</p>
                <p><strong>Auth:</strong> {isAuthenticated ? '✅' : '❌'}</p>
                <p><strong>Token:</strong> {localStorage.getItem('auth_token') ? '✅' : '❌'}</p>
              </div>
              <div>
                <p><strong>Return URL:</strong> {urlInfo.returnPath || 'None'}</p>
                <p><strong>Redirect Handled:</strong> {redirectHandled ? '✅' : '❌'}</p>
                <p><strong>Test OTP:</strong> <span className="font-mono font-bold text-green-600">1234</span></p>
              </div>
            </div>
          </div>
        )}

        {step === 'phone' ? (
          // PHONE NUMBER STEP
          <>
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <PhoneIcon className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your VegoBike account with OTP</p>
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
              <form onSubmit={handleSendOTP} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                    <svg className="h-5 w-5 text-red-400 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                    <span>{success}</span>
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
                      name="phoneNumber"
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      className="block w-full pl-16 pr-3 py-4 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-lg"
                      placeholder="Enter your 10-digit phone number"
                      maxLength="10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    We'll send you a 4-digit verification code via SMS
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || phoneNumber.length !== 10}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                  <Link
                    to={`${ROUTES.REGISTER}${location.search}`}
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </>
        ) : (
          // OTP VERIFICATION STEP
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
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
              <div className="space-y-6">
                {otpError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                    <svg className="h-5 w-5 text-red-400 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{otpError}</span>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
                    <span>{success}</span>
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
                    showHint={debugMode}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {otpLoading ? 'Verifying...' : 'Code will auto-submit when complete'}
                  </p>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="flex items-center justify-center text-gray-600 hover:text-gray-500 font-medium mx-auto transition-colors duration-200"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Change Phone Number
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            By continuing, you agree to VegoBike's Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
