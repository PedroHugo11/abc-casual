"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

import {
  MDBCard,
  MDBCardBody,
  MDBBtn
} from "mdb-react-ui-kit";
import { Address, Shipping } from "@/features/checkout/types";
import { CartItem } from "@/features/cart/cartTypes";

export default function OrderSuccessPage() {

  const router = useRouter();

  const cartItems = useAppSelector((state) => state.cart.items);
  const addressId = useAppSelector((state) => state.checkout.selectedAddress);
  const shippingId = useAppSelector((state) => state.checkout.selectedShipping);
  const payment = useAppSelector((state) => state.checkout.paymentMethod);

  const addresses = useAppSelector((state) : Address[] => state.checkout.addresses);
  const shippingOptions = useAppSelector((state) : Shipping[] => state.checkout.shippingOptions);

  const address = addresses.find(a => a.id === addressId);
  const shipping = shippingOptions.find(s => s.id === shippingId);

  const total = cartItems.reduce(
    (acc: number, item: CartItem) => acc + item.product.price * item.quantity,
    0
  );

  const orderNumber = Math.floor(Math.random() * 1000000);

  return (
    <main className="container py-5">

      <header className="text-center mb-5">

        <h1 className="mb-3">
          Pedido realizado com sucesso 🎉
        </h1>

        <p>
          Obrigado pela sua compra.
        </p>

        <p>
          Número do pedido: <strong>#{orderNumber}</strong>
        </p>

      </header>

      <section aria-labelledby="order-summary">

        <h2 id="order-summary" className="mb-4">
          Resumo do pedido
        </h2>

        <MDBCard className="mb-4">
          <MDBCardBody>

            {/* ENDEREÇO */}

            <article className="mb-4">

              <header>
                <strong>Endereço de entrega</strong>
              </header>

              {address && (
                <address className="mt-2">

                  <p className="mb-1">
                    {address.street}, {address.number}
                  </p>

                  <p className="mb-1">
                    {address.city} - {address.state}
                  </p>

                  <p className="mb-0">
                    CEP {address.zip}
                  </p>

                </address>
              )}

            </article>

            {/* FRETE */}

            <article className="mb-4">

              <header>
                <strong>Forma de envio</strong>
              </header>

              {shipping && (
                <p className="mt-2 mb-0">

                  {shipping.name} —{" "}

                  {shipping.price === 0
                    ? "Grátis"
                    : `R$ ${shipping.price.toFixed(2)}`}

                  {" — "}
                  até {shipping.days} dias úteis

                </p>
              )}

            </article>

            {/* PAGAMENTO */}

            <article>

              <header>
                <strong>Pagamento</strong>
              </header>

              <p className="mt-2 mb-0">

                {payment === "credit" && "Cartão de crédito"}

                {payment === "pix" && "PIX"}

              </p>

            </article>

          </MDBCardBody>
        </MDBCard>

      </section>

      {/* ITENS */}

      <section aria-labelledby="order-items">

        <h2 id="order-items" className="mb-4">
          Itens comprados
        </h2>

        <MDBCard className="mb-4">
          <MDBCardBody>

            <ul className="list-unstyled">

              {cartItems.map((item: CartItem) => (

                <li
                  key={item.product.id}
                  className="d-flex justify-content-between mb-2"
                >

                  <span>
                    {item.product.name} × {item.quantity}
                  </span>

                  <span>
                    R$ {(item.product.price * item.quantity).toFixed(2)}
                  </span>

                </li>

              ))}

            </ul>

            <hr />

            <footer className="d-flex justify-content-between">

              <strong>Total</strong>

              <strong>
                R$ {total.toFixed(2)}
              </strong>

            </footer>

          </MDBCardBody>
        </MDBCard>

      </section>

      {/* AÇÕES */}

      <footer className="text-center mt-5">

        <MDBBtn
          color="warning"
          className="me-3"
          onClick={() => router.push("/")}
        >
          Voltar para a home
        </MDBBtn>

        <MDBBtn
          outline
          color="warning"
          onClick={() => router.push("/orders")}
        >
          Ver meus pedidos
        </MDBBtn>

      </footer>

    </main>
  );
}