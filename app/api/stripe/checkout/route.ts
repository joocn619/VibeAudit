import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ url: 'https://stripe.com/checkout/stub' })
}
