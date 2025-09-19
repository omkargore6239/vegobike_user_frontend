import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ChatBox from './ChatBox';

const ListingDetails = ({ listing }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const { isAuthenticated } = useAuth();

  const images = listing.images || [listing.image || 'https://via.placeholder.com/400x300?text=Vehicle'];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Image Gallery */}
      <div className="relative">
        <img
          src={images[selectedImage]}
          alt={listing.title}
          className="w-full h-96 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/600x400?text=Vehicle+Image';
          }}
        />
        
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-3 h-3 rounded-full ${
                    selectedImage === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <div className="flex items-center space-x-3">
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                {listing.type}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                listing.condition === 'excellent' 
                  ? 'bg-green-100 text-green-800'
                  : listing.condition === 'good'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {listing.condition}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">₹{listing.price?.toLocaleString()}</div>
            {listing.negotiable && (
              <span className="text-sm text-gray-500">Negotiable</span>
            )}
          </div>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-500">Brand</div>
            <div className="font-medium text-gray-900">{listing.brand}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Model</div>
            <div className="font-medium text-gray-900">{listing.model}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Year</div>
            <div className="font-medium text-gray-900">{listing.year}</div>
          </div>
          {listing.mileage && (
            <div>
              <div className="text-sm text-gray-500">Mileage</div>
              <div className="font-medium text-gray-900">{listing.mileage} km</div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-600 whitespace-pre-line">{listing.description}</p>
        </div>

        {/* Location */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
          <p className="text-gray-600">📍 {listing.location}</p>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Seller</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">{listing.sellerName || 'Seller'}</div>
              <div className="text-sm text-gray-500">
                {showPhone ? listing.contactPhone : '••••••••••'}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPhone(!showPhone)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
              >
                {showPhone ? 'Hide' : 'Show'} Phone
              </button>
              
              {isAuthenticated && (
                <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Start Chat
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            I'm Interested
          </button>
          <button className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
            Share
          </button>
        </div>
      </div>

      {isAuthenticated && (
        <ChatBox listingId={listing.id} sellerId={listing.sellerId} />
      )}
    </div>
  );
};

export default ListingDetails;
