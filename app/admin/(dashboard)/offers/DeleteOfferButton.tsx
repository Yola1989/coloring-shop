"use client";

import { useRouter } from "next/navigation";

export default function DeleteOfferButton({
  id,
  title,
}: {
  id: number;
  title: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;

    const res = await fetch(`/api/admin/offers/${id}`, { method: "DELETE" });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete the offer.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
    >
      Delete
    </button>
  );
}
