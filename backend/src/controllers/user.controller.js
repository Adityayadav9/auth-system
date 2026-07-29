import User from "../models/User.js";

export const dashboard = async (req, res) => {
  try {
    // req.user.id comes from the JWT middleware
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Welcome to Dashboard",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};