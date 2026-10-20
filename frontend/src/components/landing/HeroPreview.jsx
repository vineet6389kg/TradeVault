import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiBookOpen, FiZap, FiSliders, FiHeart } from "react-icons/fi";

// all card data lives in one array, so the JSX below stays short
// tone: "profit" shows green text, "loss" shows red text
const cards = [
  {
    id: "journal",
    path: "/trades",
    tab: "Journal",
    icon: <FiBookOpen />,
    title: "Trade Journal",
    tag: "EUR/USD",
    rows: [
      { label: "Pair", value: "EUR/USD" },
      { label: "Side", value: "Buy" },
      { label: "Entry to Exit", value: "1.0850 to 1.0910" },
      { label: "Risk : Reward", value: "1 : 2.0" },
      { label: "Profit", value: "+$120", tone: "profit" },
    ],
  },
  {
    id: "ai",
    path: "/trades",
    tab: "AI Review",
    icon: <FiZap />,
    title: "AI Trade Review",
    tag: "Gemini",
    rows: [
      { label: "Entry", value: "Slightly early" },
      { label: "Risk", value: "Well controlled" },
      { label: "Suggestion", value: "Wait for confirmation" },
      { label: "Overall rating", value: "7 / 10", tone: "profit" },
    ],
  },
  {
    id: "risk",
    path: "/risk",
    tab: "Risk",
    icon: <FiSliders />,
    title: "Risk Calculator",
    tag: "Lot size",
    rows: [
      { label: "Balance", value: "$10,000" },
      { label: "Risk", value: "1%" },
      { label: "Stop loss", value: "20 pips" },
      { label: "Lot size", value: "0.50" },
      { label: "Potential loss", value: "-$100", tone: "loss" },
    ],
  },
  {
    id: "psychology",
    path: "/psychology",
    tab: "Psychology",
    icon: <FiHeart />,
    title: "Trading Psychology",
    tag: "Mood",
    rows: [
      { label: "Mood", value: "Calm" },
      { label: "Followed rules", value: "Yes" },
      { label: "Emotion score", value: "8 / 10" },
      { label: "Discipline score", value: "92%", tone: "profit" },
    ],
  },
];

// text color for each tone
const toneClass = {
  profit: "font-bold text-profit",
  loss: "font-bold text-loss",
};

const HeroPreview = () => {
  const [index, setIndex] = useState(0); // which card is visible
  const [paused, setPaused] = useState(false); // true while the mouse is over it
  const navigate = useNavigate();

  // auto switch to the next card every 3.5 seconds
  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % cards.length);
    }, 3500);

    // cleanup: stop the old timer when index or paused changes
    return () => clearInterval(timer);
  }, [paused, index]);

  const card = cards[index];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* fixed height, so the page does not jump when cards change */}
      <div className="relative min-h-[340px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35 }}
            whileHover={{ y: -4 }}
            // logged-out visitors are sent to the login page by ProtectedRoute
            onClick={() => navigate(card.path)}
            role="button"
            className="cursor-pointer rounded-2xl border border-border bg-white p-6 shadow-xl shadow-primary/10"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-fg">{card.title}</h3>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {card.tag}
              </span>
            </div>

            {card.rows.map((row) => (
              <div
                key={row.label}
                className="flex justify-between border-b border-border py-3 text-sm last:border-0"
              >
                <span className="text-muted">{row.label}</span>
                <span className={toneClass[row.tone] || "font-medium text-fg"}>
                  {row.value}
                </span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* tabs under the card, click one to jump to that card */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {cards.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setIndex(i)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              i === index ?
                "border-primary bg-primary text-primary-fg"
              : "border-border bg-white text-muted hover:bg-surface"
            }`}
          >
            {item.icon}
            {item.tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroPreview;
