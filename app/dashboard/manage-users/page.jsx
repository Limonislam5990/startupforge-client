"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { apiJson, jsonBody } from "../../../lib/api";
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
  inputClass,
} from "../../../components/ui";

export default function ManageUsersPage() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const path = `/admin/users${debounced ? `?search=${encodeURIComponent(debounced)}` : ""}`;
  const { data, loading, error, reload, setData } = useApi(path);

  const toggleBlock = async () => {
    const block = !target.isBlocked;
    setBusy(true);
    try {
      await apiJson(`/admin/users/${target._id}/block`, { method: "PATCH", ...jsonBody({ isBlocked: block }) });
      setData((list) => list.map((u) => (u._id === target._id ? { ...u, isBlocked: block } : u)));
      toast.success(block ? "User blocked" : "User unblocked");
      setTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Manage users" subtitle="Block or unblock accounts. Blocked users are logged out and cannot use the platform." />

      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className={`${inputClass} pl-10`}
          aria-label="Search users"
        />
      </div>

      {loading && !data ? (
        <PageLoader />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : !data?.length ? (
        <EmptyState title="No users found" text="Try a different search." />
      ) : (
        <TableWrap>
          <THead cols={["User", "Email", "Role", "Joined", "Status", "Action"]} />
          <tbody className="divide-y divide-slate-100">
            {data.map((u) => (
              <tr key={u._id}>
                <td className={td}>
                  <div className="flex items-center gap-3">
                    <Avatar src={u.image} name={u.name} size={36} />
                    <span className="font-medium text-slate-900">{u.name}</span>
                  </div>
                </td>
                <td className={td}>{u.email}</td>
                <td className={`${td} capitalize`}>{u.role}</td>
                <td className={`${td} whitespace-nowrap`}>{formatDate(u.createdAt)}</td>
                <td className={td}>
                  <StatusBadge status={u.isBlocked ? "blocked" : "active"} />
                </td>
                <td className={td}>
                  {u.role === "admin" ? (
                    <span className="text-xs text-slate-400">Protected</span>
                  ) : u.isBlocked ? (
                    <button onClick={() => setTarget(u)} className={`${btnPrimary} ${btnSmall}`}>
                      Unblock
                    </button>
                  ) : (
                    <button onClick={() => setTarget(u)} className={`${btnDanger} ${btnSmall}`}>
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <ConfirmModal
        open={Boolean(target)}
        danger={!target?.isBlocked}
        loading={busy}
        title={target?.isBlocked ? "Unblock user?" : "Block user?"}
        message={
          target?.isBlocked
            ? `${target?.name} will be able to use StartupForge again.`
            : `${target?.name} will lose access to the platform until you unblock them.`
        }
        confirmText={target?.isBlocked ? "Unblock" : "Block"}
        onConfirm={toggleBlock}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
