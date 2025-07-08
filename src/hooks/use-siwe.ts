"use client"

import { SiweMessage } from 'siwe'
import { useSignMessage } from 'wagmi'
import { useCallback, useState } from 'react'
import { wagmiConfig } from '@/components/providers/web3-provider'
import { getAccount, getChains } from '@wagmi/core'

export function useSiweAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authenticated, setAuthenticated] = useState(false)

  const { signMessageAsync } = useSignMessage()

  const signIn = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const account = getAccount(wagmiConfig)
      if (!account.address) throw new Error('Wallet not connected')

      // 1. 取得 nonce
      const nonceRes = await fetch('/api/siwe/nonce')
      const { nonce } = await nonceRes.json()

      // 2. SIWE message 構築
      const domain = window.location.host
      const uri = window.location.origin
      const chainId = getChains(wagmiConfig)[0].id
      const message = new SiweMessage({
        domain,
        address: account.address,
        statement: 'Sign in with Ethereum to AI Sales ROI Calculator.',
        uri,
        version: '1',
        chainId,
        nonce,
      }).prepareMessage()

      // 3. 署名
      const signature = await signMessageAsync({ message })

      // 4. サーバーへ検証リクエスト
      const verifyRes = await fetch('/api/siwe/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      })
      if (!verifyRes.ok) {
        const { error } = await verifyRes.json()
        throw new Error(error || 'Verification failed')
      }
      setAuthenticated(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [signMessageAsync])

  return { signIn, loading, error, authenticated }
}
