"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import {
  Menu,
  Home,
  Users,
  UtensilsCrossed,
  UserCheck,
  ShoppingBag,
  Package,
  FileBarChart,
  LogOut,
  Edit2,
  ChefHat,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  { id: "inicio", name: "Inicio", icon: Home, href: "/admin/inicio" },
  { id: "empleados", name: "Empleados", icon: Users, href: "/admin/empleados" },
  { id: "platos", name: "Platos", icon: ChefHat, href: "/admin/platos" },
  { id: "menu", name: "Menú", icon: UtensilsCrossed, href: "/admin/menu" },
  {
    id: "clientes",
    name: "Clientes",
    icon: UserCheck,
    href: "/admin/clientes",
  },
  { id: "pedidos", name: "Pedidos", icon: ShoppingBag, href: "/admin/pedidos" },
  {
    id: "inventario",
    name: "Inventario",
    icon: Package,
    href: "/admin/inventario",
  },
  {
    id: "reportes",
    name: "Reportes",
    icon: FileBarChart,
    href: "/admin/reportes",
  },
];

export default function MobileNav({ onEditProfile }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(Cookies.get("user") || "{}")
      : {};
  const userName = user.nombre_completo || "Admin";
  const userEmail = user.email || "admin@delinut.com";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const handleNavClick = (href) => {
    router.push(href);
    setIsOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/");
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  return (
    <div className="md:hidden sticky top-0 z-40 bg-orange-50 border-b border-orange-100">
      <div className="flex items-center justify-between px-4 py-3">
        <Image
          src="/LogoDelinut.png"
          alt="Delinut"
          width={100}
          height={30}
          style={{ width: "auto", height: "auto" }}
          className="object-contain"
        />

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-orange-50">
            <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
            <SheetDescription className="sr-only">
              Menú principal para navegar entre las diferentes secciones del
              panel de administración
            </SheetDescription>
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 px-6 py-6 border-b border-orange-200 bg-white">
                <Image
                  src="/LogoDelinut.png"
                  alt="Delinut"
                  width={120}
                  height={40}
                  style={{ width: "auto", height: "auto" }}
                  className="object-contain"
                />
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1">
                <button
                  onClick={() => {
                    router.push("/");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-100 transition-colors mb-3 border-b border-orange-200 pb-4"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Regresar al Inicio
                </button>

                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.href)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-orange-500 text-white hover:bg-orange-600"
                          : "text-gray-700 hover:bg-orange-100"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-orange-200 space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {initials}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {userEmail}
                    </p>
                  </div>
                  <button
                    onClick={handleEditProfile}
                    className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                    title="Editar perfil"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
