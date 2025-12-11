"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Utensils,
  ChefHat,
  History,
} from "lucide-react";
import { useCocina } from "../_components/hooks/useCocina";

export default function KitchenDashboard() {
  const {
    pendientes,
    historial,
    loading,
    fetchPendientes,
    fetchHistorial,
    cambiarEstado,
  } = useCocina();

  const [activeTab, setActiveTab] = useState("pendientes");

  useEffect(() => {
    // Cargar datos iniciales según el tab activo
    if (activeTab === "pendientes") {
      fetchPendientes();
      const interval = setInterval(fetchPendientes, 10000); // Poll cada 10s
      return () => clearInterval(interval);
    } else if (activeTab === "historial") {
      fetchHistorial();
    }
  }, [activeTab, fetchPendientes, fetchHistorial]);

  const getTiempoTranscurrido = (fecha) => {
    if (!fecha) return 0;
    const diff = new Date() - new Date(fecha);
    return Math.floor(diff / 60000); // Minutos
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Panel de Cocina</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString("es-BO", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[300px]">
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        {/* TAB PENDIENTES */}
        <TabsContent value="pendientes" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Cola de Preparación
            </h3>
            <Badge variant="secondary" className="text-sm">
              {pendientes.length} Pedidos
            </Badge>
          </div>

          {pendientes.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-200">
              <ChefHat className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900">
                ¡Todo listo!
              </h3>
              <p className="text-gray-500">
                No hay pedidos pendientes en cocina.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendientes.map((order) => {
                const minutos = getTiempoTranscurrido(order.fecha_pedido);
                const esTardado = minutos > 20;

                return (
                  <Card
                    key={order.pedido_id}
                    className={`border-l-4 ${
                      order.estado === "En Cocina"
                        ? "border-l-orange-500 bg-orange-50/30"
                        : "border-l-blue-500"
                    } shadow-md hover:shadow-lg transition-shadow relative overflow-hidden`}
                  >
                    {esTardado && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg font-bold animate-pulse">
                        DEMORADO ({minutos} min)
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            #{order.token_recoger || order.pedido_id}
                            <Badge
                              className={
                                order.estado === "En Cocina"
                                  ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              }
                            >
                              {order.estado}
                            </Badge>
                          </CardTitle>
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(order.fecha_pedido).toLocaleTimeString(
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
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-white rounded-md p-3 space-y-3 border border-gray-100 shadow-sm">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="border-b border-gray-100 last:border-0 pb-2 last:pb-0"
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-lg text-gray-900 bg-gray-100 px-2 py-0.5 rounded mr-2">
                                  {item.cantidad}x
                                </span>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">
                                    {item.plato_principal}
                                  </p>
                                  {(item.bebida || item.postre) && (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {item.bebida && `+ ${item.bebida} `}
                                      {item.postre && `+ ${item.postre}`}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {item.exclusiones &&
                                item.exclusiones.length > 0 && (
                                  <div className="mt-1 bg-red-50 p-1.5 rounded border border-red-100">
                                    <p className="text-sm text-red-700 font-bold flex items-center gap-1">
                                      <AlertCircle className="h-4 w-4" />
                                      SIN: {item.exclusiones.join(", ")}
                                    </p>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>

                        {order.notas_especiales && (
                          <div className="bg-yellow-50 p-2 rounded border border-yellow-200 text-sm text-yellow-800">
                            <strong>Nota:</strong> {order.notas_especiales}
                          </div>
                        )}

                        <div className="pt-2">
                          {order.estado === "Confirmado" ? (
                            <Button
                              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6"
                              onClick={() =>
                                cambiarEstado(order.pedido_id, "En Cocina")
                              }
                            >
                              <Utensils className="mr-2 h-5 w-5" />
                              EMPEZAR A PREPARAR
                            </Button>
                          ) : (
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6"
                              onClick={() =>
                                cambiarEstado(
                                  order.pedido_id,
                                  "Listo para Entrega"
                                )
                              }
                            >
                              <CheckCircle2 className="mr-2 h-5 w-5" />
                              MARCAR COMO LISTO
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* TAB HISTORIAL */}
        <TabsContent value="historial" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <History className="h-5 w-5" />
              Pedidos Completados Hoy
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchHistorial()}
            >
              Actualizar
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Hora</th>
                    <th className="px-6 py-3">Token</th>
                    <th className="px-6 py-3">Cliente</th>
                    <th className="px-6 py-3">Items</th>
                    <th className="px-6 py-3">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        No hay pedidos completados hoy
                      </td>
                    </tr>
                  ) : (
                    historial.map((order) => (
                      <tr
                        key={order.pedido_id}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {new Date(order.fecha_pedido).toLocaleTimeString(
                            "es-BO",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: "America/La_Paz",
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono">
                          {order.token_recoger}
                        </td>
                        <td className="px-6 py-4">{order.cliente_nombre}</td>
                        <td className="px-6 py-4">
                          {order.items.length} items
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            {order.estado}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
