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
import { ROUTES, USER_ROLES, ERROR_MESSAGES } from './utils/constants';

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
import Booking from './pages/rental/Booking';
import MyBookings from './pages/rental/MyBookings';

// Servicing Pages
import ServicingHome from './pages/servicing/ServicingHome';
import BikeDetailsComponent from './pages/servicing/BikeDetailsComponent';
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
import Checkout from './pages/spareparts/Checkout';
import Orders from './pages/spareparts/Orders';

// BuySell Pages
import BuySellHome from './pages/buysell/BuySellHome';
import PostListing from './pages/buysell/PostListing';
import ListingDetail from './pages/buysell/ListingDetail';
import MyListings from './pages/buysell/MyListings';

// 404 Not Found Component
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="mb-8">
        <div className="text-8xl mb-4">🚲</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-6">Oops! This page took a wrong turn.</p>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm">
        <p className="text-gray-700 mb-2">Debug Info:</p>
        <p className="text-gray-600">Current URL: {window.location.pathname}</p>
        <p className="text-gray-600">Search Params: {window.location.search}</p>
      </div>
      
      <div className="space-y-2">
        <a 
          href={ROUTES.HOME}
          className="block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          🏠 Go to Home
        </a>
        <a 
          href={ROUTES.RENTAL}
          className="block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          🚲 Go to Rentals
        </a>
        <a 
          href={ROUTES.SERVICING}
          className="block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          🔧 Go to Servicing
        </a>
        <a 
          href={ROUTES.SPAREPARTS}
          className="block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
        >
          🔩 Go to Spare Parts
        </a>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RentalProvider>
          <ServicingProvider>
            <SparepartsProvider>
              <BuySellProvider>
                <Router>
                  <div className="min-h-screen bg-gray-50 flex flex-col">
                    <Navbar />
                    <main className="flex-1">
                      <Routes>
                        {/* ================================ */}
                        {/* PUBLIC ROUTES (No Auth Required) */}
                        {/* ================================ */}
                        
                        {/* Authentication Routes */}
                        <Route path={ROUTES.HOME} element={<Home />} />
                        <Route path={ROUTES.LOGIN} element={<Login />} />
                        <Route path={ROUTES.REGISTER} element={<Register />} />
                        
                        {/* Browse/Search Routes (Public) */}
                        <Route path={ROUTES.RENTAL_SEARCH} element={<RentalSearch />} />
                        <Route path={ROUTES.RENTAL} element={<RentalHome />} />
                        <Route path={ROUTES.RENTAL_BIKES} element={<BikeList />} />
                        
                        {/* Servicing Public Pages */}
                        <Route path={ROUTES.SERVICING} element={<ServicingHome />} />
                        <Route path={ROUTES.SERVICING_HOMEPAGE} element={<HomePage />} />
                        <Route path={ROUTES.SERVICING_SERVICES} element={<Services />} />
                        <Route path={ROUTES.SERVICING_PACKAGES} element={<ServicePackagesPage />} />
                        
                        {/* Spareparts Public Pages */}
                        <Route path={ROUTES.SPAREPARTS} element={<SparepartsHome />} />
                        <Route path={`${ROUTES.SPAREPARTS_PART_DETAILS}/:id`} element={<PartDetails />} />
                        
                        {/* BuySell Public Pages */}
                        <Route path={ROUTES.BUYSELL} element={<BuySellHome />} />
                        <Route path={`${ROUTES.BUYSELL_LISTING}/:id`} element={<ListingDetail />} />
                        
                        {/* Static/Info Pages (Public) */}
                        <Route path={ROUTES.REFUND_POLICY} element={<RefundPolicy />} />
                        <Route path={ROUTES.TERMS} element={<TermsAndConditions />} />
                        
                        {/* ================================== */}
                        {/* PROTECTED ROUTES (Auth Required)   */}
                        {/* ================================== */}
                        
                        {/* Rental Protected Routes */}
                        <Route 
                          path={`${ROUTES.RENTAL_BOOKING}/:id`}
                          element={
                            <ProtectedRoute>
                              <Booking />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path={ROUTES.RENTAL_MY_BOOKINGS}
                          element={
                            <ProtectedRoute>
                              <MyBookings />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Servicing Protected Routes */}
                        <Route 
                          path={ROUTES.SERVICING_PROFILE}
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path={ROUTES.SERVICING_CART}
                          element={
                            <ProtectedRoute>
                              <Cart />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path={ROUTES.SERVICING_CHECKOUT}
                          element={
                            <ProtectedRoute>
                              <CheckoutPage />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Spareparts Protected Routes */}
                        <Route 
                          path={ROUTES.SPAREPARTS_CHECKOUT}
                          element={
                            <ProtectedRoute>
                              <Checkout />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path={ROUTES.SPAREPARTS_ORDERS}
                          element={
                            <ProtectedRoute>
                              <Orders />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* BuySell Protected Routes */}
                        <Route 
                          path={ROUTES.BUYSELL_POST}
                          element={
                            <ProtectedRoute>
                              <PostListing />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path={ROUTES.BUYSELL_MY_LISTINGS}
                          element={
                            <ProtectedRoute>
                              <MyListings />
                            </ProtectedRoute>
                          } 
                        />

                        {/* ========================================= */}
                        {/* ROLE-BASED PROTECTED ROUTES (Optional)   */}
                        {/* ========================================= */}
                        
                        {/* Admin Routes */}
                        <Route 
                          path={ROUTES.ADMIN_DASHBOARD}
                          element={
                            <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
                              <AdminDashboard />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Store Manager Routes */}
                        <Route 
                          path={ROUTES.STORE_DASHBOARD}
                          element={
                            <ProtectedRoute requiredRole={USER_ROLES.STORE_MANAGER}>
                              <StoreDashboard />
                            </ProtectedRoute>
                          } 
                        />

                        {/* ================================ */}
                        {/* 404 NOT FOUND ROUTE              */}
                        {/* ================================ */}
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </Router>
              </BuySellProvider>
            </SparepartsProvider>
          </ServicingProvider>
        </RentalProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
