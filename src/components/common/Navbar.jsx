// src/components/common/Navbar.jsx - Enhanced with better auth UI
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';

const Navbar = () => {
  const { user, isAuthenticated, logout, loading } = useAuth(); // ✅ Added isAuthenticated and loading
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // ✅ User dropdown menu

  const navigation = [
    { name: 'Rental', href: ROUTES.RENTAL, icon: '🚲' },
    { name: 'Servicing', href: ROUTES.SERVICING, icon: '🔧' },
    { name: 'Spare Parts', href: ROUTES.SPAREPARTS, icon: '🔩' },
    { name: 'Buy/Sell', href: ROUTES.BUYSELL, icon: '💰' },
  ];

  const handleLogout = async () => {
    console.log('🔐 NAVBAR - Logout initiated');
    try {
      await logout();
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);
      navigate('/');
      console.log('🔐 NAVBAR - Logout completed, redirected to home');
    } catch (error) {
      console.error('🔐 NAVBAR - Logout error:', error);
    }
  };

  // ✅ Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    return user.name || user.phoneNumber || user.email || 'User';
  };

  // ✅ Get user initials for avatar
  const getUserInitials = () => {
    const name = getUserDisplayName();
    if (name === 'Guest') return 'G';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              🚲 VegoBike
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname.startsWith(item.href)
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {loading ? (
                // ✅ Loading state
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading...</span>
                </div>
              ) : isAuthenticated && user ? (
                // ✅ Authenticated user menu
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 text-sm rounded-full bg-white text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    {/* User Avatar */}
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                      {getUserInitials()}
                    </div>
                    <span className="hidden lg:block font-medium">
                      {getUserDisplayName()}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50">
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">
                          {getUserDisplayName()}
                        </p>
                        {user.phoneNumber && (
                          <p className="text-sm text-gray-500">{user.phoneNumber}</p>
                        )}
                        {user.email && (
                          <p className="text-sm text-gray-500">{user.email}</p>
                        )}
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          👤 Profile
                        </Link>
                        <Link
                          to="/rental/my-bookings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          📋 My Bookings
                        </Link>
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          ⚙️ Settings
                        </Link>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // ✅ Non-authenticated user buttons
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    🔐 Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    ✨ Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t shadow-lg">
            {/* Mobile Navigation Links */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname.startsWith(item.href)
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {/* Mobile User Section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {loading ? (
                <div className="px-3 py-2 flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading...</span>
                </div>
              ) : isAuthenticated && user ? (
                // ✅ Mobile authenticated user menu
                <div className="space-y-2">
                  {/* User Info */}
                  <div className="px-3 py-2 bg-gray-50 rounded-lg mx-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                        {getUserInitials()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getUserDisplayName()}
                        </p>
                        {user.phoneNumber && (
                          <p className="text-xs text-gray-600">{user.phoneNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Menu Links */}
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    👤 Profile
                  </Link>
                  <Link
                    to="/rental/my-bookings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    📋 My Bookings
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ⚙️ Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              ) : (
                // ✅ Mobile non-authenticated user buttons
                <div className="space-y-2 px-2">
                  <Link
                    to="/login"
                    className="block w-full px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors text-center border border-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    🔐 Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-3 py-3 rounded-lg text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors text-center shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ✨ Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
