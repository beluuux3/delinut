"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    title: "Almuerzos Saludables",
    subtitle: "Directo a tu puerta",
    description:
      "Ofrecemos almuerzos nutritivos con ingredientes frescos y de calidad",
    bgColor: "bg-orange-500",
    image: "/plato1.jpg",
  },
  {
    id: 2,
    title: "Menú Variado",
    subtitle: "Cada día algo diferente",
    description: "Disfruta de una gran variedad de platos preparados con amor",
    bgColor: "bg-green-600",
    image: "/plato4.jpg",
  },
  {
    id: 3,
    title: "Entrega Rápida",
    subtitle: "En La Paz - Bolivia",
    description: "Recibe tu almuerzo caliente y a tiempo, contacto: 78773302",
    bgColor: "bg-yellow-500",
    image: "/plato3.jpg",
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      id="inicio"
      className="relative h-[600px] md:h-[500px] overflow-hidden"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Imagen de fondo */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Overlay oscuro */}
            <div className="absolute inset-0 bg-black/70"></div>
          </div>

          {/* Contenido */}
          <div className="relative w-full h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl">
                {/* Contenido de texto */}
                <div className="space-y-6 animate-fade-in">
                  <h1
                    className="text-5xl md:text-6xl font-bold leading-tight !text-white"
                    style={{
                      color: "#ffffff",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    }}
                  >
                    {slide.title}
                  </h1>
                  <h2
                    className="text-2xl md:text-3xl font-semibold !text-white"
                    style={{
                      color: "#ffffff",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    }}
                  >
                    {slide.subtitle}
                  </h2>
                  <p
                    className="text-lg md:text-xl !text-white"
                    style={{
                      color: "#ffffff",
                      textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
                    }}
                  >
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                      onClick={() =>
                        document
                          .getElementById("menu")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Ver Menú
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold"
                      onClick={() =>
                        document
                          .getElementById("contacto")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Contáctanos
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controles de navegación */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm p-3 rounded-full transition-all"
      >
        <ChevronLeft className="text-white" size={28} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm p-3 rounded-full transition-all"
      >
        <ChevronRight className="text-white" size={28} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
