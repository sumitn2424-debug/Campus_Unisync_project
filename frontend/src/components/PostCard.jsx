// PostCard.jsx
import  { useState } from "react";
import { FaHeart, FaRegHeart, FaComment, FaShare, FaBookmark, FaRegBookmark } from "react-icons/fa";
import usePost from "../hooks/usePost";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const { likePost , savePost} = usePost();
  // Button states
  const [liked, setLiked] = useState(false);
  const [commented, setCommented] = useState(false);
  const [shared, setShared] = useState(false);
  const [saved, setSaved] = useState(false);
console.log(post._id)
  const handleLike = async () => {
    const res = await likePost(post._id);
    console.log(res.data)
    if(!res) return ;
    setLiked(res.isLiked);
  };

  const handleSave = async () => {
    const res = await savePost(post._id);
    console.log(res.data)
    // console.log(res.data.isSaved)
    if(!res) return ;
    setSaved(res.data.isSaved);
  };

  const handleShare = () => {
    navigate("Message");
  };
  const sharePost = () => {
    socket.emit("sharePost", {
      toUserId: "FRIEND_ID",
      post
    });
  };

  return (
    <div className="bg-white rounded-xl shadow mb-6 w-full max-w-xl mx-auto">
      {/* Profile section */}
      <div className="flex items-center p-3">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 p-1 flex-shrink-0">
          <div className="bg-white w-full h-full rounded-full overflow-hidden">
            <img
              src={post.userId?.image || "https://via.placeholder.com/150"}
              alt={post.userId?.username || "Unknown User"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="ml-3 font-semibold text-gray-800">
          {post.userId?.username || "Unknown User"}
        </div>
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
        <button onClick={() =>{
           handleLike()
        }}>
          {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
        </button>

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