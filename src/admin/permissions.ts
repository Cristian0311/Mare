// Preparación conceptual de permisos y roles (NO implementado en la UI todavía)
export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'OPERADOR' | 'CATALOGO' | 'LOGISTICA';

export const rolePermissions: Record<AdminRole, string[]> = {
  SUPER_ADMIN: ['*'], // Acceso total
  ADMIN: [
    'view_dashboard',
    'manage_products',
    'manage_categories',
    'manage_orders',
    'manage_customers',
    'manage_delivery',
    'manage_advisors',
    'manage_whatsapp',
    'manage_settings'
  ],
  OPERADOR: [
    'view_dashboard',
    'manage_orders',
    'view_customers',
    'view_products'
  ],
  CATALOGO: [
    'manage_products',
    'manage_categories',
    'view_dashboard'
  ],
  LOGISTICA: [
    'manage_delivery',
    'view_orders',
    'view_dashboard'
  ]
};
