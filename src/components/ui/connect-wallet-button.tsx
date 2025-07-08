"use client"

import { Button } from "@/components/ui/button"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { cn } from "@/lib/utils"

// ウォレットアドレスを 0x1234...abcd 形式で短縮表示
const truncateAddress = (address?: string) => {
  if (!address) return ""
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function ConnectWalletButton() {
  const { address, isConnected } = useAccount()

  const { connect, connectors, isPending: isConnecting } = useConnect()

  const { disconnect } = useDisconnect()

  const handleClick = () => {
    if (isConnected) {
      disconnect()
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
      {isConnected ? truncateAddress(address) : "Connect Wallet"}
    </Button>
  )
}
