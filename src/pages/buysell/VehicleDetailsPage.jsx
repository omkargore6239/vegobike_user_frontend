import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Phone, MessageSquare, FileText, ArrowLeft } from "lucide-react";
import { STORAGE_KEYS } from "../../utils/constants";
import { redirectToLogin } from "../../utils/apiClient";

const VehicleDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicle } = location.state || {};
  const [activeImage, setActiveImage] = useState(0);
  const [isSubmittingEnquiry, setIsSubmittingEnquiry] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    setIsLoggedIn(!!token);
  }, []);

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

  // Data extraction - vehicle object already contains images property from homepage
  const vehicleId = vehicle.id || "Unknown";
  const vehicleTitle = vehicle.title || "Unknown Vehicle";
  const formattedPrice = vehicle.price || "Price not available";
  const vehicleLocation = vehicle.location || null;

  // Extract seller information
  const sellerName = vehicle.name || vehicle.sellerName || null;
  const contactNumber = vehicle.customerNumber || vehicle.contactNumber || null;
  const sellerEmail = vehicle.email || null;

  // Use the images object that was already constructed in the homepage
  // The homepage already has: vehicle.images = { front, back, left, right }
  const vehicleImages = vehicle.images 
    ? [
        vehicle.images.front || "/bike.jpg",
        vehicle.images.back || "/bike.jpg",
        vehicle.images.left || "/bike.jpg",
        vehicle.images.right || "/bike.jpg",
      ]
    : [vehicle.image || "/bike.jpg", "/bike.jpg", "/bike.jpg", "/bike.jpg"];

  // Documents with enhanced status checking
  const documents = [
    {
      name: "RC BOOK",
      status: vehicle.isDocument === true ? "Available" : "Not Available",
      icon: (
        <FileText
          className={
            vehicle.isDocument === true ? "text-green-600" : "text-red-600"
          }
          size={16}
        />
      ),
    },
    {
      name: "PUC",
      status: vehicle.isPuc === true ? "Available" : "Not Available",
      icon: (
        <FileText
          className={vehicle.isPuc === true ? "text-green-600" : "text-red-600"}
          size={16}
        />
      ),
    },
    {
      name: "Insurance",
      status: vehicle.isInsurance === true ? "Available" : "Not Available",
      icon: (
        <FileText
          className={
            vehicle.isInsurance === true ? "text-green-600" : "text-red-600"
          }
          size={16}
        />
      ),
    },
  ];

  // Enhanced Call Seller functionality with Login Check
  const handleCallSeller = async () => {
    if (!isLoggedIn) {
      redirectToLogin("Please login to contact the seller");
      return;
    }

    setIsSubmittingEnquiry(true);
    setEnquiryStatus(null);

    try {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

      const enquiryData = {
        bikeId: vehicleId,
        customerName: "Prospective Buyer",
        customerEmail: "buyer@example.com",
        customerPhone: "9999999999",
        enquiryType: "CALL_REQUEST",
        message: `Interested in ${vehicleTitle} - ${formattedPrice}`,
        bikeTitle: vehicleTitle,
        bikePrice: vehicle.priceValue || 0,
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
            Authorization: `Bearer ${token}`,
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

  // Enhanced Text Seller functionality with Login Check
  const handleTextSeller = () => {
    if (!isLoggedIn) {
      redirectToLogin("Please login to chat with the seller");
      return;
    }

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
  const hasSellerInfo = sellerName || contactNumber || sellerEmail || vehicleLocation;

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
          <div className="w-8"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 max-w-6xl">
        <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl border border-gray-200">
          {/* Status Messages */}
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

          {/* Main Image Section */}
          <div className="relative">
            <img
              src={vehicleImages[activeImage]}
              alt={vehicleTitle}
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover sm:object-contain bg-gray-100"
              onError={(e) => {
                console.error("Image load error:", e.target.src);
                e.target.src = "/bike.jpg";
              }}
            />
            {/* Image Counter */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black bg-opacity-70 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {activeImage + 1} / {vehicleImages.length}
            </div>
          </div>

          {/* Thumbnail Gallery */}
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

          {/* Vehicle Details Section */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
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
                <span className="text-blue-800 font-medium text-sm">
                  {vehicle.type?.charAt(0).toUpperCase() + vehicle.type?.slice(1) || "Bike"}
                </span>
              </div>
            </div>

            {/* Location */}
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

            {/* Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
              <button
                onClick={handleCallSeller}
                disabled={isSubmittingEnquiry || !isLoggedIn}
                className={`flex-1 flex items-center justify-center gap-2 ${
                  isSubmittingEnquiry || !isLoggedIn
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                } text-white py-3 sm:py-3.5 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base`}
                title={!isLoggedIn ? "Please login to call seller" : ""}
              >
                <Phone size={16} className="sm:w-5 sm:h-5" />
                <span>
                  {isSubmittingEnquiry
                    ? "Submitting..."
                    : !isLoggedIn
                    ? "Call Seller (Login Required)"
                    : "Call Seller"}
                </span>
              </button>

              <button
                onClick={handleTextSeller}
                disabled={!isLoggedIn}
                className={`flex-1 flex items-center justify-center gap-2 ${
                  !isLoggedIn
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                } text-white py-3 sm:py-3.5 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base`}
                title={!isLoggedIn ? "Please login to text seller" : ""}
              >
                <MessageSquare size={16} className="sm:w-5 sm:h-5" />
                <span>
                  {!isLoggedIn ? "Text Seller (Login Required)" : "Text Seller"}
                </span>
              </button>
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 border-l-4 border-blue-400">
              <div className="text-blue-800 space-y-2">
                {!isLoggedIn && (
                  <p className="text-xs sm:text-sm font-semibold">
                    🔒 Please login to contact the seller
                  </p>
                )}
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

            {/* Seller Information */}
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

            {/* Vehicle Details Grid */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                Vehicle Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: "Brand", value: vehicle.brand || "Unknown" },
                  { label: "Model", value: vehicle.model || "Unknown" },
                  { label: "Color", value: vehicle.color || "Not specified" },
                  {
                    label: "Registration No.",
                    value: vehicle.registrationNumber || vehicle.registrationNo || "Not provided",
                  },
                  {
                    label: "Registration Year",
                    value: vehicle.registrationYear || "Not specified",
                  },
                  {
                    label: "KM Driven",
                    value: vehicle.kmDriven || "Not specified",
                  },
                  {
                    label: "Condition",
                    value: vehicle.bikeCondition || "Not specified",
                  },
                  {
                    label: "No. of Owners",
                    value: vehicle.owner || "Not specified",
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

            {/* Documents Section */}
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

            {/* Additional Information */}
            {(vehicle.additionalNotes || vehicle.supervisorName || vehicle.description) && (
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                  Additional Information
                </h3>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-2">
                  {vehicle.supervisorName && (
                    <p className="text-gray-700 text-sm sm:text-base">
                      <span className="font-semibold">Supervisor:</span>{" "}
                      {vehicle.supervisorName}
                    </p>
                  )}
                  {(vehicle.additionalNotes || vehicle.description) && (
                    <p className="text-gray-700 text-sm sm:text-base">
                      <span className="font-semibold">Notes:</span>{" "}
                      {vehicle.additionalNotes || vehicle.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Status Indicators */}
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  vehicle.listingStatus === "LISTED"
                    ? "bg-green-100 text-green-800"
                    : vehicle.listingStatus === "FEATURED"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {vehicle.listingStatus || "Unknown Status"}
              </span>
              {vehicle.isRepairRequired && (
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
