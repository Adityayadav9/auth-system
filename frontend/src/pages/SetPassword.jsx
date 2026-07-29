import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/authApi";

function SetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSetPassword = async () => {
    try {
      const response = await API.post("/set-password", {
        email,
        password,
        confirmPassword,
      });

      alert(response.data.message);

      if (response.data.success) {
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Password</h1>

        <input
          className="auth-input"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="auth-btn"
          onClick={handleSetPassword}
        >
          Create Password
        </button>
      </div>
    </div>
  );
}

export default SetPassword;