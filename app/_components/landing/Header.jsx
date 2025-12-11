"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogIn, User, LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AuthModal from "./AuthModal";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    const userData = Cookies.get("user");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const getInitials = (nombre) => {
    if (!nombre) return "U";
    const words = nombre.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  const getRolePath = (rolId) => {
    const paths = {
      1: "/admin/inicio",
      2: "/cocina/inicio",
      3: "/delivery/inicio",
      4: "/cliente/inicio",
    };
    return paths[rolId] || "/admin/inicio";
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    router.push("/");
  };

  const handleAccount = () => {
    if (user?.rol_id) {
      router.push(getRolePath(user.rol_id));
    }
  };

  const navLinks = [
    { name: "Inicio", href: "#inicio" },
    { name: "Menú", href: "#menu" },
    { name: "Sobre Nosotros", href: "#nosotros" },
    { name: "Contacto", href: "#contacto" },
  ];

  return (
    <>
      <header className="fixed top-0 w-full bg-[#ffb341] shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="shrink-0">
              <Link href="/">
                <Image
                  src="/LogoDelinut.png"
                  alt="Delinut Logo"
                  width={100}
                  height={50}
                  style={{ width: "auto", height: "65px" }}
                  className="cursor-pointer"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-yellow-200 font-medium hover:bg-amber-600 px-5 py-2 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Auth Buttons / User Avatar */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 hover:bg-amber-600"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-white text-orange-600 font-bold">
                          {getInitials(user.nombre_completo || user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-white font-medium">
                        {user.nombre_completo || user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white">
                    <DropdownMenuItem onClick={handleAccount}>
                      <User className="mr-2 h-4 w-4" />
                      Cuenta
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-white text-orange-600 hover:bg-gray-100 font-semibold"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Acceder
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-yellow-200"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 bg-orange-500">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-white hover:text-yellow-200 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                  {user ? (
                    <>
                      <Button
                        onClick={() => {
                          handleAccount();
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-white text-orange-600 hover:bg-gray-100 font-semibold"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Cuenta
                      </Button>
                      <Button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsLoginOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-white text-orange-600 hover:bg-gray-100 font-semibold"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Acceder
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-4xl p-0">
          <VisuallyHidden>
            <DialogTitle>Autenticación</DialogTitle>
          </VisuallyHidden>
          <AuthModal
            onClose={() => {
              setIsLoginOpen(false);
              // Refresh user data after login
              const userData = Cookies.get("user");
              if (userData) {
                try {
                  setUser(JSON.parse(userData));
                } catch (e) {}
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
