import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

/**
 * Service-role Supabase client. Bypasses RLS — use ONLY in trusted server
 * contexts (verified webhooks, background jobs). Never import into client code.
 *
 * Fails closed: throws if the service-role key is missing rather than silently
 * downgrading to the anon key.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY. The service-role client must never ' +
        'fall back to the anon key.'
    )
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
