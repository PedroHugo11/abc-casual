"use client";

import RequireRole from "@/features/auth/RequireRole";

import Sidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole role="admin">
      <main className="admin-layout d-flex">
        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          <Sidebar />
        </aside>

        {/* CONTENT */}
        <section className="admin-content flex-grow-1">
          <AdminHeader />

          <div className="admin-page p-4">
            {children}
          </div>
        </section>
      </main>
    </RequireRole>
  );
}