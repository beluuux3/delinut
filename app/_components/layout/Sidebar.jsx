"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
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
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import EditProfileModal from "./EditProfileModal";

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

export default function Sidebar({ isOpen = true, onClose, onToggle }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showEditModal, setShowEditModal] = useState(false);
  const [userName, setUserName] = useState("Admin");
  const [userEmail, setUserEmail] = useState("admin@delinut.com");
  const [initials, setInitials] = useState("A");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(Cookies.get("user") || "{}");
      const name = user.nombre_completo || "Admin";
      const email = user.email || "admin@delinut.com";
      const userInitials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

      setUserName(name);
      setUserEmail(email);
      setInitials(userInitials);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/");
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleNavigation = (href) => {
    router.push(href);
    if (window.innerWidth < 768 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out ${
          isOpen
            ? "w-64 translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-20"
        }`}
      >
        <div className="flex flex-col h-full bg-orange-50 border-r border-orange-100">
          {/* Header con logo y botón toggle */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-orange-200 bg-white">
            {isOpen ? (
              <>
                <Image
                  src="/LogoDelinut.png"
                  alt="Delinut"
                  width={120}
                  height={40}
                  style={{ width: "auto", height: "auto" }}
                  className="object-contain"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  className="hidden md:flex hover:bg-orange-50"
                >
                  <X className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="hidden md:flex hover:bg-orange-50 mx-auto"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <button
              onClick={() => handleNavigation("/")}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-100 transition-colors mb-3 border-b border-orange-200 pb-4",
                isOpen ? "px-4 py-3" : "px-2 py-3 justify-center"
              )}
              title={!isOpen ? "Regresar al Inicio" : ""}
            >
              <ArrowLeft className="w-5 h-5 shrink-0" />
              {isOpen && <span>Regresar al Inicio</span>}
            </button>

            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors",
                    isOpen ? "px-4 py-3" : "px-2 py-3 justify-center",
                    isActive
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "text-gray-700 hover:bg-orange-100"
                  )}
                  title={!isOpen ? item.name : ""}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {isOpen && <span>{item.name}</span>}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-orange-200 space-y-3">
            <div
              className={cn(
                "flex items-center gap-3",
                isOpen ? "px-2" : "justify-center"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                <span className="text-white font-semibold text-sm">
                  {initials}
                </span>
              </div>
              {isOpen && (
                <>
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
                </>
              )}
            </div>

            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors",
                isOpen ? "px-4 py-2.5" : "px-2 py-2.5 justify-center"
              )}
              title={!isOpen ? "Cerrar Sesión" : ""}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {isOpen && <span>Cerrar Sesión</span>}
            </button>
          </div>
        </div>
        {showEditModal && (
          <EditProfileModal onClose={() => setShowEditModal(false)} />
        )}
      </div>
    </>
  );
}
