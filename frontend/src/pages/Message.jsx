import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatList from "../components/ChatList";
import Chat from "../components/Chat";

export default function Messages() {
  const location = useLocation();
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (location.state) {
      setSelectedUser(location.state);
    }
  }, [location.state]);

  const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;

  return (
    <div className="flex h-screen">
      
      {/* LEFT */}
      <div className="w-1/3 border-r p-3">
        <ChatList onSelectUser={setSelectedUser} />
      </div>

      {/* RIGHT */}
      <div className="w-2/3 p-3">
        {selectedUser ? (
          <Chat
            currentUserId={currentUserId}
            friendId={selectedUser.userId}
            username={selectedUser.username}
          />
        ) : (
          <p>Select a user</p>
        )}
      </div>
    </div>
  );
}