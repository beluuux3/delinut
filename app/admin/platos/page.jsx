"use client";

import { Suspense, lazy } from "react";
import { useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usePlatos } from "./_components/hooks/usePlatos";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PlatoFormModal = lazy(() => import("./_components/PlatoFormModal"));

export default function PlatosPage() {
  const { platos, createPlato, updatePlato, deletePlato, getPlatoById } =
    usePlatos();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPlatoId, setCurrentPlatoId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [platoToDelete, setPlatoToDelete] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "Principal",
    descripcion: "",
    imagen_url: "",
    ingredientes: [],
  });

  const openModal = async (
    plato = null,
    viewMode = false,
    editMode = false
  ) => {
    setIsViewMode(viewMode);
    setIsEdit(editMode);
    setCurrentPlatoId(plato?.plato_id || null);

    if (plato) {
      // Fetch full details including ingredients with quantity
      let fullPlato = plato;
      if (getPlatoById) {
        console.log("Fetching details for plato:", plato.plato_id);
        const details = await getPlatoById(plato.plato_id);
        console.log("Details received:", details);
        if (details) {
          fullPlato = details;
        } else {
          console.error("Failed to fetch details for plato:", plato.plato_id);
        }
      }

      // Extraer la URL correcta si viene en formato objeto
      const cleanImageUrl = extractImageUrl(fullPlato.imagen_url) || "";

      setFormData({
        nombre: fullPlato.nombre,
        descripcion: fullPlato.descripcion || "",
        tipo: fullPlato.tipo,
        imagen_url: cleanImageUrl,
        ingredientes: (fullPlato.ingredientes || []).map((ing) => ({
          ingrediente_id: ing.ingrediente_id,
          nombre: ing.nombre,
        })),
      });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        tipo: "Principal",
        imagen_url: "",
        ingredientes: [],
      });
    }

    setIsModalOpen(true);
  };

  const handleDeleteClick = (plato) => {
    setPlatoToDelete(plato);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (platoToDelete) {
      await deletePlato(platoToDelete.plato_id);
      setDeleteDialogOpen(false);
      setPlatoToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre es requerido",
      });
      return;
    }
    if (!formData.tipo) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El tipo es requerido",
      });
      return;
    }

    // Procesar ingredientes para asegurar tipos correctos
    const ingredientesProcesados = (formData.ingredientes || [])
      .filter((ing) => ing.ingrediente_id)
      .map((ing) => ({
        ingrediente_id: parseInt(ing.ingrediente_id),
      }));

    const dataToSend = {
      nombre: formData.nombre.trim(),
      tipo: formData.tipo,
      descripcion: formData.descripcion.trim() || "",
      imagen_url: formData.imagen_url || "",
      ingredientes: ingredientesProcesados,
    };

    console.log("Enviando datos del plato:", dataToSend);

    const success = isEdit
      ? await updatePlato(currentPlatoId, dataToSend)
      : await createPlato(dataToSend);

    console.log("Resultado de la operación:", success);

    if (success) setIsModalOpen(false);
  };

  const filteredPlatos = platos.filter(
    (plato) =>
      plato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plato.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (plato.descripcion &&
        plato.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Agrupar platos por tipo
  const platosPorTipo = {
    Principal: filteredPlatos.filter((p) => p.tipo === "Principal"),
    Acompanamiento: filteredPlatos.filter((p) => p.tipo === "Acompanamiento"),
    Postre: filteredPlatos.filter((p) => p.tipo === "Postre"),
    Bebida: filteredPlatos.filter((p) => p.tipo === "Bebida"),
  };

  const getTipoColor = (tipo) => {
    const colors = {
      Principal: "bg-orange-100 text-orange-800 border-orange-200",
      Acompanamiento: "bg-green-100 text-green-800 border-green-200",
      Bebida: "bg-blue-100 text-blue-800 border-blue-200",
      Postre: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[tipo] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Función helper para extraer URL de imagen
  const extractImageUrl = (imagenUrl) => {
    if (!imagenUrl) return null;

    // Si ya es una URL válida, devolverla
    if (imagenUrl.startsWith("http")) return imagenUrl;

    try {
      // Intentar parsear como JSON directamente
      const parsed = JSON.parse(imagenUrl);
      if (parsed.url) return parsed.url;
    } catch (e) {
      // No es JSON válido, continuar con otras opciones
    }

    // Si contiene el formato {url:...,public_id:...}, extraer la URL
    if (imagenUrl.includes("{url:") || imagenUrl.includes('{"url"')) {
      // Intentar con regex para extraer la URL
      const match = imagenUrl.match(/"url":"([^"]+)"|url:([^,}]+)/);
      if (match) {
        return match[1] || match[2]?.trim();
      }
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platos</h1>
        <p className="text-gray-600 mt-1">
          Gestiona el catálogo de platos disponibles
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar platos..."
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
            Crear Plato
          </Button>
        </div>

        <Suspense
          fallback={<div className="text-center py-8">Cargando platos...</div>}
        >
          {filteredPlatos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">No hay platos registrados</p>
              <p className="text-sm mt-1">Crea tu primer plato para comenzar</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Sección: Platos Principales */}
              {platosPorTipo.Principal.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Platos Principales
                    </h2>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                      {platosPorTipo.Principal.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {platosPorTipo.Principal.map((plato) => {
                      const imageUrl = extractImageUrl(plato.imagen_url);

                      return (
                        <div
                          key={plato.plato_id}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                        >
                          {/* Imagen */}
                          <div className="relative h-48 bg-gray-100">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={plato.nombre}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error(
                                    "Error cargando imagen:",
                                    imageUrl
                                  );
                                  e.target.style.display = "none";
                                  e.target.nextElementSibling.style.display =
                                    "flex";
                                }}
                              />
                            ) : null}
                            {!imageUrl && (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageOff className="h-12 w-12 text-gray-300" />
                              </div>
                            )}
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{ display: imageUrl ? "none" : "none" }}
                            >
                              <ImageOff className="h-12 w-12 text-gray-300" />
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge className={getTipoColor(plato.tipo)}>
                                {plato.tipo}
                              </Badge>
                            </div>
                          </div>

                          {/* Contenido */}
                          <div className="p-4">
                            <div className="mb-3">
                              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                                {plato.nombre}
                              </h3>
                              {plato.descripcion && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {plato.descripcion}
                                </p>
                              )}
                            </div>

                            {/* Acciones */}
                            <div className="flex gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => openModal(plato, true, false)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => openModal(plato, false, true)}
                              >
                                <Pencil className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteClick(plato)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sección: Acompañamientos */}
              {platosPorTipo.Acompanamiento.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Acompañamientos
                    </h2>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {platosPorTipo.Acompanamiento.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {platosPorTipo.Acompanamiento.map((plato) => {
                      const imageUrl = extractImageUrl(plato.imagen_url);

                      return (
                        <div
                          key={plato.plato_id}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                        >
                          {/* Imagen */}
                          <div className="relative h-48 bg-gray-100">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={plato.nombre}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error(
                                    "Error cargando imagen:",
                                    imageUrl
                                  );
                                  e.target.style.display = "none";
                                  e.target.nextElementSibling.style.display =
                                    "flex";
                                }}
                              />
                            ) : null}
                            {!imageUrl && (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageOff className="h-12 w-12 text-gray-300" />
                              </div>
                            )}
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{ display: imageUrl ? "none" : "none" }}
                            >
                              <ImageOff className="h-12 w-12 text-gray-300" />
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge className={getTipoColor(plato.tipo)}>
                                {plato.tipo}
                              </Badge>
                            </div>
                          </div>

                          {/* Contenido */}
                          <div className="p-4">
                            <div className="mb-3">
                              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                                {plato.nombre}
                              </h3>
                              {plato.descripcion && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {plato.descripcion}
                                </p>
                              )}
                            </div>

                            {/* Acciones */}
                            <div className="flex gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => openModal(plato, true, false)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => openModal(plato, false, true)}
                              >
                                <Pencil className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteClick(plato)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sección: Postres */}
              {platosPorTipo.Postre.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Postres
                    </h2>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      {platosPorTipo.Postre.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {platosPorTipo.Postre.map((plato) => {
                      const imageUrl = extractImageUrl(plato.imagen_url);

                      return (
                        <div
                          key={plato.plato_id}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                        >
                          {/* Imagen */}
                          <div className="relative h-48 bg-gray-100">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={plato.nombre}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error(
                                    "Error cargando imagen:",
                                    imageUrl
                                  );
                                  e.target.style.display = "none";
                                  e.target.nextElementSibling.style.display =
                                    "flex";
                                }}
                              />
                            ) : null}
                            {!imageUrl && (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageOff className="h-12 w-12 text-gray-300" />
                              </div>
                            )}
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{ display: imageUrl ? "none" : "none" }}
                            >
                              <ImageOff className="h-12 w-12 text-gray-300" />
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge className={getTipoColor(plato.tipo)}>
                                {plato.tipo}
                              </Badge>
                            </div>
                          </div>

                          {/* Contenido */}
                          <div className="p-4">
                            <div className="mb-3">
                              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                                {plato.nombre}
                              </h3>
                              {plato.descripcion && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {plato.descripcion}
                                </p>
                              )}
                            </div>

                            {/* Acciones */}
                            <div className="flex gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => openModal(plato, true, false)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => openModal(plato, false, true)}
                              >
                                <Pencil className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteClick(plato)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sección: Bebidas */}
              {platosPorTipo.Bebida.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Bebidas
                    </h2>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {platosPorTipo.Bebida.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {platosPorTipo.Bebida.map((plato) => {
                      const imageUrl = extractImageUrl(plato.imagen_url);

                      return (
                        <div
                          key={plato.plato_id}
                          className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                        >
                          {/* Imagen */}
                          <div className="relative h-48 bg-gray-100">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={plato.nombre}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error(
                                    "Error cargando imagen:",
                                    imageUrl
                                  );
                                  e.target.style.display = "none";
                                  e.target.nextElementSibling.style.display =
                                    "flex";
                                }}
                              />
                            ) : null}
                            {!imageUrl && (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageOff className="h-12 w-12 text-gray-300" />
                              </div>
                            )}
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{ display: imageUrl ? "none" : "none" }}
                            >
                              <ImageOff className="h-12 w-12 text-gray-300" />
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge className={getTipoColor(plato.tipo)}>
                                {plato.tipo}
                              </Badge>
                            </div>
                          </div>

                          {/* Contenido */}
                          <div className="p-4">
                            <div className="mb-3">
                              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">
                                {plato.nombre}
                              </h3>
                              {plato.descripcion && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {plato.descripcion}
                                </p>
                              )}
                            </div>

                            {/* Acciones */}
                            <div className="flex gap-2 mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => openModal(plato, true, false)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => openModal(plato, false, true)}
                              >
                                <Pencil className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteClick(plato)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <PlatoFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          isEdit={isEdit}
          isViewMode={isViewMode}
        />
      </Suspense>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el plato "{platoToDelete?.nombre}"
              permanentemente. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
