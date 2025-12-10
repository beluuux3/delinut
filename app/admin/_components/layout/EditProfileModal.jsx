"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EditProfileModal({ onClose }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    nombre_completo: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const user = JSON.parse(Cookies.get("user") || "{}");
    setUserData({
      nombre_completo: user.nombre_completo || "",
      email: user.email || "",
      telefono: user.telefono || "",
      password: "",
      confirmPassword: "",
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password && userData.password !== userData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const token = Cookies.get("token");
      const updateData = {
        nombre_completo: userData.nombre_completo,
        telefono: userData.telefono,
      };

      if (userData.password) {
        updateData.password = userData.password;
      }

      const response = await fetch(
        "https://backend-solandre.onrender.com/usuarios/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        const currentUser = JSON.parse(Cookies.get("user") || "{}");
        Cookies.set(
          "user",
          JSON.stringify({
            ...currentUser,
            nombre_completo: updatedUser.nombre_completo,
            email: updatedUser.email,
            telefono: updatedUser.telefono,
          }),
          {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          }
        );

        toast({
          title: "¡Éxito!",
          description: "Tu perfil ha sido actualizado correctamente.",
        });
        onClose();
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.detail || "No se pudo actualizar el perfil.",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label
              htmlFor="nombre_completo"
              className="text-gray-600 text-sm mb-1"
            >
              Nombre Completo
            </Label>
            <Input
              id="nombre_completo"
              type="text"
              value={userData.nombre_completo}
              onChange={(e) =>
                setUserData({ ...userData, nombre_completo: e.target.value })
              }
              className="h-9 text-sm border-gray-300 text-gray-700 focus:border-orange-500 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-600 text-sm mb-1">
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              value={userData.email}
              className="h-9 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">
              El correo no se puede modificar
            </p>
          </div>

          <div>
            <Label htmlFor="telefono" className="text-gray-600 text-sm mb-1">
              Teléfono
            </Label>
            <Input
              id="telefono"
              type="tel"
              value={userData.telefono}
              onChange={(e) =>
                setUserData({ ...userData, telefono: e.target.value })
              }
              className="h-9 text-sm border-gray-300 text-gray-700 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">
              Deja estos campos vacíos si no deseas cambiar tu contraseña
            </p>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="password"
                  className="text-gray-600 text-sm mb-1"
                >
                  Nueva Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  className="h-9 text-sm border-gray-300 text-gray-700 focus:border-orange-500 focus:ring-orange-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-600 text-sm mb-1"
                >
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={userData.confirmPassword}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="h-9 text-sm border-gray-300 text-gray-700 focus:border-orange-500 focus:ring-orange-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
