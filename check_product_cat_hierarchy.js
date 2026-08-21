
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProductCategories() {
  const { data: products } = await supabase.from('products').select('name, category_id');
  const { data: categories } = await supabase.from('categories').select('id, name, parent_id');

  const catMap = new Map(categories.map(c => [c.id, c]));

  let subCount = 0;
  let mainCount = 0;

  products.forEach(p => {
    const cat = catMap.get(p.category_id);
    if (cat) {
      if (cat.parent_id) {
        subCount++;
        // console.log(`Product "${p.name}" is in subcategory "${cat.name}"`);
      } else {
        mainCount++;
      }
    }
  });

  console.log(`Products in main categories: ${mainCount}`);
  console.log(`Products in subcategories: ${subCount}`);
}

checkProductCategories();
