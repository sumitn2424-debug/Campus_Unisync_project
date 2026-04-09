import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes/AppRoutes";
import Footer from "./components/Footer";
import { useLocation } from "react-router-dom";
export default function App() {
  const location = useLocation()
  console.log(location.pathname)
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <AuthProvider>
        {/* ✅ Show navbar only when NOT on "/" */}
        {location.pathname !== "/" && <Navbar />}

        <AppRoutes />
        
      </AuthProvider>

      {location.pathname !== "/" && <Footer />}
    </div>

  );
}
