import React, { useState } from "react";
import { FiTarget } from "react-icons/fi";
import { calcRiskReward } from "../../utils/riskCalculations";
import { CalcCard, NumberField, Results, ResultRow } from "./CalcParts";

const RiskRewardCalc = () => {
  const [v, setV] = useState({
    entry: "1.0850",
    stopLoss: "1.0830",
    takeProfit: "1.0910",
  });

  const set = (name) => (e) => setV((c) => ({ ...c, [name]: e.target.value }));

  const result = calcRiskReward(v);

  return (
    <CalcCard
      icon={<FiTarget size={20} />}
      title="Risk reward"
      text="Compare what you could win with what you could lose."
    >
      <NumberField label="Entry price" value={v.entry} onChange={set("entry")} />
      <NumberField label="Stop loss" value={v.stopLoss} onChange={set("stopLoss")} />
      <NumberField label="Take profit" value={v.takeProfit} onChange={set("takeProfit")} />

      <Results
        empty={
          result
            ? null
            : "Enter all three prices. Entry and stop loss must be different."
        }
      >
        {result && (
          <>
            <ResultRow
              label="Risk : Reward"
              value={`1 : ${result.ratio.toFixed(2)}`}
              // 2 or more is a common minimum, under 1 means you risk more than you can win
              tone={result.ratio >= 2 ? "profit" : result.ratio < 1 ? "loss" : undefined}
              big
            />
            <ResultRow label="Risk distance" value={+result.risk.toFixed(5)} />
            <ResultRow label="Reward distance" value={+result.reward.toFixed(5)} />

            {!result.validSides && (
              <p className="mt-2 text-sm text-loss">
                Stop loss and take profit should be on opposite sides of the entry.
              </p>
            )}
          </>
        )}
      </Results>
    </CalcCard>
  );
};

export default RiskRewardCalc;