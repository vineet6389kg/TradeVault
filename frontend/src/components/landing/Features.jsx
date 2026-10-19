    import React from "react";
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiZap,
  FiSliders,
  FiLayers,
  FiHeart,
  FiLock,
} from "react-icons/fi";

// all feature data in one array
const features = [
  {
    icon: <FiBookOpen size={22} />,
    title: "Trade Journal",
    text: "Log every trade with prices, notes, emotion, and a screenshot. Search, filter, and sort them anytime.",
  },
  {
    icon: <FiZap size={22} />,
    title: "AI Trade Review",
    text: "Get strengths, mistakes, and a discipline rating for each trade from Gemini AI.",
  },
  {
    icon: <FiSliders size={22} />,
    title: "Risk Management",
    text: "Position size, risk-reward, and profit calculators to plan every trade before you take it.",
  },
  {
    icon: <FiLayers size={22} />,
    title: "Strategy Library",
    text: "Save your rules and checklists for ICT, SMC, scalping and more, then attach them to trades.",
  },
  {
    icon: <FiHeart size={22} />,
    title: "Psychology Journal",
    text: "Track your mood before and after trades and see how emotions affect your results.",
  },
  {
    icon: <FiLock size={22} />,
    title: "Secure Sign-in",
    text: "JWT authentication with hashed passwords keeps your trading data private.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-6xl px-5">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-fg md:text-4xl">
            Everything a trader needs to improve
          </h2>
          <p className="mt-3 text-muted">
            Six tools in one calm workspace, built to make you more consistent.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              // each card starts a little after the previous one
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-border bg-white p-6 transition-shadow hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                {item.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-fg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;