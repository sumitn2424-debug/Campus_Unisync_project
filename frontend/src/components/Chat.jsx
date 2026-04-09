import { useState, useEffect, useRef } from "react";
import { socket } from "../socket";

export default function Chat({ currentUserId, friendId, username }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  useEffect(() => {
    if (!currentUserId) return;
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
    setMessages(prev => [...prev, msgObj]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full border p-3 rounded max-w-md mx-auto">
      <div className="border-b mb-2 pb-2"><h3>{username}</h3></div>
      <div className="flex-1 overflow-y-auto border p-2">
        {messages.map((m, i) => (
          <div key={i} className={m.senderId === currentUserId ? "text-right" : ""}>
            <span className="bg-gray-200 px-3 py-1 rounded inline-block my-1">{m.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex mt-2">
        <input className="flex-1 border p-2" value={message} onChange={e => setMessage(e.target.value)} />
        <button onClick={handleSend} className="bg-blue-500 text-white px-3 ml-2">Send</button>
      </div>
    </div>
  );
}