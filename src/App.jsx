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
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Browse/Search Routes (Public) */}
                        <Route path="/search" element={<RentalSearch />} />
                        <Route path="/rental" element={<RentalHome />} />
                        <Route path="/bikes" element={<BikeList />} />
                        
                        {/* Servicing Public Pages */}
                        <Route path="/servicing" element={<ServicingHome />} />
                        <Route path="/servicing/home" element={<HomePage />} />
                        <Route path="/servicing/services" element={<Services />} />
                        <Route path="/servicing/service-packages" element={<ServicePackagesPage />} />
                        
                        {/* Spareparts Public Pages */}
                        <Route path="/spareparts" element={<SparepartsHome />} />
                        <Route path="/spareparts/part/:id" element={<PartDetails />} />
                        
                        {/* BuySell Public Pages */}
                        <Route path="/buysell" element={<BuySellHome />} />
                        <Route path="/buysell/listing/:id" element={<ListingDetail />} />
                        
                        {/* Static/Info Pages (Public) */}
                        <Route path="/servicing/refund" element={<RefundPolicy />} />
                        <Route path="/servicing/terms" element={<TermsAndConditions />} />
                        
                        {/* ================================== */}
                        {/* PROTECTED ROUTES (Auth Required)   */}
                        {/* ================================== */}
                        
                        {/* Rental Protected Routes */}
                        <Route 
                          path="/rental/booking/:id" 
                          element={
                            <ProtectedRoute>
                              <Booking />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/rental/my-bookings" 
                          element={
                            <ProtectedRoute>
                              <MyBookings />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Servicing Protected Routes */}
                        <Route 
                          path="/servicing/profile" 
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/servicing/cart" 
                          element={
                            <ProtectedRoute>
                              <Cart />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/servicing/checkout" 
                          element={
                            <ProtectedRoute>
                              <CheckoutPage />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* Spareparts Protected Routes */}
                        <Route 
                          path="/spareparts/checkout" 
                          element={
                            <ProtectedRoute>
                              <Checkout />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/spareparts/orders" 
                          element={
                            <ProtectedRoute>
                              <Orders />
                            </ProtectedRoute>
                          } 
                        />
                        
                        {/* BuySell Protected Routes */}
                        <Route 
                          path="/buysell/post" 
                          element={
                            <ProtectedRoute>
                              <PostListing />
                            </ProtectedRoute>
                          } 
                        />
                        <Route 
                          path="/buysell/my-listings" 
                          element={
                            <ProtectedRoute>
                              <MyListings />
                            </ProtectedRoute>
                          } 
                        />

                        {/* ================================ */}
                        {/* 404 NOT FOUND ROUTE              */}
                        {/* ================================ */}
                        <Route path="*" element={
                          <div className="min-h-screen flex items-center justify-center bg-gray-50">
                            <div className="text-center max-w-md mx-auto p-6">
                              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                              <p className="text-gray-600 mb-6">Page not found</p>
                              <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm">
                                <p className="text-gray-700 mb-2">Debug Info:</p>
                                <p className="text-gray-600">Current URL: {window.location.pathname}</p>
                                <p className="text-gray-600">Search Params: {window.location.search}</p>
                              </div>
                              <div className="space-y-2">
                                <a 
                                  href="/" 
                                  className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                  Go to Home
                                </a>
                                <a 
                                  href="/rental" 
                                  className="block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                >
                                  Go to Rentals
                                </a>
                              </div>
                            </div>
                          </div>
                        } />
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
