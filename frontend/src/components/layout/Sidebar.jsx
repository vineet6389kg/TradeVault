import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiSliders,
  FiLayers,
  FiHeart,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

// main links, add a new page here and it shows up in the sidebar
const links = [
  { to: "/dashboard", label: "Dashboard", icon: <FiHome size={18} /> },
  { to: "/trades", label: "Trades", icon: <FiBookOpen size={18} /> },
  { to: "/risk", label: "Risk calculators", icon: <FiSliders size={18} /> },
  { to: "/strategies", label: "Strategies", icon: <FiLayers size={18} /> },
  { to: "/psychology", label: "Psychology", icon: <FiHeart size={18} /> },
];

// NavLink tells us if the link is the current page (isActive)
const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors ${
    isActive
      ? "bg-primary/10 font-semibold text-primary"
      : "text-muted hover:bg-surface hover:text-fg"
  }`;

// open and onClose control the slide-in menu on mobile
const Sidebar = ({ open, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {/* dark overlay behind the menu on mobile, click it to close */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-fg/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-white p-4 transition-transform duration-300 lg:sticky lg:inset-auto lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="mb-6 flex items-center gap-2.5 px-2 pt-1">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-primary to-accent text-lg font-extrabold text-primary-fg">
            T
          </span>
          <span className="text-xl font-bold text-fg">TradeVault</span>
        </Link>

        {/* Main links */}
        <nav className="flex flex-col gap-1">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={linkClass}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom links (mt-auto pushes them to the bottom) */}
        <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
          <NavLink to="/profile" onClick={onClose} className={linkClass}>
            <FiUser size={18} />
            Profile
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-muted transition-colors hover:bg-surface hover:text-loss"
          >
            <FiLogOut size={18} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;