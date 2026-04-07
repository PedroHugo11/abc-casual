"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/features/auth/authSlice";
import {
  MDBCard,
  MDBCardBody,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import { useAppDispatch } from "@/store/hooks";

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="col-md-3">
      <MDBCard className="mb-4">
        <MDBCardBody>

          <nav>
            <MDBListGroup flush className="account-menu">

              <MDBListGroupItem className="p-0 border-0">
                <Link
                  href="/account/orders"
                  className={`menu-item d-block ${
                    isActive("/account/orders") ? "active" : ""
                  }`}
                >
                  Pedidos
                </Link>
              </MDBListGroupItem>

              <MDBListGroupItem className="p-0 border-0">
                <Link
                  href="/account/profile"
                  className={`menu-item d-block ${
                    isActive("/account/profile") ? "active" : ""
                  }`}
                >
                  Seus dados
                </Link>
              </MDBListGroupItem>

              <MDBListGroupItem className="p-0 border-0">
                <Link
                  href="/account/addresses"
                  className={`menu-item d-block ${
                    isActive("/account/addresses") ? "active" : ""
                  }`}
                >
                  Endereços
                </Link>
              </MDBListGroupItem>

              <MDBListGroupItem className="p-0 border-0">
                <button onClick={() => dispatch(logout())} className="menu-item logout w-100 text-start border-0 bg-transparent">
                  Sair
                </button>
              </MDBListGroupItem>

            </MDBListGroup>
          </nav>

        </MDBCardBody>
      </MDBCard>
    </aside>
  );
}