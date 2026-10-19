import React from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

const Footer = () => {
  // change these to your real links
  const social = [
    {
      label: "GitHub",
      icon: <FiGithub size={20} />,
      href: "",
    },
    {
      label: "LinkedIn",
      icon: <FiLinkedin size={20} />,
      href: "",
    },
    {
      label: "Email",
      icon: <FiMail size={20} />,
      href: "",
    },
  ];

  const productLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
  ];

  return (
    // id="contact" is what the navbar "Contact" link scrolls to
    <footer id="contact" className="bg-fg text-white/70">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-primary to-accent text-lg font-extrabold text-primary-fg">
                T
              </span>
              <span className="text-xl font-bold text-white">
                TradeVault AI
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              A trading journal and AI coach that helps traders become more
              consistent and disciplined.
            </p>

            {/* Social icons */}
            <div className="mt-5 flex gap-3">
              {social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-semibold text-white">Product</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  to="/register"
                  className="transition-colors hover:text-white"
                >
                  Get started
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-semibold text-white">Company</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {/* these pages do not exist yet, "#" is a placeholder */}
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a
                  href="mailto:you@example.com"
                  className="transition-colors hover:text-white"
                >
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-12 border-t border-white/15 pt-6 text-sm text-white/55">
          <p>
            © {new Date().getFullYear()} TradeVault AI. All rights reserved.
          </p>
          <p className="mt-1">
            AI reviews are for learning only and are not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;