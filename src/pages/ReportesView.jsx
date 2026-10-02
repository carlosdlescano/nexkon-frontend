import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  FileText,
  DollarSign,
  AlertCircle,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

/*import { VentasMensualesDetalle } from "../reportes/VentasMensualesDetalle";
import { InventarioGeneralDetalle } from "../reportes/InventarioGeneralDetalle";
import { ProductosMasVendidosDetalle } from "../reportes/ProductosMasVendidosDetalle";
import { HistorialComprasDetalle } from "../reportes/HistorialComprasDetalle";
import { ProductosBajaRotacionDetalle } from "../reportes/ProductosBajaRotacionDetalle";
import { ComprasMensualesDetalle } from "../reportes/ComprasMensualesDetalle";
import { NegativosDetalle } from "../reportes/NegativosDetalle";
*/

import { API_BASE_URL } from '../config/confURL.js';
import { SugerenciaSemanalDetalle } from "../reportes/SugerenciaSemanalDetalle";

export function ReportesView() {
  const [reporteActivo, setReporteActivo] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("2025-01-01");
  const [fechaFin, setFechaFin] = useState("2025-11-14");
  
  // Estados para manejo de carga, datos y sincronización API (Spring Boot)
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga inicial de reportes desde Spring Boot (GET)
  useEffect(() => {
    fetchReportes();
  }, []);

  const fetchReportes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/reportes`);
      if (!response.ok) throw new Error("Error al obtener los reportes");
      const data = await response.json();
      setReportes(data);
    } catch (error) {
      console.error("Error:", error);
      // Fallback estático en caso de que el backend no esté activo durante las pruebas
      setReportes([
        //{ id: 1, tipo: "ventas", nombre: "Ventas Mensuales", descripcion: "Resumen de ventas del mes actual", iconoNombre: "DollarSign", color: "emerald" },
        //{ id: 2, tipo: "inventario", nombre: "Inventario General", descripcion: "Estado actual del inventario", iconoNombre: "BarChart3", color: "blue" },
        //{ id: 3, tipo: "mas-vendidos", nombre: "Productos Más Vendidos", descripcion: "Top 10 productos por volumen de ventas", iconoNombre: "TrendingUp", color: "amber" },
        //{ id: 4, tipo: "compras", nombre: "Historial de Compras", descripcion: "Registro de órdenes de compra", iconoNombre: "FileText", color: "purple" },
        //{ id: 5, tipo: "baja-rotacion", nombre: "Productos de Baja Rotación", descripcion: "Productos con ninguna venta o muy poca", iconoNombre: "AlertCircle", color: "orange" },
        //{ id: 6, tipo: "compras-mensuales", nombre: "Compras Mensuales", descripcion: "Evolución mensual de órdenes de compra y montos", iconoNombre: "ShoppingCart", color: "teal" },
        //{ id: 7, tipo: "negativos", nombre: "Negativos", descripcion: "Artículos con stock negativo que requieren reposición urgente", iconoNombre: "TrendingDown", color: "red" },
        { id: 8, tipo: "sugerencia-semanal", nombre: "Sugerencia Semanal", descripcion: "Cantidad a comprar por artículo según demanda y stock crítico", iconoNombre: "ClipboardList", color: "#0288D1" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Ejemplo de sincronización POST/PUT al aplicar filtros o registrar eventos
  const handleAplicarFiltros = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/reportes/filtrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fechaInicio, fechaFin }),
      });
      if (!response.ok) throw new Error("Error al aplicar filtros");
      // Sincronizar datos si el backend retorna información procesada
    } catch (error) {
      console.error("Error en operación POST:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mapeador dinámico para los iconos de Lucide
  const obtenerIcono = (tipo) => {
    switch (tipo) {
      case "ventas": return DollarSign;
      case "inventario": return BarChart3;
      case "mas-vendidos": return TrendingUp;
      case "compras": return FileText;
      case "baja-rotacion": return AlertCircle;
      case "compras-mensuales": return ShoppingCart;
      case "negativos": return TrendingDown;
      default: return FileText;
    }
  };

  /*if (reporteActivo === "ventas") {
    return <VentasMensualesDetalle onBack={() => setReporteActivo(null)} fechaInicio={fechaInicio} fechaFin={fechaFin} />;
  }
  if (reporteActivo === "inventario") {
    return <InventarioGeneralDetalle onBack={() => setReporteActivo(null)} fechaInicio={fechaInicio} fechaFin={fechaFin} />;
  }
  if (reporteActivo === "mas-vendidos") {
    return <ProductosMasVendidosDetalle onBack={() => setReporteActivo(null)} fechaInicio={fechaInicio} fechaFin={fechaFin} />;
  }
  if (reporteActivo === "compras") {
    return <HistorialComprasDetalle onBack={() => setReporteActivo(null)} fechaInicio={fechaInicio} fechaFin={fechaFin} />;
  }
  if (reporteActivo === "baja-rotacion") {
    return <ProductosBajaRotacionDetalle onBack={() => setReporteActivo(null)} fechaInicio={fechaInicio} fechaFin={fechaFin} />;
  }
  if (reporteActivo === "compras-mensuales") {
    return <ComprasMensualesDetalle onBack={() => setReporteActivo(null)} fechaInicio={fechaInicio} fechaFin={fechaFin} />;
  }
  if (reporteActivo === "negativos") {
    return <NegativosDetalle onBack={() => setReporteActivo(null)} fechaInicio={fechaInicio} fechaFin={fechaFin} />;
  }*/
 if (reporteActivo === "sugerencia-semanal") {
    return <SugerenciaSemanalDetalle onBack={() => setReporteActivo(null)} fechaInicio={fechaInicio} fechaFin={fechaFin} />;
  }

  return (
    <div className="h-full flex flex-col bg-emerald-50/40 text-stone-800">
      {/* Header */}
      <div className="bg-white border-b border-green-200 px-4 md:px-8 py-4 md:py-6 shadow-sm">
        <h2 className="text-xl md:text-2xl font-semibold text-stone-800">
          Reportes
        </h2>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          
          {/* Opciones de fecha */}
          <div className="bg-white rounded-lg p-4 md:p-6 mb-6 md:mb-8 border border-green-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-emerald-600" />
                <span className="text-sm md:text-base font-medium text-stone-700">
                  Período:
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-4 flex-1">
                <input
                  type="date"
                  className="px-3 py-2 rounded-lg border border-green-200 bg-white text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
                <span className="hidden sm:block text-sm md:text-base self-center text-stone-500">
                  hasta
                </span>
                <input
                  type="date"
                  className="px-3 py-2 rounded-lg border border-green-200 bg-white text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
              <button
                onClick={handleAplicarFiltros}
                disabled={loading}
                className="px-4 md:px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors text-sm md:text-base font-medium shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Aplicar
              </button>
            </div>
          </div>

          {/* Estado de Carga */}
          {loading && reportes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={36} className="animate-spin text-emerald-600" />
              <p className="text-stone-500 text-sm">Cargando reportes del sistema...</p>
            </div>
          ) : reportes.length === 0 ? (
            /* Manejo de Lista Vacía */
            <div className="bg-white rounded-lg p-12 text-center border border-green-200 shadow-sm">
              <AlertCircle size={40} className="mx-auto text-emerald-500 mb-3" />
              <h3 className="text-lg font-medium text-stone-800">No hay reportes disponibles</h3>
              <p className="text-stone-500 text-sm mt-1">Intente sincronizar nuevamente con el servidor.</p>
            </div>
          ) : (
            /* Grid de reportes disponibles */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              {reportes.map((reporte) => {
                const Icon = obtenerIcono(reporte.tipo);
                return (
                  <div
                    key={reporte.id}
                    className="bg-white rounded-lg p-4 md:p-6 border border-green-200 transition-all cursor-pointer shadow-sm hover:border-emerald-500 hover:shadow-md"
                    onClick={() => setReporteActivo(reporte.tipo)}
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="p-3 md:p-4 rounded-lg bg-emerald-100/60 text-emerald-600">
                        <Icon size={28} className="md:w-8 md:h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1 md:mb-2 text-base md:text-lg font-semibold text-stone-800">
                          {reporte.nombre}
                        </h3>
                        <p className="mb-3 md:mb-4 text-xs md:text-sm text-stone-500">
                          {reporte.descripcion}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReporteActivo(reporte.tipo);
                          }}
                          className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors text-sm font-medium"
                        >
                          <Download size={16} />
                          Generar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}