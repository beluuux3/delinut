"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateZonaModal({ isOpen, onClose, onZonaCreated }) {
  const [nombreZona, setNombreZona] = useState("");
  const [loading, setLoading] = useState(false);
  const { fetchData } = useFetch();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreZona.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre de la zona es requerido",
      });
      return;
    }

    setLoading(true);

    const result = await fetchData("/admin/zonas", "POST", {
      nombre_zona: nombreZona.trim(),
    });

    setLoading(false);

    if (result.success) {
      toast({
        title: "Éxito",
        description: "Zona creada correctamente",
      });
      // Llamar a onZonaCreated con la zona creada
      if (onZonaCreated) {
        await onZonaCreated(result.data);
      }
      setNombreZona("");
      onClose();
    } else {
      toast({
        variant: "destructive",
        title: "Error al crear zona",
        description:
          result.error ||
          "No se pudo crear la zona. Verifica que tengas permisos de administrador.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Crear Nueva Zona</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_zona" className="text-gray-600">
                Nombre de la Zona
              </Label>
              <Input
                id="nombre_zona"
                value={nombreZona}
                onChange={(e) => setNombreZona(e.target.value)}
                placeholder="Ej: Centro, Norte, Sur..."
                className="text-gray-700"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? "Creando..." : "Crear Zona"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
