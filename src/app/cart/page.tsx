"use client";

import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdb-react-ui-kit";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { selectUser } from "@/features/auth/authSlice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectCartItems,
  removeFromCart,
  clearCart,
  updateQuantity,
} from "@/features/cart/cartSlice";

import "./CartPage.css";
import { useEffect, useState } from "react";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => setMessage(""), 3000);

    return () => clearTimeout(timer);
  }, [message]);

  const total = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  const [showCepInput, setShowCepInput] = useState(false);
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState<number | null>(null);

  const [showCouponInput, setShowCouponInput] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const checkCep = async () => {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.uf === "RN") {
        setShipping(0);
      } else {
        setShipping(10);
      }

      setShowCepInput(false);
    } catch {
      alert("CEP inválido");
    }
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "ABC10") {
      setDiscount(total * 0.1);
    } else {
      alert("Cupom inválido");
    }

    setShowCouponInput(false);
  };

  const handleCheckout = () => {
    if (!user) {
      setMessage("Você precisa estar logado para finalizar a compra 🛒");

      setTimeout(() => {
        router.push("/?redirect=checkout");
      }, 2000);

      return;
    }

    if (user.role !== "customer") {
      setMessage("Apenas clientes podem finalizar compras");
      return;
    }

    router.push("/checkout");
  };

  const finalTotal = total + (shipping ?? 0) - discount;

  if (items.length === 0) {
    return (
      <MDBContainer className="py-5 text-center">
        <h2>Seu carrinho está vazio</h2>

        <Link href="/">
          <MDBBtn color="warning" className="mt-3">
            Continuar comprando
          </MDBBtn>
        </Link>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer className="cart-page py-4">
      <MDBRow>
        {/* PRODUTOS */}
        <MDBCol md="8">
          {message && (
            <div className="alert alert-warning text-center mt-3">
              {message}
            </div>
          )}
          <h3 className="mb-4">Meu carrinho</h3>

          {items.map((ci, index) => (
            <article className="cart-item mb-3" key={`${ci.product.id}-${ci.selectedSize}-${ci.selectedColor}`}>
              <div className="cart-item-left">
                <img
                  src={ci.product.image}
                  alt={ci.product.name}
                  className="cart-item-img"
                />
              </div>

              <div className="cart-item-middle">
                <h5 className="product-title">{ci.product.name}</h5>

                <p className="product-ref">Ref: #{ci.product.id}</p>

                <p className="mb-2">Tamanho: {ci.selectedSize}</p>

                <p className="meta">Cor: {ci.selectedColor}</p>

                <div className="qty-container">
                  <span>Quantidade:</span>

                  <div className="qty">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            index,
                            quantity: ci.quantity - 1,
                          }),
                        )
                      }
                      disabled={ci.quantity <= 1}
                    >
                      −
                    </button>

                    <span>{ci.quantity}</span>

                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            index,
                            quantity: ci.quantity + 1,
                          }),
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="cart-item-right">
                <button
                  className="remove"
                  onClick={() => dispatch(removeFromCart(index))}
                >
                  <i className="fa-solid fa-trash" />
                </button>

                <div className="price-box">
                  <span className="price">
                    R$ {(ci.product.price * ci.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </MDBCol>

        {/* RESUMO */}
        <MDBCol md="4">
          <h3 className="mb-4">Resumo da compra</h3>
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal ({items.length} itens)</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>

            <div className="summary-row">
              <span>Frete</span>

              {shipping === null && !showCepInput && (
                <button
                  className="link-button"
                  onClick={() => setShowCepInput(true)}
                >
                  Adicionar
                </button>
              )}

              {showCepInput && (
                <div className="cep-input">
                  <input
                    type="text"
                    placeholder="Digite o CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                  />

                  <MDBBtn color="warning" onClick={checkCep}>
                    OK
                  </MDBBtn>
                </div>
              )}

              {shipping !== null && (
                <span className={shipping === 0 ? "free" : ""}>
                  {shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2)}`}
                </span>
              )}
            </div>

            <div className="summary-row">
              <span>Cupom de desconto</span>

              {!showCouponInput && discount === 0 && (
                <button
                  className="link-button"
                  onClick={() => setShowCouponInput(true)}
                >
                  Adicionar
                </button>
              )}

              {showCouponInput && (
                <div className="cep-input">
                  <input
                    type="text"
                    placeholder="Cupom"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />

                  <MDBBtn color="warning" onClick={applyCoupon}>
                    Aplicar
                  </MDBBtn>
                </div>
              )}

              {discount > 0 && (
                <span className="free">− R$ {discount.toFixed(2)}</span>
              )}
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>
              <strong>R$ {finalTotal.toFixed(2)}</strong>
            </div>

            <MDBBtn
              color="warning"
              className="w-100 mt-3"
              onClick={handleCheckout}
              disabled={items.length === 0}
            >
              Finalizar compra
            </MDBBtn>

            <MDBBtn
              outline
              color="secondary"
              className="w-100 mt-2"
              onClick={() => dispatch(clearCart())}
            >
              Limpar carrinho
            </MDBBtn>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
