"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Navigation,
  DollarSign,
  Package,
  User,
} from "lucide-react";
import { useDelivery } from "../_components/hooks/useDelivery";
import dynamic from "next/dynamic";

const LocationViewer = dynamic(
  () => import("../../admin/pedidos/_components/LocationViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
        Cargando mapa...
      </div>
    ),
  }
);

export default function DeliveryDashboard() {
  const { entregas, loading, fetchMisEntregas, tomarPedido, finalizarPedido } =
    useDelivery();

  const [confirmarPago, setConfirmarPago] = useState({});

  useEffect(() => {
    fetchMisEntregas();
    const interval = setInterval(fetchMisEntregas, 15000);
    return () => clearInterval(interval);
  }, [fetchMisEntregas]);

  const handleTogglePago = (pedidoId, checked) => {
    setConfirmarPago((prev) => ({
      ...prev,
      [pedidoId]: checked,
    }));
  };

  if (loading && entregas.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mis Entregas</h2>
        <Badge variant="outline" className="text-lg px-4 py-1">
          {entregas.length} Asignadas
        </Badge>
      </div>

      {entregas.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-200">
          <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900">
            Sin entregas pendientes
          </h3>
          <p className="text-gray-500">
            No tienes pedidos asignados en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entregas.map((pedido) => (
            <Card
              key={pedido.pedido_id}
              className={`border-l-4 ${
                pedido.estado === "En Reparto"
                  ? "border-l-blue-500 bg-blue-50/30"
                  : "border-l-green-500"
              } shadow-md hover:shadow-lg transition-shadow`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      #{pedido.pedido_id}
                      <Badge
                        className={
                          pedido.estado === "En Reparto"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {pedido.estado}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(pedido.fecha_pedido).toLocaleTimeString(
                        "es-BO",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "America/La_Paz",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Información del Cliente */}
                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {pedido.cliente_nombre}
                      </p>
                      <a
                        href={`tel:${pedido.cliente_telefono}`}
                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {pedido.cliente_telefono}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2 border-t border-gray-100">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700">
                        {pedido.direccion_entrega}
                      </p>
                      {pedido.direccion_referencia && (
                        <p className="text-xs text-gray-500 mt-1">
                          Ref: {pedido.direccion_referencia}
                        </p>
                      )}
                      {(pedido.latitud && pedido.longitud) ||
                      pedido.google_maps_link ? (
                        <div className="mt-3">
                          {pedido.latitud && pedido.longitud ? (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${pedido.latitud},${pedido.longitud}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block h-40 w-full rounded-md overflow-hidden border border-gray-200 relative group"
                              title="Clic para abrir en Google Maps"
                            >
                              <LocationViewer
                                lat={pedido.latitud}
                                lng={pedido.longitud}
                              />
                              <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-blue-600 shadow-sm flex items-center gap-1 z-[400] group-hover:bg-blue-50 transition-colors">
                                <Navigation className="h-3 w-3" />
                                Abrir GPS
                              </div>
                            </a>
                          ) : (
                            <a
                              href={pedido.google_maps_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              <Navigation className="h-4 w-4" />
                              Ver en Google Maps
                            </a>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Información de Pago */}
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Total a Cobrar:
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      Bs.{" "}
                      {parseFloat(
                        pedido.total_pedido || pedido.total || 0
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span
                      className={`font-medium ${
                        pedido.metodo_pago === "Efectivo"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {pedido.metodo_pago}
                    </span>
                    {pedido.esta_pagado ? (
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200"
                      >
                        PAGADO
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-orange-600 border-orange-200"
                      >
                        PENDIENTE
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Items Resumen */}
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">
                    Items ({(pedido.items || []).length}):
                  </p>
                  <ul className="list-disc list-inside pl-1 space-y-0.5">
                    {(pedido.items || []).map((item, idx) => (
                      <li key={idx} className="truncate">
                        {item.cantidad}x {item.nombre_plato}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                {pedido.estado === "Listo para Entrega" ? (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                    onClick={() => tomarPedido(pedido.pedido_id)}
                  >
                    <Package className="mr-2 h-5 w-5" />
                    Recoger Pedido
                  </Button>
                ) : (
                  <div className="w-full space-y-3">
                    {pedido.metodo_pago === "Efectivo" &&
                      !pedido.esta_pagado && (
                        <div className="flex items-center space-x-2 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                          <Switch
                            id={`pago-${pedido.pedido_id}`}
                            checked={confirmarPago[pedido.pedido_id] || false}
                            onCheckedChange={(checked) =>
                              handleTogglePago(pedido.pedido_id, checked)
                            }
                          />
                          <Label
                            htmlFor={`pago-${pedido.pedido_id}`}
                            className="text-sm font-medium text-yellow-800 cursor-pointer"
                          >
                            Confirmar cobro de Bs.{" "}
                            {parseFloat(
                              pedido.total_pedido || pedido.total || 0
                            ).toFixed(2)}
                          </Label>
                        </div>
                      )}
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg"
                      onClick={() =>
                        finalizarPedido(
                          pedido.pedido_id,
                          confirmarPago[pedido.pedido_id]
                        )
                      }
                      disabled={
                        pedido.metodo_pago === "Efectivo" &&
                        !pedido.esta_pagado &&
                        !confirmarPago[pedido.pedido_id]
                      }
                    >
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Finalizar Entrega
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
