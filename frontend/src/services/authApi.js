import axios from "axios";

const API = axios.create({
  baseURL: "https://auth-system-i3cx.vercel.app/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});

// Register
export const registerUser = (data) => API.post("/register", data);

// Send OTP
export const sendOTP = (data) => API.post("/send-otp", data);

// Login
export const loginWithPassword = (data) =>
  API.post("/login-password", data);

export const loginWithOTP = (data) =>
  API.post("/login-otp", data);

// Forgot Password
export const forgotPassword = (data) =>
  API.post("/forgot-password", data);

// Reset Password
export const resetPassword = (data) =>
  API.post("/reset-password", data);

export default API;