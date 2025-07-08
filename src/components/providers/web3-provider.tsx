"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { metaMask } from "@wagmi/connectors"
import type { ReactNode } from "react"
import { useState } from "react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { polygonAmoy } from "wagmi/chains"

interface Web3ProviderProps {
  children: ReactNode
}

// --------------------
// wagmi configuration
// --------------------

export const wagmiConfig = createConfig({
  chains: [polygonAmoy],
  connectors: [metaMask()],
  transports: {
    [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_AMOY_RPC),
  },
  ssr: true,
})

export function Web3Provider({ children }: Web3ProviderProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </QueryClientProvider>
  )
}
