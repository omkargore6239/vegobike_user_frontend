// src/components/InboxSidebar.jsx
import React, { useState } from "react";
import { Search, ArrowLeft } from "lucide-react";

const InboxSidebar = ({
  inboxData,
  selectedChat,
  onChatSelect,
  onBack,
  typingStates,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Simple filter logic without UI buttons
  const filteredChats = inboxData.filter((chat) => {
    const matchesSearch =
      chat.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.bikeInfo.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Enhanced typing indicator component
  const TypingIndicator = ({ isSmall = false }) => (
    <div className="flex items-center space-x-1">
      <span
        className={`text-blue-500 italic ${isSmall ? "text-xs" : "text-sm"}`}
      >
        typing
      </span>
      <div className="flex space-x-1">
        <div
          className={`bg-blue-500 rounded-full animate-bounce ${
            isSmall ? "w-1 h-1" : "w-1.5 h-1.5"
          }`}
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className={`bg-blue-500 rounded-full animate-bounce ${
            isSmall ? "w-1 h-1" : "w-1.5 h-1.5"
          }`}
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className={`bg-blue-500 rounded-full animate-bounce ${
            isSmall ? "w-1 h-1" : "w-1.5 h-1.5"
          }`}
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header - Mobile Responsive */}
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">INBOX</h1>
        </div>

        {/* Search Bar - Mobile Responsive */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chat List - Mobile Responsive */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => {
          const isUserTyping = chat.isUserTyping;
          const isContactTyping = chat.isContactTyping;
          const isAnyoneTyping = isUserTyping || isContactTyping;

          return (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors active:bg-gray-100 ${
                selectedChat === chat.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-start space-x-2 sm:space-x-3">
                {/* Avatar - Mobile Responsive */}
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.contactName}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                  />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                  {isAnyoneTyping && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5 sm:p-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>

                {/* Chat Info - Mobile Responsive */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate pr-2">
                      {chat.contactName}
                    </h3>
                    <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                      <span className="text-xs text-gray-500">
                        {chat.timestamp}
                      </span>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 sm:px-2 sm:py-1 min-w-[18px] sm:min-w-[20px] text-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bike Info - Mobile Responsive */}
                  <div className="mb-1.5 sm:mb-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                      {chat.bikeInfo.title}
                    </p>
                    <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs text-gray-600">
                      <span className="font-semibold text-green-600">
                        {chat.bikeInfo.price}
                      </span>
                      <span>•</span>
                      <span>{chat.bikeInfo.km}</span>
                    </div>
                  </div>

                  {/* Last Message with Enhanced Typing Indicator */}
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {isUserTyping ? (
                      <div className="flex items-center text-xs sm:text-sm">
                        <span className="text-green-600 italic mr-1">You:</span>
                        <TypingIndicator isSmall={true} />
                      </div>
                    ) : isContactTyping ? (
                      <div className="flex items-center text-xs sm:text-sm">
                        <span className="text-blue-600 italic mr-1 truncate max-w-[80px]">
                          {chat.contactName}:
                        </span>
                        <TypingIndicator isSmall={true} />
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        {chat.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InboxSidebar;
