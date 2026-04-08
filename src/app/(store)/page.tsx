"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchProducts,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
} from "@/features/products/productsSlice";
import { MDBContainer, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import { selectCartItems } from "@/features/cart/cartSlice";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import Banner from "@/components/Banner/Banner";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const cartItems = useAppSelector(selectCartItems);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <p>Carregando produtos...</p>;
  if (error) {
    console.error("Erro ao buscar produtos:", error);

    return (
      <div className="text-center p-5 text-danger">
        <h5>Erro ao carregar produtos</h5>
        <p>{error}</p>
      </div>
    );
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const groupedProducts = Object.values(
    filteredProducts.reduce(
      (acc, product) => {
        if (!acc[product.groupId]) {
          acc[product.groupId] = [];
        }
        acc[product.groupId].push(product);
        return acc;
      },
      {} as Record<string, typeof products>,
    ),
  );
  return (
    <>
      <MDBRow className="g-0 mb-0 mb-md-4">
        <MDBCol>
          <Banner />
        </MDBCol>
      </MDBRow>

      <MDBContainer className="py-4 text-white">
        <MDBRow>
          <h1 className="mt-0 text-center mb-5">Lançamentos</h1>
          <MDBCol md="8">
            <MDBInput
              id="inputSearchHome"
              label="Pesquisar produtos..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </MDBCol>
          <MDBCol md="4" className="d-flex mt-1 mt-md-0 gap-2">
            <select className="form-select">
              <option value="all">Todos os tipos</option>
              <option value="t-shirt">T-Shirt</option>
              <option value="t-shirt-piquet">T-Shirt Piquet</option>
              <option value="oversized">Oversized</option>
              <option value="regata-oversized">Regata Oversized</option>
              <option value="oversized-piquet">Oversized Piquet</option>
            </select>

            <button className="btn btn-warning">Pesquisar</button>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <div className="container mt-2">
        <div className="row">
          {groupedProducts.map((group) => {
            const mainProduct = group[0];

            return (
              <div key={mainProduct.groupId} className="col-md-4 mb-4">
                <ProductCard product={mainProduct} variants={group} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
