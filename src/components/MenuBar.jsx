
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
    // ANOTACIÓN: Disparador para la vista de usuarios
    if (menuId === "herramientas" && option === "Usuarios") {
      onNavigate("usuarios");
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
      className="border-b relative z-50 bg-white border-green-200"
    >
      <div className="flex items-center px-6 py-3">
        <div className="mr-8">
          <h1 className="text-xl font-semibold text-green-700">
            NexKon
          </h1>
        </div>

        <div className="flex gap-6">
          {menuItems.map((item) => (
            <div key={item.id} className="relative">
              <button
                className="px-3 py-1 transition-colors rounded hover:bg-gray-50 text-gray-800"
                onMouseEnter={() => setActiveMenu(item.id)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {item.label}
              </button>

              {activeMenu === item.id && (
                <div
                  className="absolute top-full left-0 mt-1 py-2 rounded shadow-lg border min-w-[160px] bg-white border-green-200"
                  onMouseEnter={() => setActiveMenu(item.id)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {item.options.map((option) =>
                    typeof option === "string" ? (
                      <button
                        key={option}
                        onClick={() => handleMenuItemClick(item.id, option)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm text-gray-800"
                      >
                        {option}
                      </button>
                    ) : (
                      <div key={option.label} className="relative group">
                        <button
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm flex justify-between items-center text-gray-800"
                        >
                          {option.label}
                          <span className="text-gray-400">▸</span>
                        </button>
                        <div
                          className="absolute left-full top-0 hidden group-hover:block rounded shadow-lg border min-w-[120px] py-1 bg-white border-green-200"
                        >
                          {option.subOptions.map((sub) => (
                            <button
                              key={sub}
                              onClick={() => handleMenuItemClick(item.id, sub)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm text-gray-800"
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
            className="flex items-center gap-2 px-3 py-1 rounded bg-green-50"
          >
            <User size={16} className="text-green-600" />
            <span className="text-gray-800">{username}</span>
            <span
              className={`px-2 py-0.5 rounded text-xs text-white ${
                userRole === "admin" ? "bg-green-700" : "bg-green-600"
              }`}
            >
              {userRole?.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1 rounded text-gray-800 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}