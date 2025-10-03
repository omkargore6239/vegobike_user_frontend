import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Mic } from "lucide-react";

const ChatComponent = ({
  chatId = 1,
  userId = 123,
  contactName = "Vego Bike",
  contactAvatar = "https://via.placeholder.com/40x40/FF5722/FFFFFF?text=VB",
  onBack,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      chatId: 1,
      senderId: 456,
      message: "hello",
      messageType: "TEXT",
      timestamp: "2025-09-30T10:31:00Z",
      isRead: true,
    },
    {
      id: 2,
      chatId: 1,
      senderId: 456,
      message: "hello",
      messageType: "TEXT",
      timestamp: "2025-09-30T10:32:00Z",
      isRead: true,
    },
  ]);
  const [connected] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        chatId: chatId,
        senderId: userId,
        message: newMessage.trim(),
        messageType: "TEXT",
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");

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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-800 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 hover:bg-blue-700 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={contactAvatar}
                alt={contactName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="w-full h-full bg-red-500 rounded-full hidden items-center justify-center text-white font-bold text-sm">
                {contactName.charAt(0)}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg">{contactName}</h3>
              <div className="flex items-center text-xs opacity-90">
                <div
                  className={`w-2 h-2 rounded-full mr-1 ${
                    connected ? "bg-green-400" : "bg-gray-400"
                  }`}
                ></div>
                {connected ? "Online" : "Connecting..."}
              </div>
            </div>
          </div>
        </div>

        {/* Phone button removed from header */}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => {
          const isMine = isMyMessage(message);

          // Removed VOICE_CALL message type handling

          return (
            <div
              key={index}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isMine
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-800 shadow-sm"
                }`}
              >
                <p className="text-sm">{message.message}</p>
                <div
                  className={`text-xs mt-1 ${
                    isMine ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {formatTime(message.timestamp)}
                  {isMine && (
                    <span className="ml-1">{message.isRead ? "✓✓" : "✓"}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="w-full px-4 py-3 bg-gray-100 rounded-full border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>

          <button
            onMouseDown={() => setIsRecording(true)}
            onMouseUp={() => setIsRecording(false)}
            onMouseLeave={() => setIsRecording(false)}
            className={`p-3 rounded-full transition-colors ${
              isRecording
                ? "bg-red-500 text-white animate-pulse"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            <Mic size={20} />
          </button>
        </div>

        {isRecording && (
          <div className="text-center text-red-500 text-xs mt-2 animate-pulse">
            🔴 Recording... Release to send
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;

// import React, { useState, useRef, useEffect } from "react";
// import { ArrowLeft, Send } from "lucide-react";
// import SockJS from "sockjs-client";
// import { Stomp } from "@stomp/stompjs";

// const ChatComponent = ({
//   chatId = 1,
//   userId = 123,
//   contactName = "Vego Bike",
//   contactAvatar = "https://via.placeholder.com/40x40/FF5722/FFFFFF?text=VB",
//   onBack,
// }) => {
//   const [newMessage, setNewMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [connected, setConnected] = useState(false);
//   const [stompClient, setStompClient] = useState(null);
//   const messagesEndRef = useRef(null);

//   // WebSocket connection
//   useEffect(() => {
//     const connectWebSocket = () => {
//       console.log("🔌 Connecting to WebSocket...");
//       const socket = new SockJS("http://localhost:8080/ws-direct");
//       const client = Stomp.over(socket);

//       client.debug = (str) => {
//         console.log("🐛 STOMP Debug:", str);
//       };

//       client.connect(
//         {},
//         (frame) => {
//           console.log("✅ WebSocket Connected:", frame);
//           setConnected(true);
//           setStompClient(client);

//           // Subscribe to public messages
//           client.subscribe(`/topic/chat/${chatId}`, (message) => {
//             console.log("📨 Received message:", message.body);
//             try {
//               const messageData = JSON.parse(message.body);
//               setMessages((prev) => {
//                 const exists = prev.some((msg) => msg.id === messageData.id);
//                 return exists ? prev : [...prev, messageData];
//               });
//             } catch (error) {
//               console.error("❌ Error parsing message:", error);
//             }
//           });

//           // Subscribe to read status updates
//           client.subscribe(`/topic/chat/${chatId}/read`, (message) => {
//             console.log("📖 Received read status:", message.body);
//             try {
//               const statusData = JSON.parse(message.body);
//               setMessages((prev) =>
//                 prev.map((msg) =>
//                   msg.id === statusData.messageId
//                     ? { ...msg, isRead: true }
//                     : msg
//                 )
//               );
//             } catch (error) {
//               console.error("❌ Error parsing read status:", error);
//             }
//           });

//           // Subscribe to chat history
//           client.subscribe(`/user/queue/chat-history/${chatId}`, (message) => {
//             console.log("📚 Received chat history:", message.body);
//             try {
//               const historyData = JSON.parse(message.body);
//               setMessages(historyData);
//             } catch (error) {
//               console.error("❌ Error parsing chat history:", error);
//             }
//           });

//           // Fetch existing messages
//           fetchMessages(client);
//         },
//         (error) => {
//           console.error("❌ WebSocket Connection Error:", error);
//           setConnected(false);
//           setTimeout(() => {
//             console.log("🔄 Retrying WebSocket connection...");
//             connectWebSocket();
//           }, 3000);
//         }
//       );
//     };

//     connectWebSocket();

//     return () => {
//       if (stompClient?.connected) {
//         console.log("🔌 Disconnecting WebSocket...");
//         stompClient.disconnect();
//       }
//     };
//   }, [chatId]);

//   // Fetch messages from server
//   const fetchMessages = (client) => {
//     if (client?.connected) {
//       console.log("📥 Fetching messages for chatId:", chatId);
//       client.send(
//         "/app/fetch-messages",
//         {},
//         JSON.stringify({ chatId, userId })
//       );
//     }
//   };

//   // Auto-scroll to bottom
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   // Send message to server
//   const handleSendMessage = () => {
//     if (!newMessage.trim() || !stompClient?.connected) {
//       console.warn(
//         "⚠️ Cannot send message. WebSocket not connected or message is empty."
//       );
//       return;
//     }

//     console.log("📤 Sending message:", newMessage);
//     const messageData = {
//       chatId,
//       senderId: userId,
//       message: newMessage.trim(),
//       messageType: "TEXT",
//       timestamp: new Date().toISOString(),
//     };

//     stompClient.send("/app/send-message", {}, JSON.stringify(messageData));
//     setNewMessage("");
//   };

//   // Mark message as read
//   const markAsRead = (messageId) => {
//     if (!stompClient?.connected) return;

//     console.log("📖 Marking message as read:", messageId);
//     stompClient.send(
//       "/app/mark-as-read",
//       {},
//       JSON.stringify({ messageId, userId })
//     );
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString("en-US", {
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const isMyMessage = (message) => {
//     return message.senderId?.toString() === userId.toString();
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Header */}
//       <div className="flex items-center justify-between bg-blue-800 text-white px-4 py-3 shadow-lg">
//         <div className="flex items-center space-x-3">
//           <button
//             onClick={onBack}
//             className="p-1 hover:bg-blue-700 rounded-full transition-colors"
//           >
//             <ArrowLeft size={24} />
//           </button>
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center overflow-hidden">
//               <img
//                 src={contactAvatar}
//                 alt={contactName}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.target.style.display = "none";
//                   e.target.nextSibling.style.display = "flex";
//                 }}
//               />
//               <div className="w-full h-full bg-red-500 rounded-full hidden items-center justify-center text-white font-bold text-sm">
//                 {contactName.charAt(0)}
//               </div>
//             </div>
//             <div>
//               <h3 className="font-semibold text-lg">{contactName}</h3>
//               <div className="flex items-center text-xs opacity-90">
//                 <div
//                   className={`w-2 h-2 rounded-full mr-1 ${
//                     connected ? "bg-green-400" : "bg-red-400"
//                   }`}
//                 ></div>
//                 {connected ? "Connected" : "Connecting..."}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
//         {messages.map((message, index) => {
//           const isMine = isMyMessage(message);
//           return (
//             <div
//               key={message.id || index}
//               className={`flex ${isMine ? "justify-end" : "justify-start"}`}
//               onClick={() =>
//                 !message.isRead && !isMine && markAsRead(message.id)
//               }
//             >
//               <div
//                 className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                   isMine
//                     ? "bg-blue-500 text-white"
//                     : "bg-white text-gray-800 shadow-sm"
//                 }`}
//               >
//                 <p className="text-sm">{message.message}</p>
//                 <div
//                   className={`text-xs mt-1 ${
//                     isMine ? "text-blue-100" : "text-gray-500"
//                   }`}
//                 >
//                   {formatTime(message.timestamp)}
//                   {isMine && (
//                     <span className="ml-1">{message.isRead ? "✓✓" : "✓"}</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Message Input */}
//       <div className="bg-white border-t border-gray-200 px-4 py-3">
//         {!connected && (
//           <div className="text-center text-red-500 text-sm mb-2">
//             ⚠️ Connection lost. Trying to reconnect...
//           </div>
//         )}
//         <div className="flex items-center space-x-3">
//           <div className="flex-1 relative">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder={connected ? "Type a message" : "Connecting..."}
//               disabled={!connected}
//               className="w-full px-4 py-3 bg-gray-100 rounded-full border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:bg-gray-200"
//             />
//           </div>
//           <button
//             onClick={handleSendMessage}
//             disabled={!newMessage.trim() || !connected}
//             className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//           >
//             <Send size={20} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatComponent;
