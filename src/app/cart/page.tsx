"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { getCart, removeItem, updateQuantity, cartTotal, clearCart, type CartItem } from "@/lib/cart-store";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const handleRemove = (id: string, color: string, size: string) => {
    const updated = removeItem(id, color, size);
    setItems(updated);
    setEmpty(updated.length === 0);
    window.dispatchEvent(new Event("cart-update"));
  };

  const handleQty = (id: string, color: string, size: string, qty: number) => {
    const updated = updateQuantity(id, color, size, qty);
    setItems(updated);
    window.dispatchEvent(new Event("cart-update"));
  };

  const handleClear = () => {
    clearCart();
    setItems([]);
    setEmpty(true);
    window.dispatchEvent(new Event("cart-update"));
  };

  const total = cartTotal(items);

  if (empty || (items.length === 0 && !empty)) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg tracking-widest uppercase text-black">Votre panier est vide</h1>
          <Link
            href="/shop"
            className="mt-6 inline-block text-xs tracking-widest uppercase text-neutral-500 border-b border-neutral-300 hover:border-black hover:text-black transition-colors"
          >
            Continuer vos achats
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-light tracking-widest uppercase text-black">Panier</h1>
          <button
            onClick={handleClear}
            className="text-[11px] tracking-widest uppercase text-neutral-400 hover:text-black transition-colors"
          >
            Vider
          </button>
        </div>

        {/* Header row */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 pb-4 border-b border-neutral-100 text-[11px] tracking-widest uppercase text-neutral-400">
          <span>Produit</span>
          <span className="text-center">Prix</span>
          <span className="text-center">Quantité</span>
          <span className="text-right">Total</span>
          <span className="w-8" />
        </div>

        <div className="divide-y divide-neutral-100">
          {items.map((item) => (
            <div key={`${item.id}-${item.color}-${item.size}`} className="py-6 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center">
              {/* Product */}
              <div className="flex gap-4">
                <Link href={`/product/${item.slug}`} className="w-20 h-24 bg-neutral-50 flex-shrink-0 overflow-hidden">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </Link>
                <div>
                  <Link href={`/product/${item.slug}`} className="text-sm text-black hover:text-neutral-500 transition-colors">
                    {item.name}
                  </Link>
                  <div className="mt-1 flex gap-3 text-[11px] text-neutral-400 tracking-wider">
                    {item.color && <span>{item.color}</span>}
                    {item.size && <span>{item.size}</span>}
                  </div>
                </div>
              </div>

              {/* Price */}
              <p className="text-sm text-black md:text-center">{formatPrice(item.price)} TND</p>

              {/* Quantity */}
              <div className="flex items-center justify-center md:justify-center">
                <div className="flex items-center border border-neutral-200">
                  <button
                    onClick={() => handleQty(item.id, item.color, item.size, item.quantity - 1)}
                    className="w-8 h-8 text-black hover:bg-neutral-50 transition-colors flex items-center justify-center text-sm"
                  >
                    −
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => handleQty(item.id, item.color, item.size, item.quantity + 1)}
                    className="w-8 h-8 text-black hover:bg-neutral-50 transition-colors flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total */}
              <p className="text-sm text-black md:text-right">
                {formatPrice(item.price * item.quantity)} TND
              </p>

              {/* Remove */}
              <button
                onClick={() => handleRemove(item.id, item.color, item.size)}
                className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-black transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 border-t border-neutral-100 pt-8">
          <div className="flex items-center justify-between">
            <span className="text-sm tracking-wider uppercase text-black">Total</span>
            <span className="text-xl text-black">{formatPrice(total)} TND</span>
          </div>
          <p className="mt-2 text-[11px] text-neutral-400 tracking-wider">Livraison calculée à la prochaine étape</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="h-11 flex items-center justify-center border border-neutral-200 text-xs tracking-[0.15em] uppercase text-black hover:border-black transition-colors"
            >
              Continuer les achats
            </Link>
            <Link
              href="/checkout"
              className="h-11 flex-1 flex items-center justify-center bg-black text-white text-xs tracking-[0.15em] uppercase hover:bg-neutral-800 transition-colors"
            >
              Passer la commande
            </Link>
          </div>

          <a
            href={`https://wa.me/21620084541?text=${encodeURIComponent(
              `Bonjour, je souhaite commander:\n${items.map((i) => `- ${i.name} (${i.color}/${i.size}) x${i.quantity} — ${formatPrice(i.price * i.quantity)} TND`).join("\n")}\n\nTotal: ${formatPrice(total)} TND`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 h-11 flex items-center justify-center border border-neutral-200 text-xs tracking-[0.15em] uppercase text-black hover:border-black transition-colors w-full"
          >
            Commander via WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}