"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Calendar,
  Clock,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Wine,
  Cake,
} from "lucide-react";
import AuthModal from "./AuthModal";

export default function MenuSemanal() {
  const [menuSemanal, setMenuSemanal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedMenuDetail, setSelectedMenuDetail] = useState(null);
  const router = useRouter();

  // Colores para cada día de la semana
  const dayColors = [
    {
      bg: "bg-red-50",
      border: "border-red-400",
      text: "text-red-600",
      header: "bg-red-400",
    },
    {
      bg: "bg-green-50",
      border: "border-green-400",
      text: "text-green-600",
      header: "bg-green-400",
    },
    {
      bg: "bg-blue-50",
      border: "border-blue-400",
      text: "text-blue-600",
      header: "bg-blue-400",
    },
    {
      bg: "bg-yellow-50",
      border: "border-yellow-400",
      text: "text-yellow-600",
      header: "bg-yellow-400",
    },
    {
      bg: "bg-purple-50",
      border: "border-purple-400",
      text: "text-purple-600",
      header: "bg-purple-400",
    },
  ];

  useEffect(() => {
    fetchMenuSemanal();
  }, []);

  const fetchMenuSemanal = async () => {
    try {
      // Calcular la semana actual primero
      const today = new Date();
      const currentDay = today.getDay();

      // Si es sábado (6) o domingo (0), mostrar la próxima semana
      if (currentDay === 6 || currentDay === 0) {
        const daysToAdd = currentDay === 6 ? 2 : 1;
        today.setDate(today.getDate() + daysToAdd);
      }

      // Recalcular el día actual después del ajuste (será lunes = 1)
      const adjustedDay = today.getDay();
      const monday = new Date(today);

      // Calcular el lunes de esta semana (o la próxima si ya ajustamos)
      const daysFromMonday = adjustedDay === 0 ? -6 : 1 - adjustedDay;
      monday.setDate(today.getDate() + daysFromMonday);
      monday.setHours(0, 0, 0, 0);
      // Calcular el viernes de esta semana
      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);

      // Formatear fechas para la API (YYYY-MM-DD)
      const fechaInicio = monday.toISOString().split("T")[0];
      const fechaFin = friday.toISOString().split("T")[0];

      const response = await fetch(
        `https://backend-solandre.onrender.com/catalogo/menus?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`
      );
      if (response.ok) {
        const data = await response.json();

        // Obtener los platos para conseguir las imágenes
        const platosResponse = await fetch(
          "https://backend-solandre.onrender.com/catalogo/platos"
        );

        if (platosResponse.ok) {
          const platos = await platosResponse.json();

          // Crear un mapa de platos por ID para acceso rápido
          const platosMap = {};
          platos.forEach((plato) => {
            platosMap[plato.plato_id] = plato;
          });

          // Enriquecer los menús con las imágenes de los platos
          data.forEach((menu) => {
            if (menu.plato_principal && menu.plato_principal.plato_id) {
              const platoCompleto = platosMap[menu.plato_principal.plato_id];
              if (platoCompleto && platoCompleto.imagen_url) {
                menu.plato_principal.imagen_url = platoCompleto.imagen_url;
              }
            }
            // Enriquecer bebida
            if (menu.bebida && menu.bebida.plato_id) {
              const platoCompleto = platosMap[menu.bebida.plato_id];
              if (platoCompleto && platoCompleto.imagen_url) {
                menu.bebida.imagen_url = platoCompleto.imagen_url;
              }
            }
            // Enriquecer postre
            if (menu.postre && menu.postre.plato_id) {
              const platoCompleto = platosMap[menu.postre.plato_id];
              if (platoCompleto && platoCompleto.imagen_url) {
                menu.postre.imagen_url = platoCompleto.imagen_url;
              }
            }
          });
        }

        // Crear array de 5 días (lunes a viernes)
        const weekDays = [];
        for (let i = 0; i < 5; i++) {
          const date = new Date(monday);
          date.setDate(monday.getDate() + i);
          const dateStr = date.toISOString().split("T")[0];

          // Buscar si hay menú para este día
          const menuForDay = data.find((menu) => menu.fecha === dateStr);

          // Siempre agregar el día, con menú o sin menú
          weekDays.push({
            fecha: dateStr,
            dayIndex: i, // 0=Lunes, 1=Martes, etc.
            hasMenu: !!menuForDay,
            ...(menuForDay || {}), // Spread del menú si existe
          });
        }

        setMenuSemanal(weekDays);
      }
    } catch (error) {
      console.error("❌ Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const diasSemana = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES"];

  const handleReservar = (menu) => {
    const token = Cookies.get("token");
    if (!token) {
      setSelectedMenu(menu);
      setIsLoginOpen(true);
    } else {
      router.push(
        `/cliente/reservas?menu_id=${menu.menu_dia_id}&fecha=${menu.fecha}`
      );
    }
  };

  const handleOpenDetail = (menu) => {
    setSelectedMenuDetail(menu);
    setIsDetailModalOpen(true);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, menuSemanal.length));
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + menuSemanal.length) % Math.max(1, menuSemanal.length)
    );
  };

  if (loading) {
    return (
      <section id="menu" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Menú Semanal
            </h2>
            <p className="text-gray-600">Cargando menú...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-16 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Menú Semanal
          </h2>
          <p className="text-lg text-gray-600">
            Descubre nuestro delicioso menú de lunes a viernes
          </p>
        </div>

        {menuSemanal.length === 0 ? (
          <div className="text-center py-12">
            <Utensils className="mx-auto mb-4 text-gray-400" size={64} />
            <p className="text-gray-600 text-lg">
              El menú semanal estará disponible próximamente
            </p>
          </div>
        ) : (
          <>
            {/* Desktop View - Grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {menuSemanal.map((menu) => {
                const dayDate = new Date(menu.fecha + "T00:00:00");
                const dayIndex = menu.dayIndex; // Usar el índice precalculado

                const colors = dayColors[dayIndex] || dayColors[0];
                const formattedDate = `${dayDate.getDate()}/${dayDate.toLocaleDateString(
                  "es-BO",
                  { month: "short" }
                )}`;

                // Calcular si es día pasado
                const todayStr = new Date().toLocaleDateString("en-CA");
                const isPast = menu.fecha < todayStr;

                // Si no hay menú para este día, mostrar card vacía
                if (!menu.hasMenu) {
                  return (
                    <Card
                      key={menu.fecha}
                      className={`overflow-hidden ${colors.border} border-2 ${colors.bg} opacity-60`}
                    >
                      <div className={`${colors.header} p-3 text-center`}>
                        <p className="text-white text-sm font-semibold">
                          {diasSemana[dayIndex]}
                        </p>
                        <p className="text-white text-xs opacity-90">
                          {formattedDate}
                        </p>
                      </div>
                      <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <Utensils
                            className="mx-auto text-gray-400 mb-2"
                            size={48}
                          />
                          <p className="text-gray-500 text-sm">No disponible</p>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-gray-500 text-center text-sm">
                          Menú no publicado para este día
                        </p>
                      </CardContent>
                    </Card>
                  );
                }

                return (
                  <Card
                    key={menu.menu_dia_id || menu.fecha}
                    onClick={() => !isPast && handleOpenDetail(menu)}
                    className={`
                      ${colors.border} border-2 ${
                      colors.bg
                    } overflow-hidden transition-all duration-300
                      ${
                        isPast
                          ? "opacity-50 grayscale cursor-not-allowed"
                          : "hover:shadow-xl cursor-pointer hover:scale-[1.02]"
                      }
                    `}
                  >
                    {/* Header con día */}
                    <div className={`${colors.header} p-3 text-center`}>
                      <p className="text-white text-sm font-semibold">
                        {diasSemana[dayIndex]}
                      </p>
                      <p className="text-white text-xs opacity-90">
                        {formattedDate}
                      </p>
                    </div>

                    {/* Imagen del plato principal */}
                    <div className="relative h-48 w-full bg-white">
                      {menu.imagen_url || menu.plato_principal?.imagen_url ? (
                        <Image
                          src={
                            menu.imagen_url || menu.plato_principal.imagen_url
                          }
                          alt={
                            menu.plato_principal?.nombre ||
                            menu.plato_principal_nombre ||
                            "Plato"
                          }
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 20vw"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <Utensils className="text-gray-400" size={48} />
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4 space-y-3">
                      {/* Nombre del plato */}
                      <h3 className="font-bold text-gray-900 text-lg line-clamp-2 min-h-14">
                        {menu.plato_principal?.nombre ||
                          menu.plato_principal_nombre ||
                          "Plato Principal"}
                      </h3>

                      {/* Bebida y Postre */}
                      <div className="space-y-1">
                        {(menu.bebida?.nombre || menu.bebida_nombre) && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Wine className="h-4 w-4 text-blue-500" />
                            <span className="line-clamp-1">
                              {menu.bebida?.nombre || menu.bebida_nombre}
                            </span>
                          </div>
                        )}
                        {(menu.postre?.nombre || menu.postre_nombre) && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Cake className="h-4 w-4 text-pink-500" />
                            <span className="line-clamp-1">
                              {menu.postre?.nombre || menu.postre_nombre}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Calorías */}
                      {menu.calorias && (
                        <p className="text-xs text-gray-500">
                          {menu.calorias} Calorías • {menu.personas || 4}{" "}
                          Personas
                        </p>
                      )}

                      {/* Precio */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <p className={`text-2xl font-bold ${colors.text}`}>
                          Bs. {menu.precio_menu}
                        </p>
                        {!isPast && (
                          <div
                            className={`${colors.header} text-white rounded-full w-8 h-8 flex items-center justify-center`}
                          >
                            <Plus size={16} />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Mobile View - Carousel */}
            <div className="md:hidden relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {menuSemanal.map((menu) => {
                    const dayDate = new Date(menu.fecha + "T00:00:00");
                    const dayIndex = menu.dayIndex;
                    const todayStr = new Date().toLocaleDateString("en-CA");
                    const isPast = menu.fecha < todayStr;

                    const colors = dayColors[dayIndex] || dayColors[0];
                    const formattedDate = `${dayDate.getDate()}/${dayDate.toLocaleDateString(
                      "es-BO",
                      { month: "short" }
                    )}`;

                    // Si no hay menú para este día
                    if (!menu.hasMenu) {
                      return (
                        <div key={menu.fecha} className="w-full shrink-0 px-4">
                          <Card
                            className={`overflow-hidden ${colors.border} border-2 ${colors.bg} opacity-60`}
                          >
                            <div className={`${colors.header} p-4 text-center`}>
                              <p className="text-white text-lg font-semibold">
                                {diasSemana[dayIndex]}
                              </p>
                              <p className="text-white text-sm opacity-90">
                                {formattedDate}
                              </p>
                            </div>
                            <div className="relative h-64 w-full bg-gray-100 flex items-center justify-center">
                              <div className="text-center">
                                <Utensils
                                  className="mx-auto text-gray-400 mb-2"
                                  size={64}
                                />
                                <p className="text-gray-500">No disponible</p>
                              </div>
                            </div>
                            <CardContent className="p-6">
                              <p className="text-gray-500 text-center">
                                Menú no publicado para este día
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={menu.menu_dia_id || menu.fecha}
                        className="w-full shrink-0 px-4"
                      >
                        <Card
                          onClick={() => !isPast && handleOpenDetail(menu)}
                          className={`
                            ${colors.border} border-2 ${
                            colors.bg
                          } overflow-hidden transition-all duration-300
                            ${
                              isPast
                                ? "opacity-50 grayscale cursor-not-allowed"
                                : "active:scale-95 cursor-pointer"
                            }
                          `}
                        >
                          {/* Header con día */}
                          <div className={`${colors.header} p-4 text-center`}>
                            <p className="text-white text-lg font-semibold">
                              {diasSemana[dayIndex]}
                            </p>
                            <p className="text-white text-sm opacity-90">
                              {formattedDate}
                            </p>
                          </div>

                          {/* Imagen del plato principal */}
                          <div className="relative h-64 w-full bg-white">
                            {menu.imagen_url ||
                            menu.plato_principal?.imagen_url ? (
                              <Image
                                src={
                                  menu.imagen_url ||
                                  menu.plato_principal.imagen_url
                                }
                                alt={
                                  menu.plato_principal?.nombre ||
                                  menu.plato_principal_nombre ||
                                  "Plato"
                                }
                                fill
                                className="object-cover"
                                sizes="100vw"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <Utensils className="text-gray-400" size={64} />
                              </div>
                            )}
                          </div>

                          <CardContent className="p-6 space-y-4">
                            {/* Nombre del plato */}
                            <h3 className="font-bold text-gray-900 text-xl">
                              {menu.plato_principal?.nombre ||
                                menu.plato_principal_nombre ||
                                "Plato Principal"}
                            </h3>

                            {/* Bebida y Postre */}
                            <div className="space-y-2">
                              {(menu.bebida?.nombre || menu.bebida_nombre) && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Wine className="h-5 w-5 text-blue-500" />
                                  <span>
                                    {menu.bebida?.nombre || menu.bebida_nombre}
                                  </span>
                                </div>
                              )}
                              {(menu.postre?.nombre || menu.postre_nombre) && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Cake className="h-5 w-5 text-pink-500" />
                                  <span>
                                    {menu.postre?.nombre || menu.postre_nombre}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Calorías */}
                            {menu.calorias && (
                              <p className="text-sm text-gray-500">
                                {menu.calorias} Calorías • {menu.personas || 4}{" "}
                                Personas
                              </p>
                            )}

                            {/* Precio */}
                            <div className="flex items-center justify-between pt-4 border-t">
                              <p
                                className={`text-3xl font-bold ${colors.text}`}
                              >
                                Bs. {menu.precio_menu}
                              </p>
                              {!isPast && (
                                <div
                                  className={`${colors.header} text-white rounded-full w-10 h-10 flex items-center justify-center`}
                                >
                                  <Plus size={20} />
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Controles de navegación móvil */}
              {menuSemanal.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full z-10"
                  >
                    <ChevronLeft size={24} className="text-gray-700" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded-full z-10"
                  >
                    <ChevronRight size={24} className="text-gray-700" />
                  </button>

                  {/* Indicadores */}
                  <div className="flex justify-center mt-6 space-x-2">
                    {menuSemanal.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentIndex
                            ? "bg-orange-500 w-6"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Auth Modal */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-4xl p-0">
          <VisuallyHidden>
            <DialogTitle>Iniciar Sesión</DialogTitle>
          </VisuallyHidden>
          <AuthModal
            onClose={() => {
              setIsLoginOpen(false);
              if (selectedMenu && Cookies.get("token")) {
                router.push(
                  `/cliente/reservas?menu_id=${selectedMenu.menu_dia_id}&fecha=${selectedMenu.fecha}`
                );
              }
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Detalle del Menú */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 bg-gradient-to-br from-amber-50 via-white to-orange-50">
          <VisuallyHidden>
            <DialogTitle>Detalle del Menú</DialogTitle>
          </VisuallyHidden>

          {selectedMenuDetail && (
            <div className="relative">
              {/* Header con badge de descuento */}

              {/* Botón de confirmar orden flotante */}
              <div className="absolute bottom-4 right-4 z-10">
                <button
                  onClick={() => handleReservar(selectedMenuDetail)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold transition-all"
                >
                  <span>Confirma tu orden</span>
                  <span className="bg-white text-green-600 rounded-full w-8 h-8 flex items-center justify-center text-xl">
                    →
                  </span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-0">
                {/* Lado Izquierdo - Información */}
                <div className="p-8 md:p-12 flex flex-col justify-between">
                  {/* Título Principal */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
                        <span className="text-red-600">
                          {
                            selectedMenuDetail.plato_principal?.nombre?.split()[0]
                          }
                        </span>{" "}
                      </h2>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {selectedMenuDetail.plato_principal?.descripcion ||
                          "Un exquisito plato preparado con los mejores ingredientes, cuidadosamente seleccionados para ofrecerte una experiencia culinaria única."}
                      </p>
                    </div>

                    {/* Cards de Bebida y Postre */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      {/* Card Bebida/Postre 1 */}
                      {(selectedMenuDetail.bebida?.nombre ||
                        selectedMenuDetail.bebida_nombre) && (
                        <div className="bg-white rounded-3xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                          <div className="relative h-32 mb-3 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                            {selectedMenuDetail.bebida?.imagen_url ? (
                              <Image
                                src={selectedMenuDetail.bebida.imagen_url}
                                alt={selectedMenuDetail.bebida.nombre}
                                fill
                                className="object-cover"
                                sizes="200px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Wine className="h-16 w-16 text-blue-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm mb-1">
                              {selectedMenuDetail.bebida?.nombre ||
                                selectedMenuDetail.bebida_nombre}
                            </h4>
                          </div>
                        </div>
                      )}

                      {/* Card Bebida/Postre 2 */}
                      {(selectedMenuDetail.postre?.nombre ||
                        selectedMenuDetail.postre_nombre) && (
                        <div className="bg-orange-200 rounded-3xl p-4 shadow-lg hover:shadow-xl transition-shadow text-white">
                          <div className="relative h-32 mb-3 rounded-2xl overflow-hidden bg-white/10">
                            {selectedMenuDetail.postre?.imagen_url ? (
                              <Image
                                src={selectedMenuDetail.postre.imagen_url}
                                alt={selectedMenuDetail.postre.nombre}
                                fill
                                className="object-cover"
                                sizes="200px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Cake className="h-16 w-16 text-white/60" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-sm mb-1">
                              {selectedMenuDetail.postre?.nombre ||
                                selectedMenuDetail.postre_nombre}
                            </h4>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lado Derecho - Imagen del Plato Principal */}
                <div className="relative min-h-[600px] md:min-h-[500px] bg-gradient-to-br from-yellow-100 via-yellow-200 to-amber-300 overflow-hidden">
                  {/* Imagen del Plato en el centro */}
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="relative w-full max-w-2xl aspect-square">
                      {/* Plato negro de fondo */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-full shadow-2xl transform rotate-6"></div>

                      {/* Imagen del plato */}
                      <div className="absolute inset-4 rounded-full overflow-hidden shadow-2xl">
                        {selectedMenuDetail.imagen_url ||
                        selectedMenuDetail.plato_principal?.imagen_url ? (
                          <Image
                            src={
                              selectedMenuDetail.imagen_url ||
                              selectedMenuDetail.plato_principal.imagen_url
                            }
                            alt={
                              selectedMenuDetail.plato_principal?.nombre ||
                              "Plato"
                            }
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <Utensils className="text-gray-600" size={120} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Precio Total en Badge */}
                  <div className="absolute bottom-8 left-8">
                    <div className="bg-white rounded-2xl p-4 shadow-xl">
                      <p className="text-xs text-gray-500 mb-1">Precio Total</p>
                      <p className="text-3xl font-bold text-red-600">
                        Bs. {selectedMenuDetail.precio_menu}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
