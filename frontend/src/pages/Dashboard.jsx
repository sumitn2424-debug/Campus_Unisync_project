import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiMessageCircle, FiSend, FiBookmark, FiMoreHorizontal } from 'react-icons/fi';
import api from '../services/api';

// Helper for 'time ago' formatting
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";
  return Math.floor(seconds) + "s";
};

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await api.get('/data/fetchData');
        setPosts(response.data.data || []);
      } catch (err) {
        setError('Failed to load your feed. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-center mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl mx-auto py-6 animate-in fade-in duration-500">
      
      {/* Feed Column */}
      <div className="col-span-1 lg:col-span-2 flex flex-col items-center space-y-8">
        {posts.length === 0 ? (
          <div className="text-slate-400 mt-10 text-center">
            No posts yet. Be the first to post!
          </div>
        ) : (
          posts.map((post, idx) => (
            <div key={post._id || idx} className="glass-panel w-full max-w-[470px] rounded-lg border-slate-700/80 overflow-hidden bg-slate-900/80">
              
              {/* Post Header */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-primary-500 p-[2px]">
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden">
                       {post.username?.charAt(0) || 'U'}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-1">
                      {post.username} 
                      <span className="text-slate-500 font-normal"> • {timeAgo(post.createdAt)}</span>
                    </h3>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-200">
                  <FiMoreHorizontal size={20} />
                </button>
              </div>

              {/* Post Image */}
              <div className="w-full bg-black min-h-[300px] max-h-[600px] flex items-center justify-center border-y border-slate-800 overflow-hidden">
                {post.image ? (
                  <img 
                    src={post.image} 
                    alt={post.title || 'Post'} 
                    className="w-full max-h-[600px] object-contain"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-slate-600 text-sm py-24">No Image Available</div>
                )}
              </div>

              {/* Post Actions */}
              <div className="p-3 pb-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                     <button className="text-slate-100 hover:text-red-500 transition-colors transform hover:scale-110">
                       <FiHeart size={24} />
                     </button>
                     <button className="text-slate-100 hover:text-slate-300 transition-colors transform hover:scale-110">
                       <FiMessageCircle size={24} />
                     </button>
                     <button className="text-slate-100 hover:text-slate-300 transition-colors transform hover:scale-110">
                       <FiSend size={24} />
                     </button>
                  </div>
                  <button className="text-slate-100 hover:text-slate-300 transition-colors">
                    <FiBookmark size={24} />
                  </button>
                </div>
                <div className="font-semibold text-sm text-slate-100 mb-1">
                   {Math.floor(Math.random() * 100) + 12} likes
                </div>
              </div>

              {/* Post Caption */}
              <div className="px-3 pb-4 text-sm">
                <p>
                  <span className="font-semibold text-slate-100 mr-2">{post.username}</span>
                  <span className="text-slate-200">{post.title}</span>
                </p>
                {post.description && (
                  <p className="text-slate-400 mt-1 line-clamp-2">{post.description}</p>
                )}
                <button className="text-slate-500 mt-1 uppercase text-[10px] tracking-wide font-semibold">
                  Add a comment...
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right Sidebar (Desktop only) */}
      <div className="hidden lg:block col-span-1">
        <div className="sticky top-24 pt-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 shadow-inner flex items-center justify-center">
                 <span className="text-lg font-bold text-white uppercase">{user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-100">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-primary-400 hover:text-primary-300">Switch</button>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-400">Suggested for you</p>
            <button className="text-xs font-semibold text-slate-200">See All</button>
          </div>

          <div className="space-y-4">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                    S{i}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200 truncate">Suggested User {i}</p>
                    <p className="text-[11px] text-slate-500 truncate">New to NeoApp</p>
                  </div>
                  <button className="text-xs font-semibold text-primary-400 hover:text-white">Follow</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-[11px] text-slate-600 space-y-4">
            <p className="flex flex-wrap gap-x-2">
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Help</a>
              <a href="#" className="hover:underline">Press</a>
              <a href="#" className="hover:underline">API</a>
              <a href="#" className="hover:underline">Jobs</a>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
            </p>
            <p>© 2026 NEOAPP FROM ANTIGRAVITY</p>
          </div>
        </div>
      </div>

    </div>
  );
}
