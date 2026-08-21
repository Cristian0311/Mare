
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProducts() {
  const { data: products, error } = await supabase.from('products').select('id, name, category_id, subcategory_id');
  if (error) {
    console.error(error);
    return;
  }

  const orphans = products.filter(p => !p.category_id);
  console.log(`Total products: ${products.length}`);
  console.log(`Products without category: ${orphans.length}`);
  if (orphans.length > 0) {
    console.log('Orphan names:', orphans.map(o => o.name));
  }

  // Check for invalid category IDs
  const { data: cats } = await supabase.from('categories').select('id');
  const catIds = new Set(cats.map(c => c.id));
  
  const invalidCats = products.filter(p => p.category_id && !catIds.has(p.category_id));
  console.log(`Products with invalid category ID: ${invalidCats.length}`);

  const invalidSubs = products.filter(p => p.subcategory_id && !catIds.has(p.subcategory_id));
  console.log(`Products with invalid subcategory ID: ${invalidSubs.length}`);
}

checkProducts();
