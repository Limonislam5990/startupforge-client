"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Briefcase, Check, Clock, DollarSign, FileText, Inbox, Rocket, Users, X } from "lucide-react";
import { useApi } from "../../lib/useApi";
import { startCheckout } from "../../lib/checkout";
import { money } from "../../lib/format";
import { ErrorBox, PageHeader, PageLoader, btnPrimary } from "../ui";
import { ChartCard, SimpleBarChart, StatusDonut } from "./charts";

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <Icon size={22} />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="truncate text-2xl font-bold tabular-nums text-slate-900">{value}</p>
      </div>
    </div>
  );
}

const asRows = (list) => (list || []).map((d) => ({ label: d.name, value: d.value }));

/* ---------------- Founder ---------------- */
export function FounderOverview({ name }) {
  const stats = useApi("/stats/founder");
  const premium = useApi("/payments/status");
  const [paying, setPaying] = useState(false);

  const pay = async () => {
    setPaying(true);
    try {
      await startCheckout();
    } catch (err) {
      toast.error(err.message);
      setPaying(false);
    }
  };

  if (stats.loading) return <PageLoader />;
  if (stats.error) return <ErrorBox message={stats.error} onRetry={stats.reload} />;
  const s = stats.data;
  const p = premium.data;

  return (
    <>
      <PageHeader title={`Welcome back, ${name}`} subtitle="Here is how your startup team search is going." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total opportunities" value={s.totalOpportunities} icon={Briefcase} />
        <StatCard label="Total applications" value={s.totalApplications} icon={Inbox} />
        <StatCard label="Accepted members" value={s.acceptedMembers} icon={Users} />
      </div>

      {p && (
        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-indigo-900">{p.isPremium ? "Premium founder" : "Free plan"}</h2>
            <p className="text-sm text-indigo-800">
              {p.isPremium
                ? "You can post unlimited opportunities."
                : `${p.opportunityCount} of ${p.freeLimit} free opportunities used. Upgrade to post more.`}
            </p>
          </div>
          {!p.isPremium && (
            <button onClick={pay} disabled={paying} className={btnPrimary}>
              {paying ? "Redirecting..." : "Go premium"}
            </button>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Applications by status" rows={asRows(s.byStatus)} valueLabel="Applications">
          <StatusDonut data={s.byStatus} />
        </ChartCard>
        <ChartCard
          title="Applications per opportunity"
          subtitle="Founder team analytics"
          rows={(s.perOpportunity || []).map((d) => ({ label: d.name, value: d.applications }))}
          valueLabel="Applications"
        >
          <SimpleBarChart
            data={(s.perOpportunity || []).map((d) => ({ name: d.name, value: d.applications }))}
            valueLabel="Applications"
          />
        </ChartCard>
      </div>

      {!s.totalOpportunities && (
        <p className="mt-6 text-sm text-slate-600">
          Nothing posted yet.{" "}
          <Link href="/dashboard/my-startup" className="font-semibold text-indigo-600">
            Create your startup
          </Link>{" "}
          and then add your first opportunity.
        </p>
      )}
    </>
  );
}

/* ---------------- Collaborator ---------------- */
export function CollaboratorOverview({ name }) {
  const { data: s, loading, error, reload } = useApi("/stats/collaborator");
  if (loading) return <PageLoader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  return (
    <>
      <PageHeader title={`Welcome back, ${name}`} subtitle="Track the roles you have applied for." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total applications" value={s.totalApplications} icon={FileText} />
        <StatCard label="Pending" value={s.Pending} icon={Clock} />
        <StatCard label="Accepted" value={s.Accepted} icon={Check} />
        <StatCard label="Rejected" value={s.Rejected} icon={X} />
      </div>
      <div className="mt-6 max-w-2xl">
        <ChartCard title="My applications by status" rows={asRows(s.byStatus)} valueLabel="Applications">
          <StatusDonut data={s.byStatus} />
        </ChartCard>
      </div>
      {!s.totalApplications && (
        <p className="mt-6 text-sm text-slate-600">
          You have not applied yet.{" "}
          <Link href="/opportunities" className="font-semibold text-indigo-600">
            Browse opportunities
          </Link>
          .
        </p>
      )}
    </>
  );
}

/* ---------------- Admin ---------------- */
export function AdminOverview({ name }) {
  const { data: s, loading, error, reload } = useApi("/admin/stats");
  if (loading) return <PageLoader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  return (
    <>
      <PageHeader title={`Welcome back, ${name}`} subtitle="Platform overview." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={s.totalUsers} icon={Users} />
        <StatCard label="Total startups" value={s.totalStartups} icon={Rocket} />
        <StatCard label="Total opportunities" value={s.totalOpportunities} icon={Briefcase} />
        <StatCard label="Total revenue" value={money(s.totalRevenue)} icon={DollarSign} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ChartCard title="Users by role" rows={asRows(s.usersByRole)} valueLabel="Users">
          <SimpleBarChart data={s.usersByRole} valueLabel="Users" />
        </ChartCard>
        <ChartCard title="Startups by status" rows={asRows(s.startupsByStatus)} valueLabel="Startups">
          <SimpleBarChart data={s.startupsByStatus} valueLabel="Startups" />
        </ChartCard>
        <div className="lg:col-span-2">
          <ChartCard
            title="Revenue by month"
            rows={(s.revenueByMonth || []).map((d) => ({ label: d.month, value: d.revenue }))}
            valueLabel="Revenue (USD)"
          >
            <SimpleBarChart
              data={(s.revenueByMonth || []).map((d) => ({ name: d.month, value: d.revenue }))}
              valueLabel="Revenue"
              money
            />
          </ChartCard>
        </div>
      </div>
    </>
  );
}
