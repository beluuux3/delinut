"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, ChevronRight, Utensils } from "lucide-react";

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) return;

      // Asumiendo que este endpoint devuelve los pedidos del usuario autenticado
      // Si no existe un endpoint específico "mis-pedidos", el backend debería filtrar por el usuario del token en /pedidos
      const response = await fetch(
        "https://backend-solandre.onrender.com/pedidos/mis-pedidos",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Ordenar por fecha descendente
        const sortedPedidos = data.sort(
          (a, b) => new Date(b.fecha_pedido) - new Date(a.fecha_pedido)
        );
        setPedidos(sortedPedidos);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pendiente: "bg-yellow-100 text-yellow-800",
      Confirmado: "bg-blue-100 text-blue-800",
      "En Cocina": "bg-orange-100 text-orange-800",
      "Listo para Entrega": "bg-purple-100 text-purple-800",
      "En Reparto": "bg-indigo-100 text-indigo-800",
      Entregado: "bg-green-100 text-green-800",
      Cancelado: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
          <p className="text-gray-600">Hola, {user?.nombre_completo}</p>
        </div>
        <Link href="/cliente/menu">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Utensils className="mr-2 h-4 w-4" />
            Nuevo Pedido
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-500" />
              Mis Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pedidos.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No tienes pedidos aún
                </h3>
                <p className="text-gray-500 mb-6">
                  ¡Explora nuestro menú y realiza tu primer pedido!
                </p>
                <Link href="/">
                  <Button variant="outline">Ver Menú</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {pedidos.map((pedido) => (
                  <div
                    key={pedido.pedido_id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="space-y-1 mb-4 md:mb-0">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">
                          #{pedido.pedido_id}
                        </span>
                        <Badge className={getStatusColor(pedido.estado)}>
                          {pedido.estado}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(pedido.fecha_pedido).toLocaleDateString()}
                        </span>
                        <span>{pedido.items_count} items</span>
                        <span className="font-semibold text-gray-900">
                          Bs. {pedido.total_pedido}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      {pedido.token_recoger &&
                        pedido.estado !== "Entregado" &&
                        pedido.estado !== "Cancelado" && (
                          <Link
                            href={`/cliente/pedidos/${pedido.token_recoger}/track`}
                            className="flex-1 md:flex-none"
                          >
                            <Button
                              variant="outline"
                              className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                            >
                              Seguimiento
                            </Button>
                          </Link>
                        )}
                      {/* Aquí podríamos agregar un botón de "Ver Detalle" si tuviéramos esa vista */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
