"use client";

import { useState, useCallback } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useToast } from "@/hooks/use-toast";

export function useDelivery() {
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchData } = useFetch();
  const { toast } = useToast();

  const fetchMisEntregas = useCallback(async () => {
    setLoading(true);
    const result = await fetchData("/delivery/mis-entregas");
    if (result.success) {
      setEntregas(result.data);
    } else {
      console.error("Error fetching entregas:", result.error);
      setEntregas([]);
      toast({
        variant: "destructive",
        title: "Error al cargar entregas",
        description: result.error || "No se pudieron cargar tus entregas",
      });
    }
    setLoading(false);
  }, [fetchData, toast]);

  const tomarPedido = async (pedidoId) => {
    const result = await fetchData(
      `/delivery/pedidos/${pedidoId}/tomar`,
      "PATCH"
    );

    if (result.success) {
      toast({
        title: "Pedido tomado",
        description: `Pedido #${pedidoId} marcado como En Reparto`,
      });
      fetchMisEntregas();
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "No se pudo tomar el pedido",
      });
      return false;
    }
  };

  const finalizarPedido = async (pedidoId, confirmarPago = false) => {
    const result = await fetchData(
      `/delivery/pedidos/${pedidoId}/finalizar`,
      "PATCH",
      { confirmar_pago: confirmarPago }
    );

    if (result.success) {
      toast({
        title: "Entrega finalizada",
        description: `Pedido #${pedidoId} marcado como Entregado`,
      });
      fetchMisEntregas();
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "No se pudo finalizar la entrega",
      });
      return false;
    }
  };

  return {
    entregas,
    loading,
    fetchMisEntregas,
    tomarPedido,
    finalizarPedido,
  };
}
