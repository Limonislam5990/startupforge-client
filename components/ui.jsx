"use client";

import { useEffect, useState } from "react";
import { Inbox, TriangleAlert, X } from "lucide-react";

/* ---------- Shared class names (consistent inputs and buttons everywhere) ---------- */
export const inputClass =
  "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:text-slate-500";
export const labelClass = "mb-1 block text-sm font-medium text-slate-700";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60";
export const btnOutline =
  "inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60";
export const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60";
export const btnSmall = "px-3 py-1.5 text-xs";

/* ---------- Loading ---------- */
export function Spinner({ size = 20 }) {
  return (
    <span
      style={{ width: size, height: size }}
      className="inline-block animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600"
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-slate-500">
      <Spinner size={32} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function CardSkeleton({ count = 4 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="h-56 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
  ));
}

/* ---------- Messages ---------- */
export function ErrorBox({ message, onRetry }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <TriangleAlert className="text-red-500" size={28} />
      <p className="text-sm text-red-700">{message || "Something went wrong."}</p>
      {onRetry && (
        <button onClick={onRetry} className={btnOutline}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <Inbox className="text-slate-400" size={32} />
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      {text && <p className="max-w-sm text-sm text-slate-500">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ---------- Badges ---------- */
const badgeStyles = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  blocked: "bg-red-50 text-red-700 ring-red-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
};

export function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase();
  const style = badgeStyles[key] || "bg-slate-100 text-slate-700 ring-slate-200";
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${style}`}>
      {status || "unknown"}
    </span>
  );
}

export function Chip({ children }) {
  return (
    <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
      {children}
    </span>
  );
}

/* ---------- Images ---------- */
// Plain <img> with a letter fallback, so any image URL works and a broken link never crashes the page.
export function Avatar({ src, name = "?", size = 36, shape = "full", className = "" }) {
  const [failed, setFailed] = useState(false);
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  const radius = shape === "full" ? "rounded-full" : "rounded-lg";
  const style = { width: size, height: size };

  if (!src || failed) {
    return (
      <span
        style={{ ...style, fontSize: Math.max(12, size * 0.4) }}
        className={`inline-flex shrink-0 items-center justify-center bg-indigo-100 font-bold text-indigo-700 ${radius} ${className}`}
        aria-label={name}
      >
        {initial}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      style={style}
      onError={() => setFailed(true)}
      className={`shrink-0 object-cover ${radius} ${className}`}
    />
  );
}

/* ---------- Modals ---------- */
export function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white p-6 shadow-xl ${wide ? "max-w-2xl" : "max-w-md"}`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-slate-500 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, title, message, confirmText = "Confirm", danger = false, loading = false, onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onCancel} className={btnOutline} disabled={loading}>
          Cancel
        </button>
        <button onClick={onConfirm} className={danger ? btnDanger : btnPrimary} disabled={loading}>
          {loading ? "Please wait..." : confirmText}
        </button>
      </div>
    </Modal>
  );
}

/* ---------- Pagination ---------- */
function pageList(page, total) {
  const set = new Set([1, total, page, page - 1, page + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push(`gap-${n}`);
    out.push(n);
  });
  return out;
}

export function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  const item = "min-w-9 rounded-md border px-3 py-1.5 text-sm font-medium transition";
  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={`${item} border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        Previous
      </button>
      {pageList(page, totalPages).map((n) =>
        typeof n === "string" ? (
          <span key={n} className="px-1 text-slate-400">
            ...
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={`${item} ${
              n === page
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {n}
          </button>
        )
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className={`${item} border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        Next
      </button>
    </nav>
  );
}
