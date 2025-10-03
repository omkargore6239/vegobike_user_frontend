import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

// Image cache management
class ImageCache {
  constructor() {
    this.cache = new Map();
    this.failedImages = new Set();
  }
  isImageValid(src) {
    return !this.failedImages.has(src);
  }
  markImageAsFailed(src) {
    this.failedImages.add(src);
  }
  preloadImage(src) {
    if (this.cache.has(src) || this.failedImages.has(src)) {
      return Promise.resolve(this.cache.get(src));
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(src, src);
        resolve(src);
      };
      img.onerror = () => {
        this.failedImages.add(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  }
}
const imageCache = new ImageCache();

// Optimized Image Component
const OptimizedImage = ({
  src,
  alt,
  className,
  onError,
  fallbackSrc = "/images/default-bike.png",
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasErrored, setHasErrored] = useState(false);
  useEffect(() => {
    if (src !== imageSrc && !hasErrored) {
      setImageSrc(src);
      setHasErrored(false);
    }
  }, [src, imageSrc, hasErrored]);
  const handleImageError = useCallback(
    (e) => {
      e.target.onerror = null;
      if (!hasErrored && imageSrc !== fallbackSrc) {
        console.warn(`Image failed to load: ${imageSrc}, using fallback`);
        imageCache.markImageAsFailed(imageSrc);
        setImageSrc(fallbackSrc);
        setHasErrored(true);
        if (onError) {
          onError(e);
        }
      }
    },
    [imageSrc, fallbackSrc, hasErrored, onError]
  );
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

const ServicePackagesPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [bikeData, setBikeData] = useState({
    brand: "Unknown",
    model: "Unknown",
    image: "/images/default-bike.png",
    brandLogo: "",
    brandId: null,
    modelId: null,
  });
  const [servicePackages, setServicePackages] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("General Services");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [servicesLoaded, setServicesLoaded] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080";
  const abortControllerRef = useRef();
  const isFetchingRef = useRef(false);

  // Default categories (now used directly)
  const serviceCategories = useMemo(
    () => [
      { id: 1, name: "General Services", icon: "🔧" },
      { id: 2, name: "Bike Repair", icon: "⚙️" },
      // { id: 3, name: "Maintenance", icon: "🛠️" },
      // { id: 4, name: "Spare Parts", icon: "🔩" },
    ],
    []
  );

  // Cleanup function
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Navigation state validation
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!state || !state.bikeData) {
      console.warn("No bike data found in navigation state");
      setError("No bike selected. Please select a bike first.");
      const redirectTimer = setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);
      return () => clearTimeout(redirectTimer);
    }
    const bikeInfo = state.bikeData;
    console.log("Received bike data:", bikeInfo);
    if (!bikeInfo.brandId || !bikeInfo.modelId) {
      console.error("Missing brandId or modelId in bike data:", bikeInfo);
      setError("Invalid bike selection. Missing brand or model information.");
      return;
    }
    const newBikeData = {
      brand: bikeInfo.brand || "Unknown",
      model: bikeInfo.model || "Unknown",
      image: bikeInfo.image || "/images/default-bike.png",
      brandLogo: bikeInfo.brandLogo || "",
      brandId: bikeInfo.brandId,
      modelId: bikeInfo.modelId,
    };
    setBikeData(newBikeData);
    // Preload bike image
    if (newBikeData.image && newBikeData.image !== "/images/default-bike.png") {
      imageCache.preloadImage(newBikeData.image).catch(() => {
        console.warn("Failed to preload bike image:", newBikeData.image);
      });
    }
    // Process initial services if available
    if (bikeInfo.services && Array.isArray(bikeInfo.services)) {
      console.log("Processing initial services:", bikeInfo.services);
      const formattedServices = formatServicesData(bikeInfo.services);
      setServicePackages(formattedServices);
      setServicesLoaded(true);
    }
  }, [state, navigate]);

  const formatServicesData = useCallback((servicesData) => {
    let services = [];
    if (servicesData?.data && Array.isArray(servicesData.data)) {
      services = servicesData.data;
    } else if (Array.isArray(servicesData)) {
      services = servicesData;
    } else {
      console.warn("Invalid services data format:", servicesData);
      return [];
    }
    console.log("Formatting services data:", services);
    return services.map((service, index) => {
      let features = [];
      if (Array.isArray(service.features)) {
        features = service.features;
      } else if (typeof service.features === "string") {
        try {
          features = JSON.parse(service.features);
          if (!Array.isArray(features)) {
            features = [service.features];
          }
        } catch {
          features = [service.features];
        }
      } else if (
        service.serviceFeatures &&
        Array.isArray(service.serviceFeatures)
      ) {
        features = service.serviceFeatures;
      }
      const serviceImage =
        service.image || service.serviceImage || "/images/default-bike.png";
      if (serviceImage !== "/images/default-bike.png") {
        imageCache.preloadImage(serviceImage).catch(() => {
          console.warn("Failed to preload service image:", serviceImage);
        });
      }
      return {
        id: service.id || `service-${index + 1}`,
        name: service.serviceName || service.name || `Service ${index + 1}`,
        originalPrice: parseFloat(service.price) || 0,
        discountedPrice: parseFloat(service.price) || 0,
        warranty: service.warranty || "1000 Kms or 1 Month Warranty",
        recommendedInterval:
          service.recommendedInterval ||
          "Every 5000 Kms or 3 Months (Recommended)",
        features: features,
        recommended: Boolean(service.recommended || service.isRecommended),
        image: serviceImage,
        description: service.serviceDescription || service.description || "",
        category:
          mapServiceTypeToCategory(service.serviceType) || "General Services",
        serviceType: service.serviceType,
        duration: service.duration || "1-2 hours",
      };
    });
  }, []);

  const mapServiceTypeToCategory = useCallback((serviceType) => {
    const mapping = {
      BIKE_REPAIR: "Bike Repair",
      GENERAL_SERVICE: "General Services",
    };
    return mapping[serviceType] || "General Services";
  }, []);

  const fetchServicesByCategory = useCallback(
    async (categoryName) => {
      if (!bikeData.brandId || !bikeData.modelId) {
        console.error("Brand ID or Model ID is missing:", bikeData);
        setError("Brand or model information is missing.");
        return;
      }

      // Prevent multiple simultaneous requests
      if (isFetchingRef.current) {
        console.log("Previous request in progress. Aborting...");
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      isFetchingRef.current = true;

      try {
        setLoading(true);
        setError(null);
        setServicesLoaded(false);

        const serviceTypeMap = {
          "Bike Repair": "BIKE_REPAIR",
          "General Services": "GENERAL_SERVICE",
        };
        const serviceType = serviceTypeMap[categoryName] || "GENERAL_SERVICE";
        const apiUrl = `${BASE_URL}/api/bike-services/by-brand-model-type`;

        const response = await axios.get(apiUrl, {
          params: {
            brandId: bikeData.brandId,
            modelId: bikeData.modelId,
            serviceType: serviceType,
          },
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 15000,
          signal: controller.signal,
        });

        let servicesData = [];
        if (response.data?.success && Array.isArray(response.data.data)) {
          servicesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          servicesData = response.data;
        } else if (response.data?.services) {
          servicesData = response.data.services;
        }

        if (servicesData.length === 0) {
          setServicePackages([]);
          setError(`No services found for ${categoryName}.`);
        } else {
          const formattedServices = formatServicesData(servicesData);
          setServicePackages(formattedServices);
        }
        setServicesLoaded(true);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Request canceled:", error.message);
          return; // Ignore canceled requests
        }
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [bikeData.brandId, bikeData.modelId, BASE_URL, formatServicesData]
  );

  const handleCategoryChange = useCallback(
    (categoryName) => {
      if (activeCategory !== categoryName) {
        setActiveCategory(categoryName);
        setServicePackages([]);
        setError(null);
        setServicesLoaded(false);
        fetchServicesByCategory(categoryName);
      }
    },
    [activeCategory, fetchServicesByCategory]
  );

  // Initial load of services
  useEffect(() => {
    if (bikeData.brandId && bikeData.modelId && !servicesLoaded) {
      console.log("Loading initial services for category:", activeCategory);
      fetchServicesByCategory(activeCategory);
    }
  }, [
    bikeData.brandId,
    bikeData.modelId,
    servicesLoaded,
    activeCategory,
    fetchServicesByCategory,
  ]);

  const handleCheckout = useCallback(() => {
    if (cartItems.length === 0) {
      alert("Please select at least one service");
      return;
    }
    navigate("/checkout", {
      state: {
        cartItems: cartItems,
        bikeData: bikeData,
        subtotal: subtotal,
      },
    });
  }, [cartItems, bikeData, navigate]);

  const toggleCartItem = useCallback((item) => {
    setCartItems((prev) => {
      const exists = prev.some((cartItem) => cartItem.id === item.id);
      if (exists) {
        return prev.filter((cartItem) => cartItem.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  }, []);

  const isInCart = useCallback(
    (itemId) => {
      return cartItems.some((item) => item.id === itemId);
    },
    [cartItems]
  );

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.discountedPrice, 0);
  }, [cartItems]);

  const filteredServices = useMemo(() => {
    if (activeCategory === "All Services") {
      return servicePackages;
    }
    return servicePackages.filter(
      (service) => service.category === activeCategory
    );
  }, [servicePackages, activeCategory]);

  // Handle case where no bike data is available
  if (!state || !state.bikeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Bike Selected
          </h2>
          <p className="text-gray-600 mb-6">
            Please select a bike to view available services.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Select Bike
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20 lg:pb-0">
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6 flex-grow">
        <div className="w-full lg:w-2/3">
          {/* Debug Info
          {process.env.NODE_ENV === "development" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
              <h4 className="font-semibold text-blue-800 mb-2">Debug Info:</h4>
              <p className="text-blue-700">Backend URL: {BASE_URL}</p>
              <p className="text-blue-700">Brand ID: {bikeData.brandId}</p>
              <p className="text-blue-700">Model ID: {bikeData.modelId}</p>
              <p className="text-blue-700">Active Category: {activeCategory}</p>
            </div>
          )} */}

          {/* Service Categories */}
          <div className="relative mb-6">
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  className={`flex flex-col items-center p-3 min-w-[120px] rounded-lg transition-colors ${
                    activeCategory === category.name
                      ? "bg-indigo-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleCategoryChange(category.name)}
                >
                  <span className="text-2xl mb-1">{category.icon}</span>
                  <span className="text-xs font-medium text-center">
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
            <div className="absolute left-0 -bottom-1 w-full h-px bg-gray-200"></div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading services...</p>
              <p className="text-gray-500 text-sm mt-2">
                Fetching {activeCategory.toLowerCase()} for your{" "}
                {bikeData.brand} {bikeData.model}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-2">
                <div className="text-red-500 text-2xl mr-3">⚠️</div>
                <h3 className="text-red-800 font-semibold">
                  Error Loading Services
                </h3>
              </div>
              <div className="text-red-600 mb-4 whitespace-pre-line">
                {error}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => fetchServicesByCategory(activeCategory)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Service Packages Header */}
          <h2 className="text-2xl font-bold mb-6">
            {activeCategory} - Available Services
            {filteredServices.length > 0 && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                ({filteredServices.length} service
                {filteredServices.length !== 1 ? "s" : ""} found)
              </span>
            )}
          </h2>

          {/* No Services State */}
          {!loading && filteredServices.length === 0 && !error ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Services Available
              </h3>
              <p className="text-gray-500 mb-4">
                No {activeCategory.toLowerCase()} found for your{" "}
                {bikeData.brand} {bikeData.model}.
              </p>
              <p className="text-gray-500 text-sm mb-6">
                This could be because:
                <br />• Services are not configured for this bike model
                <br />• The category doesn't have any services yet
                <br />• There might be a backend connectivity issue
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => fetchServicesByCategory(activeCategory)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Refresh Services
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Select Different Bike
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredServices.map((pkg) => (
                <ServicePackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isInCart={isInCart}
                  toggleCartItem={toggleCartItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Cart Section */}
        <CartSection
          bikeData={bikeData}
          cartItems={cartItems}
          subtotal={subtotal}
          toggleCartItem={toggleCartItem}
          handleCheckout={handleCheckout}
        />
      </div>
    </div>
  );
};

const ServicePackageCard = ({ pkg, isInCart, toggleCartItem }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
    {pkg.recommended && (
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 text-sm font-semibold">
        ⭐ RECOMMENDED SERVICE
      </div>
    )}
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/5">
          <OptimizedImage
            src={pkg.image}
            alt={pkg.name}
            className="w-full h-auto rounded-lg border border-gray-200"
          />
        </div>
        <div className="md:w-4/5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-800">{pkg.name}</h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {pkg.duration}
            </span>
          </div>
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <span>🛡️</span> {pkg.warranty}
            </span>
            <span className="flex items-center gap-1">
              <span>📅</span> {pkg.recommendedInterval}
            </span>
          </div>
          {pkg.description && (
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {pkg.description}
            </p>
          )}
          {/* Features Grid */}
          {pkg.features && pkg.features.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Service Includes:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {pkg.features.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              {pkg.features.length > 6 && (
                <button className="text-indigo-600 hover:text-indigo-800 text-sm mt-3 font-medium">
                  + {pkg.features.length - 6} more features • View All
                </button>
              )}
            </div>
          )}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {pkg.originalPrice > pkg.discountedPrice && (
                <span className="text-gray-500 line-through text-lg">
                  ₹{pkg.originalPrice}
                </span>
              )}
              <span className="text-3xl font-bold text-gray-900">
                ₹{pkg.discountedPrice}
              </span>
              {pkg.originalPrice > pkg.discountedPrice && (
                <span className="text-green-600 text-sm font-semibold bg-green-100 px-2 py-1 rounded">
                  SAVE ₹{pkg.originalPrice - pkg.discountedPrice}
                </span>
              )}
            </div>
            <button
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                isInCart(pkg.id)
                  ? "bg-green-100 text-green-700 border-2 border-green-300"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 border-2 border-transparent"
              }`}
              onClick={() => toggleCartItem(pkg)}
            >
              {isInCart(pkg.id) ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H3m4 8v6a1 1 0 001 1h8a1 1 0 001-1v-6"
                    ></path>
                  </svg>
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const CartSection = ({
  bikeData,
  cartItems,
  subtotal,
  toggleCartItem,
  handleCheckout,
}) => (
  <>
    {/* Desktop Cart */}
    <div className="hidden lg:block w-full lg:w-1/3">
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 sticky top-20 border border-gray-200">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {bikeData.brand} {bikeData.model}
            </h3>
            <p className="text-sm text-gray-500">Selected Bike for Service</p>
          </div>
          <div className="text-right">
            <OptimizedImage
              src={bikeData.image}
              alt={`${bikeData.brand} ${bikeData.model}`}
              className="w-20 h-auto rounded-lg border border-gray-200"
            />
          </div>
        </div>
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">
            Selected Services ({cartItems.length})
          </h4>
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-300 text-4xl mb-2">🛒</div>
              <p className="text-gray-500 text-sm">No services selected yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Choose services from the list to add them here
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-medium text-sm text-gray-800 leading-tight">
                      {item.name}
                    </h5>
                    <button
                      onClick={() => toggleCartItem(item)}
                      className="text-red-500 hover:text-red-700 text-sm ml-2"
                      title="Remove from cart"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {item.warranty}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{item.discountedPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-bold text-gray-800">
              Subtotal ({cartItems.length} item
              {cartItems.length !== 1 ? "s" : ""})
            </span>
            <span className="text-2xl font-bold text-gray-900">
              ₹{subtotal}
            </span>
          </div>
          <button
            className={`w-full p-4 font-semibold rounded-lg transition-all transform hover:scale-105 ${
              cartItems.length === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
            }`}
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            {cartItems.length === 0
              ? "Select Services First"
              : "PROCEED TO CHECKOUT"}
          </button>
          {cartItems.length > 0 && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Review your services and bike details before checkout
            </p>
          )}
        </div>
      </div>
    </div>

    {/* Mobile Cart Bar */}
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            Total ({cartItems.length} service{cartItems.length !== 1 ? "s" : ""}
            )
          </p>
          <p className="text-xl font-bold text-gray-900">₹{subtotal}</p>
        </div>
        <button
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${
            cartItems.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg"
          }`}
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          {cartItems.length === 0 ? "Select Services" : "Checkout"}
        </button>
      </div>
    </div>
  </>
);

export default ServicePackagesPage;
