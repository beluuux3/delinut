"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PedidosPorEstadoChart({ pedidosPorEstado }) {
  const estadosData = [
    {
      estado: "Pendiente",
      valor: pedidosPorEstado["Pendiente"] || 0,
      color: "bg-gray-400",
    },
    {
      estado: "Confirmado",
      valor: pedidosPorEstado["Confirmado"] || 0,
      color: "bg-blue-400",
    },
    {
      estado: "En Cocina",
      valor: pedidosPorEstado["En Cocina"] || 0,
      color: "bg-yellow-400",
    },
    {
      estado: "Listo",
      valor: pedidosPorEstado["Listo para Entrega"] || 0,
      color: "bg-orange-400",
    },
    {
      estado: "En Reparto",
      valor: pedidosPorEstado["En Reparto"] || 0,
      color: "bg-purple-400",
    },
    {
      estado: "Entregado",
      valor: pedidosPorEstado["Entregado"] || 0,
      color: "bg-green-400",
    },
    {
      estado: "Cancelado",
      valor: pedidosPorEstado["Cancelado"] || 0,
      color: "bg-red-400",
    },
  ];

  const maxValue = Math.max(...estadosData.map((d) => d.valor), 1);

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Pedidos por Estado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between gap-2 md:gap-4">
          {estadosData.map((item) => (
            <div
              key={item.estado}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                className="w-full flex items-end justify-center"
                style={{ height: "200px" }}
              >
                <div
                  className={`w-full ${item.color} rounded-t-lg transition-all hover:opacity-80 cursor-pointer`}
                  style={{ height: `${(item.valor / maxValue) * 100}%` }}
                />
              </div>
              <div className="text-center">
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  {item.estado}
                </p>
                <p className="text-xs md:text-sm font-bold text-gray-900">
                  {item.valor}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
