"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Briefcase, CalendarDays, Clock } from "lucide-react";
import { authClient } from "../../../lib/auth-client";
import { apiJson, jsonBody } from "../../../lib/api";
import { useApi } from "../../../lib/useApi";
import { formatDate, isPastDeadline, toSkillList } from "../../../lib/format";
import { Avatar, Chip, ErrorBox, PageLoader, btnPrimary, inputClass, labelClass } from "../../../components/ui";

function ApplyCard({ opportunity }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [form, setForm] = useState({ portfolio_link: "", motivation: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);
  const closed = isPastDeadline(opportunity.deadline);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiJson("/applications", {
        method: "POST",
        ...jsonBody({
          opportunity_id: opportunity._id,
          portfolio_link: form.portfolio_link.trim(),
          motivation: form.motivation.trim(),
        }),
      });
      setApplied(true);
      toast.success("Application sent!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const box = "rounded-xl border border-slate-200 bg-white p-6 shadow-sm";

  if (isPending) return <div className={box}><div className="h-24 animate-pulse rounded-md bg-slate-100" /></div>;

  if (!user) {
    return (
      <div className={box}>
        <h2 className="text-lg font-bold text-slate-900">Interested in this role?</h2>
        <p className="mt-2 text-sm text-slate-600">Login as a collaborator to apply.</p>
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
          className={`${btnPrimary} mt-4 w-full`}
        >
          Login to apply
        </Link>
      </div>
    );
  }

  if (user.role !== "collaborator") {
    return (
      <div className={box}>
        <h2 className="text-lg font-bold text-slate-900">Applications</h2>
        <p className="mt-2 text-sm text-slate-600">
          Only collaborator accounts can apply to opportunities. You are logged in as a {user.role}.
        </p>
      </div>
    );
  }

  if (applied) {
    return (
      <div className={`${box} border-emerald-200 bg-emerald-50`}>
        <h2 className="text-lg font-bold text-emerald-800">Application sent</h2>
        <p className="mt-2 text-sm text-emerald-700">The founder will review it. Track the status in your dashboard.</p>
        <Link href="/dashboard/my-applications" className={`${btnPrimary} mt-4 w-full`}>
          View my applications
        </Link>
      </div>
    );
  }

  if (closed) {
    return (
      <div className={box}>
        <h2 className="text-lg font-bold text-slate-900">Applications closed</h2>
        <p className="mt-2 text-sm text-slate-600">The deadline for this opportunity has passed.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`${box} space-y-4`}>
      <h2 className="text-lg font-bold text-slate-900">Apply for this role</h2>
      <div>
        <label className={labelClass}>Your email</label>
        <input value={user.email} disabled className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="portfolio_link">Portfolio link</label>
        <input
          id="portfolio_link"
          type="url"
          name="portfolio_link"
          required
          placeholder="https://your-portfolio.com"
          value={form.portfolio_link}
          onChange={update}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="motivation">Why do you want to join?</label>
        <textarea
          id="motivation"
          name="motivation"
          required
          minLength={20}
          rows={5}
          placeholder="Tell the founder about your experience and motivation (at least 20 characters)."
          value={form.motivation}
          onChange={update}
          className={inputClass}
        />
      </div>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className={`${btnPrimary} w-full`}>
        {loading ? "Sending..." : "Submit application"}
      </button>
    </form>
  );
}

export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const { data: o, loading, error, reload } = useApi(id ? `/opportunities/${id}` : null);

  if (loading) return <PageLoader />;
  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <ErrorBox message={error} onRetry={reload} />
      </main>
    );
  }

  const skills = toSkillList(o.required_skills);
  const closed = isPastDeadline(o.deadline);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/opportunities" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
        <ArrowLeft size={16} /> Back to opportunities
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <article className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <Avatar src={o.startup_logo} name={o.startup_name} size={64} shape="lg" />
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{o.role_title}</h1>
                <Link href={`/startups/${o.startup_id}`} className="font-medium text-indigo-600 hover:text-indigo-700">
                  {o.startup_name}
                </Link>
              </div>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-2">
                <Briefcase size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Work type</dt>
                  <dd className="text-sm font-medium text-slate-800">{o.work_type}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Commitment</dt>
                  <dd className="text-sm font-medium text-slate-800">{o.commitment_level}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CalendarDays size={18} className="mt-0.5 text-slate-400" />
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Deadline</dt>
                  <dd className={`text-sm font-medium ${closed ? "text-red-600" : "text-slate-800"}`}>
                    {formatDate(o.deadline)} {closed && "(closed)"}
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Required skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Chip key={skill}>{skill}</Chip>
              ))}
            </div>
            {o.description && (
              <>
                <h2 className="mt-6 text-lg font-bold text-slate-900">About the role</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{o.description}</p>
              </>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">About the startup</h2>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Industry</dt>
                <dd className="font-medium text-slate-800">{o.industry}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Funding stage</dt>
                <dd className="font-medium text-slate-800">{o.funding_stage}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">Founder</dt>
                <dd className="font-medium text-slate-800">{o.founder_name || "Unknown"}</dd>
              </div>
            </dl>
            {o.startup_description && <p className="mt-4 text-sm leading-6 text-slate-600">{o.startup_description}</p>}
          </div>
        </article>

        <aside className="lg:self-start">
          <ApplyCard opportunity={o} />
        </aside>
      </div>
    </main>
  );
}
