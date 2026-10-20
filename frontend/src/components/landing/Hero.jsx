import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiPlay } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import HeroPreview from "./HeroPreview";

const Hero = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(false);

  // logs into the demo account and opens the dashboard
  const handleDemo = async () => {
    setDemoLoading(true);
    try {
      await demoLogin();
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not start the demo");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <header className="bg-linear-to-br from-primary/5 via-white to-accent/10">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        {/* Left side: text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-fg transition-colors hover:bg-primary-hover"
            >
              Get Started <FiArrowRight />
            </Link>
            <button
              onClick={handleDemo}
              disabled={demoLoading}
              className="flex items-center gap-2 rounded-lg border border-border bg-white px-6 py-3 font-semibold text-fg transition-colors hover:bg-surface disabled:opacity-60"
            >
              <FiPlay /> {demoLoading ? "Opening demo..." : "Live Demo"}
            </button>
          </div>

          <p className="mt-5 text-sm text-muted">
            No broker connection. No real money. Just better habits.
          </p>
        </motion.div>

        {/* Right side: animated preview */}
        <HeroPreview />
      </div>
    </header>
  );
};

export default Hero;