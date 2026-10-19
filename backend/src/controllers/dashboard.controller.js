import Trade from "../models/Trade.js";

// GET /api/dashboard
export const getDashboard = async (req, res) => {
  try {
    // adds up all of this user's trades in one database query
    const [stats] = await Trade.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          netPnl: { $sum: "$pnl" },
          total: { $sum: 1 },
          // counts 1 for every trade with profit above 0
          wins: { $sum: { $cond: [{ $gt: ["$pnl", 0] }, 1, 0] } },
          avgRR: { $avg: "$rr" },
        },
      },
    ]);

    const recentTrades = await Trade.find({ user: req.user._id })
      .sort("-tradeDate")
      .limit(5);

    // a new user has no trades, so stats is undefined and we send zeros
    res.json({
      netPnl: stats?.netPnl ?? 0,
      totalTrades: stats?.total ?? 0,
      winRate: stats ? Math.round((stats.wins / stats.total) * 100) : 0,
      avgRR: stats ? +stats.avgRR.toFixed(1) : 0,
      recentTrades,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};