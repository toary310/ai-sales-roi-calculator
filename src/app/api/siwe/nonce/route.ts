import { NextRequest, NextResponse } from 'next/server'
import { generateNonce } from 'siwe'

export async function GET(_req: NextRequest) {
  const nonce = generateNonce()

  const response = NextResponse.json({ nonce })
  response.cookies.set({
    name: 'siwe-nonce',
    value: nonce,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10, // 10 minutes
    path: '/',
  })
  return response
}
