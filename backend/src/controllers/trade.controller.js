import mongoose from "mongoose";
import Trade from "../models/Trade.js";

// fields the user is allowed to send (rr and user are never accepted from the body)
const allowedFields = [
  "pair",
  "side",
  "entry",
  "exit",
  "stopLoss",
  "takeProfit",
  "riskPercent",
  "lotSize",
  "pnl",
  "emotion",
  "notes",
  "tradeDate",
];

// copies only the allowed fields from the request body
const pickFields = (body) => {
  const data = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });
  return data;
};

// risk reward = reward distance divided by risk distance
const calculateRR = (entry, stopLoss, takeProfit) => {
  const risk = Math.abs(entry - stopLoss);
  if (!risk) return 0;
  return +(Math.abs(takeProfit - entry) / risk).toFixed(2);
};

// makes search text safe, so characters like "." or "(" cannot break the search
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// sends a clean error message to the frontend
const handleError = (res, error) => {
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ message });
  }
  res.status(500).json({ message: error.message });
};

// POST /api/trades
export const createTrade = async (req, res) => {
  try {
    const data = pickFields(req.body);

    const trade = await Trade.create({
      ...data,
      rr: calculateRR(
        Number(data.entry),
        Number(data.stopLoss),
        Number(data.takeProfit),
      ),
      user: req.user._id,
    });

    res.status(201).json(trade);
  } catch (error) {
    handleError(res, error);
  }
};

// GET /api/trades?search=eur&side=Buy&emotion=FOMO&result=win&sort=-pnl
export const getTrades = async (req, res) => {
  try {
    const { search, side, emotion, result, sort } = req.query;

    // always only this user's trades
    const filter = { user: req.user._id };

    if (search) filter.pair = { $regex: escapeRegex(search), $options: "i" };
    if (side) filter.side = side;
    if (emotion) filter.emotion = emotion;
    if (result === "win") filter.pnl = { $gt: 0 };
    if (result === "loss") filter.pnl = { $lt: 0 };
    if (result === "breakeven") filter.pnl = 0;

    // only allow these sort values
    const sortOptions = ["tradeDate", "-tradeDate", "pnl", "-pnl", "rr", "-rr"];
    const sortBy = sortOptions.includes(sort) ? sort : "-tradeDate";

    const trades = await Trade.find(filter).sort(sortBy);
    res.json(trades);
  } catch (error) {
    handleError(res, error);
  }
};

// GET /api/trades/:id
export const getTrade = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid trade id" });
    }

    const trade = await Trade.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trade) return res.status(404).json({ message: "Trade not found" });
    res.json(trade);
  } catch (error) {
    handleError(res, error);
  }
};

// PUT /api/trades/:id
export const updateTrade = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid trade id" });
    }

    const trade = await Trade.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!trade) return res.status(404).json({ message: "Trade not found" });

    trade.set(pickFields(req.body));
    // prices may have changed, so calculate rr again
    trade.rr = calculateRR(trade.entry, trade.stopLoss, trade.takeProfit);

    await trade.save();
    res.json(trade);
  } catch (error) {
    handleError(res, error);
  }
};

// DELETE /api/trades/:id
export const deleteTrade = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid trade id" });
    }

    const trade = await Trade.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trade) return res.status(404).json({ message: "Trade not found" });
    res.json({ message: "Trade deleted" });
  } catch (error) {
    handleError(res, error);
  }
};