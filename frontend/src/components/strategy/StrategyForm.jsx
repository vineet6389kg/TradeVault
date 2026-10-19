import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../api/axios";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

// "a\nb\n\nc" becomes ["a", "b", "c"]
const toList = (text) =>
  (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

// strategy = null means "add", a strategy object means "edit"
const StrategyForm = ({ strategy, onSaved, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: strategy
      ? {
          name: strategy.name,
          description: strategy.description,
          notes: strategy.notes,
          // arrays become text, one item per line
          rules: strategy.rules.join("\n"),
          checklist: strategy.checklist.join("\n"),
        }
      : {},
  });

  const onSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        notes: values.notes,
        rules: toList(values.rules),
        checklist: toList(values.checklist),
      };

      if (strategy) {
        await api.put(`/strategies/${strategy._id}`, payload);
        toast.success("Strategy updated");
      } else {
        await api.post("/strategies", payload);
        toast.success("Strategy added");
      }
      onSaved();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-fg">Name</label>
        <input
          placeholder="London Breakout, SMC, Scalping..."
          className={inputClass}
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-loss">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-fg">Description</label>
        <textarea
          rows={2}
          placeholder="What is this strategy about?"
          className={inputClass}
          {...register("description")}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-fg">
          Rules <span className="text-muted">(one per line)</span>
        </label>
        <textarea
          rows={4}
          placeholder={"Only trade 8am to 11am London time\nRisk 1% per trade"}
          className={inputClass}
          {...register("rules")}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-fg">
          Checklist <span className="text-muted">(one per line)</span>
        </label>
        <textarea
          rows={4}
          placeholder={"Asian range marked\nTrend checked on 1H"}
          className={inputClass}
          {...register("checklist")}
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
          {isSubmitting ? "Saving..." : strategy ? "Save changes" : "Add strategy"}
        </button>
      </div>
    </form>
  );
};

export default StrategyForm;