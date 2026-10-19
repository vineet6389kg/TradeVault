import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// load the .env file first
dotenv.config();

const app = express();

// middleware
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json()); // lets the server read JSON sent from React

// test route, to check that the server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "TradeVault API is running" });
});

const PORT = process.env.PORT || 5000;

// connect to the database first, then start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});