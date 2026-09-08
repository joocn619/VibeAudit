import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Profile } from '@/types'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  let redirectUrl = requestUrl.searchParams.get('redirect') || '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)
    
    if (session?.user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      const profile = data as Profile | null

      if (profile && !profile.onboarding_completed && redirectUrl === '/dashboard') {
        redirectUrl = '/onboarding'
      }
    }
  }

  return NextResponse.redirect(new URL(redirectUrl, request.url))
}


