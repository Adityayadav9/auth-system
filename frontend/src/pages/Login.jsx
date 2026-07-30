import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("password"); // "password" or "otp"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Trigger Send OTP for Login
  const handleSendOTP = async () => {
    if (!formData.email) {
      setMessage({ type: "error", text: "Please enter your email first." });
      return;
    }

    setLoadingOtp(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post("/api/auth/send-otp", {
        email: formData.email,
      });
      setMessage({
        type: "success",
        text: res.data.message || "OTP sent to your email!",
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

  // Submit Login Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, otp } = formData;

    if (!email) {
      setMessage({ type: "error", text: "Please enter your email." });
      return;
    }

    setLoadingSubmit(true);
    setMessage({ type: "", text: "" });

    const endpoint =
      loginMethod === "password"
        ? "/api/auth/login-password"
        : "/api/auth/login-otp";

    const payload =
      loginMethod === "password" ? { email, password } : { email, otp };

    try {
const res = await axios.post(`${API}${endpoint}`, payload);
      setMessage({
        type: "success",
        text: "Login successful! Redirecting...",
      });

      // Save token & user data to localStorage
      if (res.data.token) {
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
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <Link to="/" style={styles.homeLink}>
            ← Back to Home
          </Link>
          <h2 style={styles.title}>Welcome Back</h2>
        </div>

        {/* Login Method Toggle Tabs */}
        <div style={styles.tabContainer}>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("password");
              setMessage({ type: "", text: "" });
            }}
            style={{
              ...styles.tab,
              ...(loginMethod === "password" ? styles.activeTab : {}),
            }}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("otp");
              setMessage({ type: "", text: "" });
            }}
            style={{
              ...styles.tab,
              ...(loginMethod === "otp" ? styles.activeTab : {}),
            }}
          >
            OTP Code
          </button>
        </div>
        <div style={{ textAlign: 'right', marginTop: '8px' }}>
  <Link to="/forgot-password" style={{ color: '#0066cc', fontSize: '14px' }}>
    Forgot Password?
  </Link>
</div>

        {message.text && (
          <div
            style={{
              ...styles.alert,
              backgroundColor:
                message.type === "error" ? "#ffebe9" : "#e6fffa",
              color: message.type === "error" ? "#cf222e" : "#0969da",
              borderColor: message.type === "error" ? "#ff8182" : "#54aef0",
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            {loginMethod === "otp" ? (
              <div style={styles.emailWrapper}>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ ...styles.input, flex: 1, marginRight: "8px" }}
                  required
                />
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loadingOtp}
                  style={styles.otpBtn}
                >
                  {loadingOtp ? "Sending..." : "Get OTP"}
                </button>
              </div>
            ) : (
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            )}
          </div>

          {loginMethod === "password" ? (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          ) : (
            <div style={styles.inputGroup}>
              <label style={styles.label}>OTP Code</label>
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loadingSubmit}
            style={styles.submitBtn}
          >
            {loadingSubmit
              ? "Logging in..."
              : `Log In with ${loginMethod === "password" ? "Password" : "OTP"}`}
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f6f8fa",
    fontFamily: "sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "420px",
  },
  header: {
    marginBottom: "20px",
  },
  homeLink: {
    fontSize: "14px",
    color: "#0969da",
    textDecoration: "none",
    display: "inline-block",
    marginBottom: "12px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#24292f",
    margin: 0,
  },
  tabContainer: {
    display: "flex",
    backgroundColor: "#f3f4f6",
    borderRadius: "6px",
    padding: "4px",
    marginBottom: "20px",
  },
  tab: {
    flex: 1,
    padding: "8px",
    border: "none",
    backgroundColor: "transparent",
    color: "#57606a",
    fontWeight: "500",
    fontSize: "14px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  activeTab: {
    backgroundColor: "#ffffff",
    color: "#24292f",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  alert: {
    padding: "10px 14px",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "16px",
    border: "1px solid",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#24292f",
  },
  emailWrapper: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #d0d7de",
    fontSize: "14px",
    outline: "none",
  },
  otpBtn: {
    padding: "10px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#0969da",
    color: "#ffffff",
    fontWeight: "500",
    fontSize: "13px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  submitBtn: {
    marginTop: "8px",
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#0969da",
    color: "#ffffff",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer",
  },
  footerText: {
    marginTop: "20px",
    fontSize: "14px",
    textAlign: "center",
    color: "#57606a",
  },
  link: {
    color: "#0969da",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default Login;