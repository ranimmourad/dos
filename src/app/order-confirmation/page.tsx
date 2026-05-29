"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
  color: string | null;
  size: string | null;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  customer: { name: string; phone: string };
  items: OrderItem[];
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (!id) { setNotFound(true); return; }
    fetch(`/api/orders/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setOrder)
      .catch(() => setNotFound(true));
  }, [searchParams]);

  if (notFound) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg tracking-widest uppercase text-black">Commande introuvable</h1>
          <Link href="/shop" className="mt-6 inline-block text-xs tracking-widest uppercase text-neutral-500 border-b border-neutral-300 hover:border-black hover:text-black transition-colors">
            Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-sm text-neutral-400 tracking-wider">Chargement...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-12 h-12 border-2 border-black flex items-center justify-center mx-auto mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-light tracking-widest uppercase text-black">
          Commande confirmée
        </h1>
        <p className="mt-3 text-sm text-neutral-500 tracking-wide">
          Merci, {order.customer.name}. Votre commande a été enregistrée.
        </p>

        <div className="mt-10 border border-neutral-100 p-6 text-left">
          <div className="flex justify-between text-[11px] tracking-widest uppercase text-neutral-400 mb-1">
            <span>N° de commande</span>
            <span>Date</span>
          </div>
          <div className="flex justify-between text-sm text-black mb-6">
            <span className="font-mono">{order.id.slice(0, 8).toUpperCase()}</span>
            <span>{new Date(order.createdAt).toLocaleDateString("fr-TN")}</span>
          </div>

          <div className="divide-y divide-neutral-100">
            {order.items.map((item, i) => (
              <div key={i} className="py-3 flex justify-between text-sm">
                <span className="text-black">
                  {item.productName}
                  <span className="text-neutral-400 text-xs ml-2">
                    {item.color}{item.color && item.size && "/"}{item.size} × {item.quantity}
                  </span>
                </span>
                <span className="text-black">{formatPrice(item.price * item.quantity)} TND</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between">
            <span className="text-sm tracking-wider uppercase text-black">Total</span>
            <span className="text-lg text-black">{formatPrice(order.total)} TND</span>
          </div>
        </div>

        <p className="mt-8 text-xs text-neutral-400 tracking-wider">
          Vous serez contacté au {order.customer.phone} pour confirmer la livraison.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-block h-11 px-8 bg-black text-white text-xs tracking-[0.15em] uppercase hover:bg-neutral-800 transition-colors flex items-center"
        >
          Continuer les achats
        </Link>
      </div>
    </main>
  );
}