"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function GlobalError({ error, reset }) {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <TriangleAlert className="text-red-500" size={48} />
      <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
      <p className="max-w-md text-sm text-slate-600">
        {error?.message || "An unexpected error happened. Please try again."}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
