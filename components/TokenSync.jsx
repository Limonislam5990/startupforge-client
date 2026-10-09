"use client";

import { useEffect } from "react";
import { authClient } from "../lib/auth-client";

// Keeps the JWT cookie in step with the Better Auth session:
// when someone is logged in, ask /api/token for a fresh HTTPOnly cookie.
export default function TokenSync() {
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;
    fetch("/api/token", { credentials: "same-origin" }).catch(() => {});
  }, [email]);

  return null;
}
