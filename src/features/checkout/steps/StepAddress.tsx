"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  setAddresses,
  selectAddress,
  setShippingOptions,
  selectShipping,
  resetCheckout,
  addAddress,
} from "@/features/checkout/checkoutSlice";

import type { Address, Shipping } from "@/features/checkout/types";

import {
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBInput,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";

interface Props {
  next: () => void;
}

export default function StepAddress({ next }: Props) {
  const dispatch = useAppDispatch();

  const addresses = useAppSelector((state) => state.checkout.addresses);
  const selectedAddress = useAppSelector(
    (state) => state.checkout.selectedAddress,
  );

  const shippingOptions = useAppSelector(
    (state) => state.checkout.shippingOptions,
  );
  const selectedShipping = useAppSelector(
    (state) => state.checkout.selectedShipping,
  );

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    zip: "",
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    number: "",
    phone: "",
  });

  const [disabledFields, setDisabledFields] = useState({
    street: false,
    neighborhood: false,
    city: false,
    state: false,
  });

  useEffect(() => {
    dispatch(resetCheckout());

    const userAddresses: Address[] = [
      {
        id: "1",
        street: "Rua José Farache",
        number: "22A",
        city: "Natal",
        state: "RN",
        zip: "59022380",
        phone: "(84) 99822-3869",
      },
    ];

    dispatch(setAddresses(userAddresses));
  }, [dispatch]);

  useEffect(() => {
    if (!selectedAddress) return;

    const shipping: Shipping[] = [
      { id: "1", name: "J&T", price: 0, days: 12 },
      { id: "2", name: "PAC", price: 32.41, days: 13 },
      { id: "3", name: "Sedex", price: 63.52, days: 8 },
    ];

    dispatch(setShippingOptions(shipping));
  }, [selectedAddress, dispatch]);

  async function handleCep(cep: string) {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) return;

    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await res.json();

    setForm((prev) => ({
      ...prev,
      zip: cleanCep,
      street: data.logradouro || "",
      neighborhood: data.bairro || "",
      city: data.localidade || "",
      state: data.uf || "",
    }));

    setDisabledFields({
      street: !!data.logradouro,
      neighborhood: !!data.bairro,
      city: !!data.localidade,
      state: !!data.uf,
    });
  }

  function handleSaveAddress() {
    if (!form.street || !form.number || !form.city) return;

    const newAddress: Address = {
      id: crypto.randomUUID(),
      street: form.street,
      number: form.number,
      city: form.city,
      state: form.state,
      zip: form.zip,
      phone: form.phone,
    };

    dispatch(addAddress(newAddress));

    dispatch(selectAddress(newAddress.id));

    setShowForm(false);

    setForm({
      zip: "",
      street: "",
      neighborhood: "",
      city: "",
      state: "",
      number: "",
      phone: "",
    });
  }

  return (
    <section>
      <h4 className="mb-4">Selecione onde deseja receber suas compras:</h4>

      {addresses.map((address) => (
        <MDBCard key={address.id} onClick={() => dispatch(selectAddress(address.id))} className="mb-3">
          <MDBCardBody className="d-flex gap-3">
            <input
              type="radio"
              name="address"
              value={address.id}
              checked={selectedAddress === address.id}
            />

            <div>
              <strong>
                {address.street}, {address.number}
              </strong>

              <div>
                {address.city} - {address.state} - CEP: {address.zip}
              </div>

              <div>{address.phone}</div>
            </div>
          </MDBCardBody>
        </MDBCard>
      ))}

      <MDBBtn
        outline
        color="primary"
        className="mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        + Adicionar endereço
      </MDBBtn>

      {showForm && (
        <MDBCard className="mb-4">
          <MDBCardBody>
            <h5 className="mb-4">Novo endereço</h5>

            <MDBRow className="mb-3">
              <MDBCol md="4">
                <MDBInput
                  label="CEP"
                  value={form.zip}
                  onChange={(e) => {
                    setForm({ ...form, zip: e.target.value });
                    handleCep(e.target.value);
                  }}
                />
              </MDBCol>
            </MDBRow>

            <MDBRow className="mb-3">
              <MDBCol md="8">
                <MDBInput
                  label="Rua"
                  value={form.street}
                  disabled={disabledFields.street}
                  onChange={(e) => setForm({ ...form, street: e.target.value })}
                />
              </MDBCol>

              <MDBCol md="4">
                <MDBInput
                  label="Número"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                />
              </MDBCol>
            </MDBRow>

            <MDBRow className="mb-3">
              <MDBCol md="4">
                <MDBInput
                  label="Bairro"
                  value={form.neighborhood}
                  disabled={disabledFields.neighborhood}
                  onChange={(e) =>
                    setForm({ ...form, neighborhood: e.target.value })
                  }
                />
              </MDBCol>

              <MDBCol md="4">
                <MDBInput
                  label="Cidade"
                  value={form.city}
                  disabled={disabledFields.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </MDBCol>

              <MDBCol md="4">
                <MDBInput
                  label="Estado"
                  value={form.state}
                  disabled={disabledFields.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </MDBCol>
            </MDBRow>

            <MDBRow>
              <MDBCol md="4">
                <MDBInput
                  label="Telefone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </MDBCol>
              <MDBCol md="4">
                <MDBBtn color="warning" onClick={handleSaveAddress}>
                  Salvar endereço
                </MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      )}

      {selectedAddress !== null && (
        <>
          <h4 className="mb-4">Escolha a forma de entrega:</h4>

          <MDBRow>
            {shippingOptions.map((option) => (
              <MDBCol md="4" key={option.id}>
                <MDBCard
                  className={`mb-3 p-3 ${
                    selectedShipping === option.id ? "border-primary" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => dispatch(selectShipping(option.id))}
                >
                  <input
                    type="radio"
                    checked={selectedShipping === option.id}
                    readOnly
                  />

                  <div className="mt-2">
                    <strong>{option.name}</strong>

                    <div>
                      {option.price === 0
                        ? "GRÁTIS"
                        : `R$ ${option.price.toFixed(2)}`}
                      {" - Até "}
                      {option.days} dias úteis
                    </div>
                  </div>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
          <MDBBtn
            color="warning"
            disabled={!selectedAddress || !selectedShipping}
            onClick={next}
          >
            Salvar
          </MDBBtn>
        </>
      )}
    </section>
  );
}
