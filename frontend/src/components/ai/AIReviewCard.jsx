import React from "react";
import { formatDate } from "../../utils/formatters";

// a titled list of points, shown only when there is something in it
const PointList = ({ title, items, dotClass }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <h4 className="text-sm font-bold text-fg">{title}</h4>
      <ul className="mt-2 space-y-2 text-sm text-fg">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const AIReviewCard = ({ review }) => {
  // 7 or more is good (green), 4 or less is weak (red)
  const ratingTone =
    review.rating >= 7
      ? "text-profit"
      : review.rating <= 4
        ? "text-loss"
        : "text-fg";

  return (
    <div className="space-y-3">
      {/* rating and summary */}
      <div className="flex items-center gap-4 rounded-xl bg-primary/5 p-4">
        <div className="shrink-0 text-center">
          <p className={`text-4xl font-extrabold ${ratingTone}`}>
            {review.rating}
            <span className="text-lg text-muted">/10</span>
          </p>
          <p className="text-xs font-medium text-muted">Discipline rating</p>
        </div>
        <p className="text-sm text-fg">{review.summary}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <PointList title="Strengths" items={review.strengths} dotClass="bg-accent" />
        <PointList title="Mistakes" items={review.mistakes} dotClass="bg-loss" />
      </div>

      {review.riskAnalysis && (
        <div className="rounded-xl border border-border bg-white p-4">
          <h4 className="text-sm font-bold text-fg">Risk analysis</h4>
          <p className="mt-2 text-sm text-fg">{review.riskAnalysis}</p>
        </div>
      )}

      <PointList title="Suggestions" items={review.suggestions} dotClass="bg-primary" />

      <p className="text-xs text-muted">
        Reviewed on {formatDate(review.reviewedAt)}. AI feedback is for learning
        only and is not financial advice.
      </p>
    </div>
  );
};

export default AIReviewCard;