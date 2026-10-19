import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";
import Modal from "../components/ui/Modal";
import StrategyForm from "../components/strategy/StrategyForm";
import StrategyCard from "../components/strategy/StrategyCard";

const Strategies = () => {
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [modal, setModal] = useState({ open: false, strategy: null });

  useEffect(() => {
    api
      .get("/strategies")
      .then((res) => setStrategies(res.data))
      .catch(() => toast.error("Could not load strategies"))
      .finally(() => setLoading(false));
  }, [reload]);

  const closeModal = () => setModal({ open: false, strategy: null });

  const handleSaved = () => {
    closeModal();
    setReload((n) => n + 1);
  };

  const handleDelete = async (strategy) => {
    if (
      !window.confirm(
        `Delete "${strategy.name}"? Your trades will stay, but lose this strategy.`,
      )
    )
      return;

    try {
      await api.delete(`/strategies/${strategy._id}`);
      toast.success("Strategy deleted");
      setReload((n) => n + 1);
    } catch (error) {
      toast.error("Could not delete strategy");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-fg">
            Strategy library
          </h1>
          <p className="mt-1 text-muted">Your trading rules, saved in one place.</p>
        </div>
        <button
          onClick={() => setModal({ open: true, strategy: null })}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-fg hover:bg-primary-hover"
        >
          <FiPlus /> Add strategy
        </button>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-52 animate-pulse rounded-2xl bg-surface" />
            ))}
          </div>
        ) : strategies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center">
            <p className="font-semibold text-fg">No strategies yet</p>
            <p className="mt-1 text-sm text-muted">
              Add your first one, like ICT, SMC, Scalping, Swing Trading or London
              Breakout.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {strategies.map((s) => (
              <StrategyCard
                key={s._id}
                strategy={s}
                onEdit={(strategy) => setModal({ open: true, strategy })}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modal.open}
        onClose={closeModal}
        title={modal.strategy ? "Edit strategy" : "Add strategy"}
      >
        <StrategyForm
          key={modal.strategy?._id || "new"}
          strategy={modal.strategy}
          onSaved={handleSaved}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Strategies;