"use client";

import {
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";

import Sidebar from "../AccountSidebar";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectUser, updateUser } from "@/features/auth/authSlice";
import { useEffect, useState } from "react";
import "../ordersStyle.css";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...form,
    };

    dispatch(updateUser(updatedUser));
    setIsEditing(false);
  };

  const isDirty =
    user &&
    (form.name !== user.name ||
      form.email !== user.email ||
      form.phone !== user.phone);

  return (
    <main>
      <MDBContainer className="py-5">
        <MDBRow>
          {/* SIDEBAR */}
          <Sidebar />

          {/* CONTENT */}
          <section className="col-md-9">
            <header className="mb-4">
              <h1 className="h3">Meus Dados</h1>
            </header>

            <MDBCard>
              <MDBCardBody>
                <MDBRow className="g-3">
                  <div className="col-md-6">
                    <MDBInput
                      label="Nome"
                      value={form.name}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <MDBInput
                      label="Email"
                      value={form.email}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <MDBInput
                      label="Telefone"
                      value={form.phone}
                      disabled={!isEditing}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                    />
                  </div>
                </MDBRow>

                <div className="mt-4 d-flex gap-2">
                  {!isEditing ? (
                    <MDBBtn color="dark" onClick={() => setIsEditing(true)}>
                      Editar
                    </MDBBtn>
                  ) : (
                    <>
                      <MDBBtn color="warning" onClick={handleSave} disabled={!isDirty}>
                        Salvar
                      </MDBBtn>

                      <MDBBtn
                        outline
                        color="warning"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancelar
                      </MDBBtn>
                    </>
                  )}
                </div>
              </MDBCardBody>
            </MDBCard>
          </section>
        </MDBRow>
      </MDBContainer>
    </main>
  );
}
