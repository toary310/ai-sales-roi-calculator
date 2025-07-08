"use client"

import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { DUMMY_NFT_ABI, DUMMY_NFT_ADDRESS } from "@/lib/web3/mint-dummy-nft"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface MintHookResult {
  mint: () => void
  isPending: boolean
}

export function useMintDummyNft(): MintHookResult {
  const { address } = useAccount()

  const { toast } = useToast()

  const {
    data: txHash,
    isPending,
    error,
    reset,
    writeContract,
  } = useWriteContract()

  // トランザクション受領
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash })

  // トースト通知
  useEffect(() => {
    if (error) {
      toast({
        title: "Mint 失敗",
        description: error.message,
        variant: "destructive",
      })
      reset()
    }
  }, [error, reset, toast])

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

  const mint = () => {
    if (!address) {
      toast({ title: "Wallet 未接続", variant: "destructive" })
      return
    }
    writeContract({
      address: DUMMY_NFT_ADDRESS,
      abi: DUMMY_NFT_ABI,
      functionName: "mint",
      args: [address],
    })
  }

  return { mint, isPending }
}
