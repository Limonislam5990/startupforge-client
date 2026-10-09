// Use this for every call to our Express server from the browser.
// The browser calls /server/... and next.config.mjs forwards it to Express,
// so the JWT cookie stays first-party and there are no CORS problems.
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
    const refreshed = await fetch("/api/token", { credentials: "same-origin" });
    if (refreshed.ok) res = await send();
  }
  return res;
}

// Same as apiFetch but returns parsed JSON and throws an Error (with .status)
// when the server answers with a non-2xx status.
export async function apiJson(path, options = {}) {
  const res = await apiFetch(path, options);
  let data = null;
  try {
    data = await res.json();
  } catch {
    // empty body
  }
  if (!res.ok) {
    const err = new Error(data?.message || "Something went wrong. Please try again.");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const jsonBody = (body) => ({ body: JSON.stringify(body) });
