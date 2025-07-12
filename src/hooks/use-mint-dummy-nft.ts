"use client"

/**
 * ダミーNFTミントフック
 *
 * このフックは、ユーザーがダミーNFT（テスト用のNFT）をミント（作成）する機能を提供します。
 * NFTミントは、ブロックチェーン上に新しいトークンを作成する処理です。
 *
 * 主な機能:
 * - ウォレット接続状態の確認
 * - NFTミントリクエストの送信
 * - トランザクション状態の監視
 * - 成功/失敗時のトースト通知
 * - トランザクション完了後の状態リセット
 *
 * 使用例:
 * ```tsx
 * const { mint, isPending } = useMintDummyNft()
 *
 * return (
 *   <button onClick={mint} disabled={isPending}>
 *     {isPending ? 'ミント中...' : 'ダミーNFTをミント'}
 *   </button>
 * )
 * ```
 */
import { useAccount, useWaitForTransactionReceipt } from "wagmi"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

/**
 * フックの戻り値の型定義
 * - mint: NFTミントを実行する関数
 * - isPending: ミント処理中かどうかの状態
 */
interface MintHookResult {
  mint: () => void
  isPending: boolean
}

export function useMintDummyNft(): MintHookResult {
  // 現在接続されているウォレットのアドレスを取得
  const { address } = useAccount()

  // トースト通知機能を使用
  const { toast } = useToast()

  // トランザクションハッシュ（ブロックチェーン上の取引ID）を保存
  const [txHash, setTxHash] = useState<string | undefined>()
  // ミントリクエスト送信中の状態
  const [isMinting, setIsMinting] = useState(false)

  // トランザクションの受領（完了）を監視
  // txHashが存在する場合のみ監視を有効化
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash, enabled: !!txHash })

  // ローディング状態の計算
  // ミントリクエスト中 OR トランザクション完了待ち中
  const loading = isMinting || (!!txHash && !isSuccess)

  /**
   * トランザクション完了時の処理
   *
   * トランザクションが成功した場合:
   * 1. 成功通知を表示（トランザクション確認リンク付き）
   * 2. 状態をリセットして再度ミント可能にする
   */
  useEffect(() => {
    if (isSuccess && txHash) {
      // 成功通知を表示
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

  /**
   * NFTミントを実行する関数
   *
   * 処理の流れ:
   * 1. ウォレット接続状態をチェック
   * 2. ミントリクエストをサーバーに送信
   * 3. レスポンスからトランザクションハッシュを取得
   * 4. エラー時は失敗通知を表示
   */
  const mint = async () => {
    // ウォレットが接続されていない場合はエラー通知
    if (!address) {
      toast({ title: "Wallet 未接続", variant: "destructive" })
      return
    }

    try {
      // ミント処理開始
      setIsMinting(true)

      // サーバーにミントリクエストを送信
      const res = await fetch('/api/mint-dummy-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })

      const data = await res.json()

      // レスポンスがエラーの場合は例外を投げる
      if (!res.ok) throw new Error(data.error || 'Mint failed')

      // トランザクションハッシュを保存（useEffectで完了を監視）
      setTxHash(data.hash)
    } catch (e: any) {
      // エラー時は失敗通知を表示
      toast({ title: 'Mint 失敗', description: e.message, variant: 'destructive' })
      setIsMinting(false)
    } finally {
      /*
       * レシート待ち中は isMinting を維持し、useEffect でリセット
       * これにより、トランザクション完了までローディング状態を維持
       */
    }
  }

  // フックの戻り値: ミント関数とローディング状態
  return { mint, isPending: loading }
}
