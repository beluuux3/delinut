"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function IngredienteFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEdit,
  isViewMode,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isViewMode
              ? "Ver Ingrediente"
              : isEdit
              ? "Editar Ingrediente"
              : "Crear Nuevo Ingrediente"}
          </DialogTitle>
          <DialogDescription>
            {isViewMode
              ? "Detalles del ingrediente"
              : "Completa los datos del ingrediente"}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={onSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="space-y-4 py-4 overflow-y-auto px-1">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Ingrediente</Label>
              <Input
                id="nombre"
                value={formData.nombre || ""}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Ej: Arroz"
                disabled={isViewMode}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock_actual">Stock Actual</Label>
              <Input
                id="stock_actual"
                type="number"
                step="0.01"
                value={formData.stock_actual || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock_actual: parseFloat(e.target.value),
                  })
                }
                placeholder="Ej: 50.00"
                disabled={isViewMode}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {isViewMode ? "Cerrar" : "Cancelar"}
            </Button>
            {!isViewMode && (
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isEdit ? "Guardar Cambios" : "Crear Ingrediente"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
