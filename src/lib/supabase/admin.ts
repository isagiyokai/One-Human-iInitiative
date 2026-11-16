import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Service role client - ONLY use in server-side admin APIs
// Never expose this to the browser
export function createAdminClient(): SupabaseClient {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// Singleton for reuse
let adminClient: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  if (!adminClient) {
    adminClient = createAdminClient();
  }
  return adminClient;
}