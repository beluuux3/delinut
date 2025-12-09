"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import LoginView from "../_components/layout/LoginView";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/admin/inicio");
    }
  }, [router]);

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password) => {
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
            email,
            password,
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

        toast({
          title: "Bienvenido",
          description: "Has iniciado sesión correctamente",
        });

        router.push("/admin/inicio");
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Error de acceso",
          description: error.detail || "Credenciales inválidas",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo conectar con el servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  return <LoginView onLogin={handleLogin} />;
}
