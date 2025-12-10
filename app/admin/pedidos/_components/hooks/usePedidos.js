"use client";

import { useState, useEffect } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useToast } from "@/hooks/use-toast";

export function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchData } = useFetch();
  const { toast } = useToast();

  const fetchPedidos = async (filters = {}) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.fecha_inicio)
      params.append("fecha_inicio", filters.fecha_inicio);
    if (filters.fecha_fin) params.append("fecha_fin", filters.fecha_fin);
    if (filters.estado) params.append("estado", filters.estado);
    if (filters.zona_id) params.append("zona_id", filters.zona_id);

    const url = `/admin/pedidos${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const result = await fetchData(url);

    if (result.success) {
      setPedidos(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los pedidos",
      });
    }
    setLoading(false);
  };

  const confirmarPedido = async (pedidoId) => {
    const result = await fetchData(
      `/admin/pedidos/${pedidoId}/confirmar`,
      "PATCH"
    );

    if (result.success) {
      toast({
        title: "Éxito",
        description: "Pedido confirmado correctamente",
      });
      // Recargar pedidos después de confirmar
      await fetchPedidos();
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "No se pudo confirmar el pedido",
      });
      return false;
    }
  };

  const reasignarDelivery = async (pedidoId, deliveryId) => {
    const result = await fetchData(
      `/admin/pedidos/${pedidoId}/reasignar`,
      "PATCH",
      { nuevo_delivery_id: deliveryId }
    );

    if (result.success) {
      toast({
        title: "Éxito",
        description: "Delivery reasignado correctamente",
      });
      // Recargar pedidos después de reasignar
      await fetchPedidos();
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "No se pudo reasignar el delivery",
      });
      return false;
    }
  };

  const cancelarPedido = async (pedidoId) => {
    const result = await fetchData(
      `/admin/pedidos/${pedidoId}/cancelar`,
      "PATCH"
    );

    if (result.success) {
      toast({
        title: "Éxito",
        description: "Pedido cancelado correctamente",
      });
      // Recargar pedidos después de cancelar
      await fetchPedidos();
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "No se pudo cancelar el pedido",
      });
      return false;
    }
  };

  const cambiarEstado = async (pedidoId, nuevoEstado) => {
    // Intentamos usar el endpoint de admin para forzar cambios
    const result = await fetchData(
      `/admin/pedidos/${pedidoId}/estado`,
      "PATCH",
      { estado: nuevoEstado }
    );

    if (result.success) {
      toast({
        title: "Éxito",
        description: `Pedido actualizado a: ${nuevoEstado}`,
      });
      // Recargar pedidos después del cambio
      await fetchPedidos();
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "No se pudo actualizar el estado",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return {
    pedidos,
    loading,
    fetchPedidos,
    confirmarPedido,
    reasignarDelivery,
    cancelarPedido,
    cambiarEstado,
  };
}
