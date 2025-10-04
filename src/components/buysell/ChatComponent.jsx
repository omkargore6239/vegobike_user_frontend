// import React, { useState, useRef, useEffect } from "react";
// import { ArrowLeft, Send, Mic } from "lucide-react";

// const ChatComponent = ({
//   chatId = 1,
//   userId = 123,
//   contactName = "Vego Bike",
//   contactAvatar = "https://via.placeholder.com/40x40/FF5722/FFFFFF?text=VB",
//   onBack,
// }) => {
//   const [newMessage, setNewMessage] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       chatId: 1,
//       senderId: 456,
//       message: "hello",
//       messageType: "TEXT",
//       timestamp: "2025-09-30T10:31:00Z",
//       isRead: true,
//     },
//     {
//       id: 2,
//       chatId: 1,
//       senderId: 456,
//       message: "hello",
//       messageType: "TEXT",
//       timestamp: "2025-09-30T10:32:00Z",
//       isRead: true,
//     },
//   ]);
//   const [connected] = useState(true);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleSendMessage = () => {
//     if (newMessage.trim()) {
//       const newMsg = {
//         id: messages.length + 1,
//         chatId: chatId,
//         senderId: userId,
//         message: newMessage.trim(),
//         messageType: "TEXT",
//         timestamp: new Date().toISOString(),
//         isRead: false,
//       };

//       setMessages((prev) => [...prev, newMsg]);
//       setNewMessage("");

//       setTimeout(() => {
//         setMessages((prev) =>
//           prev.map((msg) =>
//             msg.id === newMsg.id ? { ...msg, isRead: true } : msg
//           )
//         );
//       }, 2000);
//     }
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
//                     connected ? "bg-green-400" : "bg-gray-400"
//                   }`}
//                 ></div>
//                 {connected ? "Online" : "Connecting..."}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Phone button removed from header */}
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
//         {messages.map((message, index) => {
//           const isMine = isMyMessage(message);

//           // Removed VOICE_CALL message type handling

//           return (
//             <div
//               key={index}
//               className={`flex ${isMine ? "justify-end" : "justify-start"}`}
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
//         <div className="flex items-center space-x-3">
//           <div className="flex-1 relative">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Type a message"
//               className="w-full px-4 py-3 bg-gray-100 rounded-full border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//             />
//           </div>

//           <button
//             onClick={handleSendMessage}
//             disabled={!newMessage.trim()}
//             className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//           >
//             <Send size={20} />
//           </button>

//           <button
//             onMouseDown={() => setIsRecording(true)}
//             onMouseUp={() => setIsRecording(false)}
//             onMouseLeave={() => setIsRecording(false)}
//             className={`p-3 rounded-full transition-colors ${
//               isRecording
//                 ? "bg-red-500 text-white animate-pulse"
//                 : "bg-gray-200 text-gray-600 hover:bg-gray-300"
//             }`}
//           >
//             <Mic size={20} />
//           </button>
//         </div>

//         {isRecording && (
//           <div className="text-center text-red-500 text-xs mt-2 animate-pulse">
//             🔴 Recording... Release to send
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatComponent;
