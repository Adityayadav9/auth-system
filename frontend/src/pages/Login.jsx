import {
  sendOTP,
  loginWithPassword,
  loginWithOTP,
} from "../services/authApi";
const handleSendOTP = async () => {
  if (!formData.email) {
    setMessage({
      type: "error",
      text: "Please enter your email first.",
    });
    return;
  }

  setLoadingOtp(true);
  setMessage({ type: "", text: "" });

  try {
    const res = await sendOTP({
      email: formData.email,
    });

    setMessage({
      type: "success",
      text: res.data.message || "OTP sent successfully!",
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
      res = await loginWithPassword({
        email,
        password,
      });
    } else {
      res = await loginWithOTP({
        email,
        otp,
      });
    }

    setMessage({
      type: "success",
      text: "Login successful! Redirecting...",
    });

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