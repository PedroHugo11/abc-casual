"use client";

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHydrated } from "@/store/useHydrated";
import RequireRole from "@/features/auth/RequireRole";

import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export default function AccountLayout({ children }: any) {
  return (
    <RequireRole role="customer">
      <Header />
      <main>{children}</main>
      <Footer />
    </RequireRole>
  );
}