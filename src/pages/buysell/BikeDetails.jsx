import React from "react";

const BikeDetails = ({ formData, setFormData, handleBlur, errors, nextStep, prevStep }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(name, value);
  };

  const handleFieldBlur = (e) => {
    const { name, value } = e.target;
    handleBlur(name, value);
  };

  const InputField = ({ label, name, type = "text", placeholder, required, maxLength, icon, className = "" }) => (
    <div className={className}>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {required && <span className="text-red-600 text-lg mr-1">*</span>}
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-700 font-bold text-lg">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onBlur={handleFieldBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          min={type === "number" ? "0" : undefined}
          className={`
            w-full ${icon ? 'pl-12 pr-5' : 'px-5'} py-4 text-base border-2 rounded-xl 
            transition-all duration-200 outline-none text-gray-900 placeholder-gray-400
            ${errors[name] 
              ? 'border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100 focus:border-red-500 animate-shake' 
              : 'border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500'
            }
          `}
          required={required}
        />
        {errors[name] && (
          <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      {errors[name] && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors[name]}
        </p>
      )}
    </div>
  );

  const SelectField = ({ label, name, options, required, className = "" }) => (
    <div className={className}>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        {required && <span className="text-red-600 text-lg mr-1">*</span>}
        {label}
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        onBlur={handleFieldBlur}
        className={`
          w-full px-5 py-4 text-base border-2 rounded-xl 
          transition-all duration-200 outline-none text-gray-900 bg-white cursor-pointer
          ${errors[name] 
            ? 'border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100 focus:border-red-500 animate-shake' 
            : 'border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-blue-100 focus:border-blue-500'
          }
        `}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shadow-lg">
            🏍️
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Bike Details</h2>
            <p className="text-sm text-gray-600 mt-1">Tell us about your motorcycle</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <SelectField
          label="Bike Category"
          name="bikeCategory"
          required
          options={[
            { value: "", label: "Select Category" },
            { value: "1", label: "🏁 Sports" },
            { value: "2", label: "🛣️ Cruiser" },
            { value: "3", label: "🚦 Commuter" },
            { value: "4", label: "🏔️ Adventure" },
            { value: "5", label: "🛴 Scooter" },
          ]}
        />

        <SelectField
          label="Bike Brand"
          name="bikeBrand"
          required
          options={[
            { value: "", label: "Select Brand" },
            { value: "1", label: "Honda" },
            { value: "2", label: "Yamaha" },
            { value: "3", label: "Royal Enfield" },
            { value: "4", label: "Bajaj" },
            { value: "5", label: "TVS" },
            { value: "6", label: "Hero" },
            { value: "7", label: "KTM" },
            { value: "8", label: "Suzuki" },
            { value: "9", label: "Kawasaki" },
          ]}
        />

        <InputField
          label="Bike Model"
          name="bikeModel"
          placeholder="e.g., Activa 6G, Splendor Plus"
          required
        />

        <InputField
          label="Registration Number"
          name="registrationNumber"
          placeholder="e.g., DL01AB1234"
          required
          className="uppercase"
        />

        <InputField
          label="Bike Color"
          name="bikeColor"
          placeholder="e.g., Black, Red, Blue"
          required
        />

        <SelectField
          label="Manufacture Year"
          name="manufactureYear"
          required
          options={[
            { value: "", label: "Select Year" },
            ...Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i).map((year) => ({
              value: year.toString(),
              label: year.toString(),
            })),
          ]}
        />

        <SelectField
          label="Number of Owners"
          name="numberOfOwners"
          required
          options={[
            { value: "", label: "Select" },
            { value: "1", label: "1st Owner (Single Owner)" },
            { value: "2", label: "2nd Owner" },
            { value: "3", label: "3rd Owner" },
            { value: "4", label: "4+ Owners" },
          ]}
        />

        <InputField
          label="Odometer Reading (km)"
          name="odometerReading"
          type="number"
          placeholder="e.g., 15000"
          required
        />

        <InputField
          label="Selling Price"
          name="sellingPrice"
          type="number"
          placeholder="e.g., 45000"
          icon="₹"
          required
        />

        <SelectField
          label="Bike Condition"
          name="bikeCondition"
          required
          options={[
            { value: "", label: "Select Condition" },
            { value: "Excellent", label: "⭐ Excellent - Like New" },
            { value: "Good", label: "✅ Good - Minor Wear" },
            { value: "Fair", label: "⚠️ Fair - Some Issues" },
            { value: "Needs Work", label: "🔧 Needs Work" },
          ]}
        />
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-blue-900 mb-2">💡 Tips for Better Listing</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Provide accurate mileage and condition details</li>
              <li>• Double-check your registration number</li>
              <li>• Set a competitive price based on market value</li>
              <li>• Be honest about any repairs or modifications</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-gray-200">
        <button
          onClick={prevStep}
          className="group bg-gray-100 text-gray-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-300 flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          <span>Back to Owner Details</span>
        </button>
        <button
          onClick={nextStep}
          className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-300 flex items-center justify-center gap-3"
        >
          <span>Continue to Upload Images</span>
          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BikeDetails;
