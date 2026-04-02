// src/routes/auth.routes.js
const express = require("express");
const router = express.Router();

const {
  signup,
  verifyOtp,
  login,
  resendOtp,
    logout,
    forgetPassword,
    resetPassword
} = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/resend-otp", resendOtp);
router.post("/logout", logout); 
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);


module.exports = router;