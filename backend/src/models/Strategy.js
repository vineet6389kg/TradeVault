import mongoose from "mongoose";

const strategySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Strategy name is required"],
      trim: true,
    },
    description: { type: String, trim: true, default: "" },
    rules: { type: [String], default: [] }, // "Only trade London session"
    checklist: { type: [String], default: [] }, // "Trend checked on 1H"
    notes: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

const Strategy = mongoose.model("Strategy", strategySchema);

export default Strategy;