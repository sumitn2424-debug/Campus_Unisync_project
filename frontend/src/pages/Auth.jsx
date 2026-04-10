
import { useState, useEffect } from "react";
import api from "../services/api"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

export default function AuthUI() {
  const [mode, setMode] = useState("login"); // login | signup | verify-otp
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const {setUserInformation} = useAuth()
  const [loading, setLoading] = useState(false);

  /* ================= AUTO LOGIN ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
        if (res.data.user) {
          setUserInformation(res.data.user);
          navigate("/home");
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  /* ================= LOGIN ================= */
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" })
  const handleLoginChange = (e) => {
    setLoginDetails({
      ...loginDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    try {
      const res = await api.post(`/auth/login`, loginDetails)
      setUserInformation(res.data.user)
      toast.success("Welcome back!");
      navigate("/home")
    } catch (err) {
      console.log("Login err", err.response?.data)
      toast.error(err.response?.data?.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  }

  /* ================= SIGNUP ================= */
  const [loginUsername, setLoginUsername] = useState("")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginImage, setLoginImage] = useState(null);
  
  // To display to the user specifically for local mock testing
  const [displayedOtp, setDisplayedOtp] = useState("");

  const handleSignUpSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);

    const userFormData = new FormData()
    userFormData.append("username", loginUsername)
    userFormData.append("email", loginEmail)
    userFormData.append("password", loginPassword)
    if (loginImage) {
      userFormData.append("image", loginImage)
    }
    
    try {
      const res = await api.post(`/auth/signup`, userFormData)
      if (res.status === 200) {
        setDisplayedOtp(res.data.otp);
        toast.success(`Signup successful! Your OTP is ${res.data.otp}`, { duration: 5000 });
        setMode("verify-otp");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Signup failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  /* ================= OTP VERIFY (Mock) ================= */
  const [userOtp, setUserOtp] = useState('')

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true);
    const otpFormData = {
      otp: userOtp,
      email: loginEmail
    }

    try {
      const res = await api.post("/auth/verify-otp", otpFormData)
      setUserInformation(res.data.user)
      toast.success("Account verified successfully! Welcome.");
      navigate("/home")
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP or verification failed");
    } finally {
      setLoading(false);
    }
  }

  /* ================= FORGOT PASSWORD ================= */
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/forget-password", { email: resetEmail });
      toast.success(res.data.message || "OTP generated successfully");
      setMode("reset-password");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password", { 
        email: resetEmail, 
        otp: resetOtp, 
        newPassword 
      });
      toast.success(res.data.message || "Password reset successful!");
      setMode("login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">

      <div className="bg-white w-[350px] p-6 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-4">
          UniSync
        </h1>

        {/* ================= LOGIN ================= */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit}>
            <div className="space-y-4">
              <p className="text-sm text-center text-gray-600">Login with Details</p>
              
              <input
                type="email"
                name="email"
                required
                placeholder="Email Address"
                value={loginDetails.email}
                onChange={handleLoginChange}
                className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={loginDetails.password}
                onChange={handleLoginChange}
                className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition active:scale-95 disabled:bg-indigo-300"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="flex justify-between items-center px-1">
                <p className="text-sm text-center">
                  Don't have an account?{" "}
                  <span
                    className="text-indigo-600 cursor-pointer font-medium"
                    onClick={() => setMode("signup")}
                  >
                    Sign up
                  </span>
                </p>
                <span 
                  className="text-xs text-indigo-500 cursor-pointer hover:underline"
                  onClick={() => setMode("forgot-password")}
                >
                  Forgot Password?
                </span>
              </div>
            </div>
          </form>
        )}

        {/* ================= SIGNUP ================= */}
        {mode === "signup" && (
          <form onSubmit={handleSignUpSubmit}>
            <div className="space-y-3">
              <p className="text-sm text-center text-gray-600">Create your account</p>
              
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />

              <input
                type="text"
                placeholder="Username"
                name="username"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />

              <input
                type="password"
                placeholder="Password"
                name="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />

              {/* Image Upload */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLoginImage(e.target.files[0])}
                  className="w-full border p-1 rounded-lg text-xs"
                />
              </div>

              {loginImage && (
                <div className="flex justify-center">
                  <img
                    src={URL.createObjectURL(loginImage)}
                    alt="preview"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition active:scale-95 disabled:bg-green-300"
              >
                {loading ? "Sending..." : "Sign Up"}
              </button>

              <p className="text-sm text-center">
                Already have an account?{" "}
                <span
                  className="text-indigo-600 cursor-pointer font-medium"
                  onClick={() => setMode("login")}
                >
                  Login
                </span>
              </p>
            </div>
          </form>
        )}

        {/* ================= FORGOT PASSWORD ================= */}
        {mode === "forgot-password" && (
          <form onSubmit={handleForgotPasswordSubmit}>
            <div className="space-y-4">
              <p className="text-sm text-center text-gray-600">
                Enter your registered email to request a reset block.
              </p>
              <input
                type="email"
                required
                placeholder="Registered Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button type="submit" disabled={loading} className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition disabled:bg-indigo-300">
                Send Request
              </button>
              <button 
                type="button" 
                onClick={() => setMode("login")}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* ================= RESET PASSWORD ================= */}
        {mode === "reset-password" && (
          <form onSubmit={handleResetPasswordSubmit}>
            <div className="space-y-3">
              <p className="text-sm text-center text-gray-600">
                Enter the code to reset your password.
              </p>
              <input
                type="text"
                required
                placeholder="6-digit OTP"
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value)}
                className="w-full border p-2 rounded-lg text-center tracking-widest focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="password"
                required
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
              <button type="submit" disabled={loading} className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition disabled:bg-green-300">
                Reset Password
              </button>
              <button 
                type="button" 
                onClick={() => setMode("forgot-password")}
                className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                ⬅ Resend Request
              </button>
            </div>
          </form>
        )}

        {/* ================= VERIFY OTP ================= */}
        {mode === "verify-otp" && (
          <form onSubmit={handleVerifyOtp}>
            <div className="space-y-4 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  For your local testing, your verification code is:
                </p>
                <p className="text-2xl font-bold tracking-[0.2em] text-blue-600 mt-1">
                  {displayedOtp}
                </p>
              </div>

              <p className="text-sm text-gray-600">
                Please type the code below to verify your account
              </p>

              <input
                type="text"
                required
                maxLength={6}
                value={userOtp}
                onChange={(e) => setUserOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full border p-3 rounded-lg text-center text-2xl tracking-[1em] focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition active:scale-95 disabled:bg-orange-300"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>

              <button
                type="button"
                className="w-full text-sm text-gray-500 hover:text-indigo-600"
                onClick={() => setMode("signup")}
              >
                ⬅ Back to Signup
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
