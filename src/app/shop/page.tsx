"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: { url: string; alt?: string }[];
  category: { name: string; slug: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("category", activeCategory);
    params.set("sort", sort);
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((data) => { setProducts(data.products); setLoading(false); });
  }, [activeCategory, sort]);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-light tracking-widest uppercase text-black">
            Collection
          </h1>
          <p className="mt-3 text-sm text-neutral-500 tracking-wide">
            Luxury in every detail
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters bar */}
        <div className="flex items-center justify-between mb-10 border-b border-neutral-100 pb-6">
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveCategory("all")}
              className={`text-xs tracking-widest uppercase pb-1 border-b-2 transition-colors whitespace-nowrap ${
                activeCategory === "all"
                  ? "border-black text-black"
                  : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              Tout
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`text-xs tracking-widest uppercase pb-1 border-b-2 transition-colors whitespace-nowrap ${
                  activeCategory === cat.slug
                    ? "border-black text-black"
                    : "border-transparent text-neutral-400 hover:text-black"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-xs tracking-wider uppercase bg-transparent border border-neutral-200 px-3 py-2 text-black focus:outline-none focus:border-black"
          >
            <option value="newest">Nouveau</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-3/4 bg-neutral-100" />
                <div className="mt-3 h-3 bg-neutral-100 rounded w-3/4" />
                <div className="mt-2 h-3 bg-neutral-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-neutral-400 text-sm tracking-wide">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} className="group">
                <div className="aspect-3/4 bg-neutral-50 overflow-hidden relative">
                  {product.images[0]?.url && (
                    <img
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  {product.compareAtPrice && (
                    <span className="absolute top-3 left-3 bg-black text-white text-[10px] tracking-widest uppercase px-2 py-1">
                      Promo
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="text-sm font-light text-black tracking-wide truncate">
                    {product.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-black">{formatPrice(product.price)} TND</span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-neutral-400 line-through">
                        {formatPrice(product.compareAtPrice)} TND
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}