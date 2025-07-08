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
  const [isMinting, setIsMinting] = useState(false)

  // トランザクション受領
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash, enabled: !!txHash })

  // ローディング状態: リクエスト中 or レシート待ち
  const loading = isMinting || (!!txHash && !isSuccess)

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

      // 状態リセットで再度Mint可能に
      setTxHash(undefined)
      setIsMinting(false)
    }
  }, [isSuccess, txHash, toast])

  const mint = async () => {
    if (!address) {
      toast({ title: "Wallet 未接続", variant: "destructive" })
      return
    }
    try {
      setIsMinting(true)
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
      setIsMinting(false)
    } finally {
      /* レシート待ち中は isMinting を維持し、useEffect でリセット */
    }
  }

  return { mint, isPending: loading }
}
