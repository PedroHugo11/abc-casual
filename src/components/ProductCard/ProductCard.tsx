'use client'

import React, { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks"
import { addToCart } from "@/features/cart/cartSlice"
import type { Product } from "@/features/products/productsTypes";
import "./ProductCard.css";

interface Props {
  product: Product;
  variants?: Product[];
}

export const ProductCard: React.FC<Props> = ({ product, variants = [] }) => {
  const router = useRouter();

  const [hover, setHover] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [error, setError] = useState(false);

  const dispatch = useAppDispatch()

  const activeVariant =
    variants.find((v) => v.color?.[0] === selectedColor) || product;

  const openProduct = () => router.push(`/product/${product.id}`);

  const handleBuy = () => {
    const finalColor =
        variants.length > 0 ? selectedColor : product.color?.[0]

    if (!selectedSize || !finalColor) {
        setError(true)
        return
    }

    setError(false)

    dispatch(
        addToCart({
        product: activeVariant,
        quantity: 1,
        selectedSize,
        selectedColor: finalColor
        })
    )
    }

  return (
    <MDBCard
      className="product-card card-hover"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Imagem */}
      <div className="product-img-wrapper">
        <MDBCardImage
          src={activeVariant.image}
          alt={product.name}
          className="product-img"
          onClick={openProduct}
        />

        {hover && (
          <div className="hover-info">
            {/* TAMANHOS (radio) */}
            <div className="sizes">
              {product.size?.map((s) => (
                <label key={s} className="size-box">
                  <input
                    type="radio"
                    name={`size-${product.id}`}
                    value={s}
                    checked={selectedSize === s}
                    onChange={() => {
                      setSelectedSize(s);
                      setError(false);
                    }}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>

            {/* CORES */}
            {variants.length > 0 && (
              <div className="colors">
                {variants.map((v) => {
                  const circleColor =
                    v.color?.[0]?.toLowerCase() === "preto"
                      ? "#000"
                      : v.color?.[0]?.toLowerCase() === "branca"
                      ? "#fff"
                      : "#ccc";

                  return (
                    <div
                      key={v.id}
                      className="color-circle"
                      style={{
                        backgroundColor: circleColor,
                        border:
                          selectedColor === v.color?.[0]
                            ? "4px solid #ffc90c"
                            : "2px solid #b8b8b8",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColor(v.color?.[0]);
                        setError(false);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {error && (
              <div className="select-warning">
                Selecione as opções
              </div>
            )}
          </div>
        )}
      </div>

      {/* Infos */}
      <MDBCardBody className="text-center">
        <MDBCardTitle className="product-title" onClick={openProduct}>
          {product.name}
        </MDBCardTitle>

        <MDBCardText className="product-type">
          {selectedColor}
        </MDBCardText>

        <MDBCardText className="product-price">
          R$ {activeVariant.price.toFixed(2)}
        </MDBCardText>

        <MDBBtn color='warning' className="product-btn" onClick={handleBuy}>
          Comprar
        </MDBBtn>
      </MDBCardBody>
    </MDBCard>
  );
};
