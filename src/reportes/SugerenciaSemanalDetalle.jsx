import { useState, useEffect } from "react";
import { ArrowLeft, Download, FileDown, ClipboardList, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { API_BASE_URL } from '../config/confURL.js';
import { descargarCSV } from "../utils/exportUtils";

const API_URL = API_BASE_URL;

export function SugerenciaSemanalDetalle({ onBack, fechaInicio, fechaFin }) {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [sortKey, setSortKey] = useState("prioridad");
  const [sortAsc, setSortAsc] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

 

  // Cargar datos desde Spring Boot (GET) - Asegurate que la URL coincida con tu Controller backend (ej: /api/articulos)
  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/reportes/sugerencia-semanal`);
        if (!response.ok) throw new Error("Error al conectar con el servidor (404 / Error de ruta)");
        const data = await response.json();
        setArticulos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticulos();
  }, []);

  const hoy = new Date();
  const fin = new Date(hoy);
  fin.setDate(hoy.getDate() + 7);

   const exportarCSV = () => {
    descargarCSV(rows, "Sugerencia Semanal" + hoy);
  };

  const handleSort = (k) => {
    if (sortKey === k) setSortAsc((v) => !v);
    else {
      setSortKey(k);
      setSortAsc(true);
    }
  };

  const calcular = (a) => {
  

    const demandaSemanal = a.demandaEstimadaSemanal;
    const deficit = Math.max(0, a.stockCritico - a.stock);
    const sugerida = a.cantidadSugeridaAComprar;//Math.ceil(demandaSemanal + deficit);
    const urgente = a.stockActual < a.stockCritico;
    return { demandaSemanal, sugerida, urgente };
  };

  const getPrioridad = (a) => {
    if (a.stockActual <= 0)
      return {
        label: "Urgente",
        bg: "bg-red-50",
        text: "text-red-700",
        order: 0,
      };
    if (a.stockActual < a.stockCritico)
      return {
        label: "Alto",
        bg: "bg-amber-50",
        text: "text-amber-700",
        order: 1,
      };
    return {
      label: "Normal",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      order: 2,
    };
  };

  const formatFecha = (d) => {
    return d.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const rows = articulos
    .map((a, index) => ({ 
      ...a, 
      // Garantizar un identificador único por si el código se repite o viene nulo
      uniqueKey: a.codigoArticulo ? `${a.codigoArticulo}-${index}` : `art-${index}`,
      ...calcular(a), 
      prio: getPrioridad(a) 
    }))
    .filter((a) => {
      if (filtro === "urgente") return a.stockActual <= 0;
      if (filtro === "alto") return a.stockActual > 0 && a.stockActual < a.stockCritico;//a.stockActual >= 0 && a.stockCritico;
      if (filtro === "normal") return a.stockActual > a.stockCritico;//!a.stockCritico;
      return true;
    })
    .filter(
      (a) =>
        busqueda === "" ||
        (a.codigoArticulo && a.codigoArticulo.includes(busqueda)) ||
        (a.nombreArticulo && a.nombreArticulo.toLowerCase().includes(busqueda.toLowerCase()))
    )
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "prioridad") cmp = a.prio.order - b.prio.order;
      else if (sortKey === "codigo") cmp = String(a.codigoArticulo || "").localeCompare(String(b.codigoArticulo || ""));
      else if (sortKey === "nombre") cmp = String(a.nombreArticulo || "").localeCompare(String(b.nombreArticulo || ""));
      else if (sortKey === "stock") cmp = a.stockActual - b.stockActual;
      else if (sortKey === "sugerida") cmp = a.sugerida - b.sugerida;
      return sortAsc ? cmp : -cmp;
    });

  const totalSugerido = rows.reduce((s, r) => s + r.sugerida, 0);
  const urgentes = articulos.filter((a) => a.stockActual <= 0).length;
  const altos = articulos.filter((a) => a.stockActual > 0 && a.stockActual < a.stockCritico).length;

  const SortIcon = ({ k }) =>
    sortKey === k ? (
      <span className="text-emerald-600 text-[10px]">{sortAsc ? " ▲" : " ▼"}</span>
    ) : (
      <span className="text-gray-300 text-[10px]"> ▲</span>
    );

  const FILTROS = [
    { key: "todos", label: "Todos" },
    { key: "urgente", label: "Urgentes" },
    { key: "alto", label: "Prioridad alta" },
    { key: "normal", label: "Normal" },
  ];

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-emerald-50/40 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500 font-medium">Cargando sugerencias de compras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-emerald-50/40 gap-3">
        <AlertTriangle className="w-8 h-8 text-red-500" />
        <p className="text-sm text-red-600 font-medium">Error al cargar datos: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-emerald-50/40">
      {/* Header */}
      <div className="border-b border-green-200 px-6 py-4 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg transition-colors text-emerald-600 hover:bg-emerald-50"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="p-2 rounded-lg bg-emerald-50">
            <ClipboardList size={20} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Sugerencia Semanal de Compras</h2>
            <p className="text-xs text-gray-400">
              {formatFecha(hoy)} — {formatFecha(fin)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => descargarCSV(rows, "sugerencia_compras")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white">
            <Download size={16} /> Exportar CSV
          </button>
          {/* <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white">
            <FileDown size={16} /> Exportar PDF
          </button>*/}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-5">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total artículos",
                value: articulos.length,
                sub: "analizados",
                color: "text-gray-700",
                bg: "bg-white",
              },
              {
                label: "Urgentes (stock <= 0)",
                value: urgentes,
                sub: "requieren acción inmediata",
                color: "text-red-700",
                bg: "bg-red-50",
              },
              {
                label: "Prioridad alta",
                value: altos,
                sub: "bajo stock crítico",
                color: "text-amber-700",
                bg: "bg-amber-50",
              },
              {
                label: "Unidades a comprar",
                value: totalSugerido,
                sub: "total sugerido esta semana",
                color: "text-emerald-700",
                bg: "bg-emerald-50",
              },
            ].map((k) => (
              <div
                key={k.label}
                className={`rounded-lg p-4 border border-green-200 ${k.bg}`}
              >
                <p className="text-xs mb-1 text-gray-500">{k.label}</p>
                <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
                <p className="text-xs mt-0.5 text-gray-400">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* Filtros + buscador */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex gap-2 flex-wrap">
              {FILTROS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFiltro(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                    filtro === key
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-600 border-green-200 hover:bg-emerald-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              className="border border-green-200 rounded-lg px-3 py-1.5 text-sm outline-none sm:ml-auto w-full sm:w-56 focus:border-emerald-600 text-gray-800 bg-white"
              placeholder="Buscar código o nombre…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Tabla */}
          <div className="rounded-lg border border-green-200 overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-50/60">
                    {[
                      { label: "Código", k: "codigo", align: "left" },
                      { label: "Nombre", k: "nombre", align: "left" },
                      { label: "Stock actual", k: "stock", align: "right" },
                      { label: "Stock crítico", k: null, align: "right" },
                      { label: "Consumo diario", k: null, align: "right" },
                      { label: "Demanda semanal", k: null, align: "right" },
                      { label: "Cant. sugerida", k: "sugerida", align: "right" },
                      { label: "Prioridad", k: "prioridad", align: "center" },
                    ].map(({ label, k, align }) => (
                      <th
                        key={label}
                        onClick={() => k && handleSort(k)}
                        className={`px-4 py-3 text-xs font-semibold whitespace-nowrap select-none text-gray-600 ${
                          align === "right"
                            ? "text-right"
                            : align === "center"
                            ? "text-center"
                            : "text-left"
                        } ${k ? "cursor-pointer hover:bg-emerald-100/50" : ""}`}
                      >
                        {label}
                        {k && <SortIcon k={k} />}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-sm text-gray-400">
                        No hay artículos que coincidan.
                      </td>
                    </tr>
                  )}
                  {rows.map((a) => (
                    <tr
                      key={a.uniqueKey}
                      className="border-t border-emerald-50 transition-colors hover:bg-emerald-50/30"
                    >
                      {/* Código */}
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{a.codigoArticulo}</td>

                      {/* Nombre + departamento/rubro */}
                      <td className="px-4 py-3 min-w-[200px]">
                        <p className="font-medium text-gray-800">{a.nombreArticulo}</p>
                        <p className="text-xs text-gray-400">
                          {a.departamento} › {a.rubro}
                        </p>
                      </td>

                      {/* Stock actual */}
                      <td
                        className={`px-4 py-3 text-right font-bold ${
                          a.stockActual < 0
                            ? "text-red-600"
                            : a.urgente
                            ? "text-amber-600"
                            : "text-gray-800"
                        }`}
                      >
                        {a.stockActual < 0 && <AlertTriangle size={12} className="inline mr-1 mb-0.5" />}
                        {a.stockActual}
                      </td>

                      {/* Stock crítico */}
                      <td className="px-4 py-3 text-right text-gray-600">{a.stockCritico}</td>

                      {/* Consumo diario */}
                      <td className="px-4 py-3 text-right text-gray-600">
                        {Number(a.consumoDiarioPromedio || 0).toFixed(1)}
                        <span className="text-xs ml-1 text-gray-400">u/d</span>
                      </td>

                      {/* Demanda semanal */}
                      <td className="px-4 py-3 text-right text-blue-600">
                        {a.demandaEstimadaSemanal.toFixed(1)}
                        <span className="text-xs ml-1 text-gray-400">u</span>
                      </td>

                      {/* Cant. sugerida */}
                      <td className="px-4 py-3 text-right">
                        <span className="text-base font-bold text-emerald-600">{a.cantidadSugeridaAComprar}</span>
                        <span className="text-xs ml-1 text-gray-400">u</span>
                      </td>

                      {/* Prioridad */}
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${a.prio.bg} ${a.prio.text}`}
                        >
                          {a.prio.order < 2 ? <AlertTriangle size={11} /> : <CheckCircle size={11} />}
                          {a.prio.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {rows.length > 0 && (
                  <tfoot>
                    <tr className="bg-emerald-50/60 border-t-2 border-green-200">
                      <td
                        colSpan={6}
                        className="px-4 py-3 text-sm font-semibold text-right text-gray-600"
                      >
                        Total unidades sugeridas:
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-base text-emerald-600">
                        {totalSugerido}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* Nota metodológica */}
          <p className="text-xs px-1 text-gray-400">
            
          </p>
        </div>
      </div>
    </div>
  );
}