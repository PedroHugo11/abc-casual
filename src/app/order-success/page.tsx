import { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";

export default function Page() {
  return (
    <Suspense fallback={<p>Carregando pedido...</p>}>
      <OrderSuccessContent />
    </Suspense>
  );
}