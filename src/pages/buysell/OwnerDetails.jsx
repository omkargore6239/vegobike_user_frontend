import React from 'react';

const OwnerDetails = ({ formData, setFormData, nextStep }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Owner Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Full Name */}
        <div className="mb-2 col-span-3 md:col-span-1">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        {/* Contact Info */}
        <div className="mb-2 md:col-span-1">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="mobileNumber">
            Mobile Number
          </label>
          <input
            id="mobileNumber"
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber || ''}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        <div className="mb-2 md:col-span-1">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="alternativeMobileNumber">
            Alternative Mobile
          </label>
          <input
            id="alternativeMobileNumber"
            type="tel"
            name="alternativeMobileNumber"
            value={formData.alternativeMobileNumber || ''}
            onChange={handleChange}
            placeholder="Enter alternative number (optional)"
            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        


        {/* Email */}
        <div className="mb-2 col-span-1">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            placeholder="Enter your email address"
            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        
        {/* City and Pincode */}
        <div className="mb-2 md:col-span-1">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="city">
            City
          </label>
          <input
            id="city"
            type="text"
            name="city"
            value={formData.city || ''}
            onChange={handleChange}
            placeholder="Enter your city"
            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        <div className="mb-2 md:col-span-1">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="pincode">
            Pincode
          </label>
          <input
            id="pincode"
            type="text"
            name="pincode"
            value={formData.pincode || ''}
            onChange={handleChange}
            placeholder="Enter your pincode"
            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>

        {/* Address */}
        <div className="mb-2 col-span-1">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            placeholder="Enter your complete address"
            rows="3"
            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            required
          />
        </div>

        <div className="mb-2 md:col-span-1">
          <label className="block text-gray-700 font-medium mb-1" htmlFor="state">
            State
          </label>
          <input
            id="state"
            type="text"
            name="state"
            value={formData.state || ''}
            onChange={handleChange}
            placeholder="Enter your state"
            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            required
          />
        </div>
      </div>

      <div className="flex justify-end mt-16">
        <button
          onClick={nextStep}
          className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all flex items-center"
        >
          Continue
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OwnerDetails;
