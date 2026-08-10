import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pdwdonojugtersushxtv.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkd2Rvbm9qdWd0ZXJzdXNoeHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNTY3OTEsImV4cCI6MjEwMTkzMjc5MX0.hvPdCeIPafjtePXU7n4q0LbLgXsa797PI1SzrzulMII";

export function createServerSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
