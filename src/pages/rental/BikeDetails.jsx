import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRental } from '../../context/RentalContext';
import { useAuth } from '../../context/AuthContext';

const BikeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { availableBikes } = useRental();
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);

  const bike = availableBikes.find(b => b.id === parseInt(id));

  if (!bike) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bike not found</h2>
          <Link to="/rental" className="text-primary hover:underline">
            Back to rentals
          </Link>
        </div>
      </div>
    );
  }

  const images = [bike.image, bike.image, bike.image]; // Mock multiple images

  const handleBookNow = () => {
    if (isAuthenticated) {
      navigate(`/rental/booking/${bike.id}`);
    } else {
      navigate('/login', { state: { from: { pathname: `/rental/booking/${bike.id}` } } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/rental" className="text-gray-500 hover:text-gray-700">
                Rentals
              </Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">{bike.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
              <img
                src={images[selectedImage]}
                alt={bike.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Bike+Image';
                }}
              />
            </div>
            
            {/* Thumbnail Images */}
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
                    alt={`${bike.name} view ${index + 1}`}
                    className="w-full h-24 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x80?text=Bike';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{bike.name}</h1>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-gray-600">{bike.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {bike.brand}
                </span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {bike.type}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Available
                </span>
              </div>

              <div className="text-3xl font-bold text-primary mb-6">
                ₹{bike.price}/day
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {bike.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pickup Location</h3>
              <p className="text-gray-600">📍 {bike.location}</p>
            </div>

            {/* Booking Section */}
            <div className="border-t pt-6">
              <button
                onClick={handleBookNow}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {isAuthenticated ? 'Book Now' : 'Login to Book'}
              </button>
              
              <p className="text-sm text-gray-500 mt-2 text-center">
                Free cancellation up to 24 hours before pickup
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Terms</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Valid driving license required</li>
              <li>• Minimum age: 18 years</li>
              <li>• Security deposit: ₹2000</li>
              <li>• Fuel not included</li>
              <li>• Late return charges apply</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Helmet (2 pieces)</li>
              <li>• Basic insurance</li>
              <li>• 24/7 roadside assistance</li>
              <li>• Free pickup & drop</li>
              <li>• Sanitized bike</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Policies</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• No smoking in vehicle</li>
              <li>• Return with same fuel level</li>
              <li>• Report damages immediately</li>
              <li>• Follow traffic rules</li>
              <li>• Maximum 200km/day included</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeDetails;
