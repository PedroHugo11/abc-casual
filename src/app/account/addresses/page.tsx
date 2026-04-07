"use client";

import { useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBBadge,
  MDBInput,
} from "mdb-react-ui-kit";
import Sidebar from "../AccountSidebar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addAddress, removeAddress, selectAddresses, setDefaultAddress } from "@/features/addresses/addressesSlice";
import "../ordersStyle.css";

export default function AddressesPage() {
  const addresses = useAppSelector(selectAddresses);
  const dispatch = useAppDispatch();

  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    street: "",
    number: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  function handleSetDefault(id: string) {
    dispatch(setDefaultAddress(id));
  }

  function handleRemove(id: string) {
    dispatch(removeAddress(id));
  }

  const handleSave = async () => {
    if (!form.name || !form.street || !form.zip) return;

    setLoading(true);
    setSuccess(false);

    await new Promise((r) => setTimeout(r, 800));

    const hasDefault = addresses.some(a => a.default);

    const newAddress = {
      ...form,
      id: Date.now().toString(),
      default: !hasDefault,
    };

    console.log(addresses);

    dispatch(addAddress(newAddress)); // 🔥 aqui é a mudança principal

    setLoading(false);
    setSuccess(true);

    setForm({
      name: "",
      street: "",
      number: "",
      city: "",
      state: "",
      zip: "",
      phone: "",
    });

    setTimeout(() => {
      setIsAdding(false);
      setSuccess(false);
    }, 1500);
  };

  return (
    <main>
      <MDBContainer className="py-5">
        <MDBRow>
          {/* SIDEBAR */}
          <Sidebar />

          {/* CONTENT */}
          <section className="col-md-9">
            <header className="mb-4 d-flex justify-content-between align-items-center">
              <h1 className="h3 mb-0">Endereços</h1>

              <MDBBtn color="dark" onClick={() => setIsAdding(true)}>
                Adicionar endereço
              </MDBBtn>
            </header>

            {/* FORM */}
            {isAdding && (
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <h5 className="mb-3">Novo endereço</h5>

                  <MDBRow className="g-3">
                    <MDBCol md="6">
                      <MDBInput
                        label="Nome"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </MDBCol>

                    <MDBCol md="6">
                      <MDBInput
                        label="Telefone"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </MDBCol>

                    <MDBCol md="8">
                      <MDBInput
                        label="Rua"
                        value={form.street}
                        onChange={(e) =>
                          setForm({ ...form, street: e.target.value })
                        }
                      />
                    </MDBCol>

                    <MDBCol md="4">
                      <MDBInput
                        label="Número"
                        value={form.number}
                        onChange={(e) =>
                          setForm({ ...form, number: e.target.value })
                        }
                      />
                    </MDBCol>

                    <MDBCol md="4">
                      <MDBInput
                        label="CEP"
                        value={form.zip}
                        onChange={(e) =>
                          setForm({ ...form, zip: e.target.value })
                        }
                      />
                    </MDBCol>

                    <MDBCol md="4">
                      <MDBInput
                        label="Cidade"
                        value={form.city}
                        onChange={(e) =>
                          setForm({ ...form, city: e.target.value })
                        }
                      />
                    </MDBCol>

                    <MDBCol md="4">
                      <MDBInput
                        label="Estado"
                        value={form.state}
                        onChange={(e) =>
                          setForm({ ...form, state: e.target.value })
                        }
                      />
                    </MDBCol>
                  </MDBRow>

                  {success && (
                    <p className="text-success mt-3 mb-0">
                      Endereço salvo com sucesso!
                    </p>
                  )}

                  <div className="mt-4 d-flex gap-2">
                    <MDBBtn
                      color="dark"
                      disabled={loading}
                      onClick={handleSave}
                    >
                      {loading ? "Salvando..." : "Salvar"}
                    </MDBBtn>

                    <MDBBtn
                      outline
                      color="dark"
                      onClick={() => setIsAdding(false)}
                    >
                      Cancelar
                    </MDBBtn>
                  </div>
                </MDBCardBody>
              </MDBCard>
            )}

            {/* LISTA */}
            {addresses.map((address) => (
              <article key={address.id} className="mb-4">
                <MDBCard>
                  <MDBCardBody>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h6 className="mb-1">
                          {address.name}

                          {address.default && (
                            <MDBBadge color="dark" className="ms-2">
                              Padrão
                            </MDBBadge>
                          )}
                        </h6>

                        <p className="mb-1">
                          {address.street}, {address.number}
                        </p>

                        <p className="mb-1">
                          {address.city} - {address.state}
                        </p>

                        <p className="mb-1">CEP {address.zip}</p>

                        <p className="mb-0">{address.phone}</p>
                      </div>

                      <div className="text-end">
                        {!address.default && (
                          <MDBBtn
                            size="sm"
                            color="dark"
                            className="mb-2"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            Definir como padrão
                          </MDBBtn>
                        )}

                        <br />

                        <MDBBtn size="sm" outline color="dark" className="me-2">
                          Editar
                        </MDBBtn>

                        <MDBBtn
                          size="sm"
                          outline
                          color="warning"
                          onClick={() => handleRemove(address.id)}
                        >
                          Remover
                        </MDBBtn>
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </article>
            ))}
          </section>
        </MDBRow>
      </MDBContainer>
    </main>
  );
}
