"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SettingsValues = {
  whatsappNumber: string;
};

export default function SettingsForm({
  initial,
}: {
  initial: SettingsValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<SettingsValues>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

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

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-6 rounded-3xl border border-gray-200 bg-white p-8"
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
          className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500"
        />
        <p className="mt-2 text-xs text-gray-500">
          Include the country code (e.g. +212 for Morocco). Used for the
          floating WhatsApp button and the footer&apos;s Need Help section.
          Leave empty to hide both.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {saved && !error && (
        <p className="text-sm text-green-600">Settings saved.</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
