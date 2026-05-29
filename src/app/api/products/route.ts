import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  const where: Record<string, unknown> = { published: true };

  if (category) where.category = { slug: category };
  if (search) where.name = { contains: search, mode: "insensitive" };

  const orderBy: Record<string, string> =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        images: { orderBy: { order: "asc" } },
        colors: true,
        sizes: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      compareAtPrice: body.compareAtPrice || null,
      sku: body.sku,
      stock: body.stock ?? 0,
      published: body.published ?? false,
      categoryId: body.categoryId,
      category: body.categoryName
        ? { connectOrCreate: { where: { name: body.categoryName }, create: { name: body.categoryName, slug: body.categoryName.toLowerCase().replace(/\s+/g, "-") } } }
        : undefined,
      images: { create: body.images || [] },
      colors: body.colors ? { create: body.colors } : undefined,
      sizes: body.sizes ? { create: body.sizes } : undefined,
    },
    include: { images: true, colors: true, sizes: true, category: true },
  });
  return NextResponse.json(product, { status: 201 });
}