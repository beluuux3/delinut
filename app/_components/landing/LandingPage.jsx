"use client";

import Header from "./Header";
import HeroCarousel from "./HeroCarousel";
import MenuSemanal from "./MenuSemanal";

import SobreNosotros from "./SobreNosotros";
import Contacto from "./Contacto";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <HeroCarousel />
        <MenuSemanal />

        <SobreNosotros />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}
