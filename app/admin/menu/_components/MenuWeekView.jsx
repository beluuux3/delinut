"use client";

import { Pencil, Trash2, Eye, EyeOff, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export default function MenuWeekView({
  menus,
  weekDates,
  onEdit,
  onDelete,
  onCreate,
}) {
  const getMenuForDate = (date) => {
    // Format date as YYYY-MM-DD using local time
    const formattedDate = date.toLocaleDateString("en-CA");
    return menus.find((menu) => menu.fecha === formattedDate);
  };

  const formatDate = (date) => {
    // Handle both Date objects and date strings
    const dateObj = date instanceof Date ? date : new Date(date + "T00:00:00");
    return dateObj.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {weekDates.map((date, index) => {
        const menu = getMenuForDate(date);
        const dia = DIAS_SEMANA[index % 5];

        return (
          <Card
            key={date}
            className={`${
              menu
                ? "border-orange-200 bg-orange-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-gray-900">{dia}</CardTitle>
                  <CardDescription className="text-sm">
                    {formatDate(date)}
                  </CardDescription>
                </div>
                {menu && (
                  <div className="flex items-center gap-1">
                    {menu.publicado ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {menu ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-600">
                      Plato Principal
                    </p>
                    <p className="text-sm text-gray-900">
                      {menu.plato_principal_nombre || "No asignado"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-600">Bebida</p>
                    <p className="text-sm text-gray-900">
                      {menu.bebida_nombre || "No asignado"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-600">Postre</p>
                    <p className="text-sm text-gray-900">
                      {menu.postre_nombre || "No asignado"}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Precio:</span>
                      <span className="font-semibold text-orange-600">
                        Bs. {menu.precio_menu}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600">Disponible:</span>
                      <span className="font-medium text-gray-900">
                        {menu.cantidad_disponible}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(menu)}
                      className="flex-1 h-8 text-xs"
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(menu.menu_dia_id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-400 mb-3">
                    Sin menú asignado
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit({ fecha: date })}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Crear Menú
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
