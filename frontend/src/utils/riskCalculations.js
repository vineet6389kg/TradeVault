// turns an input value into a number, empty text becomes NaN (not 0)
const toNum = (value) =>
  String(value ?? "").trim() === "" ? NaN : Number(value);

// true when every value is a real number
const valid = (...numbers) => numbers.every((n) => Number.isFinite(n));

// 1. Position size: how many lots to trade so a stop loss costs exactly your risk
export const calcPositionSize = ({ balance, riskPercent, stopLossPips, pipValue }) => {
  const b = toNum(balance);
  const r = toNum(riskPercent);
  const sl = toNum(stopLossPips);
  const pv = toNum(pipValue);

  if (!valid(b, r, sl, pv) || b <= 0 || r <= 0 || sl <= 0 || pv <= 0) return null;

  const riskAmount = (b * r) / 100;
  const lotSize = riskAmount / (sl * pv);

  return { riskAmount, lotSize };
};

// 2. Risk reward: how much you can win compared to how much you can lose
export const calcRiskReward = ({ entry, stopLoss, takeProfit }) => {
  const e = toNum(entry);
  const sl = toNum(stopLoss);
  const tp = toNum(takeProfit);

  if (!valid(e, sl, tp)) return null;

  const risk = Math.abs(e - sl);
  const reward = Math.abs(tp - e);
  if (risk === 0) return null;

  // stop loss and take profit must be on opposite sides of the entry
  const validSides = (sl < e && tp > e) || (sl > e && tp < e);

  return { risk, reward, ratio: reward / risk, validSides };
};

// 3. Profit or loss of a trade
export const calcProfit = ({ side, entry, exit, lotSize, contractSize }) => {
  const e = toNum(entry);
  const x = toNum(exit);
  const lots = toNum(lotSize);
  const size = toNum(contractSize);

  if (!valid(e, x, lots, size) || lots <= 0 || size <= 0) return null;

  // a Buy wins when price goes up, a Sell wins when price goes down
  const priceMove = side === "Buy" ? x - e : e - x;

  return { pnl: priceMove * lots * size };
};