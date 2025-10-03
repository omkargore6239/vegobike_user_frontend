import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Phone, MessageSquare, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VehicleDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle } = location.state || {};
  const [activeImage, setActiveImage] = useState(0);
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState(null);

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold text-red-600 mb-2">
            Vehicle Not Found
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            The vehicle details are not available.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Robust data extraction with fallbacks
  const bikeSale = vehicle.bikeSale || vehicle.bike || vehicle;
  const images = vehicle.images || bikeSale.images || {};

  // Build image URLs with proper base URL
  const baseImageUrl = `${import.meta.env.VITE_BASE_URL}/uploads/`;

  const vehicleImages = [
    images.frontImages ? `${baseImageUrl}${images.frontImages}` : "/bike.jpg",
    images.backImages ? `${baseImageUrl}${images.backImages}` : "/bike.jpg",
    images.leftImages ? `${baseImageUrl}${images.leftImages}` : "/bike.jpg",
    images.rightImages ? `${baseImageUrl}${images.rightImages}` : "/bike.jpg",
  ];

  // Data extraction with comprehensive fallbacks
  const vehicleId = bikeSale?.id || vehicle?.id || "Unknown";
  const sellerName =
    bikeSale?.name ||
    bikeSale?.sellerName ||
    vehicle?.sellerName ||
    vehicle?.name ||
    null;
  const contactNumber =
    bikeSale?.contactNumber ||
    bikeSale?.phone ||
    vehicle?.contactNumber ||
    vehicle?.phone ||
    null;
  const sellerEmail =
    bikeSale?.email ||
    bikeSale?.sellerEmail ||
    vehicle?.email ||
    vehicle?.sellerEmail ||
    null;

  // Enhanced vehicle title creation
  const getBrandName = (brandId) => {
    return brandId ? `Brand ${brandId}` : "Unknown Brand";
  };

  const getModelName = (modelId) => {
    return modelId ? `Model ${modelId}` : "Unknown Model";
  };

  const vehicleTitle = `${getBrandName(bikeSale?.brandId)} ${getModelName(
    bikeSale?.modelId
  )}`;
  const formattedPrice = bikeSale?.price
    ? `₹${bikeSale.price.toLocaleString()}`
    : "Price not available";

  const vehicleLocation = (() => {
    const city = bikeSale?.city || "";
    const pincode = bikeSale?.pincode || "";
    const location = `${city}${city && pincode ? ", " : ""}${pincode}`.trim();
    return location || null;
  })();

  // Documents with enhanced status checking
  const documents = [
    {
      name: "RC BOOK",
      status: bikeSale?.isDocument === true ? "Available" : "Not Available",
      icon: (
        <FileText
          className={
            bikeSale?.isDocument === true ? "text-green-600" : "text-red-600"
          }
          size={16}
        />
      ),
    },
    {
      name: "PUC",
      status: bikeSale?.isPuc === true ? "Available" : "Not Available",
      icon: (
        <FileText
          className={
            bikeSale?.isPuc === true ? "text-green-600" : "text-red-600"
          }
          size={16}
        />
      ),
    },
    {
      name: "Insurance",
      status: bikeSale?.isInsurance === true ? "Available" : "Not Available",
      icon: (
        <FileText
          className={
            bikeSale?.isInsurance === true ? "text-green-600" : "text-red-600"
          }
          size={16}
        />
      ),
    },
  ];

  // Enhanced Call Seller functionality
  const handleCallSeller = async () => {
    setIsSubmittingEnquiry(true);
    setEnquiryStatus(null);

    try {
      const enquiryData = {
        bikeId: vehicleId,
        customerName: "Prospective Buyer",
        customerEmail: "buyer@example.com",
        customerPhone: "9999999999",
        enquiryType: "CALL_REQUEST",
        message: `Interested in ${vehicleTitle} - ${formattedPrice}`,
        bikeTitle: vehicleTitle,
        bikePrice: bikeSale?.price || 0,
        sellerName: sellerName || "Unknown",
        sellerPhone: contactNumber || "Unknown",
        sellerEmail: sellerEmail || "Unknown",
      };

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/bike-sale-enquiries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(enquiryData),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        setEnquiryStatus("success");
        setTimeout(() => setEnquiryStatus(null), 5000);
      } else {
        const errorData = await response.json();
        console.error("Error submitting enquiry:", errorData);
        setEnquiryStatus("error");
        setTimeout(() => setEnquiryStatus(null), 3000);
      }
    } catch (error) {
      console.error("Network error submitting enquiry:", error);
      setEnquiryStatus("error");
      setTimeout(() => setEnquiryStatus(null), 3000);
    } finally {
      setIsSubmittingEnquiry(false);
    }
  };

  // Enhanced Text Seller functionality
  const handleTextSeller = () => {
    const chatId = vehicleId;
    const userId = 123;

    navigate(`/chat/${chatId}/${userId}`, {
      state: {
        vehicle: vehicle,
        contactName: sellerName || "Seller",
        contactPhone: contactNumber || "Unknown",
        enquiryType: "TEXT_MESSAGE",
      },
    });
  };

  // Check if seller information is available
  const hasSellerInfo =
    sellerName || contactNumber || sellerEmail || vehicleLocation;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header with Back Button */}
      <div className="sticky top-0 z-50 bg-white shadow-sm border-b md:hidden">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold truncate mx-4">
            Vehicle Details
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Main Container - Mobile First Responsive */}
      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 max-w-6xl">
        <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl border border-gray-200">
          {/* Status Messages - Mobile Optimized */}
          {enquiryStatus && (
            <div
              className={`p-3 sm:p-4 mx-4 mt-4 sm:mx-6 sm:mt-6 rounded-lg text-sm sm:text-base ${
                enquiryStatus === "success"
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : "bg-red-100 border border-red-400 text-red-700"
              }`}
            >
              {enquiryStatus === "success"
                ? "✅ Call enquiry submitted successfully! The seller will contact you soon."
                : "❌ Failed to submit enquiry. Please try again."}
            </div>
          )}

          {/* Main Image Section - Mobile Optimized */}
          <div className="relative">
            <img
              src={vehicleImages[activeImage]}
              alt={vehicleTitle}
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover sm:object-contain bg-gray-100"
              onError={(e) => {
                e.target.src = "/bike.jpg";
              }}
            />
            {/* Image Counter - Mobile Friendly */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black bg-opacity-70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {activeImage + 1} / {vehicleImages.length}
            </div>
          </div>

          {/* Thumbnail Gallery - Mobile Responsive Grid */}
          <div className="grid grid-cols-4 gap-1 sm:gap-2 p-2 sm:p-3 bg-gray-50">
            {vehicleImages.map((img, index) => (
              <div
                key={index}
                className={`cursor-pointer border-2 rounded-md sm:rounded-lg overflow-hidden transition-all duration-200 ${
                  activeImage === index
                    ? "border-blue-500 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setActiveImage(index)}
              >
                <img
                  src={img}
                  alt={`View ${index + 1}`}
                  className="w-full h-12 sm:h-16 md:h-20 object-cover bg-gray-50"
                  onError={(e) => {
                    e.target.src = "/bike.jpg";
                  }}
                />
              </div>
            ))}
          </div>

          {/* Vehicle Details Section - Mobile First Design */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header Section - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                  {vehicleTitle}
                </h1>
                <p className="text-xl sm:text-2xl font-semibold text-blue-600">
                  {formattedPrice}
                </p>
              </div>
              <div className="bg-blue-100 rounded-lg px-3 py-2 self-start sm:self-auto">
                <span className="text-blue-800 font-medium text-sm">Bike</span>
              </div>
            </div>

            {/* Location - Mobile Friendly */}
            {vehicleLocation && (
              <div className="flex items-center text-gray-600 mb-4 sm:mb-6">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm sm:text-base lg:text-lg">
                  {vehicleLocation}
                </span>
              </div>
            )}

            {/* Contact Buttons - Mobile First */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
              <button
                onClick={handleCallSeller}
                disabled={isSubmittingEnquiry}
                className={`flex-1 flex items-center justify-center gap-2 ${
                  isSubmittingEnquiry
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                } text-white py-3 sm:py-3.5 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base`}
              >
                <Phone size={16} className="sm:w-5 sm:h-5" />
                <span>
                  {isSubmittingEnquiry ? "Submitting..." : "Call Seller"}
                </span>
              </button>

              <button
                onClick={handleTextSeller}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 sm:py-3.5 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                <MessageSquare size={16} className="sm:w-5 sm:h-5" />
                <span>Text Seller</span>
              </button>
            </div>

            {/* Information Box - Mobile Optimized */}
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 border-l-4 border-blue-400">
              <div className="text-blue-800 space-y-2">
                <p className="text-xs sm:text-sm">
                  <strong>📞 Call Seller:</strong> Submit your interest and the
                  seller will contact you directly.
                </p>
                <p className="text-xs sm:text-sm">
                  <strong>💬 Text Seller:</strong> Start an instant chat
                  conversation with the seller.
                </p>
              </div>
            </div>

            {/* Seller Information - Mobile Responsive */}
            {hasSellerInfo && (
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                  Seller Information
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <div className="space-y-2">
                    {sellerName && (
                      <p className="text-gray-700 text-sm sm:text-base">
                        <span className="font-semibold">Seller Name:</span>{" "}
                        {sellerName}
                      </p>
                    )}
                    {contactNumber && (
                      <p className="text-gray-700 text-sm sm:text-base">
                        <span className="font-semibold">Contact Number:</span>{" "}
                        <a
                          href={`tel:${contactNumber}`}
                          className="text-blue-600 hover:underline"
                        >
                          {contactNumber}
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    {sellerEmail && (
                      <p className="text-gray-700 text-sm sm:text-base">
                        <span className="font-semibold">Email:</span>{" "}
                        <a
                          href={`mailto:${sellerEmail}`}
                          className="text-blue-600 hover:underline"
                        >
                          {sellerEmail}
                        </a>
                      </p>
                    )}
                    {vehicleLocation && (
                      <p className="text-gray-700 text-sm sm:text-base">
                        <span className="font-semibold">Location:</span>{" "}
                        {vehicleLocation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Vehicle Details Grid - Mobile First Responsive */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                Vehicle Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: "Brand", value: getBrandName(bikeSale?.brandId) },
                  { label: "Model", value: getModelName(bikeSale?.modelId) },
                  { label: "Color", value: bikeSale?.color || "Not specified" },
                  {
                    label: "Registration No.",
                    value: bikeSale?.registrationNumber || "Not provided",
                  },
                  {
                    label: "Registration Year",
                    value: bikeSale?.yearId || "Not specified",
                  },
                  {
                    label: "KM Driven",
                    value: bikeSale?.kmsDriven
                      ? `${bikeSale.kmsDriven.toLocaleString()} km`
                      : "Not specified",
                  },
                  {
                    label: "Condition",
                    value: bikeSale?.bikeCondition || "Not specified",
                  },
                  {
                    label: "No. of Owners",
                    value: bikeSale?.numberOfOwner
                      ? `${bikeSale.numberOfOwner} owner(s)`
                      : "Not specified",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-gray-600 text-sm sm:text-base font-medium">
                      {item.label}
                    </span>
                    <span className="font-medium text-gray-900 text-sm sm:text-base text-right ml-4">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Documents Section - Mobile Responsive Grid */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                Available Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 sm:p-4 rounded-lg flex items-center hover:bg-gray-100 transition-colors"
                  >
                    <div className="bg-white p-2 rounded-full mr-3 shadow-sm flex-shrink-0">
                      {doc.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                        {doc.name}
                      </h4>
                      <p
                        className={`text-xs sm:text-sm ${
                          doc.status.includes("Available")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {doc.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information - Mobile Optimized */}
            {(bikeSale?.additionalNotes || bikeSale?.supervisorName) && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                  Additional Information
                </h3>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
                  {bikeSale?.supervisorName && (
                    <p className="text-gray-700 text-sm sm:text-base">
                      <span className="font-semibold">Supervisor:</span>{" "}
                      {bikeSale.supervisorName}
                    </p>
                  )}
                  {bikeSale?.additionalNotes && (
                    <p className="text-gray-700 text-sm sm:text-base">
                      <span className="font-semibold">Notes:</span>{" "}
                      {bikeSale.additionalNotes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Status Indicators - Mobile Friendly */}
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  bikeSale?.listingStatus === "LISTED"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {bikeSale?.listingStatus || "Unknown Status"}
              </span>
              {bikeSale?.isRepairRequired && (
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Repair Required
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
