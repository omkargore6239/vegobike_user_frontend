import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBuySell } from '../../context/BuySellContext';
import ListingDetails from '../../components/buysell/ListingDetails';

const ListingDetail = () => {
  const { id } = useParams();
  const { listings } = useBuySell();

  const listing = listings.find(l => l.id === parseInt(id));

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h2>
          <Link to="/buysell" className="text-primary hover:underline">
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link to="/buysell" className="text-gray-500 hover:text-gray-700">
                Buy/Sell
              </Link>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">{listing.title}</span>
            </li>
          </ol>
        </nav>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ListingDetails listing={listing} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Listings</h3>
              
              {/* Mock similar listings */}
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <img
                      src="https://via.placeholder.com/60x60?text=Vehicle"
                      alt="Similar vehicle"
                      className="w-15 h-15 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">Similar Vehicle {item}</h4>
                      <p className="text-xs text-gray-500">2020 • Good condition</p>
                      <p className="text-sm font-semibold text-primary">₹45,000</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Safety Tips</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Meet in a public place</li>
                  <li>• Inspect the vehicle thoroughly</li>
                  <li>• Verify all documents</li>
                  <li>• Take a test drive</li>
                  <li>• Get a mechanic's opinion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
