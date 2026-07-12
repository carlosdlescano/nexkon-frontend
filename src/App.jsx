

import { useState, useEffect } from "react";
import { LoginScreen } from "./components/LoginScreen";
import { MenuBar } from "./components/MenuBar";
import { NavigationPanel } from "./components/NavigationPanel";
import { ContentArea } from "./components/ContentArea";
import { MobileNav } from "./components/MobileNav";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export default function App() {
  const [activeView, setActiveView] = useState("inicioView");//inicio por defecto
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState("");
  const [openNuevoProveedor, setOpenNuevoProveedor] = useState(false);
  const isMobile = useIsMobile();

  const handleLogin = (user, role) => {
    setUsername(user);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername("");
    setActiveView("inicio");
  };

  const handleOpenNuevoProveedor = () => {
    setActiveView("proveedores");
    setOpenNuevoProveedor(true);
  };

  const handleNuevoProveedorClosed = () => {
    setOpenNuevoProveedor(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  /* ── Layout Mobile ── */
  if (isMobile) {
    return (
      <div
        className="flex flex-col"
        style={{
          backgroundColor: "#F0F8F4",
          height: "100dvh",
          paddingBottom: "calc(56px + env(safe-area-inset-bottom))",
        }}
      >
        {/* Top bar compacta para celular */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b shrink-0"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
        >
          <h1 className="text-lg font-semibold" style={{ color: "#388E3C" }}>
            NexKon
          </h1>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm"
            style={{ backgroundColor: "#E8F5E9", color: "#388E3C" }}
          >
            <span>{username}</span>
            <span
              className="px-1.5 py-0.5 rounded-full text-xs"
              style={{ backgroundColor: "#388E3C", color: "#FFFFFF" }}
            >
              {userRole?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Área de contenido scroleable en móvil */}
        <div className="flex-1 overflow-auto">
          <ContentArea
            activeView={activeView}
            openNuevoProveedor={openNuevoProveedor}
            onNuevoProveedorClosed={handleNuevoProveedorClosed}
          />
        </div>

        {/* Navegación inferior fija */}
        <MobileNav
          activeView={activeView}
          onViewChange={setActiveView}
          userRole={userRole}
          username={username}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  /* ── Layout Escritorio (Desktop) ── */
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "#F0F8F4" }}>
      {/* Barra superior fija */}
      <MenuBar
        username={username}
        userRole={userRole}
        onLogout={handleLogout}
        onNavigate={setActiveView}
        onOpenNuevoProveedor={handleOpenNuevoProveedor}
      />
      
      {/* Cuerpo principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel lateral izquierdo fijo */}
        <NavigationPanel
          activeView={activeView}
          onViewChange={setActiveView}
          userRole={userRole}
        />
        
        {/* Área central derecha contenedora (Maneja el scroll de forma aislada) */}
        <main className="flex-1 overflow-y-auto">
          <ContentArea
            activeView={activeView}
            openNuevoProveedor={openNuevoProveedor}
            onNuevoProveedorClosed={handleNuevoProveedorClosed}
          />
        </main>
      </div>
    </div>
  );
}