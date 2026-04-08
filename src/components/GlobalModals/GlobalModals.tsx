"use client";

import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBBtn,
} from "mdb-react-ui-kit";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  closeLoginModal,
  selectLoginModalOpen,
} from "@/features/auth/authSlice";

import LoginForm from "../Header/LoginForm";
import RegisterForm from "../Header/RegisterForm";

export default function GlobalModals() {
  const dispatch = useAppDispatch();
  const loginOpen = useAppSelector(selectLoginModalOpen);

  const [view, setView] = useState<"login" | "register">("login");

  if (!loginOpen) return null;

  const handleClose = () => {
    setView("login");
    dispatch(closeLoginModal());
  };

  return (
    <MDBModal open={true} setOpen={() => dispatch(closeLoginModal())}>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle className="text-dark">
              {view === "login" ? "Login" : "Criar conta"}
            </MDBModalTitle>

            <MDBBtn
              className="btn-close"
              color="none"
              onClick={handleClose}
            />
          </MDBModalHeader>

          <MDBModalBody>
            {view === "login" && (
              <LoginForm
                onClose={() => dispatch(closeLoginModal())}
                onCreateAccount={() => setView("register")} // 🔥 aqui resolve
                onForgotPassword={() => console.log("forgot")}
              />
            )}

            {view === "register" && (
              <RegisterForm onClose={() => dispatch(closeLoginModal())} />
            )}
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
}
