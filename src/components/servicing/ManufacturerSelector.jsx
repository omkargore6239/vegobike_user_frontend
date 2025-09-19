import React from 'react';
import { manufacturers } from '../../data/manufacturers';

const ManufacturerSelector = () => {
  return (
    <div className="bg-white rounded-xl p-8">
      <h2 className="text-2xl font-bold text-center mb-8">Select Manufacturer</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {manufacturers.map((manufacturer) => (
          <div
            key={manufacturer.name}
            className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-colors group"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
              <img
                src={manufacturer.logo}
                alt={manufacturer.name}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="font-bold text-lg hidden">
                {manufacturer.name.charAt(0)}
              </span>
            </div>
            <span className="text-sm font-medium text-center">
              {manufacturer.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManufacturerSelector;
