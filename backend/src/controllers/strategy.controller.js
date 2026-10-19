import mongoose from "mongoose";
import Strategy from "../models/Strategy.js";
import Trade from "../models/Trade.js";

// turns "a\nb" or ["a", "b"] into a clean array without empty lines
const toList = (value) => {
  const list = Array.isArray(value) ? value : String(value ?? "").split("\n");
  return list.map((item) => String(item).trim()).filter(Boolean);
};

// only the fields the user is allowed to send
const pickFields = (body) => {
  const data = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.description !== undefined) data.description = body.description;
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.rules !== undefined) data.rules = toList(body.rules);
  if (body.checklist !== undefined) data.checklist = toList(body.checklist);
  return data;
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

// POST /api/strategies
export const createStrategy = async (req, res) => {
  try {
    const strategy = await Strategy.create({
      ...pickFields(req.body),
      user: req.user._id,
    });
    res.status(201).json(strategy);
  } catch (error) {
    handleError(res, error);
  }
};

// GET /api/strategies
export const getStrategies = async (req, res) => {
  try {
    const strategies = await Strategy.find({ user: req.user._id }).sort("-createdAt");
    res.json(strategies);
  } catch (error) {
    handleError(res, error);
  }
};

// PUT /api/strategies/:id
export const updateStrategy = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid strategy id" });
    }

    const strategy = await Strategy.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!strategy) return res.status(404).json({ message: "Strategy not found" });

    strategy.set(pickFields(req.body));
    await strategy.save();
    res.json(strategy);
  } catch (error) {
    handleError(res, error);
  }
};

// DELETE /api/strategies/:id
export const deleteStrategy = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid strategy id" });
    }

    const strategy = await Strategy.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!strategy) return res.status(404).json({ message: "Strategy not found" });

    // trades that used this strategy stay, they just lose the link
    await Trade.updateMany(
      { user: req.user._id, strategy: strategy._id },
      { $set: { strategy: null } },
    );

    res.json({ message: "Strategy deleted" });
  } catch (error) {
    handleError(res, error);
  }
};