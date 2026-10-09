"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { apiJson } from "../../lib/api";
import { OpportunityCard } from "../../components/Cards";
import { CardSkeleton, EmptyState, ErrorBox, Pagination, inputClass } from "../../components/ui";

const LIMIT = 9;

function CheckboxGroup({ title, options, selected, onToggle }) {
  if (!options.length) return null;
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-slate-800">{title}</legend>
      <div className="space-y-1.5">
        {options.map((opt) => (
          <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => onToggle(opt)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function BrowseOpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [workType, setWorkType] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState({ workTypes: [], industries: [] });
  const [result, setResult] = useState({ data: [], total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [retry, setRetry] = useState(0);

  // filter options for the checkboxes
  useEffect(() => {
    apiJson("/opportunities/filters")
      .then(setOptions)
      .catch(() => {});
  }, []);

  // wait a moment after typing before searching
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // server-side search ($regex), filter ($in) and pagination
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    const qs = new URLSearchParams();
    if (debounced) qs.set("search", debounced);
    if (workType.length) qs.set("workType", workType.join(","));
    if (industry.length) qs.set("industry", industry.join(","));
    qs.set("page", String(page));
    qs.set("limit", String(LIMIT));

    apiJson(`/opportunities?${qs}`)
      .then((res) => !cancelled && setResult(res))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [debounced, workType, industry, page, retry]);

  const toggle = (list, setList) => (value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
    setPage(1);
  };

  const clearAll = () => {
    setSearch("");
    setWorkType([]);
    setIndustry([]);
    setPage(1);
  };

  const changePage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = search || workType.length || industry.length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Browse opportunities</h1>
        <p className="mt-1 text-slate-600">Search by role title or skill, then narrow down with filters.</p>
      </div>

      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role title or required skill..."
            className={`${inputClass} pl-10`}
            aria-label="Search opportunities"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 lg:hidden"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filters */}
        <aside className={`${showFilters ? "block" : "hidden"} space-y-6 rounded-xl border border-slate-200 bg-white p-5 lg:block lg:self-start`}>
          <CheckboxGroup title="Work type" options={options.workTypes} selected={workType} onToggle={toggle(workType, setWorkType)} />
          <CheckboxGroup title="Industry" options={options.industries} selected={industry} onToggle={toggle(industry, setIndustry)} />
          {!options.workTypes.length && !options.industries.length && (
            <p className="text-sm text-slate-500">Filters will appear once opportunities are posted.</p>
          )}
          {hasFilters ? (
            <button onClick={clearAll} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Clear all
            </button>
          ) : null}
        </aside>

        {/* Results */}
        <section>
          {error ? (
            <ErrorBox message={error} onRetry={() => setRetry((r) => r + 1)} />
          ) : (
            <>
              <p className="mb-4 text-sm text-slate-500">
                {loading ? "Searching..." : `${result.total} ${result.total === 1 ? "opportunity" : "opportunities"} found`}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {loading ? (
                  <CardSkeleton count={6} />
                ) : result.data.length ? (
                  result.data.map((o) => <OpportunityCard key={o._id} o={o} />)
                ) : (
                  <div className="sm:col-span-2 xl:col-span-3">
                    <EmptyState
                      title="No opportunities match"
                      text="Try a different keyword or remove some filters."
                      action={
                        hasFilters ? (
                          <button onClick={clearAll} className="text-sm font-semibold text-indigo-600">
                            Clear all filters
                          </button>
                        ) : null
                      }
                    />
                  </div>
                )}
              </div>
              {!loading && <Pagination page={result.page || page} totalPages={result.totalPages} onChange={changePage} />}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
