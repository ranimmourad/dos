import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const FOOTER_LINKS = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "New Arrivals", href: "/shop?sort=newest" },
    { label: "T-Shirts", href: "/category/t-shirts" },
    { label: "Hoodies", href: "/category/hoodies" },
    { label: "Accessories", href: "/category/accessories" },
  ],
  Company: [
    { label: "About D.O.S", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "Shipping", href: "/shipping" },
  ],
  Legal: [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Return Policy", href: "/returns" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-[0.3em] text-white">
                D.O.S
              </h2>
              <p className="text-[10px] tracking-[0.25em] uppercase text-gold mt-0.5">
                Luxury Streetwear · EST. 2026
              </p>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              Luxury in every detail. Premium quality craftsmanship with purpose.
              Only the Best — from Tunisia to the world.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+21623707806"
                className="flex items-center gap-3 text-sm text-neutral-400 hover:text-gold transition-colors"
              >
                <Phone size={14} className="text-gold" />
                23 707 806
              </a>
              <a
                href="https://wa.me/21620084541"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-neutral-400 hover:text-gold transition-colors"
              >
                <Phone size={14} className="text-gold" />
                +216 20 084 541 (WhatsApp)
              </a>
              <a
                href="mailto:yassindammak820@gmail.com"
                className="flex items-center gap-3 text-sm text-neutral-400 hover:text-gold transition-colors"
              >
                <Mail size={14} className="text-gold" />
                yassindammak820@gmail.com
              </a>
              <div className="flex items-center gap-3 text-sm text-neutral-400">
                <MapPin size={14} className="text-gold" />
                Tunisia
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-gold mb-6">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} D.O.S — All rights reserved.
          </p>
          <p className="text-xs text-neutral-600">
            dammak.outfit.store
          </p>
        </div>
      </div>
    </footer>
  );
}
