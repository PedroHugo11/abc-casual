"use client";

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useHydrated } from "@/store/useHydrated";

type Props = {
  children: React.ReactNode;
  role: "admin" | "customer";
};

export default function RequireRole({ children, role }: Props) {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const hydrated = useHydrated();

  useEffect(() => {
    if (!hydrated) return;

    if (!user || user.role !== role) {
      router.push("/");
    }
  }, [user, role, hydrated, router]);

  if (!hydrated) return null;
  if (!user || user.role !== role) return null;

  return <>{children}</>;
}