"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { createProduct } from "@/features/products/productsSlice";
import ProductFormAdmin from "@/components/ProductFormAdmin/ProductFormAdmin";

export default function CreateProductPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <main className="p-4">
      <h2>Novo Produto</h2>

      <ProductFormAdmin
        onSubmit={async (data) => {
          await dispatch(createProduct(data));
          router.push("/admin/products");
        }}
      />
    </main>
  );
}