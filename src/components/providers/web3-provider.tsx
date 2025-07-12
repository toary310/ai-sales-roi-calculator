/**
 * Web3プロバイダーコンポーネント
 *
 * このコンポーネントは、アプリケーション全体にWeb3機能を提供するプロバイダーを実装します。
 * Wagmi（Web3ライブラリ）とReact Query（状態管理）を組み合わせて、
 * ブロックチェーンとの対話機能を提供します。
 *
 * 主な機能:
 * - ウォレット接続の管理
 * - ブロックチェーンネットワークの設定
 * - トランザクション状態の管理
 * - キャッシュの制御
 *
 * @example
 * ```tsx
 * // アプリケーションのルートで使用
 * function App() {
 *   return (
 *     <Web3Provider>
 *       <YourApp />
 *     </Web3Provider>
 *   )
 * }
 * ```
 */

"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { metaMask } from "@wagmi/connectors"
import type { ReactNode } from "react"
import { useState } from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { polygonAmoy } from "wagmi/chains"

/**
 * Web3プロバイダーのプロパティ型定義
 * @interface
 * @property {ReactNode} children - プロバイダー内でレンダリングする子要素
 */
interface Web3ProviderProps {
  children: ReactNode
}

/**
 * Wagmiの設定を作成
 * - MetaMaskコネクタの設定
 * - Polygon Amoyテストネットの指定
 * - HTTPプロバイダーの設定
 */
const wagmiConfig = createConfig({
  chains: [polygonAmoy],
  connectors: [
    metaMask()
  ],
  transports: {
    [polygonAmoy.id]: http()
  },
})

/**
 * Web3プロバイダーコンポーネントの実装
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - プロバイダー内でレンダリングする子要素
 * @returns {JSX.Element} Web3機能を提供するプロバイダーコンポーネント
 */
export function Web3Provider({ children }: Web3ProviderProps) {
  // React Queryクライアントの初期化（状態は保持）
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </QueryClientProvider>
  )
}
