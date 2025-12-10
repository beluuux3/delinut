import { useFetch } from "@/hooks/useFetch";
import { useToast } from "@/hooks/use-toast";
import { useInventoryReduction } from "./useInventoryReduction";

export function useMenuActions(refetch) {
  const { fetchData } = useFetch();
  const { toast } = useToast();
  const { reduceInventory } = useInventoryReduction();

  const createMenu = async (menuData) => {
    // Primero verificar y reducir inventario si se especifica cantidad
    if (menuData.cantidad_disponible && menuData.cantidad_disponible > 0) {
      const inventoryResult = await reduceInventory(
        menuData.plato_principal_id,
        menuData.bebida_id,
        menuData.postre_id,
        menuData.cantidad_disponible
      );

      // Mostrar advertencias de stock bajo si existen
      if (inventoryResult.lowStockWarnings.length > 0) {
        const warnings = inventoryResult.lowStockWarnings.filter(
          (w) => w.severity === "warning"
        );
        const errors = inventoryResult.lowStockWarnings.filter(
          (w) => w.severity === "error"
        );

        if (errors.length > 0) {
          const errorMessage = errors
            .map((e) => {
              if (e.motivo === "Stock insuficiente") {
                return `${e.nombre}: necesitas ${e.necesario}${e.unidad}, solo hay ${e.disponible}${e.unidad}`;
              }
              return `${e.nombre}: ${e.motivo}`;
            })
            .join("; ");

          toast({
            variant: "destructive",
            title: "⚠️ Stock Insuficiente",
            description: `No se puede crear el menú. ${errorMessage}`,
            duration: 10000,
          });
          return false;
        }

        if (warnings.length > 0) {
          const warningMessage = warnings
            .map(
              (w) =>
                `${w.nombre} quedará en ${w.stockRestante.toFixed(2)}${
                  w.unidad
                }`
            )
            .join("; ");

          toast({
            title: "⚠️ Alerta de Stock Bajo",
            description: `Menú creado pero: ${warningMessage}. Considera reabastecer pronto.`,
            duration: 8000,
          });
        }
      }

      if (!inventoryResult.success) {
        toast({
          variant: "destructive",
          title: "Error de Inventario",
          description:
            "No se pudo actualizar el inventario. El menú no fue creado.",
        });
        return false;
      }
    }

    // Crear el menú
    console.log("Sending create menu payload:", menuData);
    const result = await fetchData("/admin/menu", "POST", menuData);

    if (result.success) {
      toast({
        title: "Éxito",
        description: "Menú del día creado correctamente",
      });
      refetch();
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          typeof result.error === "object"
            ? JSON.stringify(result.error)
            : result.error || "No se pudo crear el menú",
      });
      return false;
    }
  };

  const updateMenu = async (menuId, menuData) => {
    const result = await fetchData(`/admin/menu/${menuId}`, "PUT", menuData);

    if (result.success) {
      // Verificar si los datos fueron actualizados correctamente
      const changes = [];
      if (result.data.bebida_id !== menuData.bebida_id) {
        changes.push(
          `Bebida (esperado: ${menuData.bebida_id}, recibido: ${result.data.bebida_id})`
        );
      }
      if (result.data.postre_id !== menuData.postre_id) {
        changes.push(
          `Postre (esperado: ${menuData.postre_id}, recibido: ${result.data.postre_id})`
        );
      }
      if (result.data.plato_principal_id !== menuData.plato_principal_id) {
        changes.push(
          `Plato Principal (esperado: ${menuData.plato_principal_id}, recibido: ${result.data.plato_principal_id})`
        );
      }

      if (changes.length > 0) {
        toast({
          variant: "destructive",
          title: "Error del Servidor",
          description: `El backend no guardó estos cambios: ${changes.join(
            ", "
          )}. Este es un problema del servidor que debe ser corregido.`,
          duration: 10000,
        });
        return false;
      }

      toast({
        title: "Éxito",
        description: "Menú actualizado correctamente",
      });
      await refetch();
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "No se pudo actualizar el menú",
      });
      return false;
    }
  };

  const deleteMenu = async (menuId) => {
    const result = await fetchData(`/admin/menu/${menuId}`, "DELETE");

    if (result.success) {
      toast({
        title: "Éxito",
        description: "Menú eliminado correctamente",
      });
      refetch();
      return true;
    } else {
      console.error("Error deleting menu:", result.error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          typeof result.error === "object"
            ? JSON.stringify(result.error)
            : result.error || "No se pudo eliminar el menú",
      });
      return false;
    }
  };

  return { createMenu, updateMenu, deleteMenu };
}
