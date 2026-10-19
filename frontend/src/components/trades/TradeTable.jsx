import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { formatDate, formatMoney } from "../../utils/formatters";

const headings = [
  "Date",
  "Pair",
  "Side",
  "Entry",
  "Exit",
  "RR",
  "Emotion",
  "Chart",
  "P/L",
  "",
];

const TradeTable = ({ trades, onEdit, onDelete }) => {
  return (
    // overflow-x-auto: the table scrolls sideways on small screens
    <div className="overflow-x-auto rounded-2xl border border-border bg-white">
      <table className="w-full min-w-[840px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            {headings.map((heading, i) => (
              <th key={i} className="px-4 py-3 font-medium">
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {trades.map((t) => (
            <tr
              key={t._id}
              className="border-b border-border last:border-0 hover:bg-surface/50"
            >
              <td className="px-4 py-3 text-muted">{formatDate(t.tradeDate)}</td>

              <td className="px-4 py-3 font-bold text-fg">{t.pair}</td>

              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    t.side === "Buy"
                      ? "bg-primary/10 text-primary"
                      : "bg-surface text-fg"
                  }`}
                >
                  {t.side}
                </span>
              </td>

              <td className="px-4 py-3">{t.entry}</td>
              <td className="px-4 py-3">{t.exit}</td>
              <td className="px-4 py-3">1 : {t.rr}</td>
              <td className="px-4 py-3">{t.emotion}</td>

              {/* screenshot thumbnail, click to open the full image */}
              <td className="px-4 py-3">
                {t.screenshotUrl ? (
                  <a href={t.screenshotUrl} target="_blank" rel="noreferrer">
                    <img
                      src={t.screenshotUrl}
                      alt={`${t.pair} screenshot`}
                      className="h-9 w-14 rounded-md border border-border object-cover transition-transform hover:scale-105"
                    />
                  </a>
                ) : (
                  <span className="text-muted">-</span>
                )}
              </td>

              <td
                className={`px-4 py-3 font-bold ${
                  t.pnl < 0
                    ? "text-loss"
                    : t.pnl > 0
                      ? "text-profit"
                      : "text-fg"
                }`}
              >
                {formatMoney(t.pnl)}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => onEdit(t)}
                    aria-label="Edit trade"
                    className="rounded-lg p-2 text-muted hover:bg-surface hover:text-primary"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(t)}
                    aria-label="Delete trade"
                    className="rounded-lg p-2 text-muted hover:bg-surface hover:text-loss"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeTable;