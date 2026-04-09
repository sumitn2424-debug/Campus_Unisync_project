// src/controllers/auth.controller.js
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendmail");
const uploadFile = require("../services/storage.service")

// SIGNUP (OTP sent only once) 
const signup = async (req, res) => {
  console.log("auth signup is working")
  try {
    const { email, password, username } = req.body;
    const imageBuffer = req.file?.buffer
    if (!imageBuffer) {
      return res.status(400).json({ message: "Image is required" });
    }

    const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
    
    // If user exists and is already verified, block them
    if (existingUser && existingUser.isVerified) {
      if (username === existingUser.username) {
        return res.status(400).json({ message: "Username already taken by another user" });
      }
      return res.status(400).json({ message: "User already exists" });
    }

    // If user exists but is NOT verified, we will delete the old unverified attempt 
    if (existingUser && !existingUser.isVerified) {
      console.log("Replacing unverified user:", existingUser.email);
      await userModel.deleteOne({ _id: existingUser._id });
    }

    if (password.length <= 5) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const uploadResult = await uploadFile(imageBuffer.toString("base64"))

    console.log("💾 Saving user to DB with OTP:", otp);
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      image: uploadResult.url,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000, 
    });
    console.log("✅ User saved successfully:", newUser.email, "OTP:", newUser.otp);

    const emailResult = await sendMail(email, "OTP Verification", `Your OTP is ${otp}`);

    if (!emailResult.success) {
      return res.status(500).json({ 
        message: "User created, but failed to send verification email. Please check your SMTP settings.",
        error: emailResult.error 
      });
    }

    res.json({
      message: "OTP sent to email",
      username,
      email,
      password
    });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// VERIFY OTP 
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Account verified", user, token });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.isVerified) return res.status(403).json({ message: "Account not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ _id: user._id, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful", user, token });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// RESEND OTP
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    const emailResult = await sendMail(email, "Resent OTP", `Your OTP is ${otp}`);

    if (!emailResult.success) {
      return res.status(500).json({ message: "Failed to resend OTP email.", error: emailResult.error });
    }

    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Resend OTP failed", error: err.message });
  }
};

// FORGET PASSWORD
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendMail(email, "Reset Password OTP", `Your OTP to reset password is ${otp}`);
    res.json({ message: "OTP sent for password reset" });
  } catch (err) {
    res.status(500).json({ message: "Forget password failed", error: err.message });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Reset password failed", error: err.message });
  }
};

// GET ME
const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

// LOGOUT
const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ message: "Logout successful" });
};

module.exports = { signup, verifyOtp, login, resendOtp, forgetPassword, resetPassword, getMe, logout };