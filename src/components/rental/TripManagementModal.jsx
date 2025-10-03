import React, { useState } from 'react';

const TripManagementModal = ({ show, onClose, booking, onStartTrip, onEndTrip, tripType }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([null, null, null, null]);
  const [uploading, setUploading] = useState(false);

  const imageLabels = ['Front View', 'Back View', 'Left Side', 'Right Side'];

  if (!show) return null;

  const handleImageSelect = (index, file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = reader.result;
      setImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async () => {
    if (images.some(img => img === null)) {
      alert('Please upload all 4 bike images');
      return;
    }

    setUploading(true);

    try {
      if (tripType === 'start') {
        await onStartTrip(booking.bookingId, images);
      } else if (tripType === 'end') {
        await onEndTrip(booking.bookingId, images);
      }

      handleClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setImages([null, null, null, null]);
    setImagePreviews([null, null, null, null]);
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className={`sticky top-0 bg-gradient-to-r ${tripType === 'start' ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} text-white px-8 py-6 rounded-t-3xl`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {tripType === 'start' ? '🚗 Start Trip' : '🏁 End Trip'}
              </h2>
              <p className="text-white/90 text-sm mt-1">Booking #{booking?.bookingId}</p>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload 4 Bike Images</h3>
            <p className="text-gray-600 text-sm">Please upload clear photos of the bike from all angles</p>
          </div>

          {/* Image Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {imageLabels[index]} *
                </label>
                
                {imagePreviews[index] ? (
                  <div className="relative group">
                    <img
                      src={imagePreviews[index]}
                      alt={imageLabels[index]}
                      className="w-full h-48 object-cover rounded-xl border-2 border-green-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-xl flex items-center justify-center">
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 cursor-pointer transition-all bg-gray-50 hover:bg-blue-50">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="mt-2 text-sm text-gray-600">Click to upload</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG (max 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(index, e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={uploading || images.some(img => img === null)}
              className={`flex-1 py-4 rounded-xl font-bold text-white transition-all ${
                uploading || images.some(img => img === null)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : tripType === 'start'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-lg hover:shadow-xl'
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                `${tripType === 'start' ? '🚗 Start' : '🏁 End'} Trip`
              )}
            </button>
            <button
              onClick={handleClose}
              disabled={uploading}
              className="px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripManagementModal;
