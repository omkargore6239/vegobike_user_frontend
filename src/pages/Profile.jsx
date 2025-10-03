// pages/Profile.jsx - PROFESSIONAL DESIGN VERSION
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, showNotification, NOTIFICATION_TYPES } from '../utils/apiClient';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';
import {
  UserIcon,
  PencilIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BanknotesIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  DocumentIcon,
  CreditCardIcon,
  IdentificationIcon,
  CalendarIcon,
  ClockIcon,
  HashtagIcon,
  CameraIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import DocumentUpload from '../components/rental/DocumentUpload';

const Profile = () => {
  const { user, isAuthenticated, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const hasFetchedRef = useRef(false);
  const abortControllerRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    accountNumber: '',
    ifsc: '',
    upiId: '',
    alternateNumber: '',
    profile: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check URL for tab parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'documents') {
      setActiveTab('documents');
    }
  }, [location]);

  // Load profile data on mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (hasFetchedRef.current) {
      return;
    }

    loadProfile();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isAuthenticated, navigate]);

  const loadProfile = async () => {
    hasFetchedRef.current = true;
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError('');

      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) {
        console.error('❌ No authentication token found');
        navigate('/login', { replace: true });
        return;
      }

      console.log('🔐 PROFILE - Fetching profile data');

      const result = await api.get(API_ENDPOINTS.AUTH.PROFILE, {
        signal: abortControllerRef.current.signal
      });

      console.log('📊 PROFILE - API Response:', result);

      let userData = null;

      if (result.success && result.data) {
        if (result.data.data) {
          userData = result.data.data;
        } else if (result.data.id) {
          userData = result.data;
        }
      }

      console.log('✅ Extracted user data:', userData);

      if (!userData || !userData.id) {
        throw new Error('Invalid response structure from server');
      }

      console.log('✅ User profile loaded:', {
        id: userData.id,
        name: userData.name,
        phone: userData.phoneNumber,
        email: userData.email,
      });

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      
      setProfileData(userData);
      setFormData({
        name: userData.name || '',
        address: userData.address || '',
        accountNumber: userData.accountNumber || '',
        ifsc: userData.ifsc || '',
        upiId: userData.upiId || '',
        alternateNumber: userData.alternateNumber || '',
        profile: userData.profile || ''
      });

      if (updateUserProfile) {
        updateUserProfile(userData);
      }

      setSuccess('Profile loaded successfully!');
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        return;
      }
      
      const status = err.response?.status;
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load profile';
      
      console.error('❌ PROFILE - Error:', { status, errorMsg, err });
      
      if (status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setError('Session expired. Please log in again.');
        showNotification('Session expired', NOTIFICATION_TYPES.ERROR);
        setTimeout(() => navigate('/login', { replace: true }), 1500);
        return;
      }
      
      const cachedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          console.log('📦 Using cached user data');
          setProfileData(parsedUser);
          setFormData({
            name: parsedUser.name || '',
            address: parsedUser.address || '',
            accountNumber: parsedUser.accountNumber || '',
            ifsc: parsedUser.ifsc || '',
            upiId: parsedUser.upiId || '',
            alternateNumber: parsedUser.alternateNumber || '',
            profile: parsedUser.profile || ''
          });
          setError('Showing cached data. Unable to fetch latest profile.');
          showNotification('Using cached data', NOTIFICATION_TYPES.WARNING);
        } catch (e) {
          console.error('Error parsing cached user:', e);
          setError('Failed to load profile. Please try again.');
        }
      } else {
        setError(errorMsg);
        showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
      }
      
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshProfile = async () => {
    setRefreshing(true);
    setError('');
    setSuccess('');
    hasFetchedRef.current = false;
    
    try {
      await loadProfile();
      showNotification('Profile refreshed successfully', NOTIFICATION_TYPES.SUCCESS);
    } catch (err) {
      console.error('Error refreshing profile:', err);
      setError('Failed to refresh profile');
      showNotification('Failed to refresh profile', NOTIFICATION_TYPES.ERROR);
    } finally {
      setRefreshing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
    if (error) setError('');
  };

  const validateField = (fieldName, value) => {
    const errors = { ...validationErrors };

    switch (fieldName) {
      case 'name':
        if (value && value.trim().length > 0 && value.trim().length < 2) {
          errors.name = 'Name must be at least 2 characters';
        } else if (value && value.trim().length > 0 && !/^[a-zA-Z\s]+$/.test(value.trim())) {
          errors.name = 'Name can only contain letters and spaces';
        } else {
          delete errors.name;
        }
        break;
      case 'ifsc':
        if (value && value.trim() && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value.trim().toUpperCase())) {
          errors.ifsc = 'Invalid IFSC code (e.g., SBIN0123456)';
        } else {
          delete errors.ifsc;
        }
        break;
      case 'accountNumber':
        if (value && value.trim() && !/^\d{9,18}$/.test(value.trim())) {
          errors.accountNumber = 'Invalid account number (9-18 digits)';
        } else {
          delete errors.accountNumber;
        }
        break;
      case 'upiId':
        if (value && value.trim() && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(value.trim())) {
          errors.upiId = 'Invalid UPI ID (e.g., user@paytm)';
        } else {
          delete errors.upiId;
        }
        break;
      case 'alternateNumber':
        if (value && value.trim() && !/^[6-9]\d{9}$/.test(value.trim())) {
          errors.alternateNumber = 'Invalid phone number (10 digits starting with 6-9)';
        } else {
          delete errors.alternateNumber;
        }
        break;
      case 'address':
        if (value && value.trim().length > 200) {
          errors.address = 'Address cannot exceed 200 characters';
        } else {
          delete errors.address;
        }
        break;
      default:
        break;
    }

    setValidationErrors(errors);
  };

  const handleSaveProfile = async () => {
    const hasErrors = Object.keys(validationErrors).length > 0;
    if (hasErrors) {
      setError('Please fix validation errors before saving');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      const updateData = {
        name: formData.name?.trim() || null,
        address: formData.address?.trim() || null,
        accountNumber: formData.accountNumber?.trim() || null,
        ifsc: formData.ifsc?.trim()?.toUpperCase() || null,
        upiId: formData.upiId?.trim() || null,
        alternateNumber: formData.alternateNumber?.trim() || null,
        profile: formData.profile?.trim() || null
      };

      console.log('📤 Updating profile with data:', updateData);

      const result = await api.put(API_ENDPOINTS.AUTH.PROFILE, updateData);

      console.log('✅ Profile update response:', result);

      let updatedData = null;

      if (result.success && result.data) {
        if (result.data.data) {
          updatedData = result.data.data;
        } else if (result.data.id) {
          updatedData = result.data;
        }
      }

      if (!updatedData) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedData));
      setProfileData(updatedData);
      setFormData({
        name: updatedData.name || '',
        address: updatedData.address || '',
        accountNumber: updatedData.accountNumber || '',
        ifsc: updatedData.ifsc || '',
        upiId: updatedData.upiId || '',
        alternateNumber: updatedData.alternateNumber || '',
        profile: updatedData.profile || ''
      });
      
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      showNotification('Profile updated successfully', NOTIFICATION_TYPES.SUCCESS);
      setTimeout(() => setSuccess(''), 3000);
      
      if (updateUserProfile) {
        updateUserProfile(updatedData);
      }

    } catch (err) {
      console.error('❌ Profile update error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
      setError(errorMessage);
      showNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showNotification('Logged out successfully', NOTIFICATION_TYPES.SUCCESS);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      navigate('/login');
    }
  };

  const handleCancelEdit = () => {
    if (profileData) {
      setFormData({
        name: profileData.name || '',
        address: profileData.address || '',
        accountNumber: profileData.accountNumber || '',
        ifsc: profileData.ifsc || '',
        upiId: profileData.upiId || '',
        alternateNumber: profileData.alternateNumber || '',
        profile: profileData.profile || ''
      });
    }
    setValidationErrors({});
    setError('');
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1: return 'Admin';
      case 2: return 'Store Manager';
      case 3: return 'User';
      default: return 'Unknown';
    }
  };

  const getStatusBadge = (status) => {
    if (status === 1 || status === true) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
          <CheckCircleIcon className="h-3.5 w-3.5 mr-1.5" />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
        <XCircleIcon className="h-3.5 w-3.5 mr-1.5" />
        Inactive
      </span>
    );
  };

  const getVerificationBadge = (isVerified) => {
    if (isVerified === 1 || isVerified === true) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
          <ShieldCheckIcon className="h-3.5 w-3.5 mr-1.5" />
          Verified
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
        <ExclamationTriangleIcon className="h-3.5 w-3.5 mr-1.5" />
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-indigo-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-700 font-semibold text-lg">Loading Profile...</p>
          <p className="mt-2 text-gray-500 text-sm">Please wait while we fetch your details</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Profile</h3>
          <p className="text-gray-600 mb-6">We couldn't fetch your profile data. Please try again.</p>
          <button
            onClick={handleRefreshProfile}
            disabled={refreshing}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg shadow-indigo-200"
          >
            {refreshing ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Professional Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-6">
          {/* Cover Background */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Profile Info Section */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-indigo-100 to-purple-100">
                  {profileData.profile ? (
                    <img
                      src={profileData.profile}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600" style={{display: profileData.profile ? 'none' : 'flex'}}>
                    <UserIcon className="h-16 w-16 text-white" />
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all">
                  <CameraIcon className="h-5 w-5 text-gray-700" />
                </button>
                {(profileData.isActive === 1 || profileData.isActive === true) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-lg"></div>
                )}
              </div>

              {/* User Details */}
              <div className="flex-1 text-center sm:text-left sm:ml-6 mt-4 sm:mt-0 sm:mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                      {profileData.name || 'User Profile'}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-3">
                      <div className="flex items-center text-gray-600">
                        <PhoneIcon className="h-4 w-4 mr-1.5" />
                        <span className="text-sm font-medium">+91 {profileData.phoneNumber}</span>
                      </div>
                      {profileData.email && (
                        <div className="flex items-center text-gray-600">
                          <EnvelopeIcon className="h-4 w-4 mr-1.5" />
                          <span className="text-sm font-medium">{profileData.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
                        <ShieldCheckIcon className="h-3.5 w-3.5 mr-1.5" />
                        {getRoleName(profileData.roleId)}
                      </span>
                      {getStatusBadge(profileData.isActive)}
                      {getVerificationBadge(profileData.isDocumentVerified)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <button
                      onClick={handleRefreshProfile}
                      disabled={refreshing}
                      className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all disabled:opacity-50 border border-gray-200"
                      title="Refresh Profile"
                    >
                      <ArrowPathIcon className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                    
                    {!isEditing ? (
                      <>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all font-semibold shadow-lg shadow-indigo-200 flex items-center"
                        >
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Edit Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="p-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all border border-red-200"
                          title="Logout"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleCancelEdit}
                          disabled={saving}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-semibold disabled:opacity-50 border border-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving || Object.keys(validationErrors).length > 0}
                          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all font-semibold shadow-lg shadow-emerald-200 flex items-center disabled:opacity-50"
                        >
                          {saving ? (
                            <>
                              <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="h-4 w-4 mr-2" />
                              Save
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">User ID</p>
                    <p className="text-lg font-bold text-gray-900">#{profileData.id}</p>
                  </div>
                  <HashtagIcon className="h-8 w-8 text-indigo-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Joined</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(profileData.createdAt)}</p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-emerald-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Updated</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(profileData.updatedAt)}</p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Role</p>
                    <p className="text-sm font-bold text-gray-900">{getRoleName(profileData.roleId)}</p>
                  </div>
                  <ShieldCheckIcon className="h-8 w-8 text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-lg">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-800 mb-1">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 rounded-xl p-4 shadow-lg">
            <div className="flex items-start">
              <CheckCircleIcon className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-bold text-emerald-800 mb-1">Success</h3>
                <p className="text-sm text-emerald-700">{success}</p>
              </div>
              <button onClick={() => setSuccess('')} className="text-emerald-400 hover:text-emerald-600">
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Modern Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
            <nav className="flex space-x-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <UserIcon className="h-5 w-5 inline-block mr-2" />
                Personal Details
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === 'documents'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <DocumentIcon className="h-5 w-5 inline-block mr-2" />
                Documents
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Profile Form - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <UserIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    Personal Information
                  </h2>
                </div>
                
                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                        isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      } ${validationErrors.name ? 'border-red-500 ring-2 ring-red-200' : ''}`}
                      placeholder="Enter your full name"
                    />
                    {validationErrors.name && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone Number (Read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.phoneNumber ? `+91 ${profileData.phoneNumber}` : 'Not provided'}
                        disabled
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">Phone number cannot be changed</p>
                  </div>

                  {/* Alternate Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alternate Phone Number
                    </label>
                    <div className="relative">
                      <DevicePhoneMobileIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="alternateNumber"
                        value={formData.alternateNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                        } ${validationErrors.alternateNumber ? 'border-red-500 ring-2 ring-red-200' : ''}`}
                        placeholder="9876543210"
                        maxLength={10}
                      />
                    </div>
                    {validationErrors.alternateNumber && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {validationErrors.alternateNumber}
                      </p>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={profileData.email || 'Not provided'}
                        disabled
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={3}
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                        } ${validationErrors.address ? 'border-red-500 ring-2 ring-red-200' : ''}`}
                        placeholder="Enter your complete address"
                        maxLength={200}
                      />
                    </div>
                    {validationErrors.address && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {validationErrors.address}
                      </p>
                    )}
                    <p className="mt-1.5 text-xs text-gray-500">{formData.address.length}/200 characters</p>
                  </div>
                </div>
              </div>

              {/* Banking Details Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                      <BanknotesIcon className="h-6 w-6 text-emerald-600" />
                    </div>
                    Banking Details
                  </h2>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Optional</span>
                </div>

                <div className="space-y-5">
                  {/* Account Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Number
                    </label>
                    <div className="relative">
                      <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                        } ${validationErrors.accountNumber ? 'border-red-500 ring-2 ring-red-200' : ''}`}
                        placeholder="Enter account number"
                        maxLength={18}
                      />
                    </div>
                    {validationErrors.accountNumber && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {validationErrors.accountNumber}
                      </p>
                    )}
                  </div>

                  {/* IFSC Code */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      IFSC Code
                    </label>
                    <div className="relative">
                      <BuildingLibraryIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="ifsc"
                        value={formData.ifsc}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all uppercase ${
                          isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                        } ${validationErrors.ifsc ? 'border-red-500 ring-2 ring-red-200' : ''}`}
                        placeholder="SBIN0123456"
                        maxLength={11}
                      />
                    </div>
                    {validationErrors.ifsc && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {validationErrors.ifsc}
                      </p>
                    )}
                  </div>

                  {/* UPI ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      UPI ID
                    </label>
                    <div className="relative">
                      <BanknotesIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                          isEditing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                        } ${validationErrors.upiId ? 'border-red-500 ring-2 ring-red-200' : ''}`}
                        placeholder="user@paytm"
                      />
                    </div>
                    {validationErrors.upiId && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        {validationErrors.upiId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Account Status Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Account Status
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Status</p>
                      {getStatusBadge(profileData.isActive)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Verification</p>
                      {getVerificationBadge(profileData.isDocumentVerified)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('documents')}
                    className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all font-semibold text-sm"
                  >
                    📄 Upload Documents
                  </button>
                  <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all font-semibold text-sm">
                    🔔 Manage Notifications
                  </button>
                  <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all font-semibold text-sm">
                    🔐 Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Document Upload Component
          <DocumentUpload userId={profileData.id} />
        )}
      </div>
    </div>
  );
};

export default Profile;
