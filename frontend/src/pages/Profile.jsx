import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import PostProvider from "../context/PostContext";

export default function Profile() {
  const { userInformation, logOut } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInformation?._id) return;

    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/data/fetchPosts?userId=${userInformation._id}&limit=50`);
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch user posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userInformation]);

  if (!userInformation) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col sm:flex-row items-center gap-6">
        <img 
          src={userInformation.image || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
          alt="Profile" 
          className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-sm"
        />
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{userInformation.username}</h1>
          <p className="text-gray-500 mb-4">{userInformation.email}</p>
        </div>
        <button 
          onClick={logOut}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm whitespace-nowrap"
        >
          Logout
        </button>
      </div>

      {/* User Posts section */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">My Posts</h2>
        {loading ? (
          <Loader />
        ) : posts.length > 0 ? (
          <PostProvider>
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </PostProvider>
        ) : (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">You haven't created any posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}