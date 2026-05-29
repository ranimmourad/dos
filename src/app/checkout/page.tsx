"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { getCart, cartTotal, clearCart, type CartItem } from "@/lib/cart-store";

interface CustomerForm {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  note: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = getCart();
  const total = cartTotal(items);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CustomerForm>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    note: "",
  });

  const update = (field: keyof CustomerForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone) {
      setError("Nom et téléphone sont requis.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          items: items.map((item: CartItem) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
          })),
          total,
          note: form.note,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la commande");

      clearCart();
      window.dispatchEvent(new Event("cart-update"));
      const data = await res.json();
      router.push(`/order-confirmation?id=${data.id}`);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg tracking-widest uppercase text-black">Votre panier est vide</h1>
          <Link href="/shop" className="mt-6 inline-block text-xs tracking-widest uppercase text-neutral-500 border-b border-neutral-300 hover:border-black hover:text-black transition-colors">
            Continuer vos achats
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-light tracking-widest uppercase text-black mb-12">
          Finaliser la commande
        </h1>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
            <div>
              <h2 className="text-sm tracking-[0.15em] uppercase text-black mb-6">Informations de livraison</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] tracking-widest uppercase text-neutral-400 mb-2">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full h-11 px-4 border border-neutral-200 text-sm text-black focus:outline-none focus:border-black transition-colors"
                    placeholder="Yassine Dammak"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-neutral-400 mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full h-11 px-4 border border-neutral-200 text-sm text-black focus:outline-none focus:border-black transition-colors"
                    placeholder="23 707 806"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-neutral-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="w-full h-11 px-4 border border-neutral-200 text-sm text-black focus:outline-none focus:border-black transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] tracking-widest uppercase text-neutral-400 mb-2">Adresse</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className="w-full h-11 px-4 border border-neutral-200 text-sm text-black focus:outline-none focus:border-black transition-colors"
                    placeholder="Rue, numéro..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-neutral-400 mb-2">Ville</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className="w-full h-11 px-4 border border-neutral-200 text-sm text-black focus:outline-none focus:border-black transition-colors"
                    placeholder="Tunis"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-widest uppercase text-neutral-400 mb-2">Code postal</label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={(e) => update("zip", e.target.value)}
                    className="w-full h-11 px-4 border border-neutral-200 text-sm text-black focus:outline-none focus:border-black transition-colors"
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] tracking-widest uppercase text-neutral-400 mb-2">Note (optionnel)</label>
              <textarea
                value={form.note}
                onChange={(e) => update("note", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-neutral-200 text-sm text-black focus:outline-none focus:border-black transition-colors resize-none"
                placeholder="Instructions spéciales..."
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 tracking-wider">{error}</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/cart"
                className="h-11 flex items-center justify-center border border-neutral-200 text-xs tracking-[0.15em] uppercase text-black hover:border-black transition-colors"
              >
                Retour
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="h-11 flex-1 bg-black text-white text-xs tracking-[0.15em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Traitement..." : "Confirmer la commande"}
              </button>
            </div>
          </form>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="border border-neutral-100 p-6">
              <h2 className="text-sm tracking-[0.15em] uppercase text-black mb-6">Récapitulatif</h2>
              <div className="divide-y divide-neutral-100">
                {items.map((item) => (
                  <div key={`${item.id}-${item.color}-${item.size}`} className="py-4 flex gap-4">
                    <div className="w-14 h-16 bg-neutral-50 flex-shrink-0 overflow-hidden">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-black truncate">{item.name}</p>
                      <p className="text-[11px] text-neutral-400 tracking-wider mt-0.5">
                        {item.color}{item.color && item.size && " / "}{item.size} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm text-black whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)} TND
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-sm tracking-wider uppercase text-black">Total</span>
                <span className="text-lg text-black">{formatPrice(total)} TND</span>
              </div>
            </div>

            <a
              href={`https://wa.me/21620084541?text=${encodeURIComponent(
                `Bonjour, je souhaite commander:\n${items.map((i) => `- ${i.name} (${i.color}/${i.size}) x${i.quantity} — ${formatPrice(i.price * i.quantity)} TND`).join("\n")}\n\nTotal: ${formatPrice(total)} TND\n\nNom: ${form.name}\nTél: ${form.phone}\nAdresse: ${form.address || "-"}\nVille: ${form.city || "-"}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 h-11 flex items-center justify-center border border-neutral-200 text-xs tracking-[0.15em] uppercase text-black hover:border-black transition-colors w-full"
            >
              Commander via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}