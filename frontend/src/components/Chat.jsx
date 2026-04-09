import { useState, useEffect, useRef } from "react";
import { socket } from "../socket";
import api from "../services/api";

export default function Chat({ currentUserId, friendId, username, sharedPost, onShared }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  useEffect(() => {
    if (!currentUserId || !friendId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/messages?senderId=${currentUserId}&receiverId=${friendId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();

    socket.emit("user_connected", currentUserId);

    const handleReceive = msg => {
      if ((msg.senderId === friendId && msg.receiverId === currentUserId) ||
          (msg.senderId === currentUserId && msg.receiverId === friendId)) {
        setMessages(prev => [...prev, msg]);
        
        // Mark as read if it came from the friend and we are in the chat
        if (msg.senderId === friendId) {
            api.post("/chat/mark-read", { senderId: friendId, receiverId: currentUserId })
               .catch(err => console.error("Error marking as read:", err));
        }
      }
    };

    socket.on("receive_message", handleReceive);

    // Mark existing messages as read when joining chat
    api.post("/chat/mark-read", { senderId: friendId, receiverId: currentUserId })
       .catch(err => console.error("Error marking as read on mount:", err));

    return () => socket.off("receive_message", handleReceive);
  }, [currentUserId, friendId]);

  const handleSend = () => {
    if (!message.trim()) return;
    const msgObj = { senderId: currentUserId, receiverId: friendId, text: message };
    socket.emit("send_message", msgObj);
    setMessage("");
  };

  const handleSharePost = () => {
    if (!sharedPost) return;
    const shareText = `Check out this post: ${sharedPost.title}\n${sharedPost.image}`;
    const msgObj = { senderId: currentUserId, receiverId: friendId, text: shareText };
    socket.emit("send_message", msgObj);
    onShared();
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
      {/* MESSAGE AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0 overscroll-contain">
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex flex-col ${m.senderId === currentUserId ? "items-end" : "items-start"}`}
          >
            <div 
              className={`px-4 py-2 rounded-2xl max-w-[80%] break-words shadow-sm ${
                m.senderId === currentUserId 
                ? "bg-blue-600 text-white rounded-tr-none" 
                : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
              }`}
            >
              {m.text.split("\n").map((line, idx) => (
                <div key={idx}>
                  {line.startsWith("http") ? (
                    <img 
                      src={line} 
                      alt="Preview" 
                      className="max-w-full h-auto rounded-lg mt-1 mb-1 shadow-sm block" 
                    />
                  ) : line}
                </div>
              ))}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 px-1">
              {formatTime(m.createdAt)}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* SHARED POST PREVIEW & INPUT AREA (Fixed at bottom) */}
      <div className="sticky bottom-0 w-full bg-white border-t border-gray-100 z-10">
        {sharedPost && (
          <div className="p-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 flex-shrink-0">
                <img src={sharedPost.image} alt="Thumbnail" className="w-full h-full rounded object-cover shadow-sm border border-blue-200" />
              </div>
              <div className="text-sm min-w-0">
                <p className="font-semibold text-blue-900 leading-tight">Share this post?</p>
                <p className="text-blue-700 truncate">{sharedPost.title}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button 
                onClick={onShared}
                className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 bg-white rounded-full border border-gray-200 shadow-sm transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSharePost}
                className="px-4 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-md transition-all active:scale-95"
              >
                Share Now
              </button>
            </div>
          </div>
        )}

        <div className="p-3 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white rounded-full p-2.5 shadow-md hover:bg-blue-700 transition-all active:scale-90"
            title="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}