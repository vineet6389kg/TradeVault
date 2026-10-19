import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiPlay } from "react-icons/fi";

const Hero = () => {
  return (
    <header className="bg-linear-to-br from-primary/5 via-white to-accent/10">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        {/* Left side: text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Small badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-sm font-medium text-muted">
            <span className="h-2 w-2 rounded-full bg-accent"></span>
            AI-powered trading journal
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-fg md:text-6xl">
            Master Every Trade with{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              AI
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted">
            Journal your trades, calculate risk, track psychology, organize
            strategies, and receive AI-powered feedback to become a
            disciplined trader.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-fg transition-colors hover:bg-primary-hover"
            >
              Get Started <FiArrowRight />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-lg border border-border bg-white px-6 py-3 font-semibold text-fg transition-colors hover:bg-surface"
            >
              <FiPlay /> Live Demo
            </Link>
          </div>

          <p className="mt-5 text-sm text-muted">
            No broker connection. No real money. Just better habits.
          </p>
        </motion.div>

        {/* Right side: placeholder card (animated preview comes in next step) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border border-border bg-white p-6 shadow-xl shadow-primary/10"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-fg">Trade Journal</h3>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              Preview
            </span>
          </div>

          {[
            ["Pair", "EUR/USD"],
            ["Side", "Buy"],
            ["Entry to Exit", "1.0850 to 1.0910"],
            ["Risk : Reward", "1 : 2.0"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between border-b border-border py-3 text-sm last:border-0"
            >
              <span className="text-muted">{label}</span>
              <span className="font-medium text-fg">{value}</span>
            </div>
          ))}

          <div className="flex justify-between pt-3 text-sm">
            <span className="text-muted">Profit</span>
            <span className="font-bold text-accent">+$120</span>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Hero;