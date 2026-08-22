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
    id: 'pinar-del-rio',
    nombre: 'Pinar del Río',
    activa: false,
    municipios: [
      { id: 'pinar-del-rio', nombre: 'Pinar del Río', activo: false, precioEntregaMN: 0 },
      { id: 'consolacion-del-sur', nombre: 'Consolación del Sur', activo: false, precioEntregaMN: 0 },
      { id: 'vinales', nombre: 'Viñales', activo: false, precioEntregaMN: 0 },
      { id: 'mantua', nombre: 'Mantua', activo: false, precioEntregaMN: 0 },
      { id: 'san-luis', nombre: 'San Luis', activo: false, precioEntregaMN: 0 },
      { id: 'san-juan-y-martinez', nombre: 'San Juan y Martínez', activo: false, precioEntregaMN: 0 },
      { id: 'guane', nombre: 'Guane', activo: false, precioEntregaMN: 0 },
      { id: 'minas-de-matahambre', nombre: 'Minas de Matahambre', activo: false, precioEntregaMN: 0 },
      { id: 'los-palacios', nombre: 'Los Palacios', activo: false, precioEntregaMN: 0 },
      { id: 'la-palma', nombre: 'La Palma', activo: false, precioEntregaMN: 0 },
      { id: 'sandino', nombre: 'Sandino', activo: false, precioEntregaMN: 0 }
    ]
  },
  {
    id: 'artemisa',
    nombre: 'Artemisa',
    activa: false,
    municipios: [
      { id: 'artemisa', nombre: 'Artemisa', activo: false, precioEntregaMN: 0 },
      { id: 'mariel', nombre: 'Mariel', activo: false, precioEntregaMN: 0 },
      { id: 'guanajay', nombre: 'Guanajay', activo: false, precioEntregaMN: 0 },
      { id: 'caimito', nombre: 'Caimito', activo: false, precioEntregaMN: 0 },
      { id: 'bauta', nombre: 'Bauta', activo: false, precioEntregaMN: 0 },
      { id: 'san-antonio-de-los-banos', nombre: 'San Antonio de los Baños', activo: false, precioEntregaMN: 0 },
      { id: 'guira-de-melena', nombre: 'Güira de Melena', activo: false, precioEntregaMN: 0 },
      { id: 'alquizar', nombre: 'Alquízar', activo: false, precioEntregaMN: 0 },
      { id: 'san-cristobal', nombre: 'San Cristóbal', activo: false, precioEntregaMN: 0 },
      { id: 'bahia-honda', nombre: 'Bahía Honda', activo: false, precioEntregaMN: 0 },
      { id: 'candelaria', nombre: 'Candelaria', activo: false, precioEntregaMN: 0 }
    ]
  },
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
  },
  {
    id: 'mayabeque',
    nombre: 'Mayabeque',
    activa: false,
    municipios: [
      { id: 'san-jose-de-las-lajas', nombre: 'San José de las Lajas', activo: false, precioEntregaMN: 0 },
      { id: 'bejucal', nombre: 'Bejucal', activo: false, precioEntregaMN: 0 },
      { id: 'quivican', nombre: 'Quivicán', activo: false, precioEntregaMN: 0 },
      { id: 'jaruco', nombre: 'Jaruco', activo: false, precioEntregaMN: 0 },
      { id: 'santa-cruz-del-norte', nombre: 'Santa Cruz del Norte', activo: false, precioEntregaMN: 0 },
      { id: 'madruga', nombre: 'Madruga', activo: false, precioEntregaMN: 0 },
      { id: 'nueva-paz', nombre: 'Nueva Paz', activo: false, precioEntregaMN: 0 },
      { id: 'san-nicolas', nombre: 'San Nicolás', activo: false, precioEntregaMN: 0 },
      { id: 'guines', nombre: 'Güines', activo: false, precioEntregaMN: 0 },
      { id: 'melena-del-sur', nombre: 'Melena del Sur', activo: false, precioEntregaMN: 0 },
      { id: 'batabano', nombre: 'Batabanó', activo: false, precioEntregaMN: 0 }
    ]
  },
  {
    id: 'matanzas',
    nombre: 'Matanzas',
    activa: false,
    municipios: [
      { id: 'matanzas', nombre: 'Matanzas', activo: false, precioEntregaMN: 0 },
      { id: 'cardenas', nombre: 'Cárdenas', activo: false, precioEntregaMN: 0 },
      { id: 'jovellanos', nombre: 'Jovellanos', activo: false, precioEntregaMN: 0 },
      { id: 'colon', nombre: 'Colón', activo: false, precioEntregaMN: 0 },
      { id: 'jaguey-grande', nombre: 'Jagüey Grande', activo: false, precioEntregaMN: 0 },
      { id: 'calimete', nombre: 'Calimete', activo: false, precioEntregaMN: 0 },
      { id: 'los-arabos', nombre: 'Los Arabos', activo: false, precioEntregaMN: 0 },
      { id: 'pedro-betancourt', nombre: 'Pedro Betancourt', activo: false, precioEntregaMN: 0 },
      { id: 'perico', nombre: 'Perico', activo: false, precioEntregaMN: 0 },
      { id: 'union-de-reyes', nombre: 'Unión de Reyes', activo: false, precioEntregaMN: 0 },
      { id: 'limonar', nombre: 'Limonar', activo: false, precioEntregaMN: 0 },
      { id: 'marti', nombre: 'Martí', activo: false, precioEntregaMN: 0 },
      { id: 'cienaga-de-zapata', nombre: 'Ciénaga de Zapata', activo: false, precioEntregaMN: 0 }
    ]
  },
  {
    id: 'cienfuegos',
    nombre: 'Cienfuegos',
    activa: false,
    municipios: [
      { id: 'cienfuegos', nombre: 'Cienfuegos', activo: false, precioEntregaMN: 0 },
      { id: 'abreus', nombre: 'Abreus', activo: false, precioEntregaMN: 0 },
      { id: 'aguada-de-pasajeros', nombre: 'Aguada de Pasajeros', activo: false, precioEntregaMN: 0 },
      { id: 'cruces', nombre: 'Cruces', activo: false, precioEntregaMN: 0 },
      { id: 'lajas', nombre: 'Lajas', activo: false, precioEntregaMN: 0 },
      { id: 'palmira', nombre: 'Palmira', activo: false, precioEntregaMN: 0 },
      { id: 'rodas', nombre: 'Rodas', activo: false, precioEntregaMN: 0 },
      { id: 'cumanayagua', nombre: 'Cumanayagua', activo: false, precioEntregaMN: 0 }
    ]
  },
  {
    id: 'villa-clara',
    nombre: 'Villa Clara',
    activa: false,
    municipios: [
      { id: 'santa-clara', nombre: 'Santa Clara', activo: false, precioEntregaMN: 0 },
      { id: 'sagua-la-grande', nombre: 'Sagua la Grande', activo: false, precioEntregaMN: 0 },
      { id: 'placetas', nombre: 'Placetas', activo: false, precioEntregaMN: 0 },
      { id: 'camajuani', nombre: 'Camajuaní', activo: false, precioEntregaMN: 0 },
      { id: 'remedios', nombre: 'Remedios', activo: false, precioEntregaMN: 0 },
      { id: 'caibarien', nombre: 'Caibarién', activo: false, precioEntregaMN: 0 },
      { id: 'santo-domingo', nombre: 'Santo Domingo', activo: false, precioEntregaMN: 0 },
      { id: 'ranchuelo', nombre: 'Ranchuelo', activo: false, precioEntregaMN: 0 },
      { id: 'encrucijada', nombre: 'Encrucijada', activo: false, precioEntregaMN: 0 },
      { id: 'quemado-de-guines', nombre: 'Quemado de Güines', activo: false, precioEntregaMN: 0 },
      { id: 'corralillo', nombre: 'Corralillo', activo: false, precioEntregaMN: 0 },
      { id: 'cifuentes', nombre: 'Cifuentes', activo: false, precioEntregaMN: 0 },
      { id: 'manicaragua', nombre: 'Manicaragua', activo: false, precioEntregaMN: 0 }
    ]
  },
  {
    id: 'sancti-spiritus',
    nombre: 'Sancti Spíritus',
    activa: false,
    municipios: [
      { id: 'sancti-spiritus', nombre: 'Sancti Spíritus', activo: false, precioEntregaMN: 0 },
      { id: 'trinidad', nombre: 'Trinidad', activo: false, precioEntregaMN: 0 },
      { id: 'cabaiguan', nombre: 'Cabaiguán', activo: false, precioEntregaMN: 0 },
      { id: 'yaguajay', nombre: 'Yaguajay', activo: false, precioEntregaMN: 0 },
      { id: 'jatibonico', nombre: 'Jatibonico', activo: false, precioEntregaMN: 0 },
      { id: 'taguasco', nombre: 'Taguasco', activo: false, precioEntregaMN: 0 },
      { id: 'fomento', nombre: 'Fomento', activo: false, precioEntregaMN: 0 },
      { id: 'la-sierpe', nombre: 'La Sierpe', activo: false, precioEntregaMN: 0 }
    ]
  },
  {
    id: 'ciego-de-avila',
    nombre: 'Ciego de Ávila',
    activa: false,
    municipios: [
      { id: 'ciego-de-avila', nombre: 'Ciego de Ávila', activo: false, precioEntregaMN: 0 },
      { id: 'moron', nombre: 'Morón', activo: false, precioEntregaMN: 0 },
      { id: 'chambas', nombre: 'Chambas', activo: false, precioEntregaMN: 0 },
      { id: 'florencia', nombre: 'Florencia', activo: false, precioEntregaMN: 0 },
      { id: 'majagua', nombre: 'Majagua', activo: false, precioEntregaMN: 0 },
      { id: 'venezuela', nombre: 'Venezuela', activo: false, precioEntregaMN: 0 },
      { id: 'baragua', nombre: 'Baraguá', activo: false, precioEntregaMN: 0 },
      { id: 'primero-de-enero', nombre: 'Primero de Enero', activo: false, precioEntregaMN: 0 },
      { id: 'ciro-redondo', nombre: 'Ciro Redondo', activo: false, precioEntregaMN: 0 },
      { id: 'bolivia', nombre: 'Bolivia', activo: false, precioEntregaMN: 0 }
    ]
  },
  {
    id: 'camaguey',
    nombre: 'Camagüey',
    activa: false,
    municipios: [
      { id: 'camaguey', nombre: 'Camagüey', activo: false, precioEntregaMN: 0 },
      { id: 'florida', nombre: 'Florida', activo: false, precioEntregaMN: 0 },
      { id: 'nuevitas', nombre: 'Nuevitas', activo: false, precioEntregaMN: 0 },
      { id: 'vertientes', nombre: 'Vertientes', activo: false, precioEntregaMN: 0 },
      { id: 'guaimaro', nombre: 'Guáimaro', activo: false, precioEntregaMN: 0 },
      { id: 'sibanicu', nombre: 'Sibanicú', activo: false, precioEntregaMN: 0 },
      { id: 'esmeralda', nombre: 'Esmeralda', activo: false, precioEntregaMN: 0 },
      { id: 'sierra-de-cubitas', nombre: 'Sierra de Cubitas', activo: false, precioEntregaMN: 0 },
      { id: 'minas', nombre: 'Minas', activo: false, precioEntregaMN: 0 },
      { id: 'najasa', nombre: 'Najasa', activo: false, precioEntregaMN: 0 },
      { id: 'santa-cruz-del-sur', nombre: 'Santa Cruz del Sur', activo: false, precioEntregaMN: 0 },
      { id: 'jimaguayu', nombre: 'Jimaguayú', activo: false, precioEntregaMN: 0 },
      { id: 'cespedes', nombre: 'Carlos Manuel de Céspedes', activo: false, precioEntregaMN: 0 }
    ]
  },
  {
    id: 'las-tunas',
    nombre: 'Las Tunas',
    activa: false,
    municipios: [
      { id: 'las-tunas', nombre: 'Las Tunas', activo: false, precioEntregaMN: 0 },
      { id: 'puerto-padre', nombre: 'Puerto Padre', activo: false, precioEntregaMN: 0 },
      { id: 'amancio', nombre: 'Amancio', activo: false, precioEntregaMN: 0 },
      { id: 'colombia', nombre: 'Colombia', activo: false, precioEntregaMN: 0 },
      { id: 'jesus-menendez', nombre: 'Jesús Menéndez', activo: false, precioEntregaMN: 0 },
      { id: 'majibacoa', nombre: 'Majibacoa', activo: false, precioEntregaMN: 0 },
      { id: 'jobabo', nombre: 'Jobabo', activo: false, precioEntregaMN: 0 },
      { id: 'manati', nombre: 'Manatí', activo: false, precioEntregaMN: 0 }
    ]
  },
  {
    id: 'holguin',
    nombre: 'Holguín',
    activa: false,
    municipios: [
      { id: 'holguin', nombre: 'Holguín', activo: false, precioEntregaMN: 0 },
      { id: 'banes', nombre: 'Banes', activo: false, precioEntregaMN: 0 },
      { id: 'antilla', nombre: 'Antilla', activo: false, precioEntregaMN: 0 },
      { id: 'baguano', nombre: 'Baguano', activo: false, precioEntregaMN: 0 },
      { id: 'cacocum', nombre: 'Cacocum', activo: false, precioEntregaMN: 0 },
      { id: 'calixto-garcia', nombre: 'Calixto García', activo: false, precioEntregaMN: 0 },
      { id: 'cueto', nombre: 'Cueto', activo: false, precioEntregaMN: 0 },
      { id: 'frank-pais', nombre: 'Frank País', activo: false, precioEntregaMN: 0 },
      { id: 'gibara', nombre: 'Gibara', activo: false, precioEntregaMN: 0 },
      { id: 'mayari', nombre: 'Mayarí', activo: false, precioEntregaMN: 0 },
      { id: 'moa', nombre: 'Moa', activo: false, precioEntregaMN: 0 },
      { id: 'rafael-freyre', nombre: 'Rafael Freyre', activo: false, precioEntregaMN: 0 },
      { id: 'sagua-de-tanamo', nombre: 'Sagua de Tánamo', activo: false, precioEntregaMN: 0 },
      { id: 'urbano-noris', nombre: 'Urbano Noris', activo: false, precioEntregaMN: 0 }
    ]
  },
  {
    id: 'granma',
    nombre: 'Granma',
    activa: false,
    municipios: [
      { id: 'bayamo', nombre: 'Bayamo', activo: false, precioEntregaMN: 0 },
      { id: 'manzanillo', nombre: 'Manzanillo', activo: false, precioEntregaMN: 0 },
      { id: 'jiguani', nombre: 'Jiguaní', activo: false, precioEntregaMN: 0 },
      { id: 'cauto-cristo', nombre: 'Cauto Cristo', activo: false, precioEntregaMN: 0 },
      { id: 'rio-cauto', nombre: 'Río Cauto', activo: false, precioEntregaMN: 0 },
      { id: 'yara', nombre: 'Yara', activo: false, precioEntregaMN: 0 },
      { id: 'guisa', nombre: 'Guisa', activo: false, precioEntregaMN: 0 },
      { id: 'buey-arriba', nombre: 'Buey Arriba', activo: false, precioEntregaMN: 0 },
      { id: 'bartolome-maso', nombre: 'Bartolomé Masó', activo: false, precioEntregaMN: 0 },
      { id: 'campechuela', nombre: 'Campechuela', activo: false, precioEntregaMN: 0 },
      { id: 'media-luna', nombre: 'Media Luna', activo: false, precioEntregaMN: 0 },
      { id: 'niquero', nombre: 'Niquero', activo: false, precioEntregaMN: 0 },
      { id: 'pilon', nombre: 'Pilón', activo: false, precioEntregaMN: 0 }
    ]
  },
  {
    id: 'santiago-de-cuba',
    nombre: 'Santiago de Cuba',
    activa: false,
    municipios: [
      { id: 'santiago-de-cuba', nombre: 'Santiago de Cuba', activo: false, precioEntregaMN: 0 },
      { id: 'palma-soriano', nombre: 'Palma Soriano', activo: false, precioEntregaMN: 0 },
      { id: 'contramaestre', nombre: 'Contramaestre', activo: false, precioEntregaMN: 0 },
      { id: 'san-luis-santiago', nombre: 'San Luis', activo: false, precioEntregaMN: 0 },
      { id: 'songo-la-maya', nombre: 'Songo - La Maya', activo: false, precioEntregaMN: 0 },
      { id: 'segundo-frente', nombre: 'Segundo Frente', activo: false, precioEntregaMN: 0 },
      { id: 'tercer-frente', nombre: 'Tercer Frente', activo: false, precioEntregaMN: 0 },
      { id: 'guama', nombre: 'Guamá', activo: false, precioEntregaMN: 0 },
      { id: 'mella', nombre: 'Mella', activo: false, precioEntregaMN: 0 }
    ]
  },
  {
    id: 'guantanamo',
    nombre: 'Guantánamo',
    activa: false,
    municipios: [
      { id: 'guantanamo', nombre: 'Guantánamo', activo: false, precioEntregaMN: 0 },
      { id: 'baracoa', nombre: 'Baracoa', activo: false, precioEntregaMN: 0 },
      { id: 'maisi', nombre: 'Maisí', activo: false, precioEntregaMN: 0 },
      { id: 'imias', nombre: 'Imías', activo: false, precioEntregaMN: 0 },
      { id: 'san-antonio-del-sur', nombre: 'San Antonio del Sur', activo: false, precioEntregaMN: 0 },
      { id: 'manuel-tames', nombre: 'Manuel Tames', activo: false, precioEntregaMN: 0 },
      { id: 'yateras', nombre: 'Yateras', activo: false, precioEntregaMN: 0 },
      { id: 'caimanera', nombre: 'Caimanera', activo: false, precioEntregaMN: 0 },
      { id: 'el-salvador', nombre: 'El Salvador', activo: false, precioEntregaMN: 0 },
      { id: 'niceto-perez', nombre: 'Niceto Pérez', activo: false, precioEntregaMN: 0 }
    ]
  },
  {
    id: 'isla-de-la-juventud',
    nombre: 'Isla de la Juventud',
    activa: false,
    municipios: [
      { id: 'isla-de-la-juventud', nombre: 'Isla de la Juventud', activo: false, precioEntregaMN: 0 }
    ]
  }
];
