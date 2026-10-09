// Consistent table styling for every dashboard list.
export const th = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap";
export const td = "px-4 py-3 text-sm text-slate-700 align-middle";

export function TableWrap({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">{children}</table>
    </div>
  );
}

export function THead({ cols }) {
  return (
    <thead className="bg-slate-50">
      <tr>
        {cols.map((c) => (
          <th key={c} scope="col" className={th}>
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}
