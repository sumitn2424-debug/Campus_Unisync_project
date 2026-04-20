import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaClock, FaTimesCircle } from "react-icons/fa";

export default function ApprovalStatus() {
  const { userInformation, logOut, setUserInformation } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState(userInformation?.status || "pending");

  useEffect(() => {
    // If the user's local state is somehow already approved, send them home.
    if (status === "approved" || userInformation?.role === "admin") {
      navigate("/home");
      return;
    }

    // Set up polling
    const intervalId = setInterval(async () => {
      try {
        const res = await api.get("/auth/status");
        if (res.data.status !== status) {
          setStatus(res.data.status);
          setUserInformation((prev) => ({ ...prev, status: res.data.status }));
          if (res.data.status === "approved") {
            navigate("/home");
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 4000); // Poll every 4 seconds

    return () => clearInterval(intervalId);
  }, [status, navigate, setUserInformation, userInformation]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        {status === "pending" ? (
          <>
            <FaClock className="text-6xl text-yellow-500 mx-auto mb-6 animate-pulse" />
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Review in Progress</h1>
            <p className="text-gray-500 mb-6">
              Your account is currently under review by our administration team. You will be granted access to the platform once approved.
            </p>
            <div className="flex justify-center space-x-2">
              <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></span>
              <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-100"></span>
              <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-200"></span>
            </div>
            <p className="text-indigo-500 font-medium mt-4 text-sm">Please leave this page open, you'll be redirected automatically.</p>
          </>
        ) : status === "rejected" ? (
           <>
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-500 mb-6">
              Unfortunately, your request for an account has been rejected by the administrator. 
            </p>
          </>
        ) : (
           <p className="text-gray-500">Redirecting...</p>
        )}

        <button 
          onClick={logOut}
          className="mt-8 text-gray-400 hover:text-gray-600 font-medium transition-colors border border-gray-200 hover:bg-gray-50 px-6 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
