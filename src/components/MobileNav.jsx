import { Home, ShoppingCart, Package, BarChart3, ShoppingBag, FileText, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";

const ALL_ITEMS = [
  { id: "inicio",    label: "Inicio",    icon: Home,         adminOnly: false },
  { id: "venta",     label: "Venta",     icon: ShoppingCart, adminOnly: false },
  { id: "articulos", label: "Artículos", icon: Package,      adminOnly: false }, // 👈 Permitido para usuario estándar
  { id: "stock",     label: "Stock",     icon: BarChart3,    adminOnly: true  },
  { id: "compras",   label: "Compras",   icon: ShoppingBag,  adminOnly: true  },
  { id: "reportes",  label: "Reportes",  icon: FileText,     adminOnly: true  },
];

export function MobileNav({ activeView, onViewChange, userRole, username, onLogout }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Normalización de rol
  const role = userRole?.toString().trim().toLowerCase();
  const visibleItems = ALL_ITEMS.filter((i) => !i.adminOnly || role === "admin");

  // Muestra hasta 4 elementos en la barra inferior + botón "Más" si hay adicionales
  const bottomItems = visibleItems.slice(0, 4);
  const hasMore = visibleItems.length > 4;
  const extraItems = visibleItems.slice(4);

  const handleNav = (view) => {
    onViewChange(view);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* ── Barra de navegación inferior ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t flex items-stretch"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#C8E6C9",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors relative"
              style={{ color: isActive ? "#4CAF50" : "#888888" }}
            >
              <Icon size={22} />
              <span className="text-xs leading-none">{item.label}</span>
              {isActive && (
                <span
                  className="absolute bottom-0 h-0.5 w-10 rounded-t-full"
                  style={{ backgroundColor: "#4CAF50" }}
                />
              )}
            </button>
          );
        })}

        {hasMore && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors"
            style={{ color: "#888888" }}
          >
            <Menu size={22} />
            <span className="text-xs leading-none">Más</span>
          </button>
        )}
      </nav>

      {/* ── Menú desplegable (Drawer) ── */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl shadow-2xl"
            style={{
              backgroundColor: "#FFFFFF",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {/* Tirador visual */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "#C8E6C9" }} />
            </div>

            {/* Encabezado */}
            <div
              className="flex items-center justify-between px-5 py-3 border-b"
              style={{ borderColor: "#C8E6C9" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#E8F5E9" }}
                >
                  <User size={16} style={{ color: "#4CAF50" }} />
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: "#333333" }}>{username}</div>
                  <div className="text-xs" style={{ color: "#888888" }}>{userRole?.toUpperCase()}</div>
                </div>
              </div>
              <button onClick={() => setDrawerOpen(false)}>
                <X size={20} style={{ color: "#888888" }} />
              </button>
            </div>

            {/* Elementos de navegación extra */}
            <div className="px-4 py-3 space-y-1">
              {extraItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors"
                    style={{
                      backgroundColor: isActive ? "#E8F5E9" : "transparent",
                      color: isActive ? "#388E3C" : "#333333",
                    }}
                  >
                    <Icon size={22} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Cierre de sesión */}
            <div className="px-4 pb-4 border-t pt-3" style={{ borderColor: "#F0F0F0" }}>
              <button
                onClick={() => { setDrawerOpen(false); onLogout(); }}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors"
                style={{ color: "#C62828" }}
                onTouchStart={(e) => (e.currentTarget.style.backgroundColor = "#FFEBEE")}
                onTouchEnd={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <LogOut size={22} />
                <span className="font-medium">Cerrar sesión</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}