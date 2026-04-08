"use client";

import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectProducts } from "@/features/products/productsSlice";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import { groupProducts } from "@/utils/groupProducts";
import { MDBBtn, MDBCard, MDBCardBody, MDBInput } from "mdb-react-ui-kit";
import { useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [sizeOpen, setSizeOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);

  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const size = searchParams.get("size");

  const products = useAppSelector(selectProducts);

  const sizes = Array.from(
    new Set(products.flatMap((p) => p.size ?? [])),
  ).sort();

  const colors = Array.from(
    new Set(products.flatMap((p) => p.color ?? [])),
  ).sort();

  let filtered = products;

  // filtro por categoria
  if (category) {
    filtered = filtered.filter(
      (p) => p.type?.toLowerCase() === category.toLowerCase(),
    );
  }

  // filtro por busca
  if (search) {
    const term = search.toLowerCase();

    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term),
    );
  }

  // filtro por tamanho
  if (size) {
    filtered = filtered.filter((p) => p.size?.includes(size));
  }

  // ordenação
  if (sort === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  }

  if (sort === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  if (sort === "name") {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }

  const groupedProducts = groupProducts(filtered);

  const titleMap: Record<string, string> = {
    tshirt: "T-Shirts",
    regata: "Regatas",
    oversized: "Oversized",
  };

  const title = category
    ? (titleMap[category] ?? category)
    : "Todos os produtos";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    window.location.href = `/products?${params.toString()}`;
  }

  return (
    <main className="container mt-4">
      <header className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>{title}</h1>

          <select
            className="form-select w-auto"
            value={sort ?? ""}
            onChange={(e) => updateParam("sort", e.target.value || null)}
          >
            <option value="">Ordenar</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="name">Nome</option>
          </select>
        </div>

        {search && (
          <p className="text-muted">
            Resultados para: <strong>{search}</strong>
          </p>
        )}
      </header>

      <section className="row">
        {/* SIDEBAR FILTROS */}

        {/* BREADCRUMB */}
        <p className="breadcrumb-text text-muted small mb-3">
          <Link href="/">Home</Link>
          <span> / </span>
          <span className="current">Produtos</span>
        </p>

        <aside className="sidebar col-md-3 mb-4">
          <MDBCard className="p-3">
            {/* TAMANHO */}

            <MDBCard className="mb-3 shadow-0 border">
              <MDBCardBody>
                <div
                  className="d-flex justify-content-between align-items-center mb-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSizeOpen(!sizeOpen)}
                >
                  <strong>Tamanho</strong>
                  <i className={`fas fa-${sizeOpen ? "minus" : "plus"}`}></i>
                </div>

                {sizeOpen && (
                  <div>
                    {sizes.map((s) => (
                      <div
                        key={s}
                        className="form-check d-flex align-items-end mb-2"
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`size-${s}`}
                          checked={size === s}
                          onChange={() =>
                            updateParam("size", size === s ? null : s)
                          }
                        />

                        <label
                          className="form-check-label"
                          htmlFor={`size-${s}`}
                        >
                          {s}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </MDBCardBody>
            </MDBCard>

            {/* PREÇO */}

            <MDBCard className="mb-3 shadow-0 border">
              <MDBCardBody>
                <div
                  className="d-flex justify-content-between align-items-center mb-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setPriceOpen(!priceOpen)}
                >
                  <strong>Preço</strong>
                  <i className={`fas fa-${priceOpen ? "minus" : "plus"}`}></i>
                </div>

                {priceOpen && (
                  <>
                    <div className="mb-4">
                      <input
                        type="range"
                        className="form-range"
                        min="0"
                        max="5000"
                      />
                    </div>

                    <div className="d-flex gap-3">
                      <div className="w-50">
                        <small>Mínimo</small>

                        <input className="form-control" value="9.99" disabled />
                      </div>

                      <div className="w-50">
                        <small>Máximo</small>

                        <input className="form-control" value="4999" disabled />
                      </div>
                    </div>
                  </>
                )}
              </MDBCardBody>
            </MDBCard>

            {/* COR PRINCIPAL */}

            <MDBCard className="mb-3 shadow-0 border">
              <MDBCardBody>
                <div
                  className="d-flex justify-content-between align-items-center mb-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => setColorOpen(!colorOpen)}
                >
                  <strong>Cor Principal</strong>
                  <i className={`fas fa-${colorOpen ? "minus" : "plus"}`}></i>
                </div>

                {colorOpen && (
                  <div style={{ maxHeight: 160, overflowY: "auto" }}>
                    {colors.map((color) => (
                      <div
                        key={color}
                        className="form-check d-flex align-items-end mb-2"
                      >
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`color-${color}`}
                        />

                        <label
                          className="form-check-label"
                          htmlFor={`color-${color}`}
                        >
                          {color}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCard>
        </aside>

        {/* GRID PRODUTOS */}

        <section className="col-md-9">
          <div className="row">
            {groupedProducts.length === 0 && <p>Nenhum produto encontrado.</p>}

            {groupedProducts.map((group) => {
              const mainProduct = group[0];

              return (
                <div key={mainProduct.groupId} className="col-md-4 mb-4">
                  <ProductCard product={mainProduct} variants={group} />
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
