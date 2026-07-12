import { useState } from "react";
import { LogOut, User } from "lucide-react";

export function MenuBar({
  username,
  userRole,
  onLogout,
  onNavigate,
  onOpenNuevoProveedor,
}) {
  const [activeMenu, setActiveMenu] = useState(null);

  const menuItems = [
    {
      id: "archivo",
      label: "Archivo",
      options: ["Nuevo", "Abrir", "Guardar", "Salir"],
    },
    {
      id: "registro",
      label: "Registro",
      options: [
        "Nuevo Registro",
        { label: "Proveedores", subOptions: ["Ver", "Nuevo"] },
        "Ver Registros",
        "Exportar",
      ],
    },
    {
      id: "edicion",
      label: "Edición",
      options: ["Deshacer", "Rehacer", "Copiar", "Pegar"],
    },
    {
      id: "herramientas",
      label: "Herramientas",
      options: ["Configuración", "Usuarios", "Plugins"],
    },
    {
      id: "ayuda",
      label: "Ayuda",
      options: ["Documentación", "Acerca de", "Soporte"],
    },
  ];

  const handleMenuItemClick = (menuId, option) => {
    if (menuId === "herramientas" && option === "Configuración") {
      onNavigate("configuracion");
      setActiveMenu(null);
    }
    if (menuId === "archivo" && option === "Salir") {
      onLogout();
    }
    if (menuId === "registro" && option === "Ver") {
      onNavigate("proveedores");
      setActiveMenu(null);
    }
    if (menuId === "registro" && option === "Nuevo") {
      onNavigate("proveedores");
      onOpenNuevoProveedor();
      setActiveMenu(null);
    }
  };

  return (
    <div
      className="border-b relative z-50"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
    >
      <div className="flex items-center px-6 py-3">
        <div className="mr-8">
          <h1 className="text-xl font-semibold" style={{ color: "#388E3C" }}>
            NexKon
          </h1>
        </div>

        <div className="flex gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="relative">
              <button
                className="px-3 py-1 transition-colors rounded hover:bg-gray-50"
                style={{ color: "#333333" }}
                onMouseEnter={() => setActiveMenu(item.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {item.label}
              </button>

              {activeMenu === item.id && (
                <div
                  className="absolute top-full left-0 mt-1 py-2 rounded shadow-lg border min-w-[160px]"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
                  onMouseEnter={() => setActiveMenu(item.id)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {item.options.map((option) =>
                    typeof option === "string" ? (
                      <button
                        key={option}
                        onClick={() => handleMenuItemClick(item.id, option)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                        style={{ color: "#333333" }}
                      >
                        {option}
                      </button>
                    ) : (
                      <div key={option.label} className="relative group">
                        <button
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm flex justify-between items-center"
                          style={{ color: "#333333" }}
                        >
                          {option.label}
                          <span style={{ color: "#888888" }}>▸</span>
                        </button>
                        <div
                          className="absolute left-full top-0 hidden group-hover:block rounded shadow-lg border min-w-[120px] py-1"
                          style={{ backgroundColor: "#FFFFFF", borderColor: "#C8E6C9" }}
                        >
                          {option.subOptions.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => handleMenuItemClick(item.id, sub)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                              style={{ color: "#333333" }}
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User info */}
        <div className="ml-auto flex items-center gap-4">
          <div
            className="flex items-center gap-2 px-3 py-1 rounded"
            style={{ backgroundColor: "#E8F5E9" }}
          >
            <User size={16} style={{ color: "#4CAF50" }} />
            <span style={{ color: "#333333" }}>{username}</span>
            <span
              className="px-2 py-0.5 rounded text-xs"
              style={{
                backgroundColor: userRole === "admin" ? "#388E3C" : "#4CAF50",
                color: "#FFFFFF",
              }}
            >
              {userRole?.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1 rounded transition-colors"
            style={{ color: "#333333" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#FFEBEE";
              e.currentTarget.style.color = "#C62828";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#333333";
            }}
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}