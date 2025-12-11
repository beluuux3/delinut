"use client";

import { useState, useEffect } from "react";
import { Upload, X, Loader2, Plus, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useFetch } from "@/hooks/useFetch";

export default function PlatoFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEdit,
  isViewMode,
}) {
  const [uploading, setUploading] = useState(false);
  const [inventario, setInventario] = useState([]);
  const [loadingInventario, setLoadingInventario] = useState(false);
  const { toast } = useToast();
  const { fetchData } = useFetch();

  // Cargar inventario cuando se abre el modal
  useEffect(() => {
    if (isOpen && !isViewMode) {
      fetchInventario();
    }
  }, [isOpen]);

  const fetchInventario = async () => {
    setLoadingInventario(true);
    try {
      const result = await fetchData("/admin/ingredientes");
      if (result.success) {
        setInventario(result.data);
      } else {
        console.error("Error al cargar inventario:", result.error);
      }
    } catch (error) {
      console.error("Error al cargar inventario:", error);
    } finally {
      setLoadingInventario(false);
    }
  };

  const agregarIngrediente = () => {
    const ingredientesActuales = formData.ingredientes || [];
    setFormData({
      ...formData,
      ingredientes: [...ingredientesActuales, { ingrediente_id: "" }],
    });
  };

  const eliminarIngrediente = (index) => {
    const ingredientesActuales = [...(formData.ingredientes || [])];
    ingredientesActuales.splice(index, 1);
    setFormData({ ...formData, ingredientes: ingredientesActuales });
  };

  const actualizarIngrediente = (index, campo, valor) => {
    const ingredientesActuales = [...(formData.ingredientes || [])];

    if (campo === "ingrediente_id") {
      ingredientesActuales[index] = {
        ...ingredientesActuales[index],
        ingrediente_id: valor,
      };
    } else {
      ingredientesActuales[index][campo] = valor;
    }

    setFormData({ ...formData, ingredientes: ingredientesActuales });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Solo se permiten archivos de imagen",
      });
      return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const token = Cookies.get("token");
      const response = await fetch(
        "https://backend-solandre.onrender.com/upload/image",
        {
          method: "POST",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: formDataUpload,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al subir imagen:", errorText);
        throw new Error("Error al subir imagen");
      }

      // La API devuelve un string que puede ser una URL directa o un objeto JSON
      let responseText = await response.text();

      // Remover comillas externas si existen
      responseText = responseText.replace(/^["']|["']$/g, "");

      let finalUrl = responseText;

      // Intentar parsear como JSON
      try {
        const parsed = JSON.parse(responseText);
        // Si es un objeto con propiedad 'url', extraerla
        if (parsed.url) {
          finalUrl = parsed.url;
        }
      } catch (e) {
        // Si no es JSON válido, verificar si es un string con formato de objeto

        // Si ya es una URL directa (empieza con http)
        if (responseText.startsWith("http")) {
          finalUrl = responseText;
        }
        // Si tiene formato {url:...,public_id:...} sin comillas
        else if (responseText.includes("{url:")) {
          const match = responseText.match(/url:([^,}]+)/);
          if (match && match[1]) {
            finalUrl = match[1].trim();
          }
        }
        // Si tiene formato con comillas {"url":"...","public_id":"..."}
        else if (responseText.includes('{"url"')) {
          const match = responseText.match(/"url":"([^"]+)"/);
          if (match && match[1]) {
            finalUrl = match[1];
          }
        }
      }

      setFormData({ ...formData, imagen_url: finalUrl });
      toast({
        title: "Éxito",
        description: "Imagen subida correctamente",
      });
    } catch (error) {
      console.error("Error completo:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "No se pudo subir la imagen",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, imagen_url: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {isViewMode
              ? "Ver Plato"
              : isEdit
              ? "Editar Plato"
              : "Crear Nuevo Plato"}
          </DialogTitle>
          <DialogDescription>
            {isViewMode ? "Detalles del plato" : "Completa los datos del plato"}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={onSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="space-y-4 py-4 overflow-y-auto px-1">
            {/* Contenedor con scroll */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Plato</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Ej: Pollo al horno"
                disabled={isViewMode}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) =>
                  setFormData({ ...formData, tipo: value })
                }
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Principal">Principal</SelectItem>
                  <SelectItem value="Acompanamiento">Acompañamiento</SelectItem>
                  <SelectItem value="Bebida">Bebida</SelectItem>
                  <SelectItem value="Postre">Postre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imagen">Imagen (opcional)</Label>
              {formData.imagen_url ? (
                <div className="relative">
                  <img
                    src={formData.imagen_url}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  {!isViewMode && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ) : (
                !isViewMode && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="imagen"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <label
                      htmlFor="imagen"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {uploading ? (
                        <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
                      ) : (
                        <Upload className="h-10 w-10 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-600">
                        {uploading ? "Subiendo..." : "Click para subir imagen"}
                      </span>
                    </label>
                  </div>
                )
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción (opcional)</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="Describe el plato..."
                className="min-h-20"
                disabled={isViewMode}
              />
            </div>

            {/* Sección de Ingredientes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Ingredientes</Label>
                {!isViewMode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={agregarIngrediente}
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                )}
              </div>

              {loadingInventario ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-600">
                    Cargando inventario...
                  </span>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {(formData.ingredientes || []).length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No hay ingredientes agregados
                    </p>
                  ) : (
                    (formData.ingredientes || []).map((ingrediente, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-end p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <Label className="text-xs">Ingrediente</Label>
                          <Select
                            value={String(ingrediente.ingrediente_id)}
                            onValueChange={(value) =>
                              actualizarIngrediente(
                                index,
                                "ingrediente_id",
                                value
                              )
                            }
                            disabled={isViewMode}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {inventario.map((inv) => (
                                <SelectItem
                                  key={inv.ingrediente_id}
                                  value={String(inv.ingrediente_id)}
                                >
                                  {inv.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {!isViewMode && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => eliminarIngrediente(index)}
                            className="h-9 w-9 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {isViewMode && (formData.ingredientes || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.ingredientes || []).map((ing, idx) => {
                    const ingredienteInfo = inventario.find(
                      (inv) =>
                        inv.ingrediente_id === parseInt(ing.ingrediente_id)
                    );
                    return (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {ing.nombre ||
                          ingredienteInfo?.nombre ||
                          `ID: ${ing.ingrediente_id}`}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {isViewMode ? "Cerrar" : "Cancelar"}
            </Button>
            {!isViewMode && (
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isEdit ? "Guardar Cambios" : "Crear Plato"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
