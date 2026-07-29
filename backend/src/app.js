import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());
app.use(cors());
// app.use(helmet());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.get("/", (req, res) => {
    console.log("GET / route hit");
    res.send("Server is running 🚀");
});


export default app;