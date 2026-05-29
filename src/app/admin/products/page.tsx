"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  published: boolean;
  images: { url: string }[];
  category: { name: string } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((data) => { setProducts(data.products || []); setLoading(false); });
  };

  useEffect(() => { fetchProducts(); }, []);

  const togglePublish = async (slug: string, published: boolean) => {
    await fetch(`/api/products/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    fetchProducts();
  };

  const deleteProduct = async (slug: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    await fetch(`/api/products/${slug}`, { method: "DELETE" });
    fetchProducts();
  };

  if (loading) {
    return <div className="animate-pulse text-sm text-neutral-400 tracking-wider">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-light tracking-widest uppercase text-black">Produits</h1>
        <Link
          href="/admin/products/new"
          className="h-9 px-5 bg-black text-white text-[11px] tracking-widest uppercase hover:bg-neutral-800 transition-colors flex items-center"
        >
          + Nouveau
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-neutral-100 p-12 text-center">
          <p className="text-sm text-neutral-400">Aucun produit</p>
          <Link href="/admin/products/new" className="mt-4 inline-block text-xs tracking-widest uppercase text-black border-b border-neutral-300 hover:border-black transition-colors">
            Créer un produit
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-neutral-100 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="px-5 py-3 text-[11px] tracking-widest uppercase text-neutral-400 font-normal">Produit</th>
                <th className="px-5 py-3 text-[11px] tracking-widest uppercase text-neutral-400 font-normal">Catégorie</th>
                <th className="px-5 py-3 text-[11px] tracking-widest uppercase text-neutral-400 font-normal">Prix</th>
                <th className="px-5 py-3 text-[11px] tracking-widest uppercase text-neutral-400 font-normal">Stock</th>
                <th className="px-5 py-3 text-[11px] tracking-widest uppercase text-neutral-400 font-normal">Statut</th>
                <th className="px-5 py-3 text-[11px] tracking-widest uppercase text-neutral-400 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-neutral-100 flex-shrink-0 overflow-hidden">
                        {p.images[0]?.url && <img src={p.images[0].url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <Link href={`/product/${p.slug}`} className="text-sm text-black hover:text-neutral-500 transition-colors truncate max-w-[200px]">
                        {p.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-neutral-500">{p.category?.name || "—"}</td>
                  <td className="px-5 py-3 text-sm text-black">{formatPrice(p.price)} TND</td>
                  <td className="px-5 py-3 text-sm text-black">{p.stock}</td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => togglePublish(p.slug, p.published)}
                      className={`text-[10px] tracking-widest uppercase ${p.published ? "text-green-600" : "text-neutral-400"}`}
                    >
                      {p.published ? "Publié" : "Brouillon"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/edit/${p.slug}`} className="text-[11px] tracking-wider text-neutral-500 hover:text-black transition-colors">
                        Modifier
                      </Link>
                      <button onClick={() => deleteProduct(p.slug)} className="text-[11px] tracking-wider text-neutral-400 hover:text-red-600 transition-colors">
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}