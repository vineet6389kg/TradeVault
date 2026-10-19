import mongoose from "mongoose";

const psychologySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // the trade this entry belongs to (optional, you can also journal without a trade)
    trade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trade",
      default: null,
    },
    moodBefore: {
      type: String,
      enum: ["Calm", "Confident", "Fear", "Greedy", "Revenge", "Happy", "FOMO"],
      required: [true, "Mood is required"],
    },
    followedRules: {
      type: Boolean,
      required: [true, "Please answer: did you follow your rules?"],
    },
    overtraded: {
      type: Boolean,
      required: [true, "Please answer: did you overtrade?"],
    },
    learned: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
    entryDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Psychology = mongoose.model("Psychology", psychologySchema);


export default Psychology;