import { Product } from '../types';

export const products: Product[] = [
  {
    id: "PROD-001",
    slug: "producto-demo-1",
    nombre: "Producto de Demostración 1",
    precioMN: 1150,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+1"
    ],
    descripcionCorta: "Breve descripción del producto 1 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 1. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "2",
    subcategoria: "2-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-05T13:17:31.936Z",
    orden: 1,
    ventaMayorista: {
      habilitada: true,
      presentacion: 'Paquete',
      cantidadMinima: 10,
      unidadesPorPresentacion: 6,
      precioMN: 900,
      ahorroMN: 250
    }
  },
  {
    id: "PROD-002",
    slug: "producto-demo-2",
    nombre: "Producto de Demostración 2",
    precioMN: 1300,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+2"
    ],
    descripcionCorta: "Breve descripción del producto 2 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 2. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "3",
    subcategoria: "3-3",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-05T10:30:51.936Z",
    orden: 2,
    ventaMayorista: {
      habilitada: true,
      presentacion: 'Caja',
      cantidadMinima: 3,
      unidadesPorPresentacion: 24,
      precioMN: 1100,
      ahorroMN: 200
    }
  },
  {
    id: "PROD-003",
    slug: "producto-demo-3",
    nombre: "Producto de Demostración 3",
    precioMN: 1450,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+3"
    ],
    descripcionCorta: "Breve descripción del producto 3 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 3. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "4",
    subcategoria: "4-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-05T07:44:11.936Z",
    orden: 3
  },
  {
    id: "PROD-004",
    slug: "producto-demo-4",
    nombre: "Producto de Demostración 4",
    precioMN: 1600,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+4"
    ],
    descripcionCorta: "Breve descripción del producto 4 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 4. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "5",
    subcategoria: "5-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-05T04:57:31.936Z",
    orden: 4
  },
  {
    id: "PROD-005",
    slug: "producto-demo-5",
    nombre: "Producto de Demostración 5",
    precioMN: 1750,
    precioAnteriorMN: 2250,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+5"
    ],
    descripcionCorta: "Breve descripción del producto 5 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 5. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "6",
    subcategoria: "6-4",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-05T02:10:51.936Z",
    orden: 5,
    ventaMayorista: {
      habilitada: true,
      presentacion: 'Caja',
      cantidadMinima: 5,
      unidadesPorPresentacion: 12,
      precioMN: 1500,
      ahorroMN: 250
    }
  },
  {
    id: "PROD-006",
    slug: "producto-demo-6",
    nombre: "Producto de Demostración 6",
    precioMN: 1900,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+6"
    ],
    descripcionCorta: "Breve descripción del producto 6 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 6. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "7",
    subcategoria: "7-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-04T23:24:11.936Z",
    orden: 6
  },
  {
    id: "PROD-007",
    slug: "producto-demo-7",
    nombre: "Producto de Demostración 7",
    precioMN: 2050,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+7"
    ],
    descripcionCorta: "Breve descripción del producto 7 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 7. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "8",
    subcategoria: "8-2",
    etiquetas: [
      "nuevo"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: true,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-04T20:37:31.936Z",
    orden: 7
  },
  {
    id: "PROD-008",
    slug: "producto-demo-8",
    nombre: "Producto de Demostración 8",
    precioMN: 2200,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+8"
    ],
    descripcionCorta: "Breve descripción del producto 8 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 8. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "9",
    subcategoria: "9-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-04T17:50:51.936Z",
    orden: 8
  },
  {
    id: "PROD-009",
    slug: "producto-demo-9",
    nombre: "Producto de Demostración 9",
    precioMN: 2350,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+9"
    ],
    descripcionCorta: "Breve descripción del producto 9 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 9. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "10",
    subcategoria: "10-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-04T15:04:11.936Z",
    orden: 9
  },
  {
    id: "PROD-010",
    slug: "producto-demo-10",
    nombre: "Producto de Demostración 10",
    precioMN: 2500,
    precioAnteriorMN: 3000,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+10"
    ],
    descripcionCorta: "Breve descripción del producto 10 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 10. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "11",
    subcategoria: "11-1",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-04T12:17:31.936Z",
    orden: 10
  },
  {
    id: "PROD-011",
    slug: "producto-demo-11",
    nombre: "Producto de Demostración 11",
    precioMN: 2650,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+11"
    ],
    descripcionCorta: "Breve descripción del producto 11 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 11. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "12",
    subcategoria: "12-2",
    etiquetas: [
      "destacado"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: true,
    masVendido: false,
    fechaCreacion: "2026-08-04T09:30:51.936Z",
    orden: 11
  },
  {
    id: "PROD-012",
    slug: "producto-demo-12",
    nombre: "Producto de Demostración 12",
    precioMN: 2800,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+12"
    ],
    descripcionCorta: "Breve descripción del producto 12 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 12. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "13",
    subcategoria: "13-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-04T06:44:11.936Z",
    orden: 12
  },
  {
    id: "PROD-013",
    slug: "producto-demo-13",
    nombre: "Producto de Demostración 13",
    precioMN: 2950,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+13"
    ],
    descripcionCorta: "Breve descripción del producto 13 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 13. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "14",
    subcategoria: "14-2",
    etiquetas: [
      "mas-vendido"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: true,
    fechaCreacion: "2026-08-04T03:57:31.936Z",
    orden: 13
  },
  {
    id: "PROD-014",
    slug: "producto-demo-14",
    nombre: "Producto de Demostración 14",
    precioMN: 3100,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+14"
    ],
    descripcionCorta: "Breve descripción del producto 14 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 14. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "15",
    subcategoria: "15-1",
    etiquetas: [
      "nuevo"
    ],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: true,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-04T01:10:51.936Z",
    orden: 14
  },
  {
    id: "PROD-015",
    slug: "producto-demo-15",
    nombre: "Producto de Demostración 15",
    precioMN: 3250,
    precioAnteriorMN: 3750,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+15"
    ],
    descripcionCorta: "Breve descripción del producto 15 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 15. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "1",
    subcategoria: "1-5",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-03T22:24:11.936Z",
    orden: 15
  },
  {
    id: "PROD-016",
    slug: "producto-demo-16",
    nombre: "Producto de Demostración 16",
    precioMN: 3400,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+16"
    ],
    descripcionCorta: "Breve descripción del producto 16 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 16. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "2",
    subcategoria: "2-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-03T19:37:31.936Z",
    orden: 16
  },
  {
    id: "PROD-017",
    slug: "producto-demo-17",
    nombre: "Producto de Demostración 17",
    precioMN: 3550,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+17"
    ],
    descripcionCorta: "Breve descripción del producto 17 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 17. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "3",
    subcategoria: "3-3",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-03T16:50:51.936Z",
    orden: 17
  },
  {
    id: "PROD-018",
    slug: "producto-demo-18",
    nombre: "Producto de Demostración 18",
    precioMN: 3700,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+18"
    ],
    descripcionCorta: "Breve descripción del producto 18 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 18. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "4",
    subcategoria: "4-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-03T14:04:11.936Z",
    orden: 18
  },
  {
    id: "PROD-019",
    slug: "producto-demo-19",
    nombre: "Producto de Demostración 19",
    precioMN: 3850,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+19"
    ],
    descripcionCorta: "Breve descripción del producto 19 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 19. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "5",
    subcategoria: "5-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-03T11:17:31.936Z",
    orden: 19
  },
  {
    id: "PROD-020",
    slug: "producto-demo-20",
    nombre: "Producto de Demostración 20",
    precioMN: 4000,
    precioAnteriorMN: 4500,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+20"
    ],
    descripcionCorta: "Breve descripción del producto 20 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 20. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "6",
    subcategoria: "6-4",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-03T08:30:51.936Z",
    orden: 20
  },
  {
    id: "PROD-021",
    slug: "producto-demo-21",
    nombre: "Producto de Demostración 21",
    precioMN: 4150,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+21"
    ],
    descripcionCorta: "Breve descripción del producto 21 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 21. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "7",
    subcategoria: "7-1",
    etiquetas: [
      "nuevo"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: true,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-03T05:44:11.936Z",
    orden: 21
  },
  {
    id: "PROD-022",
    slug: "producto-demo-22",
    nombre: "Producto de Demostración 22",
    precioMN: 4300,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+22"
    ],
    descripcionCorta: "Breve descripción del producto 22 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 22. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "8",
    subcategoria: "8-2",
    etiquetas: [
      "destacado"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: true,
    masVendido: false,
    fechaCreacion: "2026-08-03T02:57:31.936Z",
    orden: 22
  },
  {
    id: "PROD-023",
    slug: "producto-demo-23",
    nombre: "Producto de Demostración 23",
    precioMN: 4450,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+23"
    ],
    descripcionCorta: "Breve descripción del producto 23 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 23. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "9",
    subcategoria: "9-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-03T00:10:51.936Z",
    orden: 23
  },
  {
    id: "PROD-024",
    slug: "producto-demo-24",
    nombre: "Producto de Demostración 24",
    precioMN: 4600,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+24"
    ],
    descripcionCorta: "Breve descripción del producto 24 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 24. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "10",
    subcategoria: "10-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-02T21:24:11.936Z",
    orden: 24
  },
  {
    id: "PROD-025",
    slug: "producto-demo-25",
    nombre: "Producto de Demostración 25",
    precioMN: 4750,
    precioAnteriorMN: 5250,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+25"
    ],
    descripcionCorta: "Breve descripción del producto 25 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 25. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "11",
    subcategoria: "11-2",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-02T18:37:31.936Z",
    orden: 25
  },
  {
    id: "PROD-026",
    slug: "producto-demo-26",
    nombre: "Producto de Demostración 26",
    precioMN: 4900,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+26"
    ],
    descripcionCorta: "Breve descripción del producto 26 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 26. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "12",
    subcategoria: "12-1",
    etiquetas: [
      "mas-vendido"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: true,
    fechaCreacion: "2026-08-02T15:50:51.936Z",
    orden: 26
  },
  {
    id: "PROD-027",
    slug: "producto-demo-27",
    nombre: "Producto de Demostración 27",
    precioMN: 5050,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+27"
    ],
    descripcionCorta: "Breve descripción del producto 27 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 27. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "13",
    subcategoria: "13-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-02T13:04:11.936Z",
    orden: 27
  },
  {
    id: "PROD-028",
    slug: "producto-demo-28",
    nombre: "Producto de Demostración 28",
    precioMN: 5200,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+28"
    ],
    descripcionCorta: "Breve descripción del producto 28 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 28. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "14",
    subcategoria: "14-1",
    etiquetas: [
      "nuevo"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: true,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-02T10:17:31.936Z",
    orden: 28
  },
  {
    id: "PROD-029",
    slug: "producto-demo-29",
    nombre: "Producto de Demostración 29",
    precioMN: 5350,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+29"
    ],
    descripcionCorta: "Breve descripción del producto 29 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 29. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "15",
    subcategoria: "15-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-02T07:30:51.936Z",
    orden: 29
  },
  {
    id: "PROD-030",
    slug: "producto-demo-30",
    nombre: "Producto de Demostración 30",
    precioMN: 5500,
    precioAnteriorMN: 6000,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+30"
    ],
    descripcionCorta: "Breve descripción del producto 30 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 30. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "1",
    subcategoria: "1-3",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-02T04:44:11.936Z",
    orden: 30
  },
  {
    id: "PROD-031",
    slug: "producto-demo-31",
    nombre: "Producto de Demostración 31",
    precioMN: 5650,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+31"
    ],
    descripcionCorta: "Breve descripción del producto 31 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 31. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "2",
    subcategoria: "2-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-02T01:57:31.936Z",
    orden: 31
  },
  {
    id: "PROD-032",
    slug: "producto-demo-32",
    nombre: "Producto de Demostración 32",
    precioMN: 5800,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+32"
    ],
    descripcionCorta: "Breve descripción del producto 32 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 32. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "3",
    subcategoria: "3-3",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-01T23:10:51.936Z",
    orden: 32
  },
  {
    id: "PROD-033",
    slug: "producto-demo-33",
    nombre: "Producto de Demostración 33",
    precioMN: 5950,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+33"
    ],
    descripcionCorta: "Breve descripción del producto 33 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 33. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "4",
    subcategoria: "4-1",
    etiquetas: [
      "destacado"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: true,
    masVendido: false,
    fechaCreacion: "2026-08-01T20:24:11.936Z",
    orden: 33
  },
  {
    id: "PROD-034",
    slug: "producto-demo-34",
    nombre: "Producto de Demostración 34",
    precioMN: 6100,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+34"
    ],
    descripcionCorta: "Breve descripción del producto 34 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 34. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "5",
    subcategoria: "5-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-01T17:37:31.936Z",
    orden: 34
  },
  {
    id: "PROD-035",
    slug: "producto-demo-35",
    nombre: "Producto de Demostración 35",
    precioMN: 6250,
    precioAnteriorMN: 6750,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+35"
    ],
    descripcionCorta: "Breve descripción del producto 35 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 35. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "6",
    subcategoria: "6-4",
    etiquetas: [
      "oferta",
      "nuevo"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: true,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-01T14:50:51.936Z",
    orden: 35
  },
  {
    id: "PROD-036",
    slug: "producto-demo-36",
    nombre: "Producto de Demostración 36",
    precioMN: 6400,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+36"
    ],
    descripcionCorta: "Breve descripción del producto 36 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 36. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "7",
    subcategoria: "7-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-01T12:04:11.936Z",
    orden: 36
  },
  {
    id: "PROD-037",
    slug: "producto-demo-37",
    nombre: "Producto de Demostración 37",
    precioMN: 6550,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+37"
    ],
    descripcionCorta: "Breve descripción del producto 37 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 37. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "8",
    subcategoria: "8-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-01T09:17:31.936Z",
    orden: 37
  },
  {
    id: "PROD-038",
    slug: "producto-demo-38",
    nombre: "Producto de Demostración 38",
    precioMN: 6700,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+38"
    ],
    descripcionCorta: "Breve descripción del producto 38 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 38. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "9",
    subcategoria: "9-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-01T06:30:51.936Z",
    orden: 38
  },
  {
    id: "PROD-039",
    slug: "producto-demo-39",
    nombre: "Producto de Demostración 39",
    precioMN: 6850,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+39"
    ],
    descripcionCorta: "Breve descripción del producto 39 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 39. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "10",
    subcategoria: "10-1",
    etiquetas: [
      "mas-vendido"
    ],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: true,
    fechaCreacion: "2026-08-01T03:44:11.936Z",
    orden: 39
  },
  {
    id: "PROD-040",
    slug: "producto-demo-40",
    nombre: "Producto de Demostración 40",
    precioMN: 7000,
    precioAnteriorMN: 7500,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+40"
    ],
    descripcionCorta: "Breve descripción del producto 40 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 40. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "11",
    subcategoria: "11-1",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-08-01T00:57:31.936Z",
    orden: 40
  },
  {
    id: "PROD-041",
    slug: "producto-demo-41",
    nombre: "Producto de Demostración 41",
    precioMN: 7150,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+41"
    ],
    descripcionCorta: "Breve descripción del producto 41 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 41. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "12",
    subcategoria: "12-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-31T22:10:51.936Z",
    orden: 41
  },
  {
    id: "PROD-042",
    slug: "producto-demo-42",
    nombre: "Producto de Demostración 42",
    precioMN: 7300,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+42"
    ],
    descripcionCorta: "Breve descripción del producto 42 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 42. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "13",
    subcategoria: "13-1",
    etiquetas: [
      "nuevo"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: true,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-31T19:24:11.936Z",
    orden: 42
  },
  {
    id: "PROD-043",
    slug: "producto-demo-43",
    nombre: "Producto de Demostración 43",
    precioMN: 7450,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+43"
    ],
    descripcionCorta: "Breve descripción del producto 43 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 43. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "14",
    subcategoria: "14-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-31T16:37:31.936Z",
    orden: 43
  },
  {
    id: "PROD-044",
    slug: "producto-demo-44",
    nombre: "Producto de Demostración 44",
    precioMN: 7600,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+44"
    ],
    descripcionCorta: "Breve descripción del producto 44 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 44. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "15",
    subcategoria: "15-1",
    etiquetas: [
      "destacado"
    ],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: true,
    masVendido: false,
    fechaCreacion: "2026-07-31T13:50:51.936Z",
    orden: 44
  },
  {
    id: "PROD-045",
    slug: "producto-demo-45",
    nombre: "Producto de Demostración 45",
    precioMN: 7750,
    precioAnteriorMN: 8250,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+45"
    ],
    descripcionCorta: "Breve descripción del producto 45 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 45. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "1",
    subcategoria: "1-2",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-31T11:04:11.936Z",
    orden: 45
  },
  {
    id: "PROD-046",
    slug: "producto-demo-46",
    nombre: "Producto de Demostración 46",
    precioMN: 7900,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+46"
    ],
    descripcionCorta: "Breve descripción del producto 46 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 46. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "2",
    subcategoria: "2-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-31T08:17:31.936Z",
    orden: 46
  },
  {
    id: "PROD-047",
    slug: "producto-demo-47",
    nombre: "Producto de Demostración 47",
    precioMN: 8050,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+47"
    ],
    descripcionCorta: "Breve descripción del producto 47 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 47. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "3",
    subcategoria: "3-3",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-31T05:30:51.936Z",
    orden: 47
  },
  {
    id: "PROD-048",
    slug: "producto-demo-48",
    nombre: "Producto de Demostración 48",
    precioMN: 8200,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+48"
    ],
    descripcionCorta: "Breve descripción del producto 48 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 48. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "4",
    subcategoria: "4-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-31T02:44:11.936Z",
    orden: 48
  },
  {
    id: "PROD-049",
    slug: "producto-demo-49",
    nombre: "Producto de Demostración 49",
    precioMN: 8350,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+49"
    ],
    descripcionCorta: "Breve descripción del producto 49 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 49. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "5",
    subcategoria: "5-2",
    etiquetas: [
      "nuevo"
    ],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: true,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-30T23:57:31.936Z",
    orden: 49
  },
  {
    id: "PROD-050",
    slug: "producto-demo-50",
    nombre: "Producto de Demostración 50",
    precioMN: 8500,
    precioAnteriorMN: 9000,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+50"
    ],
    descripcionCorta: "Breve descripción del producto 50 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 50. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "6",
    subcategoria: "6-4",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-30T21:10:51.936Z",
    orden: 50
  },
  {
    id: "PROD-051",
    slug: "producto-demo-51",
    nombre: "Producto de Demostración 51",
    precioMN: 8650,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+51"
    ],
    descripcionCorta: "Breve descripción del producto 51 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 51. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "7",
    subcategoria: "7-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-30T18:24:11.936Z",
    orden: 51
  },
  {
    id: "PROD-052",
    slug: "producto-demo-52",
    nombre: "Producto de Demostración 52",
    precioMN: 8800,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+52"
    ],
    descripcionCorta: "Breve descripción del producto 52 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 52. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "8",
    subcategoria: "8-2",
    etiquetas: [
      "mas-vendido"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: true,
    fechaCreacion: "2026-07-30T15:37:31.936Z",
    orden: 52
  },
  {
    id: "PROD-053",
    slug: "producto-demo-53",
    nombre: "Producto de Demostración 53",
    precioMN: 8950,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+53"
    ],
    descripcionCorta: "Breve descripción del producto 53 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 53. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "9",
    subcategoria: "9-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-30T12:50:51.936Z",
    orden: 53
  },
  {
    id: "PROD-054",
    slug: "producto-demo-54",
    nombre: "Producto de Demostración 54",
    precioMN: 9100,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+54"
    ],
    descripcionCorta: "Breve descripción del producto 54 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 54. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "10",
    subcategoria: "10-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-30T10:04:11.936Z",
    orden: 54
  },
  {
    id: "PROD-055",
    slug: "producto-demo-55",
    nombre: "Producto de Demostración 55",
    precioMN: 9250,
    precioAnteriorMN: 9750,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+55"
    ],
    descripcionCorta: "Breve descripción del producto 55 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 55. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "11",
    subcategoria: "11-2",
    etiquetas: [
      "oferta",
      "destacado"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: true,
    masVendido: false,
    fechaCreacion: "2026-07-30T07:17:31.936Z",
    orden: 55
  },
  {
    id: "PROD-056",
    slug: "producto-demo-56",
    nombre: "Producto de Demostración 56",
    precioMN: 9400,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+56"
    ],
    descripcionCorta: "Breve descripción del producto 56 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 56. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "12",
    subcategoria: "12-1",
    etiquetas: [
      "nuevo"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: true,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-30T04:30:51.936Z",
    orden: 56
  },
  {
    id: "PROD-057",
    slug: "producto-demo-57",
    nombre: "Producto de Demostración 57",
    precioMN: 9550,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+57"
    ],
    descripcionCorta: "Breve descripción del producto 57 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 57. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "13",
    subcategoria: "13-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-30T01:44:11.936Z",
    orden: 57
  },
  {
    id: "PROD-058",
    slug: "producto-demo-58",
    nombre: "Producto de Demostración 58",
    precioMN: 9700,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+58"
    ],
    descripcionCorta: "Breve descripción del producto 58 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 58. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "14",
    subcategoria: "14-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-29T22:57:31.936Z",
    orden: 58
  },
  {
    id: "PROD-059",
    slug: "producto-demo-59",
    nombre: "Producto de Demostración 59",
    precioMN: 9850,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+59"
    ],
    descripcionCorta: "Breve descripción del producto 59 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 59. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "15",
    subcategoria: "15-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-29T20:10:51.936Z",
    orden: 59
  },
  {
    id: "PROD-060",
    slug: "producto-demo-60",
    nombre: "Producto de Demostración 60",
    precioMN: 10000,
    precioAnteriorMN: 10500,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+60"
    ],
    descripcionCorta: "Breve descripción del producto 60 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 60. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "1",
    subcategoria: "1-1",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-29T17:24:11.936Z",
    orden: 60
  },
  {
    id: "PROD-061",
    slug: "producto-demo-61",
    nombre: "Producto de Demostración 61",
    precioMN: 10150,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+61"
    ],
    descripcionCorta: "Breve descripción del producto 61 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 61. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "2",
    subcategoria: "2-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-29T14:37:31.936Z",
    orden: 61
  },
  {
    id: "PROD-062",
    slug: "producto-demo-62",
    nombre: "Producto de Demostración 62",
    precioMN: 10300,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+62"
    ],
    descripcionCorta: "Breve descripción del producto 62 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 62. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "3",
    subcategoria: "3-3",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-29T11:50:51.936Z",
    orden: 62
  },
  {
    id: "PROD-063",
    slug: "producto-demo-63",
    nombre: "Producto de Demostración 63",
    precioMN: 10450,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+63"
    ],
    descripcionCorta: "Breve descripción del producto 63 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 63. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "4",
    subcategoria: "4-1",
    etiquetas: [
      "nuevo"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: true,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-29T09:04:11.936Z",
    orden: 63
  },
  {
    id: "PROD-064",
    slug: "producto-demo-64",
    nombre: "Producto de Demostración 64",
    precioMN: 10600,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+64"
    ],
    descripcionCorta: "Breve descripción del producto 64 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 64. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "5",
    subcategoria: "5-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-29T06:17:31.936Z",
    orden: 64
  },
  {
    id: "PROD-065",
    slug: "producto-demo-65",
    nombre: "Producto de Demostración 65",
    precioMN: 10750,
    precioAnteriorMN: 11250,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+65"
    ],
    descripcionCorta: "Breve descripción del producto 65 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 65. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "6",
    subcategoria: "6-4",
    etiquetas: [
      "oferta",
      "mas-vendido"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: true,
    fechaCreacion: "2026-07-29T03:30:51.936Z",
    orden: 65
  },
  {
    id: "PROD-066",
    slug: "producto-demo-66",
    nombre: "Producto de Demostración 66",
    precioMN: 10900,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+66"
    ],
    descripcionCorta: "Breve descripción del producto 66 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 66. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "7",
    subcategoria: "7-1",
    etiquetas: [
      "destacado"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: true,
    masVendido: false,
    fechaCreacion: "2026-07-29T00:44:11.936Z",
    orden: 66
  },
  {
    id: "PROD-067",
    slug: "producto-demo-67",
    nombre: "Producto de Demostración 67",
    precioMN: 11050,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+67"
    ],
    descripcionCorta: "Breve descripción del producto 67 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 67. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "8",
    subcategoria: "8-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-28T21:57:31.936Z",
    orden: 67
  },
  {
    id: "PROD-068",
    slug: "producto-demo-68",
    nombre: "Producto de Demostración 68",
    precioMN: 11200,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+68"
    ],
    descripcionCorta: "Breve descripción del producto 68 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 68. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "9",
    subcategoria: "9-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-28T19:10:51.936Z",
    orden: 68
  },
  {
    id: "PROD-069",
    slug: "producto-demo-69",
    nombre: "Producto de Demostración 69",
    precioMN: 11350,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+69"
    ],
    descripcionCorta: "Breve descripción del producto 69 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 69. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "10",
    subcategoria: "10-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-28T16:24:11.936Z",
    orden: 69
  },
  {
    id: "PROD-070",
    slug: "producto-demo-70",
    nombre: "Producto de Demostración 70",
    precioMN: 11500,
    precioAnteriorMN: 12000,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+70"
    ],
    descripcionCorta: "Breve descripción del producto 70 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 70. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "11",
    subcategoria: "11-1",
    etiquetas: [
      "oferta",
      "nuevo"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: true,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-28T13:37:31.936Z",
    orden: 70
  },
  {
    id: "PROD-071",
    slug: "producto-demo-71",
    nombre: "Producto de Demostración 71",
    precioMN: 11650,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+71"
    ],
    descripcionCorta: "Breve descripción del producto 71 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 71. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "12",
    subcategoria: "12-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-28T10:50:51.937Z",
    orden: 71
  },
  {
    id: "PROD-072",
    slug: "producto-demo-72",
    nombre: "Producto de Demostración 72",
    precioMN: 11800,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+72"
    ],
    descripcionCorta: "Breve descripción del producto 72 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 72. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "13",
    subcategoria: "13-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-28T08:04:11.937Z",
    orden: 72
  },
  {
    id: "PROD-073",
    slug: "producto-demo-73",
    nombre: "Producto de Demostración 73",
    precioMN: 11950,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+73"
    ],
    descripcionCorta: "Breve descripción del producto 73 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 73. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "14",
    subcategoria: "14-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-28T05:17:31.937Z",
    orden: 73
  },
  {
    id: "PROD-074",
    slug: "producto-demo-74",
    nombre: "Producto de Demostración 74",
    precioMN: 12100,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+74"
    ],
    descripcionCorta: "Breve descripción del producto 74 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 74. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "15",
    subcategoria: "15-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-28T02:30:51.937Z",
    orden: 74
  },
  {
    id: "PROD-075",
    slug: "producto-demo-75",
    nombre: "Producto de Demostración 75",
    precioMN: 12250,
    precioAnteriorMN: 12750,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+75"
    ],
    descripcionCorta: "Breve descripción del producto 75 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 75. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "1",
    subcategoria: "1-5",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-27T23:44:11.937Z",
    orden: 75
  },
  {
    id: "PROD-076",
    slug: "producto-demo-76",
    nombre: "Producto de Demostración 76",
    precioMN: 12400,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+76"
    ],
    descripcionCorta: "Breve descripción del producto 76 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 76. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "2",
    subcategoria: "2-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-27T20:57:31.937Z",
    orden: 76
  },
  {
    id: "PROD-077",
    slug: "producto-demo-77",
    nombre: "Producto de Demostración 77",
    precioMN: 12550,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+77"
    ],
    descripcionCorta: "Breve descripción del producto 77 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 77. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "3",
    subcategoria: "3-3",
    etiquetas: [
      "nuevo",
      "destacado"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: true,
    oferta: false,
    destacado: true,
    masVendido: false,
    fechaCreacion: "2026-07-27T18:10:51.937Z",
    orden: 77
  },
  {
    id: "PROD-078",
    slug: "producto-demo-78",
    nombre: "Producto de Demostración 78",
    precioMN: 12700,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+78"
    ],
    descripcionCorta: "Breve descripción del producto 78 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 78. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "4",
    subcategoria: "4-1",
    etiquetas: [
      "mas-vendido"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: true,
    fechaCreacion: "2026-07-27T15:24:11.937Z",
    orden: 78
  },
  {
    id: "PROD-079",
    slug: "producto-demo-79",
    nombre: "Producto de Demostración 79",
    precioMN: 12850,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+79"
    ],
    descripcionCorta: "Breve descripción del producto 79 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 79. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "5",
    subcategoria: "5-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-27T12:37:31.937Z",
    orden: 79
  },
  {
    id: "PROD-080",
    slug: "producto-demo-80",
    nombre: "Producto de Demostración 80",
    precioMN: 13000,
    precioAnteriorMN: 13500,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+80"
    ],
    descripcionCorta: "Breve descripción del producto 80 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 80. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "6",
    subcategoria: "6-4",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-27T09:50:51.937Z",
    orden: 80
  },
  {
    id: "PROD-081",
    slug: "producto-demo-81",
    nombre: "Producto de Demostración 81",
    precioMN: 13150,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+81"
    ],
    descripcionCorta: "Breve descripción del producto 81 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 81. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "7",
    subcategoria: "7-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-27T07:04:11.937Z",
    orden: 81
  },
  {
    id: "PROD-082",
    slug: "producto-demo-82",
    nombre: "Producto de Demostración 82",
    precioMN: 13300,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+82"
    ],
    descripcionCorta: "Breve descripción del producto 82 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 82. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "8",
    subcategoria: "8-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-27T04:17:31.937Z",
    orden: 82
  },
  {
    id: "PROD-083",
    slug: "producto-demo-83",
    nombre: "Producto de Demostración 83",
    precioMN: 13450,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+83"
    ],
    descripcionCorta: "Breve descripción del producto 83 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 83. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "9",
    subcategoria: "9-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-27T01:30:51.937Z",
    orden: 83
  },
  {
    id: "PROD-084",
    slug: "producto-demo-84",
    nombre: "Producto de Demostración 84",
    precioMN: 13600,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+84"
    ],
    descripcionCorta: "Breve descripción del producto 84 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 84. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "10",
    subcategoria: "10-1",
    etiquetas: [
      "nuevo"
    ],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: true,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-26T22:44:11.937Z",
    orden: 84
  },
  {
    id: "PROD-085",
    slug: "producto-demo-85",
    nombre: "Producto de Demostración 85",
    precioMN: 13750,
    precioAnteriorMN: 14250,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+85"
    ],
    descripcionCorta: "Breve descripción del producto 85 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 85. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "11",
    subcategoria: "11-2",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-26T19:57:31.937Z",
    orden: 85
  },
  {
    id: "PROD-086",
    slug: "producto-demo-86",
    nombre: "Producto de Demostración 86",
    precioMN: 13900,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+86"
    ],
    descripcionCorta: "Breve descripción del producto 86 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 86. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "12",
    subcategoria: "12-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-26T17:10:51.937Z",
    orden: 86
  },
  {
    id: "PROD-087",
    slug: "producto-demo-87",
    nombre: "Producto de Demostración 87",
    precioMN: 14050,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+87"
    ],
    descripcionCorta: "Breve descripción del producto 87 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 87. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "13",
    subcategoria: "13-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-26T14:24:11.937Z",
    orden: 87
  },
  {
    id: "PROD-088",
    slug: "producto-demo-88",
    nombre: "Producto de Demostración 88",
    precioMN: 14200,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+88"
    ],
    descripcionCorta: "Breve descripción del producto 88 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 88. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "14",
    subcategoria: "14-1",
    etiquetas: [
      "destacado"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: true,
    masVendido: false,
    fechaCreacion: "2026-07-26T11:37:31.937Z",
    orden: 88
  },
  {
    id: "PROD-089",
    slug: "producto-demo-89",
    nombre: "Producto de Demostración 89",
    precioMN: 14350,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+89"
    ],
    descripcionCorta: "Breve descripción del producto 89 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 89. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "15",
    subcategoria: "15-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-26T08:50:51.937Z",
    orden: 89
  },
  {
    id: "PROD-090",
    slug: "producto-demo-90",
    nombre: "Producto de Demostración 90",
    precioMN: 14500,
    precioAnteriorMN: 15000,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+90"
    ],
    descripcionCorta: "Breve descripción del producto 90 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 90. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "1",
    subcategoria: "1-3",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-26T06:04:11.937Z",
    orden: 90
  },
  {
    id: "PROD-091",
    slug: "producto-demo-91",
    nombre: "Producto de Demostración 91",
    precioMN: 14650,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+91"
    ],
    descripcionCorta: "Breve descripción del producto 91 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 91. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "2",
    subcategoria: "2-2",
    etiquetas: [
      "nuevo",
      "mas-vendido"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: true,
    oferta: false,
    destacado: false,
    masVendido: true,
    fechaCreacion: "2026-07-26T03:17:31.937Z",
    orden: 91
  },
  {
    id: "PROD-092",
    slug: "producto-demo-92",
    nombre: "Producto de Demostración 92",
    precioMN: 14800,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+92"
    ],
    descripcionCorta: "Breve descripción del producto 92 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 92. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "3",
    subcategoria: "3-3",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-26T00:30:51.937Z",
    orden: 92
  },
  {
    id: "PROD-093",
    slug: "producto-demo-93",
    nombre: "Producto de Demostración 93",
    precioMN: 14950,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+93"
    ],
    descripcionCorta: "Breve descripción del producto 93 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 93. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "4",
    subcategoria: "4-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-25T21:44:11.937Z",
    orden: 93
  },
  {
    id: "PROD-094",
    slug: "producto-demo-94",
    nombre: "Producto de Demostración 94",
    precioMN: 15100,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+94"
    ],
    descripcionCorta: "Breve descripción del producto 94 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 94. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "5",
    subcategoria: "5-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-25T18:57:31.937Z",
    orden: 94
  },
  {
    id: "PROD-095",
    slug: "producto-demo-95",
    nombre: "Producto de Demostración 95",
    precioMN: 15250,
    precioAnteriorMN: 15750,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+95"
    ],
    descripcionCorta: "Breve descripción del producto 95 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 95. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "6",
    subcategoria: "6-4",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-25T16:10:51.937Z",
    orden: 95
  },
  {
    id: "PROD-096",
    slug: "producto-demo-96",
    nombre: "Producto de Demostración 96",
    precioMN: 15400,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+96"
    ],
    descripcionCorta: "Breve descripción del producto 96 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 96. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "7",
    subcategoria: "7-1",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-25T13:24:11.937Z",
    orden: 96
  },
  {
    id: "PROD-097",
    slug: "producto-demo-97",
    nombre: "Producto de Demostración 97",
    precioMN: 15550,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+97"
    ],
    descripcionCorta: "Breve descripción del producto 97 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 97. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "8",
    subcategoria: "8-2",
    etiquetas: [],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-25T10:37:31.937Z",
    orden: 97
  },
  {
    id: "PROD-098",
    slug: "producto-demo-98",
    nombre: "Producto de Demostración 98",
    precioMN: 15700,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+98"
    ],
    descripcionCorta: "Breve descripción del producto 98 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 98. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "9",
    subcategoria: "9-1",
    etiquetas: [
      "nuevo"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: true,
    oferta: false,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-25T07:50:51.937Z",
    orden: 98
  },
  {
    id: "PROD-099",
    slug: "producto-demo-99",
    nombre: "Producto de Demostración 99",
    precioMN: 15850,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+99"
    ],
    descripcionCorta: "Breve descripción del producto 99 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 99. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "10",
    subcategoria: "10-1",
    etiquetas: [
      "destacado"
    ],
    estado: "nuevo",
    disponibilidad: "agotado",
    nuevo: false,
    oferta: false,
    destacado: true,
    masVendido: false,
    fechaCreacion: "2026-07-25T05:04:11.937Z",
    orden: 99
  },
  {
    id: "PROD-100",
    slug: "producto-demo-100",
    nombre: "Producto de Demostración 100",
    precioMN: 16000,
    precioAnteriorMN: 16500,
    imagenes: [
      "https://placehold.co/600x600/e2e8f0/0B1320?text=Prod+100"
    ],
    descripcionCorta: "Breve descripción del producto 100 para catálogos y listados.",
    descripcionCompleta: "Esta es la descripción completa del producto 100. Incluye todos los detalles relevantes que un cliente podría querer conocer antes de realizar la compra.",
        categoria: "11",
    subcategoria: "11-1",
    etiquetas: [
      "oferta"
    ],
    estado: "nuevo",
    disponibilidad: "disponible",
    nuevo: false,
    oferta: true,
    destacado: false,
    masVendido: false,
    fechaCreacion: "2026-07-25T02:17:31.937Z",
    orden: 100
  }
];

// Mapeo dinámico para transformar los productos de demostración (PROD-001 a PROD-100)
// y los productos de reserva (RES-001 a RES-005) en productos reales con imágenes de Unsplash de alta calidad.
const REAL_DATA_BY_CATEGORY: Record<string, { names: string[]; images: string[]; descCorta: string; descCompleta: string }> = {
  '1': {
    names: [
      "iPhone 15 Pro Max 256GB",
      "Samsung Galaxy S24 Ultra",
      "iPad Air 10.9\" Wi-Fi 64GB",
      "Auriculares Sony WH-1000XM5 ANC",
      "AirPods Pro (2.ª generación)",
      "Bocina Bluetooth JBL Flip 6",
      "Cargador Rápido Anker Nano 30W",
      "Batería Portátil Power Bank 20000mAh",
      "MacBook Air 13\" Chip M3",
      "Monitor Gamer ASUS 27\" FHD 165Hz"
    ],
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Tecnología de última generación con alto rendimiento y garantía de calidad.",
    descCompleta: "Descubre la máxima potencia y conectividad con este dispositivo tecnológico de alta gama. Diseñado para ofrecer una experiencia fluida, duradera y con los estándares más exigentes del mercado actual."
  },
  '2': {
    names: [
      "Smart TV LG OLED 55\" 4K Cinema",
      "Barra de Sonido JBL Bar 2.1 Deep Bass",
      "Televisor Smart Samsung Crystal 43\" 4K",
      "Proyector Portátil Xiaomi Mi Smart Compact",
      "Bocina Torre de Sonido Bluetooth 100W",
      "Radio Transistor Retro Recargable FM/AM",
      "Tira de Luces LED RGB Inteligente 10m Wi-Fi",
      "Sistema de Sonido Logitech 5.1 Surround"
    ],
    images: [
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1558089687-f282ffcbd1d5?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Electrónica de última generación para transformar el entretenimiento en tu hogar.",
    descCompleta: "Disfruta de sonido envolvente y calidad de imagen excepcional. Este equipo de electrónica redefine tu espacio con conectividad inteligente y un desempeño sobresaliente para tus películas y música favorita."
  },
  '3': {
    names: [
      "Organizador de Calzado Ajustable de 3 Niveles",
      "Silla de Oficina Ergonómica con Soporte Lumbar",
      "Juego de Cajas de Almacenamiento de Tela x3",
      "Lámpara de Pie Moderna Estilo Nórdico",
      "Sillón Puff Confort Microfibra Gigante",
      "Cuadro Tríptico Decorativo Moderno",
      "Planta Artificial Decorativa con Maceta de Cerámica",
      "Estante Flotante de Madera Maciza 60cm"
    ],
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Diseño elegante y funcional para un hogar más cómodo y organizado.",
    descCompleta: "Dale un toque moderno a tu casa con este accesorio exclusivo de hogar. Combina materiales de primera calidad, resistencia superior y un diseño estético que armoniza con cualquier tipo de decoración interior."
  },
  '4': {
    names: [
      "Freidora de Aire Digital de 4.5 Litros",
      "Batidora de Inmersión de Acero Inoxidable 800W",
      "Cafetera Italiana Espresso de 6 Tazas",
      "Set de Cuchillos de Cocina Profesionales x6",
      "Licuadora Ninja de Alta Potencia 1000W",
      "Olla de Presión Eléctrica Multifuncional 6L",
      "Tostadora de Pan de Acero Inoxidable de 2 Rebanadas",
      "Juego de Sartenes Antiadherentes Teflón x3"
    ],
    images: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Electrodomésticos y utensilios prácticos para facilitar tu cocina diaria.",
    descCompleta: "Prepara tus mejores recetas de forma rápida y sencilla. Fabricado con materiales de alta calidad, excelente eficiencia y un diseño seguro que se integra perfectamente a tu encimera."
  },
  '5': {
    names: [
      "Vestido Largo de Verano Floral para Mujer",
      "Camisa Casual de Algodón Premium para Hombre",
      "Camiseta Básica de Algodón Pima de Cuello Redondo",
      "Pantalón Chino Stretch Ajuste Slim para Hombre",
      "Leggings Deportivos de Alta Cintura con Compresión",
      "Blusa Casual de Encaje Elegante para Mujer",
      "Set de Bóxers de Algodón Elástico x3",
      "Chaqueta Cortavientos Deportiva Impermeable"
    ],
    images: [
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Moda y prendas de vestir con estilo y la mayor comodidad para tu día a día.",
    descCompleta: "Luce sensacional en cualquier ocasión. Confeccionado con telas suaves y transpirables que garantizan un ajuste perfecto y la durabilidad que necesitas."
  },
  '6': {
    names: [
      "Tenis Deportivos de Running para Correr",
      "Zapatos de Vestir de Cuero Elegantes Oxford",
      "Sandalias Planas de Cuero Casuales para Mujer",
      "Zapatillas Deportivas de Entrenamiento Crossfit",
      "Chanclas de Playa Cómodas Ultra Ligeras",
      "Botas de Cuero Casuales Estilo Militar",
      "Tenis Casuales Urbanos de Lona Unisex",
      "Zapatos de Gamuza Estilo Mocasín Cómodos"
    ],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Calzado ergonómico y moderno diseñado para caminar con total ligereza.",
    descCompleta: "Dale el mejor soporte a tus pasos con un calzado moderno, dotado de suela antideslizante con alta amortiguación y materiales transpirables de primer nivel."
  },
  '7': {
    names: [
      "Pulsera de Plata de Ley 925 Tejido Italiano",
      "Smartwatch Deportivo con Monitor de Ritmo Cardíaco",
      "Gafas de Sol Polarizadas Estilo Aviador UV400",
      "Mochila Antirrobo para Laptop Impermeable",
      "Reloj Analógico de Cuero Elegante para Hombre",
      "Bolso de Mano Elegante de Cuero para Mujer",
      "Cartera de Cuero Genuino Diseño Slim RFID",
      "Cadena con Dije de Corazón Bañado en Oro 18K"
    ],
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Accesorios elegantes y funcionales para destacar tu estilo personal.",
    descCompleta: "El complemento ideal para complementar tu presencia. Fabricado con detalles de precisión y alta calidad que aseguran sofisticación y utilidad en todo momento."
  },
  '8': {
    names: [
      "Perfume Premium de Mujer Fragancia Floral 100ml",
      "Paleta de Sombras de Ojos Neutras y Mate x12",
      "Crema Facial Hidratante con Ácido Hialurónico",
      "Sérum de Vitamina C Antioxidante e Iluminador",
      "Champú de Queratina Profesional Sin Sulfatos 1L",
      "Labial Líquido Mate de Larga Duración",
      "Secador de Pelo Iónico Profesional 2200W",
      "Mascarilla de Tratamiento Capilar Reparadora de Argán"
    ],
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1608248597481-496100c8c836?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Productos cosméticos y de cuidado personal para cuidar y relajar tu piel.",
    descCompleta: "Disfruta de una rutina de belleza superior. Nuestras fórmulas hidratan, nutren y restauran la frescura de tu rostro y cabello de forma completamente segura y saludable."
  },
  '9': {
    names: [
      "Set de Bloques de Construcción Didácticos x100",
      "Mameluco de Algodón Orgánico Ultra Suave para Bebé",
      "Peluche de Oso de Felpa Clásico Extra Suave",
      "Carro a Control Remoto Todo Terreno de Alta Velocidad",
      "Biberón Anticólico de Silicona Libre de BPA 240ml",
      "Cambiador de Pañales Portátil Impermeable Plegable",
      "Juego de Mesa Educativo de Memoria e Inteligencia",
      "Pijama de Dibujos Animados Cómoda para Niño"
    ],
    images: [
      "https://images.unsplash.com/photo-1515488042361-404e9250afef?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1559251606-c623743a6d76?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Seguridad, juego y confort asegurado para los consentidos de casa.",
    descCompleta: "Productos infantiles elaborados con materiales hipoalergénicos de alta calidad, diseñados específicamente para estimular la creatividad y brindar la máxima suavidad."
  },
  '10': {
    names: [
      "Consola PlayStation 5 Slim 1TB Digital",
      "Consola Nintendo Switch OLED Pantalla 7\"",
      "Control Inalámbrico Sony DualSense Blanco",
      "Auriculares Gamer con Micrófono y Sonido 7.1",
      "Teclado Mecánico Switch Azul Retroiluminado RGB",
      "Mouse Gamer Ergonómico con Pesos Ajustables 12000DPI",
      "Control Inalámbrico Microsoft Xbox Series Robot White",
      "Consola Xbox Series S 512GB SSD Blanca"
    ],
    images: [
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592155977687-f12a149f4817?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Siente el poder gamer con componentes que llevan tus jugadas al límite.",
    descCompleta: "Desempeño superior e inmersión absoluta en tus videojuegos. Conexiones estables, diseño ultra-ergonómico y la fiabilidad para reaccionar al instante."
  },
  '11': {
    names: [
      "Tapete de Yoga Antideslizante con Guía de Alineación",
      "Set de Bandas de Resistencia Elásticas para Fitness x5",
      "Mancuernas Ajustables de Acero Antideslizantes 10kg",
      "Balón de Fútbol Profesional FIFA Quality Talla 5",
      "Casco de Bicicleta Aerodinámico con Luz LED Trasera",
      "Luz LED Recargable USB de Alta Potencia para Bicicleta",
      "Rueda de Abdominales con Retorno Automático y Tapete",
      "Espinilleras Deportivas de Alta Protección Ergonómicas"
    ],
    images: [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Implementos deportivos de alta calidad para entrenar donde quieras.",
    descCompleta: "Mantente activo y supera tus propias metas con accesorios robustos construidos con materiales antideslizantes que aseguran un entrenamiento seguro y cómodo."
  },
  '12': {
    names: [
      "Soporte de Celular para Rejilla de Aire Magnético",
      "Organizador de Maletero Plegable de Gran Capacidad",
      "Aspiradora Portátil de Mano para Auto 12V High Power",
      "Bombillos LED para Faros Principales H7 6000K",
      "Champú Concentrado con Cera Premium para Carro 1L",
      "Tira de Luces LED de Interior para Auto Control APP",
      "Soporte de Celular para Parabrisas con Brazo Extensible",
      "Compresor de Aire Portátil Digital Inflador de Llantas"
    ],
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Equipa tu carro con accesorios inteligentes para un viaje impecable.",
    descCompleta: "Viaja seguro y mantén tu vehículo como nuevo. Accesorios duraderos con materiales seguros de alta resistencia ideales para el uso diario en carretera."
  },
  '13': {
    names: [
      "Juego de Destornilladores de Precisión x12 Pro",
      "Taladro Percutor Inalámbrico con Maletín y Brocas",
      "Martillo de Uña de Acero Forjado Ergonómico 16oz",
      "Llave Inglesa Ajustable Multiuso de Acero al Carbono",
      "Caja de Herramientas Plástica Organizadora",
      "Lijadora Orbital Eléctrica de Alta Velocidad 240W",
      "Atornillador de Batería de Mano Ultra Ligero Recargable",
      "Set de Brocas y Puntas de Destornillador x50"
    ],
    images: [
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581244904349-63444e47a516?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Herramientas confiables para tus proyectos de reparación y manualidades.",
    descCompleta: "Lleva a cabo cualquier reparación con total destreza. Herramientas con mangos de goma ergonómicos y metal de alta aleación que garantizan un óptimo agarre."
  },
  '14': {
    names: [
      "Bombillo LED Ahorrador de Energía 9W Pack x4",
      "Regleta Eléctrica de Enchufes con 3 Puertos USB Pro",
      "Extensión Eléctrica Reforzada de Uso Rudo 5 Metros",
      "Bombillo Inteligente Smart Wi-Fi Multicolor LED",
      "Adaptador Enchufe Universal de Viaje con Puertos USB",
      "Interruptor de Luz Inteligente Táctil Wi-Fi",
      "Cable Eléctrico de Cobre Calibre 12 10 Metros",
      "Detector de Voltaje Sin Contacto Lápiz Probador"
    ],
    images: [
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Materiales y accesorios eléctricos seguros para tu hogar u oficina.",
    descCompleta: "Protección óptima contra variaciones de voltaje con materiales resistentes e ignífugos. Ideal para conexiones estables en cualquier toma de corriente."
  },
  '15': {
    names: [
      "Router Wi-Fi 6 de Doble Banda Gigabit Alta Velocidad",
      "Repetidor de Señal Wi-Fi de Largo Alcance 300Mbps",
      "Adaptador USB Antena Wi-Fi de Alta Ganancia 5dBi",
      "Cable de Red Ethernet de Categoría 6 Trenzado 10m",
      "Switch Conmutador Ethernet de 5 Puertos RJ45 Gigabit",
      "Punto de Acceso Wi-Fi Inalámbrico de Techo PoE",
      "Antena de Rejilla Wi-Fi Direccional de Exterior 2.4GHz",
      "Tarjeta de Red PCI-Express Inalámbrica Wi-Fi + Bluetooth"
    ],
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Conectividad robusta e internet de alta velocidad para todos tus equipos.",
    descCompleta: "Disfruta de una señal de internet inalámbrico potente y estable en cada rincón, ideal para streaming HD, descargas y teletrabajo sin interrupciones."
  },
  '16': {
    names: [
      "Alimento Pienso Premium para Perro Adulto 3kg",
      "Alimento Húmedo para Gato Cubos en Salsa Sobres x12",
      "Collar Ajustable con Placa de Identificación Grabable",
      "Correa Extensible de Perro con Freno de Mano 5m",
      "Cama Acolchada Lavable Extra Suave para Gato",
      "Cepillo Autolimpiable para Peinar Pelo de Perro y Gato",
      "Juguete de Cuerda Mordedor Resistente para Cachorros",
      "Shampoo Hipoalergénico de Avena para Baño de Mascotas"
    ],
    images: [
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Productos recomendados por veterinarios para el cuidado integral de tu mascota.",
    descCompleta: "Bríndale el máximo confort y nutrición a tu mascota con nuestra selección de productos seguros, confortables y libres de compuestos químicos agresivos."
  },
  '17': {
    names: [
      "Cuaderno de Notas Tapa Dura con Hojas de Puntos",
      "Bolígrafos de Gel con Punta Fina Set de 10 Colores",
      "Mochila Ejecutiva Antirrobo con Puerto de Carga USB",
      "Mochila Escolar Ergonómica de Gran Capacidad",
      "Organizador de Escritorio de Malla Metálica Multiuso",
      "Set de Resaltadores Pastel de Punta Cincel x6",
      "Pizarra Blanca Magnética para Oficina 60x40cm",
      "Carpeta Organizadora de Documentos Acordeón 24 Bolsillos"
    ],
    images: [
      "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Papelería de alta calidad para organizar tus apuntes de forma impecable.",
    descCompleta: "El equipo indispensable de oficina y estudio que te ayudará a estructurar tus tareas diarias con total pulcritud y un diseño moderno y estético."
  },
  '18': {
    names: [
      "Caja de Regalo con Joya de Plata y Vela Aromática",
      "Oso de Rosas Eternas Hechas a Mano con Caja de Regalo",
      "Set de Cartera y Llavero de Cuero Genuino en Estuche",
      "Kit de Cuidado de Barba para Hombre Aceite y Bálsamo",
      "Taza de Cerámica Personalizada con Cuchara y Tapa",
      "Caja Sorpresa con Dulces Premium y Tarjeta de Regalo",
      "Juego de Copas de Cristal Grabadas Elegantes x2",
      "Lámpara de Luna 3D Táctil Multicolor con Soporte Madera"
    ],
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Sorprende a tus seres queridos con regalos empaquetados listos para obsequiar.",
    descCompleta: "Celebra momentos mágicos con un obsequio original de excelente acabado, listo para regalar en aniversarios, cumpleaños o festividades especiales."
  },
  '19': {
    names: [
      "Sombrilla de Playa con Filtro UV y Anclaje de Arena",
      "Nevera Portátil Térmica para Conservar Alimentos 15L",
      "Silla de Camping Plegable con Portavasos y Funda",
      "Tienda de Campaña Instantánea Impermeable 3 Personas",
      "Mochila de Senderismo Técnica 50L de Alta Resistencia",
      "Colchón Inflable de Camping Individual con Inflador",
      "Botella Térmica de Acero Inoxidable Doble Capa 1L",
      "Mesa Plegable de Aluminio Portátil para Exterior"
    ],
    images: [
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Todo para tus acampadas, fines de semana de playa y paseos al aire libre.",
    descCompleta: "Explora la naturaleza con equipamiento robusto, impermeable y sumamente ligero, pensado para garantizar un óptimo descanso en exteriores."
  },
  '20': {
    names: [
      "Organizador Multiuso Ajustable para Hogar",
      "Linterna Recargable de Alta Potencia con Zoom LED",
      "Llavero Multiuso de Bolsillo Acero Inoxidable 10 en 1",
      "Humidificador de Aire Ultrasónico con Luz de Noche LED",
      "Lupa de Pantalla de Teléfono Móvil Zoom 3D 12 Pulgadas",
      "Ventilador de Mano Portátil Recargable USB Mini",
      "Báscula Digital de Bolsillo de Alta Precisión 500g",
      "Kit de Costura Portátil de Viaje Completo en Estuche"
    ],
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
    ],
    descCorta: "Artículos ingeniosos y soluciones cotidianas para facilitar tus rutinas.",
    descCompleta: "Simplifica tus tareas diarias con novedades multiusos seleccionadas para aportar confort, orden y practicidad en tu día a día."
  }
};

// Map over products array to dynamically enhance them on load
products.forEach((p) => {
  // If it's a demo product (PROD-001 to PROD-100)
  if (p.id.startsWith("PROD-")) {
    const prodNum = parseInt(p.id.replace("PROD-", ""), 10) || 1;
    const catData = REAL_DATA_BY_CATEGORY[p.categoria];
    if (catData) {
      const nameIndex = (prodNum - 1) % catData.names.length;
      const imgIndex = (prodNum - 1) % catData.images.length;
      
      const realName = catData.names[nameIndex];
      // Generate clean SEO compliant slug with id suffix to prevent collisions
      const cleanSlug = realName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric except space and dash
        .replace(/\s+/g, "-") // replace space with dash
        .replace(/-+/g, "-") // compress dashes
        .trim();
        
      p.nombre = realName;
      p.slug = `${cleanSlug}-${p.id.toLowerCase()}`;
      p.imagenes = [catData.images[imgIndex]];
      p.descripcionCorta = catData.descCorta;
      p.descripcionCompleta = catData.descCompleta;
    }
  }
  
  // If it's a reserve/electrohogar product with placehold.co images, replace with high quality Unsplash photos
  if (p.id.startsWith("RES-")) {
    if (p.subcategoria === "ventiladores") {
      p.imagenes = ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"];
    } else if (p.subcategoria === "aires-acondicionados") {
      p.imagenes = ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80"];
    } else if (p.subcategoria === "televisores") {
      p.imagenes = ["https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&auto=format&fit=crop&q=80"];
    } else if (p.subcategoria === "refrigeradores") {
      p.imagenes = ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80"];
    } else if (p.subcategoria === "lavadoras") {
      p.imagenes = ["https://images.unsplash.com/photo-1545173168-9f1947eebd01?w=600&auto=format&fit=crop&q=80"];
    }
  }
});

