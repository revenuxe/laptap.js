const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const configuredKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!configuredUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required.');
}

if (!configuredKey?.startsWith('sb_publishable_')) {
  throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be an sb_publishable_ key.');
}

export const supabaseUrl = configuredUrl;
export const supabasePublishableKey = configuredKey;
