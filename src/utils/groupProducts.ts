import type { Product } from "@/features/products/productsTypes";

export function groupProducts(products: Product[]) {
  return Object.values(
    products.reduce((acc, product) => {
      if (!acc[product.groupId]) {
        acc[product.groupId] = [];
      }

      acc[product.groupId].push(product);

      return acc;
    }, {} as Record<string, Product[]>)
  );
}
