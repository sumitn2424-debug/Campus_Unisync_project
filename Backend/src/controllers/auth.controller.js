// src/controllers/auth.controller.js
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendmail");

// SIGNUP (OTP sent only once)
const signup = async (req, res) => {

  try {
    const { email, password, username } = req.body;

    const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await userModel.create({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
      isVerified: false,
    });

    await sendMail(email, "OTP Verification", `Your OTP is ${otp}`);
    
    res.json({ message: "OTP sent to email",
        username,
        email,
        password
     });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// VERIFY OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure:false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7days
    });


    res.json({ message: "Account verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN (NO OTP here)
const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await userModel.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email, username: user.username, isVerified: user.isVerified }, process.env.JWT_SECRET);
    res.cookie("token", token, {
      httpOnly: true,
      secure:false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7days
    });
    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RESEND OTP (optional)
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();
    console.log(otp);

    await sendMail(email, "Resent OTP", `Your OTP is ${otp}`);

    res.json({ message: "OTP resent" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const logout = (req, res) => {
  try {
    console.log("Cookies:", req.cookies);

    const token = req.cookies?.token;

    if (!token) {
      return res.status(400).json({
        message: "No token found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    res.status(200).json({
      message: "Logged out successfully",
      email: decoded.email, // ✅ your goal
    });

  } catch (err) {
    res.status(401).json({
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};



const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();
    console.log(otp);

    await sendMail(email, "Password Reset OTP", `Your OTP is ${otp}`);

    res.json({ message: "OTP sent to your email" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signup, verifyOtp, login, resendOtp, logout, forgetPassword, resetPassword};