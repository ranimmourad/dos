"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Result {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: { url: string }[];
  category: { name: string } | null;
}

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (open) {
      setQ("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!q || q.length < 2) { setResults([]); return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer.current);
  }, [q]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <div
        className="bg-white w-full max-w-2xl mx-auto mt-20 max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-neutral-100 px-6">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un produit..."
            className="flex-1 h-14 text-sm text-black bg-transparent focus:outline-none tracking-wide placeholder:text-neutral-300"
          />
          <button onClick={onClose} className="p-4 text-neutral-400 hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="px-6 py-8 text-center text-xs text-neutral-400 tracking-wider">Recherche...</div>
          )}
          {!loading && q.length >= 2 && results.length === 0 && (
            <div className="px-6 py-8 text-center text-xs text-neutral-400 tracking-wider">Aucun résultat</div>
          )}
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              onClick={onClose}
              className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors border-b border-neutral-50"
            >
              <div className="w-12 h-14 bg-neutral-100 flex-shrink-0 overflow-hidden">
                {product.images[0]?.url && (
                  <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-black truncate">{product.name}</p>
                {product.category && (
                  <p className="text-[11px] text-neutral-400 tracking-wider mt-0.5">{product.category.name}</p>
                )}
              </div>
              <p className="text-sm text-black">{formatPrice(product.price)} TND</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}