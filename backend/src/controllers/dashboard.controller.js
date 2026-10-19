import Trade from "../models/Trade.js";
import Psychology from "../models/Psychology.js";

// GET /api/dashboard
export const getDashboard = async (req, res) => {
  try {
    const [stats] = await Trade.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          netPnl: { $sum: "$pnl" },
          total: { $sum: 1 },
          wins: { $sum: { $cond: [{ $gt: ["$pnl", 0] }, 1, 0] } },
          avgRR: { $avg: "$rr" },
        },
      },
    ]);

    // how many journal entries say "I followed my rules"
    const [psych] = await Psychology.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          followed: { $sum: { $cond: ["$followedRules", 1, 0] } },
        },
      },
    ]);

    const recentTrades = await Trade.find({ user: req.user._id })
      .sort("-tradeDate")
      .limit(5)
      .populate("strategy", "name");

    res.json({
      netPnl: stats?.netPnl ?? 0,
      totalTrades: stats?.total ?? 0,
      winRate: stats ? Math.round((stats.wins / stats.total) * 100) : 0,
      avgRR: stats ? +stats.avgRR.toFixed(1) : 0,
      // null means "no journal entries yet", so the card shows "-"
      discipline: psych ? Math.round((psych.followed / psych.total) * 100) : null,
      recentTrades,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};