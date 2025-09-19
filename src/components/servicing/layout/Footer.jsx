import { ChevronRight, ChevronDown, Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin, Award, Star, User, ChevronUp, Smartphone, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const serviceFeatures = [
    { name: 'Genuine Parts', icon: '/images/banner/genuineParts.png', description: 'Original manufacturer certified parts' },
    { name: 'Warranty', icon: '/images/banner/warranty.png', description: 'Extended warranty options available' },
    { name: 'Affordable', icon: '/images/banner/affordable.png', description: 'Best prices guaranteed' }
  ];

  const quickLinks = [
    { name: 'About Us', url: '#' },
    { name: 'Contact', url: '#' },
    { name: 'Careers', url: '#' },
    { name: 'Blog', url: '#' },
    { name: 'Dealerships', url: '#' },
    { name: 'Test Rides', url: '#' },
    { name: 'Terms & Conditions', url: '#' },
    { name: 'Privacy Policy', url: '#' }
  ];

  const awards = [
    { name: 'Best Motorcycle Blog 2024', icon: <Award size={18} /> },
    { name: 'Top Industry Resource', icon: <Award size={18} /> },
    { name: 'Excellence in Customer Service', icon: <Award size={18} /> }
  ];

  return (
    <footer className="bg-gray-900 text-white relative">
      {/* Service Features Banner */}
      <div className="bg-blue-900 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8 lg:space-x-16">
            {serviceFeatures.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center px-4 w-full md:w-auto">
                <img src={feature.icon} alt={feature.name} className="w-12 h-12 object-contain mb-2" />
                <h4 className="text-white font-medium">{feature.name}</h4>
                <p className="text-gray-300 text-xs md:text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4">MotoExplorer</h3>
              <p className="text-gray-400 mb-4">Your ultimate destination for motorcycle information, reviews, and buying guides.</p>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Youtube size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Linkedin size={20} />
                </a>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-gray-400" />
                  <span className="text-gray-400">contact@vegobike.in</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  <span className="text-gray-400">+91 9960480247</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  <span className="text-gray-400">Office No. 209, Zen Business Center, near IBMR College, Shankar Kalat Nagar, Wakad, Pune, Pimpri-Chinchwad, Maharashtra 411057</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-gray-400 hover:text-white hover:underline flex items-center">
                      <ChevronRight size={16} className="mr-1" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Accessibility Statement */}
              <div className="mt-6">
                <a href="#" className="flex items-center text-gray-400 hover:text-white group">
                  <FileText size={16} className="mr-2" />
                  <span className="group-hover:underline">Accessibility Statement</span>
                </a>
                <p className="text-gray-500 text-sm mt-1">We are committed to making our website accessible to everyone.</p>
              </div>
            </div>

            {/* App Download & Awards */}
            <div>
              <h3 className="text-lg font-bold mb-4">Mobile App</h3>
              <p className="text-gray-400 mb-3">Download our app for the best experience on the go.</p>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
                <a href="#" className="flex items-center bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded transition-colors">
                  <Smartphone size={18} className="mr-2" />
                  <div>
                    <div className="text-xs">Download on the</div>
                    <div className="font-medium">App Store</div>
                  </div>
                </a>
                <a href="#" className="flex items-center bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded transition-colors">
                  <Smartphone size={18} className="mr-2" />
                  <div>
                    <div className="text-xs">Get it on</div>
                    <div className="font-medium">Google Play</div>
                  </div>
                </a>
              </div>

              {/* Awards */}
              <h3 className="text-lg font-bold mb-3">Our Recognition</h3>
              <ul className="space-y-2">
                {awards.map((award, index) => (
                  <li key={index} className="flex items-center text-gray-400">
                    <span className="text-yellow-400 mr-2">{award.icon}</span>
                    {award.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Testimonials */}
            <div>
              <h3 className="text-lg font-bold mb-4">Stay Updated</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest motorcycle news and offers.</p>
              <div className="flex mb-6">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-700 px-4 py-2 rounded-l-lg flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr className='border-gray-700'></hr>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-2 md:mb-0">© 2023  All rights reserved By <b>VE GO BIKE PRIVATE LIMITED</b></p>
          <div className="flex flex-wrap justify-center space-x-4">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 z-50 hidden md:block"
          aria-label="Back to top"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </footer>
  );
};

export default Footer;
