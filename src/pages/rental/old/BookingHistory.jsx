// src/pages/rental/BookingHistory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Modern Alert/Notification Component
const ModernAlert = ({ show, onClose, type, title, message, autoClose = true }) => {
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, autoClose]);

  if (!show) return null;

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-blue-500 to-indigo-600',
          border: 'border-blue-200',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case 'error':
        return {
          bg: 'from-blue-500 to-indigo-600',
          border: 'border-blue-200',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      default:
        return {
          bg: 'from-blue-500 to-indigo-600',
          border: 'border-blue-200',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-bounce-in">
      <div className="relative max-w-sm">
        <div className={`absolute inset-0 bg-gradient-to-r ${styles.bg} rounded-2xl blur-sm opacity-80`}></div>
        <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-white overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${styles.bg}`}></div>
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className={`p-3 bg-gradient-to-br ${styles.bg} rounded-full shadow-lg animate-pulse-scale`}>
                {styles.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
                {autoClose && (
                  <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${styles.bg} rounded-full animate-shrink-width`}></div>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 group"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Success Animation Modal
const SuccessAnimation = ({ show, onClose, title, message, icon }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md mx-4 overflow-hidden animate-zoom-bounce-in">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 left-4 w-8 h-8 bg-blue-200 rounded-full opacity-20 animate-float-1"></div>
          <div className="absolute top-12 right-8 w-6 h-6 bg-indigo-200 rounded-full opacity-30 animate-float-2"></div>
          <div className="absolute bottom-8 left-8 w-4 h-4 bg-blue-300 rounded-full opacity-25 animate-float-3"></div>
        </div>
        
        <div className="relative p-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce-scale">
              {icon || (
                <svg className="w-10 h-10 text-white animate-draw-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3 animate-slide-up-1">{title}</h2>
          <p className="text-gray-600 leading-relaxed mb-6 animate-slide-up-2">{message}</p>
          
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-slide-up-3"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Image Upload Modal Component
const ImageUploadModal = ({ isOpen, onClose, onSubmit, title, isUploading, uploadType, bookingId }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null]);

  useEffect(() => {
    if (isOpen) {
      setImages([null, null, null, null]);
      setPreviews([null, null, null, null]);
    }
  }, [isOpen, uploadType, bookingId]);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      const newPreviews = [...previews];
      
      newImages[index] = file;
      newPreviews[index] = URL.createObjectURL(file);
      
      setImages(newImages);
      setPreviews(newPreviews);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    
    newImages[index] = null;
    newPreviews[index] = null;
    
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = () => {
    if (images.some(img => img === null)) {
      return;
    }
    onSubmit(images);
  };

  const resetModal = () => {
    previews.forEach(preview => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    });
    setImages([null, null, null, null]);
    setPreviews([null, null, null, null]);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const angleLabels = ['Front View', 'Left Side', 'Right Side', 'Rear View'];
  const uploadTypeLabel = uploadType === 'start' ? '🚀 Starting' : '🏁 Ending';
  const completedCount = images.filter(img => img !== null).length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-modal-bounce-in">
        <div className={`${uploadType === 'start' ? 'bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-600' : 'bg-gradient-to-r from-blue-600 via-indigo-700 to-blue-700'} p-6 rounded-t-3xl text-white relative overflow-hidden`}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse-slow"></div>
            <div className="absolute top-8 left-8 w-16 h-16 bg-white opacity-5 rounded-full animate-float-1"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{title}</h2>
              <p className="text-white opacity-90 text-sm mb-3">
                {uploadType === 'start' 
                  ? 'Document bike condition at pickup with 4 clear photos' 
                  : 'Document bike condition at return with 4 new photos'
                }
              </p>
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-sm">
                  {uploadTypeLabel} Trip Documentation
                </div>
                <div className="bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm font-bold backdrop-blur-sm">
                  {completedCount}/4 Photos
                </div>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 group"
            >
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            {[0, 1, 2, 3].map((index) => (
              <div key={`${uploadType}-${bookingId}-${index}`} className="relative group">
                <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-all duration-300 h-40 flex items-center justify-center group-hover:shadow-lg">
                  {previews[index] ? (
                    <div className="relative w-full h-full animate-fade-in">
                      <img 
                        src={previews[index]} 
                        alt={`Bike ${uploadType} angle ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl shadow-md"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-all duration-300 shadow-lg hover:scale-110 animate-bounce-in"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-full p-1 animate-scale-in">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full group-hover:scale-105 transition-transform duration-300">
                      <div className="p-4 bg-blue-100 rounded-full mb-3 group-hover:bg-blue-200 transition-colors duration-300">
                        <svg className="w-8 h-8 text-blue-500 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="text-sm text-blue-600 font-medium mb-1">Upload Photo</p>
                      <p className="text-xs text-blue-500">{angleLabels[index]}</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, index)}
                        className="hidden"
                        key={`input-${uploadType}-${bookingId}-${index}`}
                      />
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Upload Progress</span>
              <span className="text-sm font-bold text-blue-900">{completedCount}/4 Complete</span>
            </div>
            <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-500 to-indigo-600"
                style={{ width: `${(completedCount / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-blue-50 border-blue-200 rounded-2xl p-6 mb-8 border-2">
            <h4 className="font-bold mb-3 flex items-center gap-3 text-blue-900">
              <div className="p-2 rounded-full bg-blue-500">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              📸 {uploadType === 'start' ? 'Start Trip' : 'End Trip'} Photo Guidelines
            </h4>
            <ul className="text-sm space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Take clear, well-lit photos from all 4 specified angles
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Document any existing damages, scratches, or issues
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Ensure license plate and key details are visible
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {uploadType === 'start' 
                  ? 'These photos will be used as baseline condition reference' 
                  : 'These photos will be compared with start trip photos for damage assessment'
                }
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleClose}
              className="flex-1 px-8 py-4 border-2 border-blue-300 text-blue-700 rounded-2xl font-bold hover:bg-blue-50 transition-all duration-300 hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={images.some(img => img === null) || isUploading}
              className={`flex-1 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                images.every(img => img !== null) && !isUploading
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed scale-95'
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span>Uploading {uploadType === 'start' ? 'Start' : 'End'} Photos...</span>
                </div>
              ) : (
                `Submit ${uploadType === 'start' ? 'Start Trip' : 'End Trip'} Photos`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock booking data generator
const generateBookingHistory = (newBooking = null) => {
  const baseBookings = [
    {
      id: "BK123456",
      bike: {
        company: "Royal Enfield",
        name: "Classic 350",
        number: "KA-01-AB-1234",
        image: "https://picsum.photos/200/120?random=10"
      },
      location: "Bengaluru",
      startDate: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      endDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      paymentMethod: "online",
      amount: 9500,
      status: "Completed",
      tripStarted: true,
      tripEnded: true,
      packageType: "7 Days",
      startImages: [],
      endImages: []
    },
    {
      id: "BK123457",
      bike: {
        company: "Bajaj",
        name: "Pulsar NS 200",
        number: "KA-02-CD-5678",
        image: "https://picsum.photos/200/120?random=11"
      },
      location: "Hyderabad",
      startDate: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      endDate: new Date(Date.now() + 1 * 24 * 3600 * 1000).toISOString(),
      paymentMethod: "cod",
      amount: 6000,
      status: "Active",
      tripStarted: true,
      tripEnded: false,
      packageType: "3 Days",
      startImages: [],
      endImages: []
    },
    {
      id: "BK123458",
      bike: {
        company: "Honda",
        name: "CB Shine",
        number: "KA-03-EF-9012",
        image: "https://picsum.photos/200/120?random=12"
      },
      location: "Chennai",
      startDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
      paymentMethod: "online",
      amount: 4500,
      status: "Confirmed",
      tripStarted: false,
      tripEnded: false,
      packageType: "3 Days",
      startImages: [],
      endImages: []
    },
    {
      id: "BK123459",
      bike: {
        company: "TVS",
        name: "Apache RTR",
        number: "KA-04-GH-3456",
        image: "https://picsum.photos/200/120?random=13"
      },
      location: "Pune",
      startDate: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
      endDate: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      paymentMethod: "cod",
      amount: 7200,
      status: "Completed",
      tripStarted: true,
      tripEnded: true,
      packageType: "5 Days",
      startImages: [],
      endImages: []
    }
  ];

  if (newBooking) {
    return [newBooking, ...baseBookings];
  }
  return baseBookings;
};

export default function BookingHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({});
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successData, setSuccessData] = useState({});
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [uploadType, setUploadType] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const newBooking = location.state?.newBooking;
    const bookingHistory = generateBookingHistory(newBooking);
    setBookings(bookingHistory);

    if (newBooking) {
      showNotification('success', '🎉 Booking Added!', 'Your booking has been successfully added to your history and is ready to go!');
    }
  }, [location.state]);

  const showNotification = (type, title, message) => {
    setAlertData({ type, title, message });
    setShowAlert(true);
  };

  const showSuccess = (title, message, icon) => {
    setSuccessData({ title, message, icon });
    setShowSuccessAnimation(true);
  };

  const handleStartTrip = (bookingId) => {
    setShowImageUpload(false);
    setTimeout(() => {
      setCurrentBookingId(bookingId);
      setUploadType('start');
      setShowImageUpload(true);
    }, 100);
  };

  const handleEndTrip = (bookingId) => {
    setShowImageUpload(false);
    setTimeout(() => {
      setCurrentBookingId(bookingId);
      setUploadType('end');
      setShowImageUpload(true);
    }, 100);
  };

  const handleImageUploadSubmit = (images) => {
    setIsUploading(true);
    
    setTimeout(() => {
      setBookings(prev => 
        prev.map(booking => {
          if (booking.id === currentBookingId) {
            if (uploadType === 'start') {
              return { 
                ...booking, 
                tripStarted: true,
                status: 'Active',
                startImages: [...images]
              };
            } else {
              return { 
                ...booking, 
                tripEnded: true,
                status: 'Completed',
                endImages: [...images]
              };
            }
          }
          return booking;
        })
      );
      
      setShowImageUpload(false);
      setCurrentBookingId(null);
      setUploadType('');
      setIsUploading(false);
      
      const actionType = uploadType === 'start' ? 'Trip Started!' : 'Trip Completed!';
      const actionMessage = uploadType === 'start' 
        ? 'Your adventure has begun! Safe travels and enjoy your ride.' 
        : 'Welcome back! Your trip has been completed successfully with all photos documented.';
      
      showSuccess(actionType, actionMessage);
    }, 2000);
  };

  const closeModal = () => {
    setShowImageUpload(false);
    setCurrentBookingId(null);
    setUploadType('');
    setIsUploading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-600 text-white';
      case 'Active':
        return 'bg-yellow-500 text-white animate-pulse';
      case 'Confirmed':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'active') {
      return booking.status !== 'Completed';
    } else {
      return booking.status === 'Completed';
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 px-4">
      
      <ModernAlert
        show={showAlert}
        onClose={() => setShowAlert(false)}
        type={alertData.type}
        title={alertData.title}
        message={alertData.message}
      />

      <SuccessAnimation
        show={showSuccessAnimation}
        onClose={() => setShowSuccessAnimation(false)}
        title={successData.title}
        message={successData.message}
        icon={successData.icon}
      />

      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Enhanced Header - White Background */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl blur-lg opacity-30 animate-pulse-slow"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-white px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => navigate("/")} 
                    className="group p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-all duration-300"
                  >
                    <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold mb-2 text-gray-900">🚗 My Adventures</h1>
                    <p className="text-gray-600">Track and manage your bike rentals</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold animate-counter text-blue-600">{bookings.length}</div>
                  <div className="text-gray-500 text-sm">Total Journeys</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Tab Navigation - White Background */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="flex relative">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-4 px-6 text-lg font-bold transition-all duration-500 relative overflow-hidden group ${
                  activeTab === 'active' 
                    ? 'text-white' 
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                {activeTab === 'active' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-slide-in-left"></div>
                )}
                <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                  🔄 Active Trips
                </span>
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-4 px-6 text-lg font-bold transition-all duration-500 relative overflow-hidden group ${
                  activeTab === 'completed' 
                    ? 'text-white' 
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                {activeTab === 'completed' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-slide-in-right"></div>
                )}
                <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">
                  ✅ Completed Trips
                </span>
              </button>
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl blur-lg opacity-30"></div>
            <div className="relative bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-float-1">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No {activeTab === 'active' ? 'Active' : 'Completed'} Adventures
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {activeTab === 'active' 
                  ? 'Ready to start your next epic bike journey?' 
                  : 'Complete some trips to see them here!'
                }
              </p>
              {activeTab === 'active' && (
                <button
                  onClick={() => navigate("/rental")}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-103 shadow-xl animate-bounce-subtle"
                >
                  🚀 Start Your Journey
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking, index) => (
              <div key={booking.id} className="group relative animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl blur opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform group-hover:scale-103 transition-all duration-500 aspect-square">
                  <div className="p-6 h-full flex flex-col">
                    
                    {/* Header with Image and Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="relative">
                        <img 
                          src={booking.bike.image} 
                          alt={`${booking.bike.company} ${booking.bike.name}`}
                          className="w-16 h-12 object-cover rounded-lg shadow-md border border-gray-200"
                          onError={(e) => {
                            e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='48' viewBox='0 0 64 48'%3E%3Crect width='64' height='48' fill='%23e5e7eb'/%3E%3Ctext x='32' y='24' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='6' fill='%236b7280'%3EBike%3C/text%3E%3C/svg%3E`;
                          }}
                        />
                        {booking.status === 'Active' && (
                          <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-bold px-1 py-0.5 rounded-full animate-pulse">
                            LIVE
                          </div>
                        )}
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </div>
                    </div>

                    {/* Bike Info */}
                    <div className="mb-4">
                      <h2 className="font-bold text-lg mb-1 line-clamp-1 text-gray-900">
                        {booking.bike.company} {booking.bike.name}
                      </h2>
                      <p className="text-gray-500 text-sm">{booking.bike.number}</p>
                    </div>

                    {/* Trip Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4 flex-1">
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <p className="text-gray-500 text-xs">ID</p>
                        <p className="font-semibold text-xs text-gray-900">{booking.id}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <p className="text-gray-500 text-xs">Location</p>
                        <p className="font-semibold text-xs line-clamp-1 text-gray-900">{booking.location}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <p className="text-gray-500 text-xs">Package</p>
                        <p className="font-semibold text-xs text-gray-900">{booking.packageType}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                        <p className="text-gray-500 text-xs">Amount</p>
                        <p className="font-semibold text-sm text-gray-900">₹{booking.amount.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="text-xs text-gray-500 mb-4">
                      <div className="flex justify-between">
                        <span>Start: {new Date(booking.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                        <span>End: {new Date(booking.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        {booking.status === 'Confirmed' && !booking.tripStarted && (
                          <button
                            onClick={() => handleStartTrip(booking.id)}
                            className="group flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg font-bold text-xs hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse-subtle"
                          >
                            <svg className="w-3 h-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 12a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Start
                          </button>
                        )}
                        
                        {booking.status === 'Active' && booking.tripStarted && !booking.tripEnded && (
                          <button
                            onClick={() => handleEndTrip(booking.id)}
                            className="group flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-xs hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 animate-pulse-subtle"
                          >
                            <svg className="w-3 h-3 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                            </svg>
                            End
                          </button>
                        )}
                        
                        {booking.status === 'Completed' && booking.tripEnded && (
                          <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                            <div className="p-0.5 bg-green-600 rounded-full animate-pulse">
                              <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span>Done</span>
                          </div>
                        )}
                      </div>

                      <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        booking.paymentMethod === 'online' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {booking.paymentMethod === 'online' ? '💳' : '💵'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ImageUploadModal
        isOpen={showImageUpload}
        onClose={closeModal}
        onSubmit={handleImageUploadSubmit}
        title={uploadType === 'start' ? '📸 Start Trip - Upload 4 Fresh Photos' : '📸 End Trip - Upload 4 New Photos'}
        isUploading={isUploading}
        uploadType={uploadType}
        bookingId={currentBookingId}
      />

      <style jsx>{`
        @keyframes slide-bounce-in {
          0% { transform: translateX(100%) scale(0.3); opacity: 0; }
          50% { transform: translateX(-10px) scale(1.05); }
          70% { transform: translateX(5px) scale(0.98); }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }

        @keyframes shrink-width {
          0% { width: 100%; }
          100% { width: 0%; }
        }

        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes zoom-bounce-in {
          0% { transform: scale(0.3) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes modal-bounce-in {
          0% { transform: scale(0.3) translateY(-50px); opacity: 0; }
          50% { transform: scale(1.05) translateY(10px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }

        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        @keyframes bounce-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @keyframes draw-check {
          0% { stroke-dasharray: 0 50; }
          100% { stroke-dasharray: 50 0; }
        }

        @keyframes slide-up-1 {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes slide-up-2 {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes slide-up-3 {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes fade-in-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes counter {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes scale-in {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes slide-in-left {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }

        @keyframes slide-in-right {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }

        .animate-slide-bounce-in { animation: slide-bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-shrink-width { animation: shrink-width 4s linear; }
        .animate-pulse-scale { animation: pulse-scale 2s infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-zoom-bounce-in { animation: zoom-bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-modal-bounce-in { animation: modal-bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-float-1 { animation: float-1 6s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 8s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 7s ease-in-out infinite; }
        .animate-bounce-scale { animation: bounce-scale 2s infinite; }
        .animate-draw-check { animation: draw-check 0.8s ease-out; }
        .animate-slide-up-1 { animation: slide-up-1 0.6s ease-out; }
        .animate-slide-up-2 { animation: slide-up-2 0.8s ease-out; }
        .animate-slide-up-3 { animation: slide-up-3 1s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; opacity: 0; }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-subtle { animation: pulse-subtle 2s ease-in-out infinite; }
        .animate-counter { animation: counter 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-slide-in-left { animation: slide-in-left 0.5s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out; }

        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      `}</style>
    </div>
  );
}
