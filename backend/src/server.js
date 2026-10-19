import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import tradeRoutes from "./routes/trade.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

// load the .env file first
dotenv.config();

const app = express();

// middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// test route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "TradeVault API is running" });
});

// auth routes: /api/auth/register, /api/auth/login, /api/auth/me
app.use("/api/auth", authRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});