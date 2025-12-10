"use client";

"use client";

import { useState, Suspense, useEffect } from "react";
import { Search, Plus, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import GenericTable from "@/components/shared/GenericTable";
import IngredienteFormModal from "./_components/IngredienteFormModal";
import { useIngredientes } from "./_components/hooks/useIngredientes";

export default function InventarioPage() {
  const { ingredientes, loading, createIngrediente, updateIngrediente } =
    useIngredientes();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentIngredienteId, setCurrentIngredienteId] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    stock_actual: 0,
  });

  // Detectar ingredientes con stock bajo
  useEffect(() => {
    const lowStock = ingredientes.filter(
      (ing) => parseFloat(ing.stock_actual) < 20
    );
    setLowStockItems(lowStock);
  }, [ingredientes]);

  const openModal = (
    ingrediente = null,
    viewMode = false,
    editMode = false
  ) => {
    setIsViewMode(viewMode);
    setIsEdit(editMode);
    setCurrentIngredienteId(ingrediente?.ingrediente_id || null);
    setFormData(
      ingrediente
        ? {
            nombre: ingrediente.nombre,
            stock_actual: parseFloat(ingrediente.stock_actual),
          }
        : { nombre: "", stock_actual: 0 }
    );
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = isEdit
      ? await updateIngrediente(currentIngredienteId, formData)
      : await createIngrediente(formData);
    if (success) setIsModalOpen(false);
  };

  const filteredIngredientes = ingredientes.filter((ingrediente) =>
    ingrediente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ingredientesColumns = [
    {
      header: "Nº",
      key: "index",
      render: (_, index) => index + 1,
    },
    {
      header: "Nombre",
      key: "nombre",
      cellClassName: "font-medium",
    },
    {
      header: "Stock Actual",
      key: "stock_actual",
      render: (ingrediente) => (
        <span className="font-semibold">
          {parseFloat(ingrediente.stock_actual).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Estado",
      key: "estado",
      render: (ingrediente) => {
        const stock = parseFloat(ingrediente.stock_actual);
        const getStockBadge = (stock) => {
          if (stock < 20) return "bg-red-100 text-red-800";
          if (stock < 50) return "bg-yellow-100 text-yellow-800";
          return "bg-green-100 text-green-800";
        };
        return (
          <Badge className={getStockBadge(stock)}>
            {stock < 20 ? "Bajo" : stock < 50 ? "Medio" : "Disponible"}
          </Badge>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando inventario...</p>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
            <p className="text-gray-600 mt-1">
              Controla el inventario de ingredientes y suministros
            </p>
          </div>

          {/* Alerta de Stock Bajo */}
          {lowStockItems.length > 0 && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <AlertTitle className="text-red-800 font-bold">
                Alerta: {lowStockItems.length} ingrediente(s) con stock bajo
              </AlertTitle>
              <AlertDescription className="text-red-700">
                <div className="mt-2 space-y-1">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.ingrediente_id}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium">{item.nombre}</span>
                      <Badge variant="destructive" className="ml-2">
                        {parseFloat(item.stock_actual).toFixed(2)}
                      </Badge>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm">
                  Considera reabastecer estos ingredientes pronto para evitar
                  interrupciones en la producción.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar ingredientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => openModal()}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Ingrediente
              </Button>
            </div>

            <GenericTable
              data={filteredIngredientes.map((ing, idx) => ({
                ...ing,
                index: idx,
                id: ing.ingrediente_id,
              }))}
              columns={ingredientesColumns}
              onView={(ingrediente) => openModal(ingrediente, true, false)}
              onEdit={(ingrediente) => openModal(ingrediente, false, true)}
              emptyMessage="No hay ingredientes registrados"
            />
          </div>
        </div>
      </Suspense>

      <IngredienteFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        isEdit={isEdit}
        isViewMode={isViewMode}
      />
    </>
  );
}
