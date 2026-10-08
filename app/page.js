"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, Users, Lightbulb, Handshake, CalendarDays } from "lucide-react";

/* ---------- Sample data (later replace with API fetch from your server) ---------- */
const featuredStartups = [
  { id: 1, name: "GreenCart", founder: "Rafiq Ahmed", industry: "E-commerce", teamSize: 4 },
  { id: 2, name: "MediLink", founder: "Nusrat Jahan", industry: "HealthTech", teamSize: 3 },
  { id: 3, name: "EduSpark", founder: "Tanvir Hasan", industry: "EdTech", teamSize: 5 },
  { id: 4, name: "FarmBridge", founder: "Sabbir Khan", industry: "AgriTech", teamSize: 2 },
];

const featuredOpportunities = [
  { id: 1, role: "Frontend Developer", startup: "GreenCart", skills: "React, Tailwind", deadline: "2026-11-15" },
  { id: 2, role: "UI/UX Designer", startup: "MediLink", skills: "Figma, Prototyping", deadline: "2026-11-20" },
  { id: 3, role: "Growth Marketer", startup: "EduSpark", skills: "SEO, Ads, Analytics", deadline: "2026-11-25" },
  { id: 4, role: "Backend Developer", startup: "FarmBridge", skills: "Node.js, MongoDB", deadline: "2026-12-01" },
];

const reasons = [
  { icon: Lightbulb, title: "Turn ideas into teams", text: "Post your startup and the roles you need in a few minutes." },
  { icon: Users, title: "Find the right people", text: "Developers, designers and marketers browse openings that match their skills." },
  { icon: Handshake, title: "Track every application", text: "Founders accept or reject, collaborators see their status update." },
];

const stats = [
  { value: "500+", label: "Startups posted" },
  { value: "2,400+", label: "Collaborators joined" },
  { value: "1,100+", label: "Teams formed" },
  { value: "35", label: "Industries covered" },
];

/* ---------- Small reusable pieces ---------- */
function SectionHeading({ title, subtitle, href }) {
  return (
    <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
        <p className="mt-1 max-w-xl text-slate-600">{subtitle}</p>
      </div>
      {href && (
        <Link href={href} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          View all
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="bg-white text-slate-800">
      {/* ---------- Banner ---------- */}
      <section className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              Build your startup team, one role at a time
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              StartupForge connects founders with developers, designers and marketers who want to
              help build something new. Post your idea or find a team to join.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/opportunities"
                className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Browse opportunities
              </Link>
              <Link
                href="/register"
                className="rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Post your startup
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="flex h-64 w-full max-w-md items-center justify-center rounded-2xl bg-indigo-600 shadow-xl sm:h-80">
              <Rocket size={110} className="text-white" strokeWidth={1.5} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- Featured Startups ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured startups"
          subtitle="The newest startups looking for teammates."
          href="/startups"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredStartups.map((s) => (
            <div
              key={s.id}
              className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-lg font-bold text-indigo-700">
                {s.name[0]}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{s.name}</h3>
              <p className="mt-1 text-sm text-slate-600">Founder: {s.founder}</p>
              <p className="mt-1 text-sm text-slate-600">Industry: {s.industry}</p>
              <p className="mt-1 text-sm text-slate-600">Team size needed: {s.teamSize}</p>
              <Link
                href={`/startups/${s.id}`}
                className="mt-auto pt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View details
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Featured Opportunities ---------- */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            title="Featured opportunities"
            subtitle="Open roles you can apply to today."
            href="/opportunities"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredOpportunities.map((o) => (
              <div
                key={o.id}
                className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-900">{o.role}</h3>
                <p className="mt-1 text-sm font-medium text-indigo-600">{o.startup}</p>
                <p className="mt-3 text-sm text-slate-600">Skills: {o.skills}</p>
                <p className="mt-2 flex items-center gap-1 text-sm text-slate-600">
                  <CalendarDays size={14} /> Apply by {o.deadline}
                </p>
                <Link
                  href={`/opportunities/${o.id}`}
                  className="mt-auto pt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View and apply
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Why Join StartupForge (animated) ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          title="Why join StartupForge"
          subtitle="Everything founders and collaborators need to start working together."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="h-full rounded-xl border border-slate-200 p-6"
            >
              <r.icon className="text-indigo-600" size={30} />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{r.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- Startup Statistics ---------- */}
      <section className="bg-indigo-600">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 text-center sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold text-white">{s.value}</p>
              <p className="mt-1 text-indigo-100">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}