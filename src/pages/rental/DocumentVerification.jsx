// pages/rental/DocumentVerification.jsx - With Timestamps
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api, showNotification, NOTIFICATION_TYPES } from '../../utils/apiClient';
import { API_ENDPOINTS } from '../../utils/constants';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentIcon,
  CloudArrowUpIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const DocumentVerification = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState({
    adhaarFront: null,
    adhaarBack: null,
    drivingLicense: null
  });
  const [previews, setPreviews] = useState({
    adhaarFront: null,
    adhaarBack: null,
    drivingLicense: null
  });
  const [uploadStatus, setUploadStatus] = useState({
    adhaarFront: false,
    adhaarBack: false,
    drivingLicense: false
  });
  const [errors, setErrors] = useState({});
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [timestamps, setTimestamps] = useState({
    createdAt: null,
    updatedAt: null
  });

  const fileInputRefs = {
    adhaarFront: useRef(null),
    adhaarBack: useRef(null),
    drivingLicense: useRef(null)
  };

  useEffect(() => {
    loadExistingDocuments();
  }, []);

  const getUserId = () => {
    return user?.data?.id || user?.id || user?.userId;
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'Not available';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const getTimeDifference = (timestamp) => {
    if (!timestamp) return '';
    try {
      const now = new Date();
      const past = new Date(timestamp);
      const diffMs = now - past;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return formatDateTime(timestamp);
    } catch (error) {
      return '';
    }
  };

  const loadExistingDocuments = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      if (!userId) {
        console.warn('⚠️ No user ID found');
        return;
      }

      console.log('📄 Loading documents for user:', userId);

      // GET /api/documents/{userId}
      const response = await api.get(`/api/documents/${userId}`);
      
      console.log('📄 Documents loaded:', response);

      if (response.success && response.data) {
        const docs = response.data;
        
        // Set previews
        setPreviews({
          adhaarFront: docs.adhaarFrontImageUrl || null,
          adhaarBack: docs.adhaarBackImageUrl || null,
          drivingLicense: docs.drivingLicenseImageUrl || null
        });
        
        // Set upload status
        setUploadStatus({
          adhaarFront: !!docs.adhaarFrontImageUrl,
          adhaarBack: !!docs.adhaarBackImageUrl,
          drivingLicense: !!docs.drivingLicenseImageUrl
        });

        // Set timestamps
        setTimestamps({
          createdAt: docs.createdAt,
          updatedAt: docs.updatedAt
        });
        
        // Check verification status
        const allUploaded = docs.adhaarFrontImageUrl && docs.adhaarBackImageUrl && docs.drivingLicenseImageUrl;
        if (allUploaded) {
          setVerificationStatus('uploaded');
        }
      }
    } catch (error) {
      console.error('❌ Error loading documents:', error);
      if (error.response?.status !== 404) {
        showNotification('Could not load existing documents', NOTIFICATION_TYPES.WARNING);
      }
    } finally {
      setLoading(false);
    }
  };

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    if (!file) {
      return 'Please select a file';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, and PDF files are allowed';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }

    return null;
  };

  const handleFileSelect = (e, documentType) => {
    const file = e.target.files[0];
    const error = validateFile(file);

    if (error) {
      setErrors(prev => ({ ...prev, [documentType]: error }));
      showNotification(error, NOTIFICATION_TYPES.ERROR);
      return;
    }

    setErrors(prev => ({ ...prev, [documentType]: null }));
    setDocuments(prev => ({ ...prev, [documentType]: file }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews(prev => ({ ...prev, [documentType]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDocument = (documentType) => {
    setDocuments(prev => ({ ...prev, [documentType]: null }));
    setPreviews(prev => ({ ...prev, [documentType]: null }));
    setUploadStatus(prev => ({ ...prev, [documentType]: false }));
    if (fileInputRefs[documentType].current) {
      fileInputRefs[documentType].current.value = '';
    }
  };

  const handleUploadAllDocuments = async () => {
    try {
      setUploading(true);
      const userId = getUserId();

      if (!userId) {
        showNotification('User ID not found. Please login again.', NOTIFICATION_TYPES.ERROR);
        return;
      }

      // Check if at least one document is selected
      const hasDocuments = documents.adhaarFront || documents.adhaarBack || documents.drivingLicense;
      if (!hasDocuments) {
        showNotification('Please select at least one document to upload', NOTIFICATION_TYPES.WARNING);
        return;
      }

      console.log('📤 Uploading documents for user:', userId);

      // Create FormData
      const formData = new FormData();
      formData.append('userId', userId.toString());

      if (documents.adhaarFront) {
        formData.append('adhaarFront', documents.adhaarFront);
      }
      if (documents.adhaarBack) {
        formData.append('adhaarBack', documents.adhaarBack);
      }
      if (documents.drivingLicense) {
        formData.append('drivingLicense', documents.drivingLicense);
      }

      // POST /api/documents/upload-files with multipart/form-data
      const response = await api.post('/api/documents/upload-files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('✅ Upload response:', response);

      if (response.success || response.data) {
        showNotification('Documents uploaded successfully!', NOTIFICATION_TYPES.SUCCESS);
        
        // Update upload status for all uploaded documents
        if (documents.adhaarFront) {
          setUploadStatus(prev => ({ ...prev, adhaarFront: true }));
        }
        if (documents.adhaarBack) {
          setUploadStatus(prev => ({ ...prev, adhaarBack: true }));
        }
        if (documents.drivingLicense) {
          setUploadStatus(prev => ({ ...prev, drivingLicense: true }));
        }

        // Clear documents state but keep previews
        setDocuments({
          adhaarFront: null,
          adhaarBack: null,
          drivingLicense: null
        });

        // Reload to get updated URLs and timestamps
        setTimeout(() => loadExistingDocuments(), 1000);
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload documents';
      showNotification(errorMessage, NOTIFICATION_TYPES.ERROR);
    } finally {
      setUploading(false);
    }
  };

  const handleVerifyNow = async () => {
    const allUploaded = Object.values(uploadStatus).every(status => status);
    
    if (!allUploaded) {
      showNotification('Please upload all required documents before verification', NOTIFICATION_TYPES.WARNING);
      return;
    }

    try {
      setLoading(true);
      const userId = getUserId();
      
      // PATCH /api/documents/verify/{userId}
      const response = await api.patch(`/api/documents/verify/${userId}`, null, {
        params: {
          adhaarFrontStatus: 'PENDING',
          adhaarBackStatus: 'PENDING',
          licenseStatus: 'PENDING'
        }
      });
      
      console.log('✅ Verification response:', response);

      if (response.success || response.data) {
        showNotification('Verification request submitted successfully!', NOTIFICATION_TYPES.SUCCESS);
        setVerificationStatus('under_review');
        setTimeout(() => navigate('/profile'), 2000);
      }
    } catch (error) {
      console.error('❌ Verification error:', error);
      showNotification(error.response?.data?.message || 'Verification request failed', NOTIFICATION_TYPES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentLabel = (documentType) => {
    switch (documentType) {
      case 'adhaarFront': return 'Aadhaar Card Front';
      case 'adhaarBack': return 'Aadhaar Card Back';
      case 'drivingLicense': return 'Driving License';
      default: return documentType;
    }
  };

  const renderDocumentCard = (documentType, title) => {
    const hasPreview = !!previews[documentType];
    const isUploaded = uploadStatus[documentType];
    const hasError = !!errors[documentType];
    const hasNewFile = !!documents[documentType];

    return (
      <div className={`bg-white rounded-2xl shadow-lg border-2 transition-all ${
        hasError ? 'border-red-300' : isUploaded ? 'border-green-300' : 'border-gray-200'
      }`}>
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 flex items-center justify-between">
            {title}
            {isUploaded && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Uploaded
              </span>
            )}
          </h3>
        </div>

        <div className="p-6">
          {/* Preview Area */}
          <div className={`relative bg-gray-50 rounded-xl overflow-hidden mb-4 border-2 border-dashed ${
            hasPreview ? 'border-blue-300' : 'border-gray-300'
          }`} style={{ minHeight: '280px' }}>
            {hasPreview ? (
              <>
                <img 
                  src={previews[documentType]} 
                  alt={title}
                  className="w-full h-full object-contain"
                  style={{ maxHeight: '280px' }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => window.open(previews[documentType], '_blank')}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  {!isUploaded && (
                    <button
                      onClick={() => handleRemoveDocument(documentType)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <DocumentIcon className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-sm text-center">
                  No document uploaded yet
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {hasError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                {errors[documentType]}
              </p>
            </div>
          )}

          {/* Select File Button */}
          <input
            ref={fileInputRefs[documentType]}
            type="file"
            accept="image/jpeg,image/jpg,image/png,application/pdf"
            onChange={(e) => handleFileSelect(e, documentType)}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRefs[documentType].current?.click()}
            disabled={uploading}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              uploading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
            }`}
          >
            {hasNewFile ? '✓ File Selected - Click Upload All Below' : hasPreview && isUploaded ? 'Change Document' : 'Select Document'}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading documents...</p>
        </div>
      </div>
    );
  }

  const hasAnyDocumentSelected = documents.adhaarFront || documents.adhaarBack || documents.drivingLicense;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span className="font-semibold">Back to Profile</span>
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📄 Document Verification
            </h1>
            <p className="text-gray-600 mb-4">
              Upload your government-approved documents for verification. All documents will be verified within 24-48 hours.
            </p>

            {/* Timestamps Display */}
            {(timestamps.createdAt || timestamps.updatedAt) && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {timestamps.createdAt && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-blue-600 mb-0.5">First Uploaded</p>
                      <p className="text-sm font-semibold text-blue-900">{formatDateTime(timestamps.createdAt)}</p>
                      <p className="text-xs text-blue-700">{getTimeDifference(timestamps.createdAt)}</p>
                    </div>
                  </div>
                )}

                {timestamps.updatedAt && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-green-600 mb-0.5">Last Updated</p>
                      <p className="text-sm font-semibold text-green-900">{formatDateTime(timestamps.updatedAt)}</p>
                      <p className="text-xs text-green-700">{getTimeDifference(timestamps.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {renderDocumentCard('adhaarFront', 'Aadhaar Card Front')}
          {renderDocumentCard('adhaarBack', 'Aadhaar Card Back')}
          {renderDocumentCard('drivingLicense', 'Driving License')}
        </div>

        {/* Upload All Button */}
        {hasAnyDocumentSelected && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-xl p-6 border-2 border-green-200 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-green-900 mb-1">📤 Ready to Upload?</h3>
                <p className="text-sm text-green-700">
                  Click below to upload all selected documents to the server
                </p>
              </div>
              <button
                onClick={handleUploadAllDocuments}
                disabled={uploading}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center"
              >
                {uploading ? (
                  <>
                    <CloudArrowUpIcon className="h-5 w-5 mr-2 animate-bounce" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                    Upload All Documents
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Verify Now Button */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">✅ Submit for Verification</h3>
              <p className="text-sm text-gray-600">
                All documents must be uploaded before requesting verification
              </p>
            </div>
            <button
              onClick={handleVerifyNow}
              disabled={!Object.values(uploadStatus).every(status => status) || loading}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center"
            >
              {loading ? (
                <>
                  <CloudArrowUpIcon className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Request Verification
                </>
              )}
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 rounded-xl p-6">
          <div className="flex items-start">
            <DocumentIcon className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-blue-900 mb-2">📋 Document Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload clear, readable images of your documents</li>
                <li>• Accepted formats: JPG, PNG, PDF (Max 5MB per file)</li>
                <li>• Ensure all text and details are clearly visible</li>
                <li>• All three documents are required for verification</li>
                <li>• Documents will be verified within 24-48 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentVerification;
