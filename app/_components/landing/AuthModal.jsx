"use client";

import { useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useAuth } from "@/lib/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    nombre_completo: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://backend-solandre.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Guardar token y datos del usuario en cookies
        Cookies.set("token", data.access_token, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        Cookies.set(
          "user",
          JSON.stringify({
            usuario_id: data.usuario_id,
            rol_id: data.rol_id,
            nombre_completo: data.nombre_completo,
            email: data.email,
          }),
          {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          }
        );

        login(
          {
            usuario_id: data.usuario_id,
            rol_id: data.rol_id,
            nombre_completo: data.nombre_completo,
            email: data.email,
          },
          data.access_token
        );

        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        });

        // Cerrar modal
        onClose();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description:
            errorData.detail || "Credenciales incorrectas. Intenta nuevamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo conectar con el servidor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://backend-solandre.onrender.com/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre_completo: registerData.nombre_completo,
            email: registerData.email,
            telefono: registerData.telefono,
            password: registerData.password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        toast({
          title: "¡Registro exitoso!",
          description: "Por favor inicia sesión con tu nueva cuenta.",
        });

        // Limpiar formulario de registro
        setRegisterData({
          nombre_completo: "",
          email: "",
          telefono: "",
          password: "",
          confirmPassword: "",
        });

        // Cambiar a la vista de login
        setIsLogin(true);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.detail || "No se pudo crear la cuenta.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo conectar con el servidor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex overflow-hidden rounded-lg bg-white">
      {/* Left Side - Welcome Message with Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={isLogin ? "/plato1.jpg" : "/plato2.jpg"}
            alt="Delicious Food"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-orange-500/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            {isLogin ? "¡Hola, Amigo!" : "¡Bienvenido!"}
          </h3>
          <p className="text-lg mb-8 opacity-90">
            {isLogin
              ? "Regístrate con tus datos personales para usar todas las funciones del sitio"
              : "Ingresa tus datos personales para comenzar tu viaje con nosotros"}
          </p>
          <Button
            variant="outline"
            onClick={() => setIsLogin(!isLogin)}
            className="border-2 border-white text-white hover:bg-white hover:text-orange-500 font-semibold px-8"
          >
            {isLogin ? "REGISTRARSE" : "INICIAR SESIÓN"}
          </Button>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 p-8 order-first lg:order-last">
        <div className="flex items-center justify-center mb-6">
          <Image
            src="/LogoDelinut.png"
            alt="Delinut Logo"
            width={120}
            height={60}
            className="object-contain"
          />
        </div>

        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </h2>
          <p className="text-gray-600 mt-1 text-sm">
            {isLogin ? "Bienvenido de nuevo" : "Únete a Delinut hoy"}
          </p>
        </div>

        {isLogin ? (
          // Login Form
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-1">
              <Label
                htmlFor="login-email"
                className="text-sm font-medium text-gray-900"
              >
                Email
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="tu@email.com"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
                className="w-full h-9 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="login-password"
                className="text-sm font-medium text-gray-900"
              >
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  required
                  className="w-full pr-10 h-9 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 h-10 mt-4"
            >
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </form>
        ) : (
          // Register Form
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="space-y-1">
              <Label
                htmlFor="register-nombre"
                className="text-sm font-medium text-gray-900"
              >
                Nombre Completo
              </Label>
              <Input
                id="register-nombre"
                type="text"
                placeholder="Juan Pérez"
                value={registerData.nombre_completo}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    nombre_completo: e.target.value,
                  })
                }
                required
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="register-email"
                className="text-sm font-medium text-gray-900"
              >
                Email
              </Label>
              <Input
                id="register-email"
                type="email"
                placeholder="tu@email.com"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                required
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="register-telefono"
                className="text-sm font-medium text-gray-900"
              >
                Teléfono
              </Label>
              <Input
                id="register-telefono"
                type="tel"
                placeholder="78773302"
                value={registerData.telefono}
                onChange={(e) =>
                  setRegisterData({ ...registerData, telefono: e.target.value })
                }
                required
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="register-password"
                className="text-sm font-medium text-gray-900"
              >
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  required
                  className="pr-10 h-9 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="register-confirm"
                className="text-sm font-medium text-gray-900"
              >
                Confirmar Contraseña
              </Label>
              <Input
                id="register-confirm"
                type="password"
                placeholder="••••••••"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value,
                  })
                }
                required
                className="h-9 text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 h-10 mt-4"
            >
              {loading ? "Creando cuenta..." : "Registrarse"}
            </Button>
          </form>
        )}

        {/* Toggle between login and register */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
