import React, { useState } from "react";
import { FiZap } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../api/axios";
import AIReviewCard from "./AIReviewCard";
import { formatMoney } from "../../utils/formatters";

const AIReviewPanel = ({ trade, onReviewed }) => {
  // starts with the saved review, if the trade already has one
  const [review, setReview] = useState(trade.aiReview);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/ai/review/${trade._id}`);
      setReview(data);
      onReviewed(); // tells the Trades page to refresh its list
    } catch (error) {
      toast.error(error.response?.data?.message || "AI review failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* which trade is being reviewed */}
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-bold text-fg">{trade.pair}</span>
        <span className="text-muted">{trade.side}</span>
        <span
          className={`font-bold ${
            trade.pnl < 0 ? "text-loss" : trade.pnl > 0 ? "text-profit" : "text-fg"
          }`}
        >
          {formatMoney(trade.pnl)}
        </span>
      </div>

      {loading ? (
        <div className="grid place-items-center gap-3 py-14 text-center" aria-live="polite">
          <span className="h-9 w-9 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm text-muted">
            Gemini is reviewing your trade. This takes a few seconds.
          </p>
        </div>
      ) : review ? (
        <AIReviewCard review={review} />
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-surface/50 p-8 text-center">
          <p className="font-semibold text-fg">No review yet</p>
          <p className="mt-1 text-sm text-muted">
            The AI looks at your prices, strategy, emotion, and journal entry for
            this trade.
          </p>
        </div>
      )}

      {!loading && (
        <button
          onClick={analyze}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-semibold text-primary-fg hover:bg-primary-hover"
        >
          <FiZap />
          {review ? "Analyze again" : "Analyze with AI"}
        </button>
      )}
    </div>
  );
};

export default AIReviewPanel;