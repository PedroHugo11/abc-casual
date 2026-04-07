"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { fetchProducts } from "@/features/products/productsSlice";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBBadge,
  MDBSpinner,
  MDBCard,
  MDBCardBody,
} from "mdb-react-ui-kit";
import { Product } from "@/features/products/productsTypes";

export default function AdminProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { items, loading } = useAppSelector((state) : { items: Product[], loading: boolean } => state.products);
  const product = items.find((p: Product) => p.id === id);

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [items.length, dispatch]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <MDBSpinner />
      </div>
    );
  }

  if (!product) {
    return <p className="p-4">Produto não encontrado</p>;
  }

  return (
    <MDBContainer className="py-4">
      <MDBCard className="shadow-3">
        <MDBCardBody>
          <MDBRow className="align-items-center">
            
            {/* IMAGEM */}
            <MDBCol md="5">
              <div
                style={{
                  background: "#f5f5f5",
                  borderRadius: 12,
                  padding: 20,
                  textAlign: "center",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    maxHeight: 320,
                    objectFit: "contain",
                  }}
                />
              </div>
            </MDBCol>

            {/* INFO */}
            <MDBCol md="7">
              {/* TÍTULO */}
              <h2 className="fw-bold mb-1">{product.name}</h2>

              <p className="text-muted text-uppercase small mb-3">
                {product.type}
              </p>

              {/* PREÇO */}
              <h3 className="fw-bold text-dark mb-4">
                R$ {product.price.toFixed(2)}
              </h3>

              {/* DESCRIÇÃO */}
              <p className="text-muted mb-4">
                {product.description}
              </p>

              {/* GRID INFO */}
              <div className="mb-4">
                <div className="mb-3">
                  <strong>Estoque</strong>
                  <div className="mt-1">
                    <MDBBadge
                      color={product.stock > 0 ? "success" : "danger"}
                      pill
                    >
                      {product.stock > 0
                        ? `${product.stock} disponíveis`
                        : "Sem estoque"}
                    </MDBBadge>
                  </div>
                </div>

                <div className="mb-3">
                  <strong>Tamanhos</strong>
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {product.size.map((s) => (
                      <MDBBadge key={s} color="dark" pill>
                        {s}
                      </MDBBadge>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <strong>Cores</strong>
                  <div className="d-flex gap-2 mt-2 flex-wrap">
                    {product.color.map((c) => (
                      <MDBBadge key={c} color="dark" pill>
                        {c}
                      </MDBBadge>
                    ))}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="d-flex gap-3 mt-4">
                <MDBBtn
                  color="dark"
                  size="lg"
                  onClick={() =>
                    router.push(`/admin/products/${product.id}/edit`)
                  }
                >
                  ✏️ Editar Produto
                </MDBBtn>

                <MDBBtn
                  outline
                  size="lg"
                  onClick={() => router.push("/admin/products")}
                >
                  ← Voltar
                </MDBBtn>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}