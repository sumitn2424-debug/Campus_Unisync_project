import { useEffect, useState } from "react";
import api from "../services/api";
import { socket } from "../socket";

export default function ChatList({ onSelectUser, currentUserId }) {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    const fetchUsersAndUnread = async () => {
      try {
        const [usersRes, unreadRes] = await Promise.all([
          api.get("/auth/all-users"),
          api.get(`/chat/unread-counts?userId=${currentUserId}`)
        ]);
        setUsers(usersRes.data.filter(u => u._id !== currentUserId));
        setUnreadCounts(unreadRes.data);
      } catch (err) {
        console.error("Error fetching chat data:", err);
      }
    };

    if (currentUserId) {
        fetchUsersAndUnread();
        socket.emit("user_connected", currentUserId);
    }
    
    socket.on("online_users", setOnlineUsers);

    // Listen for new messages to update unread counts
    const handleNewMessage = (msg) => {
        if (msg.receiverId === currentUserId) {
             setUnreadCounts(prev => ({
                 ...prev,
                 [msg.senderId]: (prev[msg.senderId] || 0) + 1
             }));
        }
    };
    socket.on("receive_message", handleNewMessage);

    return () => {
        socket.off("online_users");
        socket.off("receive_message", handleNewMessage);
    };
  }, [currentUserId]);

  const handleSelect = (user) => {
      setUnreadCounts(prev => ({ ...prev, [user._id]: 0 }));
      onSelectUser({ userId: user._id, username: user.username, image: user.image });
  };

  return (
    <div className="w-full flex flex-col gap-2 overflow-y-auto">
      {users.map(user => {
        const isOnline = onlineUsers.includes(user._id);
        const unreadCount = unreadCounts[user._id] || 0;

        return (
          <div
            key={user._id}
            onClick={() => handleSelect(user)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border relative ${
              isOnline ? "bg-white border-green-200 hover:shadow-md" : "bg-gray-50 border-gray-100 hover:bg-gray-100"
            }`}
          >
            <div className="relative">
              <img 
                src={user.image || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
                alt={`${user.username} avatar`} 
                className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <span className="font-semibold text-gray-800 truncate">{user.username}</span>
              <span className={`text-xs truncate ${isOnline ? "text-green-600 font-medium" : "text-gray-400"}`}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
            
            {/* Unread Badge */}
            {unreadCount > 0 && (
              <div className="bg-red-500 text-white text-[10px] font-bold h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-bounce-short">
                {unreadCount}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}