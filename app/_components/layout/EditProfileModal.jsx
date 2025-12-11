"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EditProfileModal({ onClose }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState({
    nombre_completo: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) return null;

  const modalContent = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 999999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          position: "relative",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        {/* Header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            borderBottom: "1px solid #e5e7eb",
            borderRadius: "8px 8px 0 0",
            zIndex: 1,
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#111827",
              }}
            >
              Editar Perfil
            </h2>
            <button
              onClick={onClose}
              style={{
                padding: "8px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#f3f4f6")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <X style={{ width: "24px", height: "24px", color: "#4b5563" }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "24px" }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Información Personal */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                padding: "24px",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                Información Personal
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                }}
              >
                <div style={{ gridColumn: "1 / -1" }}>
                  <Label
                    htmlFor="nombre_completo"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Nombre Completo
                  </Label>
                  <Input
                    id="nombre_completo"
                    type="text"
                    value={userData.nombre_completo}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        nombre_completo: e.target.value,
                      })
                    }
                    required
                    style={{ height: "44px", fontSize: "16px" }}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    disabled
                    readOnly
                    style={{
                      height: "44px",
                      fontSize: "16px",
                      backgroundColor: "#f3f4f6",
                      cursor: "not-allowed",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginTop: "4px",
                    }}
                  >
                    El correo no se puede modificar
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="telefono"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    type="tel"
                    value={userData.telefono}
                    onChange={(e) =>
                      setUserData({ ...userData, telefono: e.target.value })
                    }
                    placeholder="78787878"
                    style={{ height: "44px", fontSize: "16px" }}
                  />
                </div>
              </div>
            </div>

            {/* Cambiar Contraseña */}
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                padding: "24px",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                Cambiar Contraseña
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "16px",
                }}
              >
                Deja estos campos vacíos si no deseas cambiar tu contraseña
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                }}
              >
                <div>
                  <Label
                    htmlFor="password"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
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
                    placeholder="••••••••"
                    autoComplete="new-password"
                    style={{ height: "44px", fontSize: "16px" }}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="confirmPassword"
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
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
                    placeholder="••••••••"
                    autoComplete="new-password"
                    style={{ height: "44px", fontSize: "16px" }}
                  />
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: "flex", gap: "12px", paddingTop: "16px" }}>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                style={{ flex: 1, height: "48px", fontSize: "16px" }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  height: "48px",
                  fontSize: "16px",
                  backgroundColor: "#f97316",
                }}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
