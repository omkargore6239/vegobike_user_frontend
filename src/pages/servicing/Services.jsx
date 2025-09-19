// src/pages/Services.jsx
import React from 'react';
import PageLayout from '../../components/servicing/layout/PageLayout';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      title: "Basic Service",
      description: "Includes general check-up, cleaning, and basic adjustments to keep your bike running smoothly.",
      path: "/services/basic"
    },
    {
      title: "Premium Service",
      description: "Comprehensive servicing including brake adjustments, gear tuning, and drivetrain cleaning.",
      path: "/services/premium"
    },
    {
      title: "Repair Services",
      description: "Expert repairs for any bike issues, from flat tires to complex mechanical problems.",
      path: "/services/repairs"
    },
    {
      title: "Wheel & Tire Care",
      description: "Professional wheel alignment, tire replacement, and tube repairs.",
      path: "/services/wheels"
    },
    {
      title: "Detailing Services",
      description: "Deep cleaning and polishing to keep your bike looking brand new.",
      path: "/services/detailing"
    },
    {
      title: "Custom Upgrades",
      description: "Performance enhancements and personalized bike modifications.",
      path: "/services/upgrades"
    }
  ];

  return (
    <PageLayout>
      <div className="responsive-padding bg-background min-h-[calc(100vh-160px)]">
        <div className="container mx-auto py-8 md:py-12">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="h1 mb-4">Our Bike Services</h1>
            <p className="text-subText max-w-2xl mx-auto text-lg">
              We provide a range of professional bike servicing and repair options to keep your bike in top condition.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
            {services.map((service) => (
              <Link
                key={service.title}
                to={service.path}
                className="card hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-accent/20 rounded-xl overflow-hidden"
              >
                <div className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-accent rounded-full" />
                    <h3 className="h4 text-gray-900 group-hover:text-accent transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-subText leading-relaxed text-left">
                    {service.description}
                  </p>
                  <div className="pt-4 text-accent font-medium flex items-center gap-2">
                    Learn More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Services;