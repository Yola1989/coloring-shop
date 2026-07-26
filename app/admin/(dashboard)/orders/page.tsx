import { prisma } from "@/lib/prisma";
import OrderRow from "./OrderRow";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-10 text-gray-500">No orders yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
