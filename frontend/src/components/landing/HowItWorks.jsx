import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Create account",
    text: "Sign up in under a minute. No broker needed.",
  },
  {
    title: "Add a trade",
    text: "Log prices, notes, emotion, and a screenshot after you trade.",
  },
  {
    title: "Analyze with AI",
    text: "Get instant feedback on mistakes, strengths, and risk.",
  },
  {
    title: "Improve performance",
    text: "Spot patterns, follow your rules, and trade with discipline.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how" className="bg-surface/60 py-20">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-fg md:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-muted">
            From your first trade to better decisions in four simple steps.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-white p-6"
            >
              {/* step number in a gradient circle */}
              <span className="grid h-10 w-10 place-items-center rounded-full bg-linear-to-br from-primary to-accent font-bold text-primary-fg">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold text-fg">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;