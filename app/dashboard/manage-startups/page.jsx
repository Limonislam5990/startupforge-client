"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { apiJson } from "../../../lib/api";
import { useApi } from "../../../lib/useApi";
import { formatDate } from "../../../lib/format";
import { TableWrap, THead, td } from "../../../components/dashboard/table";
import {
  Avatar,
  ConfirmModal,
  EmptyState,
  ErrorBox,
  PageHeader,
  PageLoader,
  StatusBadge,
  btnDanger,
  btnPrimary,
  btnSmall,
} from "../../../components/ui";

export default function ManageStartupsPage() {
  const { data, loading, error, reload, setData } = useApi("/admin/startups");
  const [removing, setRemoving] = useState(null);
  const [busyId, setBusyId] = useState("");
  const [deleting, setDeleting] = useState(false);

  if (loading) return <PageLoader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const approve = async (s) => {
    setBusyId(s._id);
    try {
      await apiJson(`/admin/startups/${s._id}/approve`, { method: "PATCH" });
      setData((list) => list.map((x) => (x._id === s._id ? { ...x, status: "approved" } : x)));
      toast.success("Startup approved");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId("");
    }
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await apiJson(`/admin/startups/${removing._id}`, { method: "DELETE" });
      setData((list) => list.filter((x) => x._id !== removing._id));
      toast.success("Startup removed");
      setRemoving(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader title="Manage startups" subtitle="Approve new startups so they appear on the public pages, or remove them." />

      {!data.length ? (
        <EmptyState title="No startups yet" text="Startups created by founders will show up here." />
      ) : (
        <TableWrap>
          <THead cols={["Startup", "Founder", "Industry", "Stage", "Created", "Status", "Actions"]} />
          <tbody className="divide-y divide-slate-100">
            {data.map((s) => (
              <tr key={s._id}>
                <td className={td}>
                  <div className="flex items-center gap-3">
                    <Avatar src={s.logo} name={s.startup_name} size={36} shape="lg" />
                    <span className="font-medium text-slate-900">{s.startup_name}</span>
                  </div>
                </td>
                <td className={td}>
                  <p>{s.founder_name || "Unknown"}</p>
                  <p className="text-xs text-slate-500">{s.founder_email}</p>
                </td>
                <td className={td}>{s.industry}</td>
                <td className={`${td} whitespace-nowrap`}>{s.funding_stage}</td>
                <td className={`${td} whitespace-nowrap`}>{formatDate(s.created_at)}</td>
                <td className={td}>
                  <StatusBadge status={s.status} />
                </td>
                <td className={td}>
                  <div className="flex gap-2">
                    {s.status !== "approved" && (
                      <button onClick={() => approve(s)} disabled={busyId === s._id} className={`${btnPrimary} ${btnSmall}`}>
                        Approve
                      </button>
                    )}
                    <button onClick={() => setRemoving(s)} className={`${btnDanger} ${btnSmall}`}>
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <ConfirmModal
        open={Boolean(removing)}
        danger
        loading={deleting}
        title="Remove startup?"
        message={`"${removing?.startup_name}" with all of its opportunities and applications will be deleted. This cannot be undone.`}
        confirmText="Remove"
        onConfirm={remove}
        onCancel={() => setRemoving(null)}
      />
    </>
  );
}
