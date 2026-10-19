import mongoose from "mongoose";
import Psychology from "../models/Psychology.js";
import Trade from "../models/Trade.js";

const allowedFields = [
  "trade",
  "moodBefore",
  "followedRules",
  "overtraded",
  "learned",
  "notes",
  "entryDate",
];

const pickFields = (body) => {
  const data = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });
  // "" means no trade was chosen
  if (data.trade === "") data.trade = null;
  return data;
};

// true if no trade was given, or the trade exists and belongs to this user
const tradeIsValid = async (tradeId, userId) => {
  if (!tradeId) return true;
  if (!mongoose.isValidObjectId(tradeId)) return false;
  return !!(await Trade.exists({ _id: tradeId, user: userId }));
};

const handleError = (res, error) => {
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ message });
  }
  res.status(500).json({ message: error.message });
};

// populate the trade so the page can show "EUR/USD, Buy, +$120"
const tradeFields = "pair side pnl tradeDate";

// POST /api/psychology
export const createEntry = async (req, res) => {
  try {
    const data = pickFields(req.body);

    if (!(await tradeIsValid(data.trade, req.user._id))) {
      return res.status(400).json({ message: "Trade not found" });
    }

    const entry = await Psychology.create({ ...data, user: req.user._id });
    await entry.populate("trade", tradeFields);
    res.status(201).json(entry);
  } catch (error) {
    handleError(res, error);
  }
};

// GET /api/psychology
export const getEntries = async (req, res) => {
  try {
    const entries = await Psychology.find({ user: req.user._id })
      .sort("-entryDate")
      .populate("trade", tradeFields);
    res.json(entries);
  } catch (error) {
    handleError(res, error);
  }
};

// PUT /api/psychology/:id
export const updateEntry = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid entry id" });
    }

    const entry = await Psychology.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    const data = pickFields(req.body);

    if (!(await tradeIsValid(data.trade, req.user._id))) {
      return res.status(400).json({ message: "Trade not found" });
    }

    entry.set(data);
    await entry.save();
    await entry.populate("trade", tradeFields);
    res.json(entry);
  } catch (error) {
    handleError(res, error);
  }
};

// DELETE /api/psychology/:id
export const deleteEntry = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid entry id" });
    }

    const entry = await Psychology.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    res.json({ message: "Entry deleted" });
  } catch (error) {
    handleError(res, error);
  }
};