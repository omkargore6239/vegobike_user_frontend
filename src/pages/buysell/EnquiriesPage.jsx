import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EnquiriesPage = () => {
  const [activeTab, setActiveTab] = useState("buy");
  const [enquiries, setEnquiries] = useState({
    buy: [],
    sell: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // API base URL
  const API_BASE_URL = "https://api.eptiq.com/api/bike-sale-enquiries";

  // Customer ID and Seller ID - you can get these from user context/authentication
  const CUSTOMER_ID = 456; // Replace with actual customer ID from user context
  const SELLER_ID = 10; // Replace with actual seller ID from user context

  // Fetch enquiries based on active tab
  const fetchEnquiries = async (tab) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (tab === "buy") {
        response = await axios.get(`${API_BASE_URL}/buy/${CUSTOMER_ID}`);
      } else {
        response = await axios.get(`${API_BASE_URL}/sell/${SELLER_ID}`);
      }

      console.log(`${tab} API Response:`, response.data); // Debug log

      // Validate and ensure response.data is an array
      let responseData = response.data;

      // Handle different response formats
      if (!responseData) {
        responseData = [];
      } else if (!Array.isArray(responseData)) {
        // If response is an object with a data property that contains the array
        if (responseData.data && Array.isArray(responseData.data)) {
          responseData = responseData.data;
        }
        // If response is an object with enquiries property that contains the array
        else if (
          responseData.enquiries &&
          Array.isArray(responseData.enquiries)
        ) {
          responseData = responseData.enquiries;
        }
        // If response is an object with results property that contains the array
        else if (responseData.results && Array.isArray(responseData.results)) {
          responseData = responseData.results;
        }
        // If response is a single object, wrap it in an array
        else if (typeof responseData === "object") {
          responseData = [responseData];
        }
        // If response is still not an array, set it to empty array
        else {
          console.warn(
            `Expected array but got:`,
            typeof responseData,
            responseData
          );
          responseData = [];
        }
      }

      // Transform API response to match UI structure
      const transformedData = responseData.map((item, index) => ({
        id: item.enquiryId || item.id || index,
        vehicleTitle:
          `${item.brandName || ""} ${item.modelName || ""}`.trim() ||
          "Bike Details Not Available",
        year: item.year ? item.year.toString() : "N/A",
        kmDriven: item.kmsDriven
          ? `${item.kmsDriven.toLocaleString()} KM`
          : "N/A",
        ownerType: item.numberOfOwner
          ? `${item.numberOfOwner}${getOwnerSuffix(item.numberOfOwner)} Owner`
          : "N/A",
        price: item.price
          ? `₹ ${item.price.toLocaleString()}`
          : "Price not available",
        message: item.message || "No message available",
        timestamp: "Recently", // API doesn't provide timestamp, you can add this field to backend
        status: item.status || "PENDING",
        // For buy enquiries
        sellerName: item.sellerName || "N/A",
        sellerPhone: item.sellerPhone || "N/A",
        // For sell enquiries
        buyerName: item.buyerName || "N/A",
        buyerPhone: item.buyerPhone || "N/A",
      }));

      setEnquiries((prev) => ({
        ...prev,
        [tab]: transformedData,
      }));
    } catch (error) {
      console.error(`Error fetching ${tab} enquiries:`, error);

      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        setError(
          `Server error: ${error.response.status}. ${
            error.response.data?.message || "Please try again later."
          }`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        setError(
          "No response from server. Please check your connection and try again."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        setError(`Request failed: ${error.message}`);
      }

      // Set empty array for the tab that failed
      setEnquiries((prev) => ({
        ...prev,
        [tab]: [],
      }));
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get owner suffix (1st, 2nd, 3rd, etc.)
  const getOwnerSuffix = (num) => {
    if (num === 1) return "st";
    if (num === 2) return "nd";
    if (num === 3) return "rd";
    return "th";
  };

  // Fetch data when component mounts or tab changes
  useEffect(() => {
    fetchEnquiries(activeTab);
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null); // Clear any previous errors
  };

  // Handle retry functionality
  const handleRetry = () => {
    fetchEnquiries(activeTab);
  };

  // Handle phone call
  const handleCall = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "N/A") {
      window.open(`tel:${phoneNumber}`, "_self");
    }
  };

  // Handle message/WhatsApp
  const handleMessage = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "N/A") {
      // Remove +91 and spaces for WhatsApp
      const cleanNumber = phoneNumber
        .replace(/^\+91\s*/, "")
        .replace(/\s+/g, "");
      window.open(`https://wa.me/91${cleanNumber}`, "_blank");
    }
  };

  const currentEnquiries = enquiries[activeTab];

  // Handle back navigation
  const handleBackClick = () => {
    navigate("/");
  };

  // Loading state
  if (loading && currentEnquiries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading enquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {/* Fixed Round Back Button on Left Side */}
      <button
        onClick={handleBackClick}
        className="fixed left-6 top-20 z-50 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-900 flex items-center justify-center transition-all duration-300 hover:scale-105"
        aria-label="Go back to home"
      >
        <svg
          className="w-6 h-6 text-gray-600 hover:text-gray-800"
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

      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 border-b border-gray-900 p-4 text-center">
              My Enquiries
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => handleTabChange("buy")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors rounded-t-lg ${
                activeTab === "buy"
                  ? "text-white bg-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              disabled={loading}
            >
              Buy{" "}
              {loading && activeTab === "buy" && (
                <div className="inline-block ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>
            <button
              onClick={() => handleTabChange("sell")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors rounded-t-lg ${
                activeTab === "sell"
                  ? "text-white bg-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
              disabled={loading}
            >
              Sell{" "}
              {loading && activeTab === "sell" && (
                <div className="inline-block ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-400 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-red-700">{error}</p>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                    disabled={loading}
                  >
                    {loading ? "Retrying..." : "Retry"}
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && currentEnquiries.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No enquiries found
                </h3>
                <p className="text-gray-500">
                  {activeTab === "buy"
                    ? "You haven't made any enquiries yet. Browse bikes and start conversations with sellers."
                    : "No one has enquired about your listed bikes yet. Make sure your listings are attractive and detailed."}
                </p>
              </div>
            ) : (
              /* Enquiries List */
              <div className="space-y-4">
                {currentEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="border border-gray-400 rounded-lg hover:shadow-md transition-all"
                  >
                    {/* Single Line Bike Details */}
                    <div className="bg-white p-4 rounded-t-lg border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-gray-800 flex-1 mr-4">
                          <span className="font-bold">
                            {enquiry.vehicleTitle}
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            {enquiry.year} - {enquiry.kmDriven} -{" "}
                            {enquiry.ownerType}
                          </span>
                          <span className="mx-2">•</span>
                          <span className="font-bold">{enquiry.price}</span>
                          {enquiry.status && (
                            <>
                              <span className="mx-2">•</span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  enquiry.status === "ACTIVE"
                                    ? "bg-green-100 text-green-700"
                                    : enquiry.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {enquiry.status}
                              </span>
                            </>
                          )}
                        </p>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {enquiry.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Enquiry Details */}
                    <div className="border-t border-gray-300 p-4">
                      {enquiry.message && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700">
                            {enquiry.message}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">
                            {activeTab === "buy"
                              ? enquiry.sellerName
                              : enquiry.buyerName}
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            {activeTab === "buy"
                              ? enquiry.sellerPhone
                              : enquiry.buyerPhone}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleCall(
                                activeTab === "buy"
                                  ? enquiry.sellerPhone
                                  : enquiry.buyerPhone
                              )
                            }
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            disabled={
                              (!enquiry.sellerPhone ||
                                enquiry.sellerPhone === "N/A") &&
                              (!enquiry.buyerPhone ||
                                enquiry.buyerPhone === "N/A")
                            }
                          >
                            Call
                          </button>
                          <button
                            onClick={() =>
                              handleMessage(
                                activeTab === "buy"
                                  ? enquiry.sellerPhone
                                  : enquiry.buyerPhone
                              )
                            }
                            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            disabled={
                              (!enquiry.sellerPhone ||
                                enquiry.sellerPhone === "N/A") &&
                              (!enquiry.buyerPhone ||
                                enquiry.buyerPhone === "N/A")
                            }
                          >
                            WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiriesPage;
