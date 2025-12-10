"use client";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { Locate } from "lucide-react";

export default function LocationPicker({ onLocationSelect, initialPosition }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Cleanup existing map if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const center = initialPosition || { lat: -17.7833, lng: -63.1821 };

    const map = L.map(mapContainerRef.current).setView(center, 13);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker(center, { draggable: true }).addTo(map);
    markerRef.current = marker;

    marker.bindPopup("¡Aquí entregarán mi pedido!").openPopup();

    marker.on("dragend", function (e) {
      const latlng = marker.getLatLng();
      onLocationSelect(latlng);
    });

    map.on("click", function (e) {
      marker.setLatLng(e.latlng);
      onLocationSelect(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Update marker if initialPosition changes externally
  useEffect(() => {
    if (initialPosition && mapInstanceRef.current && markerRef.current) {
      const latlng = L.latLng(initialPosition);
      markerRef.current.setLatLng(latlng);
      mapInstanceRef.current.setView(latlng);
    }
  }, [initialPosition]);

  const handleLocateMe = () => {
    setLoadingLocation(true);
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const latlng = { lat: latitude, lng: longitude };

        if (mapInstanceRef.current && markerRef.current) {
          markerRef.current.setLatLng(latlng);
          mapInstanceRef.current.setView(latlng, 16); // Zoom in closer
          onLocationSelect(latlng);
        }
        setLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(
          "No pudimos obtener tu ubicación. Por favor, verifica tus permisos."
        );
        setLoadingLocation(false);
      }
    );
  };

  return (
    <div className="relative h-[300px] w-full rounded-md overflow-hidden border border-gray-300 z-0">
      <div ref={mapContainerRef} className="h-full w-full" />
      <button
        onClick={handleLocateMe}
        disabled={loadingLocation}
        className="absolute top-2 right-2 z-[1000] bg-white p-2 rounded-md shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        title="Usar mi ubicación actual"
        type="button"
      >
        <Locate
          className={`h-6 w-6 ${
            loadingLocation ? "text-blue-500 animate-spin" : "text-gray-700"
          }`}
        />
      </button>
    </div>
  );
}
