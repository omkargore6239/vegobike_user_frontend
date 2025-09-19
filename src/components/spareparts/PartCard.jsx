import React from 'react';
import { Link } from 'react-router-dom';
import { useSpareparts } from '../../context/SparepartsContext';

const PartCard = ({ part }) => {
  const { addToCart } = useSpareparts();

  const handleAddToCart = () => {
    addToCart(part);
  };

  const discountPercent = part.originalPrice 
    ? Math.round(((part.originalPrice - part.price) / part.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={part.image}
          alt={part.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Part+Image';
          }}
        />
        
        {!part.inStock && (
          <div className="absolute top-4 right-4">
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Out of Stock
            </span>
          </div>
        )}

        {discountPercent > 0 && (
          <div className="absolute top-4 left-4">
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {discountPercent}% OFF
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{part.name}</h3>
          <p className="text-sm text-gray-600">{part.brand}</p>
        </div>

        <div className="flex items-center mb-3">
          <div className="flex items-center mr-4">
            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm text-gray-600">{part.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({part.reviews})</span>
          </div>
          
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
            {part.category}
          </span>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">₹{part.price}</span>
            {part.originalPrice && (
              <span className="text-lg text-gray-500 line-through">₹{part.originalPrice}</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">Compatible with:</div>
          <div className="flex flex-wrap gap-1">
            {part.compatibility.slice(0, 2).map((brand, index) => (
              <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                {brand}
              </span>
            ))}
            {part.compatibility.length > 2 && (
              <span className="text-xs text-gray-500">+{part.compatibility.length - 2}</span>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/spareparts/part/${part.id}`}
            className="flex-1 text-center bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            View Details
          </Link>
          
          <button
            onClick={handleAddToCart}
            disabled={!part.inStock}
            className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {part.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartCard;
