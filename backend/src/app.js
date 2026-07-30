import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Security Middleware
app.use(helmet());

// Body Parsers
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://auth-system-ruddy-eight.vercel.app",
      ];

      // Allow requests with no origin (e.g. Postman, mobile apps, server-to-server)
      if (!origin) return callback(null, true);

      // Allow defined origins OR any preview deployment on vercel.app
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Health Check / Root Endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running 🚀",
  });
});

export default app;