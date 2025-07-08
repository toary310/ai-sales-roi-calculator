import { NextRequest, NextResponse } from 'next/server'
import { SiweMessage } from 'siwe'

export async function POST(request: NextRequest) {
  try {
    const { message, signature } = await request.json()
    if (!message || !signature) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const siweMessage = new SiweMessage(message)
    const nonceCookie = request.cookies.get('siwe-nonce')?.value
    if (!nonceCookie) {
      return NextResponse.json({ error: 'Nonce cookie missing' }, { status: 422 })
    }

    const result = await siweMessage.verify({ signature, nonce: nonceCookie })
    if (result.success) {
      // セッション Cookie を発行（簡易実装）
      const response = NextResponse.json({ ok: true, address: siweMessage.address })
      response.cookies.set({
        name: 'siwe-session',
        value: siweMessage.address,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      })
      return response
    }
    return NextResponse.json({ error: 'Verification failed' }, { status: 401 })
  } catch (error) {
    console.error('SIWE verify error', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
