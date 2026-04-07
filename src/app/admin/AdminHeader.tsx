"use client";

import { MDBBtn } from "mdb-react-ui-kit";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/features/auth/authSlice";

export default function AdminHeader() {
  const dispatch = useAppDispatch();

  return (
    <header className="admin-header d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
      <h5 className="mb-0 fw-bold">Painel Administrativo</h5>

      <MDBBtn size="sm" color="dark" onClick={() => dispatch(logout())}>
        Sair
      </MDBBtn>
    </header>
  );
}