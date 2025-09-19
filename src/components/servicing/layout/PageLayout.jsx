// src/components/layout/PageLayout.jsx
import React from 'react';
import useScrollPosition from '../../../hooks/useScrollPosition';
import Navbar from './Navbar';
import Footer from './Footer';
import QuoteForm from '../forms/QuoteForm';

const PageLayout = ({ children }) => {
  const scrollPosition = useScrollPosition();

  return (
    <div className="min-h-screen flex flex-col bg-red">
      {/* Scroll progress bar */}
      <div className="h-1 bg-primary/20 fixed top-0 left-0 right-0 z-60">
        <div 
          className="h-full bg-accent transition-all duration-300" 
          style={{ 
            width: `${Math.min(
              (scrollPosition / (document.body.scrollHeight - window.innerHeight)) * 100, 
              100
            )}%`
          }}
        />
      </div>

      <Navbar />
      
      <div className="flex-grow flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 responsive-padding mt-1">
        {/* Mobile View - QuoteForm First */}
        <div className="md:hidden w-full mb-6">
          <div className="bg-white rounded-lg shadow-card p-4">
            <QuoteForm />
          </div>
        </div>
        
        {/* Main content area */}
        <main className="flex-grow md:w-2/3 overflow-y-auto order-2 md:order-1">
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Right sidebar - Desktop Only */}
        <aside className="hidden md:block md:w-1/3 md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto order-1 md:order-2">
          <div className="bg-white rounded-lg shadow-card p-4 md:p-6 lg:p-8">
            <QuoteForm />
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
};

export default PageLayout;