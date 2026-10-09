"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { apiJson, jsonBody } from "../../../lib/api";
import { uploadToImgbb } from "../../../lib/imgbb";
import { useApi } from "../../../lib/useApi";
import { FUNDING_STAGES, INDUSTRIES } from "../../../lib/options";
import { formatDate } from "../../../lib/format";
import { useDashboardUser } from "../../../components/dashboard/user-context";
import ImageField from "../../../components/dashboard/ImageField";
import {
  Avatar,
  ConfirmModal,
  ErrorBox,
  Modal,
  PageHeader,
  PageLoader,
  StatusBadge,
  btnDanger,
  btnOutline,
  btnPrimary,
  inputClass,
  labelClass,
} from "../../../components/ui";

function StartupForm({ initial, email, onSaved, onCancel }) {
  const editing = Boolean(initial);
  const [form, setForm] = useState({
    startup_name: initial?.startup_name || "",
    industry: initial?.industry || "",
    funding_stage: initial?.funding_stage || FUNDING_STAGES[0],
    description: initial?.description || "",
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!editing && !file) return setError("Please upload a logo for your startup.");
    setSaving(true);
    try {
      let logo = initial?.logo || "";
      if (file) logo = await uploadToImgbb(file); // logo must be uploaded as a file
      const payload = { ...form, startup_name: form.startup_name.trim(), logo };
      if (editing) {
        await apiJson(`/startups/${initial._id}`, { method: "PATCH", ...jsonBody(payload) });
        toast.success("Startup updated");
      } else {
        await apiJson("/startups", { method: "POST", ...jsonBody(payload) });
        toast.success("Startup created. An admin will approve it soon.");
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="startup_name">Startup name</label>
        <input id="startup_name" name="startup_name" required value={form.startup_name} onChange={update} className={inputClass} />
      </div>

      <ImageField
        label="Logo"
        name="logo"
        required={!editing}
        currentUrl={initial?.logo}
        file={file}
        onFile={setFile}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="industry">Industry</label>
          <input
            id="industry"
            name="industry"
            required
            list="industry-options"
            value={form.industry}
            onChange={update}
            placeholder="e.g. FinTech"
            className={inputClass}
          />
          <datalist id="industry-options">
            {INDUSTRIES.map((i) => (
              <option key={i} value={i} />
            ))}
          </datalist>
        </div>
        <div>
          <label className={labelClass} htmlFor="funding_stage">Funding stage</label>
          <select id="funding_stage" name="funding_stage" value={form.funding_stage} onChange={update} className={inputClass}>
            {FUNDING_STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          value={form.description}
          onChange={update}
          placeholder="What are you building and who do you need on your team?"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Founder email</label>
        <input value={email} disabled className={inputClass} />
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className={btnOutline} disabled={saving}>
            Cancel
          </button>
        )}
        <button type="submit" disabled={saving} className={btnPrimary}>
          {saving ? "Saving..." : editing ? "Save changes" : "Create startup"}
        </button>
      </div>
    </form>
  );
}

export default function MyStartupPage() {
  const user = useDashboardUser();
  const { data: startup, loading, error, reload } = useApi("/startups/mine");
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (loading) return <PageLoader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const remove = async () => {
    setDeleting(true);
    try {
      await apiJson(`/startups/${startup._id}`, { method: "DELETE" });
      toast.success("Startup deleted");
      setConfirmDelete(false);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // No startup yet: show the create form
  if (!startup) {
    return (
      <>
        <PageHeader title="Create your startup" subtitle="You can run one startup profile. Admins approve it before it becomes public." />
        <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <StartupForm email={user.email} onSaved={reload} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="My startup"
        action={
          <div className="flex gap-2">
            <button onClick={() => setEditing(true)} className={btnOutline}>
              <Pencil size={16} /> Edit
            </button>
            <button onClick={() => setConfirmDelete(true)} className={btnDanger}>
              <Trash2 size={16} /> Delete
            </button>
          </div>
        }
      />

      <section className="max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar src={startup.logo} name={startup.startup_name} size={80} shape="lg" />
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-slate-900">{startup.startup_name}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge status={startup.status} />
              <span className="text-sm text-slate-500">Created {formatDate(startup.created_at)}</span>
            </div>
          </div>
        </div>

        {startup.status !== "approved" && (
          <p className="mt-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Your startup is waiting for admin approval. It will appear on the public pages after it is approved.
          </p>
        )}

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Industry</dt>
            <dd className="font-medium text-slate-800">{startup.industry}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Funding stage</dt>
            <dd className="font-medium text-slate-800">{startup.funding_stage}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">Founder email</dt>
            <dd className="truncate font-medium text-slate-800">{startup.founder_email}</dd>
          </div>
        </dl>
        <p className="mt-6 whitespace-pre-line text-sm leading-6 text-slate-600">{startup.description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard/add-opportunity" className={btnPrimary}>
            Add opportunity
          </Link>
          {startup.status === "approved" && (
            <Link href={`/startups/${startup._id}`} className={btnOutline}>
              View public page
            </Link>
          )}
        </div>
      </section>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit startup" wide>
        <StartupForm
          initial={startup}
          email={user.email}
          onCancel={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            reload();
          }}
        />
      </Modal>

      <ConfirmModal
        open={confirmDelete}
        danger
        loading={deleting}
        title="Delete startup?"
        message="This also deletes all of its opportunities and applications. This cannot be undone."
        confirmText="Delete startup"
        onConfirm={remove}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
