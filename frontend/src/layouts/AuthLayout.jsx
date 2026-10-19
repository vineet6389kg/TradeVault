import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AuthLayout = ({ title, subtitle, children, footer }) => {
  return (
    <div className="grid min-h-screen place-items-center bg-linear-to-br from-primary/5 via-white to-accent/10 px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="mb-6 flex items-center justify-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-primary to-accent text-xl font-extrabold text-primary-fg">
            T
          </span>
          <span className="text-2xl font-bold text-fg">
            TradeVault <span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-white p-7 shadow-xl shadow-primary/10">
          <h1 className="text-2xl font-extrabold text-fg">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>

          <div className="mt-6">{children}</div>
        </div>

        <p className="mt-5 text-center text-sm text-muted">{footer}</p>
      </motion.div>
    </div>
  );
};

export default AuthLayout;