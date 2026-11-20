"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import Footer from "../Footer/footer";

const hideNavbarRoutes = [
  "/dashboard/admin",
  "/dashboard/customer",
  "/dashboard/technician",
];

function NavbarGate() {
  const pathname = usePathname();

  const hideNavbar = hideNavbarRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (hideNavbar) return null;

  return <Navbar />;
}

export default function ConditionalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <NavbarGate />
      </Suspense>
      {children}
      <Footer />
    </>
  );
}
