"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Home, Bug } from "lucide-react"
import Link from "next/link"
import { useEffect } from "react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // エラーログを記録（本番環境では適切なログサービスに送信）
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* エラーアイコン */}
        <div className="flex justify-center mb-8">
          <AlertCircle className="h-24 w-24 text-destructive" />
        </div>

        {/* メインメッセージ */}
        <h1 className="text-3xl font-bold mb-4">エラーが発生しました</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          申し訳ございません。予期しないエラーが発生しました。
          一時的な問題の可能性がありますので、ページを再読み込みしてお試しください。
        </p>

        {/* エラー詳細（開発環境のみ） */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mb-8 text-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Bug className="h-5 w-5" />
                エラー詳細 (開発環境)
              </CardTitle>
              <CardDescription>本番環境では表示されません</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm overflow-auto">
                  <code>{error.message}</code>
                </pre>
                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 対処方法 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">対処方法</CardTitle>
            <CardDescription>以下の方法をお試しください</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 text-left">
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <RefreshCw className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">ページを再読み込み</h4>
                  <p className="text-sm text-muted-foreground">
                    一時的な問題の場合、再読み込みで解決することがあります
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <Home className="h-5 w-5 mt-0.5 text-primary" />
                <div>
                  <h4 className="font-medium">ホームページに戻る</h4>
                  <p className="text-sm text-muted-foreground">
                    最初からやり直すことで問題が解決する場合があります
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={reset} 
            size="lg" 
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            再試行
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              ホームに戻る
            </Link>
          </Button>
        </div>

        {/* 追加情報 */}
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            問題が継続する場合は、ブラウザのキャッシュをクリアするか、
            <br />
            しばらく時間をおいてから再度アクセスしてください。
          </p>
        </div>
      </div>
    </div>
  )
}
