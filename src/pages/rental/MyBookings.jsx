import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import bookingService from '../../services/bookingService';
import { ROUTES } from '../../utils/constants';
import TripManagementModal from '../../components/rental/TripManagementModal';


// Modern Alert/Notification Component
const ModernAlert = ({ show, onClose, type, title, message, autoClose = true }) => {
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, autoClose]);

  if (!show) return null;

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-blue-500 to-indigo-600',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        };
      case 'error':
        return {
          bg: 'from-red-500 to-red-600',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
      default:
        return {
          bg: 'from-blue-500 to-indigo-600',
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
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
const SuccessAnimation = ({ show, onClose, title, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md mx-4 overflow-hidden animate-zoom-bounce-in">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100"></div>
        
        <div className="relative p-8 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce-scale">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600 leading-relaxed mb-6">{message}</p>
          
          <button onClick={onClose} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};


// Documents Modal Component
const DocumentsModal = ({ show, onClose, documents, loading }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden animate-zoom-bounce-in max-h-[90vh] flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 opacity-50"></div>
        
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">📄 Bike Documents</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-8 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading documents...</p>
            </div>
          ) : documents ? (
            <div className="space-y-6">
              {/* Registration Certificate */}
              {documents.registrationCertificate && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-2xl">📋</span>
                      Registration Certificate
                    </h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={documents.registrationCertificate} 
                      alt="Registration Certificate" 
                      className="w-full h-auto object-contain max-h-64 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => window.open(documents.registrationCertificate, '_blank')}
                    />
                  </div>
                  <button
                    onClick={() => window.open(documents.registrationCertificate, '_blank')}
                    className="mt-3 w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors"
                  >
                    🔍 View Full Size
                  </button>
                </div>
              )}

              {/* Insurance Certificate */}
              {documents.insuranceCertificate && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-2xl">🛡️</span>
                      Insurance Certificate
                    </h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={documents.insuranceCertificate} 
                      alt="Insurance Certificate" 
                      className="w-full h-auto object-contain max-h-64 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => window.open(documents.insuranceCertificate, '_blank')}
                    />
                  </div>
                  <button
                    onClick={() => window.open(documents.insuranceCertificate, '_blank')}
                    className="mt-3 w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors"
                  >
                    🔍 View Full Size
                  </button>
                </div>
              )}

              {/* Pollution Certificate */}
              {documents.pollutionCertificate && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-2xl">🌿</span>
                      Pollution Certificate
                    </h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <img 
                      src={documents.pollutionCertificate} 
                      alt="Pollution Certificate" 
                      className="w-full h-auto object-contain max-h-64 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => window.open(documents.pollutionCertificate, '_blank')}
                    />
                  </div>
                  <button
                    onClick={() => window.open(documents.pollutionCertificate, '_blank')}
                    className="mt-3 w-full bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors"
                  >
                    🔍 View Full Size
                  </button>
                </div>
              )}

              {!documents.registrationCertificate && !documents.insuranceCertificate && !documents.pollutionCertificate && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-600">No documents available</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <p className="text-gray-600">Failed to load documents</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative px-8 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


// Pagination Component
const PaginationControls = ({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange }) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Show:</span>
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="px-3 py-2 border rounded-lg text-sm">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600">per page</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className={`p-2 rounded-lg transition-all ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {startPage > 1 && (
            <>
              <button onClick={() => onPageChange(1)} className="px-3 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50">1</button>
              {startPage > 2 && <span className="text-gray-400">...</span>}
            </>
          )}

          {pageNumbers.map((page) => (
            <button key={page} onClick={() => onPageChange(page)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${page === currentPage ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-600 hover:bg-blue-50'}`}>
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
              <button onClick={() => onPageChange(totalPages)} className="px-3 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50">{totalPages}</button>
            </>
          )}

          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`p-2 rounded-lg transition-all ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="text-sm text-gray-600">Page {currentPage} of {totalPages}</div>
      </div>
    </div>
  );
};


const MyBookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({});
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [successData, setSuccessData] = useState({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('latest');
  const [activeTab, setActiveTab] = useState('all');

  // Trip Management Modal State
  const [showTripModal, setShowTripModal] = useState(false);
  const [selectedTripBooking, setSelectedTripBooking] = useState(null);
  const [tripType, setTripType] = useState(null);

  // Documents Modal State
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [documentsData, setDocumentsData] = useState(null);
  const [documentsLoading, setDocumentsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.showSuccess) {
      setShowSuccessAnimation(true);
      setSuccessData({
        title: '🎉 Booking Confirmed!',
        message: 'Your booking has been successfully created!'
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, pageSize, sortBy, user]);

  const getCustomerId = () => {
    let customerId = null;
    if (user?.data) {
      customerId = user.data.id || user.data.userId || user.data.customerId;
    }
    if (!customerId) {
      customerId = user?.userId || user?.id || user?.customerId || user?.sub;
    }
    return customerId;
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const customerId = getCustomerId();
      
      if (!customerId) {
        setError('Customer ID not found. Please login again.');
        setLoading(false);
        return;
      }
      
      const response = await bookingService.getAllBookings();
      const allBookings = Array.isArray(response) ? response : response.data || [];
      
      const customerBookings = allBookings.filter(b => {
        const bookingCustomerId = parseInt(b.customerId);
        const currentCustomerId = parseInt(customerId);
        return bookingCustomerId === currentCustomerId;
      });
      
      console.log('📋 Customer bookings with status:', customerBookings.map(b => ({ id: b.bookingId, status: b.status })));
      
      const sortedBookings = [...customerBookings].sort((a, b) => {
        if (sortBy === 'latest') return b.id - a.id;
        if (sortBy === 'oldest') return a.id - b.id;
        if (sortBy === 'amount') return (b.finalAmount || 0) - (a.finalAmount || 0);
        return 0;
      });
      
      const latestBookingStr = localStorage.getItem('latestBooking');
      if (latestBookingStr) {
        try {
          const latestBooking = JSON.parse(latestBookingStr);
          const existsInFetched = sortedBookings.some(b => 
            b.id === latestBooking.id || b.bookingId === latestBooking.bookingId
          );
          if (!existsInFetched) {
            sortedBookings.unshift(latestBooking);
          }
          localStorage.removeItem('latestBooking');
        } catch (parseError) {
          localStorage.removeItem('latestBooking');
        }
      }
      
      setBookings(sortedBookings);
      setTotalPages(Math.ceil(sortedBookings.length / pageSize));
      
    } catch (error) {
      console.error('💥 FETCH_BOOKINGS - Error:', error);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, title, message) => {
    setAlertData({ type, title, message });
    setShowAlert(true);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(bookingId, 'USER');
      showNotification('success', '✅ Cancelled!', 'Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showNotification('error', '❌ Error!', 'Failed to cancel booking.');
    }
  };

  // Trip Management Handlers
  const handleOpenTripModal = (booking, type) => {
    console.log('🚗 Opening trip modal - Type:', type, 'Booking:', booking);
    setSelectedTripBooking(booking);
    setTripType(type);
    setShowTripModal(true);
  };

  const handleCloseTripModal = () => {
    setShowTripModal(false);
    setSelectedTripBooking(null);
    setTripType(null);
  };

  const handleStartTrip = async (bookingId, images) => {
    try {
      console.log('🚗 START_TRIP - Booking:', bookingId, 'Images:', images.length);
      const response = await bookingService.startTrip(bookingId, images);
      console.log('🚗 START_TRIP - Response:', response);
      
      showNotification('success', '🚗 Trip Started!', 'Your trip has been started successfully');
      handleCloseTripModal();
      
      setTimeout(() => {
        fetchBookings();
      }, 1000);
    } catch (error) {
      console.error('💥 START_TRIP - Error:', error);
      showNotification('error', '❌ Error!', error.response?.data?.message || 'Failed to start trip');
      throw error;
    }
  };

  const handleEndTrip = async (bookingId, images) => {
    try {
      console.log('🏁 END_TRIP - Booking:', bookingId, 'Images:', images.length);
      const response = await bookingService.endTrip(bookingId, images);
      console.log('🏁 END_TRIP - Response:', response);
      
      showNotification('success', '🏁 Trip Ended!', 'Your trip has been completed successfully');
      handleCloseTripModal();
      
      setTimeout(() => {
        fetchBookings();
      }, 1000);
    } catch (error) {
      console.error('💥 END_TRIP - Error:', error);
      showNotification('error', '❌ Error!', error.response?.data?.message || 'Failed to end trip');
      throw error;
    }
  };

  // View Documents Handler
  const handleViewDocuments = async (vehicleId) => {
    try {
      console.log('📄 VIEW_DOCUMENTS - Vehicle ID:', vehicleId);
      
      if (typeof bookingService.getVehicleDocuments !== 'function') {
        console.error('❌ getVehicleDocuments is not a function!');
        showNotification('error', '❌ Error!', 'Document service is not available. Please refresh the page.');
        return;
      }

      setDocumentsLoading(true);
      setShowDocumentsModal(true);
      setDocumentsData(null);
      
      const response = await bookingService.getVehicleDocuments(vehicleId);
      console.log('📄 Documents response:', response);
      
      const docs = response?.data || response;
      setDocumentsData(docs);
      
    } catch (error) {
      console.error('💥 VIEW_DOCUMENTS - Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load documents';
      showNotification('error', '❌ Error!', errorMessage);
      setShowDocumentsModal(false);
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleCloseDocumentsModal = () => {
    setShowDocumentsModal(false);
    setDocumentsData(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || 'unknown';
    switch (statusLower) {
      case 'confirmed': return 'bg-blue-600 text-white';
      case 'accepted':
      case 'booking accepted': return 'bg-green-600 text-white';
      case 'started':
      case 'trip started':
      case 'start trip': return 'bg-yellow-500 text-white animate-pulse';
      case 'ended':
      case 'trip ended':
      case 'end trip': return 'bg-orange-500 text-white';
      case 'completed': return 'bg-green-700 text-white';
      case 'cancelled': return 'bg-red-600 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const canCancelBooking = (booking) => {
    const status = booking.status?.toLowerCase();
    return status === 'confirmed' || 
           status === 'accepted' || 
           status === 'booking accepted';
  };

  const canShowStartTrip = (booking) => {
    const status = booking.status?.toLowerCase();
    return status === 'accepted' || status === 'booking accepted';
  };

  const canShowEndTrip = (booking) => {
    const status = booking.status?.toLowerCase();
    return status === 'started' || 
           status === 'trip started' || 
           status === 'start trip';
  };

  const canShowViewDocuments = (booking) => {
    const status = booking.status?.toLowerCase();
    return status === 'started' || 
           status === 'trip started' || 
           status === 'start trip' ||
           status === 'ended' ||
           status === 'trip ended' ||
           status === 'end trip';
  };

  const filteredBookings = bookings.filter(booking => {
    const status = booking.status?.toLowerCase();
    if (activeTab === 'active') return status !== 'completed' && status !== 'cancelled';
    if (activeTab === 'completed') return status === 'completed';
    return true;
  });

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 animate-pulse">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading Bookings</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button onClick={fetchBookings} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-6 px-4">
      
      <ModernAlert show={showAlert} onClose={() => setShowAlert(false)} type={alertData.type} title={alertData.title} message={alertData.message} />
      <SuccessAnimation show={showSuccessAnimation} onClose={() => setShowSuccessAnimation(false)} title={successData.title} message={successData.message} />

      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl blur-lg opacity-30"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-white px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button onClick={() => navigate(ROUTES.RENTAL)} className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-all">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold mb-2 text-gray-900">🚗 My Bookings</h1>
                    <p className="text-gray-600">Track and manage your bike rentals</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{bookings.length}</div>
                  <div className="text-gray-500 text-sm">Total Bookings</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            
            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              {['all', 'active', 'completed'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-md' : 'text-gray-600'}`}>
                  {tab === 'all' ? '📋 All' : tab === 'active' ? '🔄 Active' : '✅ Completed'}
                </button>
              ))}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} className="px-4 py-2 border rounded-lg text-sm">
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount">Amount (High to Low)</option>
              </select>

              <Link to={ROUTES.RENTAL} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-xl transform hover:scale-105">
                🚀 New Booking
              </Link>
            </div>
          </div>
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="relative bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Bookings</h3>
            <p className="text-gray-600 mb-8 text-lg">Ready to start your next bike journey?</p>
            <Link to={ROUTES.RENTAL} className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transform hover:scale-105">
              🚀 Start Booking
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentBookings.map((booking) => (
                <div key={booking.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl blur opacity-0 group-hover:opacity-60 transition-all"></div>
                  <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border hover:scale-105 transition-all">
                    <div className="p-6">
                      
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-bold text-gray-500">#{booking.bookingId}</div>
                        <div className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="mb-4">
                        <h2 className="font-bold text-lg mb-1">Bike #{booking.vehicleId}</h2>
                        <p className="text-gray-500 text-sm">Customer #{booking.customerId}</p>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-gray-500 text-xs">Amount</p>
                          <p className="font-semibold">₹{(booking.finalAmount || 0).toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-gray-500 text-xs">Payment</p>
                          <p className="font-semibold text-xs">{booking.paymentStatus || 'PENDING'}</p>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="text-xs text-gray-500 mb-3">
                        Created: {formatDate(booking.createdAt)}
                      </div>

                      {/* ✅ UPDATED: Compact Actions with smaller buttons */}
                      <div className="flex flex-col gap-1.5">
                        {/* Cancel Button */}
                        {canCancelBooking(booking) && (
                          <button 
                            onClick={() => handleCancelBooking(booking.id)} 
                            className="w-full bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700 transition-all"
                          >
                            Cancel Booking
                          </button>
                        )}
                        
                        {/* Start Trip Button */}
                        {canShowStartTrip(booking) && (
                          <button
                            onClick={() => handleOpenTripModal(booking, 'start')}
                            className="w-full bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-700 transition-all"
                          >
                            Start Trip
                          </button>
                        )}
                        
                        {/* ✅ NEW: End Trip and View Documents side by side */}
                        {canShowEndTrip(booking) && (
                          <div className="grid grid-cols-2 gap-1.5">
                            {/* End Trip Button - LEFT */}
                            <button
                              onClick={() => handleOpenTripModal(booking, 'end')}
                              className="bg-red-600 text-white px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700 transition-all"
                            >
                              End Trip
                            </button>
                            
                            {/* View Documents Button - RIGHT */}
                            <button
                              onClick={() => handleViewDocuments(booking.vehicleId)}
                              className="bg-blue-600 text-white px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all"
                            >
                              View Documents
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <PaginationControls currentPage={currentPage} totalPages={totalPages} pageSize={pageSize} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} />
            )}
          </>
        )}
      </div>

      {/* Trip Management Modal */}
      <TripManagementModal
        show={showTripModal}
        onClose={handleCloseTripModal}
        booking={selectedTripBooking}
        onStartTrip={handleStartTrip}
        onEndTrip={handleEndTrip}
        tripType={tripType}
      />

      {/* Documents Modal */}
      <DocumentsModal
        show={showDocumentsModal}
        onClose={handleCloseDocumentsModal}
        documents={documentsData}
        loading={documentsLoading}
      />

      <style jsx>{`
        @keyframes slide-bounce-in { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
        @keyframes shrink-width { 0% { width: 100%; } 100% { width: 0%; } }
        @keyframes pulse-scale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoom-bounce-in { 0% { transform: scale(0.3); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes bounce-scale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }

        .animate-slide-bounce-in { animation: slide-bounce-in 0.8s; }
        .animate-shrink-width { animation: shrink-width 4s linear; }
        .animate-pulse-scale { animation: pulse-scale 2s infinite; }
        .animate-fade-in { animation: fade-in 0.5s; }
        .animate-zoom-bounce-in { animation: zoom-bounce-in 0.6s; }
        .animate-bounce-scale { animation: bounce-scale 2s infinite; }
      `}</style>
    </div>
  );
};

export default MyBookings;
