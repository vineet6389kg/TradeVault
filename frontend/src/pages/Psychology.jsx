import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api/axios";
import Modal from "../components/ui/Modal";
import PsychologyForm from "../components/psychology/PsychologyForm";
import EntryCard from "../components/psychology/EntryCard";
import StatCard from "../components/dashboard/StatCard";

const Psychology = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [modal, setModal] = useState({ open: false, entry: null });

  useEffect(() => {
    api
      .get("/psychology")
      .then((res) => setEntries(res.data))
      .catch(() => toast.error("Could not load your journal"))
      .finally(() => setLoading(false));
  }, [reload]);

  const closeModal = () => setModal({ open: false, entry: null });

  const handleSaved = () => {
    closeModal();
    setReload((n) => n + 1);
  };

  const handleDelete = async (entry) => {
    if (!window.confirm("Delete this journal entry?")) return;

    try {
      await api.delete(`/psychology/${entry._id}`);
      toast.success("Entry deleted");
      setReload((n) => n + 1);
    } catch (error) {
      toast.error("Could not delete entry");
    }
  };

  // quick numbers, calculated from the entries we already loaded
  const total = entries.length;
  const followed = entries.filter((e) => e.followedRules).length;
  const overtraded = entries.filter((e) => e.overtraded).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-fg">
            Psychology journal
          </h1>
          <p className="mt-1 text-muted">
            Notice how you feel before and after each trade.
          </p>
        </div>
        <button
          onClick={() => setModal({ open: true, entry: null })}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-fg hover:bg-primary-hover"
        >
          <FiPlus /> Add entry
        </button>
      </div>

      {/* summary cards, only when there is something to summarize */}
      {total > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Journal entries" value={total} />
          <StatCard
            label="Followed rules"
            value={`${Math.round((followed / total) * 100)}%`}
          />
          <StatCard
            label="Overtraded"
            value={overtraded}
            tone={overtraded > 0 ? "loss" : undefined}
          />
        </div>
      )}

      <div className="mt-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 animate-pulse rounded-2xl bg-surface" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center">
            <p className="font-semibold text-fg">Your journal is empty</p>
            <p className="mt-1 text-sm text-muted">
              Add an entry after your next trade. Patterns in your mood often explain
              your results.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <EntryCard
                key={entry._id}
                entry={entry}
                onEdit={(e) => setModal({ open: true, entry: e })}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={modal.open}
        onClose={closeModal}
        title={modal.entry ? "Edit entry" : "Add journal entry"}
      >
        <PsychologyForm
          key={modal.entry?._id || "new"}
          entry={modal.entry}
          onSaved={handleSaved}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Psychology;