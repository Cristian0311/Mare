/**
 * Genera un identificador único local para cada pedido
 * Formato: ORD-YYMMDD-XXXXXX
 */
export function generateOrderId(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  
  const dateStr = `${year}${month}${day}`;
  
  // Generar 6 dígitos aleatorios
  const randomStr = Math.floor(100000 + Math.random() * 900000).toString();
  
  return `ORD-${dateStr}-${randomStr}`;
}
