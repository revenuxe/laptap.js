"use client";

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { fetchWithTimeout } from '@/lib/request-timeout';

import { supabaseUrl, supabasePublishableKey } from './config';

export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
  global: { fetch: fetchWithTimeout },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
