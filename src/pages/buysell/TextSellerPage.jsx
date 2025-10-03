import React, { useState } from 'react';

const TextSellerPage = ({ bikeDetails, sellerDetails, goBack }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  
  // Predefined message templates
  const messageTemplates = [
    "Hi, is this bike still available?",
    "I'm interested in this bike. Can I see it in person?",
    "What is the best price you can offer?",
    "Does the bike have any issues I should know about?"
  ];
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    // Simulate message sending
    setTimeout(() => {
      setIsSending(false);
      setMessageSent(true);
      // Reset after showing sent confirmation
      setTimeout(() => {
        setMessage('');
        setMessageSent(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-4 mb-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={goBack}
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Message Seller</h2>
      </div>

      {/* Bike and Seller Info Card */}
      <div className="flex mb-6 border rounded-lg overflow-hidden">
        <div className="w-1/3">
          <img 
            src="/bike.jpg" 
            alt="Bike" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-2/3 p-4">
          <h3 className="font-bold text-lg">
            {bikeDetails?.bikeBrand || 'Honda'} {bikeDetails?.bikeModel || 'CBR 250R'}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {bikeDetails?.manufactureYear || '2022'} • {bikeDetails?.odometerReading || '5,000'} km
          </p>
          <p className="font-bold text-xl text-green-600 mb-4">
            ₹{bikeDetails?.sellingPrice?.toLocaleString() || '1,25,000'}
          </p>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold mr-2">
              {sellerDetails?.name?.charAt(0) || 'S'}
            </div>
            <div>
              <p className="font-medium">{sellerDetails?.name || 'Rahul Sharma'}</p>
              <p className="text-xs text-gray-500">Seller</p>
            </div>
          </div>
        </div>
      </div>

      {messageSent ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center my-6">
          <svg className="w-10 h-10 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-green-800 font-medium text-lg">Message Sent!</h3>
          <p className="text-green-700 text-sm">The seller will contact you soon</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="font-medium mb-3">Quick Messages</h3>
            <div className="flex flex-wrap gap-2">
              {messageTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(template)}
                  className="px-3 py-2 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="message">
              Your Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message to the seller here..."
              rows={5}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            />
          </div>
          
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span className="text-sm">Your name will be shared</span>
              </div>
              <span className="text-sm font-medium">{sellerDetails?.name || 'Your Name'}</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span className="text-sm">Your phone number will be shared</span>
              </div>
              <span className="text-sm font-medium">{sellerDetails?.mobileNumber || '+91 98765 43210'}</span>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 mb-6">
            <p className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <span>
                For your safety, we recommend meeting in public places and inspecting the bike thoroughly before making any payment.
              </span>
            </p>
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isSending}
            className={`w-full py-3 rounded-md font-medium flex items-center justify-center transition-colors ${
              message.trim() && !isSending 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
                Send Message
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default TextSellerPage;