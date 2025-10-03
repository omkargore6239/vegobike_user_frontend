// components/rental/DocumentUpload.jsx - FIXED WITH apiClient
import React, { useState, useEffect } from 'react';
import { api, showNotification, NOTIFICATION_TYPES } from '../../utils/apiClient';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../utils/constants';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
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

  useEffect(() => {
    if (userId) {
      loadDocuments();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const loadDocuments = async () => {
    if (!userId) {
      console.error('❌ DOCUMENT_UPLOAD - No userId provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📄 DOCUMENT_UPLOAD - Loading documents for user:', userId);

      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!token) {
        console.error('❌ DOCUMENT_UPLOAD - No authentication token found');
        setError('Authentication required. Please log in again.');
        setLoading(false);
        return;
      }

      // ✅ Use fetch with proper error handling
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
        // No documents found - this is OK for new users
        console.log('ℹ️ DOCUMENT_UPLOAD - No documents found (404)');
        setDocuments(null);
        setError('');
      } else if (response.ok) {
        const data = await response.json();
        console.log('✅ DOCUMENT_UPLOAD - Documents loaded:', data);
        
        // Handle different response structures
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
        setError(errorData.message || 'Failed to load documents');
        showNotification(errorData.message || 'Failed to load documents', NOTIFICATION_TYPES.ERROR);
      }
    } catch (err) {
      console.error('❌ DOCUMENT_UPLOAD - Exception loading documents:', err);
      
      // Check if it's a network error or CORS issue
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error. Please check if the server is running.');
        showNotification('Cannot connect to server', NOTIFICATION_TYPES.ERROR);
      } else {
        setError('Failed to load documents. Please try again.');
        showNotification(err.message || 'Failed to load documents', NOTIFICATION_TYPES.ERROR);
      }
    } finally {
      setLoading(false);
    }
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

      // ✅ Use fetch for file upload (multipart/form-data)
      const response = await fetch(`${API_ENDPOINTS.BASE_URL}/api/documents/upload-files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type - browser sets it with boundary
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

      setSuccess('Documents uploaded successfully!');
      showNotification('Documents uploaded successfully', NOTIFICATION_TYPES.SUCCESS);
      
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
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
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
      case 'VERIFIED':
      case 'APPROVED':
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

      {/* Current Documents */}
      {documents && (
        <div className="mb-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Documents</h3>
          
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

      {/* Upload New Documents */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {documents ? 'Update Documents' : 'Upload Documents'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Aadhaar Front Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Aadhaar Card (Front) <span className="text-red-500">*</span>
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

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading || !files.aadhaarFront || !files.aadhaarBack || !files.drivingLicense}
          className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg shadow-indigo-200"
        >
          {uploading ? (
            <>
              <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
              Uploading Documents...
            </>
          ) : (
            <>
              <CloudArrowUpIcon className="h-5 w-5 mr-2" />
              Upload All Documents
            </>
          )}
        </button>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-800 font-medium">
            <span className="font-bold">Note:</span> All three documents are required for verification. 
            Supported formats: JPG, PNG, WEBP. Maximum file size: 5MB per document.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
