import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBuySell } from '../../context/BuySellContext';
import { useAuth } from '../../context/AuthContext';
import ListingForm from '../../components/buysell/ListingForm';

const PostListing = () => {
  const navigate = useNavigate();
  const { addListing } = useBuySell();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      const listingData = {
        ...formData,
        sellerId: user.id,
        sellerName: user.name,
        sellerEmail: user.email,
      };

      const newListing = await addListing(listingData);
      navigate(`/buysell/listing/${newListing.id}`);
    } catch (error) {
      console.error('Failed to create listing:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Post Your Listing</h1>
          <p className="text-lg text-gray-600 mt-2">
            Sell your bike or car quickly by creating a detailed listing
          </p>
        </div>

        {/* Tips Section */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Tips for a successful listing:</h2>
          <ul className="space-y-2 text-blue-800">
            <li>• Add clear, high-quality photos from multiple angles</li>
            <li>• Write a detailed description highlighting key features</li>
            <li>• Set a competitive price based on market research</li>
            <li>• Be honest about the vehicle's condition</li>
            <li>• Include maintenance history and any recent repairs</li>
            <li>• Respond promptly to interested buyers</li>
          </ul>
        </div>

        {/* Listing Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <ListingForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Guidelines */}
        <div className="bg-gray-100 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Listing Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Do's:</h4>
              <ul className="space-y-1">
                <li>• Use original photos of your vehicle</li>
                <li>• Provide accurate information</li>
                <li>• Include all necessary documents</li>
                <li>• Keep your contact details updated</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Don'ts:</h4>
              <ul className="space-y-1">
                <li>• Use stock or fake images</li>
                <li>• Misrepresent vehicle condition</li>
                <li>• Include personal information in photos</li>
                <li>• Post duplicate listings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostListing;
