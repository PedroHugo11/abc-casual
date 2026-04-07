import { products } from '@/mocks/products'

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const index = products.findIndex(p => p.id === params.id);

  if (index === -1) {
    return new Response("Not found", { status: 404 });
  }

  products[index] = { ...products[index], ...body };

  return Response.json(products[index]);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const index = products.findIndex(p => p.id === params.id);

  if (index === -1) {
    return new Response("Not found", { status: 404 });
  }

  products.splice(index, 1);

  return Response.json({ success: true });
}