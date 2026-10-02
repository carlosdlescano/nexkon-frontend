import { API_BASE_URL } from '../config/confURL.js';
import { usePermission } from "../hooks/usePermission";
import { PERMISSIONS } from "../config/permissions";

import { InicioView } from "../pages/InicioView";
import { VentaView } from "../pages/VentaView";
import { ArticulosView } from "../pages/ArticulosView";
//import { StockView } from "./views/StockView";
import { ComprasView } from "../pages/ComprasView";
import { ReportesView } from "../pages/ReportesView";
//import { ConfiguracionView } from "./views/ConfiguracionView";
import { ProveedoresView } from "../pages/ProveedoresView";
import { UsuariosView } from "../pages/UsuariosView";

// Componentes temporales falsos (Mockups) para que no rompa por falta de definición
//const InicioView = () => <div className="p-6 text-gray-700 font-medium">Vista de Inicio (Próximamente)</div>;
//const VentaView = () => <div className="p-6 text-gray-700 font-medium">Vista de Ventas (Próximamente)</div>;
const StockView = () => <div className="p-6 text-gray-700 font-medium">Vista de Stock (Próximamente)</div>;
//const ComprasView = () => <div className="p-6 text-gray-700 font-medium">Vista de Compras (Próximamente)</div>;
//const ReportesView = () => <div className="p-6 text-gray-700 font-medium">Vista de Reportes (Próximamente)</div>;
const ConfiguracionView = () => <div className="p-6 text-gray-700 font-medium">Configuración (Próximamente)</div>;
//const ProveedoresView = () => <div className="p-6 text-gray-700 font-medium">Vista de Proveedores (Próximamente)</div>;
      

export function ContentArea({
  activeView,
  userRole,
  openNuevoProveedor = false,
  onNuevoProveedorClosed,
}) {

  const { can } = usePermission(userRole);
  const renderView = () => {
    switch (activeView) {
      case "inicio":
        //return <InicioView />; return can(PERMISSIONS.VIEW_) ? < /> : <AccesoDenegado />;
        return can(PERMISSIONS.VIEW_INICIO) ? <InicioView /> : <AccesoDenegado />;
      case "venta":
        //return <VentaView />;
        return can(PERMISSIONS.VIEW_VENTAS) ? <VentaView /> : <AccesoDenegado />; 
      case "articulos":
        return can(PERMISSIONS.VIEW_ARTICULOS) ? <ArticulosView /> : <AccesoDenegado />;//<ArticulosView />;
      case "stock":
        return <StockView />;
      case "compras":
        //return <ComprasView />;
        return can(PERMISSIONS.VIEW_COMPRAS) ? <ComprasView /> : <AccesoDenegado />;
      case "reportes":
        return can(PERMISSIONS.VIEW_REPORTES) ? <ReportesView /> : <AccesoDenegado />;
       // return <ReportesView />;
      case "configuracion":
        return <ConfiguracionView />;
      case "usuarios":
        //return <UsuariosView/>;  
        return can(PERMISSIONS.VIEW_USUARIOS) ? <UsuariosView /> : <AccesoDenegado />;
        
      case "proveedores":
        //return (<ProveedoresView  openNuevoModal={openNuevoProveedor} onNuevoModalClosed={onNuevoProveedorClosed} />
        return can(PERMISSIONS.VIEW_PROVEEDORES) ? < ProveedoresView/> : <AccesoDenegado />;
      
      default:
        return can(PERMISSIONS.VIEW_INICIO) ? <InicioView /> : <AccesoDenegado />;
        //return <VentaView />;
    }
  };

  function AccesoDenegado() {
  return (
    <div className="p-8 text-center text-red-600 font-semibold">
      No tienes permisos para acceder a esta sección.
    </div>
  );
}

  return <div className="flex-1 overflow-auto">{renderView()}</div>;
}