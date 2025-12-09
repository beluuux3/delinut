"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Package, DollarSign } from "lucide-react";

export default function HistorialModal({
  isOpen,
  onClose,
  historial,
  cliente,
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEstadoBadge = (estado) => {
    const variants = {
      Pendiente: "secondary",
      "En Preparación": "default",
      "En Camino": "default",
      Entregado: "success",
      Cancelado: "destructive",
    };
    return <Badge variant={variants[estado] || "default"}>{estado}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Historial de Pedidos - {cliente?.nombre}</DialogTitle>
          <DialogDescription>
            {cliente?.email} | {cliente?.telefono}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] pr-4">
          {historial && historial.length > 0 ? (
            <div className="space-y-4">
              {historial.map((pedido) => (
                <div
                  key={pedido.pedido_id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-gray-600">
                      Pedido #{pedido.pedido_id}
                    </span>
                    {getEstadoBadge(pedido.estado)}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {formatDate(pedido.fecha_pedido)}
                  </div>

                  {pedido.items && pedido.items.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Package className="h-4 w-4" />
                        Items del pedido:
                      </div>
                      <ul className="pl-6 space-y-1 text-sm text-gray-700">
                        {pedido.items.map((item, idx) => (
                          <li key={idx}>
                            {item.cantidad}x {item.nombre_plato}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {pedido.total && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-orange-600">
                      <DollarSign className="h-4 w-4" />
                      Total: ${pedido.total.toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay pedidos registrados para este cliente</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
