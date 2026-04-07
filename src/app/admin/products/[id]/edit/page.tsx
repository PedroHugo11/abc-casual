"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchProducts,
  updateProduct,
} from "@/features/products/productsSlice";

import ProductForm from "@/components/ProductFormAdmin/ProductFormAdmin";
import { useEffect, useState } from "react";

import {
  MDBSpinner,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
} from "mdb-react-ui-kit";
import { Product } from "@/features/products/productsTypes";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { items, loading } = useAppSelector((state) : { items: Product[], loading: boolean } => state.products);
  const product = items.find((p: Product) => p.id === id);

  const [saving, setSaving] = useState(false);

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
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Editar Produto</h2>
          <small className="text-muted">{product.name}</small>
        </div>

        <div className="d-flex gap-2">
          <MDBBtn
            outline
            onClick={() => router.push("/admin/products")}
          >
            Cancelar
          </MDBBtn>

          <MDBBtn
            color="dark"
            disabled={saving}
            onClick={() => {
              document
                .getElementById("product-form")
                ?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
            }}
          >
            {saving ? "Salvando..." : "Salvar"}
          </MDBBtn>
        </div>
      </div>

      <MDBRow>
        {/* FORM */}
        <MDBCol md="8">
          <MDBCard className="mb-4">
            <MDBCardBody>
              <ProductForm
                id="product-form"
                initialData={product}
                loading={saving}
                onSubmit={async (data) => {
                  try {
                    setSaving(true);

                    await dispatch(
                      updateProduct({ id: id as string, data })
                    );

                    router.push("/admin/products");
                  } finally {
                    setSaving(false);
                  }
                }}
              />
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* SIDEBAR */}
        <MDBCol md="4">
          <MDBCard>
            <MDBCardBody>
              <h5 className="mb-3">Preview</h5>

              <div
                style={{
                  background: "#f5f5f5",
                  borderRadius: 10,
                  padding: 12,
                  textAlign: "center",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    maxHeight: 220,
                    objectFit: "contain",
                  }}
                />
              </div>

              <div className="mt-3">
                <strong>{product.name}</strong>
                <div className="text-muted small">
                  {product.type}
                </div>
                <div className="mt-2 fw-bold">
                  R$ {product.price.toFixed(2)}
                </div>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}