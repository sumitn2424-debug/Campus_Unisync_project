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
    <div className="flex h-screen bg-gray-50">
      {/* MOBILE VIEW */}
      <div className="w-full md:flex md:h-full">
        {/* LEFT: Chat List */}
        {!selectedUser && (
          <div className="w-full md:w-1/4 border-r p-3">
            <h2 className="text-xl font-semibold mb-3">Chats</h2>
            <ChatList onSelectUser={setSelectedUser} currentUserId={currentUserId} />
          </div>
        )}

        {/* RIGHT: Chat Window */}
        {selectedUser && (
          <div className="w-full md:w-3/4 flex flex-col h-full p-3 bg-white shadow-md">
            {/* Header with Back Button */}
            <div className="flex items-center mb-3 border-b pb-2">
              <button
                className="md:hidden mr-3 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                onClick={() => setSelectedUser(null)}
              >
                &#8592; {/* Back Arrow */}
              </button>
              <h3 className="font-semibold text-lg">{selectedUser.username}</h3>
            </div>

            {/* Chat Component */}
            <div className="flex-1 overflow-hidden">
              <Chat
                currentUserId={currentUserId}
                friendId={selectedUser.userId}
                username={selectedUser.username}
              />
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:flex md:w-1/4 border-r p-3">
        <h2 className="text-xl font-semibold mb-3">Chats</h2>
        <ChatList onSelectUser={setSelectedUser} currentUserId={currentUserId} />
      </div>

      <div className="hidden md:flex md:w-3/4 p-3">
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