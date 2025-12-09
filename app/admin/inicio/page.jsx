"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { ShoppingCart, CheckCircle, Clock, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KPICard from "./_components/KPICard";
import PedidosPorEstadoChart from "./_components/PedidosPorEstadoChart";

export default function InicioPage() {
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const token = Cookies.get("token");

        const response = await fetch(
          `https://backend-solandre.onrender.com/admin/kpis?fecha=${today}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setKpiData(data);
        } else {
          const errorText = await response.text();
          setError(`Error ${response.status}: ${errorText}`);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error || !kpiData) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 font-semibold mb-2">
            Error al cargar datos
          </p>
          <p className="text-red-500 text-sm">
            {error || "No se recibieron datos del servidor"}
          </p>
        </div>
      </div>
    );
  }

  const pedidosPorEstado = kpiData?.pedidos_por_estado || {};
  const totalPedidos = kpiData?.total_pedidos || 0;
  const ventasTotales = kpiData?.ventas_totales || "0";
  const pedidosEntregados = pedidosPorEstado["Entregado"] || 0;
  const pedidosPendientes =
    (pedidosPorEstado["Pendiente"] || 0) +
    (pedidosPorEstado["Confirmado"] || 0) +
    (pedidosPorEstado["En Cocina"] || 0) +
    (pedidosPorEstado["Listo para Entrega"] || 0) +
    (pedidosPorEstado["En Reparto"] || 0);

  const kpis = [
    {
      title: "Total Pedidos Hoy",
      value: totalPedidos.toString(),
      change: `${pedidosEntregados} entregados`,
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Pedidos Entregados",
      value: pedidosEntregados.toString(),
      change: `${
        Math.round((pedidosEntregados / totalPedidos) * 100) || 0
      }% completados`,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pedidos Pendientes",
      value: pedidosPendientes.toString(),
      change: `${pedidosPorEstado["En Cocina"] || 0} en cocina`,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Ventas Totales",
      value: `Bs ${parseFloat(ventasTotales).toFixed(2)}`,
      change: "Hoy",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Resumen general del sistema Delinut
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi) => (
          <KPICard key={kpi.title} {...kpi} />
        ))}
      </div>

      <PedidosPorEstadoChart pedidosPorEstado={pedidosPorEstado} />

      {kpiData?.tiempo_promedio_preparacion && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Tiempo Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Preparación</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round(kpiData.tiempo_promedio_preparacion)} min
                  </p>
                </div>
                {kpiData.tiempo_promedio_entrega && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Entrega</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(kpiData.tiempo_promedio_entrega)} min
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(kpiData.ventas_por_metodo_pago || {}).map(
                  ([metodo, monto]) => (
                    <div
                      key={metodo}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {metodo}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        Bs {parseFloat(monto).toFixed(2)}
                      </span>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
