// src/components/sections/HeroSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useScrollPosition from '../../../hooks/useScrollPosition';

const HeroSection = () => {
  const scrollPosition = useScrollPosition();

  return (
    <section className="bg-background">
      <div className={`transition-opacity duration-500 ${
        scrollPosition > 100 ? 'opacity-50' : 'opacity-100'
      }`}>
        {/* Mobile View */}
        <div className="md:hidden p-4 py-8">
          <h1 className="h1 mb-4">Bike Services Available In Pune</h1>
          <p className="text-subText mb-6">
            Get affordable and hassle-free bicycle servicing, repairs, parts replacement, 
            and much more at your doorstep.
          </p>
          <div className="flex flex-col gap-4">
            <button className="btn btn-primary px-8 py-3 text-lg">
              Book Service Now
            </button>
            <Link to="/services" className="btn btn-secondary px-8 py-3 text-lg">
              View Services
            </Link>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block responsive-padding">
          <div className="container mx-auto 12">
            {/* Left Column - Content */}
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="h1">Professional Bike Services</h1>
              <h2 className="h2">At Your Doorstep</h2>
              <p className="text-subText max-w-2xl mx-auto lg:mx-0">
                Expert bike repairs, maintenance, and service with quality parts and transparent pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="btn btn-primary px-8 py-3 text-lg">
                  Book Service Now
                </button>
                <Link 
                  to="/services" 
                  className="btn btn-secondary px-8 py-3 text-lg"
                >
                  View Services
                </Link>
              </div>
            </div>

         
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;