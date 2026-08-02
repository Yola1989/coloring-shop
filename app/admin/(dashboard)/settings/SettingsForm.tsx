"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SettingsValues = {
  whatsappNumber: string;
  homepageVideoUrl: string;
};

export default function SettingsForm({
  initial,
}: {
  initial: SettingsValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<SettingsValues>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // Uploads straight to R2 and drops the returned URL into the field, so the
  // admin never has to touch the Cloudflare dashboard for small clips.
  async function handleVideoUpload(file: File) {
    setUploading(true);
    setError("");
    setSaved(false);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/admin/upload?kind=video", {
        method: "POST",
        body,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Video upload failed.");
        return;
      }

      setValues((v) => ({ ...v, homepageVideoUrl: data.url }));
    } catch {
      setError("Network error while uploading. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.detail || data?.error || "Failed to save settings.");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-8 rounded-3xl border border-gray-200 bg-white p-8"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-800">
          WhatsApp Number
        </label>
        <input
          type="tel"
          placeholder="+212612345678"
          value={values.whatsappNumber}
          onChange={(e) =>
            setValues((v) => ({ ...v, whatsappNumber: e.target.value }))
          }
          className={inputClass}
        />
        <p className="mt-2 text-xs text-gray-500">
          Include the country code (e.g. +212 for Morocco). Used for the
          floating WhatsApp button and the footer&apos;s Need Help section.
          Leave empty to hide both.
        </p>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <label className="block text-sm font-semibold text-gray-800">
          Homepage Video
        </label>

        <input
          type="url"
          placeholder="https://... .mp4  or a YouTube link"
          value={values.homepageVideoUrl}
          onChange={(e) =>
            setValues((v) => ({ ...v, homepageVideoUrl: e.target.value }))
          }
          className={inputClass}
        />

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="cursor-pointer rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">
            {uploading ? "Uploading..." : "Upload video"}
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (file) handleVideoUpload(file);
              }}
            />
          </label>

          {values.homepageVideoUrl && (
            <button
              type="button"
              onClick={() =>
                setValues((v) => ({ ...v, homepageVideoUrl: "" }))
              }
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Remove video
            </button>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Shown under the hero heading on the homepage, centred. Plays on loop
          with no sound. Leave empty to hide it. Keep uploads under 4 MB — for
          a bigger file, upload it to R2 from the Cloudflare dashboard and
          paste the URL here.
        </p>

        {values.homepageVideoUrl && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-black">
            <video
              key={values.homepageVideoUrl}
              src={values.homepageVideoUrl}
              controls
              muted
              playsInline
              preload="metadata"
              className="h-auto max-h-64 w-full"
            />
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {saved && !error && (
        <p className="text-sm text-green-600">Settings saved.</p>
      )}

      <button
        type="submit"
        disabled={saving || uploading}
        className="w-full rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
