import { useState, useEffect } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useToast } from "@/hooks/use-toast";

export function useMenu() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchData } = useFetch();
  const { toast } = useToast();

  const fetchMenus = async () => {
    setLoading(true);

    // Fetch menus and platos in parallel
    const [menusResult, platosResult] = await Promise.all([
      fetchData("/admin/menu"),
      fetchData("/admin/platos"),
    ]);

    if (menusResult.success && platosResult.success) {
      // Create a map of plato_id to plato for quick lookup
      const platosMap = {};
      platosResult.data.forEach((plato) => {
        platosMap[plato.plato_id] = plato;
      });

      // Enrich menus with plato names
      const enrichedMenus = menusResult.data.map((menu) => ({
        ...menu,
        plato_principal_nombre:
          platosMap[menu.plato_principal_id]?.nombre || null,
        bebida_nombre: platosMap[menu.bebida_id]?.nombre || null,
        postre_nombre: platosMap[menu.postre_id]?.nombre || null,
      }));

      console.log("🔄 Menús actualizados:", enrichedMenus);
      setMenus(enrichedMenus);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los menús",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return { menus, loading, refetch: fetchMenus };
}

export function usePlatos() {
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchData } = useFetch();

  const fetchPlatos = async () => {
    setLoading(true);
    const result = await fetchData("/admin/platos");

    if (result.success) {
      setPlatos(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlatos();
  }, []);

  return { platos, loading };
}
