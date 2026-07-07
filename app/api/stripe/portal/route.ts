import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ url: 'https://stripe.com/portal/stub' })
}
