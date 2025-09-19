// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useScrollPosition from "../../../hooks/useScrollPosition";
import appLogo from "../../../assets/app_logo.png";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const scrollPosition = useScrollPosition();
  const { pathname, state } = useLocation();

  // Get store location from navigation state
  const storeLocation = state?.storeLocation || 'Downtown Store';
  const isServicePackagesPage = pathname === "/service-packages";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };


  return (
    <nav className={`bg-white shadow-sm transition-all duration-300 ${
      scrollPosition > 50 ? 'sticky top-0 z-50 shadow-lg backdrop-blur-sm bg-white/90' : ''
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Store Location */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2" onClick={closeAllMenus}>
              <img 
                src={appLogo} 
                alt="App Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-primary">VEGO Bike</span>
            </Link>
            
            {/* Updated store location display */}
            {isServicePackagesPage && (
              <div className="flex items-center gap-2 ml-4 bg-gray-100 py-1 px-3 rounded-full">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-accent" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
                <span className="font-medium capitalize">{storeLocation}</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/cart">
              <div className="flex items-center gap-1">
                <span>Cart</span>
              </div>
            </NavLink>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="text-gray-700 hover:text-accent font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-accent after:transition-all hover:after:w-full"
              >
                <div className="flex items-center gap-1">
                  <span>Profile</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
                  <ProfileLink to="/booking-history">Booking History</ProfileLink>
                  <ProfileLink to="/service-history">Service History</ProfileLink>
                  <ProfileLink to="/account">Account</ProfileLink>
                  <hr className="border-gray-200 my-2" />
                  <ProfileLink to="/terms">Terms & Conditions</ProfileLink>
                  <ProfileLink to="/refund">Refund Policies</ProfileLink>
                  <hr className="border-gray-200 my-2" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50">
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Login Button */}
            <Link 
              to="/login" 
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-text hover:text-accent hover:bg-gray-50 focus:outline-none transition-colors"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`h-6 w-6 transform transition-transform ${isMenuOpen ? 'rotate-90' : 'rotate-0'}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>  
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
            <div className="md:hidden bg-white shadow-lg animate-slideDown">
              <div className="px-2 pt-2 pb-4 space-y-1">
                {/* Updated mobile store location */}
                {isServicePackagesPage && (
                  <div className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-primary" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                        />
                      </svg>
                      <span className="font-medium capitalize">{storeLocation}</span>
                    </div>
                    <button className="text-accent text-sm underline">Change</button>
                  </div>
                )}    
            <MobileNavLink to="/" onClick={closeAllMenus}>Home</MobileNavLink>
            <MobileNavLink to="/services" onClick={closeAllMenus}>Services</MobileNavLink>
            <MobileNavLink to="/cart" onClick={closeAllMenus}>
              <div className="flex items-center gap-1">
                <span>Cart</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </div>
            </MobileNavLink>

            {/* Mobile Profile Section */}
            <div>
              <button
                onClick={toggleProfile}
                className="flex justify-between w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-accent hover:bg-gray-50 transition-colors mx-2"
              >
                <span>Profile</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <div className="bg-gray-50 rounded-lg mt-1 py-1 mx-2">
                  <ProfileLink to="/booking-history" mobile>Booking History</ProfileLink>
                  <ProfileLink to="/service-history" mobile>Service History</ProfileLink>
                  <ProfileLink to="/account" mobile>Account</ProfileLink>
                  <hr className="border-gray-200 my-1" />
                  <ProfileLink to="/terms" mobile>Terms & Conditions</ProfileLink>
                  <ProfileLink to="/refund" mobile>Refund Policies</ProfileLink>
                  <hr className="border-gray-200 my-1" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
            
            {/* Login Button for Mobile */}
            <div className="px-2 pt-2">
              <Link 
                to="/login" 
                className="block w-full bg-primary text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-accent/90 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Reusable NavLink component
const NavLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-gray-700 hover:text-accent font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-accent after:transition-all hover:after:w-full"
  >
    {children}
  </Link>
);

// Reusable MobileNavLink component
const MobileNavLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-accent hover:bg-gray-50 transition-colors mx-2"
  >
    {children}
  </Link>
);

// Profile link component
const ProfileLink = ({ to, children, mobile }) => (
  <Link
    to={to}
    className={`block ${
      mobile ? 'px-4 py-2 text-sm' : 'px-4 py-2 text-sm'
    } text-gray-600 hover:text-accent hover:bg-gray-50 transition-colors`}
  >
    {children}
  </Link>
);

export default Navbar;