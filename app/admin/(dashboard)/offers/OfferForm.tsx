"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OfferFormValues = {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  oldPrice: number | null;
  enabled: boolean;
  position: number;
};

export default function OfferForm({
  initial,
}: {
  initial?: OfferFormValues;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [values, setValues] = useState<OfferFormValues>(
    initial ?? {
      title: "",
      description: "",
      imageUrl: "",
      price: 100,
      oldPrice: null,
      enabled: false,
      position: 0,
    }
  );

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setValues((v) => ({ ...v, imageUrl: data.url }));
    } catch {
      setError("Image upload failed. Try again.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!values.imageUrl) {
      setError("Please upload a product image.");
      return;
    }

    setSaving(true);
    setError("");

    const url = isEdit
      ? `/api/admin/offers/${initial!.id}`
      : "/api/admin/offers";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.detail || data?.error || "Failed to save the offer.");
      return;
    }

    router.push("/admin/offers");
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
          Show this offer on the homepage
        </span>
      </label>

      <div>
        <label className="block text-sm font-semibold text-gray-800">
          Offer Title
        </label>
        <input
          required
          value={values.title}
          onChange={(e) =>
            setValues((v) => ({ ...v, title: e.target.value }))
          }
          placeholder="e.g. Kids Starter Pack"
          className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800">
          Short Description
        </label>
        <textarea
          required
          rows={2}
          value={values.description}
          onChange={(e) =>
            setValues((v) => ({ ...v, description: e.target.value }))
          }
          placeholder="e.g. 5 Coloring Books + Color Pencils"
          className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800">
            Current Price (DH)
          </label>
          <input
            required
            type="number"
            value={values.price}
            onChange={(e) =>
              setValues((v) => ({ ...v, price: Number(e.target.value) }))
            }
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800">
            Old Price (optional)
          </label>
          <input
            type="number"
            value={values.oldPrice ?? ""}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                oldPrice: e.target.value ? Number(e.target.value) : null,
              }))
            }
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800">
          Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-2 block w-full text-sm"
        />
        {uploadingImage && (
          <p className="mt-2 text-sm text-gray-500">Uploading...</p>
        )}
        {values.imageUrl && (
          <img
            src={values.imageUrl}
            alt="Offer preview"
            className="mt-3 h-24 w-24 rounded-lg object-cover"
          />
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploadingImage}
        className="w-full rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
      >
        {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Offer"}
      </button>
    </form>
  );
}
