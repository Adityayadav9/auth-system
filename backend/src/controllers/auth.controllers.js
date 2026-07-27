import User from "../models/User.js";
import generateOtp from "../utils/generateOTP.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    console.log("Register API Hit");
    console.log(req.body);

    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.find({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const otp = generateOtp();

    const otpHash = await bcrypt.hash(otp, 10);

    await User.create({
      name,
      email,
      phone,
      otpHash,
      otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      otpPurpose: "REGISTER",
    });

    console.log("OTP:", otp);

    return res.status(201).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validation
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        // Find User
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check OTP Expiry
        if (user.otpExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        // Compare OTP
        const isMatch = await bcrypt.compare(otp, user.otpHash);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Update User
        user.isVerified = true;
        user.otpHash = null;
        user.otpExpiresAt = null;
        user.otpPurpose = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};