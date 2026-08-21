import { Product } from '../types/product';

const SITE_URL = 'https://mare-a8w2.onrender.com';

/**
 * Generates JSON-LD for a single product
 */
export function generateProductSchema(product: Product, priceMN: number, url: string) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.nombre,
    "image": product.imagenes.map(img => img.startsWith('http') ? img : `${SITE_URL}${img}`),
    "description": product.descripcionCorta,
    "sku": product.id,
    "mpn": product.modelo || product.id,
    "brand": {
      "@type": "Brand",
      "name": product.marca || "MARÉ"
    },
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "CUP",
      "price": priceMN,
      "itemCondition": product.estado === 'nuevo' ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      "availability": product.disponibilidad === 'disponible' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "MARÉ"
      }
    }
  };
}

/**
 * Generates Breadcrumb JSON-LD
 */
export function generateBreadcrumbSchema(items: { name: string, item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item.startsWith('http') ? item.item : `${SITE_URL}${item.item}`
    }))
  };
}

/**
 * Generates Organization JSON-LD
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MARÉ",
    "url": SITE_URL,
    "logo": `${SITE_URL}/icon.svg`,
    "description": "Tienda online líder en Cuba con envíos a todo el país."
  };
}

/**
 * Slugifies a string for URLs
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalize to separate accents
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
