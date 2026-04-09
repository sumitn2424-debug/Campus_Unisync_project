import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatList from "../components/ChatList";
import Chat from "../components/Chat";
import { useAuth } from "../hooks/useAuth";

export default function Messages() {
  const location = useLocation();
  const [selectedUser, setSelectedUser] = useState(null);
  const { userInformation } = useAuth();
  const currentUserId = userInformation?._id;

  useEffect(() => {
    if (location.state) {
      setSelectedUser(location.state);
    }
  }, [location.state]);

  return (
    <div className="flex h-screen">
      
      {/* LEFT */}
      <div className="w-1/4 border-r p-3">
        <ChatList onSelectUser={setSelectedUser} currentUserId={currentUserId} />
      </div>

      {/* RIGHT */}
      <div className="w-3/4 p-3">
        {selectedUser ? (
          <Chat
            currentUserId={currentUserId}
            friendId={selectedUser.userId}
            username={selectedUser.username}
          />
        ) : (
          <p className="text-center mt-5 text-gray-500">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
}