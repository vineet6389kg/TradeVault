import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

// the buttons on the right, they change when the user is logged in
// the same component is used on desktop and inside the mobile menu
const AuthButtons = ({ onNavigate }) => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // wait until we know if the saved login is valid, so the buttons do not flicker
  if (loading) return null;

  const base =
    "flex-1 rounded-lg px-4 py-2 text-center font-semibold transition-colors md:flex-none";
  const outline = `${base} border border-border text-fg hover:bg-surface`;
  const solid = `${base} bg-primary text-primary-fg hover:bg-primary-hover`;

  // logged in: go to the dashboard, or log out
  if (user) {
    return (
      <>
        <button
          onClick={() => {
            logout();
            onNavigate?.();
            navigate("/");
          }}
          className={outline}
        >
          {user.isDemo ? "Exit demo" : "Log out"}
        </button>
        <Link to="/dashboard" onClick={onNavigate} className={solid}>
          {user.isDemo ? "Back to demo" : "Dashboard"}
        </Link>
      </>
    );
  }

  // logged out
  return (
    <>
      <Link to="/login" onClick={onNavigate} className={outline}>
        Log in
      </Link>
      <Link to="/register" onClick={onNavigate} className={solid}>
        Get started
      </Link>
    </>
  );
};

const Navbar = () => {
  // controls the mobile menu (open / closed)
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
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
          <AuthButtons />
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
                <AuthButtons onNavigate={() => setOpen(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;