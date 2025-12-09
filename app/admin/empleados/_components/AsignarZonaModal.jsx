"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AsignarZonaModal({
  isOpen,
  onClose,
  onSubmit,
  zonaData,
  setZonaData,
  zonas,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Asignar Zona</DialogTitle>
          <DialogDescription className="text-gray-600">
            Asigna una zona de reparto al delivery
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="zona-select" className="text-gray-600">
                Zona de Reparto
              </Label>
              <Select
                value={
                  zonaData.zona_reparto_id
                    ? String(zonaData.zona_reparto_id)
                    : ""
                }
                onValueChange={(value) =>
                  setZonaData({
                    zona_reparto_id: value ? parseInt(value) : null,
                  })
                }
              >
                <SelectTrigger className="text-gray-700">
                  <SelectValue placeholder="Seleccionar zona" />
                </SelectTrigger>
                <SelectContent>
                  {zonas.map((zona) => (
                    <SelectItem
                      key={zona.zona_reparto_id}
                      value={String(zona.zona_reparto_id)}
                    >
                      {zona.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              Asignar Zona
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
