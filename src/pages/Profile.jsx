// pages/Profile.jsx - UPDATED WITH DOCUMENT VERIFICATION
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
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  StarIcon,
  CogIcon,
  Bars3Icon,
  CalendarIcon,
  CameraIcon
} from '@heroicons/react/24/outline';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Sidebar menu items[web:26][web:27]
  const sidebarMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      iconComponent: HomeIcon,
      action: () => navigate('/rental')
    },
    {
      id: 'bookings',
      label: 'My Bookings',
      icon: '🗓️',
      iconComponent: BookOpenIcon,
      action: () => navigate('/rental/my-bookings')
    },
    {
      id: 'support',
      label: 'Help & Support',
      icon: '🛠️',
      iconComponent: QuestionMarkCircleIcon,
      action: () => navigate('/support')
    },
    {
      id: 'account',
      label: 'My Account',
      icon: '👤',
      iconComponent: UserIcon,
      active: true
    },
    {
      id: 'documents',
      label: 'Document Verification',
      icon: '📂',
      iconComponent: DocumentIcon,
      action: () => navigate('/document-verification')
    },
    {
      id: 'rate',
      label: 'Rate Us',
      icon: '⭐',
      iconComponent: StarIcon,
      action: () => navigate('/rate-us')
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: '🔓',
      iconComponent: ArrowRightOnRectangleIcon,
      action: handleLogout,
      className: 'logout-item'
    },
    {
      id: 'other',
      label: 'Other Services',
      icon: '🟡🟡',
      iconComponent: CogIcon,
      action: () => navigate('/other-services'),
      highlight: true
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    if (hasFetchedRef.current) return;

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
        navigate('/login', { replace: true });
        return;
      }

      const result = await api.get(API_ENDPOINTS.AUTH.PROFILE, {
        signal: abortControllerRef.current.signal
      });

      let userData = null;
      if (result.success && result.data) {
        userData = result.data.data || result.data;
      }

      if (!userData || !userData.id) {
        throw new Error('Invalid response structure from server');
      }

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
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') return;
      
      const status = err.response?.status;
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load profile';
      
      if (status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        showNotification('Session expired', NOTIFICATION_TYPES.ERROR);
        setTimeout(() => navigate('/login', { replace: true }), 1500);
        return;
      }
      
      setError(errorMsg);
      showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshProfile = async () => {
    setRefreshing(true);
    hasFetchedRef.current = false;
    
    try {
      await loadProfile();
      showNotification('Profile refreshed successfully', NOTIFICATION_TYPES.SUCCESS);
    } catch (err) {
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
          errors.ifsc = 'Invalid IFSC code';
        } else {
          delete errors.ifsc;
        }
        break;
      case 'accountNumber':
        if (value && value.trim() && !/^\d{9,18}$/.test(value.trim())) {
          errors.accountNumber = 'Invalid account number';
        } else {
          delete errors.accountNumber;
        }
        break;
      case 'upiId':
        if (value && value.trim() && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/.test(value.trim())) {
          errors.upiId = 'Invalid UPI ID';
        } else {
          delete errors.upiId;
        }
        break;
      case 'alternateNumber':
        if (value && value.trim() && !/^[6-9]\d{9}$/.test(value.trim())) {
          errors.alternateNumber = 'Invalid phone number';
        } else {
          delete errors.alternateNumber;
        }
        break;
      default:
        break;
    }

    setValidationErrors(errors);
  };

  const handleSaveProfile = async () => {
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix validation errors');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const updateData = {
        name: formData.name?.trim() || null,
        address: formData.address?.trim() || null,
        accountNumber: formData.accountNumber?.trim() || null,
        ifsc: formData.ifsc?.trim()?.toUpperCase() || null,
        upiId: formData.upiId?.trim() || null,
        alternateNumber: formData.alternateNumber?.trim() || null,
        profile: formData.profile?.trim() || null
      };

      const result = await api.put(API_ENDPOINTS.AUTH.PROFILE, updateData);
      const updatedData = result.data?.data || result.data;

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
      
      if (updateUserProfile) {
        updateUserProfile(updatedData);
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      showNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
    } finally {
      setSaving(false);
    }
  };

  async function handleLogout() {
    try {
      await logout();
      showNotification('Logged out successfully', NOTIFICATION_TYPES.SUCCESS);
      navigate('/login');
    } catch (err) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      navigate('/login');
    }
  }

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
      return new Date(dateString).toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    } catch {
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
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-gray-700 font-semibold">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <ExclamationTriangleIcon className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Unable to Load Profile</h3>
          <button onClick={handleRefreshProfile} className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex">
        
        {/* Sidebar Navigation[web:26][web:27] */}
        <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'} overflow-hidden`}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 py-6 overflow-y-auto">
              {sidebarMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`w-full flex items-center gap-4 px-6 py-4 transition-all hover:bg-gray-50 ${
                    item.active ? 'bg-indigo-50 border-r-4 border-indigo-600' : ''
                  } ${item.highlight ? 'bg-blue-50' : ''} ${
                    item.className === 'logout-item' ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {sidebarOpen && (
                    <span className={`font-medium text-sm ${item.active ? 'text-indigo-700 font-semibold' : ''}`}>
                      {item.label}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-lg"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* Main Content */}
        <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
              <div className="h-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"></div>

              <div className="relative px-6 pb-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-20">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-indigo-100 to-purple-100">
                      {profileData.profile ? (
                        <img src={profileData.profile} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                          <UserIcon className="h-16 w-16 text-white" />
                        </div>
                      )}
                    </div>
                    <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg">
                      <CameraIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex-1 sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      {profileData.name || 'User Profile'}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mb-3 justify-center sm:justify-start">
                      <div className="flex items-center text-gray-600">
                        <PhoneIcon className="h-4 w-4 mr-1.5" />
                        <span className="text-sm">+91 {profileData.phoneNumber}</span>
                      </div>
                      {profileData.email && (
                        <div className="flex items-center text-gray-600">
                          <EnvelopeIcon className="h-4 w-4 mr-1.5" />
                          <span className="text-sm">{profileData.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                        {getRoleName(profileData.roleId)}
                      </span>
                      {getStatusBadge(profileData.isActive)}
                      {getVerificationBadge(profileData.isDocumentVerified)}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg"
                      >
                        <PencilIcon className="h-4 w-4 inline mr-2" />
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button onClick={handleCancelEdit} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl">
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-xl p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-xl p-4">
                <p className="text-green-700">{success}</p>
              </div>
            )}

            {/* Form Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Info Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <UserIcon className="h-6 w-6 text-indigo-600 mr-3" />
                    Personal Information
                  </h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-xl ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                      />
                      {validationErrors.name && <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={profileData.phoneNumber ? `+91 ${profileData.phoneNumber}` : ''}
                        disabled
                        className="w-full px-4 py-3 border rounded-xl bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Alternate Number</label>
                      <input
                        type="tel"
                        name="alternateNumber"
                        value={formData.alternateNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-xl ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                      />
                      {validationErrors.alternateNumber && <p className="mt-1 text-sm text-red-600">{validationErrors.alternateNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-xl ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Banking Details */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <BanknotesIcon className="h-6 w-6 text-emerald-600 mr-3" />
                    Banking Details
                  </h2>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                      <input
                        type="text"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-xl ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">IFSC Code</label>
                      <input
                        type="text"
                        name="ifsc"
                        value={formData.ifsc}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-xl uppercase ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">UPI ID</label>
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border rounded-xl ${isEditing ? 'bg-white' : 'bg-gray-50'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Account Status</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 rounded-xl">
                      {getStatusBadge(profileData.isActive)}
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      {getVerificationBadge(profileData.isDocumentVerified)}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                  <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/document-verification')}
                      className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold text-sm"
                    >
                      📄 Upload Documents
                    </button>
                    <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold text-sm">
                      🔔 Notifications
                    </button>
                    <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold text-sm">
                      🔐 Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
