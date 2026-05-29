"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { addToCart } from "@/lib/cart-store";

interface Image { url: string; alt?: string; id: string }
interface Color { name: string; hex: string; id: string }
interface Size { name: string; id: string }

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  sku: string | null;
  stock: number;
  images: Image[];
  colors: Color[];
  sizes: Size[];
  category: { name: string; slug: string } | null;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: Image[];
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data.product);
        setRelated(data.related || []);
        if (data.product?.colors[0]) setSelectedColor(data.product.colors[0].id);
        if (data.product?.sizes[0]) setSelectedSize(data.product.sizes[0].id);
        setLoading(false);
      });
  }, [params.slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0]?.url || "",
        color: product.colors.find((c) => c.id === selectedColor)?.name || "",
        size: product.sizes.find((s) => s.id === selectedSize)?.name || "",
      },
      quantity
    );
    window.dispatchEvent(new Event("cart-update"));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
          <div className="aspect-3/4 bg-neutral-100 animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 bg-neutral-100 animate-pulse w-1/4" />
            <div className="h-8 bg-neutral-100 animate-pulse w-3/4" />
            <div className="h-4 bg-neutral-100 animate-pulse w-1/3" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg tracking-widest uppercase text-black">Produit introuvable</h1>
          <Link href="/shop" className="mt-6 inline-block text-xs tracking-widest uppercase text-neutral-500 border-b border-neutral-300 hover:border-black hover:text-black transition-colors">
            Retour à la boutique
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs tracking-wider text-neutral-400">
          <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-black transition-colors">Boutique</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-black transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-3/4 bg-neutral-50 overflow-hidden">
            {product.images[selectedImage]?.url && (
              <img
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].alt || product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square bg-neutral-50 overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-black" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          {product.category && (
            <p className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 mb-3">
              {product.category.name}
            </p>
          )}
          <h1 className="text-2xl md:text-3xl font-light tracking-wider text-black">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-xl text-black">{formatPrice(product.price)} TND</span>
            {product.compareAtPrice && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice)} TND
              </span>
            )}
          </div>

          {product.description && (
            <p className="mt-6 text-sm text-neutral-500 leading-relaxed max-w-md">
              {product.description}
            </p>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mt-8">
              <p className="text-[11px] tracking-[0.15em] uppercase text-black mb-3">
                Couleur: {product.colors.find((c) => c.id === selectedColor)?.name}
              </p>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-8 h-8 rounded-full border-2 transition-colors ${
                      selectedColor === color.id ? "border-black" : "border-neutral-200"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="text-[11px] tracking-[0.15em] uppercase text-black mb-3">Taille</p>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`min-w-11 h-10 px-3 border text-xs tracking-wider uppercase transition-colors ${
                      selectedSize === size.id
                        ? "border-black bg-black text-white"
                        : "border-neutral-200 text-black hover:border-black"
                    }`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to cart */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-neutral-200">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 text-black hover:bg-neutral-50 transition-colors flex items-center justify-center"
              >
                −
              </button>
              <span className="w-10 h-10 flex items-center justify-center text-sm">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 text-black hover:bg-neutral-50 transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 h-10 text-xs tracking-[0.15em] uppercase transition-colors ${
                added
                  ? "bg-neutral-900 text-white"
                  : product.stock === 0
                  ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-neutral-800"
              }`}
            >
              {added ? "Ajouté ✓" : product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
            </button>
          </div>

          {/* WhatsApp order */}
          <a
            href={`https://wa.me/21620084541?text=${encodeURIComponent(
              `Bonjour, je suis intéressé par: ${product.name} - ${formatPrice(product.price)} TND`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 h-10 flex items-center justify-center border border-neutral-200 text-xs tracking-[0.15em] uppercase text-black hover:border-black transition-colors"
          >
            Commander via WhatsApp
          </a>

          {product.sku && (
            <p className="mt-8 text-[11px] text-neutral-400 tracking-wider">
              SKU: {product.sku}
            </p>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-neutral-100 mt-12">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <h2 className="text-sm tracking-[0.2em] uppercase text-black mb-10">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12">
              {related.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group">
                  <div className="aspect-3/4 bg-neutral-50 overflow-hidden">
                    {p.images[0]?.url && (
                      <img
                        src={p.images[0].url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <h3 className="mt-3 text-sm font-light text-black tracking-wide truncate">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-black">{formatPrice(p.price)} TND</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}