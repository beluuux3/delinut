"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, CreditCard, Utensils, AlertCircle } from "lucide-react";

const LocationPicker = dynamic(() => import("./_components/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-md flex items-center justify-center text-gray-400">
      Cargando mapa...
    </div>
  ),
});

function ReservaForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const menuId = searchParams.get("menu_id");
  const fecha = searchParams.get("fecha");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [menu, setMenu] = useState(null);
  const [zonas, setZonas] = useState([]);
  const [ingredientes, setIngredientes] = useState([]);

  // State for form data
  const [formData, setFormData] = useState({
    cantidad: 1,
    zona_id: "",
    direccion_referencia: "",
    google_maps_link: "",
    latitud: null,
    longitud: null,
    metodo_pago: "QR",
    // Array of arrays, where index corresponds to the item index (0 to quantity-1)
    // Each inner array contains ingredient IDs to exclude for that specific item
    customizations: [[]],
  });

  // State to track which item is currently expanded for customization
  const [expandedItem, setExpandedItem] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          router.push("/");
          return;
        }

        // 1. Fetch Menu Details
        if (menuId) {
          const menuRes = await fetch(
            `https://backend-solandre.onrender.com/catalogo/menu/${fecha}`
          );
          if (menuRes.ok) {
            const menuData = await menuRes.json();
            setMenu(menuData);

            // 2. Fetch Ingredients for exclusions
            const ingRes = await fetch(
              `https://backend-solandre.onrender.com/catalogo/menu/${menuId}/ingredientes`
            );
            if (ingRes.ok) {
              const ingData = await ingRes.json();
              setIngredientes(ingData.ingredientes || []);
            }
          }
        }

        // 3. Fetch Zones
        const zonasRes = await fetch(
          "https://backend-solandre.onrender.com/catalogo/zonas"
        );
        if (zonasRes.ok) {
          const zonasData = await zonasRes.json();
          setZonas(zonasData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los datos necesarios",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [menuId, fecha, router, toast]);

  const updateQuantity = (newQuantity) => {
    if (newQuantity < 1) return;

    setFormData((prev) => {
      const currentCustomizations = [...prev.customizations];

      if (newQuantity > prev.cantidad) {
        // Adding items: push empty arrays for new items
        for (let i = prev.cantidad; i < newQuantity; i++) {
          currentCustomizations.push([]);
        }
      } else if (newQuantity < prev.cantidad) {
        // Removing items: slice the array
        currentCustomizations.splice(newQuantity);
      }

      return {
        ...prev,
        cantidad: newQuantity,
        customizations: currentCustomizations,
      };
    });
  };

  const toggleExclusion = (itemIndex, ingredienteId) => {
    setFormData((prev) => {
      const newCustomizations = [...prev.customizations];
      const currentExclusions = newCustomizations[itemIndex] || [];

      if (currentExclusions.includes(ingredienteId)) {
        newCustomizations[itemIndex] = currentExclusions.filter(
          (id) => id !== ingredienteId
        );
      } else {
        newCustomizations[itemIndex] = [...currentExclusions, ingredienteId];
      }

      return {
        ...prev,
        customizations: newCustomizations,
      };
    });
  };

  const handleLocationSelect = useCallback((latlng) => {
    setFormData((prev) => ({
      ...prev,
      latitud: latlng.lat,
      longitud: latlng.lng,
      // Opcional: Actualizar el link de Google Maps automáticamente
      google_maps_link: `https://www.google.com/maps/search/?api=1&query=${latlng.lat},${latlng.lng}`,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = Cookies.get("token");

      // Group identical configurations
      const groupedItems = [];

      // Helper to check if two arrays are equal (ignoring order)
      const areExclusionsEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;
        const sorted1 = [...arr1].sort();
        const sorted2 = [...arr2].sort();
        return sorted1.every((val, index) => val === sorted2[index]);
      };

      formData.customizations.forEach((exclusions) => {
        const existingGroup = groupedItems.find((group) =>
          areExclusionsEqual(group.exclusiones, exclusions)
        );

        if (existingGroup) {
          existingGroup.cantidad += 1;
        } else {
          groupedItems.push({
            menu_dia_id: parseInt(menuId),
            cantidad: 1,
            exclusiones: exclusions.map((id) => parseInt(id)),
          });
        }
      });

      const payload = {
        zona_id: parseInt(formData.zona_id),
        google_maps_link: formData.google_maps_link || null,
        direccion_referencia: formData.direccion_referencia || null,
        latitud: formData.latitud,
        longitud: formData.longitud,
        metodo_pago: formData.metodo_pago,
        items: groupedItems,
      };

      console.log("Payload to send:", JSON.stringify(payload, null, 2));

      const response = await fetch(
        "https://backend-solandre.onrender.com/pedidos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "¡Pedido Confirmado!",
          description: "Tu pedido ha sido registrado exitosamente.",
        });
        router.push(`/cliente/pedidos/${data.token_recoger}/track`);
      } else {
        const error = await response.json();
        console.error("Error API:", error);

        let errorMsg = "No se pudo crear el pedido";
        if (error.detail) {
          if (Array.isArray(error.detail)) {
            errorMsg = error.detail
              .map((e) => `${e.loc.join(".")}: ${e.msg}`)
              .join(", ");
          } else {
            errorMsg = error.detail;
          }
        }

        toast({
          variant: "destructive",
          title: "Error de Validación",
          description: errorMsg,
        });
      }
    } catch (error) {
      console.error("Network error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error de conexión",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Menú no encontrado</h2>
        <Button onClick={() => router.push("/")} className="mt-4">
          Volver al Inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Finalizar Pedido
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                Datos de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Zona de Entrega</Label>
                <Select
                  value={formData.zona_id.toString()}
                  onValueChange={(val) =>
                    setFormData({ ...formData, zona_id: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu zona" />
                  </SelectTrigger>
                  <SelectContent>
                    {zonas.map((zona) => (
                      <SelectItem
                        key={zona.zona_id}
                        value={zona.zona_id.toString()}
                      >
                        {zona.nombre_zona}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ubicación Exacta (Mueve el pin)</Label>
                <LocationPicker onLocationSelect={handleLocationSelect} />
                <p className="text-xs text-gray-500">
                  Haz clic en el mapa o arrastra el marcador para indicar tu
                  ubicación exacta.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Dirección / Referencia</Label>
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Ej: Casa blanca portón negro, al lado de la tienda..."
                  value={formData.direccion_referencia}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      direccion_referencia: e.target.value,
                    })
                  }
                />
              </div>

              {/* Link de Google Maps eliminado ya que se genera automáticamente */}
            </CardContent>
          </Card>

          {ingredientes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-orange-500" />
                  Personaliza tus platos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500 mb-4">
                  Puedes elegir qué ingredientes quitar de cada plato
                  individualmente.
                </p>

                {Array.from({ length: formData.cantidad }).map((_, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-gray-50/50"
                  >
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() =>
                        setExpandedItem(expandedItem === index ? -1 : index)
                      }
                    >
                      <h3 className="font-medium text-gray-900">
                        Plato #{index + 1}
                        {formData.customizations[index]?.length > 0 && (
                          <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                            {formData.customizations[index].length} exclusiones
                          </span>
                        )}
                      </h3>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {expandedItem === index ? "▼" : "▶"}
                      </Button>
                    </div>

                    {expandedItem === index && (
                      <div className="mt-4 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        {ingredientes.map((ing) => (
                          <div
                            key={ing.ingrediente_id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`ing-${index}-${ing.ingrediente_id}`}
                              checked={formData.customizations[index]?.includes(
                                ing.ingrediente_id
                              )}
                              onCheckedChange={() =>
                                toggleExclusion(index, ing.ingrediente_id)
                              }
                            />
                            <label
                              htmlFor={`ing-${index}-${ing.ingrediente_id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              Sin {ing.nombre}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-500" />
                Método de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.metodo_pago}
                onValueChange={(val) =>
                  setFormData({ ...formData, metodo_pago: val })
                }
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="QR" id="qr" className="peer sr-only" />
                  <Label
                    htmlFor="qr"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-6 hover:bg-orange-50 hover:border-orange-200 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 cursor-pointer transition-all duration-200 shadow-sm peer-data-[state=checked]:shadow-md"
                  >
                    <span className="text-4xl mb-3">📱</span>
                    <span className="font-bold text-gray-900">QR Simple</span>
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      Escanea y paga
                    </span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="Efectivo"
                    id="efectivo"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="efectivo"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-6 hover:bg-orange-50 hover:border-orange-200 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 cursor-pointer transition-all duration-200 shadow-sm peer-data-[state=checked]:shadow-md"
                  >
                    <span className="text-4xl mb-3">💵</span>
                    <span className="font-bold text-gray-900">Efectivo</span>
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      Paga al recibir
                    </span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="Transferencia"
                    id="transferencia"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="transferencia"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-white p-6 hover:bg-orange-50 hover:border-orange-200 peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 cursor-pointer transition-all duration-200 shadow-sm peer-data-[state=checked]:shadow-md"
                  >
                    <span className="text-4xl mb-3">🏦</span>
                    <span className="font-bold text-gray-900">
                      Transferencia
                    </span>
                    <span className="text-xs text-gray-500 mt-1 text-center">
                      Cuenta bancaria
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Resumen */}
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start pb-4 border-b">
                <div>
                  <p className="font-medium">{menu.plato_principal?.nombre}</p>
                  <p className="text-sm text-gray-500">{menu.fecha}</p>
                </div>
                <p className="font-bold">Bs. {menu.precio_menu}</p>
              </div>

              <div className="flex items-center justify-between">
                <Label>Cantidad</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(formData.cantidad - 1)}
                  >
                    -
                  </Button>
                  <span className="font-bold w-4 text-center">
                    {formData.cantidad}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(formData.cantidad + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">
                    Bs.{" "}
                    {(parseFloat(menu.precio_menu) * formData.cantidad).toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 text-lg mt-4"
                onClick={handleSubmit}
                disabled={submitting || !formData.zona_id || !formData.latitud}
              >
                {submitting ? "Procesando..." : "Confirmar Pedido"}
              </Button>

              {(!formData.zona_id || !formData.latitud) && (
                <div className="text-xs text-red-500 text-center space-y-1">
                  {!formData.zona_id && <p>Selecciona una zona de entrega</p>}
                  {!formData.latitud && <p>Indica tu ubicación en el mapa</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ReservasPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      }
    >
      <ReservaForm />
    </Suspense>
  );
}
