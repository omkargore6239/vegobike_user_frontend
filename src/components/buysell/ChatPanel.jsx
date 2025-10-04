// src/components/ChatPanel.jsx
import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft } from "lucide-react";

const ChatPanel = ({
  chatId,
  userId,
  contactData,
  onTypingChange,
  getTypingState,
  onBack, // Add onBack prop for mobile
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      chatId: 1,
      senderId: userId,
      message:
        "Hi, I am vivek khadake. I can be reached at +919545887885. I am interested in your ad posting.",
      messageType: "TEXT",
      timestamp: "2025-09-30T15:55:00Z",
      isRead: true,
    },
    {
      id: 2,
      chatId: 1,
      senderId: 456,
      message:
        "Hi vivek khadake, that's a Great Choice! Our Trusted Partner team will reach out to you shortly. Thank you for choosing BikeWale Listing.",
      messageType: "TEXT",
      timestamp: "2025-09-30T15:55:00Z",
      isRead: true,
    },
  ]);
  const messagesEndRef = useRef(null);

  const isUserTyping = getTypingState(chatId, userId);
  const isContactTyping = getTypingState(chatId, 456);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isContactTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTypingChange = (value) => {
    setNewMessage(value);

    if (value.trim()) {
      onTypingChange(chatId, userId, true);
    } else {
      onTypingChange(chatId, userId, false);
    }
  };

  const handleSendMessage = (messageText = newMessage) => {
    if (messageText.trim()) {
      const newMsg = {
        id: messages.length + 1,
        chatId: chatId,
        senderId: userId,
        message: messageText.trim(),
        messageType: "TEXT",
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
      onTypingChange(chatId, userId, false);

      setTimeout(() => {
        onTypingChange(chatId, 456, true);

        setTimeout(() => {
          onTypingChange(chatId, 456, false);

          if (Math.random() > 0.3) {
            const autoReplies = [
              "Thank you for your interest!",
              "Let me check the availability.",
              "Can we schedule a meeting?",
              "The bike is in excellent condition.",
              "When would you like to see it?",
            ];

            const randomReply =
              autoReplies[Math.floor(Math.random() * autoReplies.length)];

            setTimeout(() => {
              const replyMsg = {
                id: messages.length + 2,
                chatId: chatId,
                senderId: 456,
                message: randomReply,
                messageType: "TEXT",
                timestamp: new Date().toISOString(),
                isRead: false,
              };

              setMessages((prev) => [...prev, replyMsg]);
            }, 500);
          }
        }, 3000);
      }, 1000);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMsg.id ? { ...msg, isRead: true } : msg
          )
        );
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isMyMessage = (message) => {
    return message.senderId?.toString() === userId.toString();
  };

  const TypingIndicator = () => (
    <div className="flex justify-start mb-3 sm:mb-4">
      <div className="bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-bl-sm shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-gray-600">
            {contactData.contactName} is typing
          </span>
          <div className="flex space-x-1">
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!contactData) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 p-4">
        <div className="text-center">
          <span className="text-sm sm:text-base text-gray-600">
            Select a chat to start messaging
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header - Mobile Responsive with Back Button */}
      <div className="bg-white px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Back Button */}
          <button
            onClick={onBack}
            className="lg:hidden p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="relative flex-shrink-0">
            <img
              src={contactData.avatar}
              alt={contactData.contactName}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            />
            {contactData.isOnline && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
            {(isUserTyping || isContactTyping) && (
              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1 sm:p-1.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
              {contactData.contactName}
            </h2>
            <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm">
              {isUserTyping ? (
                <span className="text-green-500 italic font-medium truncate">
                  You are typing...
                </span>
              ) : isContactTyping ? (
                <div className="flex items-center space-x-1">
                  <span className="text-blue-500 italic font-medium">
                    typing
                  </span>
                  <div className="flex space-x-0.5 sm:space-x-1">
                    <div
                      className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-gray-600 truncate max-w-[120px] sm:max-w-none">
                    {contactData.bikeInfo.title}
                  </span>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                  <span className="font-semibold text-green-600 hidden sm:inline">
                    {contactData.bikeInfo.price}
                  </span>
                  <span className="text-gray-400 hidden sm:inline">•</span>
                  <span className="text-gray-600 hidden sm:inline">
                    {contactData.bikeInfo.km}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area - Mobile Responsive */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
        {messages
          .filter((msg) => msg.chatId === chatId)
          .map((message, index) => {
            const isMine = isMyMessage(message);
            return (
              <div
                key={index}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
                    isMine
                      ? "bg-blue-500 text-white rounded-br-sm"
                      : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
                  }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed break-words">
                    {message.message}
                  </p>
                  <div
                    className={`text-xs mt-1.5 sm:mt-2 ${
                      isMine ? "text-blue-100" : "text-gray-500"
                    } flex items-center justify-end space-x-1`}
                  >
                    <span>{formatTime(message.timestamp)}</span>
                    {isMine && (
                      <span className="ml-1">
                        {message.isRead ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        {isContactTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Mobile Responsive */}
      <div className="bg-white border-t border-gray-200 px-3 sm:px-4 py-2 sm:py-3 flex-shrink-0">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => handleTypingChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-100 rounded-full border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            onClick={() => handleSendMessage()}
            disabled={!newMessage.trim()}
            className="p-2 sm:p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <Send size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
