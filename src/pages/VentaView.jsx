import {
  Search,
  Plus,
  Trash2,
  CreditCard,
  Banknote,
  QrCode,
  X,
} from "lucide-react";
import { useState } from "react";

const API_URL = "http://localhost:8080/api";

export function VentaView() {
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cantidadABuscar, setCantidadABuscar] = useState(1);

  // Estados para resultados de búsqueda por nombre
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [showResultadosModal, setShowResultadosModal] = useState(false);

  // Estados para pago y flujos mixtos
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [montoIngresado, setMontoIngresado] = useState(""); // Cuánto va a pagar con el método actual
  const [pagosRegistrados, setPagosRegistrados] = useState([]); // Historial de pagos parciales en esta orden

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Totales de los productos
  const subtotal = carrito.reduce((sum, p) => sum + (p.precioVenta || 0) * p.cantidad, 0);
  const iva = subtotal //* 0.21;
  const totalOrden = subtotal + iva;

  // Diferencia que falta
  const totalPagado = pagosRegistrados.reduce((sum, p) => sum + p.monto, 0);
  const totalRestante = Math.max(0, totalOrden - totalPagado);

  // Vuelto: Solo aplica si el pago actual es en efectivo
  const montoFlotante = parseFloat(montoIngresado) || 0;
  const vuelto = (selectedPayment === "efectivo" && montoFlotante > totalRestante)
    ? montoFlotante - totalRestante
    : 0;

  // Agregar al carrito
  const agregarAlCarritoEfectivo = (articulo, cantidadAAgregar = 1) => {
    setCarrito((carritoActual) => {
      const existe = carritoActual.find((item) => item.idCodArticulo === articulo.idCodArticulo);
      if (existe) {
        return carritoActual.map((item) =>
          item.idCodArticulo === articulo.idCodArticulo
            ? { ...item, cantidad: item.cantidad + cantidadAAgregar }
            : item
        );
      }
      return [...carritoActual, { ...articulo, cantidad: cantidadAAgregar }];
    });
    setBusqueda("");
    setCantidadABuscar(1);
  };

  const handleAgregarProducto = (e) => {
    e.preventDefault();
    const termino = busqueda.trim();
    if (!termino) return;

    const cant = parseInt(cantidadABuscar);
    if (isNaN(cant) || cant <= 0) {
      alert("Por favor, ingresá una cantidad válida mayor a 0.");
      return;
    }

    setLoading(true);
    setError(null);

    const esNumero = /^\d+$/.test(termino);
    const queryParam = esNumero ? `codigoBarra=${termino}` : `descripcion=${encodeURIComponent(termino)}`;

    fetch(`${API_URL}/articulos/buscar?${queryParam}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al consultar el artículo.");
        return res.json();
      })
      .then((data) => {
        if (!data || data.length === 0) {
          alert("Artículo no encontrado.");
          setLoading(false);
          return;
        }

        if (esNumero) {
          agregarAlCarritoEfectivo(data[0], cant);
          setLoading(false);
        } else {
          setResultadosBusqueda(data);
          setShowResultadosModal(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError("Error de conexión: " + err.message);
        setLoading(false);
      });
  };

  const handleEliminarProducto = (idCodArticulo) => {
    setCarrito(carrito.filter((item) => item.idCodArticulo !== idCodArticulo));
  };

  const ambiarCahandleCntidad = (idCodArticulo, nuevaCantidad) => {
    const cant = parseInt(nuevaCantidad);
    if (isNaN(cant) || cant <= 0) return;
    setCarrito(
      carrito.map((item) => (item.idCodArticulo === idCodArticulo ? { ...item, cantidad: cant } : item))
    );
  };

  // Procesar el pago actual 
  const handleProcesarPago = () => {
    if (!selectedPayment) return;
    let montoAImputar = parseFloat(montoIngresado);

    if ((selectedPayment === "tarjeta" || selectedPayment === "qr") && !montoIngresado) {
      montoAImputar = totalRestante;
    }
    if (isNaN(montoAImputar) || montoAImputar <= 0) {
      alert("Por favor, ingresá un monto válido.");
      return;
    }
    if (selectedPayment === "efectivo" && montoAImputar > totalRestante) {
      montoAImputar = totalRestante;
    }

    const nuevoPago = { metodo: selectedPayment, monto: montoAImputar };
    const nuevosPagos = [...pagosRegistrados, nuevoPago];

    setSelectedPayment(null);
    setMontoIngresado("");

    const nuevoTotalPagado = nuevosPagos.reduce((sum, p) => sum + p.monto, 0);

    if (nuevoTotalPagado >= totalOrden - 0.01) {
      const mediosUsados = nuevosPagos.map(p => p.metodo).join(", ");

      const payload = {
        cliente: "Consumidor Final",
        medioPago: mediosUsados || "efectivo",
        detalles: carrito.map((item) => ({
          idCodArticulo: item.idCodArticulo,
          cantidad: item.cantidad
        }))
      };

      setLoading(true);

      fetch(`${API_URL}/ventas/registrar`, { // <-- Ruta de tu @PostMapping en Spring
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error en el servidor al guardar la venta.");
          return res.json();
        })
        .then((exito) => {
          if (exito) {
            alert("¡Venta registrada con éxito en el sistema!");
            setPagosRegistrados([]);
            setCarrito([]);
            setShowPaymentModal(false);
          } else {
            alert("El backend devolvió un error al intentar insertar los registros.");
          }
          setLoading(false);
        })
        .catch((err) => {
          alert("Error de conexión al grabar la venta: " + err.message);
          setLoading(false);
        });

    } else {
      setPagosRegistrados(nuevosPagos);
    }
  };

  const resetearFormularioVenta = () => {
    setCarrito([]);
    setPagosRegistrados([]);
    setShowPaymentModal(false);
    setSelectedPayment(null);
    setMontoIngresado("");
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: "#F0F8F4" }}>
      <div className="border-b px-8 py-6" style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}>
        <h2 className="text-2xl" style={{ color: "#333333" }}>Gestión de Ventas</h2>
      </div>

      <div className="flex-1 p-8 flex flex-col overflow-hidden">
        <div className="max-w-6xl mx-auto w-full flex flex-col">

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* TABLA DETALLE DE VENTA */}
          <div className="rounded-lg border overflow-hidden mb-4" style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}>
            <table className="w-full table-fixed">
              <thead style={{ backgroundColor: "#E8F5E9" }}>
                <tr>
                  <th className="w-[15%] px-4 py-3 text-left text-sm" style={{ color: "#333333" }}>Código</th>
                  <th className="w-[40%] px-4 py-3 text-left text-sm" style={{ color: "#333333" }}>Producto</th>
                  <th className="w-[12%] px-4 py-3 text-right text-sm" style={{ color: "#333333" }}>Precio U.</th>
                  <th className="w-[10%] px-4 py-3 text-center text-sm" style={{ color: "#333333" }}>Cantidad</th>
                  <th className="w-[13%] px-4 py-3 text-right text-sm" style={{ color: "#333333" }}>Subtotal</th>
                  <th className="w-[10%] px-4 py-3 text-center text-sm" style={{ color: "#333333" }}>Acción</th>
                </tr>
              </thead>
            </table>

            <div className="overflow-y-auto" style={{ maxHeight: "245px", height: carrito.length > 0 ? "auto" : "245px", minHeight: "245px" }}>
              <table className="w-full table-fixed divide-y" style={{ borderColor: "#C8E6C9" }}>
                <tbody>
                  {carrito.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-24 text-sm" style={{ color: "#888888" }}>
                        El carrito está vacío. Escaneá o buscá por descripción.
                      </td>
                    </tr>
                  ) : (
                    carrito.map((producto) => {
                      const precioUnitario = producto.precioVenta || 0;
                      return (
                        <tr key={producto.idCodArticulo} className="border-b" style={{ borderColor: "#E8F5E9", height: "49px" }}>
                          <td className="w-[15%] px-4 py-2 truncate text-sm" style={{ color: "#666666" }}>{producto.codigoBarra || "N/A"}</td>
                          <td className="w-[40%] px-4 py-2 truncate text-sm font-medium" style={{ color: "#333333" }}>{producto.descripcion}</td>
                          <td className="w-[12%] px-4 py-2 text-right text-sm" style={{ color: "#333333" }}>${precioUnitario.toFixed(2)}</td>
                          <td className="w-[10%] px-4 py-2 text-center">
                            <input
                              type="number"
                              min="1"
                              value={producto.cantidad}
                              onChange={(e) => handleCambiarCantidad(producto.idCodArticulo, e.target.value)}
                              className="w-14 px-1 py-0.5 text-center rounded border outline-none text-sm focus:ring-1 focus:ring-green-500"
                              style={{ borderColor: "#C8E6C9" }}
                            />
                          </td>
                          <td className="w-[13%] px-4 py-2 text-right text-sm font-semibold" style={{ color: "#333333" }}>
                            ${(precioUnitario * producto.cantidad).toFixed(2)}
                          </td>
                          <td className="w-[10%] px-4 py-2 text-center">
                            <button onClick={() => handleEliminarProducto(producto.idCodArticulo)} className="p-1 rounded hover:bg-red-50 transition-colors inline-flex justify-center" style={{ color: "#d32f2f" }}>
                              <Trash2 size={16} />
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

          {/* Formulario de Búsqueda*/}
          <div className="flex gap-4">
            <form onSubmit={handleAgregarProducto} className="flex-1 rounded-lg p-4 border" style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}>
              <label className="block mb-2 text-sm" style={{ color: "#333333" }}>Escanear Código de Barras o Buscar por Descripción</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: "#666666" }} />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder={loading ? "Buscando artículo..." : "Pasá el escáner o escribí la descripción..."}
                    disabled={loading}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border outline-none focus:ring-2 text-sm"
                    style={{ borderColor: "#C8E6C9", backgroundColor: "#FFFFFF" }}
                  />
                </div>
                <span className="text-gray-400 font-bold text-sm px-1">X</span>
                <div className="w-20">
                  <input
                    type="number"
                    min="1"
                    value={cantidadABuscar}
                    onChange={(e) => setCantidadABuscar(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 text-center rounded-lg border outline-none focus:ring-2 text-sm font-medium"
                    style={{ borderColor: "#C8E6C9", backgroundColor: "#FFFFFF" }}
                  />
                </div>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium whitespace-nowrap" style={{ backgroundColor: "#4CAF50", color: "#FFFFFF" }}>
                  <Plus size={18} /> {loading ? "Buscando..." : "Buscar"}
                </button>
              </div>
            </form>

            {/* Panel de Totales */}
            <div className="w-80 rounded-lg p-4 border" style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#666666" }}>Subtotal:</span>
                  <span style={{ color: "#333333" }}>${totalOrden.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#666666" }}>IVA (21%):</span>
                  <span style={{ color: "#333333" }}>${iva.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2" style={{ borderColor: "#C8E6C9" }}>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium" style={{ color: "#333333" }}>Total:</span>
                    <span className="text-xl font-bold" style={{ color: "#388E3C" }}>${totalOrden.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <button disabled={carrito.length === 0} onClick={() => setShowPaymentModal(true)} className="w-full py-2.5 rounded-lg transition-colors text-center font-medium" style={{ backgroundColor: carrito.length === 0 ? "#A5D6A7" : "#4CAF50", color: "#FFFFFF", cursor: carrito.length === 0 ? "not-allowed" : "pointer" }}>
                Finalizar Venta
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* RESULTADOS DE BÚSQUEDA */}
      {showResultadosModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <div className="rounded-lg p-5 max-w-lg w-full mx-4 flex flex-col max-h-[75vh]" style={{ backgroundColor: "#FFFFFF", border: "1px solid #C8E6C9" }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold" style={{ color: "#333333" }}>Resultados de la búsqueda</h3>
              <button onClick={() => setShowResultadosModal(false)} className="text-gray-500 hover:text-gray-800"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto flex-1 divide-y divide-gray-100 border rounded-md" style={{ borderColor: "#E8F5E9" }}>
              {resultadosBusqueda.map((art) => (
                <div key={art.idCodArticulo} onClick={() => { agregarAlCarritoEfectivo(art, parseInt(cantidadABuscar) || 1); setShowResultadosModal(false); }} className="p-3 flex justify-between items-center hover:bg-green-50 cursor-pointer transition-colors">
                  <div>
                    <div className="font-medium text-sm text-gray-800">{art.descripcion}</div>
                    <div className="text-xs text-gray-400">Código: {art.codigoBarra || "N/A"}</div>
                  </div>
                  <div className="text-sm font-semibold text-green-700">${(art.precioVenta || 0).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PAGO CON FLUJO MIXTO */}
      {showPaymentModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} onClick={resetearFormularioVenta}>
          <div className="rounded-lg p-6 max-w-md w-full mx-4" style={{ backgroundColor: "#FFFFFF" }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-2">Finalizar Orden</h3>

            {/* Estado de pago parcial */}
            <div className="bg-gray-50 p-3 rounded-lg border mb-4 space-y-1 text-sm" style={{ borderColor: "#C8E6C9" }}>
              <div className="flex justify-between"><span className="text-gray-500">Total de la Venta:</span><span className="font-semibold text-gray-800">${totalOrden.toFixed(2)}</span></div>
              {pagosRegistrados.length > 0 && (
                <div className="border-t pt-1 mt-1 space-y-1">
                  <span className="text-xs font-bold text-gray-400 uppercase">Pagos ingresados:</span>
                  {pagosRegistrados.map((p, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-green-700 font-medium">
                      <span className="capitalize">• {p.metodo}:</span><span>${p.monto.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between border-t pt-1 font-bold text-base mt-1">
                <span style={{ color: "#333333" }}>Resta Cobrar:</span>
                <span style={{ color: "#388E3C" }}>${totalRestante.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">Seleccionar Medio de Pago:</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button onClick={() => { setSelectedPayment("efectivo"); setMontoIngresado(""); }} className="flex flex-col items-center p-3 rounded-lg border-2 transition-all gap-1" style={{ borderColor: selectedPayment === "efectivo" ? "#4CAF50" : "#C8E6C9", backgroundColor: selectedPayment === "efectivo" ? "#E8F5E9" : "#FFFFFF" }}>
                <Banknote size={20} style={{ color: "#4CAF50" }} /><span className="text-xs font-medium">Efectivo</span>
              </button>
              <button onClick={() => { setSelectedPayment("tarjeta"); setMontoIngresado(""); }} className="flex flex-col items-center p-3 rounded-lg border-2 transition-all gap-1" style={{ borderColor: selectedPayment === "tarjeta" ? "#4CAF50" : "#C8E6C9", backgroundColor: selectedPayment === "tarjeta" ? "#E8F5E9" : "#FFFFFF" }}>
                <CreditCard size={20} style={{ color: "#2196F3" }} /><span className="text-xs font-medium">Tarjeta</span>
              </button>
              <button onClick={() => { setSelectedPayment("qr"); setMontoIngresado(""); }} className="flex flex-col items-center p-3 rounded-lg border-2 transition-all gap-1" style={{ borderColor: selectedPayment === "qr" ? "#4CAF50" : "#C8E6C9", backgroundColor: selectedPayment === "qr" ? "#E8F5E9" : "#FFFFFF" }}>
                <QrCode size={20} style={{ color: "#FF9800" }} /><span className="text-xs font-medium">QR</span>
              </button>
            </div>

            {selectedPayment && (
              <div className="mb-4 p-3 rounded-lg border bg-gray-50 animate-fade-in" style={{ borderColor: "#C8E6C9" }}>
                <label className="block text-xs mb-1 font-medium">
                  {selectedPayment === "efectivo"
                    ? "Monto entregado por el cliente:"
                    : `Monto a pasar por ${selectedPayment.toUpperCase()} (Vacío = total restante):`}
                </label>
                <input
                  type="number"
                  placeholder={`Ej: ${totalRestante.toFixed(0)}`}
                  value={montoIngresado}
                  onChange={(e) => setMontoIngresado(e.target.value)}
                  className="w-full p-2 text-sm rounded border outline-none focus:ring-1 focus:ring-green-500 mb-2"
                />

                {selectedPayment === "efectivo" && vuelto > 0 && (
                  <div className="flex justify-between text-sm font-semibold mt-1">
                    <span className="text-gray-500">Vuelto a entregar:</span>
                    <span style={{ color: "#e53935" }}>${vuelto.toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button onClick={resetearFormularioVenta} className="flex-1 py-2 rounded-lg text-sm transition-colors hover:bg-gray-200" style={{ backgroundColor: "#E0E0E0" }}>Cancelar Venta</button>
              <button
                type="button"
                disabled={!selectedPayment || (selectedPayment === "efectivo" && !montoIngresado)}
                onClick={handleProcesarPago}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: (!selectedPayment || (selectedPayment === "efectivo" && !montoIngresado)) ? "#A5D6A7" : "#4CAF50",
                  color: "#FFFFFF"
                }}
              >
                {selectedPayment && (montoFlotante >= totalRestante || ((selectedPayment === "tarjeta" || selectedPayment === "qr") && !montoIngresado))
                  ? "Confirmar y Cerrar Venta"
                  : "Registrar Pago Parcial"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}