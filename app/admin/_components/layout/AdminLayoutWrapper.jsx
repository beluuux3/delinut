"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import EditProfileModal from "../../../_components/layout/EditProfileModal";
import { Button } from "@/components/ui/button";

export default function AdminLayoutWrapper({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          onToggle={toggleSidebar}
          onEditProfile={() => setShowEditModal(true)}
        />
        <MobileNav onEditProfile={() => setShowEditModal(true)} />

        <div
          className={`transition-all duration-300 ${
            sidebarOpen && !isMobile ? "md:ml-64" : "md:ml-20"
          }`}
        >
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>

      {/* Modal de editar perfil renderizado FUERA del contenedor principal */}
      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}
    </>
  );
}
