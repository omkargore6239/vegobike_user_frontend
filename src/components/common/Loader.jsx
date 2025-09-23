import React from 'react';

const Loader = ({ text = "Loading...", size = "medium" }) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8", 
    large: "h-12 w-12"
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600`}></div>
        </div>
        <p className="text-gray-600 text-sm">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
