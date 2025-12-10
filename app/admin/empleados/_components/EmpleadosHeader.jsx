"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EmpleadosHeader({
  onCreateClick,
  searchTerm,
  onSearchChange,
}) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Empleados</h1>
        <p className="text-gray-600 mt-1">
          Gestiona los empleados de cocina y delivery
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={onCreateClick}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
        >
          <Plus className="h-4 w-4 mr-2 text-white" />
          Crear Empleado
        </Button>
      </div>
    </div>
  );
}
