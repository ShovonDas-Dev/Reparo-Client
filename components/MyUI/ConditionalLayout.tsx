"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "../Navbar/navbar";
import Footer from "../Footer/footer";

const hideLayoutRoutes = [
  "/dashboard/admin",
  "/dashboard/customer",
  "/dashboard/technician",
];

function LayoutGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideLayout = hideLayoutRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  return (
    <>
      {!hideLayout && <Navbar />}

      {children}

      {!hideLayout && <Footer />}
    </>
  );
}

export default function ConditionalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <LayoutGate>{children}</LayoutGate>
    </Suspense>
  );
}
