import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: "asc" } },
      colors: true,
      sizes: true,
      category: true,
    },
  });

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id }, published: true },
    take: 4,
    include: { images: { take: 1, orderBy: { order: "asc" } }, category: true },
  });

  return NextResponse.json({ product, related });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();
  const product = await prisma.product.update({
    where: { slug },
    data: body,
    include: { images: true, colors: true, sizes: true, category: true },
  });
  return NextResponse.json(product);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await prisma.product.delete({ where: { slug } });
  return NextResponse.json({ success: true });
}
