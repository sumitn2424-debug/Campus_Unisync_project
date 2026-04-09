import { useEffect, useState } from "react";
import api from "../services/api";
import { socket } from "../socket";

export default function ChatList({ onSelectUser, currentUserId }) {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/all-users");
        setUsers(res.data.filter(u => u._id !== currentUserId));
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
    socket.emit("user_connected", currentUserId);
    socket.on("online_users", setOnlineUsers);

    return () => socket.off("online_users");
  }, [currentUserId]);

  return (
    <div className="w-1/3 border-r p-2">
      {users.map(user => (
        <div
          key={user._id}
          onClick={() => onSelectUser({ userId: user._id, username: user.username })}
          className={`p-2 cursor-pointer border mb-1 ${onlineUsers.includes(user._id) ? "bg-green-100" : "bg-gray-100"}`}
        >
          {user.username} {onlineUsers.includes(user._id) && "(Online)"}
        </div>
      ))}
    </div>
  );
}