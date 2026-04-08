"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createOrder } from "@/features/orders/ordersSlice";
import { useRouter } from "next/navigation";

import { MDBCard, MDBCardBody, MDBBtn } from "mdb-react-ui-kit";
import { Order } from "@/features/orders/types";
import { clearCart } from "@/features/cart/cartSlice";
import { Address, Shipping } from "../types";
import { CartItem } from "@/features/cart/cartTypes";

interface Props {
  goToAddress: () => void;
  goToPayment: () => void;
}

export default function StepReview({ goToAddress, goToPayment }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cartItems = useAppSelector((state) => state.cart.items);

  const addresses = useAppSelector((state) : Address[] => state.checkout.addresses);
  const selectedAddressId = useAppSelector(
    (state) => state.checkout.selectedAddress,
  );

  const shippingOptions = useAppSelector(
    (state) : Shipping[] => state.checkout.shippingOptions,
  );
  const selectedShippingId = useAppSelector(
    (state) => state.checkout.selectedShipping,
  );

  const paymentMethod = useAppSelector((state) => state.checkout.paymentMethod);

  const address = addresses.find((a) => a.id === selectedAddressId);
  const shipping = shippingOptions.find((s) => s.id === selectedShippingId);

  const total = cartItems.reduce(
    (acc: number, item: CartItem) => acc + item.product.price * item.quantity,
    0,
  );

  function finishOrder() {
    if (!address || !shipping || !paymentMethod) {
      alert("Preencha todos os dados antes de finalizar a compra.");
      return;
    }

    const newOrder: Order = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("pt-BR"),
      status: "paid",
      total,

      items: cartItems.map((item: CartItem) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
        image: item.product.image,
      })),

      address: {
        name: "Pedro Hugo", // mock por enquanto
        street: address.street,
        number: address.number,
        city: address.city,
        state: address.state,
        zip: address.zip,
        phone: address.phone,
      },
      payment: {
        method: paymentMethod,
        ...(paymentMethod === "credit" && { last4: "1234" }),
      },
      shipping,
    };

    // 🔥 cria pedido
    dispatch(createOrder(newOrder));

    // 🧹 limpar carrinho (vamos implementar já já se não tiver)
    dispatch(clearCart());

    // 🚀 redirecionar
    router.push(`/order-success?orderId=${newOrder.id}`);
  }

  return (
    <section aria-labelledby="review-title">
      <header>
        <h4 id="review-title" className="mb-4">
          Revise seu pedido
        </h4>
      </header>

      {/* ENDEREÇO */}

      <article>
        <MDBCard className="mb-3">
          <MDBCardBody className="my-3">
            <section className="d-flex flex-row align-items-center gap-4">
              <div>
                <span className="ms-3 fa-2x">
                  <i className="fa-regular fa-map"></i>
                </span>
              </div>
              <div>
                <header className="d-flex justify-content-between mb-2">
                  <strong>Endereço de entrega</strong>
                </header>

                {address && (
                  <address>
                    <p className="mb-1">
                      {address.street}, {address.number}
                    </p>

                    <p className="mb-1">
                      {address.city} - {address.state}
                    </p>

                    <p className="mb-1">CEP {address.zip}</p>

                    <p className="mb-0">{address.phone}</p>
                  </address>
                )}

                <footer className="mt-3">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={goToAddress}
                  >
                    Editar endereço
                  </button>
                </footer>
              </div>
            </section>
          </MDBCardBody>
        </MDBCard>
      </article>

      {/* FRETE */}

      <article>
        <MDBCard className="mb-3">
          <MDBCardBody className="my-3">
            <section className="d-flex flex-row align-items-center gap-4">
              <div>
                <span className="ms-3 fa-2x">
                  <i className="fa-regular fa-truck"></i>
                </span>
              </div>
              <div>
                <header className="mb-2">
                  <strong>Forma de envio</strong>
                </header>

                {shipping && (
                  <section>
                    <p className="mb-1">
                      <strong>{shipping.name}</strong>
                    </p>

                    <p className="mb-0">
                      {shipping.price === 0
                        ? "Grátis"
                        : `R$ ${shipping.price.toFixed(2)}`}{" "}
                      - até {shipping.days} dias úteis
                    </p>
                  </section>
                )}

                <footer className="mt-3">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={goToAddress}
                  >
                    Editar forma de envio
                  </button>
                </footer>
              </div>
            </section>
          </MDBCardBody>
        </MDBCard>
      </article>

      {/* PAGAMENTO */}

      <article>
        <MDBCard className="mb-3">
          <MDBCardBody>
            <section className="d-flex flex-row align-items-center gap-4">
              <div>
                <span className="ms-3 fa-2x">
                  <i className="fa-regular fa-credit-card"></i>
                </span>
              </div>
              <div>
                <header className="mb-2">
                  <strong>Pagamento</strong>
                </header>

                <section>
                  <p className="mb-0">
                    {paymentMethod === "credit" && "Cartão de crédito"}
                    {paymentMethod === "pix" && "PIX"}
                  </p>
                </section>

                <footer className="mt-3">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={goToPayment}
                  >
                    Editar forma de pagamento
                  </button>
                </footer>
              </div>
            </section>
          </MDBCardBody>
        </MDBCard>
      </article>

      {/* ITENS */}

      <article>
        <MDBCard className="mb-4">
          <MDBCardBody>
            <header>
              <strong className="mb-3 d-block">Itens do pedido</strong>
            </header>

            <ul className="list-unstyled">
              {cartItems.map((item: CartItem) => (
                <li
                  key={item.product.id}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {item.product.name} x{item.quantity}
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

              <strong>R$ {total.toFixed(2)}</strong>
            </footer>
          </MDBCardBody>
        </MDBCard>
      </article>

      {/* FINALIZAR */}

      <footer>
        <MDBBtn color="warning" size="lg" disabled={!address || !shipping || !paymentMethod} onClick={finishOrder}>
          Finalizar pedido
        </MDBBtn>
      </footer>
    </section>
  );
}
