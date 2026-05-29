"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/orders", label: "Commandes" },
  { href: "/admin/banners", label: "Bannières" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <aside className="w-60 bg-white border-r border-neutral-100 p-6 flex flex-col">
        <Link href="/" className="text-lg tracking-[0.3em] uppercase text-black font-light mb-1">
          D.O.S
        </Link>
        <p className="text-[10px] tracking-widest text-neutral-400 uppercase mb-10">Administration</p>
        <nav className="space-y-1 flex-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2.5 text-xs tracking-widest uppercase transition-colors ${
                pathname === link.href
                  ? "text-black bg-neutral-50"
                  : "text-neutral-400 hover:text-black"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="text-[11px] tracking-widest uppercase text-neutral-400 hover:text-black transition-colors">
          ← Retour au site
        </Link>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}