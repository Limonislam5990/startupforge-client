"use client";

import { useState } from "react";
import { COMMITMENT_LEVELS, WORK_TYPES } from "../../lib/options";
import { toSkillList, todayISO } from "../../lib/format";
import { btnOutline, btnPrimary, inputClass, labelClass } from "../ui";

// Used by both "Add Opportunity" and the edit modal in "Manage Opportunities".
// onSubmit receives the clean payload and must throw an Error to show a message.
export default function OpportunityForm({ initial, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    role_title: initial?.role_title || "",
    required_skills: toSkillList(initial?.required_skills).join(", "),
    work_type: initial?.work_type || WORK_TYPES[0],
    commitment_level: initial?.commitment_level || COMMITMENT_LEVELS[0],
    deadline: initial?.deadline ? String(initial.deadline).slice(0, 10) : "",
    description: initial?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    const skills = toSkillList(form.required_skills);
    if (!skills.length) return setError("Add at least one required skill.");
    setSaving(true);
    try {
      await onSubmit({ ...form, role_title: form.role_title.trim(), required_skills: skills });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="role_title">Role title</label>
        <input id="role_title" name="role_title" required value={form.role_title} onChange={update} placeholder="e.g. Frontend Developer" className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="required_skills">Required skills</label>
        <input
          id="required_skills"
          name="required_skills"
          required
          value={form.required_skills}
          onChange={update}
          placeholder="React, Tailwind, Figma"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-slate-500">Separate skills with commas.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="work_type">Work type</label>
          <select id="work_type" name="work_type" value={form.work_type} onChange={update} className={inputClass}>
            {WORK_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="commitment_level">Commitment level</label>
          <select id="commitment_level" name="commitment_level" value={form.commitment_level} onChange={update} className={inputClass}>
            {COMMITMENT_LEVELS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="deadline">Application deadline</label>
        <input
          id="deadline"
          type="date"
          name="deadline"
          required
          min={initial ? undefined : todayISO()}
          value={form.deadline}
          onChange={update}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="description">Description (optional)</label>
        <textarea id="description" name="description" rows={4} value={form.description} onChange={update} className={inputClass} />
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
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
