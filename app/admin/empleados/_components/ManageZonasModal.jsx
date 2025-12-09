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
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ManageZonasModal({
  isOpen,
  onClose,
  zonas,
  onRefreshZonas,
}) {
  const [loadingId, setLoadingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const { fetchData } = useFetch();
  const { toast } = useToast();

  const handleDelete = async (zonaId) => {
    setLoadingId(zonaId);

    const result = await fetchData(`/admin/zonas/${zonaId}`, "DELETE");

    if (result.success) {
      toast({
        title: "Éxito",
        description: "Zona eliminada correctamente",
      });
      await onRefreshZonas();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          result.error ||
          "No se pudo eliminar la zona. Asegúrate de que no tenga empleados ni pedidos asignados.",
      });
    }
    setLoadingId(null);
    setDeleteConfirmId(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Gestionar Zonas</DialogTitle>
          <DialogDescription>
            Administra las zonas de reparto disponibles.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[300px] pr-4 mt-4">
          <div className="space-y-3">
            {zonas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No hay zonas registradas.
              </p>
            ) : (
              zonas.map((zona) => (
                <div
                  key={zona.zona_id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <span className="font-medium text-gray-700">
                    {zona.nombre_zona}
                  </span>

                  {deleteConfirmId === zona.zona_id ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirmId(null)}
                        className="h-8 px-2 text-gray-500"
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(zona.zona_id)}
                        disabled={loadingId === zona.zona_id}
                        className="h-8 px-2"
                      >
                        {loadingId === zona.zona_id ? "..." : "Confirmar"}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteConfirmId(zona.zona_id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
