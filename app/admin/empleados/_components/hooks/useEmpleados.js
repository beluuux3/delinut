import { useState, useEffect } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useToast } from "@/hooks/use-toast";

export function useEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchData } = useFetch();
  const { toast } = useToast();

  const fetchEmpleados = async () => {
    setLoading(true);
    const result = await fetchData("/admin/empleados");

    if (result.success) {
      setEmpleados(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los empleados",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  return { empleados, loading, refetch: fetchEmpleados };
}

export function useZonas() {
  const [zonas, setZonas] = useState([]);
  const { fetchData } = useFetch();

  const fetchZonas = async () => {
    // Usar el endpoint público del catálogo
    const result = await fetchData("/catalogo/zonas", "GET");

    if (result.success && result.data) {
      setZonas(result.data);
    }
  };

  const addZona = (nuevaZona) => {
    setZonas((prevZonas) => {
      // Verificar si la zona ya existe
      const exists = prevZonas.some((z) => z.zona_id === nuevaZona.zona_id);
      if (exists) {
        return prevZonas;
      }
      return [...prevZonas, nuevaZona];
    });
  };

  useEffect(() => {
    fetchZonas();
  }, []);

  return { zonas, refetchZonas: fetchZonas, addZona };
}
