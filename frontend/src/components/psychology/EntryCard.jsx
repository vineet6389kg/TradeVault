import React from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { formatDate, formatMoney } from "../../utils/formatters";

const goodMoods = ["Calm", "Confident", "Happy"];

// small Yes / No badge, green when it is a good answer, red when it is not
const Badge = ({ label, good }) => (
  <span
    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
      good ? "bg-accent/10 text-profit" : "bg-loss/10 text-loss"
    }`}
  >
    {label}
  </span>
);

const EntryCard = ({ entry, onEdit, onDelete }) => {
  const good = goodMoods.includes(entry.moodBefore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-border bg-white p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              good ? "bg-accent/10 text-profit" : "bg-loss/10 text-loss"
            }`}
          >
            {entry.moodBefore}
          </span>
          <span className="text-sm text-muted">{formatDate(entry.entryDate)}</span>
          {entry.trade && (
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-fg">
              {entry.trade.pair} {entry.trade.side} ({formatMoney(entry.trade.pnl)})
            </span>
          )}
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit(entry)}
            aria-label="Edit entry"
            className="rounded-lg p-2 text-muted hover:bg-surface hover:text-primary"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(entry)}
            aria-label="Delete entry"
            className="rounded-lg p-2 text-muted hover:bg-surface hover:text-loss"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge
          label={entry.followedRules ? "Followed rules" : "Broke rules"}
          good={entry.followedRules}
        />
        <Badge
          label={entry.overtraded ? "Overtraded" : "No overtrading"}
          good={!entry.overtraded}
        />
      </div>

      {entry.learned && (
        <p className="mt-3 text-sm text-fg">
          <span className="font-semibold">Lesson:</span> {entry.learned}
        </p>
      )}
      {entry.notes && <p className="mt-1 text-sm text-muted">{entry.notes}</p>}
    </motion.div>
  );
};

export default EntryCard;