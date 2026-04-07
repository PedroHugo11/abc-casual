"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="p-3">
      <h5 className="mb-4 fw-bold">Admin</h5>

      <MDBListGroup flush>
        <Link href="/admin">
          <MDBListGroupItem
            active={pathname === "/admin"}
            className="border-0"
          >
            Dashboard
          </MDBListGroupItem>
        </Link>

        <Link href="/admin/orders">
          <MDBListGroupItem
            active={pathname.startsWith("/admin/orders")}
            className="border-0"
          >
            Pedidos
          </MDBListGroupItem>
        </Link>

        <Link href="/admin/products">
          <MDBListGroupItem
            active={pathname.startsWith("/admin/products")}
            className="border-0"
          >
            Produtos
          </MDBListGroupItem>
        </Link>
      </MDBListGroup>
    </nav>
  );
}