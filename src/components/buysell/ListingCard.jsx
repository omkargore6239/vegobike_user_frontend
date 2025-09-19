import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const timeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={listing.images?.[0] || listing.image}
          alt={listing.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x200?text=Vehicle+Image';
          }}
        />
        
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
            {listing.type}
          </span>
        </div>
        
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
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

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {listing.title}
          </h3>
          <span className="text-xs text-gray-500">{timeAgo(listing.createdAt)}</span>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
            {listing.brand}
          </span>
          <span className="text-sm text-gray-600">{listing.year}</span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {listing.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-primary">₹{listing.price?.toLocaleString()}</span>
            {listing.negotiable && (
              <span className="text-sm text-gray-500 ml-2">Negotiable</span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            📍 {listing.location}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {listing.views || 0} views
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {listing.interested || 0} interested
          </div>
        </div>

        <Link
          to={`/buysell/listing/${listing.id}`}
          className="block w-full text-center bg-primary text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ListingCard;
