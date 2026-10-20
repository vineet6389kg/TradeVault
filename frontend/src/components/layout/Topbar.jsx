import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiSearch } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // pressing Enter opens the Trades page with this search
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/trades?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-20 flex h-[68px] items-center gap-4 border-b border-border bg-white/80 px-5 backdrop-blur-md">
      {/* menu button, only visible on mobile */}
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-lg p-2 text-fg hover:bg-surface lg:hidden"
      >
        <FiMenu size={22} />
      </button>

      <form onSubmit={handleSearch} className="relative w-full max-w-sm">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search trades by pair..."
          aria-label="Search trades"
          className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-3 text-sm text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </form>

      {/* Right side: user */}
      <div className="ml-auto flex items-center gap-3">
        <Avatar user={user} size={36} />
        <div className="hidden leading-tight sm:block">
          <p className="text-sm font-semibold text-fg">{user.name}</p>
          <p className="text-xs text-muted">{user.email}</p>
        </div>
      </div>
    </header>
  );
};

export default Topbar;