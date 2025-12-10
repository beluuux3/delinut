"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, ChefHat, Truck, XCircle } from "lucide-react";

export default function OrderTrackingPage() {
  const params = useParams();
  const token = params.token;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      const response = await fetch(
        `https://backend-solandre.onrender.com/pedidos/${token}/track`
      );
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      } else {
        setError("No se pudo encontrar el pedido");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Poll every 30 seconds
    const interval = setInterval(fetchOrder, 30000);
    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Error</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  const steps = [
    { status: "Pendiente", label: "Pedido Recibido", icon: Clock },
    { status: "Confirmado", label: "Confirmado", icon: CheckCircle2 },
    { status: "En Cocina", label: "Preparando", icon: ChefHat },
    { status: "En Reparto", label: "En Camino", icon: Truck },
    { status: "Entregado", label: "Entregado", icon: CheckCircle2 },
  ];

  const getCurrentStepIndex = () => {
    if (order.estado === "Cancelado") return -1;
    const index = steps.findIndex((s) => s.status === order.estado);
    // If status is "Listo para Entrega", it's between Kitchen and Delivery, show as Kitchen complete
    if (order.estado === "Listo para Entrega") return 2;
    return index >= 0 ? index : 0;
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Seguimiento de Pedido
        </h1>
        <p className="text-gray-600">Orden #{order.pedido_id}</p>
      </div>

      <Card className="mb-8 shadow-md border-orange-100">
        <CardContent className="pt-8 pb-8">
          {order.estado === "Cancelado" ? (
            <div className="text-center py-8">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-600">
                Pedido Cancelado
              </h2>
              <p className="text-gray-600 mt-2">
                Lo sentimos, tu pedido ha sido cancelado.
              </p>
            </div>
          ) : (
            <div className="relative px-4">
              {/* Progress Bar Background */}
              <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -translate-y-1/2 hidden md:block" />

              {/* Progress Bar Fill */}
              <div
                className="absolute top-1/2 left-4 h-1 bg-green-500 -translate-y-1/2 transition-all duration-500 hidden md:block"
                style={{
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
              />

              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentStep;
                  const isCurrent = index === currentStep;

                  return (
                    <div
                      key={step.status}
                      className="flex md:flex-col items-center gap-4 md:gap-3 w-full md:w-auto z-10"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm
                          ${
                            isActive
                              ? "bg-green-500 border-green-500 text-white scale-110"
                              : "bg-white border-gray-200 text-gray-300"
                          }
                        `}
                      >
                        <Icon size={24} />
                      </div>
                      <div className="md:text-center">
                        <p
                          className={`font-semibold text-sm md:text-base ${
                            isActive ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-orange-500 font-medium animate-pulse mt-1">
                            En proceso...
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5 text-orange-500" />
              Información de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Estado Actual</p>
              <Badge
                className={`text-base px-3 py-1 ${
                  order.estado === "Entregado"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                }`}
              >
                {order.estado}
              </Badge>
            </div>

            {order.nombre_delivery && (
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  Repartidor Asignado
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {order.nombre_delivery.charAt(0)}
                  </div>
                  <p className="font-medium">{order.nombre_delivery}</p>
                </div>
              </div>
            )}

            {order.fecha_entrega && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Entregado el</p>
                <p className="font-medium">
                  {new Date(order.fecha_entrega).toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-orange-500" />
              Resumen de Pago
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Método de Pago</span>
              <span className="font-medium">{order.metodo_pago}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Estado del Pago</span>
              <Badge
                variant={order.esta_pagado ? "default" : "secondary"}
                className={order.esta_pagado ? "bg-green-600" : ""}
              >
                {order.esta_pagado ? "Pagado" : "Pendiente"}
              </Badge>
            </div>

            <div className="flex justify-between items-center pt-4">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-orange-600">
                Bs. {order.total_pedido}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
