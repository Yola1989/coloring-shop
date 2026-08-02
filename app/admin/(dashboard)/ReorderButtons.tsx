"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReorderButtons({
  id,
  isFirst,
  isLast,
}: {
  id: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function move(direction: "up" | "down") {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/books/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, direction }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Could not reorder books.");
        return;
      }

      router.refresh();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const buttonClass =
    "flex h-7 w-7 items-center justify-center rounded-lg border border-gray-300 text-xs font-bold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex shrink-0 flex-col gap-1">
      <button
        type="button"
        onClick={() => move("up")}
        disabled={busy || isFirst}
        className={buttonClass}
        aria-label="Move up"
        title="Move up"
      >
        ▲
      </button>
      <button
        type="button"
        onClick={() => move("down")}
        disabled={busy || isLast}
        className={buttonClass}
        aria-label="Move down"
        title="Move down"
      >
        ▼
      </button>
    </div>
  );
}
