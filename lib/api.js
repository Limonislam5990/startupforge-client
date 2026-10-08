// Use this for every call to our Express server from the browser.
// Example: const res = await apiFetch("/me"); const data = await res.json();
export async function apiFetch(path, options = {}) {
  const send = () =>
    fetch(`/server${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
      credentials: "same-origin",
    });

  let res = await send();

  // Token missing or expired: get a fresh one and retry once
  if (res.status === 401) {
    const refreshed = await fetch("/api/token");
    if (refreshed.ok) res = await send();
  }
  return res;
}