import React from "react";

export const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-fg outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

// white card with a title, used by all three calculators
export const CalcCard = ({ icon, title, text, children }) => (
  <div className="flex flex-col rounded-2xl border border-border bg-white p-6">
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <h2 className="text-lg font-bold text-fg">{title}</h2>
    </div>
    <p className="mt-2 text-sm text-muted">{text}</p>
    <div className="mt-5 flex flex-1 flex-col gap-4">{children}</div>
  </div>
);

// label + number input + optional hint under it
export const NumberField = ({ label, value, onChange, hint, step = "any" }) => (
  <div>
    <label className="text-sm font-medium text-fg">{label}</label>
    <input
      type="number"
      step={step}
      value={value}
      onChange={onChange}
      className={inputClass}
    />
    {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
  </div>
);

// tone: "profit" shows green, "loss" shows red
const toneClass = { profit: "text-profit", loss: "text-loss" };

// the result box at the bottom of each card, aria-live lets screen readers hear updates
export const Results = ({ children, empty }) => (
  <div
    aria-live="polite"
    className="mt-auto rounded-xl bg-primary/5 p-4"
  >
    {empty ? <p className="text-sm text-muted">{empty}</p> : children}
  </div>
);

export const ResultRow = ({ label, value, tone, big }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-sm text-muted">{label}</span>
    <span
      className={`font-extrabold ${big ? "text-2xl" : "text-base"} ${
        toneClass[tone] || "text-fg"
      }`}
    >
      {value}
    </span>
  </div>
);