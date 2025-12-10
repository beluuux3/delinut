"use client";

import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MenuHeader({
  onCreateClick,
  currentWeek,
  onWeekChange,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menú Semanal</h1>
          <p className="text-gray-600 mt-1">
            Gestiona el menú para cada día de la semana
          </p>
        </div>
        <Button
          onClick={onCreateClick}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
        >
          <Plus className="h-4 w-4 mr-2 text-white" />
          Agregar Menú del Día
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onWeekChange(-1)}
          className="text-sm"
        >
          ← Semana Anterior
        </Button>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">{currentWeek}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onWeekChange(1)}
          className="text-sm"
        >
          Semana Siguiente →
        </Button>
      </div>
    </div>
  );
}
