import React from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiCheckSquare } from "react-icons/fi";

const StrategyCard = ({ strategy, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col rounded-2xl border border-border bg-white p-5 transition-shadow hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-bold text-fg">{strategy.name}</h3>
        <div className="flex shrink-0 gap-1">
          <button
            onClick={() => onEdit(strategy)}
            aria-label="Edit strategy"
            className="rounded-lg p-2 text-muted hover:bg-surface hover:text-primary"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(strategy)}
            aria-label="Delete strategy"
            className="rounded-lg p-2 text-muted hover:bg-surface hover:text-loss"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {strategy.description && (
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {strategy.description}
        </p>
      )}

      {/* first 3 rules */}
      {strategy.rules.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-sm text-fg">
          {strategy.rules.slice(0, 3).map((rule) => (
            <li key={rule} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {rule}
            </li>
          ))}
          {strategy.rules.length > 3 && (
            <li className="text-muted">+{strategy.rules.length - 3} more rules</li>
          )}
        </ul>
      )}

      {/* mt-auto pushes the footer to the bottom of the card */}
      <div className="mt-auto flex items-center gap-2 border-t border-border pt-4 text-sm text-muted">
        <FiCheckSquare />
        {strategy.checklist.length} checklist item
        {strategy.checklist.length === 1 ? "" : "s"}
      </div>
    </motion.div>
  );
};

export default StrategyCard;