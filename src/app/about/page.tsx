import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Info, 
  Target, 
  Users, 
  TrendingUp, 
  Shield, 
  Calculator,
  CheckCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container py-8 md:py-12">
      {/* ページヘッダー */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Info className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          AI Sales ROI Calculator について
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          AI導入による営業効果とROIを簡単に計算できるツールです。
          データドリブンな意思決定をサポートし、AI投資の価値を可視化します。
        </p>
      </div>

      {/* サービス概要 */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            サービス概要
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            AI Sales ROI Calculatorは、営業組織がAI技術を導入する際の投資対効果（ROI）を
            簡単に計算できるWebアプリケーションです。現在の営業データとAI導入計画を入力するだけで、
            期待される効果と投資回収期間を可視化できます。
          </p>
          <p className="text-muted-foreground">
            営業マネージャー、経営陣、IT部門の方々が、AI導入の意思決定を行う際の
            重要な判断材料として活用いただけます。
          </p>
        </CardContent>
      </Card>

      {/* 主な機能 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">主な機能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Calculator className="h-8 w-8 mb-2 text-primary" />
              <CardTitle className="text-lg">ROI計算</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                現在の営業データとAI導入コストから、正確なROIと投資回収期間を計算します。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 mb-2 text-primary" />
              <CardTitle className="text-lg">効果分析</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                営業効率の向上、成約率の改善、コスト削減効果を詳細に分析します。
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle className="text-lg">チーム分析</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                営業チーム規模や構成に応じた、最適なAI導入戦略を提案します。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 計算方法 */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            計算方法
          </CardTitle>
          <CardDescription>ROI計算に使用される主要な指標と計算式</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-2">ROI (投資収益率)</h4>
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm">
                ROI = (年間利益増加 - AI導入コスト) ÷ AI導入コスト × 100
              </code>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">主要な計算要素</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">営業効率改善による時間削減</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">成約率向上による売上増加</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">自動化による人件費削減</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">AI導入・運用コスト</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">トレーニング・導入期間</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">継続的な改善効果</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* セキュリティとプライバシー */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            セキュリティとプライバシー
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">データの取り扱い</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 入力データは外部に送信されません</li>
                <li>• ブラウザのローカルストレージに一時保存</li>
                <li>• 計算処理はクライアントサイドで実行</li>
                <li>• セッション終了時にデータは自動削除</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">セキュリティ対策</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• HTTPS通信による暗号化</li>
                <li>• XSS・CSRF攻撃対策</li>
                <li>• 定期的なセキュリティ監査</li>
                <li>• 最新のセキュリティ基準に準拠</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 対象ユーザー */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>こんな方におすすめ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h4 className="font-semibold mb-2">営業マネージャー</h4>
              <p className="text-sm text-muted-foreground">
                チームの生産性向上とAI導入効果を数値で把握したい方
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h4 className="font-semibold mb-2">経営陣</h4>
              <p className="text-sm text-muted-foreground">
                AI投資の意思決定に必要なROIデータを求める方
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h4 className="font-semibold mb-2">IT部門</h4>
              <p className="text-sm text-muted-foreground">
                AI導入プロジェクトの効果測定と予算計画を立てる方
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">今すぐROI計算を始めましょう</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          わずか数分の入力で、AI導入による営業効果とROIを可視化できます。
          無料でご利用いただけますので、お気軽にお試しください。
        </p>
        <Button asChild size="lg" className="flex items-center gap-2 mx-auto">
          <Link href="/calculator">
            <Calculator className="h-4 w-4" />
            ROI計算を開始
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
