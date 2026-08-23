export interface Municipality {
  id: string;
  nombre: string;
  activo: boolean;
  precioEntregaMN: number;
}

export interface Province {
  id: string;
  nombre: string;
  activa: boolean;
  municipios: Municipality[];
}

export const cubaLocations: Province[] = [
  {
    id: 'la-habana',
    nombre: 'La Habana',
    activa: true,
    municipios: [
      { id: 'playa', nombre: 'Playa', activo: true, precioEntregaMN: 3650 },
      { id: 'plaza-de-la-revolucion', nombre: 'Plaza de la Revolución', activo: true, precioEntregaMN: 3000 },
      { id: 'centro-habana', nombre: 'Centro Habana', activo: true, precioEntregaMN: 2650 },
      { id: 'la-habana-vieja', nombre: 'La Habana Vieja', activo: true, precioEntregaMN: 2650 },
      { id: 'regla', nombre: 'Regla', activo: true, precioEntregaMN: 2300 },
      { id: 'la-habana-del-este', nombre: 'La Habana del Este', activo: true, precioEntregaMN: 3300 },
      { id: 'guanabacoa', nombre: 'Guanabacoa', activo: true, precioEntregaMN: 2650 },
      { id: 'san-miguel-del-padron', nombre: 'San Miguel del Padrón', activo: true, precioEntregaMN: 2000 },
      { id: 'diez-de-octubre', nombre: 'Diez de Octubre', activo: true, precioEntregaMN: 1650 },
      { id: 'cerro', nombre: 'Cerro', activo: true, precioEntregaMN: 2000 },
      { id: 'marianao', nombre: 'Marianao', activo: true, precioEntregaMN: 3300 },
      { id: 'la-lisa', nombre: 'La Lisa', activo: true, precioEntregaMN: 4000 },
      { id: 'boyeros', nombre: 'Boyeros', activo: true, precioEntregaMN: 2000 },
      { id: 'arroyo-naranjo', nombre: 'Arroyo Naranjo', activo: true, precioEntregaMN: 1300 },
      { id: 'cotorro', nombre: 'Cotorro', activo: true, precioEntregaMN: 2300 }
    ]
  }
];
