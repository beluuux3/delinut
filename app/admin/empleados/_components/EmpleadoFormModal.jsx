"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateZonaModal from "./CreateZonaModal";
import ManageZonasModal from "./ManageZonasModal";

export default function EmpleadoFormModal({
  // Force re-compile
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  zonas,
  onRefreshZonas,
  onAddZona,
  isEdit = false,
}) {
  const [showCreateZona, setShowCreateZona] = useState(false);
  const [showManageZonas, setShowManageZonas] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!email) {
      setEmailError("");
      return true;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Por favor ingrese un correo electrónico válido");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setFormData({ ...formData, email: newEmail });
    if (newEmail) {
      validateEmail(newEmail);
    } else {
      setEmailError("");
    }
  };

  const handleZonaCreated = async (newZona) => {
    // Agregar la zona inmediatamente al estado
    if (onAddZona) {
      onAddZona(newZona);
    }
    // Refrescar para obtener datos actualizados del servidor
    await onRefreshZonas();
    // Seleccionar la zona recién creada
    setFormData({
      ...formData,
      zona_reparto_id: newZona.zona_id,
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {isEdit ? "Editar Empleado" : "Crear Nuevo Empleado"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {isEdit ? "Modifica la información del empleado" : ""}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={onSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="py-4 overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_completo" className="text-gray-600">
                  Nombre Completo
                </Label>
                <Input
                  id="nombre_completo"
                  value={formData.nombre_completo || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre_completo: e.target.value,
                    })
                  }
                  placeholder="Juan Pérez"
                  className="text-gray-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-600">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleEmailChange}
                  placeholder="ejemplo@correo.com"
                  className={`text-gray-700 ${
                    emailError ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  required
                />
                {emailError && (
                  <p className="text-xs text-red-600 mt-1">{emailError}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-gray-600">
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  value={formData.telefono || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  placeholder="77777777"
                  className="text-gray-700"
                  required
                />
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-600">
                    Contraseña (Requerido para actualizar)
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Ingrese contraseña"
                      className="text-gray-700 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rol" className="text-gray-600">
                  Rol
                </Label>
                <Select
                  value={String(formData.rol_id)}
                  onValueChange={(value) =>
                    setFormData({ ...formData, rol_id: parseInt(value) })
                  }
                >
                  <SelectTrigger className="text-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Admin</SelectItem>
                    <SelectItem value="2">Cocina</SelectItem>
                    <SelectItem value="3">Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.rol_id === 3 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="zona" className="text-gray-600">
                      Zona de Reparto
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowManageZonas(true)}
                        className="h-7 text-xs"
                      >
                        Gestionar
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCreateZona(true)}
                        className="h-7 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Nueva
                      </Button>
                    </div>
                  </div>
                  <Select
                    value={
                      formData.zona_reparto_id
                        ? String(formData.zona_reparto_id)
                        : ""
                    }
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        zona_reparto_id: value ? parseInt(value) : null,
                      })
                    }
                  >
                    <SelectTrigger className="text-gray-700">
                      <SelectValue placeholder="Seleccionar zona (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {zonas.map((zona) => (
                        <SelectItem
                          key={zona.zona_id}
                          value={String(zona.zona_id)}
                        >
                          {zona.nombre_zona}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isEdit ? "Guardar Cambios" : "Crear Empleado"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <CreateZonaModal
        isOpen={showCreateZona}
        onClose={() => setShowCreateZona(false)}
        onZonaCreated={handleZonaCreated}
      />
      <ManageZonasModal
        isOpen={showManageZonas}
        onClose={() => setShowManageZonas(false)}
        zonas={zonas}
        onRefreshZonas={onRefreshZonas}
      />
    </Dialog>
  );
}
