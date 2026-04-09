import { useNavigate, useLocation } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAtHome = location.pathname === "/home";

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm py-3 px-4 flex items-center justify-between">
      <div className="w-10">
        {!isAtHome && (
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 active:scale-90"
            title="Go Back"
          >
            <FaChevronLeft size={20} />
          </button>
        )}
      </div>

      <h1 
        onClick={() => navigate("/home")}
        className="text-3xl font-extrabold tracking-wide 
        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
        bg-clip-text text-transparent 
        hover:scale-105 transition duration-300 cursor-pointer text-center flex-1"
      >
        Unisync
      </h1>

      <div className="w-10"></div>
    </nav>
  );
}