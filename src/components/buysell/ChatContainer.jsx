// src/components/ChatContainer.jsx
import React, { useState, useRef } from "react";
import InboxSidebar from "./InboxSidebar";
import ChatPanel from "./ChatPanel";

const ChatContainer = ({ onBack }) => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [selectedUserId] = useState(123);
  const [typingStates, setTypingStates] = useState({});
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
      {/* Inbox Sidebar */}
      <div className="w-1/3 min-w-[400px] bg-white border-r border-gray-200 flex flex-col h-full">
        <InboxSidebar
          inboxData={enhancedInboxData}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
          onBack={onBack}
          typingStates={typingStates}
        />
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col h-full">
        <ChatPanel
          chatId={selectedChat}
          userId={selectedUserId}
          contactData={selectedChatData}
          onTypingChange={updateTypingState}
          getTypingState={getTypingState}
        />
      </div>
    </div>
  );
};

export default ChatContainer;

// src/components/ChatContainer.jsx
// import React, { useState, useRef, useEffect } from "react";
// import InboxSidebar from "./InboxSidebar";
// import ChatPanel from "./ChatPanel";

// const ChatContainer = ({ onBack }) => {
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [selectedUserId] = useState(123); // Replace with dynamic user ID
//   const [typingStates, setTypingStates] = useState({});
//   const [inboxData, setInboxData] = useState([]);
//   const [connected, setConnected] = useState(false);
//   const [websocket, setWebsocket] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const typingTimeouts = useRef({});
//   const retryCount = useRef(0);
//   const maxRetries = 5;
//   const API_BASE_URL = "http://localhost:8080/api";

//   // Get JWT token from localStorage
//   const getJWTToken = () => localStorage.getItem("jwtToken");

//   // Create API headers with JWT token
//   const getApiHeaders = () => {
//     const token = getJWTToken();
//     const headers = { "Content-Type": "application/json" };
//     if (token && token.length > 20) headers.Authorization = `Bearer ${token}`;
//     return headers;
//   };

//   // Fetch user chats
//   const fetchInboxData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log("📡 Fetching chats for userId:", selectedUserId);
//       const response = await fetch(
//         `${API_BASE_URL}/chats/user/${selectedUserId}`,
//         {
//           method: "GET",
//           headers: getApiHeaders(),
//         }
//       );
//       if (response.ok) {
//         const chats = await response.json();
//         const transformedChats = chats.map((chat) => ({
//           id: chat.id,
//           name: `Chat ${chat.id}`,
//           lastMessage:
//             chat.messages?.[chat.messages.length - 1]?.message ||
//             "No messages yet",
//           timestamp: chat.updatedAt ? formatTime(chat.updatedAt) : "Just now",
//           unreadCount:
//             chat.messages?.filter(
//               (msg) => !msg.isRead && msg.receiverId === selectedUserId
//             ).length || 0,
//           avatar: `https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff`,
//           isOnline: false,
//           sellerId: chat.sellerId,
//           buyerId: chat.buyerId,
//           bikeId: chat.bikeId,
//           messages: chat.messages || [],
//         }));
//         setInboxData(transformedChats);
//         if (!selectedChat && transformedChats.length > 0)
//           setSelectedChat(transformedChats[0].id);
//       } else if (response.status === 404) {
//         setInboxData([]);
//         setError("No chats found for this user");
//       } else {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
//     } catch (err) {
//       console.error("❌ API Error:", err);
//       setError("Failed to fetch chats: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Send message via REST API
//   const sendMessageViaAPI = async (chatId, message) => {
//     try {
//       const messageDTO = {
//         message,
//         senderId: selectedUserId,
//         receiverId: null,
//         messageType: "TEXT",
//         isRead: false,
//       };
//       const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
//         method: "POST",
//         headers: getApiHeaders(),
//         body: JSON.stringify(messageDTO),
//       });
//       if (response.ok) {
//         const savedMessage = await response.json();
//         updateInboxWithNewMessage({
//           ...savedMessage,
//           chatId,
//           senderId: selectedUserId,
//           timestamp: new Date().toISOString(),
//         });
//         return savedMessage;
//       } else {
//         throw new Error(`HTTP ${response.status}: ${await response.text()}`);
//       }
//     } catch (err) {
//       console.error("❌ Send Message Error:", err);
//       setError("Failed to send message: " + err.message);
//       throw err;
//     }
//   };

//   // Fetch messages for a chat
//   const fetchChatMessages = async (chatId) => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/chats/${chatId}/messages?userId=${selectedUserId}`,
//         {
//           method: "GET",
//           headers: getApiHeaders(),
//         }
//       );
//       if (response.ok) return await response.json();
//       if (response.status === 404) return [];
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//     } catch (err) {
//       console.error("❌ Fetch Messages Error:", err);
//       return [];
//     }
//   };

//   // Mark message as read
//   const markMessageAsRead = async (messageId) => {
//     try {
//       await fetch(
//         `${API_BASE_URL}/chats/messages/${messageId}/read?userId=${selectedUserId}`,
//         {
//           method: "PUT",
//           headers: getApiHeaders(),
//         }
//       );
//     } catch (err) {
//       console.error("❌ Mark Read Error:", err);
//     }
//   };

//   // Get unread message count
//   const fetchUnreadCount = async () => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/chats/user/${selectedUserId}/unread-count`,
//         {
//           method: "GET",
//           headers: getApiHeaders(),
//         }
//       );
//       if (response.ok) return await response.json();
//     } catch (err) {
//       console.error("❌ Unread Count Error:", err);
//     }
//     return 0;
//   };

//   // WebSocket connection
//   useEffect(() => {
//     const connectWebSocket = () => {
//       try {
//         const ws = new WebSocket("ws://localhost:8080/ws-direct");
//         ws.onopen = () => {
//           console.log("✅ WebSocket Connected");
//           setConnected(true);
//           setError(null);
//           retryCount.current = 0;
//           fetchInboxData();
//         };
//         ws.onmessage = (event) => {
//           try {
//             const data = JSON.parse(event.data);
//             switch (data.type) {
//               case "NEW_MESSAGE":
//                 updateInboxWithNewMessage(data.message);
//                 break;
//               case "TYPING":
//                 updateTypingState(data.chatId, data.userId, data.isTyping);
//                 break;
//               case "MESSAGE_READ":
//                 handleMessageRead(data.messageId, data.userId);
//                 break;
//               default:
//                 console.log("Unknown WebSocket message type:", data.type);
//             }
//           } catch (err) {
//             console.error("Error parsing WebSocket message:", err);
//           }
//         };
//         ws.onerror = (error) => {
//           console.error("❌ WebSocket Error:", error);
//           setConnected(false);
//         };
//         ws.onclose = () => {
//           console.log("🔌 WebSocket Disconnected");
//           setConnected(false);
//           if (retryCount.current < maxRetries) {
//             retryCount.current += 1;
//             const delay = Math.min(
//               1000 * Math.pow(2, retryCount.current),
//               30000
//             );
//             console.log(`🔄 Retrying WebSocket in ${delay / 1000} seconds...`);
//             setTimeout(connectWebSocket, delay);
//           } else {
//             setError("Failed to connect to WebSocket after multiple attempts");
//           }
//         };
//         setWebsocket(ws);
//       } catch (err) {
//         console.error("❌ WebSocket Connection Error:", err);
//         setError("Failed to initialize WebSocket: " + err.message);
//         setLoading(false);
//         fetchInboxData();
//       }
//     };
//     connectWebSocket();
//     return () => websocket?.close();
//   }, []);

//   // Send message (REST + WebSocket)
//   const sendMessage = async (message) => {
//     if (!selectedChat || !message.trim()) return;
//     try {
//       await sendMessageViaAPI(selectedChat, message.trim());
//       if (websocket?.readyState === WebSocket.OPEN) {
//         websocket.send(
//           JSON.stringify({
//             type: "SEND_MESSAGE",
//             chatId: selectedChat,
//             senderId: selectedUserId,
//             message: message.trim(),
//             timestamp: new Date().toISOString(),
//           })
//         );
//       }
//     } catch (err) {
//       console.error("❌ Send Message Failed:", err);
//       setError("Failed to send message. Please try again.");
//     }
//   };

//   // Handle chat selection
//   const handleChatSelect = async (chatId) => {
//     setSelectedChat(chatId);
//     const messages = await fetchChatMessages(chatId);
//     setInboxData((prev) =>
//       prev.map((chat) => {
//         if (chat.id === chatId) {
//           messages.forEach(
//             (msg) =>
//               !msg.isRead &&
//               msg.receiverId === selectedUserId &&
//               markMessageAsRead(msg.id)
//           );
//           return { ...chat, unreadCount: 0, messages };
//         }
//         return chat;
//       })
//     );
//   };

//   // WebSocket message handlers
//   const updateInboxWithNewMessage = (messageData) => {
//     setInboxData((prev) =>
//       prev.map((chat) => {
//         if (chat.id === messageData.chatId) {
//           const newMessages = [...(chat.messages || []), messageData];
//           return {
//             ...chat,
//             lastMessage: messageData.message,
//             timestamp: formatTime(
//               messageData.timestamp || new Date().toISOString()
//             ),
//             unreadCount:
//               messageData.senderId !== selectedUserId
//                 ? chat.unreadCount + 1
//                 : chat.unreadCount,
//             messages: newMessages,
//           };
//         }
//         return chat;
//       })
//     );
//   };

//   const handleMessageRead = (messageId, userId) => {
//     console.log("👁️ Message read:", messageId, "by user:", userId);
//   };

//   const updateTypingState = (chatId, userId, isTyping) => {
//     const timeoutKey = `${chatId}_${userId}`;
//     setTypingStates((prev) => ({ ...prev, [timeoutKey]: isTyping }));
//     if (typingTimeouts.current[timeoutKey])
//       clearTimeout(typingTimeouts.current[timeoutKey]);
//     if (isTyping) {
//       typingTimeouts.current[timeoutKey] = setTimeout(() => {
//         setTypingStates((prev) => ({ ...prev, [timeoutKey]: false }));
//       }, 3000);
//     }
//   };

//   const sendTypingIndicator = (chatId, userId, isTyping) => {
//     if (websocket?.readyState === WebSocket.OPEN) {
//       websocket.send(
//         JSON.stringify({
//           type: "TYPING",
//           chatId,
//           userId,
//           isTyping,
//           timestamp: new Date().toISOString(),
//         })
//       );
//     }
//   };

//   const getTypingState = (chatId, userId) =>
//     typingStates[`${chatId}_${userId}`] || false;

//   const formatTime = (timestamp) => {
//     try {
//       const date = new Date(timestamp);
//       const now = new Date();
//       const diffTime = Math.abs(now - date);
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       if (diffDays === 1) return "Yesterday";
//       if (diffDays > 1) return `${diffDays} DAY${diffDays > 1 ? "S" : ""} AGO`;
//       return date.toLocaleTimeString("en-US", {
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
//       });
//     } catch (err) {
//       return "Just now";
//     }
//   };

//   const enhancedInboxData = inboxData.map((chat) => ({
//     ...chat,
//     isUserTyping: getTypingState(chat.id, selectedUserId),
//     isContactTyping: getTypingState(
//       chat.id,
//       chat.sellerId === selectedUserId ? chat.buyerId : chat.sellerId
//     ),
//   }));

//   const selectedChatData = enhancedInboxData.find(
//     (chat) => chat.id === selectedChat
//   );

//   const handleRefresh = async () => {
//     setError(null);
//     await fetchInboxData();
//   };

//   // Render loading state
//   if (loading) {
//     return (
//       <div className="flex h-full bg-gray-100 items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading chats...</p>
//         </div>
//       </div>
//     );
//   }

//   // Render error state
//   if (error && inboxData.length === 0) {
//     return (
//       <div className="flex h-full bg-gray-100 items-center justify-center">
//         <div className="text-center p-8 max-w-md">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <h2 className="text-xl font-bold text-gray-900 mb-4">
//             Connection Error
//           </h2>
//           <p className="text-gray-600 mb-6 text-sm">{error}</p>
//           <div className="space-y-3">
//             <button
//               onClick={handleRefresh}
//               className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//             >
//               Retry Connection
//             </button>
//             <button
//               onClick={onBack}
//               className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Render empty state
//   if (inboxData.length === 0) {
//     return (
//       <div className="flex h-full bg-gray-100 items-center justify-center">
//         <div className="text-center p-8">
//           <div className="text-gray-400 text-6xl mb-4">💬</div>
//           <h2 className="text-xl font-bold text-gray-900 mb-2">No Chats</h2>
//           <p className="text-gray-600 mb-4">
//             No conversations available for this user.
//           </p>
//           <div className="space-y-2">
//             <button
//               onClick={handleRefresh}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//             >
//               Refresh
//             </button>
//             <button
//               onClick={onBack}
//               className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Main render
//   return (
//     <div className="flex h-full bg-gray-100 relative">
//       {/* Connection Status */}
//       <div
//         className={`absolute top-0 left-0 right-0 text-white text-center py-1 text-xs z-10 ${
//           connected ? "bg-green-500" : "bg-yellow-500"
//         }`}
//       >
//         {connected ? "✅ WebSocket Connected" : "⚡ REST API Mode"}
//       </div>
//       {/* Error notification */}
//       {error && (
//         <div className="absolute top-6 left-0 right-0 bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-sm z-10">
//           <span className="block sm:inline">{error}</span>
//           <button
//             onClick={() => setError(null)}
//             className="float-right text-red-900 hover:text-red-700 ml-2"
//           >
//             ✕
//           </button>
//         </div>
//       )}
//       {/* Inbox Sidebar */}
//       <div className="w-1/3 min-w-[400px] bg-white border-r border-gray-200 flex flex-col h-full">
//         <InboxSidebar
//           inboxData={enhancedInboxData}
//           selectedChat={selectedChat}
//           onChatSelect={handleChatSelect}
//           onBack={onBack}
//           typingStates={typingStates}
//           connected={connected}
//           onRefresh={handleRefresh}
//         />
//       </div>
//       {/* Chat Panel */}
//       <div className="flex-1 flex flex-col h-full">
//         {selectedChatData ? (
//           <ChatPanel
//             chatId={selectedChat}
//             userId={selectedUserId}
//             contactData={selectedChatData}
//             onTypingChange={updateTypingState}
//             getTypingState={getTypingState}
//             websocket={websocket}
//             sendMessage={sendMessage}
//             connected={connected}
//             messages={selectedChatData.messages || []}
//             onMarkAsRead={markMessageAsRead}
//           />
//         ) : (
//           <div className="flex items-center justify-center h-full bg-gray-50">
//             <div className="text-center">
//               <div className="text-gray-400 text-6xl mb-4">💬</div>
//               <p className="text-gray-600">Select a chat to start messaging</p>
//               <p className="text-sm text-gray-500 mt-2">
//                 {inboxData.length} chat{inboxData.length !== 1 ? "s" : ""}{" "}
//                 available
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatContainer;
