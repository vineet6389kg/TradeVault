import mongoose from "mongoose";
import Trade from "../models/Trade.js";
import Psychology from "../models/Psychology.js";
import { generateTradeReview } from "../services/gemini.service.js";

// POST /api/ai/review/:tradeId
export const reviewTrade = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.tradeId)) {
      return res.status(400).json({ message: "Invalid trade id" });
    }

    // only the owner's trade, with the strategy details for the prompt
    const trade = await Trade.findOne({
      _id: req.params.tradeId,
      user: req.user._id,
    }).populate("strategy", "name rules checklist");

    if (!trade) return res.status(404).json({ message: "Trade not found" });

    // the latest journal entry linked to this trade, if there is one
    const psychology = await Psychology.findOne({
      user: req.user._id,
      trade: trade._id,
    }).sort("-entryDate");

    const review = await generateTradeReview(trade, psychology);
    review.reviewedAt = new Date();

    await Trade.updateOne({ _id: trade._id }, { $set: { aiReview: review } });

    res.json(review);
  } catch (error) {
    // the real error stays in the terminal, the user gets a clean message
    console.error("AI review failed:", error.message);

    if (error.status === 429) {
      return res
        .status(429)
        .json({ message: "The AI is busy right now. Try again in a minute." });
    }
    if (error.code === "BAD_AI_RESPONSE") {
      return res
        .status(502)
        .json({ message: "The AI gave an unreadable answer. Please try again." });
    }
    res.status(502).json({ message: "AI review failed. Please try again." });
  }
};