"use client";

import { useEffect, useState } from "react";
import { Avatar, inputClass, labelClass } from "../ui";

// File picker with a live preview. The parent keeps the chosen File and uploads it to imgbb on submit.
// If `allowUrl` is true the user may paste an image URL instead.
export default function ImageField({
  label,
  name,
  currentUrl = "",
  file,
  onFile,
  url = "",
  onUrl,
  allowUrl = false,
  required = false,
  shape = "lg",
}) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const shown = preview || url || currentUrl;

  return (
    <div>
      <label className={labelClass} htmlFor={`${name}-file`}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="flex items-center gap-4">
        <Avatar key={shown} src={shown} name={name} size={64} shape={shape} />
        <div className="min-w-0 flex-1 space-y-2">
          <input
            id={`${name}-file`}
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {allowUrl && (
            <input
              type="url"
              value={url}
              onChange={(e) => onUrl(e.target.value)}
              placeholder="or paste an image URL"
              className={inputClass}
              aria-label={`${label} URL`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
