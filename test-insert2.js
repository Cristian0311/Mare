import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const insertPayload = {
    name: "Test Product",
    description: "test",
    category_id: null,
    price_cup: 100,
    compare_at_price_cup: null,
    status: 'active',
    product_type: 'retail',
    is_featured: false,
    is_new: false,
    sort_order: 0,
  };

  const { data, error } = await supabase.from('products').insert(insertPayload).select();
  console.log("Error:", error);
}

test();
