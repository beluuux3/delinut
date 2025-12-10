"use client";

import { useState, useEffect } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useToast } from "@/hooks/use-toast";

export function useIngredientes() {
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchData } = useFetch();
  const { toast } = useToast();

  const fetchIngredientes = async () => {
    setLoading(true);
    const result = await fetchData("/admin/ingredientes");
    if (result.success) {
      setIngredientes(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los ingredientes",
      });
    }
    setLoading(false);
  };

  const createIngrediente = async (data) => {
    const result = await fetchData("/admin/ingredientes", "POST", data);
    if (result.success) {
      toast({
        title: "Éxito",
        description: "Ingrediente creado correctamente",
      });
      fetchIngredientes();
      return true;
    }
    toast({
      variant: "destructive",
      title: "Error",
      description: result.error,
    });
    return false;
  };

  const updateIngrediente = async (ingredienteId, data) => {
    const result = await fetchData(
      `/admin/ingredientes/${ingredienteId}`,
      "PUT",
      data
    );
    if (result.success) {
      toast({
        title: "Éxito",
        description: "Ingrediente actualizado correctamente",
      });
      fetchIngredientes();
      return true;
    }
    toast({
      variant: "destructive",
      title: "Error",
      description: result.error,
    });
    return false;
  };

  useEffect(() => {
    fetchIngredientes();
  }, []);

  return {
    ingredientes,
    loading,
    createIngrediente,
    updateIngrediente,
    refetch: fetchIngredientes,
  };
}
