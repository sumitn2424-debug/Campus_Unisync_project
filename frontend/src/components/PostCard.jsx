// PostCard.jsx
import  { useState } from "react";
import { FaHeart, FaRegHeart, FaComment, FaShare, FaBookmark, FaRegBookmark, FaTrash } from "react-icons/fa";
import usePost from "../hooks/usePost";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import toast from "react-hot-toast";

export default function PostCard({ post, onDelete }) {
  const navigate = useNavigate();
  const { userInformation } = useAuth();
  const { likePost , savePost} = usePost();
  
  // Button states initialized from post data
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [commented, setCommented] = useState(false);
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState(post.isSaved || false);

  const handleLike = async () => {
    const res = await likePost(post._id);
    if(!res) return ;
    setLiked(res.isLiked);
    setLikeCount(res.likeCount);
  };


  const handleSave = async () => {
    const res = await savePost(post._id);
    if(!res) return ;
    setSaved(res.data.isSaved);
  };

  const handleShare = () => {
    navigate("/Message", { state: { sharedPost: post } });
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    const loadingToast = toast.loading("Deleting post...");
    try {
      await api.delete("/post/delete-Post", { data: { postId: post._id } });
      toast.success("Post deleted successfully!", { id: loadingToast });
      if (onDelete) {
        onDelete(post._id);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete post", { id: loadingToast });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow mb-6 w-full max-w-xl mx-auto overflow-hidden">
      {/* Profile section */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full flex-shrink-0 border border-gray-200">
            <img
              src={post.userId?.image || "https://via.placeholder.com/150"}
              alt={post.userId?.username || "Unknown User"}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="ml-3 font-semibold text-gray-800">
            {post.userId?.username || "Unknown User"}
          </div>
        </div>
        
        {/* Delete Button (Visible to owner OR Admin) */}
        {(userInformation?._id === post.userId?._id || userInformation?.role === "admin") && (
          <button 
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
            title="Delete Post"
          >
            <FaTrash size={16} />
          </button>
        )}
      </div>

      {/* Post Image */}
      <div className="w-full flex justify-center bg-gray-50">
        <img
          src={post.image}
          alt={post.title || "Post"}
          className="w-full max-h-[60vh] object-contain"
        />
      </div>

      {/* Actions */}
      <div className="p-3 flex justify-between text-gray-600 text-xl">
        {/* Like */}
        <div className="flex items-center space-x-1">
          <button onClick={() =>{
             handleLike()
          }}>
            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
          <span className="text-sm">{likeCount}</span>
        </div>

        {/* Comment */}
        {/* <button onClick={() => setCommented(!commented)}>
          <FaComment className={commented ? "text-blue-500" : "text-gray-400"} />
        </button> */}

        {/* Share */}
        <button onClick={() => {
          handleShare()
        }}>
          <FaShare className={shared ? "text-green-500" : "text-gray-400"} />
        </button>

        {/* Save */}
        <button onClick={() =>{
           handleSave()
        }}>
          {saved ? <FaBookmark className="to-blue-500" /> : <FaRegBookmark />}
        </button>
      </div>

      {/* Post title & description */}
      <div className="px-3 pb-3">
        <div className="font-semibold text-gray-800">{post.title}</div>
        {post.description && (
          <div className="text-gray-600 text-sm mt-1">{post.description}</div>
        )}
      </div>
    </div>
  );
}