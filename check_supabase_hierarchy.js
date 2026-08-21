
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkHierarchy() {
  const { data: cats } = await supabase.from('categories').select('id, name, parent_id');
  const catIds = new Set(cats.map(c => c.id));
  
  const orphans = cats.filter(c => c.parent_id && !catIds.has(c.parent_id));
  console.log(`Subcategories with invalid parent_id: ${orphans.length}`);
  if (orphans.length > 0) {
    console.log('Invalid parents found for:', orphans.map(o => o.name));
  } else {
    console.log('Hierarchy is clean in Supabase.');
  }
}

checkHierarchy();
