"use client";

import { useState } from "react";
import { MDBBtn, MDBCol } from "mdb-react-ui-kit";
import type { Product } from "@/features/products/productsTypes";
import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/features/cart/cartSlice";
import "./productUniqueStyle.css";

interface Props {
  product: Product;
  variants: Product[];
}

export default function ProductOptions({ product, variants }: Props) {
  const dispatch = useAppDispatch();

  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.size?.[0],
  );

  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.color?.[0],
  );

  const installmentPrice = (product.price / 4).toFixed(2);

  return (
    <MDBCol md="5">
      <div className="product-info sticky-top">
        {/* BADGE */}
        <span className="product-badge">NOVO</span>

        {/* TITLE */}
        <h1 className="product-title">{product.name}</h1>

        {/* PRICE */}
        <div className="price-box">
          <div className="price-line">
            <h2 className="price">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </h2>

            <span className="stock-badge">Em estoque</span>
          </div>

          <span className="installments">
            ou 4x de R$ {installmentPrice} sem juros
          </span>
        </div>

        {/* TAMANHOS */}
        {product.size && (
          <div className="option-group">
            <p className="option-title">Escolha o tamanho</p>

            <div className="size-grid">
              {product.size.map((s) => (
                <MDBBtn
                  key={s}
                  color={"dark"}
                  outline={selectedSize !== s}
                  className="px-3 py-2 shadow-0"
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </MDBBtn>
              ))}
            </div>
          </div>
        )}

        {/* CORES */}
        {variants.length > 0 && (
          <div className="option-group">
            <p className="option-title">Cores disponíveis</p>

            <div className="color-grid">
              {variants.map((v) => (
                <MDBBtn
                  key={v.id}
                  color={"dark"}
                  outline={selectedColor !== v.color?.[0]}
                  className="px-3 py-2 shadow-0"
                  onClick={() => setSelectedColor(v.color?.[0])}
                >
                  {" "}
                  {v.color?.[0]}{" "}
                </MDBBtn>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <MDBBtn
          block
          color="warning"
          size="lg"
          className="btn-primary-store mt-3"
          onClick={() =>
            dispatch(
              addToCart({
                product,
                quantity: 1,
                selectedSize: selectedSize!,
                selectedColor: selectedColor!,
              }),
            )
          }
        >
          Adicionar ao Carrinho
        </MDBBtn>

        <MDBBtn block outline color="dark" className="mt-2">
          Comprar agora
        </MDBBtn>

        {/* FRETE */}
        <div className="mt-4 shipping-box">
          <i className="fas fa-truck"></i>
          Frete grátis para todo o RN
        </div>

        {/* BENEFÍCIOS */}
        <div className="product-benefits">
          <div>
            <i className="fas fa-lock"></i>
            Compra segura
          </div>

          <div>
            <i className="fas fa-undo"></i>
            Troca fácil em 7 dias
          </div>

          <div>
            <i className="fas fa-credit-card"></i>
            Parcele sem juros
          </div>
        </div>
      </div>
    </MDBCol>
  );
}
