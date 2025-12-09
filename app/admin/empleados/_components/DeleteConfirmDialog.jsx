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

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  empleadoNombre,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            ¿Estás seguro de que deseas eliminar a{" "}
            <span className="font-semibold">{empleadoNombre}</span>? Esta acción
            no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
