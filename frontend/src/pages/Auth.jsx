
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

  /* ================= AUTO lOGIN ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
        // console.log(user)
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
    try {
      const res = await api.post(`/auth/${mode}`, loginDetails)
      setUserInformation(res.data.user)
      if (res.status === 200 || user) {
        toast.success("Welcome back!");
        return navigate("/home")
      }
    } catch (err) {
      console.log( "this is login error", err.response?.data)
      toast.error(err.response?.data?.message || "Failed to login");
    }
  }



  /* ================= SIGNUP ================= */
  const [loginUsername, setLoginUsername] = useState("")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginImage, setLoginImage] = useState(null); // for preview only
  const [message, setMessage] = useState("")


  const handleSignUpSubmit = async (e) => {
    e.preventDefault()
    const userFormData = new FormData()
    userFormData.append("username", loginUsername)
    userFormData.append("email", loginEmail)
    userFormData.append("password", loginPassword)
    userFormData.append("image", loginImage)

    // console.log(loginImage)
    // console.log(mode)
    
    try {
      const res = await api.post(`/auth/${mode}`, userFormData)
      console.log("data sent", res.data)
      if(res.status === 200){
        setMode("verify-otp")
        setMessage("")
      }
    } catch (err) {
      console.log(err.response?.data, "this is signup error")
      setMessage(err.response?.data.message)
    }
  }

  /* ================= OTP ================= */
  const [userOtp, setUserOtp] = useState('')
  const [timer, setTimer] = useState(60);


  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true); // enable resend button
    }
  }, [timer]);


  // verify otp
  const verifyOtp = async (e) => {
    e.preventDefault()
    const otpFormData = {
      otp: userOtp,
      email: loginEmail
    }

    console.log(loginEmail, userOtp)
    try {
      const res = await api.post("/auth/verify-otp", otpFormData)
      console.log(res)
      console.log(res.status)
      setUserInformation(res.data.user)
      if (res.status === 200) {
        return navigate("/home")
      }

    } catch (err) {
      console.log(err.response?.data, "message : error 2")
    }

  }


  /* ================= resend otp ================ */

  const [canResend, setCanResend] = useState(false)
  const handelResendOtp = async (e) => {
    e.preventDefault()
    console.log(loginEmail)
    if (!canResend) return
    try {
      const data = await api.post("/auth/resend-otp", { email: loginEmail })
      console.log(data)
    } catch (err) {
      console.log(err.response?.data)
    }
    setCanResend(false) // disable resend button
    setTimer(60) // reset timer 
  }

  /* ================= FORGOT PASSWORD ================= */
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forget-password", { email: resetEmail });
      toast.success(res.data.message || "OTP sent to your email");
      setMode("reset-password");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
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
            <div className="space-y-3">
              <input
                type="email"
                name="email"
                required
                placeholder="Email or Username"
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

              <button type="submit" className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition active:scale-95">
                Login
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
          <form onSubmit={(e) => {
            handleSignUpSubmit(e)
          }}>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                name="email"
                required
                value={loginEmail}
                onChange={(e) => {
                  setLoginEmail(e.target.value)
                }}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
              />

              <input
                type="text"
                placeholder="Username"
                name="username"
                required
                value={loginUsername}
                onChange={(e) => {
                  setLoginUsername(e.target.value)
                  setTimer(60);
                }}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
              />

              <input
                type="password"
                placeholder="Password"
                name="password"
                required
                value={loginPassword}
                onChange={(e) => {
                  setLoginPassword(e.target.value)
                }}
                className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
              />

              {/* Image Upload */}
              <input
                type="file"
                accept="image/*"
                className="w-full border p-2 rounded-lg cursor-pointer"
                onChange={(e) => setLoginImage(e.target.files[0])}
              />

              {/* Image Preview */}
              <div className="flex justify-center">
                {loginImage ? (
                  <img
                    src={URL.createObjectURL(loginImage)}
                    alt="preview"
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-sm text-gray-500">
                    Preview
                  </div>
                )}
              </div>

              <button
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition active:scale-95"
                type="submit active:scale-95"
              >
                Sign Up
              </button>

              <p className={message==="" ? "text-sm text-center" : "text-sm text-center text-red-700-600"}>
                {message ==="" ? "Already have an account?" : message}
                <span
                  className={message==="" ? "text-indigo-600 cursor-pointer" : "text-green-600 cursor-pointer"}
                  onClick={() => setMode("login")}
                >
                  {message==="" ? "Login" : ""}
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
                Enter your registered email to receive a reset OTP.
              </p>
              <input
                type="email"
                required
                placeholder="Registered Email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button type="submit" className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition">
                Send OTP
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
                Enter the OTP sent to <b>{resetEmail}</b> and your new password.
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
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
                Reset Password
              </button>
              <button 
                type="button" 
                onClick={() => setMode("forgot-password")}
                className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                ⬅ Resend OTP
              </button>
            </div>
          </form>
        )}

        {/* ================= OTP ================= */}
        {mode === "verify-otp" && (
          <form onSubmit={(e) => verifyOtp(e)}>
            <div className="space-y-3 text-center">
              <p className="text-sm text-gray-600">
                Enter OTP sent to your email
              </p>

              <input
                type="text"
                name="otp"
                required
                value={userOtp}
                onChange={(e) => setUserOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full border p-2 rounded-lg text-center tracking-widest focus:ring-2 focus:ring-indigo-400"
              />

              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Verify OTP
              </button>

              {/* Timer */}
              <p className="text-gray-500 text-sm">
                ⏳ Resend OTP in {timer}s
              </p>

              {/* Resend OTP button */}
              <button
                type="button"
                onClick={(e) => {
                  handelResendOtp(e)

                }}
                disabled={!canResend}
                className={`w-full py-2 rounded-lg transition ${canResend
                  ? "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}

              >
                🔁 Resend OTP
              </button>

              {/* Back Button */}
              <button
                type="button"
                className="w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300 transition active:scale-95"
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

