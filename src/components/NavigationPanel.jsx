import {
  ShoppingCart,
  Package,
  BarChart3,
  ShoppingBag,
  FileText,
  Home,
  Menu,
  Users, // Importamos el icono de usuarios
} from "lucide-react";
import { useState } from "react";
// 1. Importar el archivo de permisos centralizados
import { PERMISSIONS, checkPermission } from "../config/permissions";

export function NavigationPanel({
  activeView,
  onViewChange,
  userRole,
}) {
  const [menuColapsado, setMenuColapsado] = useState(false);

  // 2. Vincular los items del menú a las constantes de PERMISSIONS
  const navItems = [
    {
      id: "inicio",
      label: "Inicio",
      icon: Home,
      permission: PERMISSIONS.VIEW_ARTICULOS, // Accesible por todos los roles autenticados
    },
    {
      id: "articulos",
      label: "Artículos",
      icon: Package,
      permission: PERMISSIONS.VIEW_ARTICULOS,
    },
    {
      id: "venta",
      label: "Venta",
      icon: ShoppingCart,
      permission: PERMISSIONS.VIEW_VENTAS,
    },
    {
      id: "stock",
      label: "Stock",
      icon: BarChart3,
      permission: PERMISSIONS.VIEW_STOCK,
    },
    {
      id: "compras",
      label: "Compras",
      icon: ShoppingBag,
      permission: PERMISSIONS.VIEW_COMPRAS,
    },   
    {
      id: "reportes",
      label: "Reportes",
      icon: FileText,
      permission: PERMISSIONS.VIEW_REPORTES,
    },
    /**  {
      id: "usuarios",
      label: "Usuarios",
      icon: Users,
      permission: PERMISSIONS.VIEW_USUARIOS,
    },*/
  ];

  // 3. Filtrar usando la función auxiliar centralizada (tolera "user", "Usuario", etc.)
  const filteredNavItems = navItems.filter((item) =>
    checkPermission(userRole, item.permission)
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

      {/* 4. Normalizamos la verificación para el mensaje de aviso */}
      {checkPermission(userRole, ["user", "usuario"]) && !menuColapsado && (
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