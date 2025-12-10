"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  TrendingUp,
  Package,
  DollarSign,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GenericTable from "@/components/shared/GenericTable";
import { usePedidos } from "../pedidos/_components/hooks/usePedidos";

export default function ReportesPage() {
  const { pedidos } = usePedidos();
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalPedidos: 0,
    pedidosEntregados: 0,
    pedidosCancelados: 0,
  });

  useEffect(() => {
    // Establecer rango por defecto: último mes
    const hoy = new Date();
    const hace30Dias = new Date(hoy);
    hace30Dias.setDate(hoy.getDate() - 30);

    setFechaInicio(hace30Dias.toISOString().split("T")[0]);
    setFechaFin(hoy.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (!fechaInicio || !fechaFin) return;

    const filtrados = pedidos.filter((pedido) => {
      const fechaPedido = new Date(pedido.fecha_pedido)
        .toISOString()
        .split("T")[0];
      return fechaPedido >= fechaInicio && fechaPedido <= fechaFin;
    });

    setPedidosFiltrados(filtrados);

    // Calcular estadísticas
    const totalVentas = filtrados
      .filter((p) => p.estado === "Entregado")
      .reduce((sum, p) => sum + parseFloat(p.total_pedido || 0), 0);

    const entregados = filtrados.filter((p) => p.estado === "Entregado").length;
    const cancelados = filtrados.filter((p) => p.estado === "Cancelado").length;

    setStats({
      totalVentas,
      totalPedidos: filtrados.length,
      pedidosEntregados: entregados,
      pedidosCancelados: cancelados,
    });
  }, [pedidos, fechaInicio, fechaFin]);

  const columns = [
    {
      header: "ID",
      key: "pedido_id",
      render: (item) => <span className="font-mono">#{item.pedido_id}</span>,
    },
    {
      header: "Cliente",
      key: "cliente_nombre",
      render: (item) => item.cliente_nombre || "N/A",
    },
    {
      header: "Fecha",
      key: "fecha_pedido",
      render: (item) =>
        new Date(item.fecha_pedido).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      header: "Estado",
      key: "estado",
      render: (item) => (
        <Badge
          className={
            item.estado === "Entregado"
              ? "bg-green-100 text-green-800"
              : item.estado === "Cancelado"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }
        >
          {item.estado}
        </Badge>
      ),
    },
    {
      header: "Total",
      key: "total",
      render: (item) => (
        <span className="font-semibold text-green-600">
          Bs. {parseFloat(item.total_pedido || 0).toFixed(2)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
        <p className="text-gray-600 mt-1">
          Historial completo, ventas y estadísticas
        </p>
      </div>

      {/* Filtros de Fecha */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <Input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Ventas</p>
                <p className="text-2xl font-bold text-green-600">
                  Bs. {stats.totalVentas.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pedidos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalPedidos}
                </p>
              </div>
              <Package className="h-12 w-12 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Entregados</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {stats.pedidosEntregados}
                </p>
              </div>
              <TrendingUp className="h-12 w-12 text-emerald-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelados</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.pedidosCancelados}
                </p>
              </div>
              <Calendar className="h-12 w-12 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de Pedidos */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Historial de Pedidos</h2>
          <GenericTable
            data={pedidosFiltrados.map((p) => ({ ...p, id: p.pedido_id }))}
            columns={columns}
            emptyMessage="No hay pedidos en el rango seleccionado"
            itemsPerPage={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
