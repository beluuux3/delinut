"use client";

import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Contacto() {
  // WhatsApp directo
  const handleWhatsAppClick = () => {
    const phoneNumber = "59178773302";
    const message = encodeURIComponent(
      "¡Hola! Me gustaría obtener más información sobre los almuerzos de Delinut."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  // Información de contacto agrupada
  const contactInfo = [
    {
      icon: Phone,
      title: "Teléfono",
      content: (
        <a
          href="tel:78773302"
          className="hover:underline text-orange-700 font-semibold"
        >
          78773302
        </a>
      ),
    },
    {
      icon: MapPin,
      title: "Ubicación",
      content: <span>La Paz, Bolivia</span>,
    },
    {
      icon: Clock,
      title: "Horario",
      content: <span>Lun a Vie: 11:00 - 14:00</span>,
    },
  ];

  return (
    <section
      id="contacto"
      className="py-16 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Contáctanos</h2>
          <p className="text-lg text-gray-600">
            ¿Tienes preguntas o quieres pedir? ¡Estamos para ayudarte!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Información de contacto */}
          <div className="space-y-6">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm"
                >
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Icon className="text-orange-600" size={28} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {info.title}
                    </h4>
                    <div className="text-gray-700 text-base">
                      {info.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* WhatsApp CTA */}
          <div className="flex flex-col justify-center items-center bg-green-600 text-white rounded-lg p-8 shadow-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <MessageCircle size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">WhatsApp Directo</h3>
                <p className="text-white/90">Respuesta inmediata</p>
              </div>
            </div>
            <p className="mb-6 text-white/90 text-center">
              Pregunta por menús, precios y zonas de entrega. ¡Te respondemos al
              instante!
            </p>
            <Button
              size="lg"
              onClick={handleWhatsAppClick}
              className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold"
            >
              <MessageCircle className="mr-2" size={20} />
              Abrir WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
