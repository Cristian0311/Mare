import { Category } from '../types';

export const categories: Category[] = [
  { 
    id: 'hogar', nombre: 'Hogar', slug: 'hogar', icono: 'hogar',
    descripcion: 'Todo para organizar, decorar y mantener tu espacio.',
    subcategorias: [
      { id: 'hogar-1', nombre: 'Muebles', slug: 'muebles' },
      { id: 'hogar-2', nombre: 'Organización', slug: 'organizacion' },
      { id: 'hogar-3', nombre: 'Decoración', slug: 'decoracion' },
      { id: 'hogar-4', nombre: 'Iluminación', slug: 'iluminacion' },
      { id: 'hogar-5', nombre: 'Ropa de Cama y Baño', slug: 'ropa-cama-bano' },
      { id: 'hogar-6', nombre: 'Utensilios de Cocina', slug: 'utensilios-cocina' },
      { id: 'hogar-7', nombre: 'Limpieza', slug: 'limpieza' },
      { id: 'hogar-8', nombre: 'Jardín y Exteriores', slug: 'jardin-exteriores' }
    ]
  },
  { 
    id: 'electro', nombre: 'Electrodomésticos', slug: 'electrodomesticos', icono: 'electrodomesticos',
    descripcion: 'Equipos para el hogar, cocina y climatización.',
    subcategorias: [
      { id: 'electro-1', nombre: 'Refrigeración', slug: 'refrigeracion' },
      { id: 'electro-2', nombre: 'Climatización y Ventilación', slug: 'climatizacion' },
      { id: 'electro-3', nombre: 'Cocina y Hornos', slug: 'cocina-hornos' },
      { id: 'electro-4', nombre: 'Lavado y Secado', slug: 'lavado-secado' },
      { id: 'electro-5', nombre: 'Pequeños Electrodomésticos', slug: 'pequenos-electrodomesticos' },
      { id: 'electro-6', nombre: 'Licuadoras y Batidoras', slug: 'licuadoras-batidoras' },
      { id: 'electro-7', nombre: 'Cafeteras', slug: 'cafeteras' },
      { id: 'electro-8', nombre: 'Planchas', slug: 'planchas' }
    ]
  },
  { 
    id: 'tecnologia', nombre: 'Tecnología', slug: 'tecnologia', icono: 'tecnologia',
    descripcion: 'Dispositivos, computadoras, celulares y accesorios.',
    subcategorias: [
      { id: 'tech-1', nombre: 'Celulares y Smartphones', slug: 'celulares' },
      { id: 'tech-2', nombre: 'Laptops y Computadoras', slug: 'computadoras' },
      { id: 'tech-3', nombre: 'Televisores y Smart TVs', slug: 'televisores' },
      { id: 'tech-4', nombre: 'Tablets', slug: 'tablets' },
      { id: 'tech-5', nombre: 'Audífonos y Audio', slug: 'audio' },
      { id: 'tech-6', nombre: 'Smartwatches', slug: 'smartwatches' },
      { id: 'tech-7', nombre: 'Accesorios para Celulares', slug: 'accesorios-celulares' },
      { id: 'tech-8', nombre: 'Almacenamiento (USB, Discos)', slug: 'almacenamiento' },
      { id: 'tech-9', nombre: 'Cables y Cargadores', slug: 'cables-cargadores' }
    ]
  },
  { 
    id: 'ropa', nombre: 'Ropa', slug: 'ropa', icono: 'ropa',
    descripcion: 'Ropa y estilo de vestir para toda la familia.',
    subcategorias: [
      { id: 'ropa-1', nombre: 'Ropa para Mujer', slug: 'ropa-mujer' },
      { id: 'ropa-2', nombre: 'Ropa para Hombre', slug: 'ropa-hombre' },
      { id: 'ropa-3', nombre: 'Ropa Infantil', slug: 'ropa-infantil' },
      { id: 'ropa-4', nombre: 'Ropa Deportiva', slug: 'ropa-deportiva' },
      { id: 'ropa-5', nombre: 'Ropa Interior', slug: 'ropa-interior' },
      { id: 'ropa-6', nombre: 'Pijamas', slug: 'pijamas' },
      { id: 'ropa-7', nombre: 'Trajes de Baño', slug: 'trajes-bano' }
    ]
  },
  { 
    id: 'calzado', nombre: 'Calzado', slug: 'calzado', icono: 'calzado',
    descripcion: 'Zapatos, zapatillas y sandalias para cada ocasión.',
    subcategorias: [
      { id: 'calzado-1', nombre: 'Calzado para Mujer', slug: 'calzado-mujer' },
      { id: 'calzado-2', nombre: 'Calzado para Hombre', slug: 'calzado-hombre' },
      { id: 'calzado-3', nombre: 'Calzado Infantil', slug: 'calzado-infantil' },
      { id: 'calzado-4', nombre: 'Zapatos Deportivos / Tenis', slug: 'zapatos-deportivos' },
      { id: 'calzado-5', nombre: 'Sandalias y Chancletas', slug: 'sandalias' },
      { id: 'calzado-6', nombre: 'Zapatos Casuales', slug: 'calzado-casual' },
      { id: 'calzado-7', nombre: 'Botas', slug: 'botas' }
    ]
  },
  { 
    id: 'belleza', nombre: 'Belleza y Cuidado', slug: 'belleza', icono: 'belleza',
    descripcion: 'Productos para cuidar de ti: maquillaje, perfumes y más.',
    subcategorias: [
      { id: 'belleza-1', nombre: 'Maquillaje', slug: 'maquillaje' },
      { id: 'belleza-2', nombre: 'Perfumes y Fragancias', slug: 'perfumes' },
      { id: 'belleza-3', nombre: 'Cuidado Facial', slug: 'cuidado-facial' },
      { id: 'belleza-4', nombre: 'Cuidado del Cabello', slug: 'cuidado-cabello' },
      { id: 'belleza-5', nombre: 'Cuidado Corporal', slug: 'cuidado-corporal' },
      { id: 'belleza-6', nombre: 'Máquinas de Afeitar y Pelar', slug: 'maquinas-afeitar' },
      { id: 'belleza-7', nombre: 'Planchas y Secadoras de Pelo', slug: 'planchas-pelo' }
    ]
  },
  { 
    id: 'bisuteria', nombre: 'Bisutería y Accesorios', slug: 'bisuteria', icono: 'bisuteria',
    descripcion: 'Aretes, collares, anillos, relojes y gafas de sol.',
    subcategorias: [
      { id: 'bisuteria-1', nombre: 'Collares y Cadenas', slug: 'collares' },
      { id: 'bisuteria-2', nombre: 'Anillos', slug: 'anillos' },
      { id: 'bisuteria-3', nombre: 'Aretes y Pendientes', slug: 'aretes' },
      { id: 'bisuteria-4', nombre: 'Pulseras y Brazaletes', slug: 'pulseras' },
      { id: 'bisuteria-5', nombre: 'Juegos de Bisutería', slug: 'juegos-bisuteria' },
      { id: 'bisuteria-6', nombre: 'Relojes', slug: 'relojes' },
      { id: 'bisuteria-7', nombre: 'Gafas de Sol', slug: 'gafas' },
      { id: 'bisuteria-8', nombre: 'Cinturones y Correas', slug: 'cinturones' }
    ]
  },
  {
    id: 'alimentos', nombre: 'Alimentos y Bebidas', slug: 'alimentos-bebidas', icono: 'alimentos',
    descripcion: 'Productos de alimentación, conservas, refrescos y licores.',
    subcategorias: [
      { id: 'ali-1', nombre: 'Cárnicos y Embutidos', slug: 'carnicos' },
      { id: 'ali-2', nombre: 'Lácteos y Quesos', slug: 'lacteos' },
      { id: 'ali-3', nombre: 'Granos, Pastas y Cereales', slug: 'granos' },
      { id: 'ali-4', nombre: 'Aceites y Grasas', slug: 'aceites' },
      { id: 'ali-5', nombre: 'Conservas y Enlatados', slug: 'conservas' },
      { id: 'ali-6', nombre: 'Café, Azúcar y Dulces', slug: 'cafe-dulces' },
      { id: 'ali-7', nombre: 'Salsas y Condimentos', slug: 'salsas' },
      { id: 'ali-8', nombre: 'Refrescos y Jugos', slug: 'refrescos' },
      { id: 'ali-9', nombre: 'Cervezas y Licores', slug: 'cervezas-licores' }
    ]
  },
  {
    id: 'aseo', nombre: 'Aseo y Limpieza', slug: 'aseo', icono: 'aseo',
    descripcion: 'Higiene personal, desodorantes, jabones y detergentes.',
    subcategorias: [
      { id: 'aseo-1', nombre: 'Jabón de Baño y Champú', slug: 'jabon-champu' },
      { id: 'aseo-2', nombre: 'Desodorantes', slug: 'desodorantes' },
      { id: 'aseo-3', nombre: 'Pasta Dental', slug: 'pasta-dental' },
      { id: 'aseo-4', nombre: 'Detergentes y Jabón de Lavar', slug: 'detergentes' },
      { id: 'aseo-5', nombre: 'Limpieza del Hogar', slug: 'limpieza-hogar' },
      { id: 'aseo-6', nombre: 'Papel Higiénico y Servilletas', slug: 'papel-higienico' },
      { id: 'aseo-7', nombre: 'Afeitado y Depilación', slug: 'afeitado' }
    ]
  },
  {
    id: 'salud', nombre: 'Salud y Bienestar', slug: 'salud', icono: 'salud',
    descripcion: 'Vitaminas, suplementos alimenticios e insumos médicos.',
    subcategorias: [
      { id: 'salud-1', nombre: 'Vitaminas y Minerales', slug: 'vitaminas' },
      { id: 'salud-2', nombre: 'Analgésicos', slug: 'analgesicos' },
      { id: 'salud-3', nombre: 'Suplementos Deportivos', slug: 'suplementos' },
      { id: 'salud-4', nombre: 'Insumos Médicos', slug: 'insumos-medicos' },
      { id: 'salud-5', nombre: 'Cuidado Infantil de Salud', slug: 'salud-infantil' },
      { id: 'salud-6', nombre: 'Primeros Auxilios', slug: 'primeros-auxilios' }
    ]
  },
  { 
    id: 'mochilas', nombre: 'Mochilas y Bolsos', slug: 'mochilas-bolsos', icono: 'mochilas',
    descripcion: 'Mochilas, bolsos, carteras de hombro y maletines.',
    subcategorias: [
      { id: 'mochilas-1', nombre: 'Mochilas Escolares', slug: 'mochilas-escolares' },
      { id: 'mochilas-2', nombre: 'Mochilas Deportivas', slug: 'mochilas-deportivas' },
      { id: 'mochilas-3', nombre: 'Mochilas para Laptop', slug: 'mochilas-laptop' },
      { id: 'mochilas-4', nombre: 'Carteras y Bolsos de Mujer', slug: 'carteras-mujer' },
      { id: 'mochilas-5', nombre: 'Billeteras y Monederos', slug: 'billeteras' },
      { id: 'mochilas-6', nombre: 'Bolsos de Viaje y Maletas', slug: 'maletas' }
    ]
  },
  { 
    id: 'ninos', nombre: 'Niños y Bebés', slug: 'ninos', icono: 'ninos',
    descripcion: 'Todo lo necesario para los más pequeños del hogar.',
    subcategorias: [
      { id: 'ninos-1', nombre: 'Juguetes', slug: 'juguetes' },
      { id: 'ninos-2', nombre: 'Coches y Andadores', slug: 'coches-andadores' },
      { id: 'ninos-3', nombre: 'Biberones y Chupetes', slug: 'biberones' },
      { id: 'ninos-4', nombre: 'Pañales y Toallitas', slug: 'panales' },
      { id: 'ninos-5', nombre: 'Artículos Escolares', slug: 'articulos-escolares' },
      { id: 'ninos-6', nombre: 'Juegos Didácticos', slug: 'juegos-didacticos' }
    ]
  },
  { 
    id: 'ferreteria', nombre: 'Ferretería y Herramientas', slug: 'ferreteria', icono: 'ferreteria',
    descripcion: 'Materiales, herramientas manuales y eléctricas.',
    subcategorias: [
      { id: 'ferr-1', nombre: 'Herramientas Eléctricas', slug: 'herramientas-electricas' },
      { id: 'ferr-2', nombre: 'Herramientas Manuales', slug: 'herramientas-manuales' },
      { id: 'ferr-3', nombre: 'Materiales Eléctricos', slug: 'materiales-electricos' },
      { id: 'ferr-4', nombre: 'Plomería y Baño', slug: 'plomeria' },
      { id: 'ferr-5', nombre: 'Pinturas y Adhesivos', slug: 'pinturas' },
      { id: 'ferr-6', nombre: 'Tornillería y Clavos', slug: 'tornilleria' },
      { id: 'ferr-7', nombre: 'Seguridad y Cerrajería', slug: 'cerrajeria' }
    ]
  },
  { 
    id: 'automotor', nombre: 'Automotor', slug: 'automotor', icono: 'automotor',
    descripcion: 'Accesorios y piezas para autos, motos y bicicletas.',
    subcategorias: [
      { id: 'auto-1', nombre: 'Motos y Bicicletas Eléctricas', slug: 'motos-electricas' },
      { id: 'auto-2', nombre: 'Repuestos para Motos', slug: 'repuestos-motos' },
      { id: 'auto-3', nombre: 'Accesorios de Auto', slug: 'accesorios-auto' },
      { id: 'auto-4', nombre: 'Llantas y Neumáticos', slug: 'llantas' },
      { id: 'auto-5', nombre: 'Baterías', slug: 'baterias' },
      { id: 'auto-6', nombre: 'Lubricantes y Aceites', slug: 'lubricantes' },
      { id: 'auto-7', nombre: 'Bicicletas y Repuestos', slug: 'bicicletas' }
    ]
  },
  { 
    id: 'deportes', nombre: 'Deportes y Fitness', slug: 'deportes', icono: 'deportes',
    descripcion: 'Equipamiento para mantenerte activo y saludable.',
    subcategorias: [
      { id: 'dep-1', nombre: 'Equipos de Gimnasio', slug: 'equipos-gimnasio' },
      { id: 'dep-2', nombre: 'Pesas y Mancuernas', slug: 'pesas' },
      { id: 'dep-3', nombre: 'Artículos de Béisbol', slug: 'beisbol' },
      { id: 'dep-4', nombre: 'Fútbol y Balones', slug: 'futbol' },
      { id: 'dep-5', nombre: 'Ropa Deportiva', slug: 'ropa-fitness' },
      { id: 'dep-6', nombre: 'Accesorios Deportivos', slug: 'accesorios-deportes' }
    ]
  },
  { 
    id: 'mascotas', nombre: 'Mascotas', slug: 'mascotas', icono: 'mascotas',
    descripcion: 'Alimentos y accesorios para tus animales de compañía.',
    subcategorias: [
      { id: 'masc-1', nombre: 'Alimento para Perros', slug: 'alimento-perros' },
      { id: 'masc-2', nombre: 'Alimento para Gatos', slug: 'alimento-gatos' },
      { id: 'masc-3', nombre: 'Accesorios y Correas', slug: 'accesorios-mascotas' },
      { id: 'masc-4', nombre: 'Higiene y Champú', slug: 'higiene-mascotas' },
      { id: 'masc-5', nombre: 'Camas y Juguetes', slug: 'camas-juguetes' }
    ]
  },
  { 
    id: 'oficina', nombre: 'Oficina y Estudio', slug: 'oficina', icono: 'oficina',
    descripcion: 'Materiales para trabajar y estudiar mejor.',
    subcategorias: [
      { id: 'ofi-1', nombre: 'Papelería y Libretas', slug: 'papeleria' },
      { id: 'ofi-2', nombre: 'Lápices y Bolígrafos', slug: 'lapices' },
      { id: 'ofi-3', nombre: 'Calculadoras', slug: 'calculadoras' },
      { id: 'ofi-4', nombre: 'Accesorios de Escritorio', slug: 'accesorios-escritorio' },
      { id: 'ofi-5', nombre: 'Impresoras y Tinta', slug: 'impresoras' }
    ]
  },
  { 
    id: 'gaming', nombre: 'Gaming', slug: 'gaming', icono: 'gaming',
    descripcion: 'Consolas, videojuegos y accesorios gamer.',
    subcategorias: [
      { id: 'gam-1', nombre: 'Consolas (PS, Xbox, Nintendo)', slug: 'consolas' },
      { id: 'gam-2', nombre: 'Controles y Mandos', slug: 'controles' },
      { id: 'gam-3', nombre: 'Audífonos Gamer', slug: 'audifonos-gamer' },
      { id: 'gam-4', nombre: 'Juegos Físicos', slug: 'juegos' },
      { id: 'gam-5', nombre: 'Sillas y Teclados Gamer', slug: 'sillas-teclados' }
    ]
  },
  { 
    id: 'regalos', nombre: 'Regalos y Ocasiones', slug: 'regalos', icono: 'regalos',
    descripcion: 'Opciones perfectas para sorprender a tus seres queridos.',
    subcategorias: [
      { id: 'reg-1', nombre: 'Regalos para Ella', slug: 'regalos-ella' },
      { id: 'reg-2', nombre: 'Regalos para Él', slug: 'regalos-el' },
      { id: 'reg-3', nombre: 'Aniversarios y Parejas', slug: 'regalos-parejas' },
      { id: 'reg-4', nombre: 'Cumpleaños', slug: 'cumpleanos' },
      { id: 'reg-5', nombre: 'Cajas de Regalo', slug: 'cajas-regalo' }
    ]
  },
  { 
    id: 'otros', nombre: 'Otros', slug: 'otros', icono: 'otros',
    descripcion: 'Productos variados, novedades y más.',
    subcategorias: [
      { id: 'otr-1', nombre: 'Varios', slug: 'varios' },
      { id: 'otr-2', nombre: 'Novedades', slug: 'novedades' }
    ]
  }
];

export const giftCategories: { id: string; nombre: string; icono?: string }[] = [
  { id: 'g1', nombre: 'Para ella' },
  { id: 'g2', nombre: 'Para él' },
  { id: 'g3', nombre: 'Parejas' },
  { id: 'g4', nombre: 'Cumpleaños' },
  { id: 'g5', nombre: 'Ocasiones especiales' },
];
