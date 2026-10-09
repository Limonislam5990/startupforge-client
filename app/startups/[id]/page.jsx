"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { useApi } from "../../../lib/useApi";
import { formatDate, toSkillList } from "../../../lib/format";
import { Avatar, Chip, EmptyState, ErrorBox, PageLoader } from "../../../components/ui";

export default function StartupDetailsPage() {
  const { id } = useParams();
  const { data: s, loading, error, reload } = useApi(id ? `/startups/${id}` : null);

  if (loading) return <PageLoader />;
  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <ErrorBox message={error} onRetry={reload} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/startups" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
        <ArrowLeft size={16} /> Back to startups
      </Link>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar src={s.logo} name={s.startup_name} size={80} shape="lg" />
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-slate-900">{s.startup_name}</h1>
            <p className="mt-1 text-slate-600">
              Founded by <span className="font-medium text-slate-800">{s.founder_name || "Unknown"}</span>
            </p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Industry</dt>
            <dd className="font-medium text-slate-800">{s.industry}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Funding stage</dt>
            <dd className="font-medium text-slate-800">{s.funding_stage}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Team size needed</dt>
            <dd className="font-medium text-slate-800">{s.team_size_needed ?? 0}</dd>
          </div>
        </dl>

        <h2 className="mt-6 text-lg font-bold text-slate-900">About</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{s.description}</p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-slate-900">Open roles ({s.opportunities?.length || 0})</h2>
        {s.opportunities?.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {s.opportunities.map((o) => (
              <div key={o._id} className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{o.role_title}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {o.work_type} · {o.commitment_level}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {toSkillList(o.required_skills).map((skill) => (
                    <Chip key={skill}>{skill}</Chip>
                  ))}
                </div>
                <p className="mt-3 flex items-center gap-1 text-sm text-slate-600">
                  <CalendarDays size={14} /> Apply by {formatDate(o.deadline)}
                </p>
                <Link
                  href={`/opportunities/${o._id}`}
                  className="mt-auto pt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View and apply
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No open roles right now" text="Check back soon." />
        )}
      </section>
    </main>
  );
}
