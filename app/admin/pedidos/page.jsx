"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  User,
  Package,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Phone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePedidos } from "./_components/hooks/usePedidos";
import { useEmpleados } from "../empleados/_components/hooks/useEmpleados";
import TrackingModal from "./_components/TrackingModal";

const ESTADOS_COLORES = {
  Pendiente: "bg-yellow-100 text-yellow-800",
  Confirmado: "bg-blue-100 text-blue-800",
  "En Cocina": "bg-purple-100 text-purple-800",
  "Listo para Entrega": "bg-green-100 text-green-800",
  "En Reparto": "bg-orange-100 text-orange-800",
  Entregado: "bg-emerald-100 text-emerald-800",
  Cancelado: "bg-red-100 text-red-800",
};

export default function PedidosPage() {
  const {
    pedidos,
    confirmarPedido,
    cancelarPedido,
    reasignarDelivery,
    cambiarEstado,
  } = usePedidos();
  const { empleados } = useEmpleados();
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Filtrar solo los empleados con rol de Delivery (3)
  const deliveries = empleados.filter((e) => e.rol_id === 3);

  useEffect(() => {
    // Filtrar pedidos por la fecha seleccionada
    const pedidosDelDia = pedidos.filter((pedido) => {
      const fechaPedido = new Date(pedido.fecha_pedido)
        .toISOString()
        .split("T")[0];
      return fechaPedido === fechaSeleccionada;
    });
    setPedidosFiltrados(pedidosDelDia);
  }, [pedidos, fechaSeleccionada]);

  const handleConfirmar = async (pedidoId) => {
    await confirmarPedido(pedidoId);
  };

  const handleCancelar = async (pedidoId) => {
    if (confirm("¿Cancelar este pedido?")) {
      await cancelarPedido(pedidoId);
    }
  };

  const handleVerTracking = (pedido) => {
    setPedidoSeleccionado(pedido);
    setIsTrackingOpen(true);
  };

  const handleFechaChange = (e) => {
    setFechaSeleccionada(e.target.value);
  };

  const irHoy = () => {
    setFechaSeleccionada(new Date().toISOString().split("T")[0]);
  };

  const esHoy = fechaSeleccionada === new Date().toISOString().split("T")[0];

  const getFechaDisplay = (pedido) => {
    let fecha = pedido.fecha_pedido;
    switch (pedido.estado) {
      case "Confirmado":
      case "En Cocina":
        fecha = pedido.fecha_confirmado;
        break;
      case "Listo para Entrega":
        fecha = pedido.fecha_listo_cocina;
        break;
      case "En Reparto":
        fecha = pedido.fecha_en_reparto;
        break;
      case "Entregado":
        fecha = pedido.fecha_entrega;
        break;
    }
    return fecha || pedido.fecha_pedido;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {esHoy ? "Pedidos de Hoy" : "Pedidos"}
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
          <Badge className="text-lg px-4 py-2 bg-orange-500 text-white">
            {pedidosFiltrados.length} Pedidos
          </Badge>
        </div>
      </div>

      {pedidosFiltrados.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              No hay pedidos para {esHoy ? "hoy" : "esta fecha"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pedidosFiltrados.map((pedido) => (
            <Card
              key={pedido.pedido_id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleVerTracking(pedido)}
            >
              <div
                className={`p-3 ${
                  pedido.estado === "Pendiente"
                    ? "bg-yellow-500"
                    : pedido.estado === "En Cocina"
                    ? "bg-purple-500"
                    : pedido.estado === "Listo para Entrega"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              >
                <div className="flex items-center justify-between text-white">
                  <span className="font-bold">#{pedido.pedido_id}</span>
                  <Badge className={ESTADOS_COLORES[pedido.estado]}>
                    {pedido.estado}
                  </Badge>
                </div>
                <p className="text-white text-sm mt-1">
                  <Clock className="inline h-3 w-3 mr-1" />
                  {new Date(getFechaDisplay(pedido)).toLocaleTimeString(
                    "es-BO",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "America/La_Paz",
                    }
                  )}
                </p>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Información del Cliente */}
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {pedido.cliente_nombre || "Cliente"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {pedido.cliente_email}
                      </p>
                      {pedido.cliente_telefono && (
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" />
                          {pedido.cliente_telefono}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dirección de Entrega */}
                  {pedido.direccion_entrega && (
                    <div className="flex items-start gap-2 border-t pt-2">
                      <MapPin className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">
                          Dirección:
                        </p>
                        <p className="text-sm text-gray-600">
                          {pedido.direccion_entrega}
                        </p>
                        {pedido.zona && (
                          <p className="text-xs text-gray-500 mt-1">
                            Zona: {pedido.zona}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items del Pedido */}
                  {pedido.items && pedido.items.length > 0 && (
                    <div className="border-t pt-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Items Pedidos:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {pedido.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>
                              • {item.cantidad}x{" "}
                              {item.nombre_plato || item.nombre}
                            </span>
                            {item.precio && (
                              <span className="font-medium">
                                Bs. {(item.cantidad * item.precio).toFixed(2)}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                      {pedido.notas_especiales && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-gray-700">
                          <span className="font-medium">Nota: </span>
                          {pedido.notas_especiales}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Total */}
                  {pedido.total && (
                    <div className="border-t pt-2">
                      <p className="text-lg font-bold text-green-600">
                        Total: Bs. {pedido.total.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* Botones de Acción */}
                  <div className="flex gap-2 pt-2">
                    {pedido.estado === "Pendiente" && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirmar(pedido.pedido_id);
                        }}
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirmar
                      </Button>
                    )}
                    {pedido.estado !== "Cancelado" &&
                      pedido.estado !== "Entregado" && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelar(pedido.pedido_id);
                          }}
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Tracking */}
      <TrackingModal
        pedido={pedidoSeleccionado}
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        deliveries={deliveries}
        onReasignar={reasignarDelivery}
        onCambiarEstado={cambiarEstado}
      />
    </div>
  );
}
