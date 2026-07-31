"use client";

import Image from "next/image";
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
  videoUrl?: string | null;
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
      videoUrl: "",
    }
  );

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPreview, setUploadingPreview] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
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

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setError("");

    try {
      const url = await uploadFile(file);
      setValues((v) => ({ ...v, videoUrl: url }));
    } catch {
      setError("Video upload failed. Try again.");
    } finally {
      setUploadingVideo(false);
    }
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
      const data = await res.json().catch(() => null);
      setError(data?.detail || data?.error || "Failed to save the book.");
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
        <label className="block text-sm font-semibold text-gray-800">
          Title
        </label>
        <input
          required
          value={values.title}
          onChange={(e) => setValues((v) => ({ ...v, title: e.target.value }))}
          className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800">
            Price (DH)
          </label>
          <input
            required
            type="number"
            value={values.price}
            onChange={(e) =>
              setValues((v) => ({ ...v, price: Number(e.target.value) }))
            }
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800">
            Pages
          </label>
          <input
            required
            type="number"
            value={values.pages}
            onChange={(e) =>
              setValues((v) => ({ ...v, pages: Number(e.target.value) }))
            }
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800">
            Ages
          </label>
          <input
            required
            placeholder="2-5"
            value={values.age}
            onChange={(e) => setValues((v) => ({ ...v, age: e.target.value }))}
            className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800">
          Description
        </label>
        <textarea
          required
          rows={3}
          value={values.description}
          onChange={(e) =>
            setValues((v) => ({ ...v, description: e.target.value }))
          }
          className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800">
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
          <Image
            src={values.cover}
            alt="Cover preview"
            width={96}
            height={128}
            className="mt-3 h-32 w-24 rounded-lg object-cover"
          />
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800">
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
                <Image
                  src={url}
                  alt="Preview page"
                  width={80}
                  height={96}
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

      <div>
        <label className="block text-sm font-semibold text-gray-800">
          Product Video (optional)
        </label>
        <p className="mt-1 text-xs text-gray-500">
          Paste a YouTube or Vimeo link, or upload a video file (e.g. a
          30s clip from your phone) directly.
        </p>

        <input
          type="url"
          placeholder="https://youtube.com/shorts/... or https://vimeo.com/..."
          value={values.videoUrl ?? ""}
          onChange={(e) =>
            setValues((v) => ({ ...v, videoUrl: e.target.value }))
          }
          className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-orange-500"
        />

        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs text-gray-400">or</span>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="block flex-1 text-sm"
          />
        </div>
        {uploadingVideo && (
          <p className="mt-2 text-sm text-gray-500">Uploading video...</p>
        )}

        {values.videoUrl && (
          <div className="mt-3 flex items-center gap-3">
            <p className="truncate text-xs text-gray-500">
              {values.videoUrl}
            </p>
            <button
              type="button"
              onClick={() => setValues((v) => ({ ...v, videoUrl: "" }))}
              className="shrink-0 text-xs font-semibold text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        <p className="mt-2 text-xs text-gray-500">
          Leave empty to hide the video section on the book page — it
          appears automatically once a video is set.
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploadingCover || uploadingPreview || uploadingVideo}
        className="w-full rounded-xl bg-orange-500 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
      >
        {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Book"}
      </button>
    </form>
  );
}
