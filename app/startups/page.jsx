"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { apiJson } from "../../lib/api";
import { StartupCard } from "../../components/Cards";
import { CardSkeleton, EmptyState, ErrorBox, Pagination, inputClass } from "../../components/ui";

const LIMIT = 9;

export default function BrowseStartupsPage() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [industry, setIndustry] = useState("");
  const [industries, setIndustries] = useState([]);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    apiJson("/opportunities/filters")
      .then((res) => setIndustries(res.industries || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    const qs = new URLSearchParams();
    if (debounced) qs.set("search", debounced);
    if (industry) qs.set("industry", industry);
    qs.set("page", String(page));
    qs.set("limit", String(LIMIT));

    apiJson(`/startups?${qs}`)
      .then((res) => !cancelled && setResult(res))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [debounced, industry, page, retry]);

  const changePage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Browse startups</h1>
        <p className="mt-1 text-slate-600">Discover startups that are building their teams.</p>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search startups by name..."
            className={`${inputClass} pl-10`}
            aria-label="Search startups"
          />
        </div>
        <select
          value={industry}
          onChange={(e) => {
            setIndustry(e.target.value);
            setPage(1);
          }}
          className={`${inputClass} sm:w-56`}
          aria-label="Filter by industry"
        >
          <option value="">All industries</option>
          {industries.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <ErrorBox message={error} onRetry={() => setRetry((r) => r + 1)} />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <CardSkeleton count={6} />
            ) : result.data.length ? (
              result.data.map((s) => <StartupCard key={s._id} s={s} />)
            ) : (
              <div className="sm:col-span-2 lg:col-span-3">
                <EmptyState title="No startups found" text="Try a different name or industry." />
              </div>
            )}
          </div>
          {!loading && <Pagination page={result.page || page} totalPages={result.totalPages} onChange={changePage} />}
        </>
      )}
    </main>
  );
}
