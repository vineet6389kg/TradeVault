import React from "react";
import { motion } from "framer-motion";

// tone: "profit" shows green text, "loss" shows red text
const toneClass = {
  profit: "text-profit",
  loss: "text-loss",
};

const StatCard = ({ label, value, tone }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border bg-white p-5"
    >
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 text-3xl font-extrabold ${toneClass[tone] || "text-fg"}`}>
        {value}
      </p>
    </motion.div>
  );
};

export default StatCard;