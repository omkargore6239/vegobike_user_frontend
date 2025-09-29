import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { ROUTES } from '../../utils/constants';

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
          bg: 'from-red-500 to-red-600',
          border: 'border-red-200',
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
        
        {/* Page Size Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-600">bookings per page</span>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* First page */}
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
              >
                1
              </button>
              {startPage > 2 && <span className="text-gray-400">...</span>}
            </>
          )}

          {/* Page numbers */}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                page === currentPage
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Last page */}
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-all duration-200 ${
              currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Page Info */}
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
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
  
  // Pagination and Sorting State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('latest');
  const [activeTab, setActiveTab] = useState('all');

  // Check if there's a new booking from the navigation state
  useEffect(() => {
    if (location.state?.showSuccess) {
      setShowSuccessAnimation(true);
      setSuccessData({
        title: '🎉 Booking Confirmed!',
        message: 'Your booking has been successfully created and is ready to go!'
      });
      
      // Clear the state to prevent showing the message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch bookings on component mount and when parameters change
  useEffect(() => {
    fetchBookings();
  }, [currentPage, pageSize, sortBy, user]);

  const fetchBookings = async () => {
    if (!user?.customerId && !user?.id) {
      setError('Customer ID not found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Use the customer ID from user object, default to 33 for testing
      const customerId = user.customerId || user.id || 33;
      
      console.log('📋 Fetching bookings for customer:', customerId);
      
      const response = await bookingService.getBookingsByCustomer(customerId, {
        page: currentPage - 1, // API expects 0-based page index
        size: pageSize,
        sortBy: sortBy
      });
      
      console.log('✅ Fetched bookings response:', response);
      
      // If response is array, use it directly. If it's paginated response, extract data
      const bookingsData = Array.isArray(response) ? response : response.content || response.data || [];
      const total = response.totalElements || response.total || bookingsData.length;
      
      setBookings(bookingsData);
      setTotalPages(Math.ceil(total / pageSize));
      
      // Check for latest booking in localStorage and add it if not in the fetched list
      const latestBooking = localStorage.getItem('latestBooking');
      if (latestBooking) {
        const parsedBooking = JSON.parse(latestBooking);
        const existsInFetched = bookingsData.some(b => b.bookingId === parsedBooking.bookingId);
        
        if (!existsInFetched && currentPage === 1) {
          setBookings(prev => [parsedBooking, ...prev]);
        }
        
        // Clear from localStorage after adding
        localStorage.removeItem('latestBooking');
      }
      
    } catch (error) {
      console.error('💥 Error fetching bookings:', error);
      
      // Fallback to legacy API if customer-specific API fails
      if (error.response?.status === 404 || error.response?.status === 400) {
        console.log('🔄 Falling back to legacy getAllBookings API...');
        try {
          const fallbackResponse = await bookingService.getAllBookings();
          setBookings(fallbackResponse || []);
          setTotalPages(1);
        } catch (fallbackError) {
          console.error('💥 Fallback API also failed:', fallbackError);
          setError('Failed to load bookings. Please try again.');
        }
      } else {
        setError('Failed to load bookings. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, title, message) => {
    setAlertData({ type, title, message });
    setShowAlert(true);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId, 'USER');
      showNotification('success', '✅ Cancelled!', 'Booking cancelled successfully');
      
      // Refresh bookings
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showNotification('error', '❌ Error!', 'Failed to cancel booking. Please try again.');
    }
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
      case 'pending':
      case 'booked':
        return 'bg-yellow-500 text-white';
      case 'confirmed':
      case 'accepted':
        return 'bg-blue-600 text-white';
      case 'active':
      case 'ongoing':
      case 'started':
        return 'bg-yellow-500 text-white animate-pulse';
      case 'completed':
      case 'finished':
        return 'bg-green-600 text-white';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const canCancelBooking = (booking) => {
    const status = booking.bookingStatus?.toLowerCase() || booking.status?.toLowerCase();
    return status === 'pending' || status === 'booked' || status === 'confirmed';
  };

  // Filter bookings based on active tab (client-side filtering for status)
  const filteredBookings = bookings.filter(booking => {
    const status = booking.bookingStatus?.toLowerCase() || booking.status?.toLowerCase();
    if (activeTab === 'active') {
      return status !== 'completed' && status !== 'finished' && status !== 'cancelled';
    } else if (activeTab === 'completed') {
      return status === 'completed' || status === 'finished';
    }
    return true; // 'all' tab shows everything
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 animate-pulse">Loading your adventures...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-red-400 text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Error Loading Bookings
            </h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={fetchBookings}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        
        {/* Enhanced Header */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl blur-lg opacity-30 animate-pulse-slow"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="bg-white px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => navigate(ROUTES.RENTAL)} 
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

        {/* Controls Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            
            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              {['all', 'active', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab === 'all' ? '📋 All Trips' : 
                   tab === 'active' ? '🔄 Active' : '✅ Completed'}
                </button>
              ))}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount">Amount (High to Low)</option>
                <option value="status">Status</option>
              </select>

              <Link
                to={ROUTES.RENTAL}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                🚀 Book New Trip
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
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
                No {activeTab === 'all' ? '' : activeTab === 'active' ? 'Active' : 'Completed'} Adventures
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                {activeTab === 'active' 
                  ? 'Ready to start your next epic bike journey?' 
                  : activeTab === 'completed'
                    ? 'Complete some trips to see them here!'
                    : 'Ready to start your first adventure?'
                }
              </p>
              <Link
                to={ROUTES.RENTAL}
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-xl animate-bounce-subtle"
              >
                🚀 Start Your Journey
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Bookings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredBookings.map((booking, index) => {
                // Extract data from different possible structures
                const bikeData = booking.originalBookingData || booking;
                const totalsData = booking.totals || booking;
                
                return (
                  <div key={booking.bookingId || booking.id || index} className="group relative animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl blur opacity-0 group-hover:opacity-60 transition-all duration-500"></div>
                    <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform group-hover:scale-105 transition-all duration-500">
                      <div className="p-6">
                        
                        {/* Header with Image and Status */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="relative">
                            <img 
                              src={bikeData.bikeImage || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='48' viewBox='0 0 64 48'%3E%3Crect width='64' height='48' fill='%23e5e7eb'/%3E%3Ctext x='32' y='24' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='6' fill='%236b7280'%3EBike%3C/text%3E%3C/svg%3E`}
                              alt={bikeData.bikeName || 'Bike'}
                              className="w-16 h-12 object-cover rounded-lg shadow-md border border-gray-200"
                              onError={(e) => {
                                e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='48' viewBox='0 0 64 48'%3E%3Crect width='64' height='48' fill='%23e5e7eb'/%3E%3Ctext x='32' y='24' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='6' fill='%236b7280'%3EBike%3C/text%3E%3C/svg%3E`;
                              }}
                            />
                            {(booking.status === 'Active' || booking.bookingStatus === 'Active') && (
                              <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs font-bold px-1 py-0.5 rounded-full animate-pulse">
                                LIVE
                              </div>
                            )}
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(booking.bookingStatus || booking.status)}`}>
                            {getStatusText(booking.bookingStatus || booking.status)}
                          </div>
                        </div>

                        {/* Bike Info */}
                        <div className="mb-4">
                          <h2 className="font-bold text-lg mb-1 line-clamp-1 text-gray-900">
                            {bikeData.bikeName || 'Bike Rental'}
                          </h2>
                          <p className="text-gray-500 text-sm">{bikeData.registrationNumber || booking.vehicleRegistrationNumber || 'N/A'}</p>
                        </div>

                        {/* Trip Details */}
                        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                          <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                            <p className="text-gray-500 text-xs">ID</p>
                            <p className="font-semibold text-xs text-gray-900">#{booking.bookingId || booking.id || 'N/A'}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                            <p className="text-gray-500 text-xs">Location</p>
                            <p className="font-semibold text-xs line-clamp-1 text-gray-900">{bikeData.city || bikeData.storeName || 'N/A'}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                            <p className="text-gray-500 text-xs">Package</p>
                            <p className="font-semibold text-xs text-gray-900">{bikeData.packageName || 'Standard'}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                            <p className="text-gray-500 text-xs">Amount</p>
                            <p className="font-semibold text-sm text-gray-900">₹{(booking.finalAmount || totalsData.total || 0).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="text-xs text-gray-500 mb-4">
                          <div className="flex justify-between">
                            <span>Start: {formatDate(booking.startDate)}</span>
                            <span>End: {formatDate(booking.endDate)}</span>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="border-t pt-4 mt-4">
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <div className="text-gray-500 text-xs">Payment Method</div>
                              <div className="font-medium text-xs">
                                {booking.paymentMethod || bikeData.paymentMethod || 'N/A'}
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-500 text-xs">Payment Status</div>
                              <div className="font-medium text-xs">
                                {booking.paymentStatus || 'Pending'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-2">
                            {canCancelBooking(booking) && (
                              <button
                                onClick={() => handleCancelBooking(booking.bookingId || booking.id)}
                                className="group flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg font-bold text-xs hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                              >
                                <svg className="w-3 h-3 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                              </button>
                            )}
                            
                            <button className="group flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-xs hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                              <svg className="w-3 h-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              Support
                            </button>
                          </div>

                          <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            (booking.paymentMethod || bikeData.paymentMethod) === 'online' 
                              ? 'bg-green-100 text-green-700 border border-green-200' 
                              : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          }`}>
                            {(booking.paymentMethod || bikeData.paymentMethod) === 'online' ? '💳' : '💵'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        )}
      </div>

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

        @keyframes counter {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .animate-slide-bounce-in { animation: slide-bounce-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-shrink-width { animation: shrink-width 4s linear; }
        .animate-pulse-scale { animation: pulse-scale 2s infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-zoom-bounce-in { animation: zoom-bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
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
        .animate-counter { animation: counter 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55); }

        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      `}</style>
    </div>
  );
};

export default MyBookings;
