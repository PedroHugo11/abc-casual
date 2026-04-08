"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdb-react-ui-kit";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectProducts } from "@/features/products/productsSlice";
import { addToCart } from "@/features/cart/cartSlice";

import ProductGallery from "@/components/product/ProductGallery";
import ProductOptions from "@/components/product/ProductOptions";
import { ProductCard } from "@/components/ProductCard/ProductCard";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const products = useAppSelector(selectProducts);
  const dispatch = useAppDispatch();

  const product = products.find((p) => p.id === id);

  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();

  useEffect(() => {
    if (product) {
      setSelectedSize(product.size?.[0]);
      setSelectedColor(product.color?.[0]);
      setQty(1);
      window.scrollTo(0, 0);
    }
  }, [product]);

  if (!product) {
    return (
      <MDBContainer className="py-5 text-center">
        <h3>Produto não encontrado</h3>
        <MDBBtn onClick={() => router.push("/")}>Voltar para a loja</MDBBtn>
      </MDBContainer>
    );
  }

  const variants = products.filter((p) => p.groupId === product.groupId);

  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <MDBContainer className="py-5">
      
      {/* BREADCRUMB */}
      <p className="breadcrumb-text text-muted small mb-3">
        <Link href="/">Home</Link>
        <span> / </span>

        <Link href="/products">Produtos</Link>
        <span> / </span>

        <span className="current">{product.name}</span>
      </p>

      {/* HERO */}
      <MDBRow className="justify-content-between align-items-start">
        <ProductGallery product={product} />

        <ProductOptions product={product} variants={variants} />
      </MDBRow>

      {/* DESCRIÇÃO */}
      <section className="product-description mt-5">
        <h3 className="mb-3">Sobre o produto</h3>

        <p>
          Explore o máximo de conforto e estilo com o {product.name}.
          Desenvolvida com material premium, ideal para o dia a dia ou ocasiões
          especiais.
        </p>

        <ul>
          <li>100% algodão sustentável</li>
          <li>Alta durabilidade</li>
          <li>Modelagem exclusiva</li>
          <li>Estampa em alta definição</li>
        </ul>

        <p>{product.description}</p>
      </section>

      {/* PRODUTOS RELACIONADOS */}
      <MDBRow className="mt-5">
        <MDBCol size="12" className="mb-4 text-center">
          <h3 className="fw-bold text-uppercase">Produtos Semelhantes</h3>
        </MDBCol>

        {relatedProducts.map((related) => {
          const variants = products.filter(
            (p) => p.groupId === related.groupId,
          );

          return (
            <MDBCol key={related.id} md="3" sm="6" className="mb-4">
              <ProductCard product={related} variants={variants} />
            </MDBCol>
          );
        })}
      </MDBRow>
    </MDBContainer>
  );
}
