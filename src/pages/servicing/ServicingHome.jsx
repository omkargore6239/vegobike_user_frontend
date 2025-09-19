import React from 'react';
import HeroSection from '../../components/servicing/sections/HeroSection';
import ServicesSection from '../../components/servicing/sections/ServicesSection';
import QuoteForm from '../../components/servicing/forms/QuoteForm';
import ManufacturerSelector from '../../components/servicing/ManufacturerSelector';

const ServicingHome = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Quote Form */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <HeroSection />
            <QuoteForm />
          </div>
        </div>
      </section>

      {/* Manufacturers Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ManufacturerSelector />
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />
    </div>
  );
};

export default ServicingHome;
