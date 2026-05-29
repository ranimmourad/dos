import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "D.O.S — Luxury Streetwear",
    template: "%s | D.O.S",
  },
  description:
    "D.O.S — Luxury in every detail. Premium streetwear brand from Tunisia. Only the Best. EST. 2026.",
  keywords: [
    "D.O.S",
    "luxury streetwear",
    "Tunisia",
    "premium clothing",
    "streetwear brand",
  ],
  openGraph: {
    title: "D.O.S — Luxury Streetwear",
    description: "Luxury in every detail. Premium streetwear from Tunisia.",
    url: "https://dammak.outfit.store",
    siteName: "D.O.S",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-black text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
