import mongoose from "mongoose";
import Trade from "../models/Trade.js";
import Strategy from "../models/Strategy.js";
import { uploadImage, deleteImage } from "../services/cloudinary.service.js";
import Psychology from "../models/Psychology.js";

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
  "strategy",
];

const pickFields = (body) => {
  const data = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });
  // FormData sends "" when no strategy is chosen, which means "no strategy"
  if (data.strategy === "") data.strategy = null;
  return data;
};

// returns true if the strategy exists and belongs to this user (or no strategy was given)
const strategyIsValid = async (strategyId, userId) => {
  if (!strategyId) return true;
  if (!mongoose.isValidObjectId(strategyId)) return false;
  return !!(await Strategy.exists({ _id: strategyId, user: userId }));
};

// risk reward = reward distance divided by risk distance
const calculateRR = (entry, stopLoss, takeProfit) => {
  const risk = Math.abs(entry - stopLoss);
  if (!risk) return 0;
  return +(Math.abs(takeProfit - entry) / risk).toFixed(2);
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const handleError = (res, error) => {
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ message });
  }
  res.status(500).json({ message: error.message });
};

// POST /api/trades (form-data, with an optional "screenshot" file)
export const createTrade = async (req, res) => {
  try {
    const data = pickFields(req.body);

    if (!(await strategyIsValid(data.strategy, req.user._id))) {
      return res.status(400).json({ message: "Strategy not found" });
    }

    // upload the screenshot first, if there is one
    let image = {};
    if (req.file) {
      const result = await uploadImage(req.file.buffer);
      image = {
        screenshotUrl: result.secure_url,
        screenshotId: result.public_id,
      };
    }

    const trade = await Trade.create({
      ...data,
      ...image,
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

    const filter = { user: req.user._id };

    if (search) filter.pair = { $regex: escapeRegex(search), $options: "i" };
    if (side) filter.side = side;
    if (emotion) filter.emotion = emotion;
    if (result === "win") filter.pnl = { $gt: 0 };
    if (result === "loss") filter.pnl = { $lt: 0 };
    if (result === "breakeven") filter.pnl = 0;

    const sortOptions = ["tradeDate", "-tradeDate", "pnl", "-pnl", "rr", "-rr"];
    const sortBy = sortOptions.includes(sort) ? sort : "-tradeDate";

    // populate replaces the strategy id with { _id, name }
    const trades = await Trade.find(filter)
      .sort(sortBy)
      .populate("strategy", "name");
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
    }).populate("strategy", "name");

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

    const data = pickFields(req.body);

    if (!(await strategyIsValid(data.strategy, req.user._id))) {
      return res.status(400).json({ message: "Strategy not found" });
    }

    trade.set(data);
    trade.rr = calculateRR(trade.entry, trade.stopLoss, trade.takeProfit);

    if (req.file) {
      // new image: upload it, then delete the old one
      const result = await uploadImage(req.file.buffer);
      await deleteImage(trade.screenshotId);
      trade.screenshotUrl = result.secure_url;
      trade.screenshotId = result.public_id;
    } else if (req.body.removeScreenshot === "true") {
      // the user pressed "Remove"
      await deleteImage(trade.screenshotId);
      trade.screenshotUrl = "";
      trade.screenshotId = "";
    }

    await trade.save();
    await trade.populate("strategy", "name");
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

    // remove the screenshot from Cloudinary too
    await deleteImage(trade.screenshotId);

    // journal entries stay, they just lose the link to the deleted trade
    await Psychology.updateMany(
      { user: req.user._id, trade: trade._id },
      { $set: { trade: null } },
    );

    res.json({ message: "Trade deleted" });

    res.json({ message: "Trade deleted" });
  } catch (error) {
    handleError(res, error);
  }
};
