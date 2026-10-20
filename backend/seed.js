import "dotenv/config";
import crypto from "crypto";
import mongoose from "mongoose";
import connectDB from "./src/config/db.js";
import User from "./src/models/User.js";
import Trade from "./src/models/Trade.js";
import Strategy from "./src/models/Strategy.js";
import Psychology from "./src/models/Psychology.js";
import { DEMO_EMAIL } from "./src/config/demo.js";

const DAY = 24 * 60 * 60 * 1000;

// same formula as the trade controller
const rr = (entry, stopLoss, takeProfit) =>
  +(Math.abs(takeProfit - entry) / Math.abs(entry - stopLoss)).toFixed(2);

const strategyData = [
  {
    name: "London Breakout",
    description: "Trade the first break of the Asian range after the London open.",
    rules: ["Only trade 8am to 11am London time", "Risk 1% per trade", "No trades on news days"],
    checklist: ["Asian range marked", "Trend checked on 1H", "Stop loss beyond the range"],
  },
  {
    name: "SMC",
    description: "Wait for a liquidity sweep, then enter on a market structure shift.",
    rules: ["Mark liquidity highs and lows first", "Enter only after a structure shift"],
    checklist: ["Liquidity swept", "Structure shift confirmed", "Entry on the retest"],
  },
  {
    name: "ICT",
    description: "Trade from higher timeframe levels during kill zones.",
    rules: ["Trade only in kill zones", "Wait for a fair value gap"],
    checklist: ["Higher timeframe bias set", "Fair value gap marked"],
  },
  {
    name: "Scalping",
    description: "Small targets, tight stops, a strict limit on trades per day.",
    rules: ["Maximum 5 trades a day", "Stop after 2 losses in a row"],
    checklist: ["Spread is low", "Stop loss under 10 pips"],
  },
  {
    name: "Swing Trading",
    description: "Hold for days using the higher timeframe trend and key levels.",
    rules: ["Trade with the daily trend", "Risk 1% per trade"],
    checklist: ["Daily trend checked", "Key level marked"],
  },
];

// pair, side, entry, exit, stopLoss, takeProfit, lotSize, pnl, emotion, strategy, daysAgo, notes
const tradeRows = [
  ["EUR/USD", "Buy", 1.085, 1.091, 1.083, 1.091, 0.5, 300, "Calm", 0, 1, "Clean breakout after the London open."],
  ["GBP/USD", "Sell", 1.274, 1.278, 1.278, 1.266, 0.3, -120, "FOMO", 1, 2, "Entered before the candle closed."],
  ["XAU/USD", "Buy", 2315.0, 2332.5, 2307.0, 2335.0, 0.1, 175, "Confident", 4, 3, "Bought the pullback to the daily level."],
  ["USD/JPY", "Sell", 156.4, 155.9, 156.8, 155.4, 0.4, 128, "Calm", 2, 4, "Fair value gap held as resistance."],
  ["EUR/GBP", "Buy", 0.856, 0.8545, 0.8545, 0.859, 0.5, -90, "Fear", 3, 5, "Was not sure about the setup and took it anyway."],
  ["GBP/JPY", "Buy", 195.2, 196.1, 194.8, 196.4, 0.2, 115, "Confident", 0, 6, ""],
  ["EUR/USD", "Sell", 1.092, 1.0885, 1.0945, 1.087, 0.5, 175, "Calm", 1, 8, "Swept the highs, then shifted structure."],
  ["AUD/USD", "Buy", 0.658, 0.6555, 0.6555, 0.663, 0.6, -150, "Revenge", 3, 9, "Took this right after a loss to win it back."],
  ["XAU/USD", "Sell", 2340.0, 2328.0, 2346.0, 2326.0, 0.1, 120, "Calm", 2, 11, ""],
  ["USD/CAD", "Buy", 1.361, 1.365, 1.359, 1.367, 0.4, 117, "Happy", 4, 12, "Held for two days as planned."],
  ["GBP/USD", "Buy", 1.269, 1.265, 1.265, 1.277, 0.4, -160, "Greedy", 0, 14, "Moved my take profit further instead of closing."],
  ["EUR/USD", "Buy", 1.079, 1.0845, 1.0765, 1.085, 0.5, 275, "Calm", 0, 16, "Followed the checklist exactly."],
  ["NZD/USD", "Sell", 0.601, 0.5985, 0.603, 0.597, 0.5, 125, "Confident", 1, 18, ""],
  ["USD/JPY", "Buy", 154.8, 154.5, 154.5, 155.6, 0.3, -58, "FOMO", 3, 20, "Chased a move I had already missed."],
  ["XAU/USD", "Buy", 2290.0, 2310.0, 2282.0, 2314.0, 0.1, 200, "Calm", 4, 22, "Waited a week for this level."],
  ["EUR/JPY", "Sell", 168.4, 167.7, 168.8, 167.4, 0.3, 125, "Confident", 2, 25, ""],
];

// trade number, mood, followed rules, overtraded, lesson
const psychRows = [
  [1, "Calm", true, false, "Waiting for the range break paid off."],
  [2, "FOMO", false, true, "Wait for the candle to close."],
  [3, "Confident", true, false, "Patience on higher timeframes works for me."],
  [4, "Calm", true, false, "Kill zones keep me out of random trades."],
  [5, "Fear", false, false, "Do not enter when I am unsure about the setup."],
  [7, "Calm", true, false, "My checklist keeps me out of bad trades."],
  [8, "Revenge", false, true, "Never trade right after a loss."],
  [10, "Happy", true, false, "Holding to the plan works."],
  [11, "Greedy", false, false, "Close at the planned target."],
  [12, "Calm", true, false, "Same setup, same rules, same result."],
  [13, "Confident", true, false, "Structure shifts are worth waiting for."],
  [14, "FOMO", false, true, "Missing a move is cheaper than chasing it."],
  [15, "Calm", true, false, "Holding to the target on swing trades."],
];

// sample AI reviews, keyed by trade number
const reviews = {
  2: {
    rating: 4,
    summary:
      "The setup was reasonable, but the entry came before confirmation and the trade ended at the stop loss. The planned 1:2 reward was good.",
    strengths: ["Stop loss was set before entering", "Planned risk reward of 1:2"],
    mistakes: ["Entered before the candle closed", "Journal shows FOMO before the trade"],
    riskAnalysis:
      "Risk was 1% with a clear stop, which limited the damage. The planned 1:2 ratio was fine, but a rushed entry lowers the chance of reaching the target.",
    suggestions: [
      "Wait for the candle to close before entering",
      "Skip the trade when you feel FOMO",
      "Add a confirmation step to your strategy checklist",
    ],
  },
  8: {
    rating: 3,
    summary:
      "This trade was taken to recover a previous loss, not because the setup was valid. Revenge trading is the main problem here, not the market.",
    strengths: ["Stop loss was placed"],
    mistakes: [
      "Traded right after a loss",
      "Broke the scalping rule of stopping after losses",
      "Position was larger than usual",
    ],
    riskAnalysis:
      "The 0.6 lot size is larger than your other trades with the same risk setting, so the real risk was higher than planned.",
    suggestions: [
      "Take a 30 minute break after every loss",
      "Stop trading for the day after two losses in a row",
      "Keep the lot size the same for every trade",
    ],
  },
  12: {
    rating: 9,
    summary:
      "A well-planned trade. You followed your checklist, stayed calm, and held until the target.",
    strengths: [
      "Followed every item on the strategy checklist",
      "Calm mood and no overtrading",
      "Good risk reward of about 1:2.2",
    ],
    mistakes: [],
    riskAnalysis:
      "Risk was 1% with the stop just beyond the range, and the target was realistic. This is the process to repeat.",
    suggestions: [
      "Note what made this setup clear so you can spot it again",
      "Compare this trade with your losing ones to see what was different",
    ],
  },
};

const seed = async () => {
  await connectDB();

  // remove the old demo account and everything it owns
  const old = await User.findOne({ email: DEMO_EMAIL });
  if (old) {
    await Promise.all([
      Trade.deleteMany({ user: old._id }),
      Strategy.deleteMany({ user: old._id }),
      Psychology.deleteMany({ user: old._id }),
      User.deleteOne({ _id: old._id }),
    ]);
  }

  // random password, so nobody can log in as the demo user by guessing it
  const demo = await User.create({
    name: "Demo Trader",
    email: DEMO_EMAIL,
    password: crypto.randomBytes(16).toString("hex"),
  });

  const strategies = await Strategy.insertMany(
    strategyData.map((s) => ({ ...s, notes: "", user: demo._id })),
  );

  const trades = await Trade.insertMany(
    tradeRows.map(
      ([pair, side, entry, exit, stopLoss, takeProfit, lotSize, pnl, emotion, s, days, notes], i) => ({
        user: demo._id,
        pair,
        side,
        entry,
        exit,
        stopLoss,
        takeProfit,
        lotSize,
        riskPercent: 1,
        pnl,
        rr: rr(entry, stopLoss, takeProfit),
        emotion,
        notes,
        strategy: strategies[s]._id,
        tradeDate: new Date(Date.now() - days * DAY),
        aiReview: reviews[i + 1] ? { ...reviews[i + 1], reviewedAt: new Date() } : null,
      }),
    ),
  );

  await Psychology.insertMany(
    psychRows.map(([n, moodBefore, followedRules, overtraded, learned]) => ({
      user: demo._id,
      trade: trades[n - 1]._id,
      moodBefore,
      followedRules,
      overtraded,
      learned,
      entryDate: trades[n - 1].tradeDate,
    })),
  );

  console.log(
    `Demo account ready: ${strategies.length} strategies, ${trades.length} trades, ${psychRows.length} journal entries`,
  );

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});