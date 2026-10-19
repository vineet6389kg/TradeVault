import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  // controls the mobile menu (open / closed)
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "Tech stack", href: "#stack" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-primary to-accent text-lg font-extrabold text-primary-fg">
            T
          </span>
          <span className="text-xl font-bold text-fg">
            TradeVault <span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Desktop links (hidden on mobile) */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-medium text-muted transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop buttons (hidden on mobile) */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-lg border border-border px-4 py-2 font-semibold text-fg transition-colors hover:bg-surface"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-fg transition-colors hover:bg-primary-hover"
          >
            Get started
          </Link>
        </div>

        {/* Mobile menu button (hidden on desktop) */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="rounded-lg p-2 text-fg hover:bg-surface md:hidden"
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile menu with Framer Motion animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-white md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 font-medium text-muted hover:bg-surface hover:text-fg"
                >
                  {link.label}
                </a>
              ))}

              <div className="mt-3 flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-border py-2.5 text-center font-semibold"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg bg-primary py-2.5 text-center font-semibold text-primary-fg"
                >
                  Get started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;