"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Phone,
  User,
  Package,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePedidos } from "../pedidos/_components/hooks/usePedidos";
import TrackingModal from "../pedidos/_components/TrackingModal";

const ESTADOS_COLORES = {
  "Listo para Entrega": "bg-green-100 text-green-800",
  "En Reparto": "bg-orange-100 text-orange-800",
  Entregado: "bg-emerald-100 text-emerald-800",
  Cancelado: "bg-red-100 text-red-800",
};

export default function DeliveryPage() {
  const { pedidos, cambiarEstado, cancelarPedido } = usePedidos();
  const [pedidosDelivery, setPedidosDelivery] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  useEffect(() => {
    // Filtrar pedidos listos para entrega, en reparto y entregados
    const pedidosDelDia = pedidos.filter((pedido) => {
      const fechaPedido = new Date(pedido.fecha_pedido)
        .toISOString()
        .split("T")[0];
      return (
        fechaPedido === fechaSeleccionada &&
        (pedido.estado === "Listo para Entrega" ||
          pedido.estado === "En Reparto" ||
          pedido.estado === "Entregado")
      );
    });
    setPedidosDelivery(pedidosDelDia);
  }, [pedidos, fechaSeleccionada]);

  const handleEnReparto = async (pedidoId) => {
    await cambiarEstado(pedidoId, "En Reparto");
  };

  const handleEntregado = async (pedidoId) => {
    if (confirm("¿Confirmar que el pedido fue entregado?")) {
      await cambiarEstado(pedidoId, "Entregado");
    }
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

  const pedidosListos = pedidosDelivery.filter(
    (p) => p.estado === "Listo para Entrega"
  );
  const pedidosEnReparto = pedidosDelivery.filter(
    (p) => p.estado === "En Reparto"
  );
  const pedidosEntregados = pedidosDelivery.filter(
    (p) => p.estado === "Entregado"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="h-8 w-8 text-orange-600" />
            Delivery
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
            <Badge className="text-lg px-4 py-2 bg-green-500 text-white">
              {pedidosListos.length} Listos
            </Badge>
            <Badge className="text-lg px-4 py-2 bg-orange-500 text-white">
              {pedidosEnReparto.length} En Reparto
            </Badge>
            <Badge className="text-lg px-4 py-2 bg-emerald-500 text-white">
              {pedidosEntregados.length} Entregados
            </Badge>
          </div>
        </div>
      </div>

      {/* Pedidos Listos para Recoger */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Listos para Recoger
        </h2>
        {pedidosListos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">
                No hay pedidos listos {esHoy ? "hoy" : "para esta fecha"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pedidosListos.map((pedido) => (
              <Card
                key={pedido.pedido_id}
                className="hover:shadow-lg transition-shadow border-l-4 border-green-500 cursor-pointer"
                onClick={() => {
                  setPedidoSeleccionado(pedido);
                  setIsTrackingOpen(true);
                }}
              >
                <div className="bg-green-500 p-3">
                  <div className="flex items-center justify-between text-white">
                    <span className="font-bold text-xl">
                      #{pedido.pedido_id}
                    </span>
                    <Badge className={ESTADOS_COLORES[pedido.estado]}>
                      {pedido.estado}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Información del Cliente */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <User className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-gray-900">
                            {pedido.cliente_nombre || "Cliente"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {pedido.cliente_email}
                          </p>
                        </div>
                      </div>
                      {pedido.cliente_telefono && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-blue-600" />
                          <a
                            href={`tel:${pedido.cliente_telefono}`}
                            className="text-blue-600 font-medium hover:underline"
                          >
                            {pedido.cliente_telefono}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Dirección de Entrega */}
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-gray-900 mb-1">
                            Dirección de Entrega:
                          </p>
                          <p className="text-sm text-gray-700">
                            {pedido.direccion_entrega || "No especificada"}
                          </p>
                          {pedido.zona && (
                            <p className="text-xs text-gray-600 mt-1">
                              Zona: {pedido.zona}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Items del Pedido */}
                    {pedido.items && pedido.items.length > 0 && (
                      <div className="border-t pt-2">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Pedido ({pedido.items.length} items):
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {pedido.items.map((item, idx) => (
                            <li key={idx}>
                              • {item.cantidad}x{" "}
                              {item.nombre_plato || item.nombre}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Token de Entrega */}
                    {pedido.token_entrega && (
                      <div className="bg-gray-100 p-2 rounded text-center">
                        <p className="text-xs text-gray-600">Token</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {pedido.token_entrega}
                        </p>
                      </div>
                    )}

                    {/* Total */}
                    {pedido.total && (
                      <div className="text-center py-2 bg-green-50 rounded">
                        <p className="text-xl font-bold text-green-600">
                          Total: Bs. {pedido.total.toFixed(2)}
                        </p>
                      </div>
                    )}

                    {/* Botones de Acción */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnReparto(pedido.pedido_id);
                        }}
                        size="sm"
                        className="flex-1 bg-orange-500 hover:bg-orange-600"
                      >
                        <Truck className="h-4 w-4 mr-1" />
                        En Reparto
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

      {/* Pedidos En Reparto */}
      {pedidosEnReparto.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">En Reparto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pedidosEnReparto.map((pedido) => (
              <Card
                key={pedido.pedido_id}
                className="border-l-4 border-orange-500 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setPedidoSeleccionado(pedido);
                  setIsTrackingOpen(true);
                }}
              >
                <div className="bg-orange-500 p-3 text-white">
                  <p className="font-bold text-lg">#{pedido.pedido_id}</p>
                  <p className="text-sm">{pedido.cliente_nombre}</p>
                  {pedido.zona && (
                    <p className="text-xs mt-1">📍 {pedido.zona}</p>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Badge className={ESTADOS_COLORES[pedido.estado]}>
                      🚚 En Camino
                    </Badge>
                    {pedido.cliente_telefono && (
                      <p className="text-sm">
                        <Phone className="inline h-3 w-3 mr-1" />
                        {pedido.cliente_telefono}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEntregado(pedido.pedido_id);
                        }}
                        size="sm"
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Entregado
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
        </div>
      )}

      {/* Pedidos Entregados */}
      {pedidosEntregados.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Entregados Hoy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {pedidosEntregados.map((pedido) => (
              <Card
                key={pedido.pedido_id}
                className="border-emerald-500 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  setPedidoSeleccionado(pedido);
                  setIsTrackingOpen(true);
                }}
              >
                <CardContent className="p-3 text-center">
                  <CheckCircle className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                  <p className="font-bold">#{pedido.pedido_id}</p>
                  <p className="text-xs text-gray-600">
                    {pedido.cliente_nombre}
                  </p>
                  <Badge className={ESTADOS_COLORES[pedido.estado]} size="sm">
                    Entregado
                  </Badge>
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
