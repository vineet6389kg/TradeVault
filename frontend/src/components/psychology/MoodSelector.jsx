import React from "react";
import { emotions } from "../trades/TradeForm";

// calm moods are green, risky moods are red
const goodMoods = ["Calm", "Confident", "Happy"];

const MoodSelector = ({ value, onChange }) => {
  return (
    <div className="mt-1.5 flex flex-wrap gap-2">
      {emotions.map((mood) => {
        const selected = value === mood;
        const good = goodMoods.includes(mood);

        return (
          <button
            key={mood}
            type="button"
            onClick={() => onChange(mood)}
            aria-pressed={selected}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              selected
                ? good
                  ? "border-accent bg-accent/10 text-profit"
                  : "border-loss bg-loss/10 text-loss"
                : "border-border bg-white text-muted hover:bg-surface"
            }`}
          >
            {mood}
          </button>
        );
      })}
    </div>
  );
};

export default MoodSelector;