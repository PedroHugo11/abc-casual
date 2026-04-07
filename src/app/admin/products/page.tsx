"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProducts,
  deleteProduct,
} from "@/features/products/productsSlice";

import Link from "next/link";
import {
  MDBContainer,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBBadge,
} from "mdb-react-ui-kit";

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <MDBContainer className="py-4">
      {/* HEADER */}
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Produtos</h2>
          <small className="text-muted">
            Gerencie seu catálogo
          </small>
        </div>

        <Link href="/admin/products/create">
          <MDBBtn color="dark">+ Novo Produto</MDBBtn>
        </Link>
      </header>

      {/* TABELA */}
      <MDBTable hover responsive className="align-middle">
        <MDBTableHead light>
          <tr>
            <th>Produto</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th className="text-end">Ações</th>
          </tr>
        </MDBTableHead>

        <MDBTableBody>
          {products.map((p) => (
            <tr key={p.id}>
              {/* PRODUTO */}
              <td>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />

                  <div>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="fw-bold text-dark text-decoration-none"
                    >
                      {p.name}
                    </Link>

                    <div className="text-muted small">
                      {p.type}
                    </div>
                  </div>
                </div>
              </td>

              {/* PREÇO */}
              <td className="fw-semibold">
                R$ {p.price.toFixed(2)}
              </td>

              {/* ESTOQUE */}
              <td>
                <MDBBadge
                  color={p.stock > 0 ? "success" : "danger"}
                >
                  {p.stock > 0
                    ? `${p.stock}`
                    : "Sem estoque"}
                </MDBBadge>
              </td>

              {/* AÇÕES */}
              <td className="text-end">
                <Link href={`/admin/products/${p.id}/edit`}>
                  <MDBBtn color="dark" size="sm" className="me-2">
                    Editar
                  </MDBBtn>
                </Link>

                <MDBBtn
                  size="sm"
                  color="danger"
                  onClick={() => {
                    if (
                      confirm("Deseja realmente deletar?")
                    ) {
                      dispatch(deleteProduct(p.id));
                    }
                  }}
                >
                  Deletar
                </MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      {/* EMPTY STATE */}
      {!loading && products.length === 0 && (
        <div className="text-center mt-5 text-muted">
          Nenhum produto cadastrado
        </div>
      )}
    </MDBContainer>
  );
}