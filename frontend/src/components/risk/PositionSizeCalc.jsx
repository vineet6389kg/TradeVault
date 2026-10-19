import React, { useState } from "react";
import { FiPieChart } from "react-icons/fi";
import { calcPositionSize } from "../../utils/riskCalculations";
import { formatMoney } from "../../utils/formatters";
import { CalcCard, NumberField, Results, ResultRow } from "./CalcParts";

const PositionSizeCalc = () => {
  const [v, setV] = useState({
    balance: "10000",
    riskPercent: "1",
    stopLossPips: "20",
    pipValue: "10",
  });

  // set("balance") returns a function that updates only that field
  const set = (name) => (e) => setV((c) => ({ ...c, [name]: e.target.value }));

  // recalculated on every render, so it updates as you type
  const result = calcPositionSize(v);

  return (
    <CalcCard
      icon={<FiPieChart size={20} />}
      title="Position size"
      text="How many lots to trade so a stop loss costs only what you planned."
    >
      <NumberField label="Account balance ($)" value={v.balance} onChange={set("balance")} />
      <NumberField label="Risk per trade (%)" value={v.riskPercent} onChange={set("riskPercent")} />
      <NumberField label="Stop loss (pips)" value={v.stopLossPips} onChange={set("stopLossPips")} />
      <NumberField
        label="Pip value per 1 lot ($)"
        value={v.pipValue}
        onChange={set("pipValue")}
        hint="About 10 for most USD pairs like EUR/USD. Check your broker for others."
      />

      <Results empty={result ? null : "Enter numbers above 0 in every field."}>
        {result && (
          <>
            <ResultRow label="Lot size" value={result.lotSize.toFixed(2)} big />
            <ResultRow
              label="Potential loss"
              value={formatMoney(-Math.round(result.riskAmount * 100) / 100)}
              tone="loss"
            />
          </>
        )}
      </Results>
    </CalcCard>
  );
};

export default PositionSizeCalc;