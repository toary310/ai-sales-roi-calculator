"use client"

/**
 * SIWE (Sign-In with Ethereum) 認証フック
 *
 * このフックは、ユーザーがウォレットを使ってアプリケーションにサインインする機能を提供します。
 * SIWEは、ウォレットの秘密鍵を使ってメッセージに署名することで、ユーザーの身元を証明する仕組みです。
 *
 * 主な機能:
 * - ウォレット接続状態の確認
 * - サーバーからnonce（一度だけ使用される乱数）の取得
 * - SIWEメッセージの構築と署名
 * - 署名の検証と認証状態の管理
 *
 * 使用例:
 * ```tsx
 * const { signIn, loading, error, authenticated } = useSiweAuth()
 *
 * if (authenticated) {
 *   return <div>認証済みです</div>
 * }
 *
 * return (
 *   <button onClick={signIn} disabled={loading}>
 *     {loading ? '認証中...' : 'ウォレットでサインイン'}
 *   </button>
 * )
 * ```
 */
import { wagmiConfig } from '@/components/providers/web3-provider'
import { getAccount, getChains } from '@wagmi/core'
import { useCallback, useState } from 'react'
import { SiweMessage } from 'siwe'
import { useSignMessage } from 'wagmi'

export function useSiweAuth() {
  // 認証処理中のローディング状態
  const [loading, setLoading] = useState(false)
  // エラーメッセージを格納する状態
  const [error, setError] = useState<string | null>(null)
  // 認証成功したかどうかの状態
  const [authenticated, setAuthenticated] = useState(false)

  // wagmiの署名機能を使用（ウォレットでメッセージに署名する）
  const { signMessageAsync } = useSignMessage()

  /**
   * SIWE認証を実行する関数
   *
   * 認証の流れ:
   * 1. ウォレットが接続されているかチェック
   * 2. サーバーからnonce（一度だけ使用される乱数）を取得
   * 3. SIWEメッセージを構築（ドメイン、アドレス、チェーンID等を含む）
   * 4. ユーザーにメッセージへの署名を求める
   * 5. 署名をサーバーに送信して検証
   * 6. 検証成功時に認証状態を更新
   */
  const signIn = useCallback(async () => {
    try {
      // 認証処理開始
      setLoading(true)
      setError(null)

      // 現在接続されているウォレットのアカウント情報を取得
      const account = getAccount(wagmiConfig)
      if (!account.address) throw new Error('Wallet not connected')

      // 1. サーバーからnonce（一度だけ使用される乱数）を取得
      // nonceは、リプレイ攻撃（同じ署名を再利用する攻撃）を防ぐために使用
      const nonceRes = await fetch('/api/siwe/nonce')
      const { nonce } = await nonceRes.json()

      // 2. SIWEメッセージを構築
      // SIWEメッセージには、認証に必要な情報（ドメイン、アドレス、チェーンID等）が含まれる
      const domain = window.location.host // 現在のドメイン（例: localhost:3000）
      const uri = window.location.origin // 現在のURL（例: http://localhost:3000）
      const chainId = getChains(wagmiConfig)[0].id // 接続されているチェーンのID
      const message = new SiweMessage({
        domain,
        address: account.address,
        statement: 'Sign in with Ethereum to AI Sales ROI Calculator.', // ユーザーに表示されるメッセージ
        uri,
        version: '1',
        chainId,
        nonce,
      }).prepareMessage() // メッセージを署名用の形式に変換

      // 3. ユーザーにメッセージへの署名を求める
      // この署名により、ユーザーがウォレットの所有者であることを証明
      const signature = await signMessageAsync({ message })

      // 4. 署名をサーバーに送信して検証
      // サーバー側で署名の有効性を確認し、認証を完了
      const verifyRes = await fetch('/api/siwe/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      })
      if (!verifyRes.ok) {
        const { error } = await verifyRes.json()
        throw new Error(error || 'Verification failed')
      }

      // 認証成功
      setAuthenticated(true)
    } catch (e: any) {
      // エラーが発生した場合はエラーメッセージを設定
      setError(e.message)
    } finally {
      // 処理完了後はローディング状態を解除
      setLoading(false)
    }
  }, [signMessageAsync])

  // フックの戻り値: 認証関数、ローディング状態、エラー、認証状態
  return { signIn, loading, error, authenticated }
}
