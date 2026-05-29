"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-neutral-800">
      {/* Top Bar */}
      <div className="bg-gold text-black text-center text-xs font-medium tracking-widest uppercase py-2 px-4">
        Free Delivery Across Tunisia — Only the Best
      </div>

      {/* Main Nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-neutral-300 hover:text-gold"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Desktop Links Left */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium tracking-widest uppercase text-neutral-300 hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Logo Center */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
          >
            <span className="text-2xl font-bold tracking-[0.3em] text-white">
              D.O.S
            </span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-gold -mt-0.5">
              Luxury Streetwear
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              className="p-2 text-neutral-300 hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <Link
              href="/account"
              className="hidden sm:block p-2 text-neutral-300 hover:text-gold transition-colors"
              aria-label="Account"
            >
              <User size={18} />
            </Link>
            <Link
              href="/cart"
              className="relative p-2 text-neutral-300 hover:text-gold transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 bg-neutral-950 border-t border-neutral-800",
          mobileOpen ? "max-h-80" : "max-h-0"
        )}
      >
        <div className="px-6 py-6 space-y-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium tracking-widest uppercase text-neutral-300 hover:text-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-neutral-800">
            <Link
              href="/account"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium tracking-widest uppercase text-neutral-300 hover:text-gold"
            >
              Account
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
