"use client";

import { useState, useEffect } from "react";
import {
  ChefHat,
  CheckCircle,
  XCircle,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePedidos } from "../pedidos/_components/hooks/usePedidos";
import TrackingModal from "../pedidos/_components/TrackingModal";

const ESTADOS_COLORES = {
  "En Cocina": "bg-purple-100 text-purple-800",
  "Listo para Entrega": "bg-green-100 text-green-800",
  Cancelado: "bg-red-100 text-red-800",
};

export default function CocinaPage() {
  const { pedidos, cambiarEstado, cancelarPedido } = usePedidos();
  const [pedidosCocina, setPedidosCocina] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  useEffect(() => {
    // Filtrar solo pedidos en cocina y listos para entrega de la fecha seleccionada
    const pedidosDelDia = pedidos.filter((pedido) => {
      const fechaPedido = new Date(pedido.fecha_pedido)
        .toISOString()
        .split("T")[0];
      return (
        fechaPedido === fechaSeleccionada &&
        (pedido.estado === "En Cocina" ||
          pedido.estado === "Listo para Entrega")
      );
    });
    setPedidosCocina(pedidosDelDia);
  }, [pedidos, fechaSeleccionada]);

  const handleListoParaEntrega = async (pedidoId) => {
    await cambiarEstado(pedidoId, "Listo para Entrega");
  };

  const handleCancelar = async (pedidoId) => {
    if (confirm("¿Cancelar este pedido?")) {
      await cancelarPedido(pedidoId);
    }
  };

  const handleFechaChange = (e) => {
    setFechaSeleccionada(e.target.value);
  };

  const irHoy = () => {
    setFechaSeleccionada(new Date().toISOString().split("T")[0]);
  };

  const esHoy = fechaSeleccionada === new Date().toISOString().split("T")[0];

  const pedidosEnCocina = pedidosCocina.filter((p) => p.estado === "En Cocina");
  const pedidosListos = pedidosCocina.filter(
    (p) => p.estado === "Listo para Entrega"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-purple-600" />
            Cocina
          </h1>
          <p className="text-gray-600 mt-1">
            {new Date(fechaSeleccionada + "T00:00:00").toLocaleDateString(
              "es-ES",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <Input
              type="date"
              value={fechaSeleccionada}
              onChange={handleFechaChange}
              className="w-auto"
            />
          </div>
          {!esHoy && (
            <Button onClick={irHoy} variant="outline" size="sm">
              Ir a Hoy
            </Button>
          )}
          <div className="flex gap-2">
            <Badge className="text-lg px-4 py-2 bg-purple-500 text-white">
              {pedidosEnCocina.length} En Cocina
            </Badge>
            <Badge className="text-lg px-4 py-2 bg-green-500 text-white">
              {pedidosListos.length} Listos
            </Badge>
          </div>
        </div>
      </div>

      {/* Pedidos en Cocina */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">En Preparación</h2>
        {pedidosEnCocina.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ChefHat className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">
                No hay pedidos en cocina {esHoy ? "hoy" : "para esta fecha"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pedidosEnCocina.map((pedido) => (
              <Card
                key={pedido.pedido_id}
                className="hover:shadow-lg transition-shadow border-l-4 border-purple-500 cursor-pointer"
                onClick={() => {
                  setPedidoSeleccionado(pedido);
                  setIsTrackingOpen(true);
                }}
              >
                <div className="bg-purple-500 p-3">
                  <div className="flex items-center justify-between text-white">
                    <span className="font-bold text-xl">
                      #{pedido.pedido_id}
                    </span>
                    <Badge className={ESTADOS_COLORES[pedido.estado]}>
                      {pedido.estado}
                    </Badge>
                  </div>
                  <p className="text-white text-sm mt-1">
                    Cliente: {pedido.cliente_nombre || "Cliente"}
                  </p>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Detalles del Menú */}
                    {pedido.items && pedido.items.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-gray-900 border-b pb-1">
                          📋 PREPARAR:
                        </p>
                        {pedido.items.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <p className="font-semibold text-gray-900">
                              {item.cantidad}x{" "}
                              {item.nombre_plato || item.nombre}
                            </p>
                            {/* Plato Principal */}
                            {item.plato_principal && (
                              <div className="pl-4 text-sm">
                                <p className="text-gray-700">
                                  🍽️{" "}
                                  <span className="font-medium">
                                    Principal:
                                  </span>{" "}
                                  {item.plato_principal}
                                </p>
                              </div>
                            )}
                            {/* Bebida */}
                            {item.bebida && (
                              <div className="pl-4 text-sm">
                                <p className="text-gray-700">
                                  🥤{" "}
                                  <span className="font-medium">Bebida:</span>{" "}
                                  {item.bebida}
                                </p>
                              </div>
                            )}
                            {/* Postre */}
                            {item.postre && (
                              <div className="pl-4 text-sm">
                                <p className="text-gray-700">
                                  🍰{" "}
                                  <span className="font-medium">Postre:</span>{" "}
                                  {item.postre}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Especificaciones del Cliente */}
                    {pedido.notas_especiales && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-yellow-900">
                              Especificaciones:
                            </p>
                            <p className="text-sm text-yellow-800">
                              {pedido.notas_especiales}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botones de Acción */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleListoParaEntrega(pedido.pedido_id);
                        }}
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Listo para Entrega
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelar(pedido.pedido_id);
                        }}
                        size="sm"
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pedidos Listos para Entrega */}
      {pedidosListos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Listos para Entrega
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pedidosListos.map((pedido) => (
              <Card
                key={pedido.pedido_id}
                className="border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setPedidoSeleccionado(pedido);
                  setIsTrackingOpen(true);
                }}
              >
                <div className="bg-green-500 p-3 text-white">
                  <p className="font-bold text-lg">#{pedido.pedido_id}</p>
                  <p className="text-sm">{pedido.cliente_nombre}</p>
                </div>
                <CardContent className="p-4">
                  <Badge className={ESTADOS_COLORES[pedido.estado]}>
                    ✓ Listo para Delivery
                  </Badge>
                  <div className="mt-3">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelar(pedido.pedido_id);
                      }}
                      size="sm"
                      variant="destructive"
                      className="w-full"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Tracking */}
      <TrackingModal
        pedido={pedidoSeleccionado}
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />
    </div>
  );
}
