// components/Loader.jsx
import React from 'react';

const Loader = ({ 
  text = "Loading...", 
  size = "default", 
  color = "indigo",
  showText = true,
  fullScreen = false,
  className = ""
}) => {
  const sizes = {
    small: "w-6 h-6",
    default: "w-12 h-12",
    large: "w-16 h-16"
  };

  const colors = {
    indigo: "border-indigo-200 border-t-indigo-600",
    blue: "border-blue-200 border-t-blue-600",
    green: "border-green-200 border-t-green-600",
    red: "border-red-200 border-t-red-600",
    gray: "border-gray-200 border-t-gray-600"
  };

  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-gray-50"
    : "flex items-center justify-center py-12";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        <div 
          className={`${sizes[size]} border-4 ${colors[color]} rounded-full animate-spin`}
          aria-label="Loading"
        />
        {showText && (
          <p className="text-gray-600 text-sm font-medium animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loader;
