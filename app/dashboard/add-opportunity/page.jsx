"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiJson, jsonBody } from "../../../lib/api";
import { startCheckout } from "../../../lib/checkout";
import { useApi } from "../../../lib/useApi";
import OpportunityForm from "../../../components/dashboard/OpportunityForm";
import { EmptyState, ErrorBox, PageHeader, PageLoader, btnPrimary } from "../../../components/ui";

export default function AddOpportunityPage() {
  const router = useRouter();
  const startup = useApi("/startups/mine");
  const premium = useApi("/payments/status");
  const [needPremium, setNeedPremium] = useState(false);
  const [paying, setPaying] = useState(false);

  if (startup.loading) return <PageLoader />;
  if (startup.error) return <ErrorBox message={startup.error} onRetry={startup.reload} />;

  if (!startup.data) {
    return (
      <>
        <PageHeader title="Add opportunity" />
        <EmptyState
          title="Create your startup first"
          text="Opportunities belong to your startup profile."
          action={
            <Link href="/dashboard/my-startup" className={btnPrimary}>
              Create startup
            </Link>
          }
        />
      </>
    );
  }

  const pay = async () => {
    setPaying(true);
    try {
      await startCheckout();
    } catch (err) {
      toast.error(err.message);
      setPaying(false);
    }
  };

  const submit = async (payload) => {
    try {
      await apiJson("/opportunities", { method: "POST", ...jsonBody(payload) });
    } catch (err) {
      if (err.status === 402) {
        setNeedPremium(true); // free limit reached
        return;
      }
      throw err;
    }
    toast.success("Opportunity posted");
    router.push("/dashboard/manage-opportunities");
  };

  const p = premium.data;

  return (
    <>
      <PageHeader
        title="Add opportunity"
        subtitle={
          p && !p.isPremium
            ? `${p.opportunityCount} of ${p.freeLimit} free opportunities used.`
            : "Describe the role you want to fill."
        }
      />

      {startup.data.status !== "approved" && (
        <p className="mb-4 max-w-2xl rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Your startup is not approved yet. You can post roles now, but they appear publicly only after an admin
          approves your startup.
        </p>
      )}

      {needPremium && (
        <div className="mb-6 max-w-2xl rounded-xl border border-indigo-200 bg-indigo-50 p-5">
          <h2 className="font-semibold text-indigo-900">Free limit reached</h2>
          <p className="mt-1 text-sm text-indigo-800">
            Free founders can post up to 3 opportunities. Buy the premium package to post more. Your form is kept below.
          </p>
          <button onClick={pay} disabled={paying} className={`${btnPrimary} mt-3`}>
            {paying ? "Redirecting to Stripe..." : "Buy premium"}
          </button>
        </div>
      )}

      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <OpportunityForm submitLabel="Post opportunity" onSubmit={submit} />
      </div>
    </>
  );
}
