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
    // to allow a fresh start with the same email/username
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

    // Check if blocked
    if (user.otpBlockedUntil && user.otpBlockedUntil > Date.now()) {
      const waitTime = Math.ceil((user.otpBlockedUntil - Date.now()) / 60000);
      return res.status(403).json({ message: `Too many failed attempts. Try again in ${waitTime} minutes.` });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      user.otpAttempts += 1;
      if (user.otpAttempts >= 5) {
        user.otpBlockedUntil = Date.now() + 1 * 60 * 60 * 1000; // Block for 1 hour
      }
      await user.save();
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Success
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpAttempts = 0;
    user.otpBlockedUntil = undefined;
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

    // Cooldown check
    if (user.otpResendCooldown && user.otpResendCooldown > Date.now()) {
      const waitTime = Math.ceil((user.otpResendCooldown - Date.now()) / 1000);
      return res.status(429).json({ message: `Please wait ${waitTime} seconds before resending.` });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    user.otpResendCooldown = Date.now() + 60 * 1000; // 1 min cooldown
    await user.save();

    const emailResult = await sendMail(email, "Resent OTP", `Your OTP is ${otp}`);

    if (!emailResult.success) {
      return res.status(500).json({ 
        message: "Failed to resend OTP email. Please check your SMTP settings.",
        error: emailResult.error 
      });
    }

    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Resend OTP failed", error: err.message });
  }
};

// GET USER (Profile)
const getUser = async (req, res) => {
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

module.exports = { signup, verifyOtp, login, resendOtp, getUser, logout };