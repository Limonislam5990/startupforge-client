"use client";

import { useEffect } from "react";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";

export default function BlockedPage() {
  // Clear the session so the blocked user is fully logged out
  useEffect(() => {
    authClient.signOut();
  }, []);

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Account blocked</h1>
      <p className="mt-3 max-w-md text-slate-600">
        Your account has been blocked by an administrator. If you think this is a mistake, please
        contact support at support@startupforge.com.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Back to home
      </Link>
    </main>
  );
}