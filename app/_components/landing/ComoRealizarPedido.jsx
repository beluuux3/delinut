"use client";

import { useState, useEffect } from "react";
import { Phone, Clock, MapPin } from "lucide-react";
import Image from "next/image";

export default function ComoRealizarPedido() {
  const [zonas, setZonas] = useState([]);

  useEffect(() => {
    fetchZonas();
  }, []);

  const fetchZonas = async () => {
    try {
      const response = await fetch(
        "https://backend-solandre.onrender.com/catalogo/zonas"
      );
      if (response.ok) {
        const data = await response.json();
        setZonas(data);
      }
    } catch (error) {
      console.error("Error al cargar zonas:", error);
      // Fallback a zonas por defecto si falla
      setZonas([
        { nombre_zona: "AV. ARCE" },
        { nombre_zona: "6 DE AGOSTO" },
        { nombre_zona: "PRADO" },
        { nombre_zona: "CAMACHO" },
      ]);
    }
  };

  const incluye = [
    { icon: "🍽️", text: "SEGUNDO" },
    { icon: "🍰", text: "POSTRE" },
    { icon: "🥤", text: "REFRESCO" },
    { icon: "🥗", text: "LLAJUA" },
    { icon: "♻️", text: "BOLSA ECOLÓGICA" },
  ];

  return (
    <section className="py-16 bg-linear-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ¿CÓMO REALIZAR TU PEDIDO?
          </h2>
          <p className="text-xl text-gray-700 font-semibold">
            En Delinut te ofrecemos bienestar y sabor
          </p>
          <p className="text-lg text-gray-600 mt-2">Y dietas personalizadas</p>
        </div>

        {/* Tarjetas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* WhatsApp Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-500">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-500 rounded-full p-4 mb-4">
                <Phone className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                ESCRIBE POR NUESTRO MENÚ
              </h3>
              <p className="text-sm text-gray-600 mb-2">AL</p>
              <a
                href="https://wa.me/59178773302"
                target="_blank"
                rel="noopener noreferrer"
                className="text-3xl font-bold text-green-600 hover:text-green-700 transition-colors"
              >
                78773302
              </a>
              <p className="text-sm text-gray-600 mt-3">
                Y haz tu pedido para el día o toda la semana si gustas
              </p>
            </div>
          </div>

          {/* Horario Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-500">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-500 rounded-full p-4 mb-4">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                SE REGISTRAN PEDIDOS HASTA LAS 11 AM
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Y tu pedido llegará máximo a las
              </p>
              <p className="text-4xl font-bold text-blue-600">12:30 PM</p>
            </div>
          </div>

          {/* Zonas Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-500">
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-500 rounded-full p-4 mb-4">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                HACEMOS DELIVERY EN ESTAS ZONAS O CERCANAS A ELLAS:
              </h3>
              <div className="space-y-2">
                {zonas.map((zona, index) => (
                  <div
                    key={index}
                    className="text-sm font-semibold text-gray-700"
                  >
                    {zona.nombre_zona}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tu pedido incluye */}
        <div className="bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 shadow-xl">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            TU PEDIDO INCLUYE
          </h3>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Items Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {incluye.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white transition-colors shadow-md"
                  >
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-gray-900 font-bold text-xs">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Imagen del plato */}
            <div className="relative w-56 h-56 shrink-0">
              <Image
                src="/plato3.jpg"
                alt="Plato de comida"
                fill
                sizes="224px"
                className="rounded-full object-cover shadow-2xl border-4 border-white"
              />
            </div>

            {/* Ubicación */}
            <div className="bg-white rounded-xl p-6 shadow-lg shrink-0">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">LA PAZ</p>
                <p className="text-xl text-gray-600">BOLIVIA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
