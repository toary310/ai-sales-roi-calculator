"use client"

import { Button } from "@/components/ui/button"
import { useMintDummyNft } from "@/hooks/use-mint-dummy-nft"
import { Gift } from "lucide-react"

export function MintNftButton() {
  const { mint, isPending } = useMintDummyNft()

  return (
    <Button
      size="lg"
      className="flex items-center gap-2"
      onClick={mint}
      disabled={isPending}
    >
      <Gift className="h-4 w-4" />
      {isPending ? "Minting..." : "Mint Dummy NFT"}
    </Button>
  )
}
