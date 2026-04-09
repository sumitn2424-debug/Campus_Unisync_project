import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes/AppRoutes";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

export default function App() {
  const location = useLocation()
  console.log(location.pathname)
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col overflow-x-hidden">
      <AuthProvider>
        {/* ✅ Show navbar only when NOT on "/" or "/Message" */}
        {location.pathname !== "/" && location.pathname !== "/Message" && <Navbar />}

        <AppRoutes />
        
        <Toaster position="top-center" />
      </AuthProvider>

      {(location.pathname === "/home" || location.pathname === "/marketPlace" || location.pathname === "/Message" || location.pathname === "/Profile" || location.pathname === "/admin") && <Footer />}
    </div>
  );
}
