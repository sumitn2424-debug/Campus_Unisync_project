import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="glass-panel sticky top-4 mx-4 md:mx-auto mb-8 max-w-5xl rounded-2xl z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-primary-500 to-purple-400 bg-clip-text text-transparent">
          NeoApp
        </Link>
        <div className="flex gap-4">
          <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
          <Link to="/post" className="text-slate-300 hover:text-white transition-colors">Post</Link>
          <Link to="/store" className="text-slate-300 hover:text-white transition-colors">Store</Link>
          <Link to="/chat" className="text-slate-300 hover:text-white transition-colors">Chat</Link>
          <Link to="/feedback" className="text-slate-300 hover:text-white transition-colors">Feedback</Link>
        </div>
        <button onClick={handleLogout} className="text-sm font-medium hover:text-red-400 transition-colors">
          Logout
        </button>
      </div>
    </nav>
  );
}
