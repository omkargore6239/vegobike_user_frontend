// App.jsx - FIXED VERSION with Correct Route Mappings
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { RentalProvider } from './context/RentalContext';
import { ServicingProvider } from './context/ServicingContext';
import { SparepartsProvider } from './context/SparepartsContext';
import { BuySellProvider } from './context/BuySellContext';

// Import API client to initialize interceptors
import './utils/apiClient';

// Import constants
import { ROUTES, USER_ROLES } from './utils/constants';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Rental Pages
import RentalSearch from './pages/rental/RentalSearch';
import RentalHome from './pages/rental/RentalHome';
import BikeList from './pages/rental/BikeList';
import BikeDetails from './pages/rental/BikeDetails';
import RentalCheckout from './pages/rental/Checkout';
import MyBookings from './pages/rental/MyBookings';

// Servicing Pages
import ServicingHome from './pages/servicing/ServicingHome';
import HomePage from './pages/servicing/HomePage';
import Services from './pages/servicing/Services';
import Profile from './pages/servicing/Profile';
import RefundPolicy from './pages/servicing/RefundPolicy';
import TermsAndConditions from './pages/servicing/TermsAndConditions';
import Cart from './pages/servicing/Cart';
import ServicePackagesPage from './pages/servicing/ServicePackagesPage';
import CheckoutPage from './pages/servicing/CheckoutPage';

// Spareparts Pages
import SparepartsHome from './pages/spareparts/SparepartsHome';
import PartDetails from './pages/spareparts/PartDetails';
import SparepartsCheckout from './pages/spareparts/Checkout';
import Orders from './pages/spareparts/Orders';

// BuySell Pages
import BuySellHome from './pages/buysell/BuySellHome';
import PostListing from './pages/buysell/PostListing';
import ListingDetail from './pages/buysell/ListingDetail';
import MyListings from './pages/buysell/MyListings';

// FIXED: Safe environment variable access
const isDevelopment = import.meta.env.MODE === 'development';
const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:8081';
const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0';

console.log('🔧 APP - Environment:', {
  mode: import.meta.env.MODE,
  isDev: isDevelopment,
  apiUrl: apiUrl,
  version: appVersion
});

// Enhanced 404 Not Found Component
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="text-center max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-lg">
      <div className="mb-8">
        <div className="text-6xl mb-4 animate-bounce">🚲</div>
        <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">The page you're looking for took a detour and got lost in the bike lanes!</p>
      </div>
      
      {/* Debug Info for Development - FIXED */}
      {isDevelopment && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 text-sm">
          <p className="text-yellow-800 mb-2 font-medium">🔧 Debug Info:</p>
          <p className="text-yellow-700 text-left">Current URL: <code className="bg-yellow-100 px-1 rounded">{window.location.pathname}</code></p>
          <p className="text-yellow-700 text-left">Search Params: <code className="bg-yellow-100 px-1 rounded">{window.location.search || 'None'}</code></p>
          <p className="text-yellow-700 text-left">Environment: <code className="bg-yellow-100 px-1 rounded">{import.meta.env.MODE}</code></p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a 
          href="/"
          className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          🏠 Go Home
        </a>
        <a 
          href="/rental"
          className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          🚲 Rent Bikes
        </a>
        <a 
          href="/servicing"
          className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          🔧 Servicing
        </a>
        <a 
          href="/spareparts"
          className="flex items-center justify-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          🔩 Spare Parts
        </a>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          If you think this is a mistake, please contact our support team.
        </p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <RentalProvider>
            <ServicingProvider>
              <SparepartsProvider>
                <BuySellProvider>
                  <div className="min-h-screen bg-gray-50 flex flex-col">
                    <Navbar />
                    <main className="flex-1">
                      <Routes>
                        {/* ================================ */}
                        {/* PUBLIC ROUTES                    */}
                        {/* ================================ */}
                        
                        {/* Home */}
                        <Route path="/" element={<Home />} />
                        
                        {/* Authentication Routes */}
                        <Route 
                          path="/login" 
                          element={
                            <ProtectedRoute requireAuth={false} redirectIfAuthenticated={true}>
                              <Login />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/register" 
                          element={
                            <ProtectedRoute requireAuth={false} redirectIfAuthenticated={true}>
                              <Register />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* ================================ */}
                        {/* RENTAL ROUTES - FIXED            */}
                        {/* ================================ */}
                        
                        {/* Rental Home Routes */}
                        <Route path="/rental" element={<RentalHome />} />
                        <Route path="/rental/home" element={<RentalHome />} />
                        
                        {/* Rental Search */}
                        <Route path="/rental/search" element={<RentalSearch />} />
                        <Route path="/search" element={<RentalSearch />} />
                        
                        {/* FIXED: BikeList Routes - Multiple paths */}
                        <Route path="/bikes" element={<BikeList />} />
                        <Route path="/rental/bikes" element={<BikeList />} />
                        
                        {/* FIXED: Checkout Route - Protected */}
                        <Route 
                          path="/rental/checkout" 
                          element={
                            <ProtectedRoute 
                              requireAuth={true}
                              redirectTo="/login"
                              showRoleError={false}
                            >
                              <RentalCheckout />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Bike Details Route - Protected */}
                        <Route 
                          path="/rental/bike/:id" 
                          element={
                            <ProtectedRoute 
                              requireAuth={true}
                              redirectTo="/login"
                              showRoleError={false}
                            >
                              <BikeDetails />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Alternative Bike Details Routes */}
                        <Route 
                          path="/bikes/:id" 
                          element={
                            <ProtectedRoute requireAuth={true}>
                              <BikeDetails />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* My Bookings Route */}
                        <Route 
                          path="/rental/my-bookings"
                          element={
                            <ProtectedRoute requireAuth={true}>
                              <MyBookings />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Legacy booking routes - redirect to checkout */}
                        <Route 
                          path="/rental/booking/:id"
                          element={
                            <ProtectedRoute requireAuth={true}>
                              <RentalCheckout />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/booking/:id"
                          element={
                            <ProtectedRoute requireAuth={true}>
                              <RentalCheckout />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* ================================ */}
                        {/* SERVICING ROUTES                 */}
                        {/* ================================ */}
                        
                        <Route path="/servicing" element={<ServicingHome />} />
                        <Route path="/servicing/home" element={<HomePage />} />
                        <Route path="/servicing/services" element={<Services />} />
                        <Route path="/servicing/service-packages" element={<ServicePackagesPage />} />
                        
                        {/* Servicing Protected Routes */}
                        <Route 
                          path="/servicing/profile"
                          element={
                            <ProtectedRoute requireAuth={true}>
                              <Profile />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/servicing/cart"
                          element={
                            <ProtectedRoute requireAuth={true}>
                              <Cart />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/servicing/checkout"
                          element={
                            <ProtectedRoute requireAuth={true}>
                              <CheckoutPage />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* ================================ */}
                        {/* SPAREPARTS ROUTES                */}
                        {/* ================================ */}
                        
                        <Route path="/spareparts" element={<SparepartsHome />} />
                        <Route path="/spareparts/part/:id" element={<PartDetails />} />
                        
                        {/* Spareparts Protected Routes */}
                        <Route 
                          path="/spareparts/checkout"
                          element={
                            <ProtectedRoute requireAuth={true}>
                              <SparepartsCheckout />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/spareparts/orders"
                          element={
                            <ProtectedRoute requireAuth={true}>
                              <Orders />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* ================================ */}
                        {/* BUYSELL ROUTES                   */}
                        {/* ================================ */}
                        
                        <Route path="/buysell" element={<BuySellHome />} />
                        <Route path="/buysell/listing/:id" element={<ListingDetail />} />
                        
                        {/* BuySell Protected Routes */}
                        <Route 
                          path="/buysell/post"
                          element={
                            <ProtectedRoute requireAuth={true}>
                              <PostListing />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/buysell/my-listings"
                          element={
                            <ProtectedRoute requireAuth={true}>
                              <MyListings />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* ================================ */}
                        {/* STATIC PAGES                     */}
                        {/* ================================ */}
                        
                        <Route path="/terms" element={<TermsAndConditions />} />
                        <Route path="/servicing/terms" element={<TermsAndConditions />} />
                        <Route path="/refund" element={<RefundPolicy />} />
                        <Route path="/servicing/refund" element={<RefundPolicy />} />
                        <Route path="/privacy" element={<RefundPolicy />} />
                        <Route path="/about" element={<Home />} />
                        <Route path="/contact" element={<Home />} />
                        <Route path="/faq" element={<Home />} />
                        
                        {/* ================================ */}
                        {/* ADMIN ROUTES                     */}
                        {/* ================================ */}
                        
                        <Route 
                          path="/admin/*"
                          element={
                            <ProtectedRoute 
                              requireAuth={true} 
                              requiredRole={USER_ROLES.ADMIN}
                              showRoleError={true}
                            >
                              <div className="min-h-screen bg-gray-50 py-8">
                                <div className="max-w-4xl mx-auto px-4">
                                  <div className="bg-white rounded-lg shadow p-8 text-center">
                                    <div className="text-6xl mb-4">👨‍💼</div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
                                    <p className="text-gray-600 mb-6">Welcome to the VegoBike Admin Panel</p>
                                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                                      <p className="text-blue-800">Admin functionality is under development.</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* ================================ */}
                        {/* DEVELOPMENT ROUTES               */}
                        {/* ================================ */}
                        
                        {/* Health Check */}
                        <Route 
                          path="/health" 
                          element={
                            <div className="p-4 text-center">
                              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                <strong>✅ Application Status: Healthy</strong>
                                <p className="mt-2 text-sm">
                                  Timestamp: {new Date().toISOString()}<br />
                                  Environment: {import.meta.env.MODE}<br />
                                  Version: {appVersion}
                                </p>
                              </div>
                            </div>
                          } 
                        />
                        
                        {/* Development Routes */}
                        {isDevelopment && (
                          <>
                            <Route 
                              path="/debug" 
                              element={
                                <div className="min-h-screen bg-gray-50 py-8">
                                  <div className="max-w-4xl mx-auto px-4">
                                    <div className="bg-white rounded-lg shadow-lg p-8">
                                      <h1 className="text-3xl font-bold mb-6">🔧 Debug Panel</h1>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-green-50 p-4 rounded-lg">
                                          <h3 className="text-lg font-semibold mb-3 text-green-800">🚲 Rental Routes</h3>
                                          <div className="space-y-2">
                                            <a href="/rental" className="block text-green-600 hover:underline">Rental Home</a>
                                            <a href="/bikes" className="block text-green-600 hover:underline">Bike List</a>
                                            <a href="/rental/checkout?bikeId=123&bikeName=Test+Bike&price=500" className="block text-green-600 hover:underline">Test Checkout</a>
                                          </div>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                          <h3 className="text-lg font-semibold mb-3 text-blue-800">🔐 Auth Routes</h3>
                                          <div className="space-y-2">
                                            <a href="/login" className="block text-blue-600 hover:underline">Login</a>
                                            <a href="/register" className="block text-blue-600 hover:underline">Register</a>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm">
                                        <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
                                        <p><strong>API URL:</strong> {apiUrl}</p>
                                        <p><strong>Current URL:</strong> {window.location.pathname}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              } 
                            />
                          </>
                        )}
                        
                        {/* ================================ */}
                        {/* 404 CATCH ALL                    */}
                        {/* ================================ */}
                        
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </BuySellProvider>
              </SparepartsProvider>
            </ServicingProvider>
          </RentalProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
