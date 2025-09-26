// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, USER_ROLES, ROLE_NAMES } from '../../utils/constants';
import Loader from './Loader';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requireAuth = true,
  redirectTo = ROUTES.LOGIN,
  fallback = null,
  showRoleError = true 
}) => {
  const { isAuthenticated, loading, user, error, authCheckComplete } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading || !authCheckComplete) {
    return <Loader text="Checking authentication..." />;
  }

  // Handle authentication errors
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center mb-2">
              <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold">Authentication Error</h3>
            </div>
            <p className="text-sm">{error}</p>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
            <a
              href={ROUTES.HOME}
              className="block w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
            >
              Go to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Handle different authentication scenarios
  if (requireAuth && !isAuthenticated) {
    // Create return URL with current location
    const returnUrl = encodeURIComponent(`${location.pathname}${location.search}`);
    
    return (
      <Navigate 
        to={`${redirectTo}?returnUrl=${returnUrl}`}
        state={{ 
          from: location,
          message: 'Please log in to access this page',
          returnUrl: location.pathname + location.search
        }} 
        replace 
      />
    );
  }

  // If auth is not required but user is authenticated (e.g., login/register pages)
  if (!requireAuth && isAuthenticated) {
    // Check for return URL in query params
    const urlParams = new URLSearchParams(location.search);
    const returnUrl = urlParams.get('returnUrl');
    
    if (returnUrl) {
      return <Navigate to={decodeURIComponent(returnUrl)} replace />;
    }
    
    // Default redirect for authenticated users accessing login/register
    return <Navigate to={ROUTES.RENTAL_HOME} replace />;
  }

  // Check for role-based access (if required)
  if (requiredRole && isAuthenticated && user) {
    const userRole = user.roleId;
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.includes(userRole)
      : userRole === requiredRole;

    if (!hasRequiredRole) {
      if (!showRoleError) {
        return fallback || <Navigate to={ROUTES.HOME} replace />;
      }

      const requiredRoleName = Array.isArray(requiredRole)
        ? requiredRole.map(role => ROLE_NAMES[role] || role).join(' or ')
        : ROLE_NAMES[requiredRole] || requiredRole;

      const userRoleName = ROLE_NAMES[userRole] || 'Unknown';

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center mb-2">
                <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="font-semibold">Access Denied</h3>
              </div>
              <p className="text-sm mb-2">You don't have permission to access this page.</p>
              <div className="text-xs space-y-1 bg-yellow-100 p-2 rounded">
                <p><strong>Required:</strong> {requiredRoleName}</p>
                <p><strong>Your Role:</strong> {userRoleName}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200"
              >
                Go Back
              </button>
              <a 
                href={ROUTES.HOME} 
                className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200 no-underline"
              >
                Go to Home
              </a>
              {/* Show appropriate dashboard based on user role */}
              {userRole === USER_ROLES.ADMIN && (
                <a 
                  href="/admin" 
                  className="block w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors duration-200 no-underline"
                >
                  Go to Admin Dashboard
                </a>
              )}
              {userRole === USER_ROLES.STORE_MANAGER && (
                <a 
                  href="/store-manager" 
                  className="block w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 no-underline"
                >
                  Go to Store Manager Dashboard
                </a>
              )}
            </div>
          </div>
        </div>
      );
    }
  }

  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;
