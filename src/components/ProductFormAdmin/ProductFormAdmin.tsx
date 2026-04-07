"use client";

import { useState } from "react";
import { MDBInput, MDBBtn, MDBTextArea } from "mdb-react-ui-kit";
import type { Product } from "@/features/products/productsTypes";
import { PRODUCT_TYPES } from "@/features/products/productConstants";

type Props = {
  id?: string; // 🔥 pra submit externo
  initialData?: Product;
  onSubmit: (data: Partial<Product>) => void;
  loading?: boolean;
};

export default function ProductFormAdmin({
  id,
  initialData,
  onSubmit,
  loading = false,
}: Props) {
  const [form, setForm] = useState<Partial<Product>>(
    initialData || {
      name: "",
      price: 0,
      description: "",
      image: "",
      size: [],
      color: [],
      stock: 0,
      type: "",
      groupId: "",
    },
  );

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const parseList = (value: string) =>
    value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

  return (
    <form
      id={id}
      onSubmit={(e) => {
        e.preventDefault();
        if (loading) return;
        onSubmit(form);
      }}
      className="d-flex flex-column gap-4"
    >
      {/* ===================== */}
      {/* INFORMAÇÕES PRINCIPAIS */}
      {/* ===================== */}
      <div>
        <h5 className="mb-3">Informações</h5>

        <MDBInput
          label="Nome"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="mb-3"
        />

        <MDBInput
          label="Preço"
          type="number"
          value={form.price}
          onChange={(e) => handleChange("price", +e.target.value)}
          className="mb-3"
        />

        <MDBTextArea
          label="Descrição"
          rows={3}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      {/* ===================== */}
      {/* IMAGEM */}
      {/* ===================== */}
      <div>
        <h5 className="mb-3">Imagem</h5>

        <MDBInput
          label="Imagem URL"
          value={form.image}
          onChange={(e) => handleChange("image", e.target.value)}
        />

        {/* PREVIEW */}
        {form.image && (
          <div
            style={{
              marginTop: 12,
              background: "#f5f5f5",
              padding: 12,
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            <img
              src={form.image}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: 180,
                objectFit: "contain",
              }}
            />
          </div>
        )}
      </div>

      {/* ===================== */}
      {/* ORGANIZAÇÃO */}
      {/* ===================== */}
      <div>
        <h5 className="mb-3">Organização</h5>

        <div>
          <label className="form-label">Tipo</label>

          <select
            className="form-select mb-3"
            value={form.type || ""}
            onChange={(e) => handleChange("type", e.target.value as any)}
          >
            <option value="">Selecione o tipo</option>

            {PRODUCT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <MDBInput
          label="Group ID"
          value={form.groupId}
          onChange={(e) => handleChange("groupId", e.target.value)}
        />
      </div>

      {/* ===================== */}
      {/* ESTOQUE */}
      {/* ===================== */}
      <div>
        <h5 className="mb-3">Estoque</h5>

        <MDBInput
          label="Quantidade em estoque"
          type="number"
          value={form.stock}
          onChange={(e) => handleChange("stock", +e.target.value)}
        />
      </div>

      {/* ===================== */}
      {/* VARIAÇÕES */}
      {/* ===================== */}
      <div>
        <h5 className="mb-3">Variações</h5>

        <MDBInput
          label="Tamanhos (ex: P, M, G)"
          value={form.size?.join(",")}
          onChange={(e) => handleChange("size", parseList(e.target.value))}
          className="mb-3"
        />

        <MDBInput
          label="Cores (ex: Preto, Branco)"
          value={form.color?.join(",")}
          onChange={(e) => handleChange("color", parseList(e.target.value))}
        />
      </div>

      {/* ===================== */}
      {/* BOTÃO */}
      {/* ===================== */}
      <div className="mt-3">
        <MDBBtn type="submit" color="dark" disabled={loading}>
          {loading ? "Salvando..." : "Salvar Produto"}
        </MDBBtn>
      </div>
    </form>
  );
}
