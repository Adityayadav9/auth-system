import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import app from "./app.js";
import connectDB from "./database/db.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js"; // 1. Added Auth Routes

const PORT = process.env.PORT || 3000;

// 2. Enable CORS for Vite frontend
app.use(
  cors({
    origin: ["http://localhost:5173", "https://auth-system-pc1x.vercel.app", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// 3. Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

startServer();