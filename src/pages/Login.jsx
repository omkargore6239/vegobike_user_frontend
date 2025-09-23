import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  PhoneIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { apiClient } from '../utils/apiClient'; // Import our interceptor

// OTP Input Component
const OTPInput = ({ length = 4, onComplete, loading = false }) => {
  const inputRef = useRef([]);
  const [otp, setOTP] = useState(Array(length).fill(''));

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

    if (newOTP.every(digit => digit !== '')) {
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
    pastedData.split('').forEach((digit, index) => {
      if (index < length) newOTP[index] = digit;
    });
    
    setOTP(newOTP);
    
    const lastIndex = Math.min(pastedData.length - 1, length - 1);
    inputRef.current[lastIndex]?.focus();
    
    if (newOTP.every(digit => digit !== '')) {
      onComplete(newOTP.join(''));
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          ref={(ref) => (inputRef.current[index] = ref)}
          disabled={loading}
          className={`w-14 h-14 text-center text-xl font-semibold border-2 rounded-lg 
            ${otp[index] ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'} 
            focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200`}
          placeholder="•"
        />
      ))}
    </div>
  );
};

const Login = () => {
  const [step, setStep] = useState('login'); // 'login' or 'otp-verification'
  const [formData, setFormData] = useState({
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';
  const registrationMessage = location.state?.message;

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear errors when user types
  };

  // Validate phone number
  const validateForm = () => {
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (formData.phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Using our API client with interceptors
      const response = await apiClient.post('/api/auth/send-login-otp', {
        phoneNumber: formData.phoneNumber.trim(),
      });

      setSuccess('OTP sent successfully! Please check your phone.');
      setStep('otp-verification');
      setCountdown(30);
    } catch (err) {
      console.error('Send OTP error:', err);
      // Error is automatically handled by interceptor
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and complete login
  const handleVerifyOTP = async (otpCode) => {
    setOtpLoading(true);
    setError('');

    try {
      // Using our API client with interceptors
      const response = await apiClient.post('/api/auth/verify-login-otp', {
        phoneNumber: formData.phoneNumber.trim(),
        otp: otpCode,
      });

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      console.error('Verify OTP error:', err);
      // Error is automatically handled by interceptor
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setOtpLoading(true);
    setError('');

    try {
      await apiClient.post('/api/auth/send-login-otp', {
        phoneNumber: formData.phoneNumber.trim(),
      });

      setSuccess('OTP sent successfully! Please check your phone.');
      setCountdown(30);
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  // OTP Verification Step
  if (step === 'otp-verification') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Phone
            </h2>
            <p className="text-gray-600 mb-2">
              Enter the 4-digit code sent to
            </p>
            <p className="text-indigo-600 font-semibold">
              {formData.phoneNumber}
            </p>
          </div>

          {/* OTP Verification Form */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            {/* Alert Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center mb-6">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center mb-6">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* OTP Input */}
            <div className="space-y-6">
              <OTPInput 
                length={4} 
                onComplete={handleVerifyOTP}
                loading={otpLoading}
              />

              {/* Manual Verify Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    const otpInputs = document.querySelectorAll('input[type="text"][maxlength="1"]');
                    const otpValue = Array.from(otpInputs).map(input => input.value).join('');
                    if (otpValue.length === 4) {
                      handleVerifyOTP(otpValue);
                    } else {
                      setError('Please enter complete 4-digit OTP');
                    }
                  }}
                  disabled={otpLoading}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
                >
                  {otpLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                {countdown > 0 ? (
                  <div className="flex items-center justify-center text-gray-500">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>Resend OTP in {countdown}s</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={otpLoading}
                    className="text-indigo-600 hover:text-indigo-500 font-medium disabled:opacity-50"
                  >
                    {otpLoading ? 'Sending...' : 'Resend OTP'}
                  </button>
                )}
              </div>

              {/* Back Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="flex items-center justify-center text-gray-600 hover:text-gray-500 font-medium mx-auto"
                >
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Login Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <PhoneIcon className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to your VegoBike account with OTP
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Registration Success Message */}
        {registrationMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">{registrationMessage}</p>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <form onSubmit={handleSendOTP} className="space-y-6">
            {/* Alert Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Phone Number Input */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                  'Send OTP'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
