"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ExternalLink } from "lucide-react";
import { apiJson, jsonBody } from "../../../lib/api";
import { useApi } from "../../../lib/useApi";
import { formatDate, toSkillList } from "../../../lib/format";
import { TableWrap, THead, td } from "../../../components/dashboard/table";
import {
  Avatar,
  Chip,
  EmptyState,
  ErrorBox,
  Modal,
  PageHeader,
  PageLoader,
  StatusBadge,
  btnDanger,
  btnOutline,
  btnPrimary,
  btnSmall,
} from "../../../components/ui";

const TABS = ["All", "Pending", "Accepted", "Rejected"];

export default function FounderApplicationsPage() {
  const { data, loading, error, reload, setData } = useApi("/applications/founder");
  const [tab, setTab] = useState("All");
  const [selected, setSelected] = useState(null);
  const [busyId, setBusyId] = useState("");

  if (loading) return <PageLoader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const list = tab === "All" ? data : data.filter((a) => a.status === tab);

  const setStatus = async (app, status) => {
    setBusyId(app._id);
    try {
      await apiJson(`/applications/${app._id}/status`, { method: "PATCH", ...jsonBody({ status }) });
      setData((current) => current.map((a) => (a._id === app._id ? { ...a, status } : a)));
      setSelected((s) => (s && s._id === app._id ? { ...s, status } : s));
      toast.success(`Application ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId("");
    }
  };

  const actions = (a) => (
    <div className="flex gap-2">
      <button
        onClick={() => setStatus(a, "Accepted")}
        disabled={busyId === a._id || a.status === "Accepted"}
        className={`${btnPrimary} ${btnSmall}`}
      >
        Accept
      </button>
      <button
        onClick={() => setStatus(a, "Rejected")}
        disabled={busyId === a._id || a.status === "Rejected"}
        className={`${btnDanger} ${btnSmall}`}
      >
        Reject
      </button>
    </div>
  );

  return (
    <>
      <PageHeader title="Applications" subtitle="Review people who applied to your opportunities." />

      <div className="mb-4 flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => {
          const count = t === "All" ? data.length : data.filter((a) => a.status === t).length;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                tab === t ? "bg-indigo-600 text-white" : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {t} ({count})
            </button>
          );
        })}
      </div>

      {!list.length ? (
        <EmptyState
          title={data.length ? `No ${tab.toLowerCase()} applications` : "No applications yet"}
          text="When collaborators apply, they will show up here."
        />
      ) : (
        <TableWrap>
          <THead cols={["Applicant", "Opportunity", "Applied", "Status", "Actions"]} />
          <tbody className="divide-y divide-slate-100">
            {list.map((a) => (
              <tr key={a._id}>
                <td className={td}>
                  <div className="flex items-center gap-3">
                    <Avatar src={a.applicant_image} name={a.applicant_name || a.applicant_email} size={36} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{a.applicant_name || "Unknown"}</p>
                      <p className="truncate text-xs text-slate-500">{a.applicant_email}</p>
                    </div>
                  </div>
                </td>
                <td className={td}>{a.opportunity_name}</td>
                <td className={`${td} whitespace-nowrap`}>{formatDate(a.applied_at)}</td>
                <td className={td}>
                  <StatusBadge status={a.status} />
                </td>
                <td className={td}>
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => setSelected(a)} className={`${btnOutline} ${btnSmall}`}>
                      View
                    </button>
                    {actions(a)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Application details" wide>
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Avatar src={selected.applicant_image} name={selected.applicant_name || selected.applicant_email} size={48} />
              <div>
                <p className="font-semibold text-slate-900">{selected.applicant_name || "Unknown"}</p>
                <p className="text-slate-500">{selected.applicant_email}</p>
              </div>
              <span className="ml-auto">
                <StatusBadge status={selected.status} />
              </span>
            </div>
            <p className="text-slate-600">
              Applied for <span className="font-medium text-slate-900">{selected.opportunity_name}</span> on{" "}
              {formatDate(selected.applied_at)}
            </p>
            {toSkillList(selected.applicant_skills).length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {toSkillList(selected.applicant_skills).map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            )}
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Portfolio</p>
              <a
                href={selected.portfolio_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 break-all font-medium text-indigo-600 hover:text-indigo-700"
              >
                {selected.portfolio_link} <ExternalLink size={14} />
              </a>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Motivation</p>
              <p className="whitespace-pre-line rounded-md bg-slate-50 p-3 leading-6 text-slate-700">{selected.motivation}</p>
            </div>
            <div className="flex justify-end">{actions(selected)}</div>
          </div>
        )}
      </Modal>
    </>
  );
}
