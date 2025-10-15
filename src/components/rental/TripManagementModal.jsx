import React, { useState, useRef } from 'react';

const TripManagementModal = ({ show, onClose, booking, onStartTrip, onEndTrip, tripType }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [kmError, setKmError] = useState('');
  
  const fileInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const imageLabels = ['Front View', 'Back View', 'Left Side', 'Right Side'];

  if (!show) return null;

  const resetModal = () => {
    setImages([null, null, null, null]);
    setPreviews([null, null, null, null]);
    setKilometers('');
    setKmError('');
    setError('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const validateKilometers = (value) => {
    if (!value || value.trim() === '') {
      setKmError('Kilometer reading is required');
      return false;
    }
    
    const km = parseFloat(value);
    if (isNaN(km)) {
      setKmError('Please enter a valid number');
      return false;
    }
    
    if (km < 0) {
      setKmError('Kilometers cannot be negative');
      return false;
    }
    
    if (km > 999999) {
      setKmError('Invalid kilometer reading');
      return false;
    }
    
    setKmError('');
    return true;
  };

  const handleKilometerChange = (e) => {
    const value = e.target.value;
    setKilometers(value);
    
    if (value) {
      validateKilometers(value);
    } else {
      setKmError('');
    }
  };

  const handleImageSelect = (index, event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(`File ${index + 1} must be an image`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(`Image ${index + 1} must be less than 5MB`);
      return;
    }

    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...previews];
      newPreviews[index] = reader.result;
      setPreviews(newPreviews);
    };
    reader.readAsDataURL(file);
    
    setError('');
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    
    newImages[index] = null;
    newPreviews[index] = null;
    
    setImages(newImages);
    setPreviews(newPreviews);
    
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current.value = '';
    }
  };

  const handleSubmit = async () => {
    setError('');
    setKmError('');

    console.log('🔍 DEBUG Modal Submit - kilometers state:', kilometers, typeof kilometers);

    // Validate kilometers first
    if (!validateKilometers(kilometers)) {
      console.log('❌ Kilometer validation failed');
      return;
    }

    // Validate all images are selected
    const missingImages = images.map((img, idx) => img === null ? idx + 1 : null).filter(idx => idx !== null);
    
    if (missingImages.length > 0) {
      setError(`Please upload all 4 bike images. Missing: ${missingImages.join(', ')}`);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // ✅ FIXED: Convert to number and pass correctly
      const kmValue = parseFloat(kilometers);
      
      console.log('🔍 DEBUG Modal - kmValue parsed:', kmValue, typeof kmValue);
      console.log('🔍 DEBUG Modal - booking.bookingId:', booking?.bookingId);
      console.log('🔍 DEBUG Modal - images count:', images.filter(img => img !== null).length);
      console.log('🔍 DEBUG Modal - tripType:', tripType);
      
      if (tripType === 'start') {
        console.log('✅ Calling onStartTrip with:', booking.bookingId, images.length, kmValue);
        // ✅ Pass 3 parameters: bookingId, images array, kilometer value
        await onStartTrip(booking.bookingId, images, kmValue);
      } else if (tripType === 'end') {
        console.log('✅ Calling onEndTrip with:', booking.bookingId, images.length, kmValue);
        // ✅ Pass 3 parameters: bookingId, images array, kilometer value
        await onEndTrip(booking.bookingId, images, kmValue);
      }
      
      resetModal();
      
    } catch (error) {
      console.error('💥 Modal Submit Error:', error);
      setError(error.message || 'Failed to process. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const hasAllImages = images.every(img => img !== null);
    const hasValidKm = kilometers && !kmError && parseFloat(kilometers) > 0;
    const notSubmitting = !isSubmitting;
    
    console.log('🔍 Form Valid Check:', { hasAllImages, hasValidKm, notSubmitting, kilometers });
    
    return hasAllImages && hasValidKm && notSubmitting;
  };

  const uploadedCount = images.filter(img => img !== null).length;
  const progress = (uploadedCount / 4) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden animate-zoom-bounce-in max-h-[95vh] flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 opacity-50"></div>
        
        {/* Header */}
        <div className="relative px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${tripType === 'start' ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-full flex items-center justify-center`}>
                <span className="text-xl sm:text-2xl">{tripType === 'start' ? '🚗' : '🏁'}</span>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {tripType === 'start' ? 'Start Trip' : 'End Trip'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">Booking #{booking?.bookingId}</p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              disabled={isSubmitting}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-4 sm:p-8 overflow-y-auto flex-1">
          <div className="space-y-4 sm:space-y-6">
            
            {/* Kilometer Input Field */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                📊 Enter Current Kilometer Reading *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={kilometers}
                  onChange={handleKilometerChange}
                  placeholder="Enter odometer reading (e.g., 12345)"
                  step="0.1"
                  min="0"
                  className={`w-full px-4 py-3 sm:py-4 border-2 rounded-xl text-base sm:text-lg font-semibold transition-all ${
                    kmError 
                      ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                  disabled={isSubmitting}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                  KM
                </div>
              </div>
              
              {kmError && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-xs sm:text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{kmError}</span>
                </div>
              )}
              
              {kilometers && !kmError && (
                <div className="mt-2 flex items-center gap-2 text-green-600 text-xs sm:text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Valid reading entered</span>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200">
              <h3 className="text-sm sm:text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span className="text-lg sm:text-xl">📸</span>
                Upload 4 Bike Images
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">✓</span>
                  <span>Take clear photos from all 4 angles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">✓</span>
                  <span>Ensure good lighting and bike visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">✓</span>
                  <span>All 4 images are required to proceed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">✓</span>
                  <span>Maximum 5MB per image</span>
                </li>
              </ul>
            </div>

            {/* Progress Bar */}
            {uploadedCount > 0 && (
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">
                    Upload Progress
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-blue-600">
                    {uploadedCount}/4 Images
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Image Upload Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {images.map((image, index) => (
                <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                        {index + 1}
                      </span>
                      {imageLabels[index]}
                    </h4>
                    {image && (
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="text-red-500 hover:text-red-700 text-xs sm:text-sm font-semibold"
                        disabled={isSubmitting}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {previews[index] ? (
                    <div className="relative group">
                      <img 
                        src={previews[index]} 
                        alt={imageLabels[index]}
                        className="w-full h-32 sm:h-40 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-500 transition-all cursor-pointer bg-gray-50 hover:bg-blue-50">
                      <input
                        ref={fileInputRefs[index]}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageSelect(index, e)}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                      <button
                        onClick={() => fileInputRefs[index].current?.click()}
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">Click to upload</p>
                        <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs sm:text-sm text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="relative px-4 sm:px-8 py-4 sm:py-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm sm:text-base"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold transition-all text-sm sm:text-base ${
                isFormValid()
                  ? tripType === 'start'
                    ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-xl transform hover:scale-105'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `${tripType === 'start' ? '🚗 Start Trip' : '🏁 End Trip'}`
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-zoom-bounce-in {
          animation: zoom-bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TripManagementModal;
