import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../api/axios";
import MoodSelector from "./MoodSelector";
import { formatDate, formatMoney } from "../../utils/formatters";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

// two buttons: Yes / No
const YesNo = ({ label, value, onChange }) => (
  <div>
    <label className="text-sm font-medium text-fg">{label}</label>
    <div className="mt-1.5 flex gap-2">
      {[
        { text: "Yes", val: true },
        { text: "No", val: false },
      ].map((option) => (
        <button
          key={option.text}
          type="button"
          onClick={() => onChange(option.val)}
          aria-pressed={value === option.val}
          className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
            value === option.val
              ? "border-primary bg-primary text-primary-fg"
              : "border-border bg-white text-muted hover:bg-surface"
          }`}
        >
          {option.text}
        </button>
      ))}
    </div>
  </div>
);

// entry = null means "add", an entry object means "edit"
const PsychologyForm = ({ entry, onSaved, onClose }) => {
  const [mood, setMood] = useState(entry?.moodBefore || "Calm");
  // null = not answered yet, we ask the user to choose
  const [followed, setFollowed] = useState(entry ? entry.followedRules : null);
  const [overtraded, setOvertraded] = useState(entry ? entry.overtraded : null);

  // trades for the dropdown, null until loaded
  const [trades, setTrades] = useState(null);

  useEffect(() => {
    api
      .get("/trades")
      .then((res) => setTrades(res.data))
      .catch(() => setTrades([]));
  }, []);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: entry
      ? {
          trade: entry.trade?._id || "",
          learned: entry.learned,
          notes: entry.notes,
          entryDate: entry.entryDate.slice(0, 10),
        }
      : { trade: "", entryDate: new Date().toISOString().slice(0, 10) },
  });

  const onSubmit = async (values) => {
    if (followed === null || overtraded === null) {
      toast.error("Please answer both Yes / No questions");
      return;
    }

    try {
      const payload = {
        ...values,
        moodBefore: mood,
        followedRules: followed,
        overtraded,
      };

      if (entry) {
        await api.put(`/psychology/${entry._id}`, payload);
        toast.success("Entry updated");
      } else {
        await api.post("/psychology", payload);
        toast.success("Entry added");
      }
      onSaved();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-fg">
          How did you feel before the trade?
        </label>
        <MoodSelector value={mood} onChange={setMood} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-fg">Linked trade (optional)</label>
          {trades === null ? (
            <select disabled className={inputClass}>
              <option>Loading...</option>
            </select>
          ) : (
            <select className={inputClass} {...register("trade")}>
              <option value="">No trade</option>
              {trades.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.pair} {t.side}, {formatDate(t.tradeDate)}, {formatMoney(t.pnl)}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-fg">Date</label>
          <input type="date" className={inputClass} {...register("entryDate")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <YesNo
          label="Did you follow your rules?"
          value={followed}
          onChange={setFollowed}
        />
        <YesNo
          label="Did you overtrade?"
          value={overtraded}
          onChange={setOvertraded}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-fg">What did you learn?</label>
        <textarea
          rows={2}
          placeholder="One lesson from this trade"
          className={inputClass}
          {...register("learned")}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-fg">Notes</label>
        <textarea rows={2} className={inputClass} {...register("notes")} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-border px-5 py-2.5 font-semibold text-fg hover:bg-surface"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-fg hover:bg-primary-hover disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : entry ? "Save changes" : "Add entry"}
        </button>
      </div>
    </form>
  );
};

export default PsychologyForm;