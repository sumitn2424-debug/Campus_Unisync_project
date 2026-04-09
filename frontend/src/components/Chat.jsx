import { useState, useEffect, useRef } from "react";
import { socket } from "../socket";
import api from "../services/api";

export default function Chat({ currentUserId, friendId, username }) {
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
      }
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [currentUserId, friendId]);

  const handleSend = () => {
    if (!message.trim()) return;
    const msgObj = { senderId: currentUserId, receiverId: friendId, text: message };
    socket.emit("send_message", msgObj);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[50vh] max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* HEADER */}
      <div className="bg-blue-500 text-white p-3 flex items-center justify-between">
        <h3 className="font-semibold text-lg">{username}</h3>
      </div>

      {/* MESSAGE AREA */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-100">
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex ${m.senderId === currentUserId ? "justify-end" : "justify-start"}`}
          >
            <span 
              className={`px-3 py-2 rounded-lg max-w-[70%] break-words ${
                m.senderId === currentUserId 
                ? "bg-blue-500 text-white rounded-br-none" 
                : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-2 border-t flex items-center bg-white">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-500 text-white rounded-full px-3 py-2 shadow-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}