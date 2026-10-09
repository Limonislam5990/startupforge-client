export function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// true when a YYYY-MM-DD deadline is before today
export function isPastDeadline(deadline) {
  if (!deadline) return false;
  return String(deadline).slice(0, 10) < todayISO();
}

export function money(value) {
  return `$${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function toSkillList(value) {
  return (Array.isArray(value) ? value : String(value || "").split(","))
    .map((s) => String(s).trim())
    .filter(Boolean);
}
