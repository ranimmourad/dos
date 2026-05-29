"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

interface Stats {
  products: number;
  orders: number;
  revenue: number;
  pending: number;
}

interface RecentOrder {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  customer: { name: string; phone: string };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [recent, setRecent] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ]).then(([prodData, orderData]) => {
      const orders = orderData || [];
      setStats({
        products: prodData.total || 0,
        orders: orders.length,
        revenue: orders.reduce((s: number, o: RecentOrder) => s + o.total, 0),
        pending: orders.filter((o: RecentOrder) => o.status === "PENDING").length,
      });
      setRecent(orders.slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="animate-pulse text-sm text-neutral-400 tracking-wider">Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-light tracking-widest uppercase text-black mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Produits", value: stats.products },
          { label: "Commandes", value: stats.orders },
          { label: "Revenus", value: `${formatPrice(stats.revenue)} TND` },
          { label: "En attente", value: stats.pending },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-neutral-100 p-5">
            <p className="text-[11px] tracking-widest uppercase text-neutral-400">{s.label}</p>
            <p className="mt-2 text-2xl font-light text-black">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-neutral-100">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-xs tracking-widest uppercase text-black">Dernières commandes</h2>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-sm text-neutral-400">Aucune commande</p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {recent.map((order) => (
              <div key={order.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-black">{order.customer.name}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{order.customer.phone} · {order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-black">{formatPrice(order.total)} TND</p>
                  <span className={`text-[10px] tracking-widest uppercase ${
                    order.status === "PENDING" ? "text-amber-600" :
                    order.status === "SHIPPED" ? "text-blue-600" :
                    order.status === "DELIVERED" ? "text-green-600" : "text-neutral-400"
                  }`}>
                    {order.status === "PENDING" ? "En attente" :
                     order.status === "SHIPPED" ? "Expédiée" :
                     order.status === "DELIVERED" ? "Livrée" : order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}