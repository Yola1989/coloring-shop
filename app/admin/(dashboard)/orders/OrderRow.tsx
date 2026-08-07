"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  // Books the customer chose inside a pick-your-own offer.
  selection: string | null;
};

type Order = {
  id: number;
  orderNumber: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes: string | null;
  totalAmount: number;
  status: string;
  createdAt: Date;
  items: OrderItem[];
};

const STATUSES = ["NEW", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-yellow-100 text-yellow-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrderRow({ order }: { order: Order }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleStatusChange(newStatus: string) {
    setSaving(true);
    setStatus(newStatus);

    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setSaving(false);

    if (res.ok) {
      router.refresh();
    } else {
      setStatus(order.status);
      alert("Failed to update status.");
    }
  }

  async function handleDelete() {
    const confirmed = confirm(
      `Delete order #${order.orderNumber}? This can't be undone.`
    );
    if (!confirmed) return;

    setDeleting(true);

    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "DELETE",
    });

    setDeleting(false);

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete the order.");
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div
        className="flex cursor-pointer flex-wrap items-center justify-between gap-3"
        onClick={() => setOpen((v) => !v)}
      >
        <div>
          <p className="font-bold text-gray-900">#{order.orderNumber}</p>
          <p className="text-sm text-gray-500">
            {order.fullName} · {order.phone} · {order.city}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-orange-500">
            {order.totalAmount} DH
          </span>

          <select
            value={status}
            disabled={saving}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`rounded-full border-0 px-3 py-1 text-sm font-semibold ${STATUS_STYLES[status]}`}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={deleting}
            className="rounded-xl border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700">Customer</p>
            <p className="text-gray-600">{order.fullName}</p>
            <p className="text-gray-600">{order.phone}</p>
            <p className="text-gray-600">
              {order.address}, {order.city}
            </p>
            {order.notes && (
              <p className="mt-1 italic text-gray-500">
                Notes: {order.notes}
              </p>
            )}
          </div>

          <div>
            <p className="font-semibold text-gray-700">Books</p>
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-0.5 text-gray-600"
              >
                <span className="min-w-0 pr-3">
                  {item.title} × {item.quantity}
                  {item.selection && (
                    <span className="block text-xs text-gray-400">
                      {item.selection}
                    </span>
                  )}
                </span>
                <span>{item.price * item.quantity} DH</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
