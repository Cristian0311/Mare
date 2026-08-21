
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function count() {
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  console.log(`Total products in DB: ${count}`);
}

count();
