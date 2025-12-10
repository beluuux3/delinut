"use client";

import { useState, Suspense } from "react";
import MenuHeader from "./_components/MenuHeader";
import MenuWeekView from "./_components/MenuWeekView";
import MenuFormModal from "./_components/MenuFormModal";
import { useMenu, usePlatos } from "./_components/hooks/useMenu";
import { useMenuActions } from "./_components/hooks/useMenuActions";
import { useToast } from "@/hooks/use-toast";

export default function MenuPage() {
  const { menus, loading: loadingMenus, refetch: refetchMenus } = useMenu();
  const { platos, loading: loadingPlatos } = usePlatos();
  const { createMenu, updateMenu, deleteMenu } = useMenuActions(refetchMenus);
  const { toast } = useToast();

  const [weekOffset, setWeekOffset] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentMenuId, setCurrentMenuId] = useState(null);
  const [formData, setFormData] = useState({
    fecha: "",
    plato_principal_id: null,
    bebida_id: null,
    postre_id: null,
    info_nutricional: "",
    cantidad_disponible: 50,
    precio_menu: 0,
    publicado: true, // ✅ Publicado por defecto
  });

  // Calculate dates for the current week based on offset
  const getWeekDates = (offset = 0) => {
    const dates = [];
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);

    // Get Monday of current week
    const daysFromMonday = currentDay === 0 ? -6 : 1 - currentDay;
    monday.setDate(today.getDate() + daysFromMonday);

    // Add weeks offset
    monday.setDate(monday.getDate() + offset * 7);

    // Generate 5 days starting from Monday (Monday to Friday)
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const weekDates = getWeekDates(weekOffset);

  // Format week display
  const getWeekDisplay = () => {
    const firstDay = weekDates[0];
    const lastDay = weekDates[4];
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const firstMonth = monthNames[firstDay.getMonth()];
    const lastMonth = monthNames[lastDay.getMonth()];

    if (firstMonth === lastMonth) {
      return `${firstDay.getDate()} - ${lastDay.getDate()} de ${firstMonth} ${lastDay.getFullYear()}`;
    }

    return `${firstDay.getDate()} de ${firstMonth} - ${lastDay.getDate()} de ${lastMonth} ${lastDay.getFullYear()}`;
  };

  const handleCreateClick = (prefilledDate = null) => {
    setIsEdit(false);
    setCurrentMenuId(null);
    // Format date as YYYY-MM-DD if it's a Date object
    let formattedDate = "";
    if (prefilledDate) {
      const dateObj =
        prefilledDate instanceof Date ? prefilledDate : new Date(prefilledDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split("T")[0];
      }
    }
    setFormData({
      fecha: formattedDate,
      plato_principal_id: null,
      bebida_id: null,
      postre_id: null,
      info_nutricional: "",
      cantidad_disponible: 50,
      precio_menu: 0,
      publicado: true, // ✅ Publicado por defecto
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (menu) => {
    setIsEdit(true);
    setCurrentMenuId(menu.menu_dia_id);
    setFormData({
      fecha: menu.fecha ? new Date(menu.fecha).toISOString().split("T")[0] : "",
      plato_principal_id: menu.plato_principal_id,
      bebida_id: menu.bebida_id || "none",
      postre_id: menu.postre_id || "none",
      info_nutricional: menu.info_nutricional || "",
      cantidad_disponible: menu.cantidad_disponible,
      precio_menu: menu.precio_menu,
      publicado: menu.publicado,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (menuId) => {
    if (confirm("¿Estás seguro de eliminar este menú?")) {
      await deleteMenu(menuId);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const menuData = {
      ...formData,
      plato_principal_id: formData.plato_principal_id || null,
      bebida_id:
        formData.bebida_id === "none" || !formData.bebida_id
          ? null
          : parseInt(formData.bebida_id),
      postre_id:
        formData.postre_id === "none" || !formData.postre_id
          ? null
          : parseInt(formData.postre_id),
    };

    if (!menuData.plato_principal_id) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "Debes seleccionar un plato principal",
      });
      return;
    }

    if (menuData.precio_menu <= 0) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "El precio del menú debe ser mayor a 0",
      });
      return;
    }

    if (menuData.cantidad_disponible <= 0) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "La cantidad disponible debe ser mayor a 0",
      });
      return;
    }

    if (!menuData.fecha) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "La fecha es requerida",
      });
      return;
    }

    console.log("Submitting menu data:", menuData);

    let success = false;
    if (isEdit && currentMenuId) {
      success = await updateMenu(currentMenuId, menuData);
    } else {
      success = await createMenu(menuData);
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleWeekChange = (direction) => {
    setWeekOffset((prev) => prev + direction);
  };

  if (loadingMenus || loadingPlatos) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando menús...</div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando menús...</div>
        </div>
      }
    >
      <div className="space-y-6">
        <MenuHeader
          onCreateClick={() => handleCreateClick()}
          currentWeek={getWeekDisplay()}
          onWeekChange={handleWeekChange}
        />
        <MenuWeekView
          menus={menus}
          weekDates={weekDates}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onCreate={handleCreateClick}
        />
        <MenuFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          formData={formData}
          setFormData={setFormData}
          platos={platos}
          isEdit={isEdit}
        />
      </div>
    </Suspense>
  );
}
