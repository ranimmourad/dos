import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customer, items, total, note } = body;

  const order = await prisma.order.create({
    data: {
      total,
      status: "PENDING",
      note: note || null,
      customer: {
        create: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email || null,
          address: customer.address || null,
          city: customer.city || null,
          zip: customer.zip || null,
        },
      },
      items: {
        create: items.map((item: { productId: string; name: string; price: number; quantity: number; color: string; size: string }) => ({
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.color || null,
          size: item.size || null,
          product: item.productId ? { connect: { id: item.productId } } : undefined,
        })),
      },
    },
    include: { customer: true, items: true },
  });

  return NextResponse.json(order, { status: 201 });
}

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, items: true },
  });
  return NextResponse.json(orders);
}