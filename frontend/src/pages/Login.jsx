import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  sendOTP,
  loginWithPassword,
  loginWithOTP,
} from "../services/authApi";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("password");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendOTP = async () => {
    if (!formData.email?.trim()) {
      setMessage({
        type: "error",
        text: "Please enter your email first.",
      });
      return;
    }

    setLoadingOtp(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await sendOTP({ email: formData.email });
      setMessage({
        type: "success",
        text: res.data?.message || "OTP sent successfully!",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to send OTP.",
      });
    } finally {
      setLoadingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, otp } = formData;

    if (!email) {
      setMessage({
        type: "error",
        text: "Please enter your email.",
      });
      return;
    }

    setLoadingSubmit(true);
    setMessage({ type: "", text: "" });

    try {
      let res;
      if (loginMethod === "password") {
        res = await loginWithPassword({ email, password });
      } else {
        res = await loginWithOTP({ email, otp });
      }

      setMessage({
        type: "success",
        text: "Login successful! Redirecting...",
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Login failed.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Welcome Back</h2>

      {message.text && (
        <div
          style={{
            ...styles.alert,
            backgroundColor: message.type === "error" ? "#ffebe9" : "#e6fffa",
            color: message.type === "error" ? "#cf222e" : "#0969da",
          }}
        >
          {message.text}
        </div>
      )}

      {/* Login Method Selector */}
      <div style={styles.tabContainer}>
        <button
          type="button"
          onClick={() => setLoginMethod("password")}
          style={{
            ...styles.tab,
            borderBottom: loginMethod === "password" ? "2px solid #007bff" : "none",
            fontWeight: loginMethod === "password" ? "bold" : "normal",
          }}
        >
          Password Login
        </button>
        <button
          type="button"
          onClick={() => setLoginMethod("otp")}
          style={{
            ...styles.tab,
            borderBottom: loginMethod === "otp" ? "2px solid #007bff" : "none",
            fontWeight: loginMethod === "otp" ? "bold" : "normal",
          }}
        >
          OTP Login
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Email Field with Send OTP Button */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <div style={styles.inlineInput}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="enter your email"
              style={styles.input}
              required
            />
            {loginMethod === "otp" && (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loadingOtp}
                style={styles.otpButton}
              >
                {loadingOtp ? "Sending..." : "Get OTP"}
              </button>
            )}
          </div>
        </div>

        {/* Password / OTP Dynamic Inputs */}
        {loginMethod === "password" ? (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={styles.input}
              required
            />
          </div>
        ) : (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter 6-digit OTP"
              style={styles.input}
              required
            />
          </div>
        )}

        <button type="submit" disabled={loadingSubmit} style={styles.submitButton}>
          {loadingSubmit ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={styles.footer}>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <p>
          <Link to="/forgot-password">Forgot Password?</Link> | <Link to="/">Home</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "400px",
  },
  title: { textAlign: "center", marginBottom: "20px", color: "#333" },
  alert: { padding: "10px", borderRadius: "5px", marginBottom: "15px", fontSize: "14px" },
  tabContainer: { display: "flex", justifyContent: "space-around", marginBottom: "20px" },
  tab: { background: "none", border: "none", padding: "10px", cursor: "pointer", fontSize: "14px" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  label: { fontSize: "14px", color: "#555" },
  inlineInput: { display: "flex", gap: "8px" },
  input: { flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "14px" },
  otpButton: { padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  submitButton: { padding: "12px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", fontSize: "16px", cursor: "pointer" },
  footer: { marginTop: "20px", textAlign: "center", fontSize: "14px", display: "flex", flexDirection: "column", gap: "5px" },
};

export default Login;