"use client";

import Image from "next/image";
import { Heart, Clock, Truck, Shield } from "lucide-react";

export default function SobreNosotros() {
  const features = [
    {
      icon: Heart,
      title: "Comida Saludable",
      description:
        "Ingredientes frescos y nutritivos seleccionados cuidadosamente para tu bienestar",
    },
    {
      icon: Clock,
      title: "Puntualidad",
      description:
        "Entregamos tu almuerzo a tiempo, todos los días de la semana",
    },
    {
      icon: Truck,
      title: "Delivery Gratuito",
      description:
        "Servicio de entrega sin costo adicional en zonas de cobertura",
    },
    {
      icon: Shield,
      title: "Calidad Garantizada",
      description:
        "Cumplimos con todos los estándares de higiene y calidad alimentaria",
    },
  ];

  return (
    <section id="nosotros" className="py-16 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sobre Nosotros
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className="relative">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/plato4.jpg"
                alt="Delinut - Almuerzos Saludables"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-delinut-yellow rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-delinut-green rounded-full opacity-20 blur-xl"></div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Alimentos Saludables a Tu Puerta
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Somos una empresa boliviana dedicada a ofrecer almuerzos
              nutritivos y deliciosos, preparados con ingredientes frescos y de
              la más alta calidad. Nuestro compromiso es brindarte una
              experiencia culinaria excepcional que cuide de tu salud y
              bienestar.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cada día diseñamos menús variados que combinan sabor, nutrición y
              frescura. Trabajamos con los mejores proveedores locales para
              garantizar que cada plato llegue a tu mesa con el máximo cuidado y
              amor.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
                  <Icon className="text-white" size={32} />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
