import { createClient } from '@supabase/supabase-js';

const env = typeof import.meta !== 'undefined' ? import.meta.env : {};
const supabaseUrl = env?.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : undefined);
const publishableKey = env?.VITE_SUPABASE_PUBLISHABLE_KEY || env?.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? (process.env?.VITE_SUPABASE_PUBLISHABLE_KEY || process.env?.VITE_SUPABASE_ANON_KEY) : undefined);

export const isConfigured = Boolean(supabaseUrl && publishableKey && supabaseUrl !== 'https://placeholder.supabase.co');

if (!isConfigured) console.warn('Supabase CRM environment variables are missing.');

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  publishableKey || 'placeholder'
);
