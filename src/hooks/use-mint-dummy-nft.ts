"use client"

import { useAccount, useWaitForTransactionReceipt } from "wagmi"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface MintHookResult {
  mint: () => void
  isPending: boolean
}

export function useMintDummyNft(): MintHookResult {
  const { address } = useAccount()

  const { toast } = useToast()

  const [txHash, setTxHash] = useState<string | undefined>()
  const [isPending, setIsPending] = useState(false)

  // トランザクション受領
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash, enabled: !!txHash })

  useEffect(() => {
    if (isSuccess && txHash) {
      toast({
        title: "Mint 成功 🎉",
        description: (
          <a
            href={`https://www.oklink.com/amoy/tx/${txHash}`}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            トランザクションを確認する
          </a>
        ),
      })
    }
  }, [isSuccess, txHash, toast])

  const mint = async () => {
    if (!address) {
      toast({ title: "Wallet 未接続", variant: "destructive" })
      return
    }
    try {
      setIsPending(true)
      const res = await fetch('/api/mint-dummy-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Mint failed')
      setTxHash(data.hash)
    } catch (e: any) {
      toast({ title: 'Mint 失敗', description: e.message, variant: 'destructive' })
    } finally {
      setIsPending(false)
    }
  }

  return { mint, isPending }
}
