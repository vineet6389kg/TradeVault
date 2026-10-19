// 120 becomes "+$120", -80 becomes "-$80"
export const formatMoney = (value) => {
  const sign = value < 0 ? "-" : "+";
  return `${sign}$${Math.abs(value).toLocaleString()}`;
};

// "2026-10-19T..." becomes "19 Oct 2026"
export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });