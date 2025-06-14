"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useROIStore } from "@/lib/store/roi-store"
import {
    AlertCircle,
    ArrowUp,
    BarChart3,
    Calculator,
    DollarSign,
    Download,
    Percent,
    TrendingUp
} from "lucide-react"
import Link from "next/link"

export default function ResultsPage() {
  const { calculationResult, formData, clearResults } = useROIStore()

  // 計算結果がない場合の処理
  if (!calculationResult || !formData) {
    return (
      <div className="container py-8 md:py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <AlertCircle className="h-24 w-24 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">計算結果がありません</h1>
          <p className="text-muted-foreground mb-8">
            ROI計算を実行してから結果ページにアクセスしてください。
          </p>
          <Button asChild size="lg">
            <Link href="/calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              ROI計算を開始
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      {/* ページヘッダー */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <BarChart3 className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          ROI計算結果
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          AI導入による営業効果とROIの分析結果をご確認ください
        </p>
      </div>

      {/* メインROI指標 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Percent className="h-6 w-6 text-green-600" />
              {calculationResult.roi}%
            </CardTitle>
            <CardDescription>ROI (投資収益率)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              12ヶ月間での投資収益率
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              {calculationResult.paybackPeriod}ヶ月
            </CardTitle>
            <CardDescription>投資回収期間</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              初期投資を回収するまでの期間
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <DollarSign className="h-6 w-6 text-green-600" />
              ¥{calculationResult.totalSavings.toLocaleString()}
            </CardTitle>
            <CardDescription>年間コスト削減効果</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              AI導入による年間の総削減額
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 詳細分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* 効果分析 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              効果分析
            </CardTitle>
            <CardDescription>AI導入による具体的な改善効果</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="font-medium">営業効率向上</span>
              </div>
              <span className="text-green-600 font-bold">{Math.round(calculationResult.efficiencyGain)}%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-blue-600" />
                <span className="font-medium">売上増加</span>
              </div>
              <span className="text-blue-600 font-bold">{calculationResult.revenueIncrease}%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <span className="font-medium">月間コスト削減</span>
              </div>
              <span className="text-purple-600 font-bold">¥{Math.round(calculationResult.monthlySavings).toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="font-medium">時間削減</span>
              </div>
              <span className="text-orange-600 font-bold">{calculationResult.timeReductionHours}時間/月</span>
            </div>
          </CardContent>
        </Card>

        {/* グラフエリア（プレースホルダー） */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              ROI推移グラフ
            </CardTitle>
            <CardDescription>12ヶ月間のROI推移予測</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  グラフコンポーネント
                  <br />
                  (Chart.js / Recharts)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 詳細データ */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle>詳細データ</CardTitle>
          <CardDescription>計算に使用されたデータと詳細な分析結果</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-3">入力データ</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">営業担当者数:</span>
                  <span>{formData.salesTeamSize}名</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">月間売上:</span>
                  <span>¥{formData.monthlySales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">営業コスト:</span>
                  <span>¥{formData.salesCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI初期費用:</span>
                  <span>¥{formData.initialCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">AI月額費用:</span>
                  <span>¥{formData.monthlyCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">計算結果</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">現在の月間売上:</span>
                  <span>¥{calculationResult.currentMetrics.monthlySales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">予測月間売上:</span>
                  <span>¥{Math.round(calculationResult.projectedMetrics.monthlySales).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">月間削減額:</span>
                  <span>¥{Math.round(calculationResult.monthlySavings).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">年間ROI:</span>
                  <span className="font-bold text-green-600">{calculationResult.roi}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">投資回収期間:</span>
                  <span className="font-bold text-blue-600">{calculationResult.paybackPeriod}ヶ月</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* アクションボタン */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          レポートをダウンロード
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            条件を変更して再計算
          </Link>
        </Button>
      </div>
    </div>
  )
}
