import mongoose from "mongoose";

// the saved AI review, no _id needed because it belongs to one trade
const aiReviewSchema = new mongoose.Schema(
  {
    rating: Number, // discipline rating, 1 to 10
    summary: String,
    strengths: [String],
    mistakes: [String],
    riskAnalysis: String,
    suggestions: [String],
    reviewedAt: Date,
  },
  { _id: false },
);

const tradeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pair: {
      type: String,
      required: [true, "Pair is required"],
      trim: true,
      uppercase: true,
    },
    side: {
      type: String,
      enum: ["Buy", "Sell"],
      required: [true, "Side is required"],
    },
    entry: { type: Number, required: [true, "Entry price is required"] },
    exit: { type: Number, required: [true, "Exit price is required"] },
    stopLoss: { type: Number, required: [true, "Stop loss is required"] },
    takeProfit: { type: Number, required: [true, "Take profit is required"] },
    riskPercent: { type: Number, default: 0 },
    lotSize: { type: Number, default: 0 },

    // typed by the user, copied from their broker
    pnl: { type: Number, required: [true, "Profit / loss is required"] },

    // calculated by the server, never sent by the frontend
    rr: { type: Number, default: 0 },

    emotion: {
      type: String,
      enum: ["Calm", "Confident", "Fear", "Greedy", "Revenge", "Happy", "FOMO"],
      default: "Calm",
    },
    notes: { type: String, trim: true, default: "" },
    tradeDate: { type: Date, default: Date.now },

    // screenshot stored on Cloudinary
    screenshotUrl: { type: String, default: "" },
    screenshotId: { type: String, default: "" },

    // the strategy used for this trade (optional)
    strategy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Strategy",
      default: null,
    },

    // filled after "Analyze with AI"
    aiReview: { type: aiReviewSchema, default: null },
  },
  { timestamps: true },
);

const Trade = mongoose.model("Trade", tradeSchema);

export default Trade;