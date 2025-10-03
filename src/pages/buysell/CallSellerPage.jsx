import React, { useState } from "react";

const CallSellerPage = ({ bikeDetails, sellerDetails, goBack }) => {
  const [isCalling, setIsCalling] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const handleCallNow = () => {
    setIsCalling(true);
    // Simulate call connection
    setTimeout(() => {
      setIsCalling(false);
      setShowContactInfo(true);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-4 mb-4">
      <div className="flex items-center mb-6">
        <button
          onClick={goBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Call Seller</h2>
      </div>

      {/* Bike and Seller Info Card */}
      <div className="flex mb-6 border rounded-lg overflow-hidden">
        <div className="w-1/3">
          <img
            src="/bike.jpg"
            alt="Bike"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-2/3 p-4">
          <h3 className="font-bold text-lg">
            {bikeDetails?.bikeBrand || "Honda"}{" "}
            {bikeDetails?.bikeModel || "CBR 250R"}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {bikeDetails?.manufactureYear || "2022"} •{" "}
            {bikeDetails?.odometerReading || "5,000"} km
          </p>
          <p className="font-bold text-xl text-green-600 mb-4">
            ₹{bikeDetails?.sellingPrice?.toLocaleString() || "1,25,000"}
          </p>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-2">
              {sellerDetails?.name?.charAt(0) || "S"}
            </div>
            <div>
              <p className="font-medium">
                {sellerDetails?.name || "Rahul Sharma"}
              </p>
              <p className="text-xs text-gray-500">Seller</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calling Interface */}
      {isCalling ? (
        <div className="text-center py-10">
          <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-green-600 animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">Connecting...</h3>
          <p className="text-gray-500">
            Please wait while we connect your call
          </p>
        </div>
      ) : showContactInfo ? (
        <div className="py-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-center">
            <svg
              className="w-10 h-10 text-green-500 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-green-800 font-medium text-lg">
              Call Connected!
            </h3>
            <p className="text-green-700 text-sm">
              You can now contact the seller directly
            </p>
          </div>

          <div className="border rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2">Seller Contact Information</h3>
            <div className="flex items-center justify-between mb-3 bg-gray-50 p-3 rounded">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  ></path>
                </svg>
                <span>{sellerDetails?.mobileNumber || "+91 98765 43210"}</span>
              </div>
              <a
                href={`tel:${sellerDetails?.mobileNumber || "+919876543210"}`}
                className="text-blue-600 font-medium text-sm"
              >
                Call
              </a>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <span>{sellerDetails?.email || "rahul.s@example.com"}</span>
              </div>
              <a
                href={`mailto:${sellerDetails?.email || "rahul.s@example.com"}`}
                className="text-blue-600 font-medium text-sm"
              >
                Email
              </a>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
            <p className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              <span>
                Be cautious when sharing personal information. Never send money
                before seeing the bike in person.
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="py-6">
          <p className="text-gray-600 mb-6">
            You're about to call the seller of this bike. When connected, we
            recommend asking about:
          </p>

          <ul className="mb-8">
            <li className="flex items-start mb-3">
              <svg
                className="w-5 h-5 text-green-600 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Current condition and service history</span>
            </li>
            <li className="flex items-start mb-3">
              <svg
                className="w-5 h-5 text-green-600 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Reason for selling</span>
            </li>
            <li className="flex items-start mb-3">
              <svg
                className="w-5 h-5 text-green-600 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Any modifications or aftermarket parts</span>
            </li>
            <li className="flex items-start">
              <svg
                className="w-5 h-5 text-green-600 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>Possibility for test ride and inspection</span>
            </li>
          </ul>

          <button
            onClick={handleCallNow}
            className="w-full py-3 bg-green-600 text-white rounded-md font-medium flex items-center justify-center hover:bg-green-700 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              ></path>
            </svg>
            Call Seller Now
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your number will be shared with the seller when you call
          </p>
        </div>
      )}
    </div>
  );
};

export default CallSellerPage;
