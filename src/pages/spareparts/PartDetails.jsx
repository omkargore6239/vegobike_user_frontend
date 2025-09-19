import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSpareparts } from '../../context/SparepartsContext';

const PartDetails = () => {
  const { id } = useParams();
  const { spareparts, addToCart } = useSpareparts();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const part = spareparts.find(p => p.id === parseInt(id));

  if (!part) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Part not found</h2>
          <Link to="/spareparts" className="text-primary hover:underline">
            Back to spare parts
          </Link>
        </div>
      </div>
    );
  }

  const images = [part.image, part.image, part.image]; // Mock multiple images
  const discountPercent = part.originalPrice 
    ? Math.round(((part.originalPrice - part.price) / part.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(part, quantity);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/spareparts" className="text-gray-500 hover:text-gray-700">
                Spare Parts
              </Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">{part.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
              <img
                src={images[selectedImage]}
                alt={part.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=Part+Image';
                }}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-white rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${part.name} view ${index + 1}`}
                    className="w-full h-24 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=Part';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{part.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{part.brand}</p>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-4">
                  <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-gray-600 mr-1">{part.rating}</span>
                  <span className="text-gray-500">({part.reviews} reviews)</span>
                </div>
                
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {part.category}
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{part.price}</span>
                {part.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">₹{part.originalPrice}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              <div className={`mb-6 ${part.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {part.inStock ? '✓ In Stock' : '✗ Out of Stock'}
              </div>
            </div>

            {/* Compatibility */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Compatible with</h3>
              <div className="flex flex-wrap gap-2">
                {part.compatibility.map((brand, index) => (
                  <span key={index} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-16 text-center font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!part.inStock}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {part.inStock ? `Add to Cart - ₹${part.price * quantity}` : 'Out of Stock'}
              </button>
              
              <button className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Add to Wishlist
              </button>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              <p className="mb-2">• Free delivery on orders above ₹500</p>
              <p className="mb-2">• 30-day return policy</p>
              <p>• Genuine parts with warranty</p>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              This high-quality {part.name} from {part.brand} is designed to provide optimal performance 
              and durability for your vehicle. Made with premium materials and precision engineering, 
              this part ensures reliable operation and long-lasting service.
            </p>
            <p className="mb-4">
              Compatible with multiple {part.compatibility.join(', ')} models, this part offers 
              excellent value for money and comes with manufacturer warranty for peace of mind.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Key Features:</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Premium quality materials</li>
              <li>Perfect fit and finish</li>
              <li>Easy installation</li>
              <li>Manufacturer warranty included</li>
              <li>Tested for quality and performance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartDetails;
