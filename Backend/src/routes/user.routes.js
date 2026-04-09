// src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() });
const { getAllUsers } = require("../controllers/postData.controller");
const {
  signup,
  verifyOtp,
  login,
  resendOtp,
  logout,
  forgetPassword,
  resetPassword,
  getMe,
} = require("../controllers/auth.controller");
const authUser = require("../middleware/authData.middleware");

router.post("/signup",upload.single("image"), signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/resend-otp", resendOtp);
router.post("/logout", logout); 
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);
router.get("/me",authUser, getMe);
router.get("/all-users", authUser, getAllUsers);


module.exports = router;