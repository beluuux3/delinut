"use client";

import Header from "@/app/_components/landing/Header";
import Footer from "@/app/_components/landing/Footer";

export default function ClientLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16">{children}</main>
      <Footer />
    </div>
  );
}
