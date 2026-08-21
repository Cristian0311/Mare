import { Construction } from 'lucide-react';

function PlaceholderPage({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Construction size={64} className="text-gray-300 mb-6" />
      <h1 className="text-2xl font-black text-mare-navy uppercase tracking-tight mb-2">{title}</h1>
      <p className="text-gray-500 max-w-md">{description}</p>
    </div>
  );
}

export const AdminProducts = () => <PlaceholderPage title="Productos" description="Gestión de catálogo de productos." />;
export const AdminCategories = () => <PlaceholderPage title="Categorías" description="Administración de categorías y subcategorías." />;
export const AdminWholesale = () => <PlaceholderPage title="Mayoristas" description="Configuración de venta mayorista por producto." />;
export const AdminOrders = () => <PlaceholderPage title="Pedidos" description="Historial de pedidos." />;
export const AdminCustomers = () => <PlaceholderPage title="Clientes" description="Directorio de clientes." />;
export const AdminLocations = () => <PlaceholderPage title="Provincias y Municipios" description="Zonas de entrega." />;
export const AdminDelivery = () => <PlaceholderPage title="Entregas" description="Configuración de envíos." />;
export const AdminAdvisors = () => <PlaceholderPage title="Asesores" description="Gestión de equipo de ventas." />;
export const AdminWhatsApp = () => <PlaceholderPage title="WhatsApp" description="Configuración de mensajes." />;
export const AdminPrices = () => <PlaceholderPage title="Precios y Monedas" description="Tasa de cambio y moneda." />;
export const AdminContent = () => <PlaceholderPage title="Contenido" description="Banners y destacados." />;
export const AdminSettings = () => <PlaceholderPage title="Configuración" description="Preferencias generales." />;
