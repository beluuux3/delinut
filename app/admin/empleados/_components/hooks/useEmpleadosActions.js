import { useFetch } from "@/hooks/useFetch";
import { useToast } from "@/hooks/use-toast";

export function useEmpleadosActions(refetch) {
  const { fetchData } = useFetch();
  const { toast } = useToast();

  const createEmpleado = async (formData) => {
    const payload = { ...formData };

    if (!payload.password) delete payload.password;
    if (payload.rol_id !== 3) delete payload.zona_reparto_id;

    const result = await fetchData("/admin/empleados", "POST", payload);

    if (result.success) {
      toast({
        title: "Éxito",
        description: "Empleado creado correctamente",
      });
      refetch();
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "No se pudo crear el empleado",
      });
      return false;
    }
  };

  const updateEmpleado = async (empleadoId, formData) => {
    const payload = {
      email: formData.email,
      nombre_completo: formData.nombre_completo,
      telefono: formData.telefono,
      rol_id: formData.rol_id,
    };

    // La contraseña es obligatoria por validación del backend
    payload.password = formData.password;

    // Solo agregar zona_reparto_id si el rol es Delivery (rol_id = 3)
    if (formData.rol_id === 3 && formData.zona_reparto_id) {
      payload.zona_reparto_id = formData.zona_reparto_id;
    }

    const result = await fetchData(
      `/admin/empleados/${empleadoId}`,
      "PUT",
      payload
    );

    if (result.success) {
      // Si es delivery y se especificó una zona, actualizar la zona también
      if (formData.rol_id === 3 && formData.zona_reparto_id) {
        await assignZona(empleadoId, {
          zona_reparto_id: formData.zona_reparto_id,
        });
      }

      toast({
        title: "Éxito",
        description: "Empleado actualizado correctamente",
      });
      refetch();
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "No se pudo actualizar el empleado",
      });
      return false;
    }
  };

  const deleteEmpleado = async (empleadoId) => {
    const result = await fetchData(`/admin/empleados/${empleadoId}`, "DELETE");

    if (result.success) {
      toast({
        title: "Éxito",
        description: "Empleado desactivado correctamente",
      });
      refetch();
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "No se pudo desactivar el empleado.",
      });
      return false;
    }
  };

  const assignZona = async (empleadoId, zonaData) => {
    const result = await fetchData(
      `/admin/empleados/${empleadoId}/zona`,
      "PATCH",
      zonaData
    );

    if (result.success) {
      toast({
        title: "Éxito",
        description: "Zona asignada correctamente",
      });
      refetch();
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "No se pudo asignar la zona",
      });
      return false;
    }
  };

  return { createEmpleado, updateEmpleado, deleteEmpleado, assignZona };
}
