"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import AdminLayoutWrapper from "./_components/layout/AdminLayoutWrapper";
import { Toaster } from "@/components/ui/toaster";

export default function AdminRootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // No verificar token en la página de login
    if (pathname === "/admin/login") {
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
    }
  }, [router, pathname]);

  // Si estamos en login, renderizar sin el layout de admin
  if (pathname === "/admin/login") {
    return (
      <>
        {children}
        <Toaster />
      </>
    );
  }

  return (
    <>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
      <Toaster />
    </>
  );
}
