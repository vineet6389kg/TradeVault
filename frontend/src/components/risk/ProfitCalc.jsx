import React, { useState } from "react";
import { FiDollarSign } from "react-icons/fi";
import { calcProfit } from "../../utils/riskCalculations";
import { formatMoney } from "../../utils/formatters";
import { CalcCard, NumberField, Results, ResultRow, inputClass } from "./CalcParts";

const ProfitCalc = () => {
  const [v, setV] = useState({
    side: "Buy",
    entry: "1.0850",
    exit: "1.0910",
    lotSize: "0.5",
    contractSize: "100000",
  });

  const set = (name) => (e) => setV((c) => ({ ...c, [name]: e.target.value }));

  const result = calcProfit(v);
  const pnl = result ? Math.round(result.pnl * 100) / 100 : 0;

  return (
    <CalcCard
      icon={<FiDollarSign size={20} />}
      title="Profit / loss"
      text="See what a trade made or lost before you log it in your journal."
    >
      <div>
        <label className="text-sm font-medium text-fg">Side</label>
        <select value={v.side} onChange={set("side")} className={inputClass}>
          <option>Buy</option>
          <option>Sell</option>
        </select>
      </div>

      <NumberField label="Entry price" value={v.entry} onChange={set("entry")} />
      <NumberField label="Exit price" value={v.exit} onChange={set("exit")} />
      <NumberField label="Lot size" value={v.lotSize} onChange={set("lotSize")} />
      <NumberField
        label="Contract size (units per lot)"
        value={v.contractSize}
        onChange={set("contractSize")}
        hint="100000 for forex pairs. Gold is usually 100."
      />

      <Results empty={result ? null : "Enter prices and a lot size above 0."}>
        {result && (
          <ResultRow
            label="Profit / loss"
            value={formatMoney(pnl)}
            tone={pnl > 0 ? "profit" : pnl < 0 ? "loss" : undefined}
            big
          />
        )}
      </Results>
    </CalcCard>
  );
};

export default ProfitCalc;