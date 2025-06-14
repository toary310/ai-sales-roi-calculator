import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, Calculator, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404アイコン */}
        <div className="flex justify-center mb-8">
          <AlertTriangle className="h-24 w-24 text-muted-foreground" />
        </div>

        {/* メインメッセージ */}
        <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">ページが見つかりません</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          お探しのページは存在しないか、移動または削除された可能性があります。
          URLをご確認いただくか、以下のリンクから目的のページにアクセスしてください。
        </p>

        {/* 推奨アクション */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">こちらはいかがですか？</CardTitle>
            <CardDescription>よく利用されるページへのリンク</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link href="/" className="flex flex-col items-center gap-2">
                  <Home className="h-6 w-6" />
                  <span className="font-medium">ホームページ</span>
                  <span className="text-xs text-muted-foreground">
                    サービス概要を確認
                  </span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4">
                <Link href="/calculator" className="flex flex-col items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  <span className="font-medium">ROI計算</span>
                  <span className="text-xs text-muted-foreground">
                    計算を開始する
                  </span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ナビゲーションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              ホームに戻る
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              ROI計算を開始
            </Link>
          </Button>
        </div>

        {/* 追加情報 */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            問題が解決しない場合は、ブラウザの戻るボタンを使用するか、
            <br />
            URLを直接入力してアクセスしてください。
          </p>
        </div>
      </div>
    </div>
  )
}
