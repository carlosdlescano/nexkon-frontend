

import { checkPermission } from "../config/permissions";

export function usePermission(userRole) {
  const can = (allowedRoles) => {
    // Si userRole es un objeto, extraemos la propiedad 'rol'
    const roleString = typeof userRole === 'object' && userRole !== null 
      ? userRole.rol 
      : userRole;

    return checkPermission(roleString, allowedRoles);
  };

  return { can };
}