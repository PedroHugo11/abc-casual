import { NextResponse } from 'next/server'
import { products } from '@/mocks/products'

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json();

  const newProduct = {
    ...body,
    id: crypto.randomUUID(),
  };

  products.push(newProduct);

  return Response.json(newProduct);
}