import Link from "next/link";
import { CalendarDays, Users } from "lucide-react";
import { Avatar, Chip } from "./ui";
import { formatDate, toSkillList } from "../lib/format";

// Every card is h-full + flex-col so cards in a grid always have equal heights.

export function StartupCard({ s }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <Avatar src={s.logo} name={s.startup_name} size={48} shape="lg" />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-900">{s.startup_name}</h3>
          <p className="truncate text-sm font-medium text-indigo-600">{s.industry}</p>
        </div>
      </div>
      <p className="text-sm text-slate-600">Founder: {s.founder_name || "Unknown"}</p>
      <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
        <Users size={14} /> Team size needed: {s.team_size_needed ?? 0}
      </p>
      <p className="mt-3 line-clamp-2 text-sm text-slate-500">{s.description}</p>
      <Link
        href={`/startups/${s._id}`}
        className="mt-auto pt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        View details
      </Link>
    </div>
  );
}

export function OpportunityCard({ o }) {
  const skills = toSkillList(o.required_skills);
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-center gap-3">
        <Avatar src={o.startup_logo} name={o.startup_name} size={40} shape="lg" />
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-900">{o.role_title}</h3>
          <p className="truncate text-sm font-medium text-indigo-600">{o.startup_name}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skills.slice(0, 4).map((skill) => (
          <Chip key={skill}>{skill}</Chip>
        ))}
        {skills.length > 4 && <Chip>+{skills.length - 4}</Chip>}
      </div>
      <p className="mt-3 text-sm text-slate-600">
        {o.work_type} · {o.commitment_level}
      </p>
      <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
        <CalendarDays size={14} /> Apply by {formatDate(o.deadline)}
      </p>
      <Link
        href={`/opportunities/${o._id}`}
        className="mt-auto pt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        View and apply
      </Link>
    </div>
  );
}
