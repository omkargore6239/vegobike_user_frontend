import React, { useState } from 'react';

const BikeImages = ({ formData, setFormData, prevStep, submitForm }) => {
  // Track image previews
  const [previews, setPreviews] = useState({
    frontPhoto: null,
    backPhoto: null,
    leftPhoto: null,
    rightPhoto: null
  });

  const handleChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      // Update form data with the file
      setFormData({
        ...formData,
        [name]: files[0],
      });

      // Create and set preview URL
      const previewUrl = URL.createObjectURL(files[0]);
      setPreviews({
        ...previews,
        [name]: previewUrl
      });
    }
  };

  // Image upload dropzone component
  const ImageUpload = ({ label, name, icon }) => (
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-2" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type="file"
          name={name}
          onChange={handleChange}
          accept="image/*"
          className="hidden"
        />
        <label
          htmlFor={name}
          className="cursor-pointer block w-full"
        >
          {previews[name] ? (
            <div className="relative group">
              <img
                src={previews[name]}
                alt={`${label} preview`}
                className="w-full h-48 object-cover rounded-lg border-2 border-blue-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg transition-opacity">
                <span className="text-white font-medium">Change Image</span>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-48 bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="text-blue-500 mb-2">
                {icon}
              </div>
              <p className="text-sm text-gray-600 font-medium">Click to upload {label}</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, or JPEG (max 5MB)</p>
            </div>
          )}
        </label>
      </div>
    </div>
  );

  // Icons for different angles
  const icons = {
    frontPhoto: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    backPhoto: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    leftPhoto: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    rightPhoto: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  };

  // Check if all required images are uploaded
  const allImagesUploaded =
    formData.frontPhoto &&
    formData.backPhoto &&
    formData.leftPhoto &&
    formData.rightPhoto;

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        Upload Bike Images
      </h2>

      <div className="mb-4 bg-blue-50 text-blue-800 p-4 rounded-md">
        <p className="text-sm">
          <strong>Tip:</strong> Upload clear, well-lit photos of your bike from all angles.
          Good quality images increase the chances of selling your bike faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ImageUpload label="Front View" name="frontPhoto" icon={icons.frontPhoto} />
        <ImageUpload label="Back View" name="backPhoto" icon={icons.backPhoto} />
        <ImageUpload label="Left Side View" name="leftPhoto" icon={icons.leftPhoto} />
        <ImageUpload label="Right Side View" name="rightPhoto" icon={icons.rightPhoto} />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="px-6 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Previous
        </button>

        {!allImagesUploaded && (
        <p className="text-xs text-center text-gray-500 mt-4">
          Please upload all required images to continue
        </p>
      )}

        <button
          onClick={submitForm}
          disabled={!allImagesUploaded}
          className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all flex items-center ${
            allImagesUploaded
              ? "text-white bg-green-600 hover:bg-green-700"
              : "text-gray-500 bg-gray-200 cursor-not-allowed"
          }`}
        >
          Submit Listing
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </button>
      </div>

      
    </div>
  );
};

export default BikeImages;
