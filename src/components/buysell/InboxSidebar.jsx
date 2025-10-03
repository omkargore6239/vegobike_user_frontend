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
      {/* Header - Clean Design (No Search/More Buttons) */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">INBOX</h1>
        </div>

        {/* Search Bar */}
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => {
          // Check if anyone is typing in this chat
          const isUserTyping = chat.isUserTyping;
          const isContactTyping = chat.isContactTyping;
          const isAnyoneTyping = isUserTyping || isContactTyping;

          return (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group ${
                selectedChat === chat.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={chat.avatar}
                    alt={chat.contactName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                  {/* Typing indicator on avatar */}
                  {isAnyoneTyping && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {chat.contactName}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {chat.timestamp}
                      </span>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bike Info */}
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {chat.bikeInfo.title}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <span className="font-semibold text-green-600">
                        {chat.bikeInfo.price}
                      </span>
                      <span>•</span>
                      <span>{chat.bikeInfo.km}</span>
                    </div>
                  </div>

                  {/* Last Message with Enhanced Typing Indicator */}
                  <div className="flex items-center space-x-2">
                    {isUserTyping ? (
                      <div className="flex items-center text-sm">
                        <span className="text-green-600 italic mr-1">You:</span>
                        <TypingIndicator isSmall={true} />
                      </div>
                    ) : isContactTyping ? (
                      <div className="flex items-center text-sm">
                        <span className="text-blue-600 italic mr-1">
                          {chat.contactName}:
                        </span>
                        <TypingIndicator isSmall={true} />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 truncate">
                        {chat.lastMessage}
                      </p>
                    )}
                  </div>
                </div>

                {/* Removed MoreVertical button from chat items */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InboxSidebar;
