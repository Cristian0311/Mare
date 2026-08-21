
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSync() {
  const { data: cats, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error(error);
    return;
  }

  const mainCats = cats.filter(c => c.parent_id === null);
  const subCats = cats.filter(c => c.parent_id !== null);

  console.log(`Total categories in DB: ${cats.length}`);
  console.log(`Main categories in DB: ${mainCats.length}`);
  console.log(`Subcategories in DB: ${subCats.length}`);

  console.log('\nMain Categories Slugs:');
  console.log(mainCats.map(c => c.slug).sort());

  // Check for specific subcategories for one category to verify structure
  const hogar = mainCats.find(c => c.slug === 'hogar');
  if (hogar) {
    const hogarSubs = subCats.filter(c => c.parent_id === hogar.id);
    console.log(`\nSubcategories for 'hogar': ${hogarSubs.length}`);
    console.log(hogarSubs.map(s => s.slug).sort());
  }
}

checkSync();
