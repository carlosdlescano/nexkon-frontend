
export const ROLES = {
  ADMIN: ["admin", "administrador"],
  SUPERVISOR: ["supervisor"],
  USER: ["user", "usuario"],
};

export const PERMISSIONS = {
  // Vistas/Módulos
  VIEW_USUARIOS: [...ROLES.ADMIN, ...ROLES.SUPERVISOR],
  VIEW_COMPRAS: [...ROLES.ADMIN, ...ROLES.SUPERVISOR],
  VIEW_PROVEEDORES: [...ROLES.ADMIN, ...ROLES.SUPERVISOR],
  VIEW_ARTICULOS: [...ROLES.ADMIN, ...ROLES.SUPERVISOR, ...ROLES.USER],
  VIEW_VENTAS: [...ROLES.ADMIN, ...ROLES.SUPERVISOR, ...ROLES.USER],
  VIEW_INICIO: [...ROLES.ADMIN, ...ROLES.SUPERVISOR],
  VIEW_REPORTES: [...ROLES.ADMIN],
  VIEW_STOCK: [...ROLES.ADMIN],
  VIEW_REPORTES: [...ROLES.ADMIN],

  // Acciones específicas dentro de Usuarios
  CREATE_USUARIO: [...ROLES.ADMIN, ...ROLES.SUPERVISOR],
  EDIT_USUARIO: [...ROLES.ADMIN],
  DELETE_USUARIO: [...ROLES.ADMIN],
};

export function checkPermission(userRole, allowedRoles) {
  if (!userRole || !allowedRoles) return false;
  const roleNormalized = String(userRole).trim().toLowerCase();
  return allowedRoles.some((r) => r.toLowerCase() === roleNormalized);
}
