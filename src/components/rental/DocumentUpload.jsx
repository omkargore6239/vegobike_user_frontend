// components/rental/DocumentUpload.jsx - COMPLETE WITH AUTO-UPDATE & UPLOAD CONDITIONS
import React, { useState, useEffect } from 'react';
import { api, showNotification, NOTIFICATION_TYPES } from '../../utils/apiClient';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../utils/constants';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

const DocumentUpload = ({ userId }) => {
  const [documents, setDocuments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [files, setFiles] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    drivingLicense: null
  });

  const [previews, setPreviews] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    drivingLicense: null
  });

  // Auto-refresh documents every 30 seconds to check for status updates
  useEffect(() => {
    if (userId) {
      loadDocuments();
      
      // Set up polling interval for status updates
      const interval = setInterval(() => {
        loadDocuments(true); // Silent refresh (no loading spinner)
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadDocuments = async (silent = false) => {
    if (!userId) {
      console.error('❌ DOCUMENT_UPLOAD - No userId provided');
      setLoading(false);
      return;
    }

    try {
      if (!silent) setLoading(true);
      console.log('📄 DOCUMENT_UPLOAD - Loading documents for user:', userId);

      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) {
        console.error('❌ DOCUMENT_UPLOAD - No authentication token found');
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/documents/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('📄 DOCUMENT_UPLOAD - Response status:', response.status);

      if (response.status === 404) {
        console.log('ℹ️ DOCUMENT_UPLOAD - No documents found (404)');
        setDocuments(null);
        setError('');
      } else if (response.ok) {
        const data = await response.json();
        console.log('✅ DOCUMENT_UPLOAD - Documents loaded:', data);
        
        if (data.success && data.data) {
          setDocuments(data.data);
        } else if (data.data) {
          setDocuments(data.data);
        } else {
          setDocuments(data);
        }
        setError('');
      } else {
        const errorData = await response.json().catch(() => ({ 
          message: `Failed to load documents (${response.status})` 
        }));
        console.error('❌ DOCUMENT_UPLOAD - Error loading documents:', errorData);
        if (!silent) {
          setError(errorData.message || 'Failed to load documents');
          showNotification(errorData.message || 'Failed to load documents', NOTIFICATION_TYPES.ERROR);
        }
      }
    } catch (err) {
      console.error('❌ DOCUMENT_UPLOAD - Exception loading documents:', err);
      
      if (!silent) {
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          setError('Network error. Please check if the server is running.');
          showNotification('Cannot connect to server', NOTIFICATION_TYPES.ERROR);
        } else {
          setError('Failed to load documents. Please try again.');
          showNotification(err.message || 'Failed to load documents', NOTIFICATION_TYPES.ERROR);
        }
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Check if all documents are verified
  const areAllDocumentsVerified = () => {
  if (!documents) return false;
  
  const statuses = [
    documents.adhaarFrontStatus?.toUpperCase(),
    documents.adhaarBackStatus?.toUpperCase(),
    documents.drivingLicenseStatus?.toUpperCase()
  ];
  
  return statuses.every(status => status === 'VERIFIED');  // ✅ Changed from APPROVED
};

  // Check if any document is rejected
  const hasRejectedDocuments = () => {
    if (!documents) return false;
    
    const statuses = [
      documents.adhaarFrontStatus?.toUpperCase(),
      documents.adhaarBackStatus?.toUpperCase(),
      documents.drivingLicenseStatus?.toUpperCase()
    ];
    
    return statuses.some(status => status === 'REJECTED');
  };

  // Check which documents are rejected
  const getRejectedDocuments = () => {
    if (!documents) return [];
    
    const rejected = [];
    if (documents.adhaarFrontStatus?.toUpperCase() === 'REJECTED') rejected.push('aadhaarFront');
    if (documents.adhaarBackStatus?.toUpperCase() === 'REJECTED') rejected.push('aadhaarBack');
    if (documents.drivingLicenseStatus?.toUpperCase() === 'REJECTED') rejected.push('drivingLicense');
    
    return rejected;
  };

  // Check if upload is allowed
  const canUploadDocuments = () => {
    // Can upload if no documents exist OR if any document is rejected
    return !documents || hasRejectedDocuments();
  };

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log(`📎 DOCUMENT_UPLOAD - File selected for ${docType}:`, file.name, file.type, file.size);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showNotification('Please upload an image file (JPG, PNG, WEBP)', NOTIFICATION_TYPES.ERROR);
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showNotification('File size must be less than 5MB', NOTIFICATION_TYPES.ERROR);
      return;
    }

    setFiles(prev => ({ ...prev, [docType]: file }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews(prev => ({ ...prev, [docType]: reader.result }));
      console.log(`✅ DOCUMENT_UPLOAD - Preview created for ${docType}`);
    };
    reader.onerror = () => {
      console.error(`❌ DOCUMENT_UPLOAD - Error reading file for ${docType}`);
      showNotification('Error reading file', NOTIFICATION_TYPES.ERROR);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    // Validate all files are selected
    if (!files.aadhaarFront || !files.aadhaarBack || !files.drivingLicense) {
      const msg = 'Please upload all three required documents';
      setError(msg);
      showNotification(msg, NOTIFICATION_TYPES.ERROR);
      return;
    }

    if (!userId) {
      const msg = 'User ID not found. Please refresh the page.';
      setError(msg);
      showNotification(msg, NOTIFICATION_TYPES.ERROR);
      return;
    }

    try {
      setUploading(true);
      setError('');
      console.log('📤 DOCUMENT_UPLOAD - Starting upload for user:', userId);

      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('userId', userId.toString());
      formData.append('adhaarFront', files.aadhaarFront);
      formData.append('adhaarBack', files.aadhaarBack);
      formData.append('drivingLicense', files.drivingLicense);

      console.log('📤 DOCUMENT_UPLOAD - FormData prepared:', {
        userId: userId,
        adhaarFront: files.aadhaarFront.name,
        adhaarBack: files.aadhaarBack.name,
        drivingLicense: files.drivingLicense.name
      });

      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/documents/upload-files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('📤 DOCUMENT_UPLOAD - Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: `Upload failed (${response.status})` 
        }));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const responseData = await response.json();
      console.log('✅ DOCUMENT_UPLOAD - Upload successful:', responseData);

      setSuccess('Documents uploaded successfully! Pending admin verification.');
      showNotification('Documents uploaded successfully! Awaiting verification.', NOTIFICATION_TYPES.SUCCESS);
      
      // Update documents state
      if (responseData.success && responseData.data) {
        setDocuments(responseData.data);
      } else if (responseData.data) {
        setDocuments(responseData.data);
      } else {
        setDocuments(responseData);
      }
      
      // Clear file inputs and previews
      setFiles({ aadhaarFront: null, aadhaarBack: null, drivingLicense: null });
      setPreviews({ aadhaarFront: null, aadhaarBack: null, drivingLicense: null });
      
      // Clear file inputs in DOM
      const inputs = ['aadhaarFront', 'aadhaarBack', 'drivingLicense'];
      inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
      
      // Reload documents
      setTimeout(() => loadDocuments(), 1000);

    } catch (err) {
      console.error('❌ DOCUMENT_UPLOAD - Upload error:', err);
      const errorMsg = err.message || 'Failed to upload documents';
      setError(errorMsg);
      showNotification(errorMsg, NOTIFICATION_TYPES.ERROR);
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
  const statusUpper = status?.toUpperCase();
  
  switch (statusUpper) {
    case 'VERIFIED':  // ✅ Changed from APPROVED
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="h-4 w-4 mr-1" />
          Verified
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircleIcon className="h-4 w-4 mr-1" />
          Rejected
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
          Pending
        </span>
      );
  }
};

  // Check if upload button should be enabled
  const isUploadButtonEnabled = () => {
    return files.aadhaarFront && files.aadhaarBack && files.drivingLicense && !uploading;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <ArrowPathIcon className="h-8 w-8 text-indigo-600 animate-spin" />
          <span className="ml-3 text-gray-600 font-medium">Loading documents...</span>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-center py-12">
          <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />
          <span className="ml-3 text-gray-600">User ID not found. Please refresh the page.</span>
        </div>
      </div>
    );
  }

  // All documents verified - Show success message
  if (areAllDocumentsVerified()) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            Document Verification
          </h2>
        </div>

        {/* Success Banner */}
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-6 shadow-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-bold text-green-900 mb-2">All Documents Verified! ✓</h3>
              <p className="text-sm text-green-800 mb-3">
                Congratulations! Your documents have been successfully verified by our admin team. 
                You can now proceed with bike rentals and other services.
              </p>
              <div className="flex items-center space-x-2">
                <LockClosedIcon className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">Your documents are secured and verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Documents Display */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verified Documents</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Aadhaar Front */}
            <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Aadhaar Front</span>
                {getStatusBadge(documents.adhaarFrontStatus)}
              </div>
              {documents.adhaarFrontUrl ? (
                <img 
                  src={documents.adhaarFrontUrl} 
                  alt="Aadhaar Front" 
                  className="w-full h-32 object-cover rounded-lg border-2 border-green-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg"
                style={{display: documents.adhaarFrontUrl ? 'none' : 'flex'}}
              >
                <DocumentIcon className="h-12 w-12 text-gray-400" />
              </div>
            </div>

            {/* Aadhaar Back */}
            <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Aadhaar Back</span>
                {getStatusBadge(documents.adhaarBackStatus)}
              </div>
              {documents.adhaarBackUrl ? (
                <img 
                  src={documents.adhaarBackUrl} 
                  alt="Aadhaar Back" 
                  className="w-full h-32 object-cover rounded-lg border-2 border-green-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg"
                style={{display: documents.adhaarBackUrl ? 'none' : 'flex'}}
              >
                <DocumentIcon className="h-12 w-12 text-gray-400" />
              </div>
            </div>

            {/* Driving License */}
            <div className="border-2 border-green-200 bg-green-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Driving License</span>
                {getStatusBadge(documents.drivingLicenseStatus)}
              </div>
              {documents.drivingLicenseUrl ? (
                <img 
                  src={documents.drivingLicenseUrl} 
                  alt="Driving License" 
                  className="w-full h-32 object-cover rounded-lg border-2 border-green-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg"
                style={{display: documents.drivingLicenseUrl ? 'none' : 'flex'}}
              >
                <DocumentIcon className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <DocumentIcon className="h-6 w-6 text-blue-600" />
          </div>
          Document Verification
        </h2>
      </div>

      {/* Error Alert */}
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

      {/* Success Alert */}
      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-xl p-4 shadow-lg">
          <div className="flex items-start">
            <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-green-800 mb-1">Success</h3>
              <p className="text-sm text-green-700">{success}</p>
            </div>
            <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-600">
              <XCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Rejection Alert */}
      {hasRejectedDocuments() && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-lg">
          <div className="flex items-start">
            <XCircleIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-800 mb-2">Documents Rejected</h3>
              <p className="text-sm text-red-700 mb-2">
                Some of your documents have been rejected by the admin. Please re-upload the rejected documents.
              </p>
              <div className="mt-2">
                <p className="text-xs font-semibold text-red-900 mb-1">Rejected Documents:</p>
                <ul className="list-disc list-inside text-xs text-red-800 space-y-1">
                  {getRejectedDocuments().includes('aadhaarFront') && <li>Aadhaar Card (Front)</li>}
                  {getRejectedDocuments().includes('aadhaarBack') && <li>Aadhaar Card (Back)</li>}
                  {getRejectedDocuments().includes('drivingLicense') && <li>Driving License</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Documents Status */}
      {documents && !areAllDocumentsVerified() && (
        <div className="mb-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Document Status</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Aadhaar Front */}
            <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Aadhaar Front</span>
                {getStatusBadge(documents.adhaarFrontStatus)}
              </div>
              {documents.adhaarFrontUrl ? (
                <img 
                  src={documents.adhaarFrontUrl} 
                  alt="Aadhaar Front" 
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg"
                style={{display: documents.adhaarFrontUrl ? 'none' : 'flex'}}
              >
                <DocumentIcon className="h-12 w-12 text-gray-400" />
              </div>
            </div>

            {/* Aadhaar Back */}
            <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Aadhaar Back</span>
                {getStatusBadge(documents.adhaarBackStatus)}
              </div>
              {documents.adhaarBackUrl ? (
                <img 
                  src={documents.adhaarBackUrl} 
                  alt="Aadhaar Back" 
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg"
                style={{display: documents.adhaarBackUrl ? 'none' : 'flex'}}
              >
                <DocumentIcon className="h-12 w-12 text-gray-400" />
              </div>
            </div>

            {/* Driving License */}
            <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Driving License</span>
                {getStatusBadge(documents.drivingLicenseStatus)}
              </div>
              {documents.drivingLicenseUrl ? (
                <img 
                  src={documents.drivingLicenseUrl} 
                  alt="Driving License" 
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg"
                style={{display: documents.drivingLicenseUrl ? 'none' : 'flex'}}
              >
                <DocumentIcon className="h-12 w-12 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section - Only show if upload is allowed */}
      {canUploadDocuments() && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {documents ? 'Re-upload Rejected Documents' : 'Upload Documents'}
            </h3>
            {hasRejectedDocuments() && (
              <span className="text-xs text-red-600 font-medium">
                * Re-upload all documents required
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Aadhaar Front Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Aadhaar Card (Front) <span className="text-red-500">*</span>
                {documents?.adhaarFrontStatus?.toUpperCase() === 'REJECTED' && (
                  <span className="ml-2 text-xs text-red-600">(Rejected - Re-upload)</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'aadhaarFront')}
                  className="hidden"
                  id="aadhaarFront"
                  disabled={uploading}
                />
                <label
                  htmlFor="aadhaarFront"
                  className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all ${
                    uploading 
                      ? 'border-gray-300 cursor-not-allowed opacity-50' 
                      : documents?.adhaarFrontStatus?.toUpperCase() === 'REJECTED'
                      ? 'border-red-300 cursor-pointer hover:border-red-500 hover:bg-red-50'
                      : 'border-gray-300 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50'
                  }`}
                >
                  {previews.aadhaarFront ? (
                    <img src={previews.aadhaarFront} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="text-center">
                      <CloudArrowUpIcon className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm font-medium text-gray-600">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP</p>
                      <p className="text-xs text-gray-500">Max 5MB</p>
                    </div>
                  )}
                </label>
              </div>
              {files.aadhaarFront && (
                <p className="mt-2 text-xs text-green-600 font-medium flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  {files.aadhaarFront.name}
                </p>
              )}
            </div>

            {/* Aadhaar Back Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Aadhaar Card (Back) <span className="text-red-500">*</span>
                {documents?.adhaarBackStatus?.toUpperCase() === 'REJECTED' && (
                  <span className="ml-2 text-xs text-red-600">(Rejected - Re-upload)</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'aadhaarBack')}
                  className="hidden"
                  id="aadhaarBack"
                  disabled={uploading}
                />
                <label
                  htmlFor="aadhaarBack"
                  className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all ${
                    uploading 
                      ? 'border-gray-300 cursor-not-allowed opacity-50' 
                      : documents?.adhaarBackStatus?.toUpperCase() === 'REJECTED'
                      ? 'border-red-300 cursor-pointer hover:border-red-500 hover:bg-red-50'
                      : 'border-gray-300 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50'
                  }`}
                >
                  {previews.aadhaarBack ? (
                    <img src={previews.aadhaarBack} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="text-center">
                      <CloudArrowUpIcon className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm font-medium text-gray-600">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP</p>
                      <p className="text-xs text-gray-500">Max 5MB</p>
                    </div>
                  )}
                </label>
              </div>
              {files.aadhaarBack && (
                <p className="mt-2 text-xs text-green-600 font-medium flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  {files.aadhaarBack.name}
                </p>
              )}
            </div>

            {/* Driving License Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Driving License <span className="text-red-500">*</span>
                {documents?.drivingLicenseStatus?.toUpperCase() === 'REJECTED' && (
                  <span className="ml-2 text-xs text-red-600">(Rejected - Re-upload)</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'drivingLicense')}
                  className="hidden"
                  id="drivingLicense"
                  disabled={uploading}
                />
                <label
                  htmlFor="drivingLicense"
                  className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all ${
                    uploading 
                      ? 'border-gray-300 cursor-not-allowed opacity-50' 
                      : documents?.drivingLicenseStatus?.toUpperCase() === 'REJECTED'
                      ? 'border-red-300 cursor-pointer hover:border-red-500 hover:bg-red-50'
                      : 'border-gray-300 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50'
                  }`}
                >
                  {previews.drivingLicense ? (
                    <img src={previews.drivingLicense} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="text-center">
                      <CloudArrowUpIcon className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm font-medium text-gray-600">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP</p>
                      <p className="text-xs text-gray-500">Max 5MB</p>
                    </div>
                  )}
                </label>
              </div>
              {files.drivingLicense && (
                <p className="mt-2 text-xs text-green-600 font-medium flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  {files.drivingLicense.name}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button - Only enabled when all files are selected */}
          <button
            onClick={handleUpload}
            disabled={!isUploadButtonEnabled()}
            className={`w-full flex items-center justify-center px-6 py-4 rounded-xl transition-all font-semibold shadow-lg ${
              isUploadButtonEnabled()
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-200 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
            }`}
          >
            {uploading ? (
              <>
                <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                Uploading Documents...
              </>
            ) : !isUploadButtonEnabled() ? (
              <>
                <LockClosedIcon className="h-5 w-5 mr-2" />
                Please Select All Documents to Submit
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                Submit All Documents for Verification
              </>
            )}
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-800 font-medium">
              <span className="font-bold">Note:</span> All three documents must be uploaded together. 
              The submit button will be enabled once all documents are selected. 
              Supported formats: JPG, PNG, WEBP. Maximum file size: 5MB per document. 
              Documents will be reviewed by admin within 24-48 hours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
