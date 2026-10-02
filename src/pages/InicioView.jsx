import { API_BASE_URL } from '../config/confURL.js';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DollarSign, ShoppingCart, AlertTriangle, ChevronLeft, ChevronRight, Calendar, X } from "lucide-react";
import { useState, useEffect } from "react";

const PIE_COLORS = ["#4CAF50", "#388E3C", "#81C784", "#A5D6A7", "#2E7D32"];

/* ── Tooltips Personalizados ── */
function CustomBarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm shadow-lg border"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9", color: "#333333" }}
    >
      <div className="font-medium mb-0.5">{label}</div>
      <div style={{ color: "#4CAF50" }}>
        ${payload[0].value.toLocaleString("es-AR")}
      </div>
    </div>
  );
}

function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm shadow-lg border"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9", color: "#333333" }}
    >
      <div className="font-medium">{payload[0].name}</div>
      <div style={{ color: "#4CAF50" }}>{payload[0].value} uds.</div>
    </div>
  );
}

function toLocalDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromLocalDateString(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/* ── Componente del Modal Adaptado ── */
function DetalleTicketModal({ tk, onClose }) {
  if (!tk) return null;

  const items = tk.items || [];
  const total = tk.montoTotal || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
      >
        {/* Modal Header */}
        <div
          className="px-4 sm:px-6 py-4 border-b flex items-center justify-between"
          style={{ backgroundColor: "#E8F5E9", borderColor: "#C8E6C9" }}
        >
          <div>
            <h3 className="text-base sm:text-lg font-semibold" style={{ color: "#2E7D32" }}>
              Detalle de Venta
            </h3>
            <p className="text-xs" style={{ color: "#666666" }}>
              Ticket: <strong style={{ color: "#333333" }}>#{tk.idVenta}</strong> a las {tk.hora} hs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
            style={{ color: "#388E3C" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Tabla de Items */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="border rounded-lg overflow-x-auto" style={{ borderColor: "#E8F5E9" }}>
            <table className="w-full text-left border-collapse min-w-[280px]">
              <thead>
                <tr style={{ backgroundColor: "#F9FFF9" }}>
                  <th className="px-3 py-2 text-xs font-semibold" style={{ color: "#666666" }}>Cant. x Artículo</th>
                  <th className="px-3 py-2 text-xs font-semibold text-right" style={{ color: "#666666" }}>Unit.</th>
                  <th className="px-3 py-2 text-xs font-semibold text-right" style={{ color: "#666666" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-t"
                    style={{ borderColor: "#F0F8F4" }}
                  >
                    <td className="px-3 py-2 text-xs sm:text-sm" style={{ color: "#333333" }}>
                      <span className="font-semibold" style={{ color: "#4CAF50" }}>{item.cantidad}x</span> {item.descripcion}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm text-right font-medium" style={{ color: "#666666" }}>
                      ${(item.precioUnit || 0).toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-xs sm:text-sm text-right font-semibold" style={{ color: "#333333" }}>
                      ${((item.cantidad || 1) * (item.precioUnit || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="border-t pt-4 space-y-1.5" style={{ borderColor: "#C8E6C9" }}>
            <div className="flex justify-between text-base sm:text-lg font-bold" style={{ color: "#2E7D32" }}>
              <span>Total Cobrado</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t bg-gray-50 flex justify-end" style={{ borderColor: "#E8F5E9" }}>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold transition-colors border"
            style={{
              borderColor: "#4CAF50",
              backgroundColor: "#E8F5E9",
              color: "#388E3C"
            }}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

export function InicioView() {
  const today = toLocalDateString(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);

  // ── Estados de Métricas KPI ──
  const [totalVentasDia, setTotalVentasDia] = useState(0);
  const [cantidadTickets, setCantidadTickets] = useState(0);
  const [articulosCriticos, setArticulosCriticos] = useState(0);

  // ── Estados de Tablas y Gráficos ──
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [topArticulos, setTopArticulos] = useState([]);
  const [sugerenciasCompra, setSugerenciasCompra] = useState([]);
  const [ultimosTickets, setUltimosTickets] = useState([]);

  const dateObj = fromLocalDateString(selectedDate);
  const isToday = selectedDate === today;

  const moveDay = (delta) => {
    const d = fromLocalDateString(selectedDate);
    d.setDate(d.getDate() + delta);
    if (toLocalDateString(d) <= today) setSelectedDate(toLocalDateString(d));
  };

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const yearOnly = selectedDate.substring(0, 4);
        const [metricasRes, ventasRes, topRes, sugCompraRes, ultimasVentasRes] = await Promise.all([
          fetch(`${API_BASE_URL}/dashboard/metricas?fecha=${selectedDate}`),
          fetch(`${API_BASE_URL}/dashboard/ventas-mensuales?anio=${yearOnly}`),
          fetch(`${API_BASE_URL}/dashboard/top-articulos`),
          fetch(`${API_BASE_URL}/dashboard/sugerencias-compra`),
          fetch(`${API_BASE_URL}/dashboard/ultimas-ventas`)
        ]);

        if (!metricasRes.ok || !ventasRes.ok || !topRes.ok) {
          throw new Error("Error en alguna de las peticiones a la API");
        }

        const metricasData = await metricasRes.json();
        const ventasData = await ventasRes.json();
        const topData = await topRes.json();
        const sugCompraData = await sugCompraRes.json();
        const ultimasVentasData = await ultimasVentasRes.json();

        setTotalVentasDia(metricasData.totalFacturadoHoy || 0);
        setCantidadTickets(metricasData.cantidadVentasHoy || 0);
        setArticulosCriticos(metricasData.articulosEnStockCritico || 0);

        setVentasMensuales(ventasData || []);
        setTopArticulos(topData || []);
        setSugerenciasCompra(sugCompraData || []);

        const ventasAgrupadas = Object.values(
          (ultimasVentasData || []).reduce((acc, curr) => {
            const id = curr.idVenta || curr.nroTk;
            const montoItem = Number(curr.monto || curr.precio || 0);
            const cantidadItem = Number(curr.cantidad) || 1;

            if (!acc[id]) {
              acc[id] = {
                idVenta: id,
                hora: curr.hora || "--:--",
                montoTotal: 0,
                items: []
              };
            }

            acc[id].montoTotal += montoItem;
            acc[id].items.push({
              descripcion: curr.articulo || curr.descripcion || "Producto sin nombre",
              cantidad: cantidadItem,
              precioUnit: cantidadItem > 0 ? (montoItem / cantidadItem) : montoItem
            });

            return acc;
          }, {})
        );

        setUltimosTickets(ventasAgrupadas);

      } catch (error) {
        console.error("Error cargando métricas en el frontend:", error);
      }
    };

    fetchKPIs();
  }, [selectedDate]);

  const labelFecha = dateObj.toLocaleDateString("es-AR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <div className="h-full flex flex-col overflow-auto" style={{ backgroundColor: "#F0F8F4" }}>

        {/* Header Responsive */}
        <div
          className="border-b px-4 sm:px-8 py-4 sm:py-5 shrink-0"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-medium" style={{ color: "#333333" }}>Inicio</h2>
              <p className="text-xs sm:text-sm mt-0.5 capitalize" style={{ color: "#888888" }}>
                Resumen del día — {labelFecha}
              </p>
            </div>

            {/* Selector de fecha */}
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              <button
                onClick={() => moveDay(-1)}
                className="p-1.5 rounded-lg border transition-colors shrink-0"
                style={{ borderColor: "#C8E6C9", backgroundColor: "#FFFFFF", color: "#388E3C" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E8F5E9")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
                title="Día anterior"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="relative flex items-center flex-1 sm:flex-none">
                <Calendar size={15} className="absolute left-3 pointer-events-none" style={{ color: "#4CAF50" }} />
                <input
                  type="date"
                  value={selectedDate}
                  max={today}
                  onChange={(e) => { if (e.target.value) setSelectedDate(e.target.value); }}
                  className="w-full sm:w-auto pl-9 pr-3 py-1.5 rounded-lg border outline-none text-xs sm:text-sm"
                  style={{ borderColor: "#C8E6C9", backgroundColor: "#FFFFFF", color: "#333333", cursor: "pointer" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#4CAF50")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#C8E6C9")}
                />
              </div>

              <button
                onClick={() => moveDay(1)}
                disabled={isToday}
                className="p-1.5 rounded-lg border transition-colors shrink-0"
                style={{
                  borderColor: "#C8E6C9",
                  backgroundColor: "#FFFFFF",
                  color: isToday ? "#CCCCCC" : "#388E3C",
                  cursor: isToday ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => { if (!isToday) e.currentTarget.style.backgroundColor = "#E8F5E9"; }}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
                title="Día siguiente"
              >
                <ChevronRight size={18} />
              </button>

              {!isToday && (
                <button
                  onClick={() => setSelectedDate(today)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm border transition-colors shrink-0"
                  style={{ borderColor: "#4CAF50", backgroundColor: "#E8F5E9", color: "#388E3C" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C8E6C9")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#E8F5E9")}
                >
                  Hoy
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* ── Fila KPIs Responsive ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            <div
              className="rounded-xl p-4 sm:p-5 border flex items-center gap-4"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
            >
              <div className="p-2.5 sm:p-3 rounded-xl shrink-0" style={{ backgroundColor: "#E8F5E9" }}>
                <DollarSign size={24} className="sm:w-7 sm:h-7" style={{ color: "#4CAF50" }} />
              </div>
              <div>
                <div className="text-xs mb-0.5 sm:mb-1" style={{ color: "#888888" }}>Total ventas del día</div>
                <div className="text-xl sm:text-2xl font-semibold" style={{ color: "#333333" }}>
                  ${totalVentasDia.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            <div
              className="rounded-xl p-4 sm:p-5 border flex items-center gap-4"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
            >
              <div className="p-2.5 sm:p-3 rounded-xl shrink-0" style={{ backgroundColor: "#E3F2FD" }}>
                <ShoppingCart size={24} className="sm:w-7 sm:h-7" style={{ color: "#2196F3" }} />
              </div>
              <div>
                <div className="text-xs mb-0.5 sm:mb-1" style={{ color: "#888888" }}>Tickets del día</div>
                <div className="text-xl sm:text-2xl font-semibold" style={{ color: "#333333" }}>
                  {cantidadTickets}
                </div>
              </div>
            </div>

            <div
              className="rounded-xl p-4 sm:p-5 border flex items-center gap-4 sm:col-span-2 md:col-span-1"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
            >
              <div className="p-2.5 sm:p-3 rounded-xl shrink-0" style={{ backgroundColor: "#FFF3E0" }}>
                <AlertTriangle size={24} className="sm:w-7 sm:h-7" style={{ color: "#FF9800" }} />
              </div>
              <div>
                <div className="text-xs mb-0.5 sm:mb-1" style={{ color: "#888888" }}>Artículos stock crítico</div>
                <div className="text-xl sm:text-2xl font-semibold" style={{ color: "#FF9800" }}>
                  {articulosCriticos}
                </div>
              </div>
            </div>
          </div>

          {/* ── Fila Gráficos Responsive ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 sm:gap-5">
            <div
              className="rounded-xl p-4 sm:p-5 border"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
            >
              <h3 className="text-sm sm:text-base font-medium mb-4" style={{ color: "#333333" }}>
                Ventas Mensuales
              </h3>
              <div className="w-full h-[200px] sm:h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ventasMensuales}
                    margin={{ top: 4, right: 8, left: -15, bottom: 0 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" vertical={false} />
                    <XAxis
                      dataKey="mes"
                      tick={{ fill: "#888888", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#888888", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      width={38}
                    />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "#F0F8F4" }} />
                    <Bar dataKey="ventas" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div
              className="rounded-xl p-4 sm:p-5 border"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
            >
              <h3 className="text-sm sm:text-base font-medium mb-3" style={{ color: "#333333" }}>
                Top 5 Artículos
              </h3>
              <div className="w-full h-[200px] sm:h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topArticulos.slice(0, 5)}
                      dataKey="unidades"
                      nameKey="nombre"
                      cx="50%"
                      cy="40%"
                      outerRadius={65}
                      innerRadius={32}
                      paddingAngle={3}
                    >
                      {topArticulos.slice(0, 5).map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={6}
                      formatter={(value) => {
                        const nombreCorto = value.length > 16 ? `${value.substring(0, 14)}...` : value;
                        return (
                          <span style={{ color: "#555555", fontSize: 10 }} title={value}>
                            {nombreCorto}
                          </span>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── Fila Tablas Responsive ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 pb-4">
            {/* Sugerencias de compra */}
            <div
              className="rounded-xl border overflow-hidden flex flex-col justify-between"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
            >
              <div>
                <div
                  className="px-4 sm:px-5 py-3 border-b"
                  style={{ backgroundColor: "#E8F5E9", borderColor: "#C8E6C9" }}
                >
                  <h3 className="text-xs sm:text-sm font-medium" style={{ color: "#333333" }}>
                    Sugerencias de Compra
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[340px]">
                    <thead>
                      <tr style={{ backgroundColor: "#F9FFF9" }}>
                        <th className="px-3 sm:px-4 py-2 text-left text-xs" style={{ color: "#888888" }}>Artículo</th>
                        <th className="px-2 sm:px-4 py-2 text-center text-xs" style={{ color: "#888888" }}>Stock</th>
                        <th className="px-2 sm:px-4 py-2 text-center text-xs" style={{ color: "#888888" }}>Mínimo</th>
                        <th className="px-3 sm:px-4 py-2 text-center text-xs font-semibold" style={{ color: "#388E3C" }}>Pedir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sugerenciasCompra && sugerenciasCompra.length > 0 ? (
                        sugerenciasCompra.map((item, idx) => (
                          <tr
                            key={`${item.codigo || idx}-${idx}`}
                            className={idx < sugerenciasCompra.length - 1 ? "border-t" : ""}
                            style={{ borderColor: "#F0F8F4" }}
                          >
                            <td className="px-3 sm:px-4 py-2.5">
                              <div className="text-xs sm:text-sm font-medium" style={{ color: "#333333" }}>
                                {item.articulo || item.nombre || "Artículo sin nombre"}
                              </div>
                              {item.codigo && (
                                <div className="text-[10px] text-gray-400">
                                  Cód: {item.codigo}
                                </div>
                              )}
                            </td>
                            <td className="px-2 sm:px-4 py-2.5 text-center">
                              <span
                                className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                                style={{
                                  backgroundColor: item.stockActual === 0 ? "#FFEBEE" : "#FFF3E0",
                                  color: item.stockActual === 0 ? "#C62828" : "#E65100"
                                }}
                              >
                                {item.stockActual ?? 0}
                              </span>
                            </td>
                            <td className="px-2 sm:px-4 py-2.5 text-center text-xs font-medium" style={{ color: "#888888" }}>
                              {item.stockMinimo ?? item.stockCritico ?? 0}
                            </td>
                            <td className="px-3 sm:px-4 py-2.5 text-center text-xs font-bold" style={{ color: "#2E7D32" }}>
                              +{item.cantidadSugerida ?? (Math.max(0, (item.stockCritico || 0) - (item.stockActual || 0)))} u.
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-xs sm:text-sm text-gray-400 italic">
                            ✅ No hay sugerencias de compra. ¡Todo el stock está al día!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Últimas ventas */}
            <div
              className="rounded-xl border overflow-hidden"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
            >
              <div
                className="px-4 sm:px-5 py-3 border-b"
                style={{ backgroundColor: "#E8F5E9", borderColor: "#C8E6C9" }}
              >
                <h3 className="text-xs sm:text-sm font-medium" style={{ color: "#333333" }}>
                  Últimas Ventas
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[280px]">
                  <thead>
                    <tr style={{ backgroundColor: "#F9FFF9" }}>
                      <th className="px-4 py-2 text-left text-xs" style={{ color: "#888888" }}>Nro. Ticket</th>
                      <th className="px-4 py-2 text-right text-xs" style={{ color: "#888888" }}>Monto</th>
                      <th className="px-4 py-2 text-center text-xs" style={{ color: "#888888" }}>Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ultimosTickets.map((tk, idx) => (
                      <tr
                        key={tk.idVenta}
                        onClick={() => setTicketSeleccionado(tk)}
                        className={idx < ultimosTickets.length - 1 ? "border-t" : ""}
                        style={{
                          borderColor: "#F0F8F4",
                          cursor: "pointer",
                          transition: "background 0.15s"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F0F8F4")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <td className="px-4 py-3">
                          <span className="text-xs sm:text-sm font-medium" style={{ color: "#4CAF50" }}>
                            #{tk.idVenta}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-xs sm:text-sm font-medium" style={{ color: "#333333" }}>
                          ${tk.montoTotal.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-center text-xs sm:text-sm" style={{ color: "#888888" }}>
                          {tk.hora}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {ticketSeleccionado && (
        <DetalleTicketModal
          tk={ticketSeleccionado}
          onClose={() => setTicketSeleccionado(null)}
        />
      )}
    </>
  );
}