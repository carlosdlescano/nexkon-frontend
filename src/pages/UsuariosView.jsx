import { useState, useEffect } from "react";
import { Search, Plus, Save, X, Eye, EyeOff, Key } from "lucide-react";
import { API_BASE_URL } from '../config/confURL.js';

const API_URL = `${API_BASE_URL}/usuarios`;

const ROL_LABEL = {
  admin: "Admin",
  supervisor: "Supervisor",
  user: "User",
};

const ROL_COLOR = {
  admin: "bg-green-700 text-white",
  supervisor: "bg-blue-600 text-white",
  user: "bg-gray-500 text-white",
};

// Función auxiliar para obtener nombre y apellido de forma segura
const parseNombreApellido = (u) => {
  if (!u) return { nombre: "", apellido: "" };
  if (u.nombre || u.apellido) return { nombre: u.nombre || "", apellido: u.apellido || "" };
  if (u.nombreApellido) {
    const partes = u.nombreApellido.trim().split(" ");
    const apellido = partes.pop() || "";
    const nombre = partes.join(" ") || "";
    return { nombre, apellido };
  }
  return { nombre: "", apellido: "" };
};

function NuevoUsuarioModal({ onClose, onSave }) {
  const hoy = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    password: "",
    rol: "user",
    activo: true,
    fechaCreacion: hoy,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.nombre?.trim() || !form.apellido?.trim() || !form.email?.trim() || !form.password?.trim() || 
      form.password.length < 8) return;//valida longitud de contraseña

    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
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
        className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-green-200">
          <h3 className="text-xl text-gray-800 font-semibold">Nuevo Usuario</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-600">Nombre *</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre"
                className="w-full px-3 py-2 rounded-lg border border-green-200 outline-none focus:border-green-600 text-sm text-gray-800"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-600">Apellido *</label>
              <input
                type="text"
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                placeholder="Apellido"
                className="w-full px-3 py-2 rounded-lg border border-green-200 outline-none focus:border-green-600 text-sm text-gray-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-600">DNI</label>
              <input
                type="text"
                value={form.dni}
                onChange={(e) => setForm({ ...form, dni: e.target.value })}
                placeholder="00.000.000"
                className="w-full px-3 py-2 rounded-lg border border-green-200 outline-none focus:border-green-600 text-sm text-gray-800"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs font-medium text-gray-600">Rol</label>
              <select
                value={form.rol}
                onChange={(e) => setForm({ ...form, rol: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-green-200 outline-none focus:border-green-600 text-sm text-gray-800 bg-white"
              >
                <option value="user">Usuario</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-gray-600">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="usuario@empresa.com"
              className="w-full px-3 py-2 rounded-lg border border-green-200 outline-none focus:border-green-600 text-sm text-gray-800"
            />
          </div>

          {/*<div>
            <label className="block mb-1 text-xs font-medium text-gray-600">Contraseña *</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Contraseña inicial"
                className="w-full pl-3 pr-10 py-2 rounded-lg border border-green-200 outline-none focus:border-green-600 text-sm text-gray-800"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>*/}
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-600">Contraseña *</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Contraseña inicial"
                className={`w-full pl-3 pr-10 py-2 rounded-lg border outline-none text-sm text-gray-800 transition-colors ${form.password.length > 0 && form.password.length < 8
                  ? "border-red-500 focus:border-red-600"
                  : "border-green-200 focus:border-green-600"
                  }`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Aviso dinámico de longitud mínima */}
            {form.password.length > 0 && form.password.length < 8 && (
              <p className="text-xs text-red-500 mt-1">
                La contraseña debe tener al menos 8 caracteres.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="text-sm font-medium text-gray-600">Estado</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, activo: !form.activo })}
              className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${form.activo ? "bg-green-600" : "bg-gray-300"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.activo ? "translate-x-6" : "translate-x-1"
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
            className="flex-1 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.nombre?.trim() || !form.apellido?.trim() || !form.email?.trim() || !form.password?.trim() || loading}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm text-white transition-colors ${form.nombre?.trim() && form.apellido?.trim() && form.email?.trim() && form.password?.trim() && !loading
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

export function UsuariosView({ openNuevoModal = false, onNuevoModalClosed }) {
  const [usuarios, setUsuarios] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNuevoModal, setShowNuevoModal] = useState(openNuevoModal);
  const [loading, setLoading] = useState(true);
  const [showEditPwd, setShowEditPwd] = useState(false);

  useEffect(() => {
    setShowNuevoModal(openNuevoModal);
  }, [openNuevoModal]);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(API_URL);
      console.log("Status de la respuesta:", res.status);//CONSOLA

      if (res.ok) {
        const data = await res.json();
        console.log("Datos recibidos de usuarios:", data); // CONSOLA
        const lista = Array.isArray(data) ? data : [];
        setUsuarios(lista);
        if (lista.length > 0) {
          setSelected((prevSelected) => {
            if (!prevSelected) return lista[0];
            const actual = lista.find(
              (u) => (u.legajo || u.id) === (prevSelected.legajo || prevSelected.id)
            );
            return actual || lista[0];
          });
        }
      }else {  //CONSOLA
        const errorText = await res.text();
        console.error("Error del servidor al obtener usuarios:", res.status, errorText);
      }
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const filtered = (usuarios || []).filter((u) => {
    const q = (searchTerm || "").toLowerCase();
    const { nombre, apellido } = parseNombreApellido(u);
    return (
      nombre.toLowerCase().includes(q) ||
      apellido.toLowerCase().includes(q) ||
      (u?.email || "").toLowerCase().includes(q) ||
      String(u?.legajo || u?.id || "").toLowerCase().includes(q)
    );
  });

  const handleSelect = (u) => {
    if (isEditing) return;
    setSelected(u);
  };

  const handleEdit = () => {
    if (selected) {
      const { nombre, apellido } = parseNombreApellido(selected);
      setEditForm({
        ...selected,
        nombre: selected.nombre || nombre,
        apellido: selected.apellido || apellido,
        nuevaPassword: ""
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm(null);
    setShowEditPwd(false);
  };

  // --- ACTUALIZAR USUARIO ---
  const handleSaveEdit = async () => {
    if (!editForm) return;
    try {
      const nombreCompleto = `${editForm.nombre || ""} ${editForm.apellido || ""}`.trim();

      const dtoPayload = {
        usuario: {
          legajo: editForm.legajo || editForm.id,
          dni: editForm.dni,
          nombre: editForm.nombre,               // <--- Enviamos nombre por separado
          apellido: editForm.apellido,           // <--- Enviamos apellido por separado
          nombreApellido: nombreCompleto,        // <--- Mantenemos también por compatibilidad
          email: editForm.email,
          rol: editForm.rol,
          activo: editForm.activo
        },
        passwordPlana: editForm.nuevaPassword ? editForm.nuevaPassword : null
      };

      const res = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dtoPayload),
      });

      if (res.ok) {
        await fetchUsuarios();
        setIsEditing(false);
        setEditForm(null);
        setShowEditPwd(false);
      } else {
        console.error("Error al actualizar usuario. Status:", res.status);
      }
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
    }
  };

  // --- CREAR NUEVO USUARIO ---
  const handleSaveNuevo = async (nuevoUsuario) => {
    try {
      const nombreCompleto = `${nuevoUsuario.nombre || ""} ${nuevoUsuario.apellido || ""}`.trim();

      const dtoPayload = {
        usuario: {
          dni: nuevoUsuario.dni,
          nombre: nuevoUsuario.nombre,
          apellido: nuevoUsuario.apellido,
          nombreApellido: nombreCompleto,
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol,
          activo: nuevoUsuario.activo ?? true
        },
        passwordPlana: nuevoUsuario.password
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dtoPayload),
      });

      if (res.ok) {
        await fetchUsuarios();
        handleCloseNuevoModal();
      } else {
        const errorMsg = await res.text();
        console.error("Error al crear usuario. Status:", res.status, errorMsg);
      }
    } catch (err) {
      console.error("Error al crear usuario:", err);
    }
  };

  const handleCloseNuevoModal = () => {
    setShowNuevoModal(false);
    if (onNuevoModalClosed) onNuevoModalClosed();
  };

  const displayUser = isEditing ? editForm : selected;
  const parsedDisplayUser = displayUser ? parseNombreApellido(displayUser) : { nombre: "", apellido: "" };
  const nombreDisplay = displayUser?.nombre || parsedDisplayUser.nombre;
  const apellidoDisplay = displayUser?.apellido || parsedDisplayUser.apellido;

  return (
    <div className="h-full flex overflow-hidden bg-emerald-50/40">
      {/* Panel izquierdo */}
      <div className="w-72 flex flex-col border-r border-green-200 bg-white shrink-0">
        <div className="p-4 border-b border-green-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800 text-base">Usuarios</h2>
            <button
              onClick={() => setShowNuevoModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <Plus size={14} />
              Nuevo
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full border border-green-200 rounded-lg pl-8 pr-3 py-1.5 text-sm outline-none focus:border-green-600 text-gray-800"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <p className="text-center text-sm py-8 text-gray-400">Cargando usuarios...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-sm py-8 text-gray-400">Sin resultados</p>
          ) : (
            filtered.map((u) => {
              const { nombre, apellido } = parseNombreApellido(u);
              const n = u.nombre || nombre;
              const a = u.apellido || apellido;
              const activo = selected && ((selected.legajo || selected.id) === (u.legajo || u.id));

              return (
                <button
                  key={u.legajo || u.id}
                  onClick={() => handleSelect(u)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-100 flex items-start gap-3 transition-colors ${activo ? "bg-green-100/60" : "hover:bg-green-50/50"
                    } ${isEditing ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold ${activo ? "bg-green-600" : "bg-gray-400"
                      }`}
                  >
                    {n?.[0]}{a?.[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${activo ? "text-green-800" : "text-gray-800"}`}>
                      {a ? `${a}, ${n}` : u.nombreApellido || "Sin nombre"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">Legajo: {u.legajo || u.id}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${ROL_COLOR[u.rol] || "bg-gray-500 text-white"}`}>
                        {ROL_LABEL[u.rol] || u.rol}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${u.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 border-t border-green-200 text-xs text-gray-400">
          {filtered.length} usuario{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 overflow-y-auto p-6">
        {displayUser ? (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white text-xl font-bold">
                  {nombreDisplay?.[0]}{apellidoDisplay?.[0]}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {apellidoDisplay ? `${apellidoDisplay}, ${nombreDisplay}` : displayUser.nombreApellido || "Sin nombre"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${ROL_COLOR[displayUser.rol] || "bg-gray-500 text-white"}`}>
                      {ROL_LABEL[displayUser.rol] || displayUser.rol}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${displayUser.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {displayUser.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              </div>

              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 rounded-lg text-sm text-white bg-green-600 hover:bg-green-700 transition-colors cursor-pointer"
                >
                  Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 rounded-lg border border-green-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={editForm.nuevaPassword && editForm.nuevaPassword.length > 0 && editForm.nuevaPassword.length < 8}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white bg-green-600 hover:bg-green-700 transition-colors cursor-pointer"
                  >
                    <Save size={15} />
                    Guardar
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-green-200 p-6 space-y-5 shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Legajo</label>
                  <input
                    type="text"
                    readOnly
                    value={displayUser.legajo || displayUser.id || ""}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Fecha de creación</label>
                  <input
                    type="text"
                    readOnly
                    value={displayUser.fechaCreacion || "-"}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Nombre</label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={nombreDisplay}
                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none text-gray-800 ${isEditing ? "border-green-600 bg-white" : "border-gray-200 bg-gray-50"
                      }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Apellido</label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={apellidoDisplay}
                    onChange={(e) => setEditForm({ ...editForm, apellido: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none text-gray-800 ${isEditing ? "border-green-600 bg-white" : "border-gray-200 bg-gray-50"
                      }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">DNI</label>
                  <input
                    type="text"
                    readOnly={!isEditing}
                    value={displayUser.dni || ""}
                    onChange={(e) => setEditForm({ ...editForm, dni: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none text-gray-800 ${isEditing ? "border-green-600 bg-white" : "border-gray-200 bg-gray-50"
                      }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Rol</label>
                  {isEditing ? (
                    <select
                      value={editForm.rol}
                      onChange={(e) => setEditForm({ ...editForm, rol: e.target.value })}
                      className="w-full border border-green-600 rounded-lg px-3 py-2 text-sm outline-none text-gray-800 bg-white"
                    >
                      <option value="user">Usuario</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="admin">Administrador</option>
                    </select>
                  ) : (
                    <div className="flex items-center h-[38px]">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${ROL_COLOR[displayUser.rol] || "bg-gray-500 text-white"}`}>
                        {ROL_LABEL[displayUser.rol] || displayUser.rol}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  readOnly={!isEditing}
                  value={displayUser.email || ""}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 text-sm outline-none text-gray-800 ${isEditing ? "border-green-600 bg-white" : "border-gray-200 bg-gray-50"
                    }`}
                />
              </div>

              {/*{isEditing && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">
                    <Key size={12} /> Nueva contraseña (dejar en blanco para no cambiar)
                  </label>
                  <div className="relative">
                    <input
                      type={showEditPwd ? "text" : "password"}
                      value={editForm.nuevaPassword || ""}
                      onChange={(e) => setEditForm({ ...editForm, nuevaPassword: e.target.value })}
                      placeholder="Ingrese nueva contraseña opcional"
                      className="w-full border border-green-600 rounded-lg pl-3 pr-10 py-2 text-sm outline-none text-gray-800 bg-white"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowEditPwd(!showEditPwd)}
                    >
                      {showEditPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}*/}
              {isEditing && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-1">
                    <Key size={12} /> Nueva contraseña (dejar en blanco para no cambiar)
                  </label>
                  <div className="relative">
                    <input
                      type={showEditPwd ? "text" : "password"}
                      value={editForm.nuevaPassword || ""}
                      onChange={(e) => setEditForm({ ...editForm, nuevaPassword: e.target.value })}
                      placeholder="Ingrese nueva contraseña opcional"
                      className={`w-full rounded-lg pl-3 pr-10 py-2 text-sm outline-none text-gray-800 bg-white transition-colors border ${editForm.nuevaPassword && editForm.nuevaPassword.length > 0 && editForm.nuevaPassword.length < 8
                          ? "border-red-500 focus:border-red-600"
                          : "border-green-600 focus:border-emerald-700"
                        }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowEditPwd(!showEditPwd)}
                    >
                      {showEditPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Aviso dinámico solo si escribió algo y no llega a 8 caracteres */}
                  {editForm.nuevaPassword && editForm.nuevaPassword.length > 0 && editForm.nuevaPassword.length < 8 && (
                    <p className="text-xs text-red-500 mt-1">
                      La nueva contraseña debe tener al menos 8 caracteres.
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 pt-2">
                <span className="text-sm font-medium text-gray-600">Estado</span>
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, activo: !editForm.activo })}
                    className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${editForm.activo ? "bg-green-600" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${editForm.activo ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </button>
                ) : (
                  <div
                    className={`relative inline-flex items-center h-6 w-11 rounded-full ${displayUser.activo ? "bg-green-600" : "bg-gray-300"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow ${displayUser.activo ? "translate-x-6" : "translate-x-1"
                        }`}
                    />
                  </div>
                )}
                <span className={`text-sm ${displayUser.activo ? "text-green-600 font-medium" : "text-gray-400"}`}>
                  {displayUser.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Selecciona un usuario para ver su detalle
          </div>
        )}
      </div>

      {showNuevoModal && (
        <NuevoUsuarioModal
          onClose={handleCloseNuevoModal}
          onSave={handleSaveNuevo}
        />
      )}
    </div>
  );
}