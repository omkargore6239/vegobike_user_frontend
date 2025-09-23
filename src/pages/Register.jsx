import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  PhotoIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8080';

// OTP Input Component
const OTPInput = ({ length = 4, onComplete, loading = false }) => {
  const inputRef = useRef([]);
  const [otp, setOTP] = useState(Array(length).fill(''));

  const handleChange = (value, index) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    // Auto focus next input
    if (value && index < length - 1) {
      inputRef.current[index + 1]?.focus();
    }

    // Auto focus previous input on backspace
    if (!value && index > 0) {
      inputRef.current[index - 1]?.focus();
    }

    // Call onComplete when all digits are filled
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
    
    // Focus the last filled input or next empty one
    const lastIndex = Math.min(pastedData.length - 1, length - 1);
    inputRef.current[lastIndex]?.focus();
    
    // If all digits filled, call onComplete
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

const Register = () => {
  const [step, setStep] = useState('registration'); // 'registration', 'otp-verification', 'final-registration'
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
    confirmPassword: '',
    profileImage: null,
    profileImagePreview: null
  });
  
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [registrationData, setRegistrationData] = useState(null);

  const navigate = useNavigate();

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
    const { name, value, files } = e.target;
    
    if (name === 'profileImage') {
      const file = files[0];
      if (file) {
        setFormData(prev => ({
          ...prev,
          profileImage: file,
          profileImagePreview: URL.createObjectURL(file)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      
      // Reset phone verification if phone number changes
      if (name === 'phoneNumber') {
        setPhoneVerified(false);
      }
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  // Handle initial registration submission (sends OTP)
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Create FormData for multipart request
      const payload = new FormData();
      
      // Add JSON data as string
      const registrationDataPayload = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        alternateNumber: formData.alternateNumber.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        accountNumber: formData.accountNumber.trim(),
        ifsc: formData.ifsc.trim(),
        upiId: formData.upiId.trim(),
        password: formData.password,
        roleId: 3, // User role
        storeId: 0, // Not a store manager
        profileImageName: formData.profileImage ? formData.profileImage.name : ''
      };
      
      payload.append('data', JSON.stringify(registrationDataPayload));
      
      // Add profile image if exists
      if (formData.profileImage) {
        payload.append('profileImage', formData.profileImage);
      }

      console.log('Sending registration OTP request to:', `${API_BASE_URL}/api/auth/send-registration-otp`);

      const response = await fetch(`${API_BASE_URL}/api/auth/send-registration-otp`, {
        method: 'POST',
        body: payload,
      });

      const result = await response.json();
      console.log('Registration OTP response:', result);

      if (response.ok) {
        setSuccess('Registration OTP sent successfully! Please check your phone.');
        setRegistrationData(registrationDataPayload);
        setStep('otp-verification');
        setCountdown(30);
      } else {
        setError(result.message || result.error || 'Failed to send registration OTP. Please try again.');
      }
    } catch (err) {
      console.error('Registration OTP error:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError('Network error. Please check your internet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and complete registration
  const handleVerifyOTP = async (otpCode) => {
    setOtpLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-registration-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber.trim(),
          otp: otpCode,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Registration completed successfully! Welcome to VegoBike.');
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Registration successful! Please login with your credentials.',
              email: formData.email 
            }
          });
        }, 2000);
      } else {
        setError(result.message || result.error || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError('Network error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setOtpLoading(true);
    setError('');

    try {
      // Recreate the FormData with the same registration data
      const payload = new FormData();
      payload.append('data', JSON.stringify(registrationData));
      
      if (formData.profileImage) {
        payload.append('profileImage', formData.profileImage);
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/send-registration-otp`, {
        method: 'POST',
        body: payload,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('OTP sent successfully! Please check your phone.');
        setCountdown(30);
      } else {
        setError(result.message || result.error || 'Failed to resend OTP');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Network error. Please try again.');
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
            <p className="text-sm text-gray-500 mt-2">
              Default OTP is set in backend for testing
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
                  onClick={() => setStep('registration')}
                  className="text-gray-600 hover:text-gray-500 font-medium"
                >
                  ← Back to Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Registration Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <UserIcon className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600">
            Join VegoBike and start your journey with us
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
          <form onSubmit={handleInitialSubmit} className="space-y-6">
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

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
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

              {/* Alternate Number */}
              <div>
                <label htmlFor="alternateNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                  Alternate Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="alternateNumber"
                    name="alternateNumber"
                    type="tel"
                    value={formData.alternateNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Alternate phone number"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>

            {/* Banking Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BanknotesIcon className="h-5 w-5 text-indigo-600 mr-2" />
                Banking Information (Optional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Number */}
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                    Bank Account Number
                  </label>
                  <input
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter account number"
                  />
                </div>

                {/* IFSC Code */}
                <div>
                  <label htmlFor="ifsc" className="block text-sm font-semibold text-gray-700 mb-2">
                    IFSC Code
                  </label>
                  <input
                    id="ifsc"
                    name="ifsc"
                    type="text"
                    value={formData.ifsc}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter IFSC code"
                  />
                </div>

                {/* UPI ID */}
                <div className="md:col-span-2">
                  <label htmlFor="upiId" className="block text-sm font-semibold text-gray-700 mb-2">
                    UPI ID
                  </label>
                  <input
                    id="upiId"
                    name="upiId"
                    type="text"
                    value={formData.upiId}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Enter your UPI ID"
                  />
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div className="border-t border-gray-200 pt-6">
              <label htmlFor="profileImage" className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Password Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pr-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pr-10 px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
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
                  'Send Registration OTP'
                )}
              </button>
            </div>

            {/* Terms */}
            <div className="text-center text-sm text-gray-500">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
