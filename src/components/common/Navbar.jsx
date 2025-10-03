// components/common/Navbar.jsx - Fixed infinite loop + Profile in navbar
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { STORAGE_KEYS } from '../../utils/constants';
import { 
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user: contextUser, isAuthenticated, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ FIXED: Removed Rental from navigation
  const navigation = [
    { name: 'Servicing', href: '/servicing', icon: '🔧' },
    { name: 'Spare Parts', href: '/spareparts', icon: '🔩' },
    { name: 'Buy/Sell', href: '/buysell', icon: '💰' },
  ];

  // ✅ FIXED: Load user data ONCE on mount and when context changes (no interval)
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
        } else if (contextUser) {
          setCurrentUser(contextUser);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        setCurrentUser(contextUser);
      }
    };

    loadUserFromStorage();
  }, [contextUser, isAuthenticated]); // ✅ Only reload when context changes

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setCurrentUser(null);
      navigate('/');
    }
  };

  // ✅ Get user display name
  const getUserDisplayName = () => {
    const user = currentUser || contextUser;
    if (!user) return 'Guest';
    if (user.name && user.name.trim() && user.name !== 'User') {
      return user.name.trim();
    }
    if (user.phoneNumber) {
      return user.phoneNumber;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // ✅ Get user initials for avatar
  const getUserInitials = () => {
    const user = currentUser || contextUser;
    const displayName = getUserDisplayName();
    
    if (displayName === 'Guest' || displayName === 'User') return 'U';
    
    const words = displayName.split(' ').filter(w => w.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    
    return displayName.substring(0, 2).toUpperCase();
  };

  // ✅ Get user profile image
  const getUserProfileImage = () => {
    const user = currentUser || contextUser;
    return user?.profile || user?.profileImage || null;
  };

  const user = currentUser || contextUser;
  const profileImage = getUserProfileImage();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="text-2xl font-bold text-indigo-600 group-hover:text-indigo-700 transition-colors duration-200 flex items-center">
              <span className="text-3xl mr-2">🚲</span>
              VegoBike
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                  location.pathname.startsWith(item.href)
                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-105'
                }`}
              >
                <span className="mr-2 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side - Profile or Login */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Loading...</span>
              </div>
            ) : isAuthenticated && user ? (
              <>
                {/* ✅ Profile Link - Directly visible */}
                <Link
                  to="/profile"
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/profile'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {/* Profile Avatar */}
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover border-2 border-indigo-200"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {getUserInitials()}
                    </div>
                  )}
                  
                  {/* User Name */}
                  <span className="font-medium max-w-32 truncate">
                    {getUserDisplayName()}
                  </span>
                  
                  <UserIcon className="h-5 w-5" />
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200 hover:border-red-300 transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-300 hover:border-indigo-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            
            {/* Mobile Navigation Links */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  location.pathname.startsWith(item.href)
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {/* Mobile User Section */}
            <div className="pt-4 border-t border-gray-200">
              {loading ? (
                <div className="px-4 py-3 flex items-center space-x-2">
                  <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span className="text-gray-600">Loading...</span>
                </div>
              ) : isAuthenticated && user ? (
                <div className="space-y-2">
                  
                  {/* ✅ Mobile Profile Link */}
                  <Link
                    to="/profile"
                    className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === '/profile'
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover border-2 border-indigo-200 mr-3"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {getUserInitials()}
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{getUserDisplayName()}</p>
                      <p className="text-xs opacity-75">View Profile</p>
                    </div>
                    
                    <UserIcon className="h-5 w-5" />
                  </Link>

                  {/* Mobile Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-1">
                  <Link
                    to="/login"
                    className="block w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors text-center border border-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all text-center shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
