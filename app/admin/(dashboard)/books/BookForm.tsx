"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type BookFormValues = {
  id?: number;
  title: string;
  price: number;
  cover: string;
  description: string;
  pages: number;
  age: string;
  preview: string[];
};

export default function BookForm({
  initial,
}: {
  initial?: BookFormValues;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [values, setValues] = useState<BookFormValues>(
    initial ?? {
      title: "",
      price: 40,
      cover: "",
      description: "",
      pages: 40,
      age: "2-5",
      preview: [],
    }
  );

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPreview, setUploadingPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.url as string;
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setError("");

    try {
      const url = await uploadFile(file);
      setValues((v) => ({ ...v, cover: url }));
    } catch {
      setError("Cover upload failed. Try again.");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handlePreviewUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPreview(true);
    setError("");

    try {
      const urls = await Promise.all(
        Array.from(files).map((file) => uploadFile(file))
      );
      setValues((v) => ({ ...v, preview: [...v.preview, ...urls] }));
    } catch {
      setError("Preview upload failed. Try again.");
    } finally {
      setUploadingPreview(false);
    }
  }

  function removePreview(url: string) {
    setValues((v) => ({ ...v, preview: v.preview.filter((p) => p !== url) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!values.cover) {
      setError("Please upload a cover image.");
      return;
    }

    setSaving(true);
    setError("");

    const url = isEdit
      ? `/api/admin/books/${initial!.id}`
      : "/api/admin/books";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Failed to save the book.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-6 rounded-3xl border border-gray-200 bg-white p-8"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Title
        </label>
        <input
          required
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Price (DH)
          </label>
          <input
            required
            type="number"
            value={values.price}
            onChange={(e) =>
              setValues((v) => ({ ...v, price: Number(e.target.value) }))
            }
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Pages
          </label>
          <input
            required
            type="number"
            value={values.pages}
            onChange={(e) =>
              setValues((v) => ({ ...v, pages: Number(e.target.value) }))
            }
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Ages
          </label>
          <input
            required
            placeholder="2-5"
            value={values.age}
            onChange={(e) => setValues((v) => ({ ...v, age: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Description
        </label>
        <textarea
          required
          rows={3}
          value={values.description}
          onChange={(e) =>
            setValues((v) => ({ ...v, description: e.target.value }))
          }
          className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Cover Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          className="mt-2 block w-full text-sm"
        />
        {uploadingCover && (
          <p className="mt-2 text-sm text-gray-500">Uploading...</p>
        )}
        {values.cover && (
          <img
            src={values.cover}
            alt="Cover preview"
            className="mt-3 h-32 w-24 rounded-lg object-cover"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Preview Images (inside pages)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePreviewUpload}
          className="mt-2 block w-full text-sm"
        />
        {uploadingPreview && (
          <p className="mt-2 text-sm text-gray-500">Uploading...</p>
        )}
        {values.preview.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {values.preview.map((url) => (
              <div key={url} className="relative">
                <img
                  src={url}
                  alt="Preview"
                  className="h-24 w-20 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePreview(url)}
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 text-sm font-bold text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploadingCover || uploadingPreview}
        className="w-full rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
      >
        {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Book"}
      </button>
    </form>
  );
}
