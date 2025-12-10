"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  MapPin,
  User,
  Phone,
  Mail,
  ChefHat,
  X,
  Settings,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const estadosOrden = [
  { nombre: "Pendiente", icon: Clock, color: "text-yellow-500" },
  { nombre: "Confirmado", icon: CheckCircle, color: "text-blue-500" },
  { nombre: "En Cocina", icon: ChefHat, color: "text-purple-500" },
  { nombre: "Listo para Entrega", icon: Package, color: "text-green-500" },
  { nombre: "En Reparto", icon: Truck, color: "text-orange-500" },
  { nombre: "Entregado", icon: CheckCircle, color: "text-emerald-500" },
];

const ESTADOS_COLORES_BG = {
  Pendiente: "bg-yellow-100 text-yellow-800",
  Confirmado: "bg-blue-100 text-blue-800",
  "En Cocina": "bg-purple-100 text-purple-800",
  "Listo para Entrega": "bg-green-100 text-green-800",
  "En Reparto": "bg-orange-100 text-orange-800",
  Entregado: "bg-emerald-100 text-emerald-800",
  Cancelado: "bg-red-100 text-red-800",
};

import { useState, useEffect } from "react";
import { useFetch } from "@/hooks/useFetch";
import dynamic from "next/dynamic";

const LocationViewer = dynamic(() => import("./LocationViewer"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
      Cargando mapa...
    </div>
  ),
});

export default function TrackingModal({
  pedido,
  isOpen,
  onClose,
  deliveries,
  onReasignar,
  onCambiarEstado,
}) {
  const { fetchData } = useFetch();
  const [fullPedido, setFullPedido] = useState(pedido);

  useEffect(() => {
    if (pedido) {
      setFullPedido(pedido); // Reset to initial prop
      const fetchDetails = async () => {
        const result = await fetchData(
          `/admin/pedidos/${pedido.pedido_id}/detalle-completo`
        );
        if (result.success) {
          setFullPedido((prev) => ({ ...prev, ...result.data }));
        }
      };
      fetchDetails();
    }
  }, [pedido]);

  if (!fullPedido) return null;

  const getEstadoIndex = (estado) => {
    return estadosOrden.findIndex((e) => e.nombre === estado);
  };

  const estadoActualIndex = getEstadoIndex(fullPedido.estado);
  const esCancelado = fullPedido.estado === "Cancelado";

  const formatFecha = (fecha) => {
    if (!fecha) return "---";
    // Asegurar que se interprete como UTC si viene sin zona horaria
    const fechaObj = new Date(fecha.endsWith("Z") ? fecha : `${fecha}Z`);
    return fechaObj.toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/La_Paz",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl font-bold flex items-center justify-between">
          <span>Tracking Delivery</span>
          <Badge
            className={
              ESTADOS_COLORES_BG[fullPedido.estado] + " text-lg px-3 py-1"
            }
          >
            {fullPedido.estado}
          </Badge>
        </DialogTitle>

        <div className="space-y-6 mt-4">
          {/* Tracking ID */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Tracking ID</p>
            <p className="text-2xl font-bold text-gray-900">
              #{fullPedido.pedido_id}-{fullPedido.token_entrega || "0000"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {formatFecha(fullPedido.fecha_pedido)}
            </p>
          </div>

          {/* Mapa o Placeholder */}
          {/* Mapa o Placeholder */}
          {/* Mapa o Placeholder */}
          <a
            href={
              fullPedido.latitud && fullPedido.longitud
                ? `https://www.google.com/maps/search/?api=1&query=${fullPedido.latitud},${fullPedido.longitud}`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
            className={`block bg-gray-200 rounded-lg h-48 relative overflow-hidden border border-gray-300 transition-transform hover:scale-[1.01] ${
              !fullPedido.latitud ? "pointer-events-none" : "cursor-pointer"
            }`}
            title="Clic para abrir en Google Maps"
          >
            {fullPedido.latitud && fullPedido.longitud ? (
              <>
                <LocationViewer
                  lat={fullPedido.latitud}
                  lng={fullPedido.longitud}
                />
                <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-blue-600 shadow-sm flex items-center gap-1 z-[400]">
                  <MapPin className="h-3 w-3" />
                  Abrir en Google Maps
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-linear-to-br from-blue-100 to-green-100 opacity-50"></div>
                <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
                  <MapPin className="h-16 w-16 text-gray-600 mb-2" />
                  <p className="text-gray-600 font-medium">
                    {fullPedido.zona?.nombre ||
                      fullPedido.zona ||
                      "Ubicación no disponible"}
                  </p>
                  {fullPedido.direccion_entrega && (
                    <p className="text-sm text-gray-500 mt-1 px-4">
                      {fullPedido.direccion_entrega}
                    </p>
                  )}
                </div>
              </>
            )}
          </a>

          {/* Dirección y Referencia (Visible siempre) */}
          <div className="text-center space-y-1">
            <p className="font-medium text-gray-900">
              {fullPedido.direccion_entrega}
            </p>
            {fullPedido.direccion_referencia && (
              <p className="text-sm text-gray-500 italic">
                Ref: {fullPedido.direccion_referencia}
              </p>
            )}
          </div>

          {/* Timeline de Estados */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Estado del Pedido</h3>

            {!esCancelado ? (
              <div className="relative">
                {estadosOrden.map((estado, index) => {
                  const Icon = estado.icon;
                  const isCompleted = index <= estadoActualIndex;
                  const isCurrent = index === estadoActualIndex;

                  // Determinar la fecha correcta para este estado
                  let fechaEstado = null;
                  switch (estado.nombre) {
                    case "Pendiente":
                      fechaEstado = fullPedido.fecha_pedido;
                      break;
                    case "Confirmado":
                      fechaEstado = fullPedido.fecha_confirmado;
                      break;
                    case "En Cocina":
                      // Usamos fecha_confirmado como aproximación si no hay fecha específica
                      fechaEstado = fullPedido.fecha_confirmado;
                      break;
                    case "Listo para Entrega":
                      fechaEstado = fullPedido.fecha_listo_cocina;
                      break;
                    case "En Reparto":
                      fechaEstado = fullPedido.fecha_en_reparto;
                      break;
                    case "Entregado":
                      fechaEstado = fullPedido.fecha_entrega;
                      break;
                    default:
                      fechaEstado = null;
                  }

                  return (
                    <div
                      key={estado.nombre}
                      className="flex gap-4 relative pb-8 last:pb-0"
                    >
                      {/* Línea vertical */}
                      {index < estadosOrden.length - 1 && (
                        <div
                          className={`absolute left-5 top-10 w-0.5 h-full ${
                            isCompleted ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                      )}

                      {/* Icono */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-400"
                        } ${isCurrent ? "ring-4 ring-green-200" : ""}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={`font-semibold ${
                              isCompleted ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {estado.nombre}
                          </p>
                          {/* Mostrar hora solo si el estado está completado o es el actual Y tenemos fecha */}
                          {(isCompleted || isCurrent) && fechaEstado && (
                            <span className="text-sm font-medium text-green-600">
                              {formatFecha(fechaEstado).split(",")[1]}
                            </span>
                          )}
                        </div>
                        {isCurrent && (
                          <p className="text-sm text-gray-500 mt-1">
                            Estado actual del pedido
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-start gap-3">
                  <X className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-red-900">Pedido Cancelado</p>
                    <p className="text-sm text-red-700 mt-1">
                      Este pedido ha sido cancelado
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Información del Cliente/Courier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-blue-600" />
                <p className="font-bold text-gray-900">Cliente</p>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-900">
                  {fullPedido.cliente?.nombre ||
                    fullPedido.cliente_nombre ||
                    "Cliente"}
                </p>
                {(fullPedido.cliente?.email || fullPedido.cliente_email) && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="break-all">
                      {fullPedido.cliente?.email || fullPedido.cliente_email}
                    </span>
                  </div>
                )}
                {(fullPedido.cliente?.telefono ||
                  fullPedido.cliente_telefono) && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <a
                      href={`tel:${
                        fullPedido.cliente?.telefono ||
                        fullPedido.cliente_telefono
                      }`}
                      className="text-blue-600 hover:underline"
                    >
                      {fullPedido.cliente?.telefono ||
                        fullPedido.cliente_telefono}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Courier/Delivery */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="h-5 w-5 text-orange-600" />
                <p className="font-bold text-gray-900">Courier</p>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-gray-900">
                  {fullPedido.delivery?.nombre ||
                    fullPedido.delivery_nombre ||
                    "Asignando..."}
                </p>
                {(fullPedido.delivery?.telefono ||
                  fullPedido.delivery_telefono) && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <a
                      href={`tel:${
                        fullPedido.delivery?.telefono ||
                        fullPedido.delivery_telefono
                      }`}
                      className="text-orange-600 hover:underline"
                    >
                      {fullPedido.delivery?.telefono ||
                        fullPedido.delivery_telefono}
                    </a>
                  </div>
                )}
                {!fullPedido.delivery?.nombre &&
                  !fullPedido.delivery_nombre && (
                    <p className="text-xs text-gray-500">
                      El delivery será asignado pronto
                    </p>
                  )}

                {/* Reasignar Delivery */}
                {!esCancelado && fullPedido.estado !== "Entregado" && (
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <p className="text-xs font-semibold text-orange-800 mb-2">
                      Reasignar Delivery:
                    </p>
                    <div className="flex gap-2">
                      <Select
                        onValueChange={(value) =>
                          onReasignar(fullPedido.pedido_id, parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-full h-8 text-xs bg-white border-orange-300">
                          <SelectValue placeholder="Seleccionar delivery..." />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveries?.map((d) => (
                            <SelectItem
                              key={d.usuario_id}
                              value={String(d.usuario_id)}
                            >
                              {d.nombre_completo} ({d.zona_nombre || "Sin zona"}
                              )
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Acciones Administrativas */}
          {!esCancelado && (
            <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Acciones Administrativas
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-600 block mb-1">
                    Forzar Cambio de Estado:
                  </label>
                  <Select
                    value={fullPedido.estado}
                    onValueChange={(value) =>
                      onCambiarEstado(fullPedido.pedido_id, value)
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estadosOrden.map((e) => (
                        <SelectItem key={e.nombre} value={e.nombre}>
                          {e.nombre}
                        </SelectItem>
                      ))}
                      <SelectItem value="Cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Detalles del Pedido */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-900 mb-3">
              Detalles del Pedido
            </h4>
            {fullPedido.items && fullPedido.items.length > 0 ? (
              <div className="space-y-2">
                {fullPedido.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-700">
                      {item.cantidad}x {item.nombre_plato || item.nombre}
                    </span>
                    {item.precio && (
                      <span className="font-medium text-gray-900">
                        Bs. {(item.cantidad * item.precio).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
                {fullPedido.notas_especiales && (
                  <div className="mt-3 p-2 bg-yellow-50 rounded border-l-2 border-yellow-400">
                    <p className="text-xs font-medium text-yellow-900">
                      Notas especiales:
                    </p>
                    <p className="text-sm text-yellow-800">
                      {fullPedido.notas_especiales}
                    </p>
                  </div>
                )}
                <div className="border-t pt-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-green-600">
                      Bs.{" "}
                      {fullPedido.total?.toFixed(2) ||
                        fullPedido.total_pedido?.toFixed(2) ||
                        "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No hay items en el pedido</p>
            )}
          </div>

          {/* Botón Cerrar */}
          <Button onClick={onClose} className="w-full" variant="outline">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
