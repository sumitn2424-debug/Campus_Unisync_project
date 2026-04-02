import { useState } from "react";
import {
  FaRegHeart,
  FaHeart,
  FaRegComment,
  FaBookmark,
  FaRegBookmark,
  FaShare,
} from "react-icons/fa";

export default function Post() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(245);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-start p-2 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border">

        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <img
              src="https://i.pravatar.cc/150?img=5"
              alt="user"
              className="w-9 h-9 rounded-full"
            />
            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                Sumit Dev
              </h3>
              <p className="text-xs text-gray-500">New Delhi • 1h</p>
            </div>
          </div>
          <button className="text-gray-500 text-lg">⋮</button>
        </div>

        {/* Image */}
        <div className="w-full">
          <img
            src="https://source.unsplash.com/random/600x500?nature"
            alt="post"
            className="w-full h-64 sm:h-80 object-cover"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center px-3 py-2">
          <div className="flex gap-4 text-lg">
            <button onClick={toggleLike}>
              {liked ? (
                <FaHeart className="text-rose-500" />
              ) : (
                <FaRegHeart className="text-gray-700" />
              )}
            </button>

            <FaRegComment className="text-gray-700 cursor-pointer" />
            <FaShare className="text-gray-700 cursor-pointer" />
          </div>

          <button onClick={() => setSaved(!saved)}>
            {saved ? (
              <FaBookmark className="text-blue-500" />
            ) : (
              <FaRegBookmark className="text-gray-700" />
            )}
          </button>
        </div>

        {/* Likes */}
        <div className="px-3 text-sm font-semibold text-gray-800">
          {likes} likes
        </div>

        {/* Caption */}
        <div className="px-3 py-1 text-sm text-gray-800">
          <span className="font-semibold mr-1">sumit_dev</span>
          Building a modern UI with React + Tailwind 🚀  
          <span className="text-blue-500 ml-1">
            #webdev #reactjs #tailwindcss
          </span>
        </div>

        {/* Comments */}
        <div className="px-3 text-sm text-gray-500">
          View all 18 comments
        </div>

        {/* Comment Input */}
        <div className="flex items-center border-t px-3 py-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 text-sm outline-none"
          />
          <button className="text-blue-500 text-sm font-semibold">
            Post
          </button>
        </div>
      </div>
    </div>
  );
}