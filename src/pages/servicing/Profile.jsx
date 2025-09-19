// src/pages/Profile.jsx
import React from 'react';
import PageLayout from '../../components/servicing/layout/PageLayout';
import { Link } from 'react-router-dom';

const Profile = () => {
  return (
    <PageLayout>
      <div className="responsive-padding bg-background min-h-[calc(100vh-160px)]">
        <div className="container mx-auto max-w-3xl py-8 md:py-12">
          <h1 className="h1 mb-6 md:mb-8">Your Profile</h1>
          
          <div className="card p-6 md:p-8">
            {/* Profile Header */}
            <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-secondary rounded-full h-12 w-12 md:h-16 md:w-16 flex items-center justify-center">
                <span className="text-2xl md:text-3xl">👤</span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-text">User Name</h2>
                <p className="text-subText">user@example.com</p>
              </div>
            </div>

            {/* Account Information */}
            <div className="border-t border-subText/20 pt-6 md:pt-8">
              <h3 className="h4 mb-4 md:mb-6">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <InfoItem label="Email" value="user@example.com" />
                <InfoItem label="Phone" value="+91 98765 43210" />
                <InfoItem label="Location" value="Pune, Maharashtra" />
                <InfoItem label="Member Since" value="January 2023" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4">
              <Link 
                to="/edit-profile" 
                className="btn btn-primary px-6 py-3 text-sm md:text-base flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </Link>
              <button className="btn btn-secondary px-6 py-3 text-sm md:text-base">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

// Reusable InfoItem component
const InfoItem = ({ label, value }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 bg-secondary/30 rounded-lg">
    <span className="text-subText text-sm md:text-base">{label}:</span>
    <span className="text-text font-medium text-sm md:text-base">{value}</span>
  </div>
);

export default Profile;