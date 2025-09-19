import React from 'react';
import { Link } from 'react-router-dom';

const RentalCard = ({ bike }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={bike.image}
          alt={bike.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200?text=Bike+Image';
          }}
        />
        <div className="absolute top-4 right-4">
          {bike.available ? (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Available
            </span>
          ) : (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Unavailable
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{bike.name}</h3>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-gray-600">{bike.rating}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium">
            {bike.brand}
          </span>
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
            {bike.type}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3">📍 {bike.location}</p>

        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">Key Features:</div>
          <div className="flex flex-wrap gap-1">
            {bike.features.slice(0, 2).map((feature, index) => (
              <span key={index} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded">
                {feature}
              </span>
            ))}
            {bike.features.length > 2 && (
              <span className="text-xs text-gray-500">+{bike.features.length - 2} more</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">₹{bike.price}</span>
            <span className="text-gray-600 text-sm">/day</span>
          </div>
          
          <Link
            to={`/rental/bike/${bike.id}`}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;
