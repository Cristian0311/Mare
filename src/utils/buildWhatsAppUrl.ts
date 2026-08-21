/**
 * Construye la URL de WhatsApp con el número y el mensaje codificado
 */
export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  // Eliminar cualquier carácter que no sea número
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Codificar el mensaje para URL
  const encodedMessage = encodeURIComponent(message);
  
  // Usar api.whatsapp.com para mejor compatibilidad universal
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
}
