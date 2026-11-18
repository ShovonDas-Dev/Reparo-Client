"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import Footer from "../Footer/footer";

export default function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideNavbarRoutes = [
    "/dashboard/admin",
    "/dashboard/customer",
    "/dashboard/technician",
  ];

  const hideNavbar = hideNavbarRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(route + "/")
  );

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      {<Footer/>}
    </>
  );
}