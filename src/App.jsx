import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { RentalProvider } from './context/RentalContext';
import { ServicingProvider } from './context/ServicingContext';
import { SparepartsProvider } from './context/SparepartsContext';
import { BuySellProvider } from './context/BuySellContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Rental Pages
import RentalSearch from './pages/rental/RentalSearch';
import RentalHome from './pages/rental/RentalHome';
import BikeDetails from './pages/rental/BikeDetails';
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
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Rental Routes */}
                        <Route path="/search" element={<RentalSearch />} />
                        <Route path="/rental" element={<RentalHome />} />
                        <Route path="/rental/bike/:id" element={<BikeDetails />} />
                        <Route path="/rental/booking/:id" element={
                          <ProtectedRoute>
                            <Booking />
                          </ProtectedRoute>
                        } />
                        <Route path="/rental/my-bookings" element={
                          <ProtectedRoute>
                            <MyBookings />
                          </ProtectedRoute>
                        } />
                        
                        {/* Servicing Routes */}
                        <Route path="/servicing" element={<ServicingHome />} />
                         <Route path="/" element={<HomePage />} />
                          <Route path="/services" element={<Services />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/refund" element={<RefundPolicy />} />
                          <Route path="/terms" element={<TermsAndConditions />} /> 
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/service-packages" element={<ServicePackagesPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />  
                                          
                        {/* Spareparts Routes */}
                        <Route path="/spareparts" element={<SparepartsHome />} />
                        <Route path="/spareparts/part/:id" element={<PartDetails />} />
                        <Route path="/spareparts/checkout" element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        } />
                        <Route path="/spareparts/orders" element={
                          <ProtectedRoute>
                            <Orders />
                          </ProtectedRoute>
                        } />
                        
                        {/* BuySell Routes */}
                        <Route path="/buysell" element={<BuySellHome />} />
                        <Route path="/buysell/post" element={
                          <ProtectedRoute>
                            <PostListing />
                          </ProtectedRoute>
                        } />
                        <Route path="/buysell/listing/:id" element={<ListingDetail />} />
                        <Route path="/buysell/my-listings" element={
                          <ProtectedRoute>
                            <MyListings />
                          </ProtectedRoute>
                        } />

                        {/* 404 Route */}
                        <Route path="*" element={
                          <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                              <p className="text-gray-600 mb-6">Page not found</p>
                              <a href="/" className="text-primary hover:underline">
                                Go back home
                              </a>
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
