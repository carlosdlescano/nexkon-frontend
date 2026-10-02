import { useState, useEffect } from "react";
import { Plus, Search, FileText, Calendar, Trash2, X, CheckCircle, Clock, UserPlus, Save, Banknote, CreditCard, QrCode } from "lucide-react";
import { API_BASE_URL } from '../config/confURL.js';

const API_PROVEEDORES_URL = `${API_BASE_URL}/proveedores`;
const API_COMPRAS_URL = `${API_BASE_URL}/compras`;


/* ─── Modal: Nuevo Proveedor ─── */
function NuevoProveedorModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: "",
    cuit: "",
    telefono: "",
    direccion: "",
    activo: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre?.trim()) return;

    setLoading(true);
    try {
      await onSave(form);
      onClose();
    } catch (error) {
      console.error("Error al guardar proveedor desde Compras:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl shadow-2xl flex flex-col overflow-hidden w-full max-w-md"
        style={{ backgroundColor: "#F0F8F4" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-6 py-4 flex justify-between items-center border-b"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
        >
          <h3 className="text-xl font-bold" style={{ color: "#333333" }}>
            Nuevo Proveedor
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 transition-colors">
            <X size={20} style={{ color: "#666666" }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block mb-1.5 text-xs font-bold" style={{ color: "#333333" }}>
              Nombre / Razón Social <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Mayorista Makro"
              className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-colors"
              style={{ borderColor: "#C8E6C9", backgroundColor: "#FFFFFF", color: "#333333" }}
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-bold" style={{ color: "#333333" }}>
              CUIT
            </label>
            <input
              type="text"
              value={form.cuit}
              onChange={(e) => setForm({ ...form, cuit: e.target.value })}
              placeholder="Ej: 30-58962471-3"
              className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-colors"
              style={{ borderColor: "#C8E6C9", backgroundColor: "#FFFFFF", color: "#333333" }}
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-bold" style={{ color: "#333333" }}>
              Teléfono
            </label>
            <input
              type="text"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              placeholder="Ej: 0810-222-62576"
              className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-colors"
              style={{ borderColor: "#C8E6C9", backgroundColor: "#FFFFFF", color: "#333333" }}
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-bold" style={{ color: "#333333" }}>
              Dirección
            </label>
            <input
              type="text"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              placeholder="Ej: Av. Colón 3829, Córdoba"
              className="w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-colors"
              style={{ borderColor: "#C8E6C9", backgroundColor: "#FFFFFF", color: "#333333" }}
            />
          </div>

          <div className="flex items-center gap-3 py-1">
            <span className="text-sm font-bold" style={{ color: "#333333" }}>Estado</span>
            <button
              type="button"
              onClick={() => setForm({ ...form, activo: !form.activo })}
              className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                form.activo ? "bg-[#4CAF50]" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  form.activo ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className="text-sm font-bold"
              style={{ color: form.activo ? "#388E3C" : "#999999" }}
            >
              {form.activo ? "Activo" : "Inactivo"}
            </span>
          </div>

          <div className="flex gap-3 mt-4 pt-2 border-t" style={{ borderColor: "#C8E6C9" }}>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: "#E0E0E0", color: "#333333" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!form.nombre?.trim() || loading}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 text-white shadow-sm"
              style={{
                backgroundColor: form.nombre?.trim() && !loading ? "#4CAF50" : "#A5D6A7",
                cursor: form.nombre?.trim() && !loading ? "pointer" : "not-allowed",
              }}
            >
              <Save size={18} />
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 

/* ─── Modal: Nueva Compra ─── */
function NuevaCompraModal({ onClose, onSave, proveedores }) {
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
  const [items, setItems] = useState([]);
  
  const [busqueda, setBusqueda] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [sugerencias, setSugerencias] = useState([]);
  const [articuloSeleccionado, setArticuloSeleccionado] = useState(null);
  const [loadingBusqueda, setLoadingBusqueda] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Estados para Modal de Pago / Finalización
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [montoIngresado, setMontoIngresado] = useState("");
  const [pagosRegistrados, setPagosRegistrados] = useState([]);

  const totalOrden = items.reduce((s, i) => s + (Number(i.cantidad) || 0) * (Number(i.precioCosto) || 0), 0);
  const totalPagado = pagosRegistrados.reduce((s, p) => s + p.monto, 0);
  const totalRestante = Math.max(0, totalOrden - totalPagado);

  const montoFlotante = parseFloat(montoIngresado) || 0;
  const vuelto = selectedPayment === "efectivo" && montoFlotante > totalRestante ? montoFlotante - totalRestante : 0;

  
  useEffect(() => {
    const term = busqueda.trim();
    if (term.length < 2) {
      setSugerencias([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoadingBusqueda(true);
      const esNumero = !isNaN(term) && term.length <= 8;
      const queryParam = esNumero ? `codigo=${encodeURIComponent(term)}` : `descripcion=${encodeURIComponent(term)}`;

      fetch(`${API_BASE_URL}/articulos/buscar?${queryParam}`)
        .then((res) => {
          if (!res.ok) throw new Error("Error al consultar el artículo.");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setSugerencias(data);
          } else if (data) {
            setSugerencias([data]);
          } else {
            setSugerencias([]);
          }
        })
        .catch((err) => {
          console.error("Error buscando artículo en compras:", err);
          setSugerencias([]);
        })
        .finally(() => {
          setLoadingBusqueda(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [busqueda]);

  const handleSeleccionarSugerencia = (art) => {

    const nombreArt = art.descripcion || art.descripcion || "";
    const costoArt = art.precioCosto || art.costo || art.precio || "";

    setArticuloSeleccionado(art);
    setBusqueda(nombreArt);
    if (costoArt) setPrecio(costoArt);
    setSugerencias([]);
  };

  const handleAgregar = () => {
    const precioNum = Number(precio);
    const cantNum = parseInt(cantidad) || 1;

    if (!busqueda.trim() || isNaN(precioNum) || precioNum <= 0) return;

    const newItem = {
      id: Date.now(),
      idCodArticulo: articuloSeleccionado?.idCodArticulo || articuloSeleccionado?.idArticulo || null,
      codigo: articuloSeleccionado?.codigo || articuloSeleccionado?.codigoArticulo || "ART-GEN",
      nombre: articuloSeleccionado?.nombre || articuloSeleccionado?.descripcion || busqueda,
      cantidad: cantNum,
      precioCosto: precioNum,
    };

    setItems((prev) => [...prev, newItem]);
    setBusqueda("");
    setPrecio("");
    setCantidad("1");
    setSugerencias([]);
    setArticuloSeleccionado(null);
  };

  const handleEliminar = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const resetearModalPago = () => {
    setShowPaymentModal(false);
    setSelectedPayment("");
    setMontoIngresado("");
    setPagosRegistrados([]);
  };

  const handleProcesarPago = async () => {
    let montoAAplicar = 0;

    if (selectedPayment === "efectivo") {
      montoAAplicar = Math.min(montoFlotante, totalRestante);
    } else {
      montoAAplicar = montoIngresado ? Math.min(montoFlotante, totalRestante) : totalRestante;
    }

    const nuevosPagos = [...pagosRegistrados, { metodo: selectedPayment, monto: montoAAplicar }];
    const nuevoTotalPagado = nuevosPagos.reduce((s, p) => s + p.monto, 0);

    if (nuevoTotalPagado >= totalOrden || (selectedPayment !== "efectivo" && !montoIngresado)) {
      setSubmitting(true);
      
      // Obtener el objeto de proveedor seleccionado
      const provObj = proveedores.find(
        (p) => (typeof p === "object" ? p.nombre : p) === proveedorSeleccionado
      );

      // Mapear los detalles según la estructura requerida por tu backend
      const detalles = items.map((item) => ({
        idCodArticulo: item.idCodArticulo,
        codigo: item.codigo,
        nombreArticulo: item.nombre,
        cantidad: item.cantidad,
        precioCosto: item.precioCosto,
        subtotal: item.cantidad * item.precioCosto
      }));

      const payload = {
        proveedor: proveedorSeleccionado,
        idProveedor: typeof provObj === "object" ? (provObj.id || provObj.idProveedor) : null,
        medioPago: nuevosPagos.map((p) => p.metodo.toUpperCase()).join(" / "),
        detalles: detalles
      };

      try {
        await onSave(payload);
        resetearModalPago();
        onClose();
      } catch (err) {
        console.error("Error al registrar la compra:", err);
      } finally {
        setSubmitting(false);
      }
    } else {
      setPagosRegistrados(nuevosPagos);
      setSelectedPayment("");
      setMontoIngresado("");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl shadow-2xl flex flex-col w-full max-w-4xl max-h-[90vh]"
        style={{ backgroundColor: "#F0F8F4" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="border-b px-6 py-4 flex justify-between items-center rounded-t-xl"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
        >
          <h3 className="text-xl font-semibold" style={{ color: "#333333" }}>
            Nueva Compra / Recepción de Stock
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 transition-colors">
            <X size={20} style={{ color: "#666666" }} />
          </button>
        </div>

        <div className="flex-1 p-6 flex flex-col overflow-hidden gap-4">
          <div
            className="rounded-lg p-4 border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
          >
            <label className="block mb-2 text-sm font-medium" style={{ color: "#666666" }}>
              Proveedor *
            </label>
            <select
              value={proveedorSeleccionado}
              onChange={(e) => setProveedorSeleccionado(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border outline-none text-sm"
              style={{ borderColor: "#C8E6C9", backgroundColor: "#FFFFFF", color: "#333333" }}
            >
              <option value="">— Seleccionar proveedor —</option>
              {proveedores.map((p) => {
                const nombreProv = typeof p === "string" ? p : p.nombre;
                const idKey = typeof p === "object" ? (p.id || p.idProveedor) : p;
                return (
                  <option key={idKey} value={nombreProv}>
                    {nombreProv}
                  </option>
                );
              })}
            </select>
          </div>

          <div
            className="rounded-lg border overflow-hidden flex-1 min-h-[200px]"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
          >
            <div className="overflow-auto h-full">
              <table className="w-full">
                <thead style={{ backgroundColor: "#E8F5E9" }} className="sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold" style={{ color: "#333333" }}>Código</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold" style={{ color: "#333333" }}>Artículo</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold" style={{ color: "#333333" }}>Precio Costo</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold" style={{ color: "#333333" }}>Cantidad</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold" style={{ color: "#333333" }}>Subtotal</th>
                    <th className="px-4 py-2 text-center text-sm font-semibold" style={{ color: "#333333" }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: "#999999" }}>
                        Agregue artículos buscando en la base de datos
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      const pUnit = Number(item?.precioCosto) || 0;
                      const cant = Number(item?.cantidad) || 0;
                      return (
                        <tr key={item.id} className="border-t" style={{ borderColor: "#C8E6C9" }}>
                          <td className="px-4 py-2 text-sm font-medium" style={{ color: "#4CAF50" }}>{item?.codigo}</td>
                          <td className="px-4 py-2 text-sm" style={{ color: "#333333" }}>{item?.nombre}</td>
                          <td className="px-4 py-2 text-right text-sm" style={{ color: "#333333" }}>
                            ${pUnit.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-center text-sm" style={{ color: "#333333" }}>
                            {cant}
                          </td>
                          <td className="px-4 py-2 text-right text-sm font-semibold" style={{ color: "#333333" }}>
                            ${(cant * pUnit).toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => handleEliminar(item.id)}
                              className="p-1 rounded hover:bg-red-50 transition-colors"
                              style={{ color: "#d32f2f" }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className="md:col-span-2 rounded-lg p-4 border"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
            >
              <label className="block mb-2 text-sm font-medium" style={{ color: "#333333" }}>
                Buscar en Base de Datos
              </label>
              <div className="flex flex-wrap gap-2">
                <div className="flex-1 min-w-[200px] relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    size={16}
                    style={{ color: "#666666" }}
                  />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => {
                      setBusqueda(e.target.value);
                      if (articuloSeleccionado) setArticuloSeleccionado(null);
                    }}
                    placeholder="Código o nombre del artículo..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border outline-none text-sm"
                    style={{ borderColor: "#C8E6C9", backgroundColor: "#FFFFFF" }}
                  />

                  {sugerencias.length > 0 && (
                    <div
                      className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-20 max-h-48 overflow-y-auto"
                      style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
                    >
                      {sugerencias.map((art, idx) => {
                        const nombreArt = art.nombre || art.descripcion || "Sin nombre";
                        const codigoArt = art.codigo || art.codigoArticulo || art.id || "S/C";
                        return (
                          <button
                            key={art.id || idx}
                            type="button"
                            onMouseDown={() => handleSeleccionarSugerencia(art)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-emerald-50 transition-colors flex justify-between items-center border-b last:border-b-0"
                            style={{ borderColor: "#F0F0F0", color: "#333333" }}
                          >
                            <span>
                              <strong style={{ color: "#4CAF50" }}>{codigoArt}</strong> — {nombreArt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {loadingBusqueda && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      Buscando...
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="Precio Costo"
                    min="0"
                    step="0.01"
                    className="w-28 px-3 py-2 rounded-lg border outline-none text-sm"
                    style={{ borderColor: "#C8E6C9" }}
                  />
                </div>

                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="Cant."
                  min="1"
                  className="w-20 px-3 py-2 rounded-lg border outline-none text-sm"
                  style={{ borderColor: "#C8E6C9" }}
                />

                <button
                  type="button"
                  onClick={handleAgregar}
                  className="px-4 py-2 rounded-lg flex items-center gap-1 transition-colors text-sm font-medium"
                  style={{ backgroundColor: "#4CAF50", color: "#FFFFFF" }}
                >
                  <Plus size={16} />
                  Agregar
                </button>
              </div>
            </div>

            <div
              className="rounded-lg p-4 border flex flex-col justify-between"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
            >
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: "#666666" }}>Ítems:</span>
                  <span style={{ color: "#333333" }}>{items.length}</span>
                </div>
                <div
                  className="flex justify-between items-center border-t pt-2"
                  style={{ borderColor: "#C8E6C9" }}
                >
                  <span className="font-semibold" style={{ color: "#333333" }}>Total Compra:</span>
                  <span className="text-xl font-bold" style={{ color: "#388E3C" }}>
                    ${totalOrden.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 rounded-lg text-sm transition-colors font-medium"
                  style={{ backgroundColor: "#E0E0E0", color: "#333333" }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(true)}
                  disabled={!proveedorSeleccionado || items.length === 0}
                  className="flex-1 py-2 rounded-lg text-sm transition-colors font-medium"
                  style={{
                    backgroundColor: proveedorSeleccionado && items.length > 0 ? "#4CAF50" : "#A5D6A7",
                    color: "#FFFFFF",
                    cursor: proveedorSeleccionado && items.length > 0 ? "pointer" : "not-allowed",
                  }}
                >
                  Confirmar Compra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Finalización / Selección de Medio de Pago */}
      {showPaymentModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-3 sm:p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          onClick={resetearModalPago}
        >
          <div
            className="rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: "#FFFFFF" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: "#333333" }}>
              Finalizar Orden
            </h3>

            <div
              className="bg-gray-50 p-3 rounded-lg border mb-4 space-y-1 text-xs sm:text-sm"
              style={{ borderColor: "#C8E6C9" }}
            >
              <div className="flex justify-between">
                <span className="text-gray-500">Total de la Compra:</span>
                <span className="font-semibold text-gray-800">${totalOrden.toFixed(2)}</span>
              </div>
              {pagosRegistrados.length > 0 && (
                <div className="border-t pt-1 mt-1 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Pagos ingresados:</span>
                  {pagosRegistrados.map((p, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-green-700 font-medium">
                      <span className="capitalize">• {p.metodo}:</span>
                      <span>${p.monto.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between border-t pt-1 font-bold text-sm sm:text-base mt-1">
                <span style={{ color: "#333333" }}>Resta Pagar:</span>
                <span style={{ color: "#388E3C" }}>${totalRestante.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-[11px] font-semibold text-gray-400 mb-2 uppercase">Seleccionar Medio de Pago:</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => { setSelectedPayment("efectivo"); setMontoIngresado(""); }}
                className="flex flex-col items-center p-2.5 sm:p-3 rounded-lg border-2 transition-all gap-1"
                style={{
                  borderColor: selectedPayment === "efectivo" ? "#4CAF50" : "#C8E6C9",
                  backgroundColor: selectedPayment === "efectivo" ? "#E8F5E9" : "#FFFFFF"
                }}
              >
                <Banknote size={20} style={{ color: "#4CAF50" }} />
                <span className="text-[11px] sm:text-xs font-medium">Efectivo</span>
              </button>

              <button
                onClick={() => { setSelectedPayment("tarjeta"); setMontoIngresado(""); }}
                className="flex flex-col items-center p-2.5 sm:p-3 rounded-lg border-2 transition-all gap-1"
                style={{
                  borderColor: selectedPayment === "tarjeta" ? "#4CAF50" : "#C8E6C9",
                  backgroundColor: selectedPayment === "tarjeta" ? "#E8F5E9" : "#FFFFFF"
                }}
              >
                <CreditCard size={20} style={{ color: "#2196F3" }} />
                <span className="text-[11px] sm:text-xs font-medium">Tarjeta</span>
              </button>

              <button
                onClick={() => { setSelectedPayment("qr"); setMontoIngresado(""); }}
                className="flex flex-col items-center p-2.5 sm:p-3 rounded-lg border-2 transition-all gap-1"
                style={{
                  borderColor: selectedPayment === "qr" ? "#4CAF50" : "#C8E6C9",
                  backgroundColor: selectedPayment === "qr" ? "#E8F5E9" : "#FFFFFF"
                }}
              >
                <QrCode size={20} style={{ color: "#FF9800" }} />
                <span className="text-[11px] sm:text-xs font-medium">QR</span>
              </button>
            </div>

            {selectedPayment && (
              <div className="mb-4 p-3 rounded-lg border bg-gray-50 animate-fade-in" style={{ borderColor: "#C8E6C9" }}>
                <label className="block text-xs mb-1 font-medium" style={{ color: "#333333" }}>
                  {selectedPayment === "efectivo"
                    ? "Monto abonado al proveedor:"
                    : `Monto a pagar por ${selectedPayment.toUpperCase()} (Vacío = total restante):`}
                </label>
                <input
                  type="number"
                  placeholder={`Ej: ${totalRestante.toFixed(0)}`}
                  value={montoIngresado}
                  onChange={(e) => setMontoIngresado(e.target.value)}
                  className="w-full p-2 text-xs sm:text-sm rounded border outline-none focus:ring-1 focus:ring-green-500 mb-2"
                />

                {selectedPayment === "efectivo" && vuelto > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm font-semibold mt-1">
                    <span className="text-gray-500">Vuelto recibido:</span>
                    <span style={{ color: "#e53935" }}>${vuelto.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={resetearModalPago}
                disabled={submitting}
                className="w-full sm:flex-1 py-2 rounded-lg text-xs sm:text-sm transition-colors hover:bg-gray-200"
                style={{ backgroundColor: "#E0E0E0", color: "#333333" }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!selectedPayment || (selectedPayment === "efectivo" && !montoIngresado) || submitting}
                onClick={handleProcesarPago}
                className="w-full sm:flex-1 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all"
                style={{
                  backgroundColor: (!selectedPayment || (selectedPayment === "efectivo" && !montoIngresado) || submitting) ? "#A5D6A7" : "#4CAF50",
                  color: "#FFFFFF"
                }}
              >
                {submitting
                  ? "Guardando..."
                  : selectedPayment && (montoFlotante >= totalRestante || ((selectedPayment === "tarjeta" || selectedPayment === "qr") && !montoIngresado))
                  ? "Confirmar y Cerrar Compra"
                  : "Registrar Pago Parcial"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Modal: Detalle de Compra ─── */
function DetalleCompraModal({ compra, onClose }) {
  const items = compra?.detalles || compra?.items || [];
  const subtotal = items.reduce(
    (s, i) => s + (Number(i?.cantidad) || 0) * (Number(i?.precioCosto || i?.precio) || 0),
    0
  );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl shadow-2xl flex flex-col w-full max-w-2xl max-h-[90vh]"
        style={{ backgroundColor: "#F0F8F4" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="border-b px-6 py-4 rounded-t-xl flex justify-between items-start"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
        >
          <div>
            <h3 className="text-xl font-semibold mb-1" style={{ color: "#333333" }}>
              Detalle de Compra
            </h3>
            <span
              className="text-sm px-2 py-0.5 rounded font-medium"
              style={{ backgroundColor: "#E8F5E9", color: "#388E3C" }}
            >
              ID: #{compra?.idCompra ?? compra?.id ?? compra?.folio ?? "S/N"}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 transition-colors">
            <X size={20} style={{ color: "#666666" }} />
          </button>
        </div>

        <div
          className="px-6 py-4 border-b grid grid-cols-2 md:grid-cols-4 gap-4"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
        >
          <div>
            <div className="text-xs mb-1" style={{ color: "#888888" }}>Proveedor</div>
            <div className="text-sm font-medium" style={{ color: "#333333" }}>{compra?.proveedor ?? "N/A"}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: "#888888" }}>Fecha</div>
            <div className="text-sm" style={{ color: "#333333" }}>
              {compra?.fecha ? new Date(compra.fecha).toLocaleString("es-AR") : "--/--/----"}
            </div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: "#888888" }}>Medio de Pago</div>
            <div className="text-sm font-medium" style={{ color: "#388E3C" }}>{compra?.medioPago ?? "EFECTIVO"}</div>
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: "#888888" }}>Estado</div>
            <span
              className="text-sm px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 font-medium bg-emerald-100 text-emerald-800"
            >
              <CheckCircle size={13} />
              Completado
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-6 py-4">
          <div
            className="rounded-lg border overflow-hidden"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
          >
            <table className="w-full">
              <thead style={{ backgroundColor: "#E8F5E9" }}>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold" style={{ color: "#333333" }}>Código</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold" style={{ color: "#333333" }}>Artículo</th>
                  <th className="px-4 py-2 text-center text-sm font-semibold" style={{ color: "#333333" }}>Cant.</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold" style={{ color: "#333333" }}>Precio Costo</th>
                  <th className="px-4 py-2 text-right text-sm font-semibold" style={{ color: "#333333" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500">
                      Sin detalle de ítems registrado.
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => {
                    const pUnit = Number(item?.precioCosto || item?.precio) || 0;
                    const cant = Number(item?.cantidad) || 0;
                    return (
                      <tr
                        key={item?.id ?? idx}
                        className={idx < items.length - 1 ? "border-b" : ""}
                        style={{ borderColor: "#C8E6C9" }}
                      >
                        <td className="px-4 py-2 text-sm font-medium" style={{ color: "#4CAF50" }}>
                          {item?.idCodArticulo ?? item?.codigoArticulo ?? "-"} 
                        </td>
                        <td className="px-4 py-2 text-sm" style={{ color: "#333333" }}>
                          {item?.nombre || item?.nombreArticulo || "Artículo"}
                        </td>
                        <td className="px-4 py-2 text-center text-sm" style={{ color: "#333333" }}>{cant}</td>
                        <td className="px-4 py-2 text-right text-sm" style={{ color: "#333333" }}>
                          ${pUnit.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right text-sm font-semibold" style={{ color: "#333333" }}>
                          ${(cant * pUnit).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="border-t px-6 py-4 rounded-b-xl flex flex-wrap justify-between items-center gap-4"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: "#E0E0E0", color: "#333333" }}
          >
            Cerrar
          </button>
          <div className="text-right">
            <div className="text-xs mb-0.5" style={{ color: "#888888" }}>Total Orden</div>
            <div className="text-2xl font-bold" style={{ color: "#388E3C" }}>
              ${(compra?.total || subtotal).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Vista principal de Compras ─── */
export function ComprasView() {
  const [proveedores, setProveedores] = useState([]);
  const [compras, setCompras] = useState([]);
  const [loadingCompras, setLoadingCompras] = useState(false);

  const [showNueva, setShowNueva] = useState(false);
  const [showNuevoProveedor, setShowNuevoProveedor] = useState(false);
  const [detalleCompra, setDetalleCompra] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Obtener Proveedores
  const fetchProveedores = async () => {
    try {
      const res = await fetch(`${API_PROVEEDORES_URL}/todos`);
      if (res.ok) {
        const data = await res.json();
        setProveedores(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error al obtener la lista de proveedores:", err);
    }
  };

  // Obtener Compras del día actual llamando a /compras/buscar
  const fetchComprasDelDia = async () => {
    setLoadingCompras(true);
    try {
      const ahora = new Date();
      
      const inicioDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);
      const finDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59, 999);

      const desde = inicioDia.getTime();
      const hasta = finDia.getTime();

      const res = await fetch(`${API_COMPRAS_URL}/buscar?desde=${desde}&hasta=${hasta}`);
      if (res.ok) {
        const data = await res.json();
        setCompras(Array.isArray(data) ? data : []);
      } else {
        console.error("Error al buscar compras del día:", res.status);
      }
    } catch (err) {
      console.error("Error al consultar compras del día:", err);
    } finally {
      setLoadingCompras(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
    fetchComprasDelDia();
  }, []);

  // Guardar Compra llamando a POST /compras/registrar
  const handleNuevaSave = async (payload) => {
    try {
      const res = await fetch(`${API_COMPRAS_URL}/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Refrescar compras del día tras éxito
        await fetchComprasDelDia();
      } else {
        const errorMsg = await res.text();
        console.error("Error backend al registrar compra:", res.status, errorMsg);
        alert("Ocurrió un error al registrar la compra.");
      }
    } catch (err) {
      console.error("Error al conectar con la API de compras:", err);
      alert("Error de conexión al registrar la compra.");
    }
  };

  // Guardar Nuevo Proveedor
  const handleNuevoProveedorSave = async (data) => {
    try {
      const res = await fetch(API_PROVEEDORES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        await fetchProveedores();
      } else {
        console.error("Error al guardar proveedor:", res.status);
      }
    } catch (err) {
      console.error("Error al crear proveedor desde Compras:", err);
    }
  };

  //--------Detalles de compras------------
const handleVerDetalle = (compra) => {
    // Busca primero idCompra (mismo nombre que devuelve el backend en Java)
    const idCompra = compra?.idCompra || compra?.id || compra?.folio;

    if (!idCompra) {
      console.warn("No se encontró ID válido para la compra:", compra);
      // Carga el objeto disponible directamente si no hay ID para hacer el fetch
      setDetalleCompra(compra);
      return;
    }

    fetch(`${API_BASE_URL}/compras/${idCompra}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los detalles de la compra");
        return res.json();
      })
      .then((data) => {
        // Asigna el objeto completo con la lista de 'detalles' devuelta por la API
        setDetalleCompra(data);
      })
      .catch((err) => {
        console.error("Error al cargar detalle desde API:", err);
        // Fallback: Si la llamada a la red falla, muestra la compra parcial
        setDetalleCompra(compra);
      });
  };

  const comprasFiltradas = compras.filter((c) => {
    const folioStr = String(c?.id || c?.folio || "");
    const provStr = String(c?.proveedor || "");
    return (
      folioStr.includes(searchTerm) ||
      provStr.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalMes = compras.reduce((s, c) => s + (Number(c?.total) || 0), 0);

  return (
    <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 space-y-6" style={{ backgroundColor: "#F0F8F4" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b" style={{ borderColor: "#C8E6C9" }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#333333" }}>
            Gestión de Compras y Proveedores
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
            Módulo de recepción e ingreso de inventario — Compras del día
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNuevoProveedor(true)}
            className="px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium border bg-white shadow-sm hover:bg-gray-50"
            style={{ color: "#4CAF50", borderColor: "#4CAF50" }}
          >
            <UserPlus size={18} />
            <span className="hidden sm:inline">Nuevo Proveedor</span>
          </button>

          <button
            onClick={() => setShowNueva(true)}
            className="px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium shadow-sm"
            style={{ backgroundColor: "#4CAF50", color: "#FFFFFF" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#388E3C")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
          >
            <Plus size={18} />
            <span>Nueva Compra</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen del Día */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl p-5 border shadow-sm bg-white" style={{ borderColor: "#C8E6C9" }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: "#E8F5E9" }}>
              <FileText size={24} style={{ color: "#4CAF50" }} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Órdenes Hoy</p>
              <h3 className="text-2xl font-bold mt-1" style={{ color: "#333333" }}>{compras.length}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5 border shadow-sm bg-white" style={{ borderColor: "#C8E6C9" }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: "#E3F2FD" }}>
              <FileText size={24} style={{ color: "#2196F3" }} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Total Comprado Hoy</p>
              <h3 className="text-2xl font-bold mt-1" style={{ color: "#333333" }}>
                ${totalMes.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de registros */}
      <div className="rounded-xl border shadow-sm bg-white overflow-hidden" style={{ borderColor: "#C8E6C9" }}>
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4" style={{ borderColor: "#C8E6C9" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: "#666666" }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ID o proveedor..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none transition-all"
              style={{ borderColor: "#C8E6C9" }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b" style={{ backgroundColor: "#E8F5E9", borderColor: "#C8E6C9" }}>
              <tr>
                <th className="px-6 py-3 font-semibold" style={{ color: "#333333" }}>ID</th>
                <th className="px-6 py-3 font-semibold" style={{ color: "#333333" }}>Proveedor</th>
                <th className="px-6 py-3 font-semibold" style={{ color: "#333333" }}>Fecha / Hora</th>
                <th className="px-6 py-3 font-semibold" style={{ color: "#333333" }}>Medio de Pago</th>
                <th className="px-6 py-3 text-right font-semibold" style={{ color: "#333333" }}>Total</th>
                <th className="px-6 py-3 text-center font-semibold" style={{ color: "#333333" }}>Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "#C8E6C9" }}>
              {loadingCompras ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Cargando compras del día...
                  </td>
                </tr>
              ) : comprasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No hay registros de compras realizadas el día de hoy
                  </td>
                </tr>
              ) : (
                comprasFiltradas.map((compra, idx) => {
                  const montoTotal = Number(compra?.total) || 0;
                  const fechaStr = compra?.fecha
                    ? new Date(compra.fecha).toLocaleString("es-AR")
                    : "--/--/----";

                  return (
                    <tr key={compra.id || idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium" style={{ color: "#4CAF50" }}>
                        #{compra?.idCompra ?? compra?.folio ?? "S/N" }
                      </td>
                      <td className="px-6 py-4 font-medium" style={{ color: "#333333" }}>
                        {compra?.proveedor ?? "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{fechaStr}</td>
                      <td className="px-6 py-4 text-gray-600">{compra?.medioPago ?? "EFECTIVO"}</td>
                      <td className="px-6 py-4 text-right font-semibold" style={{ color: "#333333" }}>
                        ${montoTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          //onClick={() => setDetalleCompra(compra)}
                          onClick={() => handleVerDetalle(compra)}
                          className="px-3 py-1.5 rounded text-xs font-medium transition-colors"
                          style={{ backgroundColor: "#E8F5E9", color: "#4CAF50" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#4CAF50";
                            e.currentTarget.style.color = "#FFFFFF";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#E8F5E9";
                            e.currentTarget.style.color = "#4CAF50";
                          }}
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      {showNueva && (
        <NuevaCompraModal
          onClose={() => setShowNueva(false)}
          onSave={handleNuevaSave}
          proveedores={proveedores}
        />
      )}

      {showNuevoProveedor && (
        <NuevoProveedorModal
          onClose={() => setShowNuevoProveedor(false)}
          onSave={handleNuevoProveedorSave}
        />
      )}

      {detalleCompra && (
        <DetalleCompraModal
          compra={detalleCompra}
          onClose={() => setDetalleCompra(null)}
        />
      )}
    </div>
  );
}

export default ComprasView; 