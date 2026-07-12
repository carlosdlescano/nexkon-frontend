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
import { DollarSign, ShoppingCart, AlertTriangle, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useState, useEffect } from "react"; 

/* ── Datos de ejemplo estáticos ── */
const ventasMensuales = [
  { mes: "Ene", ventas: 42800 },
  { mes: "Feb", ventas: 51200 },
  { mes: "Mar", ventas: 47600 },
  { mes: "Abr", ventas: 63400 },
  { mes: "May", ventas: 58900 },
  { mes: "Jun", ventas: 71200 },
  { mes: "Jul", ventas: 65800 },
  { mes: "Ago", ventas: 74100 },
  { mes: "Sep", ventas: 68500 },
  { mes: "Oct", ventas: 79300 },
  { mes: "Nov", ventas: 82600 },
  { mes: "Dic", rgb: 91400 },
];

const topArticulos = [
  { nombre: "Coca Cola", unidades: 342 },
  { nombre: "vodka Sky", unidades: 287 },
  { nombre: "cerveza Quilmes", unidades: 241 },
  { nombre: "Arroz Premium", unidades: 198 },
  { nombre: "Azúcar Blanca", unidades: 174 },
];

const PIE_COLORS = ["#4CAF50", "#388E3C", "#81C784", "#A5D6A7", "#2E7D32"];

const sugerenciasCompra = [
  { codigo: "100001", nombre: "Coca Cola", stockActual: 12, stockCritico: 30, proveedor: "Central SA" },
  { codigo: "100006", nombre: "vodka Sky", stockActual: 8, stockCritico: 25, proveedor: "La Estrella" },
  { codigo: "100009", nombre: "Café Molido Premium", stockActual: 5, stockCritico: 15, proveedor: "Mayorista Norte" },
  { codigo: "100008", nombre: "cerveza Quilmes", stockActual: 11, stockCritico: 20, proveedor: "Distribuidora Az." },
  { codigo: "100002", nombre: "Arroz Premium", stockActual: 14, stockCritico: 40, proveedor: "La Estrella" },
];

const ultimosTickets = [
  { nroTk: "TK-000842", monto: 284.50, hora: "14:38" },
  { nroTk: "TK-000841", monto: 127.80, hora: "14:21" },
  { nroTk: "TK-000840", monto: 512.00, hora: "13:55" },
  { nroTk: "TK-000839", monto: 76.30,  hora: "13:40" },
  { nroTk: "TK-000838", monto: 349.90, hora: "13:12" },
];

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

export function InicioView() {
  const today = toLocalDateString(new Date());
  const [selectedDate, setSelectedDate] = useState(today);

  // ── Estados conectados al Backend ──-------------------
  const [totalVentasDia, setTotalVentasDia] = useState(0);
  const [cantidadTickets, setCantidadTickets] = useState(0);
  const [articulosCriticos, setArticulosCriticos] = useState(0);

  const dateObj = fromLocalDateString(selectedDate);
  const isToday = selectedDate === today;

  const moveDay = (delta) => {
    const d = fromLocalDateString(selectedDate);
    d.setDate(d.getDate() + delta);
    if (toLocalDateString(d) <= today) setSelectedDate(toLocalDateString(d));
  };

  // ── Hook Effect para consumir el API cada vez que cambie la fecha ──
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/dashboard/metricas?fecha=${selectedDate}`);
        if (!response.ok) throw new Error("Error HTTP al traer las métricas");
        
        const data = await response.json();
        
        // Mapeamos los datos del DTO JSON de Spring Boot
        setTotalVentasDia(data.totalFacturadoHoy || 0);
        setCantidadTickets(data.cantidadVentasHoy || 0);
        setArticulosCriticos(data.articulosEnStockCritico || 0);
      } catch (error) {
        console.error("Error cargando métricas en el frontend:", error);
      }
    };

    fetchKPIs();
  }, [selectedDate]); // Se dispara automáticamente si cambian de día con las flechas o el input

  const labelFecha = dateObj.toLocaleDateString("es-AR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="h-full flex flex-col overflow-auto" style={{ backgroundColor: "#F0F8F4" }}>
      {/* Header */}
      <div
        className="border-b px-8 py-5 shrink-0"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl" style={{ color: "#333333" }}>Inicio</h2>
            <p className="text-sm mt-0.5 capitalize" style={{ color: "#888888" }}>
              Resumen del día — {labelFecha}
            </p>
          </div>

          {/* Selector de fecha */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => moveDay(-1)}
              className="p-1.5 rounded-lg border transition-colors"
              style={{ borderColor: "#C8E6C9", backgroundColor: "#FFFFFF", color: "#388E3C" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E8F5E9")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
              title="Día anterior"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="relative flex items-center">
              <Calendar size={15} className="absolute left-3 pointer-events-none" style={{ color: "#4CAF50" }} />
              <input
                type="date"
                value={selectedDate}
                max={today}
                onChange={(e) => { if (e.target.value) setSelectedDate(e.target.value); }}
                className="pl-9 pr-3 py-1.5 rounded-lg border outline-none text-sm"
                style={{ borderColor: "#C8E6C9", backgroundColor: "#FFFFFF", color: "#333333", cursor: "pointer" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#4CAF50")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#C8E6C9")}
              />
            </div>

            <button
              onClick={() => moveDay(1)}
              disabled={isToday}
              className="p-1.5 rounded-lg border transition-colors"
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
                className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
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

      <div className="flex-1 p-6 space-y-6">
        {/* ── Fila KPIs ── */}
        <div className="grid grid-cols-3 gap-5">
          {/* Total ventas del día */}
          <div
            className="rounded-xl p-5 border flex items-center gap-4"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
          >
            <div className="p-3 rounded-xl" style={{ backgroundColor: "#E8F5E9" }}>
              <DollarSign size={28} style={{ color: "#4CAF50" }} />
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: "#888888" }}>Total ventas del día</div>
              <div className="text-2xl font-semibold" style={{ color: "#333333" }}>
                ${totalVentasDia.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Cantidad de tickets */}
          <div
            className="rounded-xl p-5 border flex items-center gap-4"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
          >
            <div className="p-3 rounded-xl" style={{ backgroundColor: "#E3F2FD" }}>
              <ShoppingCart size={28} style={{ color: "#2196F3" }} />
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: "#888888" }}>Tickets del día</div>
              <div className="text-2xl font-semibold" style={{ color: "#333333" }}>
                {cantidadTickets}
              </div>
            </div>
          </div>

          {/* Artículos con stock crítico */}
          <div
            className="rounded-xl p-5 border flex items-center gap-4"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
          >
            <div className="p-3 rounded-xl" style={{ backgroundColor: "#FFF3E0" }}>
              <AlertTriangle size={28} style={{ color: "#FF9800" }} />
            </div>
            <div>
              <div className="text-xs mb-1" style={{ color: "#888888" }}>Artículos stock crítico</div>
              <div className="text-2xl font-semibold" style={{ color: "#FF9800" }}>
                {articulosCriticos}
              </div>
            </div>
          </div>
        </div>

        {/* ── Fila gráficos ── */}
        <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 340px" }}>
          {/* Bar chart — ventas mensuales */}
          <div
            className="rounded-xl p-5 border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
          >
            <h3 className="text-base font-medium mb-4" style={{ color: "#333333" }}>
              Ventas Mensuales
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={ventasMensuales}
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                barSize={28}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E8F5E9" vertical={false} />
                <XAxis
                  dataKey="mes"
                  tick={{ fill: "#888888", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#888888", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  width={42}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "#F0F8F4" }} />
                <Bar dataKey="ventas" fill="#4CAF50" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* top 5 artículos */}
          <div
            className="rounded-xl p-5 border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
          >
            <h3 className="text-base font-medium mb-3" style={{ color: "#333333" }}>
              Top 5 Artículos
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={topArticulos}
                  dataKey="unidades"
                  nameKey="nombre"
                  cx="50%"
                  cy="45%"
                  outerRadius={72}
                  innerRadius={36}
                  paddingAngle={3}
                >
                  {topArticulos.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: "#555555", fontSize: 11 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Fila tablas ── */}
        <div className="grid grid-cols-2 gap-5 pb-4">
          {/* Sugerencias de compra */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
          >
            <div
              className="px-5 py-3 border-b"
              style={{ backgroundColor: "#E8F5E9", borderColor: "#C8E6C9" }}
            >
              <h3 className="text-sm font-medium" style={{ color: "#333333" }}>
                Sugerencias de Compra
              </h3>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: "#F9FFF9" }}>
                  <th className="px-4 py-2 text-left text-xs" style={{ color: "#888888" }}>Artículo</th>
                  <th className="px-4 py-2 text-center text-xs" style={{ color: "#888888" }}>Stock</th>
                  <th className="px-4 py-2 text-center text-xs" style={{ color: "#888888" }}>Mínimo</th>
                  <th className="px-4 py-2 text-left text-xs" style={{ color: "#888888" }}>Proveedor</th>
                </tr>
              </thead>
              <tbody>
                {sugerenciasCompra.map((item, idx) => (
                  <tr
                    key={item.codigo}
                    className={idx < sugerenciasCompra.length - 1 ? "border-t" : ""}
                    style={{ borderColor: "#F0F8F4" }}
                  >
                    <td className="px-4 py-2.5">
                      <div className="text-sm" style={{ color: "#333333" }}>{item.nombre}</div>
                      <div className="text-xs" style={{ color: "#888888" }}>{item.codigo}</div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: "#FFF3E0", color: "#E65100" }}
                      >
                        {item.stockActual}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center text-xs" style={{ color: "#888888" }}>
                      {item.stockCritico}
                    </td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "#666666" }}>
                      {item.proveedor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Últimos tickets */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
          >
            <div
              className="px-5 py-3 border-b"
              style={{ backgroundColor: "#E8F5E9", borderColor: "#C8E6C9" }}
            >
              <h3 className="text-sm font-medium" style={{ color: "#333333" }}>
                Últimas Ventas
              </h3>
            </div>
            <table className="w-full">
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
                    key={tk.nroTk}
                    className={idx < ultimosTickets.length - 1 ? "border-t" : ""}
                    style={{ borderColor: "#F0F8F4" }}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#4CAF50" }}
                      >
                        {tk.nroTk}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium" style={{ color: "#333333" }}>
                      ${tk.monto.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center text-sm" style={{ color: "#888888" }}>
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
  );
}