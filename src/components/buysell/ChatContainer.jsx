// src/components/ChatContainer.jsx
import React, { useState, useRef } from "react";
import InboxSidebar from "./InboxSidebar";
import ChatPanel from "./ChatPanel";

const ChatContainer = ({ onBack }) => {
  const [selectedChat, setSelectedChat] = useState(null); // Start with null for mobile
  const [selectedUserId] = useState(123);
  const [typingStates, setTypingStates] = useState({});
  const [showChatPanel, setShowChatPanel] = useState(false); // Track chat panel visibility on mobile
  const typingTimeouts = useRef({});

  // Static inbox data
  const inboxData = [
    {
      id: 1,
      contactName: "BikeWale",
      lastMessage: "Hi vivek khadake, that's a Grea...",
      timestamp: "15:55",
      avatar: "https://via.placeholder.com/40x40/FF5722/FFFFFF?text=BW",
      bikeInfo: {
        title: "Brand New CB350RS 2025 0 Kms",
        price: "₹ 2,46,607",
        km: "0 km",
      },
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: 2,
      contactName: "Mr. Hasan",
      lastMessage: "6261007001 call kariye",
      timestamp: "4 DAYS AGO",
      avatar: "https://via.placeholder.com/40x40/4CAF50/FFFFFF?text=MH",
      bikeInfo: {
        title: "Hero Xtreme 160r (2023)",
        price: "₹ 1,25,000",
        km: "15000 km",
      },
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: 3,
      contactName: "Bike Dealer",
      lastMessage: "When can we meet?",
      timestamp: "2 DAYS AGO",
      avatar: "https://via.placeholder.com/40x40/2196F3/FFFFFF?text=BD",
      bikeInfo: {
        title: "Yamaha R15 V4 (2024)",
        price: "₹ 1,85,000",
        km: "5000 km",
      },
      unreadCount: 2,
      isOnline: true,
    },
  ];

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId);
    setShowChatPanel(true); // Show chat panel on mobile
  };

  const handleBackToInbox = () => {
    setShowChatPanel(false);
    setSelectedChat(null);
  };

  const updateTypingState = (chatId, userId, isTyping) => {
    setTypingStates((prev) => ({
      ...prev,
      [`${chatId}_${userId}`]: isTyping,
    }));

    const timeoutKey = `${chatId}_${userId}`;
    if (typingTimeouts.current[timeoutKey]) {
      clearTimeout(typingTimeouts.current[timeoutKey]);
    }

    if (isTyping) {
      typingTimeouts.current[timeoutKey] = setTimeout(() => {
        setTypingStates((prev) => ({
          ...prev,
          [timeoutKey]: false,
        }));
      }, 3000);
    }
  };

  const getTypingState = (chatId, userId) => {
    return typingStates[`${chatId}_${userId}`] || false;
  };

  const enhancedInboxData = inboxData.map((chat) => ({
    ...chat,
    isUserTyping: getTypingState(chat.id, selectedUserId),
    isContactTyping: getTypingState(chat.id, 456),
  }));

  const selectedChatData = enhancedInboxData.find(
    (chat) => chat.id === selectedChat
  );

  return (
    <div className="flex h-full bg-gray-100 relative">
      {/* Inbox Sidebar - Mobile: Full screen, Desktop: Side panel */}
      <div
        className={`${
          showChatPanel ? "hidden lg:flex" : "flex"
        } w-full lg:w-1/3 lg:min-w-[350px] xl:min-w-[400px] bg-white border-r border-gray-200 flex-col h-full`}
      >
        <InboxSidebar
          inboxData={enhancedInboxData}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
          onBack={onBack}
          typingStates={typingStates}
        />
      </div>

      {/* Chat Panel - Mobile: Full screen when active, Desktop: Always visible */}
      <div
        className={`${
          showChatPanel ? "flex" : "hidden lg:flex"
        } flex-1 flex-col h-full`}
      >
        <ChatPanel
          chatId={selectedChat}
          userId={selectedUserId}
          contactData={selectedChatData}
          onTypingChange={updateTypingState}
          getTypingState={getTypingState}
          onBack={handleBackToInbox} // Pass back handler for mobile
        />
      </div>
    </div>
  );
};

export default ChatContainer;
