"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_INK, SERIES, STATUS_COLORS } from "../../lib/chartColors";

const tick = { fill: CHART_INK.muted, fontSize: 12 };
const shorten = (value) => (String(value).length > 12 ? `${String(value).slice(0, 11)}...` : value);

// Card around a chart: title, optional subtitle, the chart and a "view as table" for accessibility.
export function ChartCard({ title, subtitle, rows, valueLabel = "Count", children }) {
  const hasData = rows && rows.some((r) => Number(r.value) > 0);
  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      <div className="mt-4 flex-1">
        {hasData ? (
          children
        ) : (
          <div className="flex h-60 items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500">
            No data yet
          </div>
        )}
      </div>
      {hasData && (
        <details className="mt-3 text-sm">
          <summary className="cursor-pointer text-slate-500 hover:text-slate-700">View as table</summary>
          <table className="mt-2 w-full text-left">
            <thead>
              <tr className="text-xs uppercase text-slate-500">
                <th className="py-1 pr-4 font-medium">Name</th>
                <th className="py-1 font-medium">{valueLabel}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-slate-100 text-slate-700">
                  <td className="py-1 pr-4">{r.label}</td>
                  <td className="py-1 tabular-nums">{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </section>
  );
}

function BarTooltip({ active, payload, label, valueLabel }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-slate-900">{label}</p>
      <p className="text-slate-600">
        {valueLabel}: <span className="font-semibold tabular-nums text-slate-900">{payload[0].value}</span>
      </p>
    </div>
  );
}

// Single-series bar chart. data = [{ name, value }]
export function SimpleBarChart({ data, valueLabel = "Count", color = SERIES.blue, money = false }) {
  const fmt = (v) => (money ? `$${v}` : v);
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid vertical={false} stroke={CHART_INK.grid} />
          <XAxis dataKey="name" tick={tick} tickFormatter={shorten} interval={0} axisLine={{ stroke: CHART_INK.baseline }} tickLine={false} />
          <YAxis tick={tick} allowDecimals={false} axisLine={false} tickLine={false} tickFormatter={fmt} />
          <Tooltip
            cursor={{ fill: "rgba(42,120,214,0.08)" }}
            content={<BarTooltip valueLabel={valueLabel} />}
          />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Donut for application status. data = [{ name: "Pending" | "Accepted" | "Rejected", value }]
export function StatusDonut({ data }) {
  const total = data.reduce((sum, d) => sum + Number(d.value || 0), 0);
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <div className="relative h-48 w-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={56}
              outerRadius={84}
              paddingAngle={2}
              stroke={CHART_INK.surface}
              strokeWidth={2}
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={STATUS_COLORS[d.name] || SERIES.blue} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tabular-nums text-slate-900">{total}</span>
          <span className="text-xs text-slate-500">total</span>
        </div>
      </div>
      {/* Legend: color swatch + text in normal ink, so color is never the only cue */}
      <ul className="space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-2 text-slate-700">
            <span className="h-3 w-3 rounded-sm" style={{ background: STATUS_COLORS[d.name] || SERIES.blue }} />
            {d.name}
            <span className="ml-auto pl-4 font-semibold tabular-nums text-slate-900">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
