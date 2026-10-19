import React from "react";
import { useAuth } from "../context/AuthContext";

// the numbers are empty for now, real data comes after the trades feature
const stats = ["Net P/L", "Win rate", "Average RR", "Discipline"];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-fg">
        Welcome back, {user.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-muted">Here is how your trading looks this month.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((label) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-white p-5"
          >
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-1 text-3xl font-extrabold text-fg">-</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center text-muted">
        Your recent trades will show here once you add them.
      </div>
    </div>
  );
};

export default Dashboard;