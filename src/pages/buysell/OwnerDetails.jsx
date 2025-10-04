import React from "react";

const OwnerDetails = ({ formData, onChange, onBlur, errors, nextStep }) => {
  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg">
            👤
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Owner Details</h2>
            <p className="text-sm text-gray-600 mt-1">Please provide your contact information</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Full Name */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            <span className="text-red-600 text-lg mr-1">*</span>
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Enter your full name"
              className={`
                w-full px-5 py-4 text-base border-2 rounded-xl 
                transition-all duration-200 outline-none text-gray-900 placeholder-gray-400
                ${errors.name 
                  ? 'border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100 focus:border-red-500 animate-shake' 
                  : 'border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500'
                }
              `}
            />
            {errors.name && (
              <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            <span className="text-red-600 text-lg mr-1">*</span>
            Mobile Number
          </label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">+91</span>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="10-digit mobile number"
              maxLength="10"
              className={`
                w-full pl-16 pr-5 py-4 text-base border-2 rounded-xl 
                transition-all duration-200 outline-none text-gray-900 placeholder-gray-400
                ${errors.mobileNumber 
                  ? 'border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100 focus:border-red-500 animate-shake' 
                  : 'border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500'
                }
              `}
            />
          </div>
          {errors.mobileNumber && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.mobileNumber}
            </p>
          )}
        </div>

        {/* Alternative Mobile */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Alternative Mobile Number
            <span className="text-xs text-gray-500 ml-2">(Optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">+91</span>
            <input
              type="tel"
              name="alternativeMobileNumber"
              value={formData.alternativeMobileNumber}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Alternate contact number"
              maxLength="10"
              className="w-full pl-16 pr-5 py-4 text-base border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 outline-none text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Email */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            <span className="text-red-600 text-lg mr-1">*</span>
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="your.email@example.com"
              className={`
                w-full pl-14 pr-5 py-4 text-base border-2 rounded-xl 
                transition-all duration-200 outline-none text-gray-900 placeholder-gray-400
                ${errors.email 
                  ? 'border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100 focus:border-red-500 animate-shake' 
                  : 'border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500'
                }
              `}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            <span className="text-red-600 text-lg mr-1">*</span>
            Full Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="House/Flat No., Street, Locality, Area"
            rows="4"
            className={`
              w-full px-5 py-4 text-base border-2 rounded-xl 
              transition-all duration-200 outline-none text-gray-900 placeholder-gray-400 resize-none
              ${errors.address 
                ? 'border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100 focus:border-red-500 animate-shake' 
                : 'border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500'
              }
            `}
          />
          {errors.address && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.address}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            <span className="text-red-600 text-lg mr-1">*</span>
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="Enter your city"
            className={`
              w-full px-5 py-4 text-base border-2 rounded-xl 
              transition-all duration-200 outline-none text-gray-900 placeholder-gray-400
              ${errors.city 
                ? 'border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100 focus:border-red-500 animate-shake' 
                : 'border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500'
              }
            `}
          />
          {errors.city && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.city}
            </p>
          )}
        </div>

        {/* Pincode */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            <span className="text-red-600 text-lg mr-1">*</span>
            Pincode
          </label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="6-digit pincode"
            maxLength="6"
            className={`
              w-full px-5 py-4 text-base border-2 rounded-xl 
              transition-all duration-200 outline-none text-gray-900 placeholder-gray-400
              ${errors.pincode 
                ? 'border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100 focus:border-red-500 animate-shake' 
                : 'border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500'
              }
            `}
          />
          {errors.pincode && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.pincode}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-8 border-t border-gray-200">
        <button
          onClick={nextStep}
          className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center gap-3"
        >
          <span>Continue to Bike Details</span>
          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OwnerDetails;
