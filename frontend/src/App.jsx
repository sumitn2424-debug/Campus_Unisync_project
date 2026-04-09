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
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <AuthProvider>
        {/* ✅ Show navbar only when NOT on "/" */}
        {location.pathname !== "/" && <Navbar />}

        <AppRoutes />
        
        <Toaster position="top-center" />
      </AuthProvider>

      {location.pathname !== "/" && <Footer />}
    </div>
  );
}
