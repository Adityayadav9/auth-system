import express from "express";
import {forgotPassword, resetPassword}  from '../controllers/auth.controllers.js';
import {
  sendOTP,
  register,
  loginWithPassword,
  loginWithOTP,
  logout,
} from "../controllers/auth.controllers.js";

const router = express.Router();

// @route   POST /api/auth/send-otp
// @desc    Send OTP to email for registration or login
router.post("/send-otp", sendOTP);

// @route   POST /api/auth/register
// @desc    Register a new user with OTP verification
router.post("/register", register);

// @route   POST /api/auth/login-password
// @desc    Authenticate user with password
router.post("/login-password", loginWithPassword);

// @route   POST /api/auth/login-otp
// @desc    Authenticate user with OTP
router.post("/login-otp", loginWithOTP);

// @route   POST /api/auth/logout
// @desc    Logout user
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;