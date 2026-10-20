import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import tradeRoutes from "./routes/trade.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import strategyRoutes from "./routes/strategy.routes.js";
import psychologyRoutes from "./routes/psychology.routes.js";
import userRoutes from "./routes/user.routes.js";
import aiRoutes from "./routes/ai.routes.js";

// load the .env file first (on Render the variables come from its dashboard)
dotenv.config();

// stop early with a clear message if something important is missing
const missing = ["MONGO_URI", "JWT_SECRET"].filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const app = express();

// Render puts a proxy in front of the server. Without this, every visitor
// looks like the same IP and the AI rate limit would block everyone together.
app.set("trust proxy", 1);

// CLIENT_URL can hold several addresses separated by commas
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""));

// middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // requests without an origin (Postman, health checks) are allowed
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(express.json());

// test route, also used by Render as the health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "TradeVault API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/strategies", strategyRoutes);
app.use("/api/psychology", psychologyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

// unknown address: return JSON instead of an HTML error page
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// any error that was not handled above
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ message: error.message || "Server error" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});