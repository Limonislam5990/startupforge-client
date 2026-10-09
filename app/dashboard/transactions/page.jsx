"use client";

import { useApi } from "../../../lib/useApi";
import { formatDate, money } from "../../../lib/format";
import { TableWrap, THead, td } from "../../../components/dashboard/table";
import { EmptyState, ErrorBox, PageHeader, PageLoader, StatusBadge } from "../../../components/ui";

export default function TransactionsPage() {
  const { data, loading, error, reload } = useApi("/admin/transactions");

  if (loading) return <PageLoader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const total = data.filter((t) => t.payment_status === "paid").reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle={data.length ? `${data.length} payments · ${money(total)} collected` : "Premium founder payments appear here."}
      />

      {!data.length ? (
        <EmptyState title="No transactions yet" text="Payments will show up after a founder buys the premium package." />
      ) : (
        <TableWrap>
          <THead cols={["User", "Amount", "Date", "Payment status", "Transaction ID"]} />
          <tbody className="divide-y divide-slate-100">
            {data.map((t) => (
              <tr key={t._id}>
                <td className={td}>
                  <p className="font-medium text-slate-900">{t.user_name || "Unknown"}</p>
                  <p className="text-xs text-slate-500">{t.user_email}</p>
                </td>
                <td className={`${td} font-semibold tabular-nums text-slate-900`}>{money(t.amount)}</td>
                <td className={`${td} whitespace-nowrap`}>{formatDate(t.paid_at)}</td>
                <td className={td}>
                  <StatusBadge status={t.payment_status} />
                </td>
                <td className={`${td} max-w-[220px] truncate font-mono text-xs`} title={t.transaction_id}>
                  {t.transaction_id}
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </>
  );
}
