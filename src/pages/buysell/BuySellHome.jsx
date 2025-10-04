import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "./FilterSidebar";
import { Menu, X, Filter } from "lucide-react";

// Professional Promotional Banner Component - Mobile Responsive
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
  }, []);

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
    <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden">
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
            {/* Background Icons */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 sm:top-10 left-4 sm:left-10 text-3xl sm:text-6xl rotate-12">
                {banner.icon}
              </div>
              <div className="absolute bottom-4 sm:bottom-10 right-10 sm:right-20 text-2xl sm:text-4xl rotate-45">
                {banner.icon}
              </div>
              <div className="absolute top-10 sm:top-20 right-4 sm:right-10 text-3xl sm:text-5xl -rotate-12">
                {banner.icon}
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center h-full">
              <div className="container mx-auto px-3 sm:px-4 md:px-6 flex items-center justify-between">
                <div className="flex-1 text-white">
                  <div className="mb-1 sm:mb-2">
                    <span className="text-xs sm:text-sm font-medium uppercase tracking-wider opacity-90">
                      {banner.title}
                    </span>
                  </div>
                  <div className="mb-2 sm:mb-4">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                      {banner.discount}
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base opacity-90 mb-3 sm:mb-6 max-w-xs md:max-w-md leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {banner.description}
                  </p>
                  <button className="bg-white text-gray-800 font-bold py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                    {banner.buttonText}
                  </button>
                </div>

                {/* Desktop Icon Circle */}
                <div className="hidden lg:flex flex-1 justify-end items-center">
                  <div className="relative">
                    <div className="w-32 md:w-40 lg:w-48 h-32 md:h-40 lg:h-48 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <div className="w-24 md:w-28 lg:w-32 h-24 md:h-28 lg:h-32 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                        <span className="text-4xl md:text-5xl lg:text-6xl">
                          {banner.icon}
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 border-2 border-white border-opacity-30 rounded-full animate-ping"></div>
                    <div className="absolute inset-4 border-2 border-white border-opacity-20 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-12 sm:h-20 bg-gradient-to-t from-black from-0% to-transparent to-100% opacity-20"></div>
          </div>
        </div>
      ))}

      {/* Pagination Dots */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => handleBannerChange(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentBanner
                ? "bg-white scale-125"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevBanner}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1.5 sm:p-2 rounded-full transition-all duration-300 z-20"
        aria-label="Previous banner"
      >
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6"
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
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1.5 sm:p-2 rounded-full transition-all duration-300 z-20"
        aria-label="Next banner"
      >
        <svg
          className="w-4 h-4 sm:w-6 sm:h-6"
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
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle
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

  // Memoize the base URL
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

  // Helper function to get unique IDs
  const getUniqueIds = useCallback((bikes, field) => {
    return [...new Set(bikes.map((bike) => bike[field]).filter((id) => id))];
  }, []);

  // Helper function to create lookup maps
  const createLookupMaps = useCallback(
    async (bikes) => {
      const uniqueBrandIds = getUniqueIds(bikes, "brandId");
      const uniqueModelIds = getUniqueIds(bikes, "modelId");
      const uniqueCategoryIds = getUniqueIds(bikes, "categoryId");

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

  // Fetch vehicles
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${baseUrl}/api/bike-sales/user`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !Array.isArray(data.data)) {
        throw new Error("Invalid API response structure");
      }

      const responseArray = data.data;
      if (responseArray.length === 0) {
        setVehicles([]);
        setAllVehicles([]);
        return;
      }

      const bikesArray = [];
      const imagesMap = {};

      responseArray.forEach((item) => {
        if (item.bikeSale) {
          bikesArray.push(item.bikeSale);
        }
        if (item.images && item.bikeSale) {
          imagesMap[item.bikeSale.id] = item.images;
        }
      });

      const { brandMap, modelMap, categoryMap } = await createLookupMaps(
        bikesArray
      );

      const transformedVehicles = bikesArray.map((bike) => {
        const brandName = brandMap[bike.brandId] || `Brand ${bike.brandId}`;
        const modelName = modelMap[bike.modelId] || `Model ${bike.modelId}`;
        const categoryName =
          categoryMap[bike.categoryId] || `Category ${bike.categoryId}`;

        const bikeImages = imagesMap[bike.id];
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
          listingStatus: bike.listingStatus || "LISTED",
          isPuc: bike.isPuc || false,
          isInsurance: bike.isInsurance || false,
          isDocument: bike.isDocument || false,
          isRepairRequired: bike.isRepairRequired || false,
          supervisorName: bike.supervisorName || "",
          additionalNotes: bike.additionalNotes || "",
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
    } catch (err) {
      console.error("❌ Error fetching vehicles:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [baseUrl, createLookupMaps, getImageUrl, getOrdinalSuffix]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Apply filters
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

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFiltersChange = useCallback((filters) => {
    setSelectedFilters(filters);
  }, []);

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

  const getButtonClasses = useCallback((type) => {
    return "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full transition duration-300";
  }, []);

  const paginationData = useMemo(() => {
    const indexOfLastVehicle = currentPage * vehiclesPerPage;
    const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
    const currentVehicles = vehicles.slice(
      indexOfFirstVehicle,
      indexOfLastVehicle
    );
    const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);

    return { currentVehicles, totalPages };
  }, [vehicles, currentPage, vehiclesPerPage]);

  const paginate = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleViewDetails = useCallback(
    (vehicle) => {
      navigate("/vehicle-details", { state: { vehicle } });
    },
    [navigate]
  );

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PromotionalBanner />
        <div
          className="flex items-center justify-center px-4"
          style={{ height: "calc(100vh - 160px)" }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-24 sm:w-24 md:h-32 md:w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600">
              Loading vehicles...
            </p>
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
          className="flex items-center justify-center px-4"
          style={{ height: "calc(100vh - 160px)" }}
        >
          <div className="text-center">
            <div className="text-red-500 text-4xl sm:text-5xl md:text-6xl mb-4">
              ⚠️
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Error Loading Data
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
              {error}
            </p>
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
          className="flex items-center justify-center px-4"
          style={{ height: "calc(100vh - 160px)" }}
        >
          <div className="text-center">
            <div className="text-gray-400 text-4xl sm:text-5xl md:text-6xl mb-4">
              🚲
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              No Vehicles Found
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
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
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Header Section - Mobile Responsive */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">
              Available Vehicles
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Showing {vehicles.length} of {allVehicles.length} vehicles
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>

            {Object.values(selectedFilters).some((arr) => arr.length > 0) && (
              <button
                onClick={clearFilters}
                className="bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Main Content - Mobile Responsive Layout */}
        <div className="flex gap-4 sm:gap-6 relative">
          {/* Filter Sidebar - Mobile Drawer / Desktop Sidebar */}
          <div
            className={`${
              showFilters
                ? "fixed inset-0 z-50 bg-black bg-opacity-50 lg:relative lg:bg-transparent"
                : "hidden"
            } lg:block lg:w-1/4`}
            onClick={(e) => {
              if (e.target === e.currentTarget && window.innerWidth < 1024) {
                setShowFilters(false);
              }
            }}
          >
            <div
              className={`${
                showFilters
                  ? "fixed left-0 top-0 bottom-0 w-[280px] sm:w-[320px] bg-white shadow-2xl overflow-y-auto"
                  : "hidden"
              } lg:block lg:relative lg:w-full lg:shadow-none`}
            >
              {/* Mobile Close Button */}
              <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close filters"
                >
                  <X size={20} />
                </button>
              </div>

              <FilterSidebar
                onFiltersChange={handleFiltersChange}
                selectedFilters={selectedFilters}
              />

              {/* Mobile Apply Button */}
              <div className="lg:hidden sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle Grid - Mobile Responsive */}
          <div className="flex-1 w-full lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {paginationData.currentVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 border border-gray-200"
                >
                  <div className="relative">
                    <img
                      src={vehicle.image}
                      alt={vehicle.title}
                      className="w-full h-40 sm:h-48 object-cover"
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

                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                      {vehicle.title}
                    </h3>
                    <p className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                      {vehicle.price}
                    </p>
                    
                    <div className="flex items-center text-gray-600 mb-1 text-xs sm:text-sm">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="truncate">{vehicle.details}</span>
                    </div>

                    <div className="flex items-center text-gray-600 text-xs sm:text-sm mb-2">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="truncate">{vehicle.location}</span>
                    </div>

                    <div className="mt-2 text-xs sm:text-sm text-gray-500 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Owner:</span>
                        <span className="truncate ml-2">{vehicle.owner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Registration:</span>
                        <span className="truncate ml-2">
                          {vehicle.registrationNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Color:</span>
                        <span className="truncate ml-2">{vehicle.color}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {vehicle.isPuc && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                            PUC ✓
                          </span>
                        )}
                        {vehicle.isInsurance && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                            Insurance ✓
                          </span>
                        )}
                        {vehicle.isDocument && (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">
                            Docs ✓
                          </span>
                        )}
                        {vehicle.isRepairRequired && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                            Repair
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      className={`${getButtonClasses(vehicle.type)} mt-3 sm:mt-4 text-sm sm:text-base`}
                      onClick={() => handleViewDetails(vehicle)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - Mobile Responsive */}
            {paginationData.totalPages > 1 && (
              <div className="flex justify-center mt-6 sm:mt-8 flex-wrap gap-2">
                {Array.from({ length: paginationData.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm sm:text-base ${
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
