"use client"

import { Button } from "@/components/ui/button"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { cn } from "@/lib/utils"
import { useSiweAuth } from "@/hooks/use-siwe"

// ウォレットアドレスを 0x1234...abcd 形式で短縮表示
const truncateAddress = (address?: string) => {
  if (!address) return ""
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount()

  const { connect, connectors, isPending: isConnecting } = useConnect()

  const { disconnect } = useDisconnect()

  const { signIn, loading: siweLoading, authenticated } = useSiweAuth()

  const handleClick = () => {
    if (isConnected) {
      // 既に接続済みなら署名認証を試行
      if (!authenticated) {
        signIn()
      } else {
        disconnect()
      }
    } else {
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
          ? truncateAddress(address)
          : siweLoading
            ? "Signing..."
            : "Sign In"
        : "Connect Wallet"}
    </Button>
  )
}
