import { InicioView } from "../pages/InicioView";
import { VentaView } from "../pages/VentaView";
import { ArticulosView } from "../pages/ArticulosView";
/*import { StockView } from "./views/StockView";
import { ComprasView } from "./views/ComprasView";
import { ReportesView } from "./views/ReportesView";
import { ConfiguracionView } from "./views/ConfiguracionView";
import { ProveedoresView } from "./views/ProveedoresView";*/

// Componentes temporales falsos (Mockups) para que no rompa por falta de definición
//const InicioView = () => <div className="p-6 text-gray-700 font-medium">Vista de Inicio (Próximamente)</div>;
//const VentaView = () => <div className="p-6 text-gray-700 font-medium">Vista de Ventas (Próximamente)</div>;
const StockView = () => <div className="p-6 text-gray-700 font-medium">Vista de Stock (Próximamente)</div>;
const ComprasView = () => <div className="p-6 text-gray-700 font-medium">Vista de Compras (Próximamente)</div>;
const ReportesView = () => <div className="p-6 text-gray-700 font-medium">Vista de Reportes (Próximamente)</div>;
const ConfiguracionView = () => <div className="p-6 text-gray-700 font-medium">Configuración (Próximamente)</div>;
const ProveedoresView = () => <div className="p-6 text-gray-700 font-medium">Vista de Proveedores (Próximamente)</div>;

export function ContentArea({
  activeView,
  openNuevoProveedor = false,
  onNuevoProveedorClosed,
}) {
  const renderView = () => {
    switch (activeView) {
      case "inicio":
        return <InicioView />;
      case "venta":
        return <VentaView />;
      case "articulos":
        return <ArticulosView />;
      case "stock":
        return <StockView />;
      case "compras":
        return <ComprasView />;
      case "reportes":
        return <ReportesView />;
      case "configuracion":
        return <ConfiguracionView />;
      case "proveedores":
        return (
          <ProveedoresView
            openNuevoModal={openNuevoProveedor}
            onNuevoModalClosed={onNuevoProveedorClosed}
          />
        );
      default:
        return <VentaView />;
    }
  };

  return <div className="flex-1 overflow-auto">{renderView()}</div>;
}