import { useCallback, useEffect, useState } from "react";
import { apiJson } from "./api";

// Small data-fetching hook for dashboard pages.
//   const { data, loading, error, reload, setData } = useApi("/startups/mine");
export function useApi(path) {
  const [state, setState] = useState({ data: null, loading: Boolean(path), error: "", status: 0 });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: "", status: 0 }));
    apiJson(path)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: "", status: 200 });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, loading: false, error: err.message, status: err.status || 0 });
      });
    return () => {
      cancelled = true;
    };
  }, [path, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  const setData = useCallback(
    (next) =>
      setState((s) => ({ ...s, data: typeof next === "function" ? next(s.data) : next })),
    []
  );

  return { ...state, reload, setData };
}
