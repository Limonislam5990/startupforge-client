"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { apiJson, jsonBody } from "../../../lib/api";
import { useApi } from "../../../lib/useApi";
import { formatDate, isPastDeadline, toSkillList } from "../../../lib/format";
import OpportunityForm from "../../../components/dashboard/OpportunityForm";
import { TableWrap, THead, td } from "../../../components/dashboard/table";
import {
  Chip,
  ConfirmModal,
  EmptyState,
  ErrorBox,
  Modal,
  PageHeader,
  PageLoader,
  btnDanger,
  btnOutline,
  btnPrimary,
  btnSmall,
} from "../../../components/ui";

export default function ManageOpportunitiesPage() {
  const { data, loading, error, reload } = useApi("/opportunities/mine");
  const [editing, setEditing] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [deleting, setDeleting] = useState(false);

  if (loading) return <PageLoader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const save = async (payload) => {
    await apiJson(`/opportunities/${editing._id}`, { method: "PATCH", ...jsonBody(payload) });
    toast.success("Opportunity updated");
    setEditing(null);
    reload();
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await apiJson(`/opportunities/${removing._id}`, { method: "DELETE" });
      toast.success("Opportunity deleted");
      setRemoving(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Manage opportunities"
        subtitle="View, update or delete the roles you have posted."
        action={
          <Link href="/dashboard/add-opportunity" className={btnPrimary}>
            Add opportunity
          </Link>
        }
      />

      {!data.length ? (
        <EmptyState
          title="No opportunities yet"
          text="Post your first role to start receiving applications."
          action={
            <Link href="/dashboard/add-opportunity" className={btnPrimary}>
              Add opportunity
            </Link>
          }
        />
      ) : (
        <TableWrap>
          <THead cols={["Role", "Skills", "Type", "Commitment", "Deadline", "Applications", "Actions"]} />
          <tbody className="divide-y divide-slate-100">
            {data.map((o) => (
              <tr key={o._id}>
                <td className={`${td} font-medium text-slate-900`}>{o.role_title}</td>
                <td className={td}>
                  <div className="flex max-w-xs flex-wrap gap-1">
                    {toSkillList(o.required_skills).map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                </td>
                <td className={td}>{o.work_type}</td>
                <td className={td}>{o.commitment_level}</td>
                <td className={`${td} whitespace-nowrap ${isPastDeadline(o.deadline) ? "text-red-600" : ""}`}>
                  {formatDate(o.deadline)}
                </td>
                <td className={`${td} tabular-nums`}>{o.applications_count}</td>
                <td className={td}>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(o)} className={`${btnOutline} ${btnSmall}`}>
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => setRemoving(o)} className={`${btnDanger} ${btnSmall}`}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit opportunity" wide>
        {editing && (
          <OpportunityForm
            key={editing._id}
            initial={editing}
            submitLabel="Save changes"
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(removing)}
        danger
        loading={deleting}
        title="Delete opportunity?"
        message={`"${removing?.role_title}" and all of its applications will be removed. This cannot be undone.`}
        confirmText="Delete"
        onConfirm={remove}
        onCancel={() => setRemoving(null)}
      />
    </>
  );
}
