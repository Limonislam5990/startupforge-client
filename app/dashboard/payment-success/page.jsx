"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, TriangleAlert } from "lucide-react";
import { apiJson, jsonBody } from "../../../lib/api";
import { formatDate, money } from "../../../lib/format";
import { PageLoader, btnOutline, btnPrimary } from "../../../components/ui";

function PaymentResult() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [state, setState] = useState({ status: sessionId ? "loading" : "error", payment: null, error: sessionId ? "" : "Missing payment session." });

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    // The server asks Stripe if the session was paid, then saves the transaction (safe to call twice).
    apiJson("/payments/confirm", { method: "POST", ...jsonBody({ session_id: sessionId }) })
      .then((res) => !cancelled && setState({ status: "success", payment: res.payment, error: "" }))
      .catch((err) => !cancelled && setState({ status: "error", payment: null, error: err.message }));
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (state.status === "loading") return <PageLoader label="Confirming your payment..." />;

  if (state.status === "error") {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <TriangleAlert size={28} />
        </span>
        <h1 className="mt-4 text-xl font-bold text-slate-900">Payment not confirmed</h1>
        <p className="mt-2 text-sm text-slate-600">{state.error}</p>
        <Link href="/dashboard" className={`${btnOutline} mt-6`}>
          Back to dashboard
        </Link>
      </div>
    );
  }

  const p = state.payment;
  return (
    <div className="mx-auto max-w-md rounded-xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <Check size={30} />
      </span>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Payment successful</h1>
      <p className="mt-2 text-sm text-slate-600">You are now a premium founder and can post unlimited opportunities.</p>

      {p && (
        <dl className="mt-6 space-y-2 rounded-lg bg-slate-50 p-4 text-left text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Amount</dt>
            <dd className="font-semibold text-slate-900">{money(p.amount)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Status</dt>
            <dd className="font-semibold capitalize text-emerald-700">{p.payment_status}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Date</dt>
            <dd className="font-medium text-slate-900">{formatDate(p.paid_at)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Transaction</dt>
            <dd className="truncate font-mono text-xs text-slate-900" title={p.transaction_id}>
              {p.transaction_id}
            </dd>
          </div>
        </dl>
      )}

      <div className="mt-6 flex justify-center gap-3">
        <Link href="/dashboard/add-opportunity" className={btnPrimary}>
          Add opportunity
        </Link>
        <Link href="/dashboard" className={btnOutline}>
          Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PaymentResult />
    </Suspense>
  );
}
