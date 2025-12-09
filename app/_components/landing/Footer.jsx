"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, MessageCircle } from "lucide-react";
import { SiTiktok } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <Image
              src="/LogoDelinut.png"
              alt="Delinut Logo"
              width={150}
              height={75}
              className="object-contain mb-4 brightness-0 invert"
            />
            <p className="text-white mb-4">
              Ofrecemos almuerzos saludables, con un excelente sabor y directo a
              tu puerta.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/59178773302"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 p-2 rounded-full transition-colors"
                title="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@delinut_1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-gray-800 p-2 rounded-full transition-colors"
                title="TikTok"
              >
                <SiTiktok size={20} />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-delinut-yellow">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#inicio"
                  className="text-white hover:text-delinut-yellow transition-colors"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  className="text-white hover:text-delinut-yellow transition-colors"
                >
                  Menú
                </a>
              </li>
              <li>
                <a
                  href="#nosotros"
                  className="text-white hover:text-delinut-yellow transition-colors"
                >
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  className="text-white hover:text-delinut-yellow transition-colors"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4  text-white">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone size={20} className="text-delinut-green shrink-0 mt-1" />
                <div>
                  <a
                    href="tel:78773302"
                    className="text-white hover:text-delinut-green font-semibold"
                  >
                    78773302
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
