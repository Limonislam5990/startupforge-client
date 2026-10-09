"use client";

import Link from "next/link";
import { useApi } from "../../../lib/useApi";
import { formatDate } from "../../../lib/format";
import { TableWrap, THead, td } from "../../../components/dashboard/table";
import { EmptyState, ErrorBox, PageHeader, PageLoader, StatusBadge, btnPrimary } from "../../../components/ui";

export default function MyApplicationsPage() {
  const { data, loading, error, reload } = useApi("/applications/my");

  if (loading) return <PageLoader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  return (
    <>
      <PageHeader title="My applications" subtitle="Follow the status of every role you applied for." />

      {!data.length ? (
        <EmptyState
          title="No applications yet"
          text="Find a role that fits your skills and apply."
          action={
            <Link href="/opportunities" className={btnPrimary}>
              Browse opportunities
            </Link>
          }
        />
      ) : (
        <TableWrap>
          <THead cols={["Opportunity", "Startup", "Applied date", "Status"]} />
          <tbody className="divide-y divide-slate-100">
            {data.map((a) => (
              <tr key={a._id}>
                <td className={`${td} font-medium text-slate-900`}>
                  {a.opportunity_name === "Removed opportunity" ? (
                    <span className="text-slate-500">{a.opportunity_name}</span>
                  ) : (
                    <Link href={`/opportunities/${a.opportunity_id}`} className="text-indigo-600 hover:text-indigo-700">
                      {a.opportunity_name}
                    </Link>
                  )}
                </td>
                <td className={td}>{a.startup_name}</td>
                <td className={`${td} whitespace-nowrap`}>{formatDate(a.applied_at)}</td>
                <td className={td}>
                  <StatusBadge status={a.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}
