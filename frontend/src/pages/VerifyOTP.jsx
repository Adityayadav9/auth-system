import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOTP } from "../services/authApi";

function VerifyOTP() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    if(!email || !otp){
        alert("Please enter both email and otp");
        return;
    }
    setLoading(true);
    try {
      const response = await verifyOTP({
        email,
        otp,
      });

      if (response.data.success) {
        alert(response.data.message);

        setEmail("");
        setOtp("");

        navigate("/create-password");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert(error.message);
      }
    }
    finally{
        setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Verify OTP</h1>

        <input
          className="auth-input"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          className="auth-btn"
          onClick={handleVerify}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}

export default VerifyOTP;