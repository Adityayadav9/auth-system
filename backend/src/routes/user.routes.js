import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { dashboard } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, dashboard);

export default router;