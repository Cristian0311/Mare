
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simplified mock of the local categories
const localCategories = [
  { id: 'hogar', nombre: 'Hogar', slug: 'hogar', subcategorias: [{slug: 'muebles'}, {slug: 'organizacion'}, {slug: 'decoracion'}, {slug: 'iluminacion'}, {slug: 'ropa-cama-bano'}, {slug: 'utensilios-cocina'}, {slug: 'limpieza'}, {slug: 'jardin-exteriores'}] },
  { id: 'electro', nombre: 'Electrodomésticos', slug: 'electrodomesticos', subcategorias: [{slug: 'refrigeracion'}, {slug: 'climatizacion'}, {slug: 'cocina-hornos'}, {slug: 'lavado-secado'}, {slug: 'pequenos-electrodomesticos'}, {slug: 'licuadoras-batidoras'}, {slug: 'cafeteras'}, {slug: 'planchas'}] },
  { id: 'tecnologia', nombre: 'Tecnología', slug: 'tecnologia', subcategorias: [{slug: 'celulares'}, {slug: 'computadoras'}, {slug: 'televisores'}, {slug: 'tablets'}, {slug: 'audio'}, {slug: 'smartwatches'}, {slug: 'accesorios-celulares'}, {slug: 'almacenamiento'}, {slug: 'cables-cargadores'}] },
  { id: 'ropa', nombre: 'Ropa', slug: 'ropa', subcategorias: [{slug: 'ropa-mujer'}, {slug: 'ropa-hombre'}, {slug: 'ropa-infantil'}, {slug: 'ropa-deportiva'}, {slug: 'ropa-interior'}, {slug: 'pijamas'}, {slug: 'trajes-bano'}] },
  { id: 'calzado', nombre: 'Calzado', slug: 'calzado', subcategorias: [{slug: 'calzado-mujer'}, {slug: 'calzado-hombre'}, {slug: 'calzado-infantil'}, {slug: 'zapatos-deportivos'}, {slug: 'sandalias'}, {slug: 'calzado-casual'}, {slug: 'botas'}] },
  { id: 'belleza', nombre: 'Belleza y Cuidado', slug: 'belleza', subcategorias: [{slug: 'maquillaje'}, {slug: 'perfumes'}, {slug: 'cuidado-facial'}, {slug: 'cuidado-cabello'}, {slug: 'cuidado-corporal'}, {slug: 'maquinas-afeitar'}, {slug: 'planchas-pelo'}] },
  { id: 'bisuteria', nombre: 'Bisutería y Accesorios', slug: 'bisuteria', subcategorias: [{slug: 'collares'}, {slug: 'anillos'}, {slug: 'aretes'}, {slug: 'pulseras'}, {slug: 'juegos-bisuteria'}, {slug: 'relojes'}, {slug: 'gafas'}, {slug: 'cinturones'}] },
  { id: 'alimentos', nombre: 'Alimentos y Bebidas', slug: 'alimentos-bebidas', subcategorias: [{slug: 'carnicos'}, {slug: 'lacteos'}, {slug: 'granos'}, {slug: 'aceites'}, {slug: 'conservas'}, {slug: 'cafe-dulces'}, {slug: 'salsas'}, {slug: 'refrescos'}, {slug: 'cervezas-licores'}] },
  { id: 'aseo', nombre: 'Aseo y Limpieza', slug: 'aseo', subcategorias: [{slug: 'jabon-champu'}, {slug: 'desodorantes'}, {slug: 'pasta-dental'}, {slug: 'detergentes'}, {slug: 'limpieza-hogar'}, {slug: 'papel-higienico'}, {slug: 'afeitado'}] },
  { id: 'salud', nombre: 'Salud y Bienestar', slug: 'salud', subcategorias: [{slug: 'vitaminas'}, {slug: 'analgesicos'}, {slug: 'suplementos'}, {slug: 'insumos-medicos'}, {slug: 'salud-infantil'}, {slug: 'primeros-auxilios'}] },
  { id: 'mochilas', nombre: 'Mochilas y Bolsos', slug: 'mochilas-bolsos', subcategorias: [{slug: 'mochilas-escolares'}, {slug: 'mochilas-deportivas'}, {slug: 'mochilas-laptop'}, {slug: 'carteras-mujer'}, {slug: 'billeteras'}, {slug: 'maletas'}] },
  { id: 'ninos', nombre: 'Niños y Bebés', slug: 'ninos', subcategorias: [{slug: 'juguetes'}, {slug: 'coches-andadores'}, {slug: 'biberones'}, {slug: 'panales'}, {slug: 'articulos-escolares'}, {slug: 'juegos-didacticos'}] },
  { id: 'ferreteria', nombre: 'Ferretería y Herramientas', slug: 'ferreteria', subcategorias: [{slug: 'herramientas-electricas'}, {slug: 'herramientas-manuales'}, {slug: 'materiales-electricos'}, {slug: 'plomeria'}, {slug: 'pinturas'}, {slug: 'tornilleria'}, {slug: 'cerrajeria'}] },
  { id: 'automotor', nombre: 'Automotor', slug: 'automotor', subcategorias: [{slug: 'motes-electricas'}, {slug: 'repuestos-motos'}, {slug: 'accesorios-auto'}, {slug: 'llantas'}, {slug: 'baterias'}, {slug: 'lubricantes'}, {slug: 'bicicletas'}] },
  { id: 'deportes', nombre: 'Deportes y Fitness', slug: 'deportes', subcategorias: [{slug: 'equipos-gimnasio'}, {slug: 'pesas'}, {slug: 'beisbol'}, {slug: 'futbol'}, {slug: 'ropa-fitness'}, {slug: 'accesorios-deportes'}] },
  { id: 'mascotas', nombre: 'Mascotas', slug: 'mascotas', subcategorias: [{slug: 'alimento-perros'}, {slug: 'alimento-gatos'}, {slug: 'accesorios-mascotas'}, {slug: 'higiene-mascotas'}, {slug: 'camas-juguetes'}] },
  { id: 'oficina', nombre: 'Oficina y Estudio', slug: 'oficina', subcategorias: [{slug: 'papeleria'}, {slug: 'lapices'}, {slug: 'calculadoras'}, {slug: 'accesorios-escritorio'}, {slug: 'impresoras'}] },
  { id: 'gaming', nombre: 'Gaming', slug: 'gaming', subcategorias: [{slug: 'consolas'}, {slug: 'controles'}, {slug: 'audifonos-gamer'}, {slug: 'juegos'}, {slug: 'sillas-teclados'}] },
  { id: 'regalos', nombre: 'Regalos y Ocasiones', slug: 'regalos', subcategorias: [{slug: 'regalos-ella'}, {slug: 'regalos-el'}, {slug: 'regalos-parejas'}, {slug: 'cumpleanos'}, {slug: 'cajas-regalo'}] },
  { id: 'otros', nombre: 'Otros', slug: 'otros', subcategorias: [{slug: 'varios'}, {slug: 'novedades'}] }
];

async function verifyAll() {
  const { data: dbCats, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error(error);
    return;
  }

  const dbMainCats = dbCats.filter(c => c.parent_id === null);
  const dbSubCats = dbCats.filter(c => c.parent_id !== null);

  console.log('--- VERIFICATION REPORT ---');
  let issues = 0;

  localCategories.forEach(localCat => {
    const dbCat = dbMainCats.find(c => c.slug === localCat.slug);
    if (!dbCat) {
      console.log(`[MISSING MAIN CATEGORY] Slug: ${localCat.slug} (${localCat.nombre})`);
      issues++;
      return;
    }

    const localSubs = localCat.subcategorias || [];
    const dbSubsForCat = dbSubCats.filter(s => s.parent_id === dbCat.id);

    localSubs.forEach(localSub => {
      const found = dbSubsForCat.find(s => s.slug === localSub.slug);
      if (!found) {
        console.log(`[MISSING SUBCATEGORY] Parent: ${localCat.slug}, Sub Slug: ${localSub.slug}`);
        issues++;
      }
    });

    dbSubsForCat.forEach(dbSub => {
      const found = localSubs.find(s => s.slug === dbSub.slug);
      if (!found) {
        console.log(`[UNEXPECTED SUBCATEGORY IN DB] Parent: ${localCat.slug}, DB Sub Slug: ${dbSub.slug}`);
        issues++;
      }
    });
  });

  if (issues === 0) {
    console.log('\nSUCCESS: All categories and subcategories match perfectly between code and Supabase.');
  } else {
    console.log(`\nTOTAL ISSUES FOUND: ${issues}`);
  }
}

verifyAll();
