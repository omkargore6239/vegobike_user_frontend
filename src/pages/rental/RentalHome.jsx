import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useRental } from '../../context/RentalContext';
import RentalCard from '../../components/rental/RentalCard';
import RentalFilters from '../../components/rental/RentalFilters';

const RentalHome = () => {
  const { getFilteredBikes, filters } = useRental();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackages, setSelectedPackages] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Parse search parameters from RentalSearch
  const searchData = {
    city: searchParams.get('city') || '',
    pickupMode: searchParams.get('pickupMode') || '',
    store: searchParams.get('store') || '',
    deliveryAddress: searchParams.get('deliveryAddress') || '',
    pickupDate: searchParams.get('pickupDate') || '',
    pickupTime: searchParams.get('pickupTime') || '',
    dropoffDate: searchParams.get('dropoffDate') || '',
    dropoffTime: searchParams.get('dropoffTime') || ''
  };

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredBikes = getFilteredBikes().filter(bike =>
    bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bike.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Package options with manual pricing
  const packageOptions = [
    { label: "1 Day", key: "1_day", duration: 1, price: 299, popular: false },
    { label: "7 Days", key: "7_days", duration: 7, price: 1899, popular: true },
    { label: "15 Days", key: "15_days", duration: 15, price: 3599, popular: false },
    { label: "30 Days", key: "30_days", duration: 30, price: 6999, popular: false }
  ];

  // Handle package selection with animations
  const handlePackageSelect = (bikeId, packageOption) => {
    setSelectedPackages(prev => {
      if (prev[bikeId]?.key === packageOption.key) {
        // Unselect - remove completely
        const newSelection = {...prev};
        delete newSelection[bikeId];
        return newSelection;
      } else {
        // Select new package
        return { ...prev, [bikeId]: packageOption };
      }
    });
  };

  // Enhanced Rental Card Component
  const EnhancedRentalCard = ({ bike }) => {
    const selectedPackage = selectedPackages[bike.id];
    const finalPrice = selectedPackage ? selectedPackage.price : bike.pricePerHour * 24;

    return (
      <article className="overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1">
        {/* Bike Image */}
        <div className="relative">
          <img 
            src={bike.image} 
            alt={`${bike.brand || bike.company} ${bike.name}`} 
            className="h-28 sm:h-36 w-full object-cover"
            onError={(e) => {
              e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23e5e7eb'/%3E%3Ctext x='150' y='100' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='16' fill='%236b7280'%3E${bike.brand || bike.company} ${bike.name}%3C/text%3E%3C/svg%3E`;
            }}
          />
        </div>

        {/* Bike Details */}
        <div className="p-3 sm:p-4">
          <div className="mb-3">
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              {bike.brand || bike.company} {bike.name}
            </h3>
            <div className="text-xs sm:text-sm text-gray-600 mt-1 space-y-1">
              <div>
                <span className="font-medium">Type:</span> {bike.type || 'Bike'}
              </div>
              <div>
                <span className="font-medium">Hourly Rate:</span> ₹{bike.pricePerHour}/hour
              </div>
              {bike.location && (
                <div className="truncate">
                  <span className="font-medium">Location:</span> {bike.location}
                </div>
              )}
            </div>
          </div>

          {/* Package Selection with Manual Pricing */}
          <div className="mb-3">
            <h4 className="mb-2 text-xs sm:text-sm font-semibold text-gray-900">
              {selectedPackage ? 'Package Selected' : 'Choose Package'}
            </h4>
            <div className="grid grid-cols-2 gap-1 sm:gap-2">
              {packageOptions.map((pkg) => (
                <button
                  key={pkg.key}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePackageSelect(bike.id, pkg);
                  }}
                  className={`relative overflow-hidden rounded-md sm:rounded-lg border-2 p-1.5 sm:p-2.5 text-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 ${
                    selectedPackage?.key === pkg.key
                      ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-105 animate-pulse'
                      : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50 hover:scale-102'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -right-1 -top-1 rounded-full bg-orange-500 px-1 sm:px-1.5 py-0.5 text-xs font-bold text-white">
                      ★
                    </div>
                  )}
                  <div className={`text-xs font-medium transition-colors duration-150 ${
                    selectedPackage?.key === pkg.key ? 'text-white' : 'text-gray-600'
                  }`}>
                    {pkg.label}
                  </div>
                  <div className={`text-xs sm:text-sm font-bold transition-colors duration-150 ${
                    selectedPackage?.key === pkg.key ? 'text-white' : 'text-gray-900'
                  }`}>
                    ₹{pkg.price.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Security Deposit */}
          <div className="mb-3 text-center">
            <p className="text-xs text-red-600 font-medium">
              *Security deposit: ₹{bike.securityDeposit || 2000} (refundable)
            </p>
          </div>

          {/* Use your existing RentalCard's book functionality */}
          <div className="space-y-2">
            {/* Price Display */}
            <div className="text-center">
              <span className="text-lg font-bold text-blue-600">
                Total: ₹{finalPrice.toLocaleString()}
              </span>
              {selectedPackage && (
                <div className="text-xs text-gray-500">
                  {selectedPackage.label} Package Selected
                </div>
              )}
            </div>
            
            {/* Your existing RentalCard component for booking functionality */}
            <div className="opacity-0 h-0 overflow-hidden">
              <RentalCard bike={bike} />
            </div>
            
            {/* Custom Book Now Button that triggers your existing functionality */}
            <Link
              to={`/rental/bike/${bike.id}`}
              state={{ 
                bike, 
                selectedPackage, 
                finalPrice,
                packageDetails: selectedPackage,
                searchData // Pass search data to booking
              }}
              className="block w-full rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg hover:from-blue-900 hover:to-blue-900 hover:shadow-xl hover:scale-102 focus:ring-blue-500 active:scale-95 text-center"
            >
              Book Now
            </Link>
          </div>
        </div>
      </article>
    );
  };

  // Active filter count (from your existing filters)
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (filters.brand && filters.brand.length > 0) count++;
    if (filters.type && filters.type.length > 0) count++;
    if (filters.priceRange && (filters.priceRange.min || filters.priceRange.max)) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Search Summary */}
      {searchData.city && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link 
                to="/search"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Back to Search</span>
              </Link>
              <div className="text-right">
                <h1 className="text-lg font-bold text-gray-900 sm:text-2xl">
                  Available in {searchData.city}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {searchData.pickupDate && searchData.pickupTime && 
                    `${new Date(searchData.pickupDate).toLocaleDateString()} ${searchData.pickupTime}`}
                  {searchData.dropoffDate && searchData.dropoffTime && 
                    ` → ${new Date(searchData.dropoffDate).toLocaleDateString()} ${searchData.dropoffTime}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar - Your existing RentalFilters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Search Bar in Filters */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search bikes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <RentalFilters />
            </div>
          </div>

          {/* Bikes Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Bikes ({filteredBikes.length})
              </h2>
            </div>

            {filteredBikes.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="mx-auto mb-4 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">No bikes found</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Try adjusting your filters or search terms, or try a new search
                </p>
                <Link
                  to="/rental/search"
                  className="mt-4 inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  New Search
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-20 lg:pb-6">
                {filteredBikes.map((bike) => (
                  <EnhancedRentalCard key={bike.id} bike={bike} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
        >
          <div className="relative">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {activeFilterCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)}></div>
          <div className="relative min-h-screen flex items-end">
            <div className="relative bg-white w-full max-h-[80vh] overflow-y-auto rounded-t-2xl">
              <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                {/* Search Bar in Mobile */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search bikes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <RentalFilters />
                <div className="mt-6">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Apply Filters ({filteredBikes.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalHome;
