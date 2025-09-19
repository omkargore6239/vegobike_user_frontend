import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
          {service.category}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{service.description}</p>

      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-2xl font-bold text-primary">₹{service.price}</span>
        </div>
        <div className="text-sm text-gray-500">
          {service.duration}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-2">Includes:</h4>
        <ul className="space-y-1">
          {service.includes.slice(0, 3).map((item, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <span className="text-green-500 mr-2">✓</span>
              {item}
            </li>
          ))}
          {service.includes.length > 3 && (
            <li className="text-sm text-gray-500">+{service.includes.length - 3} more</li>
          )}
        </ul>
      </div>

      <Link
        to={`/servicing/service/${service.id}`}
        className="block w-full text-center bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
};

export default ServiceCard;
