"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

export default function MenuFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  platos,
  isEdit = false,
}) {
  const principales = platos.filter((p) => p.tipo === "Principal");
  const bebidas = platos.filter((p) => p.tipo === "Bebida");
  const postres = platos.filter((p) => p.tipo === "Postre");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {isEdit ? "Editar Menú del Día" : "Crear Nuevo Menú"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Configura el menú del día seleccionando los platos disponibles
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha" className="text-gray-600">
                  Fecha del Menú
                </Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha: e.target.value })
                  }
                  className="text-gray-700"
                  disabled={isEdit}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio_menu" className="text-gray-600">
                  Precio del Menú (Bs.)
                </Label>
                <Input
                  id="precio_menu"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.precio_menu || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      precio_menu: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="35.00"
                  className="text-gray-700"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plato_principal" className="text-gray-600">
                  Plato Principal
                </Label>
                <Select
                  value={
                    formData.plato_principal_id
                      ? String(formData.plato_principal_id)
                      : ""
                  }
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      plato_principal_id: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger className="text-gray-700">
                    <SelectValue placeholder="Seleccionar plato principal" />
                  </SelectTrigger>
                  <SelectContent>
                    {principales.map((plato) => (
                      <SelectItem
                        key={plato.plato_id}
                        value={String(plato.plato_id)}
                      >
                        {plato.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bebida" className="text-gray-600">
                  Bebida (Opcional)
                </Label>
                <Select
                  value={
                    formData.bebida_id ? String(formData.bebida_id) : "none"
                  }
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      bebida_id: value === "none" ? null : parseInt(value),
                    });
                  }}
                >
                  <SelectTrigger className="text-gray-700">
                    <SelectValue placeholder="Seleccionar bebida (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin bebida</SelectItem>
                    {bebidas.map((plato) => (
                      <SelectItem
                        key={plato.plato_id}
                        value={String(plato.plato_id)}
                      >
                        {plato.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postre" className="text-gray-600">
                  Postre (Opcional)
                </Label>
                <Select
                  value={
                    formData.postre_id ? String(formData.postre_id) : "none"
                  }
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      postre_id: value === "none" ? null : parseInt(value),
                    });
                  }}
                >
                  <SelectTrigger className="text-gray-700">
                    <SelectValue placeholder="Seleccionar postre (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin postre</SelectItem>
                    {postres.map((plato) => (
                      <SelectItem
                        key={plato.plato_id}
                        value={String(plato.plato_id)}
                      >
                        {plato.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cantidad_disponible" className="text-gray-600">
                  Cantidad Disponible
                </Label>
                <Input
                  id="cantidad_disponible"
                  type="number"
                  min="1"
                  value={formData.cantidad_disponible || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cantidad_disponible: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="50"
                  className="text-gray-700"
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="info_nutricional" className="text-gray-600">
                  Información Nutricional (opcional)
                </Label>
                <Textarea
                  id="info_nutricional"
                  value={formData.info_nutricional || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      info_nutricional: e.target.value,
                    })
                  }
                  placeholder="Calorías, proteínas, carbohidratos..."
                  className="text-gray-700 min-h-20"
                />
              </div>
              <div className="col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <Label
                    htmlFor="publicado"
                    className="text-gray-900 font-medium"
                  >
                    Publicar Menú
                  </Label>
                  <p className="text-xs text-gray-600">
                    El menú será visible en la landing page
                  </p>
                </div>
                <Switch
                  id="publicado"
                  checked={formData.publicado || false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, publicado: checked })
                  }
                />
              </div>
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
              {isEdit ? "Guardar Cambios" : "Crear Menú"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
