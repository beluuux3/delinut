"use client";

import { useState, Suspense } from "react";
import { useEmpleados, useZonas } from "./_components/hooks/useEmpleados";
import { useEmpleadosActions } from "./_components/hooks/useEmpleadosActions";
import EmpleadosHeader from "./_components/EmpleadosHeader";
import GenericTable from "@/components/shared/GenericTable";
import EmpleadoFormModal from "./_components/EmpleadoFormModal";
import EmpleadoViewModal from "./_components/EmpleadoViewModal";
import DeleteConfirmDialog from "./_components/DeleteConfirmDialog";
import LoadingState from "./_components/LoadingState";
import { Badge } from "@/components/ui/badge";

export default function EmpleadosPage() {
  const { empleados, loading, refetch } = useEmpleados();
  const { zonas, refetchZonas, addZona } = useZonas();
  const { createEmpleado, updateEmpleado, deleteEmpleado } =
    useEmpleadosActions(refetch);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nombre_completo: "",
    telefono: "",
    rol_id: 2,
    zona_reparto_id: null,
  });

  const handleCreate = () => {
    setFormData({
      email: "",
      password: "",
      nombre_completo: "",
      telefono: "",
      rol_id: 2,
      zona_reparto_id: null,
    });
    setShowCreateModal(true);
  };

  const handleEdit = (empleado) => {
    setSelectedEmpleado(empleado);
    setFormData({
      email: empleado.email,
      password: "",
      nombre_completo: empleado.nombre_completo,
      telefono: empleado.telefono,
      rol_id: empleado.rol_id,
      zona_reparto_id: empleado.zona_reparto_id,
    });
    setShowEditModal(true);
  };

  const handleView = (empleado) => {
    setSelectedEmpleado(empleado);
    setShowViewModal(true);
  };

  const handleDelete = (empleado) => {
    setSelectedEmpleado(empleado);
    setShowDeleteDialog(true);
  };

  const submitCreate = async (e) => {
    e.preventDefault();
    const success = await createEmpleado(formData);
    if (success) setShowCreateModal(false);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const success = await updateEmpleado(selectedEmpleado.usuario_id, formData);
    if (success) setShowEditModal(false);
  };

  const confirmDelete = async () => {
    const success = await deleteEmpleado(selectedEmpleado.usuario_id);
    if (success) setShowDeleteDialog(false);
  };

  // Filtrar empleados por nombre
  const filteredEmpleados = empleados.filter((empleado) =>
    empleado.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const empleadosColumns = [
    {
      header: "Nº",
      key: "index",
      render: (_, index) => index + 1,
      className: "w-16",
    },
    {
      header: "Nombre",
      key: "nombre_completo",
      cellClassName: "font-medium",
    },
    {
      header: "Email",
      key: "email",
    },
    {
      header: "Teléfono",
      key: "telefono",
    },
    {
      header: "Rol",
      key: "rol_nombre",
      render: (empleado) => (
        <Badge
          className={
            empleado.rol_id === 1
              ? "bg-purple-100 text-purple-800"
              : empleado.rol_id === 2
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }
        >
          {empleado.rol_nombre}
        </Badge>
      ),
    },
    {
      header: "Zona",
      key: "zona_nombre",
      render: (empleado) =>
        empleado.zona_nombre ? (
          <span className="text-sm text-gray-700">{empleado.zona_nombre}</span>
        ) : (
          <span className="text-sm text-gray-400">Sin asignar</span>
        ),
    },
  ];

  if (loading) return <LoadingState />;

  return (
    <Suspense fallback={<LoadingState />}>
      <div className="space-y-6">
        <EmpleadosHeader
          onCreateClick={handleCreate}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <GenericTable
            data={filteredEmpleados.map((emp, idx) => ({ ...emp, index: idx }))}
            columns={empleadosColumns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            emptyMessage="No hay empleados registrados"
            reverseData={false}
          />
        </div>

        <EmpleadoFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={submitCreate}
          formData={formData}
          setFormData={setFormData}
          zonas={zonas}
          onRefreshZonas={refetchZonas}
          onAddZona={addZona}
          isEdit={false}
        />

        <EmpleadoFormModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={submitEdit}
          formData={formData}
          setFormData={setFormData}
          zonas={zonas}
          onRefreshZonas={refetchZonas}
          onAddZona={addZona}
          isEdit={true}
        />

        <EmpleadoViewModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          empleado={selectedEmpleado}
        />

        <DeleteConfirmDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          empleadoNombre={selectedEmpleado?.nombre_completo}
        />
      </div>
    </Suspense>
  );
}
