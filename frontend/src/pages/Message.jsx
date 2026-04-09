import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatList from "../components/ChatList";
import Chat from "../components/Chat";
import { useAuth } from "../hooks/useAuth";

export default function Messages() {
  const location = useLocation();
  const [selectedUser, setSelectedUser] = useState(null);
  const [carriedPost, setCarriedPost] = useState(null);
  const { userInformation } = useAuth();
  const currentUserId = userInformation?._id;

  useEffect(() => {
    if (location.state) {
      if (location.state.userId) {
        setSelectedUser(location.state);
      }
      if (location.state.sharedPost) {
        setCarriedPost(location.state.sharedPost);
      }
    }
  }, [location.state]);

  // Anchor the Messages UI between the top and the fixed Footer
  return (
    <div className="fixed top-0 bottom-[56px] left-0 right-0 bg-gray-50 flex overflow-hidden">
      
      {/* SIDEBAR */}
      <div className={`
        ${selectedUser ? "hidden md:flex" : "flex"} 
        w-full md:w-1/3 lg:w-1/4 border-r p-4 flex-col bg-white
      `}>
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => navigate("/home")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            title="Back to Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          <ChatList onSelectUser={setSelectedUser} currentUserId={currentUserId} />
        </div>
      </div>

      {/* CHAT WINDOW */}
      <div className={`
        ${selectedUser ? "flex" : "hidden md:flex"} 
        flex-1 flex-col bg-white
      `}>
        {selectedUser ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center p-4 border-b bg-white">
              <button
                className="md:hidden mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                onClick={() => setSelectedUser(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 overflow-hidden">
                  {selectedUser.image ? (
                    <img src={selectedUser.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    selectedUser.username[0].toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 leading-tight">{selectedUser.username}</h3>
                  <span className="text-xs text-green-500 font-medium">Active now</span>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-hidden relative">
              <Chat
                currentUserId={currentUserId}
                friendId={selectedUser.userId}
                username={selectedUser.username}
                sharedPost={carriedPost}
                onShared={() => setCarriedPost(null)}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600">Your Messages</h3>
            <p className="max-w-xs mt-2">Select a person from the left to start a conversation or share a post.</p>
          </div>
        )}
      </div>
    </div>
  );
}