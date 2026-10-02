import { useState, useEffect } from "react";
import { Search, Plus, Save, X, Phone, MapPin, Hash, Building2 } from "lucide-react";
import { API_BASE_URL } from '../config/confURL.js';

const API_URL = `${API_BASE_URL}/proveedores`;

const getInitials = (name) => {
  if (!name) return "PR";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

function NuevoProveedorModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: "",
    cuit: "",
    telefono: "",
    direccion: "",
    activo: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.nombre?.trim()) return;

    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (error) {
      console.error("Error al guardar proveedor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-green-200">
          <h3 className="text-xl text-gray-800 font-semibold">
            Nuevo Proveedor
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4 py-4">
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-600">
              Nombre / Razón Social *
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Mayorista Makro"
              className="w-full px-3 py-2 rounded-lg border border-green-200 outline-none focus:border-green-600 text-sm text-gray-800"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-gray-600">CUIT</label>
            <input
              type="text"
              value={form.cuit}
              onChange={(e) => setForm({ ...form, cuit: e.target.value })}
              placeholder="Ej: 30-58962471-3"
              className="w-full px-3 py-2 rounded-lg border border-green-200 outline-none focus:border-green-600 text-sm text-gray-800"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-gray-600">Teléfono</label>
            <input
              type="text"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              placeholder="Ej: 0810-222-62576"
              className="w-full px-3 py-2 rounded-lg border border-green-200 outline-none focus:border-green-600 text-sm text-gray-800"
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-gray-600">Dirección</label>
            <input
              type="text"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              placeholder="Ej: Av. Colón 3829, Córdoba"
              className="w-full px-3 py-2 rounded-lg border border-green-200 outline-none focus:border-green-600 text-sm text-gray-800"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="text-sm font-medium text-gray-600">Estado</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, activo: !form.activo })}
              className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                form.activo ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  form.activo ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm ${form.activo ? "text-green-600 font-medium" : "text-gray-400"}`}>
              {form.activo ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-green-200">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.nombre?.trim() || loading}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm text-white transition-colors ${
              form.nombre?.trim() && !loading
                ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                : "bg-green-300 cursor-not-allowed"
            }`}
          >
            <Save size={16} />
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProveedoresView({ openNuevoModal = false, onNuevoModalClosed }) {
  const [proveedores, setProveedores] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNuevoModal, setShowNuevoModal] = useState(openNuevoModal);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setShowNuevoModal(openNuevoModal);
  }, [openNuevoModal]);

  const fetchProveedores = async () => {
    try {
      const res = await fetch(`${API_URL}/todos`);
      if (res.ok) {
        const data = await res.json();
        const lista = Array.isArray(data) ? data : [];
        setProveedores(lista);
        if (lista.length > 0) {
          setSelected((prevSelected) => {
            if (!prevSelected) return lista[0];
            const actual = lista.find((p) => p.id === prevSelected.id || p.idProveedor === prevSelected.idProveedor);
            return actual || lista[0];
          });
        }
      }
    } catch (err) {
      console.error("Error al obtener proveedores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const filtered = (proveedores || []).filter(
    (p) =>
      p?.nombre?.toLowerCase().includes((searchTerm || "").toLowerCase()) ||
      p?.cuit?.includes(searchTerm || "")
  );

  const handleSelect = (p) => {
    if (isEditing) return;
    setSelected(p);
  };

  const handleEdit = () => {
    if (selected) {
      setEditForm({ ...selected });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;

    const idProveedor = editForm.idProveedor || editForm.id;

    if (!idProveedor || Number(idProveedor) <= 0) {
      console.error("ID de proveedor inválido para actualización:", idProveedor);
      return;
    }

    const payload = {
      idProveedor: Number(idProveedor),
      nombre: editForm.nombre,
      cuit: editForm.cuit,
      telefono: editForm.telefono,
      direccion: editForm.direccion,
      activo: editForm.activo
    };

    try {
      const res = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchProveedores();
        setIsEditing(false);
        setEditForm(null);
      } else {
        const errorText = await res.text();
        console.error("Error del backend al actualizar proveedor:", res.status, errorText);
      }
    } catch (err) {
      console.error("Error al actualizar proveedor:", err);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(null);
  };

  const handleNuevoSave = async (data) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        await fetchProveedores();
        handleCloseNuevoModal();
      }
    } catch (err) {
      console.error("Error al crear proveedor:", err);
    }
  };

  const handleCloseNuevoModal = () => {
    setShowNuevoModal(false);
    if (onNuevoModalClosed) onNuevoModalClosed();
  };

  const display = isEditing ? editForm : selected;

  return (
    <div className="h-full flex overflow-hidden bg-white">
     {/* Panel Izquierdo (Sidebar) */}
      <div className="w-80 flex flex-col border-r border-gray-200 bg-white shrink-0">
        <div className="p-4 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-lg">Proveedores</h2>
            <button
              onClick={() => setShowNuevoModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              Nuevo
            </button>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-green-600 text-gray-800 bg-white"
            />
          </div>
        </div>

        
        <div className="overflow-y-auto flex-1 bg-white">
          {loading ? (
            <p className="text-center text-sm py-8 text-gray-400">Cargando proveedores...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm py-8 text-gray-400">Sin resultados</p>
          ) : (
            filtered.map((p) => {
              const activo = selected && (selected.id === p.idProveedor || selected.idProveedor === p.idProveedor);
              return (
                <button
                  key={p.id || p.idProveedor}
                  onClick={() => handleSelect(p)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors border-b border-gray-100 ${
                    activo ? "bg-green-50" : "bg-white hover:bg-gray-50"
                  } ${isEditing ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-semibold shadow-sm ${
                      activo ? "bg-green-600" : "bg-gray-400"
                    }`}
                  >
                    {getInitials(p.nombre)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${activo ? "text-green-900" : "text-gray-800"}`}>
                      {p.nombre}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">CUIT: {p.cuit || "—"}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${p.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 text-xs text-gray-400 bg-white">
          {filtered.length} proveedor{filtered.length !== 1 ? "es" : ""}
        </div>
      </div>
      {/* Panel Derecho (Detalle) */}
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
        {display ? (
          <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            {/* Header Detalle */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                  {getInitials(display.nombre)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {display.nombre}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${display.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {display.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              </div>

              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 rounded-lg font-medium text-sm text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm cursor-pointer"
                >
                  Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm cursor-pointer"
                  >
                    <Save size={16} />
                    Guardar
                  </button>
                </div>
              )}
            </div>

            {/* Formulario / Datos del Proveedor */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nombre / Razón Social</label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={display.nombre || ""}
                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                    className={`w-full rounded-lg px-3 py-2 text-sm outline-none text-gray-800 transition-all ${
                      isEditing 
                        ? "border border-green-600 bg-white shadow-sm" 
                        : "border border-gray-200 bg-gray-50/50"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">CUIT</label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={display.cuit || ""}
                    onChange={(e) => setEditForm({ ...editForm, cuit: e.target.value })}
                    className={`w-full rounded-lg px-3 py-2 text-sm outline-none text-gray-800 transition-all ${
                      isEditing 
                        ? "border border-green-600 bg-white shadow-sm" 
                        : "border border-gray-200 bg-gray-50/50"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono</label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={display.telefono || ""}
                    onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                    className={`w-full rounded-lg px-3 py-2 text-sm outline-none text-gray-800 transition-all ${
                      isEditing 
                        ? "border border-green-600 bg-white shadow-sm" 
                        : "border border-gray-200 bg-gray-50/50"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Dirección</label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={display.direccion || ""}
                    onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })}
                    className={`w-full rounded-lg px-3 py-2 text-sm outline-none text-gray-800 transition-all ${
                      isEditing 
                        ? "border border-green-600 bg-white shadow-sm" 
                        : "border border-gray-200 bg-gray-50/50"
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <span className="text-sm font-medium text-gray-600">Estado</span>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, activo: !editForm.activo })}
                    className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                      editForm.activo ? "bg-green-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        editForm.activo ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                ) : (
                  <div
                    className={`relative inline-flex items-center h-6 w-11 rounded-full ${
                      display.activo ? "bg-green-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow ${
                        display.activo ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </div>
                )}
                <span className={`text-sm font-medium ${display.activo ? "text-green-600" : "text-gray-400"}`}>
                  {display.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm font-medium">
            Selecciona un proveedor para ver su detalle
          </div>
        )}
      </div>

      {showNuevoModal && (
        <NuevoProveedorModal onClose={handleCloseNuevoModal} onSave={handleNuevoSave} />
      )}
    </div>
  );
}