"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiJson, jsonBody } from "../../../lib/api";
import { uploadToImgbb } from "../../../lib/imgbb";
import { useApi } from "../../../lib/useApi";
import { toSkillList } from "../../../lib/format";
import { useDashboardUser } from "../../../components/dashboard/user-context";
import ImageField from "../../../components/dashboard/ImageField";
import { Chip, ErrorBox, PageHeader, PageLoader, btnPrimary, inputClass, labelClass } from "../../../components/ui";

export default function ProfilePage() {
  const router = useRouter();
  const sessionUser = useDashboardUser();
  const { data: me, loading, error, reload } = useApi("/users/me");
  const [form, setForm] = useState({ name: "", skills: "", bio: "" });
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // fill the form once the profile has loaded
  useEffect(() => {
    if (!me) return;
    setForm({
      name: me.name || "",
      skills: toSkillList(me.skills).join(", "),
      bio: me.bio || "",
    });
    setImageUrl(me.image || "");
  }, [me]);

  if (loading) return <PageLoader />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      let image = imageUrl.trim();
      if (file) image = await uploadToImgbb(file);
      await apiJson("/users/me", {
        method: "PATCH",
        ...jsonBody({ name: form.name.trim(), image, skills: toSkillList(form.skills), bio: form.bio.trim() }),
      });
      toast.success("Profile updated");
      setFile(null);
      reload();
      router.refresh(); // refreshes the name and picture in the sidebar and navbar
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const skills = toSkillList(form.skills);

  return (
    <>
      <PageHeader title="Profile" subtitle="This is what founders see when you apply." />
      <form onSubmit={submit} className="max-w-2xl space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ImageField
          label="Profile image"
          name="profile-image"
          shape="full"
          currentUrl={me?.image}
          file={file}
          onFile={setFile}
          url={imageUrl}
          onUrl={setImageUrl}
          allowUrl
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="name">Name</label>
            <input id="name" name="name" required value={form.name} onChange={update} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input value={sessionUser.email} disabled className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Role</label>
          <input value={sessionUser.role} disabled className={`${inputClass} capitalize`} />
        </div>

        <div>
          <label className={labelClass} htmlFor="skills">Skills</label>
          <input
            id="skills"
            name="skills"
            value={form.skills}
            onChange={update}
            placeholder="React, Node.js, UI design"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-500">Separate skills with commas.</p>
          {skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={form.bio}
            onChange={update}
            placeholder="A few lines about you and what you like to build."
            className={inputClass}
          />
        </div>

        {saveError && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {saveError}
          </p>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </form>
    </>
  );
}
