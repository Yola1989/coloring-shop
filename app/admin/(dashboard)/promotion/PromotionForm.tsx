"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PromotionValues = {
  enabled: boolean;
  title: string;
  description: string;
  book1Id: number | null;
  book1Price: number | null;
  book2Id: number | null;
  book2Price: number | null;
};

type BookOption = { id: number; title: string };

export default function PromotionForm({
  initial,
  books,
}: {
  initial: PromotionValues;
  books: BookOption[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<PromotionValues>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/admin/promotion", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.detail || data?.error || "Failed to save promotion.");
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
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={values.enabled}
          onChange={(e) =>
            setValues((v) => ({ ...v, enabled: e.target.checked }))
          }
          className="h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
        />
        <span className="text-sm font-semibold text-gray-800">
          Show this promotion on the homepage
        </span>
      </label>

      <div>
        <label className="block text-sm font-semibold text-gray-800">
          Promotion Title
        </label>
        <input
          value={values.title}
          onChange={(e) =>
            setValues((v) => ({ ...v, title: e.target.value }))
          }
          placeholder="e.g. New: Relaxing Coloring Books for Adults"
          className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800">
          Promotion Description
        </label>
        <textarea
          rows={3}
          value={values.description}
          onChange={(e) =>
            setValues((v) => ({ ...v, description: e.target.value }))
          }
          className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-gray-800">
            Book 1
          </label>
          <select
            value={values.book1Id ?? ""}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                book1Id: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-orange-500"
          >
            <option value="">— None —</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Promotion Price (optional)"
            value={values.book1Price ?? ""}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                book1Price: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to show the book&apos;s normal price.
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800">
            Book 2
          </label>
          <select
            value={values.book2Id ?? ""}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                book2Id: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-orange-500"
          >
            <option value="">— None —</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Promotion Price (optional)"
            value={values.book2Price ?? ""}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                book2Price: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty to show the book&apos;s normal price.
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {saved && !error && (
        <p className="text-sm text-green-600">Promotion saved.</p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Promotion"}
      </button>
    </form>
  );
}
