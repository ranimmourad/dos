import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const cat = await prisma.category.create({
    data: { name: "Hoodies", slug: "hoodies" },
  });

  await prisma.product.create({
    data: {
      name: "Essential Hoodie Black",
      slug: "essential-hoodie-black",
      description: "Premium cotton hoodie. Luxury in every detail.",
      price: 189000,
      compareAtPrice: 220000,
      sku: "HOD-001",
      stock: 15,
      published: true,
      categoryId: cat.id,
      images: { create: [{ url: "https://placehold.co/600x800/111111/ffffff?text=D.O.S+Hoodie" }] },
      colors: { create: [{ name: "Noir", hex: "#000000" }] },
      sizes: { create: [{ name: "S" }, { name: "M" }, { name: "L" }] },
    },
  });

  await prisma.product.create({
    data: {
      name: "Oversized Tee White",
      slug: "oversized-tee-white",
      description: "Heavyweight oversized t-shirt.",
      price: 89000,
      sku: "TEE-001",
      stock: 30,
      published: true,
      categoryId: cat.id,
      images: { create: [{ url: "https://placehold.co/600x800/f5f5f5/111111?text=D.O.S+Tee" }] },
      colors: { create: [{ name: "Blanc", hex: "#FFFFFF" }] },
      sizes: { create: [{ name: "M" }, { name: "L" }, { name: "XL" }] },
    },
  });

  console.log("✅ Seeded");
}

main().finally(() => prisma.$disconnect());