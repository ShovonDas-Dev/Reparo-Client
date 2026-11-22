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
  "/sign-in",
  "/sign-up"
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

      {/* The footer is hidden when the page contains data-not-found (the 404 page) */}
      {!hideLayout && (
        <div className="[body:has([data-not-found])_&]:hidden">
          <Footer />
        </div>
      )}
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