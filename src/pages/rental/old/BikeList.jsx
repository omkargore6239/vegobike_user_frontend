import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRental } from '../../context/RentalContext';
import RentalFilters from '../../components/rental/RentalFilters';

const RentalHome = () => {
  const { getFilteredBikes, filters } = useRental();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackages, setSelectedPackages] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states
  const [localFilters, setLocalFilters] = useState({
    brands: [],
    models: [],
    priceRange: { min: '', max: '' }
  });

  const filteredBikes = getFilteredBikes().filter(bike =>
    bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bike.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Package options (assuming similar structure as Results page)
  const packageOptions = [
    { label: "1 Day", key: "1_day", duration: 1, popular: false },
    { label: "7 Days", key: "7_days", duration: 7, popular: true },
    { label: "15 Days", key: "15_days", duration: 15, popular: false },
    { label: "30 Days", key: "30_days", duration: 30, popular: false }
  ];

  // Handle package selection
  const handlePackageSelect = (bikeId, packageOption) => {
    setSelectedPackages(prev => {
      if (prev[bikeId]?.key === packageOption.key) {
        const newSelection = {...prev};
        delete newSelection[bikeId];
        return newSelection;
      } else {
        return { ...prev, [bikeId]: packageOption };
      }
    });
  };

  // Handle book now
  const handleBookNow = (bike) => {
    const selectedPackage = selectedPackages[bike.id];
    navigate("/rental/checkout", { 
      state: { 
        bike, 
        selectedPackage: selectedPackage || null,
        packagePrice: selectedPackage ? bike.packages?.[selectedPackage.key] : null,
        finalPrice: selectedPackage ? bike.packages?.[selectedPackage.key] : bike.pricePerHour * 24,
        pricingType: selectedPackage ? 'package' : 'hourly'
      } 
    });
  };

  // Get unique filter options
  const getFilterOptions = () => {
    const brands = [...new Set(filteredBikes.map(bike => bike.brand || bike.company))];
    const models = [...new Set(filteredBikes.map(bike => bike.name))];
    return { brands, models };
  };

  const filterOptions = getFilterOptions();

  // Handle filter changes
  const handleFilterChange = (filterType, value, checked) => {
    setLocalFilters(prev => {
      if (filterType === 'priceRange') {
        return {
          ...prev,
          priceRange: { ...prev.priceRange, ...value }
        };
      } else {
        const currentValues = prev[filterType];
        const newValues = checked 
          ? [...currentValues, value]
          : currentValues.filter(item => item !== value);
        
        return {
          ...prev,
          [filterType]: newValues
        };
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setLocalFilters({
      brands: [],
      models: [],
      priceRange: { min: '', max: '' }
    });
  };

  // Filter Component
  const FilterSection = ({ isMobile = false }) => (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${isMobile ? '' : 'sticky top-4'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Search</h4>
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

      {/* Brands Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Brands</h4>
        <div className="space-y-2">
          {filterOptions.brands.map(brand => (
            <label key={brand} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.brands.includes(brand)}
                onChange={(e) => handleFilterChange('brands', brand, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Models Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Models</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {filterOptions.models.map(model => (
            <label key={model} className="flex items-center">
              <input
                type="checkbox"
                checked={localFilters.models.includes(model)}
                onChange={(e) => handleFilterChange('models', model, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{model}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // Apply local filters to bikes
  const finalFilteredBikes = filteredBikes.filter(bike => {
    // Apply brand filter
    if (localFilters.brands.length > 0) {
      if (!localFilters.brands.includes(bike.brand || bike.company)) {
        return false;
      }
    }
    
    // Apply model filter
    if (localFilters.models.length > 0) {
      if (!localFilters.models.includes(bike.name)) {
        return false;
      }
    }
    
    return true;
  });

  // Active filter count
  const activeFilterCount = localFilters.brands.length + localFilters.models.length + (localFilters.priceRange.min || localFilters.priceRange.max ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSection />
          </div>

          {/* Bikes Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-4 bg-white rounded-lg p-3 shadow-sm border">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">
                  Available Bikes ({finalFilteredBikes.length})
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Choose your perfect ride
                </p>
              </div>
            </div>

            {finalFilteredBikes.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="mx-auto mb-4 h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">No bikes match your search</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Try adjusting your search terms or filters to see more results.
                </p>
                <button
                  onClick={() => {
                    clearFilters();
                    setSearchTerm('');
                  }}
                  className="mt-4 bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Clear Search & Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-20 lg:pb-6">
                {finalFilteredBikes.map(bike => {
                  const selectedPackage = selectedPackages[bike.id];
                  const finalPrice = selectedPackage ? bike.packages?.[selectedPackage.key] : bike.pricePerHour * 24;
                  
                  return (
                    <article 
                      key={bike.id} 
                      className="overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
                    >
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
                            <div className="truncate">
                              <span className="font-medium">Price:</span> ₹{bike.pricePerHour}/hour
                            </div>
                          </div>
                        </div>

                        {/* Package Selection */}
                        {bike.packages && (
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
                                    ₹{bike.packages[pkg.key]?.toLocaleString() || 'N/A'}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Security Deposit */}
                        {bike.securityDeposit && (
                          <div className="mb-3 text-center">
                            <p className="text-xs text-red-600 font-medium">
                              *Security deposit: ₹{bike.securityDeposit.toLocaleString()} (refundable)
                            </p>
                          </div>
                        )}

                        {/* Book Now Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookNow(bike);
                          }}
                          className="w-full rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg hover:from-blue-900 hover:to-blue-900 hover:shadow-xl hover:scale-102 focus:ring-blue-500 active:scale-95"
                        >
                          <div className="flex items-center justify-center gap-2">
                            Book Now
                          </div>
                        </button>
                      </div>
                    </article>
                  );
                })}
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
                <FilterSection isMobile={true} />
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={clearFilters}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Apply Filters ({finalFilteredBikes.length})
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
