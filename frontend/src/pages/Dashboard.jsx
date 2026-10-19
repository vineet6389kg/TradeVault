import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import StatCard from "../components/dashboard/StatCard";
import RecentTrades from "../components/dashboard/RecentTrades";
import { formatMoney } from "../utils/formatters";

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

  // load the numbers once when the page opens
  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setFailed(true));
  }, []);

  const hasTrades = data && data.totalTrades > 0;

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-fg">
        Welcome back, {user.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-muted">Here is how your trading looks.</p>

      {failed ?
        <div className="mt-8 rounded-2xl border border-border bg-surface/50 p-10 text-center text-muted">
          Could not load your dashboard. Check that the backend is running.
        </div>
      : !data ?
        // skeleton while loading
        <div className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-24 animate-pulse rounded-2xl bg-surface"
              />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-2xl bg-surface" />
        </div>
      : <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Net P/L"
              value={hasTrades ? formatMoney(data.netPnl) : "-"}
              tone={
                data.netPnl < 0 ? "loss"
                : data.netPnl > 0 ?
                  "profit"
                : undefined
              }
            />
            <StatCard
              label="Win rate"
              value={hasTrades ? `${data.winRate}%` : "-"}
            />
            <StatCard
              label="Average RR"
              value={hasTrades ? `1 : ${data.avgRR}` : "-"}
            />
            <StatCard
              label="Discipline"
              value={data.discipline === null ? "-" : `${data.discipline}%`}
            />
          </div>

          <div className="mt-6">
            <RecentTrades trades={data.recentTrades} />
          </div>
        </>
      }
    </div>
  );
};

export default Dashboard;
