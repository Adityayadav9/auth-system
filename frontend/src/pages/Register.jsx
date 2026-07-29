import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
    phone:"",
  });
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Trigger Send OTP
  const handleSendOTP = async () => {
  if (!formData.email?.trim()) {
    setMessage({ type: "error", text: "Please enter your email first." });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    setMessage({ type: "error", text: "Please enter a valid email address." });
    return;
  }

  setLoadingOtp(true);
  setMessage({ type: "", text: "" });

  try {
    // 👈 WRITE IT HERE inside the try block
    const res = await axios.post("http://localhost:3000/api/auth/send-otp", {
      email: formData.email.trim(),
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
  // Submit Registration Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, otp } = formData;

    if (!name || !email || !password || !otp) {
      setMessage({ type: "error", text: "Please fill in all fields." });
      return;
    }

    setLoadingSubmit(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post('/api/auth/register', formData);
      setMessage({
        type: "success",
        text: res.data.message || "Registration successful! Redirecting...",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Registration failed.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="auth-container" style={styles.container}>
      <div className="auth-card" style={styles.card}>
        <div style={styles.header}>
          <Link to="/" style={styles.homeLink}>
            ← Back to Home
          </Link>
          <h2 style={styles.title}>Create an Account</h2>
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
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
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
          </div>

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
          <div style={styles.inputGroup}>
            <label style={styles.label}> Phone Number</label>
            <input
           type="tel"
        name="phone"
         placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleChange}
             />
          </div>
          

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

          <button
            type="submit"
            disabled={loadingSubmit}
            style={styles.submitBtn}
          >
            {loadingSubmit ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Log In
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
    backgroundColor: "#2da44e",
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

export default Register;