import { useState, useEffect } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useToast } from "@/hooks/use-toast";

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const { fetchData } = useFetch();
  const { toast } = useToast();

  const fetchClientes = async () => {
    const result = await fetchData("/admin/clientes");
    if (result.success) setClientes(result.data);
  };

  const fetchHistorial = async (clienteId) => {
    const result = await fetchData(`/admin/clientes/${clienteId}/historial`);
    if (result.success) {
      return result.data;
    }
    toast({
      variant: "destructive",
      title: "Error",
      description: "No se pudo cargar el historial",
    });
    return null;
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return {
    clientes,
    fetchHistorial,
  };
}
