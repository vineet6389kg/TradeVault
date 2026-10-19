import React from "react";
import PositionSizeCalc from "../components/risk/PositionSizeCalc";
import RiskRewardCalc from "../components/risk/RiskRewardCalc";
import ProfitCalc from "../components/risk/ProfitCalc";

const RiskManagement = () => {
  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-fg">
        Risk calculators
      </h1>
      <p className="mt-1 text-muted">Plan the trade before you take it.</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <PositionSizeCalc />
        <RiskRewardCalc />
        <ProfitCalc />
      </div>

      <p className="mt-6 text-sm text-muted">
        These are estimates. Pip value and contract size differ by broker and
        instrument (for example JPY pairs and gold), so check your broker before
        you trade.
      </p>
    </div>
  );
};

export default RiskManagement;