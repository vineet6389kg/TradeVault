import React from "react";
import { motion } from "framer-motion";
import { FiCpu, FiBookOpen, FiZap, FiHeart } from "react-icons/fi";

// all benefit data in one array
const reasons = [
  {
    icon: <FiCpu size={24} />,
    title: "AI-Powered Analysis",
    text: "Get instant feedback on every trade.",
  },
  {
    icon: <FiBookOpen size={24} />,
    title: "Smart Trade Journal",
    text: "Store trades with screenshots and notes.",
  },
  {
    icon: <FiZap size={24} />,
    title: "Fast Risk Management",
    text: "Calculate position size in seconds.",
  },
  {
    icon: <FiHeart size={24} />,
    title: "Trading Psychology",
    text: "Track emotions and build discipline.",
  },
];

const WhyChoose = () => {
  return (
    <section id="why" className="py-20">
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
            Why choose{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              TradeVault AI
            </span>
            ?
          </h2>
          <p className="mt-3 text-muted">
            Stop guessing why you win or lose. Learn from every trade.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-border bg-white p-6 text-center transition-shadow hover:shadow-xl hover:shadow-primary/10"
            >
              {/* icon in a gradient circle */}
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-primary to-accent text-primary-fg">
                {item.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold text-fg">{item.title}</h3>
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

export default WhyChoose;