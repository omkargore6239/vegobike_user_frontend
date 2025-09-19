// src/components/sections/ServicesSection.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useScrollPosition from '../../../hooks/useScrollPosition';

const ServicesSection = () => {
  const [visible, setVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const testimonialRef = useRef(null);
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    if (scrollPosition > 300 && !visible) {
      setVisible(true);
    }
  }, [scrollPosition, visible]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, );

  const allServices = [
    { id: 1, name: 'Basic Service', icon: '🔧', description: 'Essential maintenance for your bike' },
    { id: 2, name: 'Premium Service', icon: '⚙️', description: 'Complete overhaul and tune-up' },
    { id: 3, name: 'Repair Services', icon: '🛠️', description: 'Fix specific issues and damages' },
    { id: 4, name: 'Wheel & Tire Care', icon: '🚲', description: 'Alignment, balancing, and repairs' },
    { id: 5, name: 'Detailing Services', icon: '✨', description: 'Make your bike look brand new' },
    { id: 6, name: 'Bike Spa & Cleaning', icon: '🧼', description: 'Deep cleaning and polishing' },
    { id: 7, name: 'Bike Inspections', icon: '🔍', description: 'Thorough safety and performance checks' },
    { id: 8, name: 'Suspension & Fitments', icon: '🔧', description: 'Custom adjustments for comfort' },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Aditya Sharma',
      location: 'Kothrud, Pune',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/men/32.jpg', // Replace with your image paths
      text: 'The premium service package completely transformed my old mountain bike. It now feels brand new, and the team even fixed issues I didn\'t know existed. Highly recommend VEGO for serious cyclists!'
    },
    {
      id: 2,
      name: 'Priya Desai',
      location: 'Baner, Pune',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: 'I\'ve tried several bike services in Pune, but VEGO Bike stands out with their attention to detail and expert knowledge. My racing bike has never performed better after their tune-up service.'
    },
    {
      id: 3,
      name: 'Rahul Patil',
      location: 'Viman Nagar, Pune',
      rating: 4,
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      text: 'Quick, efficient and professional service. The pickup and delivery option saved me so much time. The mechanics explained everything they did and gave me helpful tips to maintain my bike.'
    },
    {
      id: 4,
      name: 'Sneha Joshi',
      location: 'Shivajinagar, Pune',
      rating: 5,
      image: 'https://randomuser.me/api/portraits/women/29.jpg',
      text: 'As a weekend cyclist, I was worried about being overcharged, but VEGO was transparent with pricing and only recommended services I actually needed. My bike rides smoother than ever!'
    }
  ];

  const handleTestimonialNav = (index) => {
    setActiveTestimonial(index);
    if (testimonialRef.current) {
      testimonialRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Generate star rating display
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <svg 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor" 
        viewBox="0 0 20 20" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <>
      {/* Services Section */}
      <section className={`responsive-padding bg-white py-12 transform transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="h2 mb-4">Bike Services Available In Pune</h2>
            <p className="text-subText max-w-2xl mx-auto">
              Get affordable and hassle-free bicycle servicing, repairs, parts replacement, and much more at VEGO Bike.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
            {allServices.map((service) => (
              <Link 
                to="/services" 
                key={service.id} 
                className="card hover:shadow-md hover:scale-105 transition-all duration-300 p-4 md:p-6 rounded-lg bg-gray-50"
              >
                <div className="flex flex-col items-center">
                  <span className="text-4xl md:text-5xl mb-4">{service.icon}</span>
                  <h3 className="text-sm md:text-base font-medium text-text text-center mb-2">
                    {service.name}
                  </h3>
                  <p className="text-xs text-gray-500 text-center hidden md:block">
                    {service.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Service Stats Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-accent mb-2">5000+</h3>
              <p className="text-sm text-gray-600">Happy Customers</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-accent mb-2">25+</h3>
              <p className="text-sm text-gray-600">Service Centers</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-accent mb-2">4.8</h3>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-accent mb-2">15+</h3>
              <p className="text-sm text-gray-600">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialRef} className="responsive-padding bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="h2 mb-4">What Our Customers Say</h2>
            <p className="text-subText max-w-2xl mx-auto">
              Hear from our satisfied customers about their experience with VEGO Bike services.
            </p>
          </div>

          {/* Testimonial Card */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4 flex flex-col items-center">
                  <img 
                    src={testimonials[activeTestimonial].image} 
                    alt={testimonials[activeTestimonial].name}
                    className="w-20 h-20 rounded-full object-cover mb-3"
                  />
                  <h4 className="font-semibold text-center">
                    {testimonials[activeTestimonial].name}
                  </h4>
                  <p className="text-sm text-gray-500 text-center">
                    {testimonials[activeTestimonial].location}
                  </p>
                  <div className="flex mt-2">
                    {renderStars(testimonials[activeTestimonial].rating)}
                  </div>
                </div>

                <div className="md:w-3/4">
                  <svg className="text-accent h-8 w-8 mb-4 opacity-50" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"></path>
                  </svg>
                  <p className="text-gray-700 italic">
                    {testimonials[activeTestimonial].text}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleTestimonialNav(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeTestimonial === index ? 'bg-accent w-6' : 'bg-gray-300'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Link 
              to="/services" 
              className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-2"
            >
              Book a Service Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesSection;