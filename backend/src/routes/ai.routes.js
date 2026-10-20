import express from "express";
import rateLimit from "express-rate-limit";
import { reviewTrade } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// at most 5 AI reviews per minute, so nobody can drain your Gemini quota
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  message: { message: "Too many AI requests. Please wait a minute." },
});

router.use(protect);

router.post("/review/:tradeId", aiLimiter, reviewTrade);

export default router;