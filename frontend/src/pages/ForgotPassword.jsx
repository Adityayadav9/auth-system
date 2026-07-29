import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Request / Resend OTP
  const handleSendOTP = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (!email) {
      setMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('https://auth-system-grxw.vercel.app/api/auth/forgot-password', { email });
      
      // Successfully sent OTP
      setMessage(res.data.message || 'OTP sent successfully!');
      setStep(2);
      setTimer(30); // START 30-SECOND TIMER
    } catch (err) {
      console.error("Forgot Password Error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP button handler
  const handleResendOTP = (e) => {
    e.preventDefault();
    if (timer === 0 && !loading) {
      handleSendOTP(e);
    }
  };

  // Reset Password Handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('https://auth-system-grxw.vercel.app/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      });

      setMessage(res.data.message || 'Password reset successful!');

      setTimeout(() => {
        navigate('/Login');
      }, 2000);
    } catch (err) {
      console.error("Reset Password Error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <h2>Forgot Password</h2>

      {message && (
        <p style={{ 
          color: message.toLowerCase().includes('failed') || 
                 message.toLowerCase().includes('invalid') || 
                 message.toLowerCase().includes('error') ? 'red' : 'green' 
        }}>
          {message}
        </p>
      )}

      {step === 1 ? (
        <form onSubmit={handleSendOTP}>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

          {/* Resend OTP UI Section */}
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            {timer > 0 ? (
              <p style={{ color: '#666', fontSize: '14px' }}>
                Resend OTP in <strong>{timer}s</strong>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#0066cc', 
                  cursor: 'pointer', 
                  textDecoration: 'underline' 
                }}
              >
                Resend OTP
              </button>
            )}
          </div>
        </form>
      )}

      <div style={{ textAlign: 'right', marginTop: '15px' }}>
        <Link to="/Login" style={{ color: '#0066cc', fontSize: '14px' }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}