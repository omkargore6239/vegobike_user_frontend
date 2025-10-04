import React, { useState } from "react";

const BikeImages = ({ formData, setFormData, prevStep, submitForm, isSubmitting }) => {
  const [previews, setPreviews] = useState({
    frontPhoto: null,
    backPhoto: null,
    leftPhoto: null,
    rightPhoto: null,
  });

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews({ ...previews, [name]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (name) => {
    setFormData({ ...formData, [name]: null });
    setPreviews({ ...previews, [name]: null });
  };

  const ImageUploadBox = ({ name, label, icon, isRequired }) => (
    <div className="relative group">
      <label className="block text-sm font-bold text-gray-700 mb-3">
        {isRequired && <span className="text-red-600 text-lg mr-1">*</span>}
        {label}
      </label>
      {!previews[name] ? (
        <label
          htmlFor={name}
          className="relative flex flex-col items-center justify-center w-full h-64 border-3 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 hover:border-blue-400 transition-all duration-300 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
            <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-5xl">{icon}</span>
            </div>
            <p className="mb-2 text-base font-semibold text-gray-700">
              <span className="text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-sm text-gray-500">PNG, JPG, GIF or BMP</p>
            <p className="text-xs text-gray-400 mt-1">(Max size: 5MB)</p>
          </div>
          <input
            id={name}
            name={name}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      ) : (
        <div className="relative h-64 rounded-2xl overflow-hidden border-3 border-green-400 group shadow-lg">
          <img
            src={previews[name]}
            alt={label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              onClick={() => removeImage(name)}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-red-300 flex items-center gap-2 shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
          </div>
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Uploaded
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-2xl shadow-lg">
            📸
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Upload Bike Images</h2>
            <p className="text-sm text-gray-600 mt-1">Add clear photos from different angles</p>
          </div>
        </div>
      </div>

      {/* Upload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ImageUploadBox name="frontPhoto" label="Front View" icon="🏍️" isRequired={false} />
        <ImageUploadBox name="backPhoto" label="Back View" icon="🔙" isRequired={false} />
        <ImageUploadBox name="leftPhoto" label="Left Side View" icon="⬅️" isRequired={false} />
        <ImageUploadBox name="rightPhoto" label="Right Side View" icon="➡️" isRequired={false} />
      </div>

      {/* Upload Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl">
              {[formData.frontPhoto, formData.backPhoto, formData.leftPhoto, formData.rightPhoto].filter(Boolean).length}
            </div>
            <div>
              <p className="text-sm font-bold text-green-900">Images Uploaded</p>
              <p className="text-xs text-green-700">At least 1 image required</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              {[formData.frontPhoto, formData.backPhoto, formData.leftPhoto, formData.rightPhoto].filter(Boolean).length}/4
            </p>
          </div>
        </div>
      </div>

      {/* Tips Box */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <p className="text-sm font-bold text-amber-900 mb-3">Photography Tips for Best Results</p>
            <ul className="text-sm text-amber-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Take photos in bright, natural daylight for best clarity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Clean your bike thoroughly before photographing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Capture the entire bike in frame from each angle</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Avoid blurry, dark, or heavily filtered images</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Show any damage or wear honestly to build trust</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-gray-200">
        <button
          onClick={prevStep}
          disabled={isSubmitting}
          className="group bg-gray-100 text-gray-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          <span>Back to Bike Details</span>
        </button>
        <button
          onClick={submitForm}
          disabled={isSubmitting}
          className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit Listing</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BikeImages;
