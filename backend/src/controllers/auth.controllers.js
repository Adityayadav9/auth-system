import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { sendOTPEmail } from '../utils/emailService.js';
import {sendResetPasswordEmail} from '../utils/emailService.js'
// import User from '../models/User.js';
// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import { sendOTPEmail } from '../../utils/emailService.js';

// Simple in-memory OTP store (Use Redis or DB in production)
const otpStore = new Map();

// Helper: Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper: Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * @desc    Send OTP to user email
 * @route   POST /api/auth/send-otp
 */
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // Expires in 5 minutes

    // Store OTP in memory
    otpStore.set(email, { otp, expiresAt });

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verification Code (OTP)",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "OTP sent successfully to email" });
  } catch (error) {
    console.error("Error in sendOTP:", error);
    return res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

/**
 * @desc    Register new user with OTP verification & Password
 * @route   POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, otp  ,phone} = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Verify OTP
    const storedOtpData = otpStore.get(email);
    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP not found. Please request a new one." });
    }

    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
      phone,
    });

    await newUser.save();

    // Clear used OTP
    otpStore.delete(email);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

/**
 * @desc    Login with Email and Password
 * @route   POST /api/auth/login-password
 */
export const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in loginWithPassword:", error);
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

/**
 * @desc    Login with OTP
 * @route   POST /api/auth/login-otp
 */
export const loginWithOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const storedOtpData = otpStore.get(email);
    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP not found. Please request a new one." });
    }

    if (Date.now() > storedOtpData.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    // Clear used OTP
    otpStore.delete(email);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in loginWithOTP:", error);
    return res.status(500).json({ message: "OTP Login failed", error: error.message });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout:", error);
    return res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

export const handleSendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email address is required.' });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiration (e.g. 5 minutes)
    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendOTPEmail(email, otp);

    // Set cooldown duration in seconds
    const RESEND_INTERVAL_SECONDS = 30; 

    return res.status(200).json({ 
      message: 'OTP sent successfully!',
      resendInterval: RESEND_INTERVAL_SECONDS // <-- Sent to frontend
    });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({ 
      message: 'Failed to send OTP', 
      error: error.message 
    });
  }
};
const resetOtpStore = new Map();

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    resetOtpStore.set(email, otp);

    await sendResetPasswordEmail(email, otp);

    return res.status(200).json({ message: 'Password reset OTP sent to email' });
  } catch (error) {
    return res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

// 2. Reset Password using OTP
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const storedOtp = resetOtpStore.get(email);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    resetOtpStore.delete(email); // Clear OTP after success

    return res.status(200).json({ message: 'Password updated successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};