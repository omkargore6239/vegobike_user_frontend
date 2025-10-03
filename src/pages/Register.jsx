// pages/Register.jsx - COMPLETE with form and correct data submission
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  PhotoIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

import { api, showNotification, NOTIFICATION_TYPES } from '../utils/apiClient';
import {
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION,
  STORAGE_KEYS
} from '../utils/constants';

// ScrollToTop Component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    setIsVisible(window.pageYOffset > 300);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [toggleVisibility]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return isVisible ? (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
      aria-label="Scroll to top"
    >
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  ) : null;
};

// OTP Input Component
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

// Main Registration Component
const Register = () => {
  const [step, setStep] = useState('registration');
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    alternateNumber: '',
    email: '',
    address: '',
    accountNumber: '',
    ifsc: '',
    upiId: '',
    password: '',
    roleId: 3,
    storeId: 0,
    profileImage: null,
    profileImagePreview: null
  });
  
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [registrationData, setRegistrationData] = useState(null);
  const [debugMode, setDebugMode] = useState(true);
  const [developmentMode, setDevelopmentMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [retryCount, setRetryCount] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const topRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'profileImage') {
      const file = files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          setError('Profile image must be less than 2MB');
          return;
        }
        if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
          setError('Please select a valid image file (JPG, PNG, WebP)');
          return;
        }
        setFormData(prev => ({
          ...prev,
          profileImage: file,
          profileImagePreview: URL.createObjectURL(file)
        }));
      }
    } else {
      let processedValue = value;
      if (name === 'phoneNumber' || name === 'alternateNumber') {
        processedValue = value.replace(/\D/g, '').slice(0, 10);
      }
      if (name === 'accountNumber') {
        processedValue = value.replace(/\D/g, '');
      }
      if (name === 'ifsc') {
        processedValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
      }
      if (name === 'email') {
        processedValue = value.toLowerCase().trim();
      }
      if (name === 'name') {
        processedValue = value.replace(/[^a-zA-Z\s]/g, '');
      }
      
      setFormData(prev => ({ ...prev, [name]: processedValue }));
      validateField(name, processedValue);
    }
    
    if (error) setError('');
  };

  const validateField = (fieldName, value) => {
    const newValidationErrors = { ...validationErrors };

    switch (fieldName) {
      case 'name':
        if (!value.trim()) {
          newValidationErrors.name = 'Full name is required';
        } else if (value.trim().length < 2) {
          newValidationErrors.name = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          newValidationErrors.name = 'Name can only contain letters and spaces';
        } else {
          delete newValidationErrors.name;
        }
        break;

      case 'email':
        if (!value.trim()) {
          newValidationErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          newValidationErrors.email = 'Please enter a valid email address';
        } else {
          delete newValidationErrors.email;
        }
        break;

      case 'phoneNumber':
        if (!value.trim()) {
          newValidationErrors.phoneNumber = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(value.trim())) {
          newValidationErrors.phoneNumber = 'Phone number must be 10 digits starting with 6-9';
        } else {
          delete newValidationErrors.phoneNumber;
        }
        break;

      case 'alternateNumber':
        if (value.trim() && !/^[6-9]\d{9}$/.test(value.trim())) {
          newValidationErrors.alternateNumber = 'Alternate number must be 10 digits starting with 6-9';
        } else {
          delete newValidationErrors.alternateNumber;
        }
        break;

      case 'ifsc':
        if (value.trim() && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.trim())) {
          newValidationErrors.ifsc = 'Please enter a valid IFSC code (e.g., SBIN0123456)';
        } else {
          delete newValidationErrors.ifsc;
        }
        break;

      default:
        break;
    }

    setValidationErrors(newValidationErrors);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber.trim())) {
      errors.phoneNumber = 'Phone number must be 10 digits starting with 6-9';
    }

    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setError('Please fix the errors below and try again.');
      return false;
    }
    
    return true;
  };

  // ✅ CRITICAL FIX: Send data as JSON string in 'data' field
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const formDataPayload = new FormData();
      
      // ✅ Create JSON object
      const registrationPayload = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        alternateNumber: formData.alternateNumber.trim() || null,
        address: formData.address.trim() || null,
        accountNumber: formData.accountNumber.trim() || null,
        ifsc: formData.ifsc.trim() || null,
        upiId: formData.upiId.trim() || null,
        password: null,
        roleId: 3,
        storeId: 0
      };
      
      // ✅ FIX: Send as JSON string in 'data' field
      formDataPayload.append('data', JSON.stringify(registrationPayload));
      
      if (formData.profileImage) {
        formDataPayload.append('profileImage', formData.profileImage);
      }

      console.log('📤 Sending registration OTP');
      console.log('📦 Data:', registrationPayload);

      const result = await api.upload(API_ENDPOINTS.AUTH.SEND_REGISTRATION_OTP, formDataPayload);
      
      console.log('✅ Response:', result);
      
      if (result && (result.status === 'true' || result.success !== false)) {
        const responseData = result.data || result;
        setSuccess(responseData.message || 'OTP sent successfully');
        setRegistrationData(registrationPayload);
        setDevelopmentMode(responseData.developmentMode === 'true' || false);
        
        setTimeout(() => {
          setStep('otp-verification');
          setCountdown(30);
          window.scrollTo(0, 0);
        }, 500);
      } else {
        throw new Error(result?.message || 'Failed to send OTP');
      }

    } catch (err) {
      console.error('❌ Error:', err);
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.status === 409) {
        errorMessage = 'Phone number already registered. Please login.';
      } else {
        errorMessage = err.response?.data?.message || err.message || errorMessage;
      }
      
      setError(errorMessage);
      showNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otpCode) => {
  if (!otpCode || otpCode.length !== 4) {
    setError('Please enter a valid 4-digit OTP');
    return;
  }

    setOtpLoading(true);
    setError('');

    try {
    console.log('🔐 REGISTER - Verifying OTP:', otpCode);

    const result = await api.post(API_ENDPOINTS.AUTH.VERIFY_REGISTRATION_OTP, {
      phoneNumber: formData.phoneNumber.trim(),
      otp: otpCode.trim()
    });

    console.log('✅ REGISTER - Verification Response:', result);

    // ✅ Check for successful response
    if (result && (result.status === 'true' || result.success === true || result.token)) {
      const { token, user, message } = result;
      
      // ✅ CRITICAL: Store JWT token immediately
      if (token) {
        console.log('🔐 Storing JWT token in localStorage');
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      }
      
      // ✅ CRITICAL: Store user data
      if (user) {
        console.log('👤 Storing user data in localStorage');
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      } else {
        // Create minimal user object if backend doesn't send user data
        const minimalUser = {
          phoneNumber: formData.phoneNumber,
          name: formData.name,
          email: formData.email,
          roleId: 3
        };
        console.log('👤 Storing minimal user data in localStorage');
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(minimalUser));
      }
      
      setSuccess(message || 'Registration successful! Logging you in...');
      showNotification(message || 'Welcome to VegoBike!', NOTIFICATION_TYPES.SUCCESS);
      
      // ✅ Auto-login: Navigate directly to home
      setTimeout(() => {
        console.log('🚀 Navigating to home page after successful registration');
        window.location.href = '/'; // Force full page reload to update auth state
      }, 1500);
      
    } else {
      throw new Error(result?.message || 'Verification failed');
    }

  } catch (err) {
    console.error('❌ REGISTER - Verification Error:', err);
    setError(err.response?.data?.message || err.message || 'Verification failed');
    setRetryCount(prev => prev + 1);
  } finally {
    setOtpLoading(false);
  }
};

  const handleResendOTP = async () => {
    if (!registrationData) {
      setError('Registration data not found. Please restart.');
      return;
    }

    setOtpLoading(true);
    setError('');

    try {
      const formDataPayload = new FormData();
      formDataPayload.append('data', JSON.stringify(registrationData));
      
      if (formData.profileImage) {
        formDataPayload.append('profileImage', formData.profileImage);
      }

      const result = await api.upload(API_ENDPOINTS.AUTH.SEND_REGISTRATION_OTP, formDataPayload);
      
      if (result && (result.status === 'true' || result.success !== false)) {
        setSuccess('OTP resent successfully');
        setCountdown(30);
      } else {
        setError('Failed to resend OTP');
      }
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  // OTP Verification View
  if (step === 'otp-verification') {
    return (
      <>
        <ScrollToTop />
        <div ref={topRef} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            {debugMode && (
              <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-xs">
                <div className="flex justify-between items-center mb-2">
                  <strong>Debug - OTP Verification</strong>
                  <button onClick={() => setDebugMode(false)} className="text-red-600 hover:text-red-800">✕</button>
                </div>
                <p><strong>Phone:</strong> {formData.phoneNumber}</p>
                <p><strong>Test OTP:</strong> 1234</p>
              </div>
            )}

            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Phone</h2>
              <p className="text-gray-600 mb-2">Enter the 4-digit code sent to</p>
              <p className="text-indigo-600 font-semibold">+91 {formData.phoneNumber}</p>
              {developmentMode && (
                <p className="text-sm text-green-600 mt-2 font-medium">🧪 Test OTP: 1234</p>
              )}
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
              <div className="space-y-6">
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
                      <span>Resend in {countdown}s</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={otpLoading}
                      className="text-indigo-600 hover:text-indigo-500 font-medium disabled:opacity-50 text-sm"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <div className="text-center pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('registration');
                      setError('');
                      setSuccess('');
                    }}
                    className="flex items-center justify-center text-gray-600 hover:text-gray-500 font-medium mx-auto text-sm"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Change Phone Number
                  </button>
                </div>

                {retryCount >= 2 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-blue-800">Having trouble?</h3>
                        <p className="text-sm text-blue-700 mt-1">Try logging in if your account was already created.</p>
                        <button
                          onClick={() => navigate('/login')}
                          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mt-2"
                        >
                          Go to Login
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Registration Form View
  return (
    <>
      <ScrollToTop />
      <div ref={topRef} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          
          {debugMode && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-xs">
              <div className="flex justify-between items-center mb-2">
                <strong>Debug - Registration</strong>
                <button onClick={() => setDebugMode(false)} className="text-red-600 hover:text-red-800">✕</button>
              </div>
              <p><strong>Endpoint:</strong> {API_ENDPOINTS.AUTH.SEND_REGISTRATION_OTP}</p>
              <p><strong>Backend:</strong> {API_ENDPOINTS.BASE_URL}</p>
            </div>
          )}

          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <UserIcon className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-600 mb-2">Join VegoBike with OTP verification</p>
            <p className="text-sm text-indigo-600 font-medium">🔒 No password required</p>
            <p className="mt-4 text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            <form onSubmit={handleInitialSubmit} className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                        validationErrors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {validationErrors.name && <p className="text-xs text-red-600 mt-1">{validationErrors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                        validationErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {validationErrors.email && <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
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
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      maxLength={10}
                      required
                      className={`block w-full pl-16 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                        validationErrors.phoneNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                      }`}
                      placeholder="9876543210"
                    />
                  </div>
                  {validationErrors.phoneNumber && <p className="text-xs text-red-600 mt-1">{validationErrors.phoneNumber}</p>}
                </div>

                {/* Alternate Number */}
                <div>
                  <label htmlFor="alternateNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                    Alternate Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">+91</span>
                    </div>
                    <input
                      id="alternateNumber"
                      name="alternateNumber"
                      type="tel"
                      value={formData.alternateNumber}
                      onChange={handleChange}
                      maxLength={10}
                      className={`block w-full pl-16 pr-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                        validationErrors.alternateNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                      }`}
                      placeholder="Optional"
                    />
                  </div>
                  {validationErrors.alternateNumber && <p className="text-xs text-red-600 mt-1">{validationErrors.alternateNumber}</p>}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none"
                    placeholder="Enter your address (optional)"
                  />
                </div>
              </div>

              {/* Banking Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BanknotesIcon className="h-5 w-5 text-indigo-600 mr-2" />
                  Banking Information (Optional)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      id="accountNumber"
                      name="accountNumber"
                      type="text"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      placeholder="Enter account number"
                    />
                  </div>

                  <div>
                    <label htmlFor="ifsc" className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code
                    </label>
                    <input
                      id="ifsc"
                      name="ifsc"
                      type="text"
                      value={formData.ifsc}
                      onChange={handleChange}
                      maxLength={11}
                      className={`block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                        validationErrors.ifsc ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                      }`}
                      placeholder="SBIN0123456"
                    />
                    {validationErrors.ifsc && <p className="text-xs text-red-600 mt-1">{validationErrors.ifsc}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID
                    </label>
                    <input
                      id="upiId"
                      name="upiId"
                      type="text"
                      value={formData.upiId}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                      placeholder="yourname@paytm"
                    />
                  </div>
                </div>
              </div>

              {/* Profile Image */}
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profile Image
                </label>
                <div className="flex items-center space-x-4">
                  {formData.profileImagePreview ? (
                    <img
                      src={formData.profileImagePreview}
                      alt="Profile preview"
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                      <PhotoIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <input
                    id="profileImage"
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Max 2MB, JPG/PNG/WebP</p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || Object.keys(validationErrors).length > 0}
                  className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="h-5 w-5 mr-2" />
                      Register with OTP
                    </>
                  )}
                </button>
              </div>

              {/* Security Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Passwordless & Secure</p>
                    <p>Register with OTP - No password needed!</p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
