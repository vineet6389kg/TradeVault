import React, { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";
import Modal from "../components/ui/Modal";
import TradeForm, { emotions } from "../components/trades/TradeForm";
import TradeTable from "../components/trades/TradeTable";

const selectClass =
  "rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-fg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

const Trades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true); // true only before the first load
  const [reload, setReload] = useState(0); // change this number to fetch again

  const [filters, setFilters] = useState({
    search: "",
    side: "",
    result: "",
    emotion: "",
    sort: "-tradeDate",
  });

  // modal: open or closed, and which trade is being edited (null = adding)
  const [modal, setModal] = useState({ open: false, trade: null });

  // fetch trades whenever a filter changes (wait 300ms so we do not call on every key press)
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get("/trades", { params: filters });
        setTrades(data);
      } catch (error) {
        toast.error("Could not load trades");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, reload]);

  // updates one filter, for example setFilter("side", "Buy")
  const setFilter = (name, value) =>
    setFilters((current) => ({ ...current, [name]: value }));

  const closeModal = () => setModal({ open: false, trade: null });

  const handleSaved = () => {
    closeModal();
    setReload((n) => n + 1);
  };

  const handleDelete = async (trade) => {
    if (!window.confirm(`Delete the ${trade.pair} trade?`)) return;

    try {
      await api.delete(`/trades/${trade._id}`);
      toast.success("Trade deleted");
      setReload((n) => n + 1);
    } catch (error) {
      toast.error("Could not delete trade");
    }
  };

  const hasFilters = filters.search || filters.side || filters.result || filters.emotion;

  return (
    <div>
      {/* Heading and add button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-fg">Trades</h1>
          <p className="mt-1 text-muted">Search, filter, and review every trade.</p>
        </div>
        <button
          onClick={() => setModal({ open: true, trade: null })}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-fg hover:bg-primary-hover"
        >
          <FiPlus /> Add trade
        </button>
      </div>

      {/* Search, filters and sort */}
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            placeholder="Search by pair..."
            className={`${selectClass} w-full pl-10`}
          />
        </div>

        <select value={filters.side} onChange={(e) => setFilter("side", e.target.value)} className={selectClass}>
          <option value="">All sides</option>
          <option>Buy</option>
          <option>Sell</option>
        </select>

        <select value={filters.result} onChange={(e) => setFilter("result", e.target.value)} className={selectClass}>
          <option value="">All results</option>
          <option value="win">Wins</option>
          <option value="loss">Losses</option>
          <option value="breakeven">Break even</option>
        </select>

        <select value={filters.emotion} onChange={(e) => setFilter("emotion", e.target.value)} className={selectClass}>
          <option value="">All emotions</option>
          {emotions.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>

        <select value={filters.sort} onChange={(e) => setFilter("sort", e.target.value)} className={selectClass}>
          <option value="-tradeDate">Newest first</option>
          <option value="tradeDate">Oldest first</option>
          <option value="-pnl">Highest profit</option>
          <option value="pnl">Biggest loss</option>
          <option value="-rr">Best RR</option>
        </select>
      </div>

      {/* Content: loading skeleton, empty state, or the table */}
      <div className="mt-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-14 animate-pulse rounded-xl bg-surface" />
            ))}
          </div>
        ) : trades.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center">
            <p className="font-semibold text-fg">
              {hasFilters ? "No trades match your filters" : "No trades yet"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {hasFilters
                ? "Try changing or clearing a filter."
                : "Add your first trade to start your journal."}
            </p>
          </div>
        ) : (
          <TradeTable
            trades={trades}
            onEdit={(trade) => setModal({ open: true, trade })}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Add / edit pop-up. key makes the form reset when you switch trades */}
      <Modal
        open={modal.open}
        onClose={closeModal}
        title={modal.trade ? "Edit trade" : "Add trade"}
      >
        <TradeForm
          key={modal.trade?._id || "new"}
          trade={modal.trade}
          onSaved={handleSaved}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Trades;