"use client";

import { MDBCol } from "mdb-react-ui-kit";
import type { Product } from "@/features/products/productsTypes";
import "./productUniqueStyle.css";

interface Props {
  product: Product;
}

export default function ProductGallery({ product }: Props) {
  return (
    <MDBCol md="6" className="mb-4">
      <img
        src={product.image}
        alt={product.name}
        className="image-product-gallery"
      />
    </MDBCol>
  );
}