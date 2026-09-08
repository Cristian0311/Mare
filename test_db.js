import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('store_settings').upsert({ key: 'features', value: { catalogMode: true, favorites: true, share: true, pwa: true, usdConversion: true }, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  console.log('Error:', error);
  console.log('Data:', data);
}
run();
