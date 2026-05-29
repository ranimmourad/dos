"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart, cartCount } from "@/lib/cart-store";

export default function CartIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(cartCount(getCart()));
    const handler = () => setCount(cartCount(getCart()));
    window.addEventListener("cart-update", handler);
    return () => window.removeEventListener("cart-update", handler);
  }, []);

  return (
    <Link href="/cart" className="relative p-2 text-black hover:text-neutral-500 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}