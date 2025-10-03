// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import FilterSidebar from './FilterSidebar';

// export default function Home() {
//   const [vehicles, setVehicles] = useState([]);
//   const [allVehicles, setAllVehicles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedFilters, setSelectedFilters] = useState({
//     categories: [],
//     locations: [],
//     budget: [],
//     brands: [],
//     models: [],
//     year: [],
//     fuelType: []
//   });
//   const vehiclesPerPage = 8;
//   const navigate = useNavigate();

//   // Fetch data from backend API
//   useEffect(() => {
//     const fetchVehicles = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await fetch('http://localhost:8081/api/bike-sales/user');
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();

//         // Transform backend data to match frontend structure
//         const transformedVehicles = (data.data || []).map((bike) => ({
//           type: 'bike',
//           image: bike.front_image || '/bike.jpg',
//           title: `${bike.brand?.brandName || 'Unknown'} ${bike.model?.modelName || 'Model'}`,
//           price: bike.sellingPrice ? `₹${bike.sellingPrice.toLocaleString()}` : '₹0',
//           priceValue: bike.sellingPrice || 0,
//           details: `${bike.year?.year || 'Unknown'} - ${bike.kmsDriven || 0} km`,
//           location: `${bike.bikeCondition || 'Unknown condition'}, ${bike.city || 'Unknown city'}`,
//           featured: bike.listingStatus === 'FEATURED' || false,
//           color: bike.color || 'Unknown',
//           customerNumber: bike.contactNumber || 'Not provided',
//           brand: bike.brand?.brandName || 'Unknown',
//           model: bike.model?.modelName || 'Unknown',
//           registrationNo: bike.registrationNumber || 'Not provided',
//           registrationYear: bike.year?.year || 'Unknown',
//           kmDriven: `${bike.kmsDriven || 0} km`,
//           chassisNumber: bike.vehicleChassisNumber || 'Not provided',
//           engineNumber: bike.vehicleEngineNumber || 'Not provided',
//           owner: bike.numberOfOwner ? `${bike.numberOfOwner}${getOrdinalSuffix(bike.numberOfOwner)} Owner` : 'Unknown',
//           id: bike.id,
//           bikeCondition: bike.bikeCondition,
//           address: bike.address,
//           email: bike.email,
//           description: bike.bikeDescription,
//           category: bike.category?.categoryName || 'Unknown',
//           createdAt: bike.createdAt,
//           updatedAt: bike.updatedAt
//         }));

//         setVehicles(transformedVehicles);
//         setAllVehicles(transformedVehicles);
//         console.log('✅ Fetched vehicles:', transformedVehicles.length);
//       } catch (err) {
//         console.error('❌ Error fetching vehicles:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVehicles();
//   }, []);

//   // Helper function for ordinal suffix
//   const getOrdinalSuffix = (num) => {
//     if (num === 1) return 'st';
//     if (num === 2) return 'nd';
//     if (num === 3) return 'rd';
//     return 'th';
//   };

//   // Apply filters when selectedFilters change
//   useEffect(() => {
//     applyFilters();
//   }, [selectedFilters]);

//   // Handle filters change from sidebar
//   const handleFiltersChange = (filters) => {
//     setSelectedFilters(filters);
//   };

//   // Apply filters to vehicles
//   const applyFilters = () => {
//     let filteredVehicles = [...allVehicles];

//     // Apply category filters
//     if (selectedFilters.categories.length > 0) {
//       filteredVehicles = filteredVehicles.filter(vehicle =>
//         selectedFilters.categories.includes(vehicle.category)
//       );
//     }

//     // Apply brand filters
//     if (selectedFilters.brands.length > 0) {
//       filteredVehicles = filteredVehicles.filter(vehicle =>
//         selectedFilters.brands.includes(vehicle.brand)
//       );
//     }

//     // Apply model filters
//     if (selectedFilters.models.length > 0) {
//       filteredVehicles = filteredVehicles.filter(vehicle =>
//         selectedFilters.models.includes(vehicle.model)
//       );
//     }

//     // Apply budget filters
//     if (selectedFilters.budget.length > 0) {
//       filteredVehicles = filteredVehicles.filter(vehicle => {
//         const price = vehicle.priceValue;
//         return selectedFilters.budget.some(budgetRange => {
//           if (budgetRange.includes('Under ₹50,000')) return price < 50000;
//           if (budgetRange.includes('₹50,000 - ₹1,00,000')) return price >= 50000 && price <= 100000;
//           if (budgetRange.includes('₹1,00,000 - ₹2,00,000')) return price >= 100000 && price <= 200000;
//           if (budgetRange.includes('₹2,00,000 - ₹3,00,000')) return price >= 200000 && price <= 300000;
//           if (budgetRange.includes('₹3,00,000 - ₹5,00,000')) return price >= 300000 && price <= 500000;
//           if (budgetRange.includes('Above ₹5,00,000')) return price > 500000;
//           return true;
//         });
//       });
//     }

//     setVehicles(filteredVehicles);
//     setCurrentPage(1);
//   };

//   // Clear all filters
//   const clearFilters = () => {
//     setSelectedFilters({
//       categories: [],
//       locations: [],
//       budget: [],
//       brands: [],
//       models: [],
//       year: [],
//       fuelType: []
//     });
//   };

//   // Color schemes for vehicle types
//   const typeColors = {
//     car: { primary: '#003366', secondary: '#80BFFF' },
//     bike: { primary: '#003366', secondary: '#80BFFF' },
//     scooter: { primary: '#003366', secondary: '#80BFFF' }
//   };

//   // Badge styles for vehicle types
//   const getTypeBadge = (type) => {
//     const badgeClasses = {
//       car: 'bg-blue-100 text-blue-800',
//       bike: 'bg-green-100 text-blue-800',
//       scooter: 'bg-purple-100 text-blue-800'
//     };
//     return (
//       <span className={`${badgeClasses[type]} px-2 py-1 rounded-full text-xs font-medium`}>
//         {type.charAt(0).toUpperCase() + type.slice(1)}
//       </span>
//     );
//   };

//   // Button styles for vehicle types
//   const getButtonClasses = (type) => {
//     const buttonClasses = {
//       car: 'bg-blue-600 hover:bg-blue-700',
//       bike: 'bg-blue-600 hover:bg-blue-700',
//       scooter: 'bg-blue-600 hover:bg-blue-700'
//     };
//     return `${buttonClasses[type]} text-white font-bold py-2 px-4 rounded-md w-full transition duration-300`;
//   };

//   // Calculate current vehicles for pagination
//   const indexOfLastVehicle = currentPage * vehiclesPerPage;
//   const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
//   const currentVehicles = vehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);

//   // Change page function
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Handle View Details click
//   const handleViewDetails = (vehicle) => {
//     navigate('/vehicle-details', { state: { vehicle } });
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-xl text-gray-600">Loading vehicles...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Empty state
//   if (!loading && vehicles.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="text-gray-400 text-6xl mb-4">🚲</div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">No Vehicles Found</h2>
//           <p className="text-gray-600 mb-4">No bikes match your current filters</p>
//           <button
//             onClick={clearFilters}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Clear All Filters
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header with vehicle count */}
//         <div className="mb-6 flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">Available Vehicles</h1>
//             <p className="text-gray-600">
//               Showing {vehicles.length} of {allVehicles.length} vehicles
//             </p>
//           </div>
//           {Object.values(selectedFilters).some(arr => arr.length > 0) && (
//             <button
//               onClick={clearFilters}
//               className="bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg"
//             >
//               Clear All Filters
//             </button>
//           )}
//         </div>

//         {/* Main content with sidebar and vehicle grid */}
//         <div className="flex gap-6">
//           {/* Filter Sidebar */}
//           <div className="w-1/4">
//             <FilterSidebar
//               onFiltersChange={handleFiltersChange}
//               selectedFilters={selectedFilters}
//             />
//           </div>

//           {/* Vehicle Grid */}
//           <div className="w-3/4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//               {currentVehicles.map((vehicle) => (
//                 <div
//                   key={vehicle.id}
//                   className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 border border-gray-200"
//                 >
//                   <div className="relative">
//                     <img
//                       src={vehicle.image}
//                       alt={vehicle.title}
//                       className="w-full h-48 object-cover"
//                       onError={(e) => {
//                         e.target.src = '/bike.jpg';
//                       }}
//                     />
//                     <div className="absolute top-0 left-0 m-2">
//                       {getTypeBadge(vehicle.type)}
//                     </div>
//                     {vehicle.featured && (
//                       <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 m-2 rounded-md text-xs font-semibold">
//                         Featured
//                       </div>
//                     )}
//                   </div>
//                   <div className="p-4">
//                     <h3 className="text-lg font-bold text-gray-900 mb-1">{vehicle.title}</h3>
//                     <p className="text-xl font-bold text-gray-800 mb-2">{vehicle.price}</p>
//                     <div className="flex items-center text-gray-600 mb-1">
//                       <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
//                       </svg>
//                       {vehicle.details}
//                     </div>
//                     <div className="flex items-center text-gray-600 text-sm">
//                       <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                       </svg>
//                       {vehicle.location}
//                     </div>
//                     <button
//                       className={getButtonClasses(vehicle.type) + " mt-4"}
//                       onClick={() => handleViewDetails(vehicle)}
//                     >
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination */}
//             {vehicles.length > vehiclesPerPage && (
//               <div className="flex justify-center mt-8">
//                 {Array.from({ length: Math.ceil(vehicles.length / vehiclesPerPage) }, (_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => paginate(i + 1)}
//                     className={`mx-1 px-3 py-2 rounded-full ${
//                       currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "./FilterSidebar";

// Professional Promotional Banner Component
const PromotionalBanner = () => {
  const banners = [
    {
      id: 1,
      title: "ENGINE REPAIR",
      discount: "UPTO 25% OFF",
      description:
        "Revitalize your ride with top-notch two-wheeler engine repair - Quick, reliable, and affordable!",
      bgGradient: "from-red-600 via-red-700 to-red-800",
      buttonText: "Book Service",
      icon: "🔧",
    },
    {
      id: 2,
      title: "BIKE SERVICING",
      discount: "UPTO 30% OFF",
      description:
        "Complete bike maintenance and servicing by certified mechanics - Keep your bike running smooth!",
      bgGradient: "from-blue-600 via-blue-700 to-blue-800",
      buttonText: "Get Quote",
      icon: "🛠️",
    },
    {
      id: 3,
      title: "SPARE PARTS",
      discount: "UPTO 20% OFF",
      description:
        "Genuine spare parts for all bike models - Original quality guaranteed with warranty!",
      bgGradient: "from-green-600 via-green-700 to-green-800",
      buttonText: "Shop Now",
      icon: "⚙️",
    },
    {
      id: 4,
      title: "BIKE INSURANCE",
      discount: "SAVE 40%",
      description:
        "Comprehensive bike insurance coverage with instant policy issuance - Protect your investment!",
      bgGradient: "from-purple-600 via-purple-700 to-purple-800",
      buttonText: "Get Insured",
      icon: "🛡️",
    },
  ];

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []); // Removed banners.length dependency to prevent re-creation

  const handleBannerChange = useCallback((index) => {
    setCurrentBanner(index);
  }, []);

  const handlePrevBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const handleNextBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  return (
    <div className="relative w-full h-48 md:h-64 overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 w-full h-full transition-transform duration-1000 ease-in-out ${
            index === currentBanner
              ? "translate-x-0"
              : index < currentBanner
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
        >
          <div
            className={`w-full h-full bg-gradient-to-r ${banner.bgGradient} relative overflow-hidden`}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 text-6xl rotate-12">
                {banner.icon}
              </div>
              <div className="absolute bottom-10 right-20 text-4xl rotate-45">
                {banner.icon}
              </div>
              <div className="absolute top-20 right-10 text-5xl -rotate-12">
                {banner.icon}
              </div>
            </div>
            <div className="relative z-10 flex items-center h-full">
              <div className="container mx-auto px-6 flex items-center justify-between">
                <div className="flex-1 text-white">
                  <div className="mb-2">
                    <span className="text-sm font-medium uppercase tracking-wider opacity-90">
                      {banner.title}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                      {banner.discount}
                    </h2>
                  </div>
                  <p className="text-sm md:text-base opacity-90 mb-6 max-w-md leading-relaxed">
                    {banner.description}
                  </p>
                  <button className="bg-white text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                    {banner.buttonText}
                  </button>
                </div>
                <div className="hidden md:flex flex-1 justify-end items-center">
                  <div className="relative">
                    <div className="w-48 h-48 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <div className="w-32 h-32 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                        <span className="text-6xl">{banner.icon}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 border-2 border-white border-opacity-30 rounded-full animate-ping"></div>
                    <div className="absolute inset-4 border-2 border-white border-opacity-20 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black from-0% to-transparent to-100% opacity-20"></div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => handleBannerChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentBanner
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
          />
        ))}
      </div>
      <button
        onClick={handlePrevBanner}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300 z-20"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={handleNextBanner}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300 z-20"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default function BuySellHome() {
  const [vehicles, setVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    locations: [],
    budget: [],
    brands: [],
    models: [],
    year: [],
    fuelType: [],
  });

  const vehiclesPerPage = 8;
  const navigate = useNavigate();

  // Memoize the base URL to prevent recreation
  const baseUrl = useMemo(() => {
    return import.meta.env.VITE_BASE_URL || "http://localhost:8081";
  }, []);

  // Helper function to fetch brand name by ID with caching
  const brandCache = useMemo(() => new Map(), []);
  const fetchBrandName = useCallback(
    async (brandId) => {
      if (brandCache.has(brandId)) {
        return brandCache.get(brandId);
      }

      try {
        const response = await fetch(`${baseUrl}/api/brands/${brandId}`);
        if (response.ok) {
          const data = await response.json();
          const brandName = data.data?.brandName || `Brand ${brandId}`;
          brandCache.set(brandId, brandName);
          return brandName;
        }
      } catch (error) {
        console.error(`Error fetching brand ${brandId}:`, error);
      }

      const fallbackName = `Brand ${brandId}`;
      brandCache.set(brandId, fallbackName);
      return fallbackName;
    },
    [baseUrl, brandCache]
  );

  // Helper function to fetch model name by ID with caching
  const modelCache = useMemo(() => new Map(), []);
  const fetchModelName = useCallback(
    async (modelId) => {
      if (modelCache.has(modelId)) {
        return modelCache.get(modelId);
      }

      try {
        const response = await fetch(`${baseUrl}/api/models/${modelId}`);
        if (response.ok) {
          const data = await response.json();
          const modelName = data.data?.modelName || `Model ${modelId}`;
          modelCache.set(modelId, modelName);
          return modelName;
        }
      } catch (error) {
        console.error(`Error fetching model ${modelId}:`, error);
      }

      const fallbackName = `Model ${modelId}`;
      modelCache.set(modelId, fallbackName);
      return fallbackName;
    },
    [baseUrl, modelCache]
  );

  // Helper function to fetch category name by ID with caching
  const categoryCache = useMemo(() => new Map(), []);
  const fetchCategoryName = useCallback(
    async (categoryId) => {
      if (categoryCache.has(categoryId)) {
        return categoryCache.get(categoryId);
      }

      try {
        const response = await fetch(`${baseUrl}/api/categories/${categoryId}`);
        if (response.ok) {
          const data = await response.json();
          const categoryName =
            data.data?.categoryName || `Category ${categoryId}`;
          categoryCache.set(categoryId, categoryName);
          return categoryName;
        }
      } catch (error) {
        console.error(`Error fetching category ${categoryId}:`, error);
      }

      const fallbackName = `Category ${categoryId}`;
      categoryCache.set(categoryId, fallbackName);
      return fallbackName;
    },
    [baseUrl, categoryCache]
  );

  // Helper function to get unique IDs for batch requests
  const getUniqueIds = useCallback((bikes, field) => {
    return [...new Set(bikes.map((bike) => bike[field]).filter((id) => id))];
  }, []);

  // Helper function to create lookup maps
  const createLookupMaps = useCallback(
    async (bikes) => {
      const uniqueBrandIds = getUniqueIds(bikes, "brandId");
      const uniqueModelIds = getUniqueIds(bikes, "modelId");
      const uniqueCategoryIds = getUniqueIds(bikes, "categoryId");

      console.log("📊 Fetching lookup data for:", {
        brands: uniqueBrandIds,
        models: uniqueModelIds,
        categories: uniqueCategoryIds,
      });

      const brandPromises = uniqueBrandIds.map((id) => fetchBrandName(id));
      const modelPromises = uniqueModelIds.map((id) => fetchModelName(id));
      const categoryPromises = uniqueCategoryIds.map((id) =>
        fetchCategoryName(id)
      );

      const [brandNames, modelNames, categoryNames] = await Promise.all([
        Promise.all(brandPromises),
        Promise.all(modelPromises),
        Promise.all(categoryPromises),
      ]);

      const brandMap = {};
      const modelMap = {};
      const categoryMap = {};

      uniqueBrandIds.forEach((id, index) => {
        brandMap[id] = brandNames[index];
      });
      uniqueModelIds.forEach((id, index) => {
        modelMap[id] = modelNames[index];
      });
      uniqueCategoryIds.forEach((id, index) => {
        categoryMap[id] = categoryNames[index];
      });

      return { brandMap, modelMap, categoryMap };
    },
    [getUniqueIds, fetchBrandName, fetchModelName, fetchCategoryName]
  );

  // Helper function to construct image URLs
  const getImageUrl = useCallback(
    (imagePath) => {
      if (!imagePath) return "/bike.jpg";
      return `${baseUrl}/uploads/${imagePath}`;
    },
    [baseUrl]
  );

  // Helper function for ordinal suffix
  const getOrdinalSuffix = useCallback((num) => {
    if (num === 1) return "st";
    if (num === 2) return "nd";
    if (num === 3) return "rd";
    return "th";
  }, []);

  // Fetch vehicles - using useCallback to prevent unnecessary re-renders
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${baseUrl}/api/bike-sales/user`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("🔍 API Response:", data);

      if (!data.success || !Array.isArray(data.data)) {
        throw new Error("Invalid API response structure - expected array");
      }

      const responseArray = data.data;
      if (responseArray.length === 0) {
        console.log("📭 No bikes found in response");
        setVehicles([]);
        setAllVehicles([]);
        return;
      }

      // Extract bike sales data and create a map for images
      const bikesArray = [];
      const imagesMap = {};

      responseArray.forEach((item) => {
        // Extract bikeSale data
        if (item.bikeSale) {
          bikesArray.push(item.bikeSale);
        }

        // Extract images data and map it to bike ID
        if (item.images && item.bikeSale) {
          imagesMap[item.bikeSale.id] = item.images;
        }
      });

      console.log("🚲 Extracted bikes:", bikesArray.length);
      console.log("🖼️ Images mapping:", imagesMap);

      // Create lookup maps for names
      const { brandMap, modelMap, categoryMap } = await createLookupMaps(
        bikesArray
      );

      // Transform the bikes array
      const transformedVehicles = bikesArray.map((bike) => {
        const brandName = brandMap[bike.brandId] || `Brand ${bike.brandId}`;
        const modelName = modelMap[bike.modelId] || `Model ${bike.modelId}`;
        const categoryName =
          categoryMap[bike.categoryId] || `Category ${bike.categoryId}`;

        // Get images for this bike
        const bikeImages = imagesMap[bike.id];

        // Set main image and image gallery
        const mainImage = bikeImages?.frontImages
          ? getImageUrl(bikeImages.frontImages)
          : "/bike.jpg";

        const imageGallery = bikeImages
          ? {
              front: getImageUrl(bikeImages.frontImages),
              back: getImageUrl(bikeImages.backImages),
              left: getImageUrl(bikeImages.leftImages),
              right: getImageUrl(bikeImages.rightImages),
            }
          : {
              front: "/bike.jpg",
              back: "/bike.jpg",
              left: "/bike.jpg",
              right: "/bike.jpg",
            };

        return {
          type: "bike",
          image: mainImage,
          images: imageGallery,
          title: `${brandName} ${modelName}`,
          price: bike.sellingPrice
            ? `₹${bike.sellingPrice.toLocaleString()}`
            : bike.price
            ? `₹${bike.price.toLocaleString()}`
            : "₹0",
          priceValue: bike.sellingPrice || bike.price || 0,
          details: `${bike.yearId} - ${
            bike.kmsDriven?.toLocaleString() || 0
          } km`,
          location: `${bike.bikeCondition || "Unknown condition"}`,
          color: bike.color || "Unknown",
          registrationNumber: bike.registrationNumber || "Not provided",
          numberOfOwner: bike.numberOfOwner || 0,
          kmsDriven: bike.kmsDriven || 0,
          bikeCondition: bike.bikeCondition || "Unknown",
          brand: brandName,
          model: modelName,
          category: categoryName,
          categoryId: bike.categoryId || null,
          brandId: bike.brandId || null,
          modelId: bike.modelId || null,
          yearId: bike.yearId || null,
          customerSellingClosingPrice: bike.customerSellingClosingPrice || 0,
          sellingClosingPrice: bike.sellingClosingPrice || 0,
          listingStatus: bike.listingStatus || "LISTED",
          isPuc: bike.isPuc || false,
          isInsurance: bike.isInsurance || false,
          isDocument: bike.isDocument || false,
          isRepairRequired: bike.isRepairRequired || false,
          supervisorName: bike.supervisorName || "",
          additionalNotes: bike.additionalNotes || "",
          pucImage: bike.pucImage ? getImageUrl(bike.pucImage) : null,
          documentImage: bike.documentImage
            ? getImageUrl(bike.documentImage)
            : null,
          owner: bike.numberOfOwner
            ? `${bike.numberOfOwner}${getOrdinalSuffix(
                bike.numberOfOwner
              )} Owner`
            : "Unknown",
          kmDriven: `${bike.kmsDriven?.toLocaleString() || 0} km`,
          featured: bike.listingStatus === "FEATURED" || false,
          registrationYear: bike.yearId || "Unknown",
          registrationNo: bike.registrationNumber || "Not provided",
          id: bike.id,
          description: bike.description || "",
          createdAt: bike.createdAt || "",
          updatedAt: bike.updatedAt || "",
        };
      });

      setVehicles(transformedVehicles);
      setAllVehicles(transformedVehicles);
      console.log("✅ Transformed vehicles:", transformedVehicles.length);
      console.log("✅ Sample vehicle:", transformedVehicles[0]);
    } catch (err) {
      console.error("❌ Error fetching vehicles:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, createLookupMaps, getImageUrl, getOrdinalSuffix]);

  // Initial data fetch - only runs once
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Apply filters when selectedFilters change - using useCallback to optimize
  const applyFilters = useCallback(() => {
    let filteredVehicles = [...allVehicles];

    if (selectedFilters.categories.length > 0) {
      filteredVehicles = filteredVehicles.filter((vehicle) =>
        selectedFilters.categories.includes(vehicle.category)
      );
    }

    if (selectedFilters.brands.length > 0) {
      filteredVehicles = filteredVehicles.filter((vehicle) =>
        selectedFilters.brands.includes(vehicle.brand)
      );
    }

    if (selectedFilters.models.length > 0) {
      filteredVehicles = filteredVehicles.filter((vehicle) =>
        selectedFilters.models.includes(vehicle.model)
      );
    }

    if (selectedFilters.year.length > 0) {
      filteredVehicles = filteredVehicles.filter((vehicle) =>
        selectedFilters.year.includes(vehicle.registrationYear.toString())
      );
    }

    if (selectedFilters.locations.length > 0) {
      filteredVehicles = filteredVehicles.filter((vehicle) =>
        selectedFilters.locations.some(
          (location) =>
            vehicle.bikeCondition
              ?.toLowerCase()
              .includes(location.toLowerCase()) ||
            vehicle.location?.toLowerCase().includes(location.toLowerCase())
        )
      );
    }

    if (selectedFilters.budget.length > 0) {
      filteredVehicles = filteredVehicles.filter((vehicle) => {
        const price = vehicle.priceValue;
        return selectedFilters.budget.some((budgetRange) => {
          if (budgetRange.includes("Under ₹50,000")) return price < 50000;
          if (budgetRange.includes("₹50,000 - ₹1,00,000"))
            return price >= 50000 && price <= 100000;
          if (budgetRange.includes("₹1,00,000 - ₹2,00,000"))
            return price >= 100000 && price <= 200000;
          if (budgetRange.includes("₹2,00,000 - ₹3,00,000"))
            return price >= 200000 && price <= 300000;
          if (budgetRange.includes("₹3,00,000 - ₹5,00,000"))
            return price >= 300000 && price <= 500000;
          if (budgetRange.includes("Above ₹5,00,000")) return price > 500000;
          return true;
        });
      });
    }

    setVehicles(filteredVehicles);
    setCurrentPage(1);
  }, [allVehicles, selectedFilters]);

  // Apply filters effect
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle filters change from sidebar
  const handleFiltersChange = useCallback((filters) => {
    setSelectedFilters(filters);
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedFilters({
      categories: [],
      locations: [],
      budget: [],
      brands: [],
      models: [],
      year: [],
      fuelType: [],
    });
  }, []);

  // Badge styles for vehicle types - memoized
  const getTypeBadge = useCallback((type) => {
    const badgeClasses = {
      car: "bg-blue-100 text-blue-800",
      bike: "bg-green-100 text-blue-800",
      scooter: "bg-purple-100 text-blue-800",
    };
    return (
      <span
        className={`${badgeClasses[type]} px-2 py-1 rounded-full text-xs font-medium`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  }, []);

  // Button styles for vehicle types - memoized
  const getButtonClasses = useCallback((type) => {
    const buttonClasses = {
      car: "bg-blue-600 hover:bg-blue-700",
      bike: "bg-blue-600 hover:bg-blue-700",
      scooter: "bg-blue-600 hover:bg-blue-700",
    };
    return `${buttonClasses[type]} text-white font-bold py-2 px-4 rounded-md w-full transition duration-300`;
  }, []);

  // Calculate current vehicles for pagination - memoized
  const paginationData = useMemo(() => {
    const indexOfLastVehicle = currentPage * vehiclesPerPage;
    const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
    const currentVehicles = vehicles.slice(
      indexOfFirstVehicle,
      indexOfLastVehicle
    );
    const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);

    return {
      currentVehicles,
      totalPages,
      indexOfFirstVehicle,
      indexOfLastVehicle,
    };
  }, [vehicles, currentPage, vehiclesPerPage]);

  // Change page function
  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  // Handle View Details click - prevent multiple API calls
  const handleViewDetails = useCallback(
    (vehicle) => {
      console.log("🔍 Viewing vehicle details:", vehicle);
      navigate("/vehicle-details", { state: { vehicle } });
    },
    [navigate]
  );

  // Handle refresh
  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PromotionalBanner />
        <div
          className="flex items-center justify-center"
          style={{ height: "calc(100vh - 192px)" }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600">Loading vehicles...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PromotionalBanner />
        <div
          className="flex items-center justify-center"
          style={{ height: "calc(100vh - 192px)" }}
        >
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Data
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PromotionalBanner />
        <div
          className="flex items-center justify-center"
          style={{ height: "calc(100vh - 192px)" }}
        >
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">🚲</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Vehicles Found
            </h2>
            <p className="text-gray-600 mb-4">
              No bikes match your current filters
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PromotionalBanner />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Available Vehicles
            </h1>
            <p className="text-gray-600">
              Showing {vehicles.length} of {allVehicles.length} vehicles
            </p>
          </div>
          {Object.values(selectedFilters).some((arr) => arr.length > 0) && (
            <button
              onClick={clearFilters}
              className="bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-4 rounded-lg"
            >
              Clear All Filters
            </button>
          )}
        </div>

        <div className="flex gap-6">
          <div className="w-1/4">
            <FilterSidebar
              onFiltersChange={handleFiltersChange}
              selectedFilters={selectedFilters}
            />
          </div>

          <div className="w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paginationData.currentVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 border border-gray-200"
                >
                  <div className="relative">
                    <img
                      src={vehicle.image}
                      alt={vehicle.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "/bike.jpg";
                      }}
                    />
                    <div className="absolute top-0 left-0 m-2">
                      {getTypeBadge(vehicle.type)}
                    </div>
                    {vehicle.featured && (
                      <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 m-2 rounded-md text-xs font-semibold">
                        Featured
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                      <span className="text-white text-xs font-medium bg-black/30 px-2 py-1 rounded">
                        {vehicle.bikeCondition}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {vehicle.title}
                    </h3>
                    <p className="text-xl font-bold text-gray-800 mb-2">
                      {vehicle.price}
                    </p>
                    <div className="flex items-center text-gray-600 mb-1">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {vehicle.details}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {vehicle.location}
                    </div>
                    <div className="mt-2 text-sm text-gray-500 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Owner:</span>
                        <span>{vehicle.owner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Registration:</span>
                        <span className="truncate ml-2">
                          {vehicle.registrationNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Color:</span>
                        <span>{vehicle.color}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {vehicle.isPuc && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            PUC ✓
                          </span>
                        )}
                        {vehicle.isInsurance && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Insurance ✓
                          </span>
                        )}
                        {vehicle.isDocument && (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            Documents ✓
                          </span>
                        )}
                        {vehicle.isRepairRequired && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                            Repair Required
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      className={getButtonClasses(vehicle.type) + " mt-4"}
                      onClick={() => handleViewDetails(vehicle)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {paginationData.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                {Array.from({ length: paginationData.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`mx-1 px-3 py-2 rounded-full ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    } transition-colors duration-200`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
