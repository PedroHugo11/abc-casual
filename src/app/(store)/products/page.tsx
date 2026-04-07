import { Suspense } from "react";
import ProductsPageContent from "./ProductsPageContent";

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando produtos...</p>}>
      <ProductsPageContent />
    </Suspense>
  );
}