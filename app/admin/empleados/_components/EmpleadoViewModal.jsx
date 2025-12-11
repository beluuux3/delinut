"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function EmpleadoViewModal({ isOpen, onClose, empleado }) {
  if (!empleado) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Detalles del Empleado
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-gray-600">Nombre Completo</Label>
            <p className="text-gray-900 font-medium">
              {empleado.nombre_completo}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600">Email</Label>
            <p className="text-gray-900">{empleado.email}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600">Teléfono</Label>
            <p className="text-gray-900">{empleado.telefono}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600">Rol</Label>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                empleado.rol_id === 1
                  ? "bg-purple-100 text-purple-800"
                  : empleado.rol_id === 2
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {empleado.rol_nombre}
            </span>
          </div>
          {empleado.rol_id === 3 && (
            <div className="space-y-2">
              <Label className="text-gray-600">Zona de Reparto</Label>
              <p className="text-gray-900">
                {empleado.zona_nombre || "Sin asignar"}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
