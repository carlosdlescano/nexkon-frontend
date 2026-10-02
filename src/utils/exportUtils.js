
// src/utils/exportUtils.js

/*export const generarCSVSugerenciaSemanal = (rows) => {
  // Definimos las cabeceras del CSV
  const headers = [
    "Codigo", 
    "Nombre", 
    "Stock Actual", 
    "Stock Critico", 
    "Consumo Diario", 
    "Demanda Semanal", 
    "Cant Sugerida", 
    "Prioridad"
  ];
  
  // Mapeamos las filas
  const dataRows = rows.map(r => [
    `"${r.codigoArticulo || ''}"`,
    `"${(r.nombreArticulo || '').replace(/"/g, '""')}"`,
    `"${r.departamento || ''}"`,
    `"${r.rubro || ''}"`,
    r.stockActual,
    r.stockCritico,
    Number(r.consumoDiarioPromedio || 0).toFixed(1),
    r.demandaEstimadaSemanal.toFixed(1),
    r.sugerida,
    `"${r.prio?.label || 'Normal'}"`
  ]);

  // Unimos con punto y coma (ideal para Excel en español) y saltos de línea
  const csvContent = [
    headers.join(";"),
    ...dataRows.map(e => e.join(";"))
  ].join("\n");

  return csvContent;
};*/
export const generarCSVSugerenciaSemanal = (rows) => {
  // Fecha actual formateada
  const fechaActual = new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  // Metadatos y título para el encabezado del archivo
  const titulo = [";Bebidas 19 - Reporte "];
  const subtitulo = [`;Fecha de emision: ${fechaActual}`];
  const nombreReporte = [";SUGERENCIA SEMANAL"];
  const espacioVacio = [""]; // Fila en blanco para separar

  // Definimos las cabeceras de la tabla
  const headers = [
    "Codigo", 
    "Nombre", 
    "Stock Actual", 
    "Stock Critico", 
    "Consumo Diario", 
    "Demanda Semanal", 
    "Cant Sugerida", 
    "Prioridad"
  ];
  
  // Mapeamos las filas de datos
  const dataRows = rows.map(r => [
    `"${r.codigoArticulo || ''}"`,
    `"${(r.nombreArticulo || '').replace(/"/g, '""')}"`,
    r.stockActual,
    r.stockCritico,
    Number(r.consumoDiarioPromedio || 0).toFixed(1),
    r.demandaEstimadaSemanal.toFixed(1),
    r.sugerida,
    `"${r.prio?.label || 'Normal'}"`
  ]);

  // Unimos todas las secciones en orden con saltos de línea
  const csvContent = [
    nombreReporte.join(";"),
    titulo.join(";"),
    subtitulo.join(";"),
    espacioVacio.join(";"), // Registro de espacio 1
    headers.join(";"),
    ...dataRows.map(e => e.join(";")),
    espacioVacio.join(";")  // Registro de espacio 2 al final (opcional)
  ].join("\n");

  return csvContent;
};

export const descargarCSV = (rows, nombreArchivo = "sugerencia_compras") => {
  const csvContent = generarCSVSugerenciaSemanal(rows);
  
  // Creamos el Blob con codificación UTF-8 y BOM para las tildes
  const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  // Forzamos la descarga en el navegador
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${nombreArchivo}_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};