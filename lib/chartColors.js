// Chart colors. Categorical slots 1-4 come from a validated palette (fixed order,
// never cycled). Status colors are reserved for application / payment state.
export const SERIES = {
  blue: "#2a78d6",
  orange: "#eb6834",
  aqua: "#1baf7a",
  yellow: "#eda100",
};

export const STATUS_COLORS = {
  Pending: "#fab219", // warning
  Accepted: "#0ca30c", // good
  Rejected: "#d03b3b", // critical
};

export const CHART_INK = {
  primary: "#0b0b0b",
  secondary: "#52514e",
  muted: "#898781",
  grid: "#e1e0d9",
  baseline: "#c3c2b7",
  surface: "#fcfcfb",
};
