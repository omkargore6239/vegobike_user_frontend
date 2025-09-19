import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBuySell } from '../../context/BuySellContext';
import Modal from '../../components/common/Modal';

const MyListings = () => {
  const { myListings, updateListing, deleteListing } = useBuySell();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  const handleDeleteListing = () => {
    if (selectedListing) {
      deleteListing(selectedListing.id);
      setShowDeleteModal(false);
      setSelectedListing(null);
    }
  };

  const handleStatusToggle = (listing) => {
    const newStatus = listing.status === 'active' ? 'inactive' : 'active';
    updateListing(listing.id, { status: newStatus });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (myListings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Listings</h1>
          
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No listings yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first listing to start selling
            </p>
            <Link
              to="/buysell/post"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Listing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <Link
            to="/buysell/post"
            className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create New Listing
          </Link>
        </div>

        <div className="space-y-6">
          {myListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-48 h-48 md:h-auto">
                  <img
                    src={listing.images?.[0] || listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/200x200?text=Vehicle';
                    }}
                  />
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {listing.title}
                      </h3>
                      <p className="text-gray-600">{listing.brand} {listing.model} • {listing.year}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </span>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          ₹{listing.price?.toLocaleString()}
                        </div>
                        {listing.negotiable && (
                          <span className="text-sm text-gray-500">Negotiable</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Posted</div>
                      <div className="font-medium">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Views</div>
                      <div className="font-medium">{listing.views || 0}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Interested</div>
                      <div className="font-medium">{listing.interested || 0}</div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-medium text-sm">{listing.location}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <Link
                      to={`/buysell/listing/${listing.id}`}
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      View Listing
                    </Link>
                    
                    <button
                      onClick={() => handleStatusToggle(listing)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                    >
                      {listing.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                      Edit
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedListing(listing);
                        setShowDeleteModal(true);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>

                    {listing.status === 'active' && (
                      <button
                        onClick={() => updateListing(listing.id, { status: 'sold' })}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                      >
                        Mark as Sold
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Listing"
        >
          <div className="p-4">
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteListing}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default MyListings;
