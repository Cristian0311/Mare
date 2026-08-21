
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase env vars missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCategories() {
  console.log('--- CATEGORIES ---');
  const { data: cats, error: catError } = await supabase.from('categories').select('*');
  if (catError) console.error(catError);
  else console.log(JSON.stringify(cats, null, 2));

  console.log('\n--- SUBCATEGORIES ---');
  const { data: subs, error: subError } = await supabase.from('subcategories').select('*');
  if (subError) console.error(subError);
  else console.log(JSON.stringify(subs, null, 2));
}

checkCategories();
