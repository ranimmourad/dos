import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen bg-black pt-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #C9A84C 0, #C9A84C 1px, transparent 0, transparent 50%)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          {/* Logo Mark */}
          <div className="mb-8">
            <div className="inline-block border border-gold/20 p-8">
              <h1 className="text-6xl sm:text-8xl font-bold tracking-[0.4em] text-white">
                D.O.S
              </h1>
              <div className="w-16 h-px bg-gold mx-auto mt-4 mb-3" />
              <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-gold">
                Luxury Streetwear
              </p>
            </div>
          </div>

          <p className="text-neutral-400 text-sm sm:text-base tracking-wide mb-2">
            Only the Best — Quality Craftsmanship Purpose
          </p>
          <p className="text-neutral-500 text-xs tracking-[0.2em] uppercase mb-10">
            EST. 2026 &middot; Tunisia
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="w-full sm:w-auto px-10 py-3.5 bg-gold text-black text-xs font-semibold tracking-[0.2em] uppercase hover:bg-gold-light transition-colors"
            >
              Shop Collection
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-10 py-3.5 border border-neutral-700 text-neutral-300 text-xs font-semibold tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Values Strip */}
      <section className="border-y border-neutral-800 bg-neutral-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-neutral-800">
          {[
            { title: "Premium Quality", desc: "Specialist embroidery & craftsmanship" },
            { title: "Free Delivery", desc: "Across all of Tunisia" },
            { title: "Only the Best", desc: "Luxury in every detail" },
          ].map((item) => (
            <div
              key={item.title}
              className="px-8 py-8 text-center"
            >
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-neutral-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Placeholder */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">
            Collection
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-wide text-white mb-6">
            Coming Soon
          </h2>
          <p className="text-neutral-500 text-sm max-w-md mx-auto">
            Our premium collection is being prepared. Stay tuned for exclusive
            drops and limited editions.
          </p>
        </div>
      </section>
    </>
  );
}
