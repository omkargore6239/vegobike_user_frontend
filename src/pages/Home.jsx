import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Color palette (assuming common bike service app colors)
  const colors = {
    primary: '#1E40AF',      // Deep blue
    secondary: '#7C3AED',    // Purple
    accent: '#F59E0B',       // Amber
    success: '#10B981',      // Emerald
    danger: '#EF4444',       // Red
    warning: '#F59E0B',      // Amber
    info: '#3B82F6',         // Blue
    dark: '#1F2937',         // Gray-800
    light: '#F9FAFB',        // Gray-50
  };

  const services = [
    {
      name: 'Bike Rental',
      description: 'Premium bikes for daily commute and adventures. Flexible hourly and daily rental options with free delivery.',
      icon: '🏍️',
      link: '/search',
      gradient: `from-blue-500 to-blue-700`,
      bgColor: 'bg-blue-500',
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: ['Hourly & Daily Rentals', 'Premium Fleet', 'Free Delivery'],
      color: colors.primary
    },
    {
      name: 'Professional Servicing',
      description: 'Expert maintenance and repair services with certified technicians and doorstep service available.',
      icon: '🔧',
      link: '/servicing',
      gradient: `from-emerald-500 to-emerald-700`,
      bgColor: 'bg-emerald-500',
      image: 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: ['Doorstep Service', 'Certified Technicians', '6 Month Warranty'],
      color: colors.success
    },
    {
      name: 'Genuine Spare Parts',
      description: 'Original parts for all bike models with fast delivery and quality guarantee. 30-day return policy.',
      icon: '⚙️',
      link: '/spareparts',
      gradient: `from-amber-500 to-orange-600`,
      bgColor: 'bg-amber-500',
      image: 'https://images.unsplash.com/photo-1558347796-b22dcdf61b7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: ['Original Parts', 'Fast Delivery', '30-Day Returns'],
      color: colors.accent
    },
    {
      name: 'Buy & Sell',
      description: 'Trade pre-owned bikes and cars with verified listings and best market prices. Easy and secure process.',
      icon: '🏪',
      link: '/buysell',
      gradient: `from-purple-500 to-purple-700`,
      bgColor: 'bg-purple-500',
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      features: ['Verified Listings', 'Best Prices', 'Easy Process'],
      color: colors.secondary
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with 4 Service Cards */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 min-h-screen">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                VegoBike
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 font-light mb-12 max-w-4xl mx-auto">
              Your one-stop solution for all vehicle needs
            </p>
            
            
          </div>

          {/* 4 Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Link
                key={service.name}
                to={service.link}
                className="group relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden transform hover:-translate-y-6 hover:rotate-1"
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-90 group-hover:opacity-95 transition-opacity duration-300`}></div>
                  
                  {/* Icon */}
                  <div className="absolute top-6 right-6">
                    <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <span className="text-4xl filter drop-shadow-lg">{service.icon}</span>
                    </div>
                  </div>

                  {/* Service Number */}
                  <div className="absolute top-6 left-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                    {service.description}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm font-medium text-gray-700">
                        <div 
                          className="w-2 h-2 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"
                          style={{ backgroundColor: service.color }}
                        ></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center font-bold group-hover:text-purple-600 transition-colors duration-300" style={{ color: service.color }}>
                    Explore Now
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/5 group-hover:via-purple-600/5 group-hover:to-pink-600/5 transition-all duration-500 pointer-events-none rounded-3xl"></div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20">
            <p className="text-white/80 text-lg mb-6">
              Trusted by 50,000+ customers across 25+ cities
            </p>
            <div className="flex justify-center space-x-8">
              {[
                { number: "50K+", label: "Customers" },
                { number: "25+", label: "Cities" },
                { number: "1000+", label: "Vehicles" },
                { number: "24/7", label: "Support" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.number}
                  </div>
                  <div className="text-white/70 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/60 rounded-full flex justify-center backdrop-blur-sm bg-white/10">
            <div className="w-1 h-4 bg-white rounded-full mt-3 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span style={{ color: colors.primary }}>VegoBike</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing exceptional service and value
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "⚡",
                title: "Lightning Fast",
                description: "Quick service delivery with real-time tracking and instant booking confirmation.",
                color: colors.accent
              },
              {
                icon: "🛡️",
                title: "100% Secure",
                description: "Advanced security measures and verified professionals ensure your complete safety.",
                color: colors.success
              },
              {
                icon: "💎",
                title: "Premium Quality",
                description: "Top-grade vehicles and genuine parts with comprehensive warranty coverage.",
                color: colors.secondary
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl"
                  style={{ backgroundColor: feature.color }}
                >
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
