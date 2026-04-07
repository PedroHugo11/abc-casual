import { products } from '@/mocks/products'
import { NextRequest } from 'next/server'

// 🔥 UPDATE
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return new Response("Not found", { status: 404 });
  }

  products[index] = { ...products[index], ...body };

  return Response.json(products[index]);
}

// 🔥 DELETE
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    return new Response("Not found", { status: 404 });
  }

  products.splice(index, 1);

  return Response.json({ success: true });
}