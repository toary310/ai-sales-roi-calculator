/**
 * ウォレット接続ボタンコンポーネント
 *
 * このコンポーネントは、Web3ウォレット（MetaMaskなど）との接続を管理する
 * インタラクティブなボタンを提供します。ウォレットの接続状態に応じて、
 * 接続、署名認証、切断などの機能を提供します。
 *
 * 状態遷移:
 * 1. 未接続 → 「Connect Wallet」表示
 * 2. 接続済み → アドレス表示
 * 3. 署名待ち → 「Signing...」表示
 * 4. 署名済み → アドレス表示（切断可能）
 *
 * 機能:
 * - ウォレット接続の開始
 * - SIWE（Sign-In with Ethereum）認証
 * - ウォレットの切断
 * - アドレスの表示（省略形式）
 */

"use client"

import { Button } from "@/components/ui/button"
import { useSiweAuth } from "@/hooks/use-siwe"
import { cn } from "@/lib/utils"
import { useAccount, useConnect, useDisconnect } from "wagmi"

/**
 * ウォレットアドレスを短縮表示する関数
 *
 * @param {string} address - ウォレットアドレス（0x...）
 * @returns {string} 短縮形式のアドレス（例: 0x1234...abcd）
 */
const truncateAddress = (address?: string) => {
  if (!address) return ""
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

/**
 * ウォレット接続ボタンコンポーネントの実装
 *
 * @returns {JSX.Element} ウォレット接続状態に応じて表示が変化するボタン
 */
export function ConnectWalletButton() {
  // Wagmiフックの使用
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()

  // SIWE認証フックの使用
  const { signIn, loading: siweLoading, authenticated } = useSiweAuth()

  /**
   * ボタンクリック時の処理
   *
   * 状態に応じて以下の処理を実行:
   * - 未接続時: ウォレット接続を開始
   * - 接続済み未認証時: SIWE署名を要求
   * - 認証済み時: ウォレットを切断
   */
  const handleClick = () => {
    if (isConnected) {
      // 既に接続済みなら署名認証を試行
      if (!authenticated) {
        signIn()
      } else {
        disconnect()
      }
    } else {
      // 未接続なら最初のコネクタ（通常はMetaMask）で接続
      const defaultConnector = connectors[0]
      if (defaultConnector) {
        connect({ connector: defaultConnector })
      }
    }
  }

  return (
    <Button
      variant={isConnected ? "secondary" : "default"}
      onClick={handleClick}
      disabled={isConnecting}
      aria-label={isConnected ? "Disconnect Wallet" : "Connect Wallet"}
      className={cn("px-4")}
    >
      {isConnected
        ? authenticated
          ? <span className="font-mono">{truncateAddress(address)}</span>
          : siweLoading
            ? "Signing..."
            : "Sign In"
        : "Connect Wallet"}
    </Button>
  )
}
