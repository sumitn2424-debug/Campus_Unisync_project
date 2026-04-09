// src/controllers/auth.controller.js
require("dotenv").config({ path: "../../.env" });
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
    // console.log(req.body)
    // console.log(req.file)
    const imageBuffer = req.file.buffer
    if (!imageBuffer) {
      return res.status(400).json({ message: "Image is required" });
    }

    const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (username == existingUser.username) {
        return res.status(400).json({ message: "Username already taken by anouther user" });
      }
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length <= 5) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const uploadResult = await uploadFile(imageBuffer.toString("base64"))

    // console.log(`this is the upload result ${uploadResult}`)

    console.log("💾 Saving user to DB with OTP:", otp);
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      otp,
      image: uploadResult.url,
      otpExpiry: Date.now() + 10 * 60 * 1000, 
      isVerified: false,
      otpAttempts: 0,
      otpBlockedUntil: null,
      otpResendCooldown: Date.now() 
    });
    console.log("✅ User saved successfully:", newUser.email, "OTP:", newUser.otp);

    const emailResult = await sendMail("royd989712@gmail.com", "OTP Verification", `Your OTP is ${otp}`);
    console.log(emailResult)

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

    // Check if blocked
    if (user.otpBlockedUntil && user.otpBlockedUntil > Date.now()) {
      return res.status(429).json({
        message: "Too many attempts. Try again later."
      });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      user.otpAttempts += 1;
      return res.status(400).json({
        message: `Invalid OTP. Attempts left: ${5 - user.otpAttempts}`
      });


      //  Block after 5 attempts
      if (user.otpAttempts >= 5) {
        user.otpBlockedUntil = Date.now() + 10 * 60 * 1000; // 10 min block
        user.otpAttempts = 0; // reset attempts after block
      }
      await user.save();
      return res.status(400).json({ message: "Invalid or expired OTP" });

    }
    // ✅ Success
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    user.otpAttempts = 0;
    user.otpBlockedUntil = null;

    await user.save();

    const token = jwt.sign({
      _id: user._id, 
      username:user.username,
      email: user.email,
      image: user.image,
      isVerified: user.isVerified,
      role: user.role
    }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7days
    });


    res.status(200).json({
      message: "Account verified successfully",
      token,
      image: user.image,
      user
    });
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
    password.trim();
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }
    console.log(user.image)
    const token = jwt.sign({
      _id: user._id,
      email: user.email,
      username: user.username,
      image: user.image,
      isVerified: user.isVerified,
      role: user.role
    }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7days
    });
    res.json({
      message: "Login successful",
      token,
      user: user.image,
      user
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
    // ⏱ Cooldown check
    if (user.otpResendCooldown && user.otpResendCooldown > Date.now()) {
      const seconds = Math.ceil(
        (user.otpResendCooldown - Date.now()) / 1000
      );
      return res.status(429).json({
        message: `Please wait ${seconds}s before requesting OTP again`
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    // set new cooldown
    user.otpResendCooldown = Date.now() + 60 * 1000;
    await user.save();
    console.log(otp);

    const emailResult = await sendMail(email, "Resent OTP", `Your OTP is ${otp}`);

    if (!emailResult.success) {
      return res.status(500).json({ 
        message: "Failed to resend OTP email. Please check your SMTP settings.",
        error: emailResult.error 
      });
    }

    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const logout = (req, res) => {
  try {

    const token = req.cookies?.token;

    if (!token) {
      return res.status(400).json({
        message: "No token found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
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


// forget password
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

// Reset Userneme Not Used
const resetUsername = async (req, res) => {
  try {
    const { email, otp, newUsername } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.username = newUsername;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({ message: "Username reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, verifyOtp, login, resendOtp, logout, forgetPassword, resetPassword, getMe };