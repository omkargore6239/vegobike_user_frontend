import React from 'react';

const RentalDetails = ({ bike }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <img
          src={bike.image}
          alt={bike.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x250?text=Bike+Image';
          }}
        />
        
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">{bike.name}</h2>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-gray-600">{bike.rating}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            {bike.brand}
          </span>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {bike.type}
          </span>
        </div>

        <div className="text-3xl font-bold text-primary mb-4">
          ₹{bike.price}/day
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
        <div className="grid grid-cols-2 gap-2">
          {bike.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
        <p className="text-gray-600">📍 {bike.location}</p>
      </div>

      <div className="text-sm text-gray-500">
        <p className="mb-1">• Valid driving license required</p>
        <p className="mb-1">• Security deposit: ₹2000</p>
        <p>• Free cancellation up to 24 hours</p>
      </div>
    </div>
  );
};

export default RentalDetails;
