"use client"

import { WagmiProvider, createConfig, http } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { polygonMumbai } from "wagmi/chains"
import { metaMask } from "@wagmi/connectors"
import type { ReactNode } from "react"

interface Web3ProviderProps {
  children: ReactNode
}

// --------------------
// wagmi configuration
// --------------------

export const wagmiConfig = createConfig({
  chains: [polygonMumbai],
  connectors: [metaMask()],
  transports: {
    [polygonMumbai.id]: http(),
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
