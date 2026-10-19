import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../api/axios";

export const emotions = [
  "Calm",
  "Confident",
  "Fear",
  "Greedy",
  "Revenge",
  "Happy",
  "FOMO",
];

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

// label + input + error message, so we do not repeat this 12 times
const Field = ({ label, error, children }) => (
  <div>
    <label className="text-sm font-medium text-fg">{label}</label>
    {children}
    {error && <p className="mt-1 text-sm text-loss">{error.message}</p>}
  </div>
);

// number fields: required, and the value is sent as a number
const num = (message) => ({ required: message, valueAsNumber: true });

// trade = null means "add", a trade object means "edit"
const TradeForm = ({ trade, onSaved, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: trade
      ? { ...trade, tradeDate: trade.tradeDate.slice(0, 10) }
      : {
          side: "Buy",
          emotion: "Calm",
          tradeDate: new Date().toISOString().slice(0, 10),
        },
  });

  const onSubmit = async (values) => {
    try {
      if (trade) {
        await api.put(`/trades/${trade._id}`, values);
        toast.success("Trade updated");
      } else {
        await api.post("/trades", values);
        toast.success("Trade added");
      }
      onSaved();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Pair" error={errors.pair}>
          <input
            placeholder="EUR/USD"
            className={inputClass}
            {...register("pair", { required: "Pair is required" })}
          />
        </Field>

        <Field label="Side">
          <select className={inputClass} {...register("side")}>
            <option>Buy</option>
            <option>Sell</option>
          </select>
        </Field>

        <Field label="Entry price" error={errors.entry}>
          <input type="number" step="any" className={inputClass} {...register("entry", num("Entry is required"))} />
        </Field>

        <Field label="Exit price" error={errors.exit}>
          <input type="number" step="any" className={inputClass} {...register("exit", num("Exit is required"))} />
        </Field>

        <Field label="Stop loss" error={errors.stopLoss}>
          <input type="number" step="any" className={inputClass} {...register("stopLoss", num("Stop loss is required"))} />
        </Field>

        <Field label="Take profit" error={errors.takeProfit}>
          <input type="number" step="any" className={inputClass} {...register("takeProfit", num("Take profit is required"))} />
        </Field>

        <Field label="Lot size">
          <input type="number" step="any" className={inputClass} {...register("lotSize", { valueAsNumber: true })} />
        </Field>

        <Field label="Risk (%)">
          <input type="number" step="any" className={inputClass} {...register("riskPercent", { valueAsNumber: true })} />
        </Field>

        <Field label="Profit / loss ($), copy it from your broker" error={errors.pnl}>
          <input type="number" step="any" placeholder="120 or -80" className={inputClass} {...register("pnl", num("Profit / loss is required"))} />
        </Field>

        <Field label="Trade date">
          <input type="date" className={inputClass} {...register("tradeDate")} />
        </Field>
      </div>

      <Field label="How did you feel?">
        <select className={inputClass} {...register("emotion")}>
          {emotions.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
      </Field>

      <Field label="Notes">
        <textarea
          rows={3}
          placeholder="Why did you take this trade?"
          className={inputClass}
          {...register("notes")}
        />
      </Field>

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
          {isSubmitting ? "Saving..." : trade ? "Save changes" : "Add trade"}
        </button>
      </div>
    </form>
  );
};

export default TradeForm;