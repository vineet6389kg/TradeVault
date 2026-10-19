import React from "react";
import { Link } from "react-router-dom";
import { formatDate, formatMoney } from "../../utils/formatters";

const RecentTrades = ({ trades }) => {
  // new user: no trades yet
  if (trades.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center">
        <p className="font-semibold text-fg">No trades yet</p>
        <p className="mt-1 text-sm text-muted">
          Add your first trade to see your stats here.
        </p>
        <Link
          to="/trades"
          className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-fg hover:bg-primary-hover"
        >
          Add a trade
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-fg">Recent trades</h2>
        <Link to="/trades" className="text-sm font-semibold text-primary hover:underline">
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              {["Date", "Pair", "Side", "RR", "Strategy", "P/L"].map((h) => (
                <th key={h} className="px-3 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr key={t._id} className="border-b border-border last:border-0">
                <td className="px-3 py-3 text-muted">{formatDate(t.tradeDate)}</td>
                <td className="px-3 py-3 font-bold text-fg">{t.pair}</td>
                <td className="px-3 py-3">{t.side}</td>
                <td className="px-3 py-3">1 : {t.rr}</td>
                <td className="px-3 py-3 text-muted">-</td>
                <td
                  className={`px-3 py-3 font-bold ${
                    t.pnl < 0 ? "text-loss" : t.pnl > 0 ? "text-profit" : "text-fg"
                  }`}
                >
                  {formatMoney(t.pnl)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTrades;