import {
  ShoppingCart,
  Package,
  BarChart3,
  ShoppingBag,
  FileText,
  Home,
  Menu,
} from "lucide-react";
import { useState } from "react";

export function NavigationPanel({
  activeView,
  onViewChange,
  userRole,
}) {
  const [menuColapsado, setMenuColapsado] = useState(false);

  const navItems = [
    {
      id: "inicio",
      label: "Inicio",
      icon: Home,
      allowedRoles: ["admin", "user"],
    },
    {
      id: "articulos",
      label: "Artículos",
      icon: Package,
      allowedRoles: ["admin"],
    },
    {
      id: "venta",
      label: "Venta",
      icon: ShoppingCart,
      allowedRoles: ["admin", "user"],
    },
    {
      id: "stock",
      label: "Stock",
      icon: BarChart3,
      allowedRoles: ["admin"],
    },
    {
      id: "compras",
      label: "Compras",
      icon: ShoppingBag,
      allowedRoles: ["admin"],
    },
    {
      id: "reportes",
      label: "Reportes",
      icon: FileText,
      allowedRoles: ["admin"],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => userRole && item.allowedRoles.includes(userRole),
  );

  return (
    <div
      className={`border-r flex flex-col transition-all duration-300 ${menuColapsado ? "w-16 p-2" : "w-64 p-4"}`}
      style={{ backgroundColor: "#E8F5E9", borderColor: "#C8E6C9" }}
    >
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setMenuColapsado(!menuColapsado)}
          className="p-2 rounded hover:bg-gray-100"
          style={{ color: "#333333" }}
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="space-y-2">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-lg transition-all duration-200"
              style={{
                backgroundColor: isActive ? "#388E3C" : "#E8F5E9",
                color: isActive ? "#FFFFFF" : "#333333",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#4CAF50";
                  e.currentTarget.style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "#E8F5E9";
                  e.currentTarget.style.color = "#333333";
                }
              }}
            >
              <Icon size={24} />
              {!menuColapsado && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {userRole === "user" && !menuColapsado && (
        <div
          className="mt-auto p-4 rounded-lg"
          style={{ backgroundColor: "#FFF9C4" }}
        >
          <p className="text-xs" style={{ color: "#F57F17" }}>
            Acceso limitado a módulo de ventas. Contacte al administrador para más permisos.
          </p>
        </div>
      )}
    </div>
  );
}