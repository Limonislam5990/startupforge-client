"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, Users, Lightbulb, Handshake } from "lucide-react";
import { apiJson } from "../lib/api";
import { StartupCard, OpportunityCard } from "../components/Cards";
import { CardSkeleton, EmptyState } from "../components/ui";

const reasons = [
  { icon: Lightbulb, title: "Turn ideas into teams", text: "Post your startup and the roles you need in a few minutes." },
  { icon: Users, title: "Find the right people", text: "Developers, designers and marketers browse openings that match their skills." },
  { icon: Handshake, title: "Track every application", text: "Founders accept or reject, collaborators see their status update." },
];

const stats = [
  { value: "3 roles", label: "Founder, Collaborator, Admin" },
  { value: "Free", label: "Post up to 3 opportunities" },
  { value: "Secure", label: "Better Auth and JWT cookies" },
  { value: "Fast", label: "Search and filter in seconds" },
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

// Loads the latest items from the server for the two dynamic sections
function useLatest(path) {
  const [state, setState] = useState({ items: [], loading: true });
  useEffect(() => {
    let cancelled = false;
    apiJson(path)
      .then((res) => !cancelled && setState({ items: res.data || [], loading: false }))
      .catch(() => !cancelled && setState({ items: [], loading: false }));
    return () => {
      cancelled = true;
    };
  }, [path]);
  return state;
}

export default function HomePage() {
  const startups = useLatest("/startups?limit=4");
  const opportunities = useLatest("/opportunities?limit=4");

  return (
    <main className="bg-white text-slate-800">
      {/* ---------- Banner ---------- */}
      <section className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              Build your startup team, one role at a time
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-600">
              StartupForge connects founders with developers, designers and marketers who want to help build
              something new. Post your idea or find a team to join.
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

      {/* ---------- Featured Startups (dynamic) ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading title="Featured startups" subtitle="The newest startups looking for teammates." href="/startups" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {startups.loading ? (
            <CardSkeleton count={4} />
          ) : startups.items.length ? (
            startups.items.map((s) => <StartupCard key={s._id} s={s} />)
          ) : (
            <div className="sm:col-span-2 lg:col-span-4">
              <EmptyState title="No startups yet" text="Approved startups will show up here." />
            </div>
          )}
        </div>
      </section>

      {/* ---------- Featured Opportunities (dynamic) ---------- */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            title="Featured opportunities"
            subtitle="Open roles you can apply to today."
            href="/opportunities"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {opportunities.loading ? (
              <CardSkeleton count={4} />
            ) : opportunities.items.length ? (
              opportunities.items.map((o) => <OpportunityCard key={o._id} o={o} />)
            ) : (
              <div className="sm:col-span-2 lg:col-span-4">
                <EmptyState title="No opportunities yet" text="New roles will show up here as founders post them." />
              </div>
            )}
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

      {/* ---------- Platform highlights ---------- */}
      <section className="bg-indigo-600">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 text-center sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-white sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-indigo-100">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
