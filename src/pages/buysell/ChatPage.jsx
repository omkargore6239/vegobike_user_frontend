// src/pages/ChatPage.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChatContainer from "../../components/buysell/ChatContainer";

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { vehicle, enquiry, contactName, contactPhone, enquiryType } =
    location.state || {};

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-gray-100 z-50">
      {/* Removed vehicle context banner completely */}

      <div className="h-full">
        <ChatContainer onBack={handleBack} />
      </div>
    </div>
  );
};

export default ChatPage;
