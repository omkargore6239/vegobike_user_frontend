import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { STORAGE_KEYS } from '../../utils/constants';
import axios from 'axios';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  WrenchScrewdriverIcon,
  PhoneIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const ServiceHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, completed, pending, cancelled

  const getUserData = () => {
    if (user) return user;
    try {
      const cachedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (cachedUser) return JSON.parse(cachedUser);
    } catch (error) {
      console.error('Error parsing cached user:', error);
    }
    return null;
  };
  const currentUser = getUserData();

  const mapStatus = (status) => {
    switch(status) {
      case 1: return 'completed';
      case 0: return 'pending';
      case 2: return 'cancelled';
      default: return 'pending';
    }
  };

  useEffect(() => {
    const fetchServiceHistory = async () => {
      if (!currentUser) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (!token) throw new Error("Missing authentication token");

        const response = await axios.get(
          'http://localhost:8080/api/service-orders/customer',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Map backend response to frontend-friendly fields
        const mappedData = response.data.map(service => ({
          id: service.id,
          userId: service.customerId,
          userName: currentUser.name || 'User Profile',
          userPhone: currentUser.phoneNumber || 'N/A',
          userEmail: currentUser.email || null,
          bikeModel: service.vehicleNumber,
          location: service.doorstepAddress || 'Store',
          amount: service.finalAmount || service.orderAmount,
          time: service.slotTime,
          date: service.nextServiceDate,
          description: service.serviceComments || '',
          status: mapStatus(service.orderStatus),
          serviceType: 'Bike Service', // placeholder if your backend doesn’t provide type
          mechanic: 'Assigned Mechanic', // placeholder if mechanic info is not in API
          mechanicPhone: '+91 0000000000' // placeholder
        }));

        setServiceHistory(mappedData);
      } catch (err) {
        console.error('Error fetching service history:', err);
        setError("Failed to load service history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchServiceHistory();
  }, [currentUser, isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-700 bg-green-100 border-green-200';
      case 'pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'cancelled': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-5 w-5" />;
      case 'pending': return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'cancelled': return <XCircleIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  const filteredHistory = serviceHistory.filter(
    service => filter === 'all' || service.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your service history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <ClockIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Service History</h1>
          </div>
          <p className="text-gray-600 text-lg">Track all your bike service requests and their status</p>
          {currentUser && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-200">
              <UserIcon className="h-4 w-4 text-indigo-600" />
              <span>
                <strong>User ID:</strong> {currentUser.id} | 
                <strong> Name:</strong> {currentUser.name || 'User Profile'} | 
                <strong> Phone:</strong> +91 {currentUser.phoneNumber || 'N/A'}
              </span>
            </div>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['all','completed','pending','cancelled'].map(key => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                filter === key
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200'
              }`}
            >
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                filter === key 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {key === 'all' ? serviceHistory.length : serviceHistory.filter(s => s.status === key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Service Cards */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <WrenchScrewdriverIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Service History Found</h3>
            <p className="text-gray-600 mb-6">You haven't requested any services yet.</p>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              Book Your First Service
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map(service => (
              <div key={service.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <WrenchScrewdriverIcon className="h-5 w-5 text-indigo-600 mr-2" />
                      {service.serviceType}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(service.status)}`}>
                      {getStatusIcon(service.status)}
                      <span className="capitalize">{service.status}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Bike:</strong> {service.bikeModel}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{service.date} at {service.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-sm">
                          {service.mechanic.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{service.mechanic}</p>
                        <p className="text-xs text-gray-500">Mechanic</p>
                      </div>
                    </div>
                    <a href={`tel:${service.mechanicPhone}`} className="p-2 bg-green-50 hover:bg-green-100 rounded-full transition-colors">
                      <PhoneIcon className="h-4 w-4 text-green-600" />
                    </a>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Location:</strong> {service.location}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-600">Service Amount</span>
                    <div className="flex items-center text-lg font-semibold text-gray-900">
                      <CurrencyRupeeIcon className="h-5 w-5" />
                      <span>{service.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex space-x-2">
                  {service.status === 'pending' && (
                    <button className="flex-1 bg-red-50 text-red-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                      Cancel Request
                    </button>
                  )}
                  {/* <button className="flex-1 bg-indigo-50 text-indigo-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                    View Details
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceHistory;