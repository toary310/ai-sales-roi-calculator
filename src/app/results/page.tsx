/**
 * ROI計算結果表示ページ
 *
 * このページは以下の機能を提供します：
 * - ROI計算結果の詳細表示（ROI、投資回収期間、年間削減効果）
 * - 効果分析（営業効率向上、売上増加、コスト削減、時間削減）
 * - データビジュアライゼーション（ROI推移、効果比較、収益予測、コスト分析）
 * - AI分析結果の表示（リスク分析、業界比較、推奨事項）
 * - PDFレポートのダウンロード機能
 * - 離脱確認機能（意図しない結果消失を防止）
 */

"use client"

import { AIAnalysisSection } from "@/components/ai/ai-analysis-section"
import {
    CostAnalysisChart,
    ImpactComparisonChart,
    ROITrendChart,
    RevenueForecastChart
} from "@/components/charts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MintNftButton } from "@/components/ui/mint-nft-button"
import { useROIStore } from "@/lib/store/roi-store"
import { formatPaybackPeriod } from "@/lib/utils/format-period"
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
import { useRouter } from "next/navigation"
import React from "react"

/**
 * ROI計算結果表示ページのメインコンポーネント
 */
export default function ResultsPage() {
  // Zustandストアから計算結果とフォームデータを取得
  const { calculationResult, formData, clearResults } = useROIStore()

  // PDFレポート生成の状態管理
  const [isGeneratingReport, setIsGeneratingReport] = React.useState(false)

  // AI分析セクションの再レンダリング制御用キー
  const [aiAnalysisKey, setAiAnalysisKey] = React.useState(0)

  // Next.jsのルーター（ページ遷移用）
  const router = useRouter()

  // ページ遷移時にAI分析をリセット（新しい計算結果に対応）
  React.useEffect(() => {
    // 新しい計算結果が来た時にAI分析をリセット
    setAiAnalysisKey(prev => prev + 1)
  }, [calculationResult])

  // ページマウント時にもリセット（ブラウザバック等の対応）
  React.useEffect(() => {
    setAiAnalysisKey(Date.now())
  }, [])

  // 離脱確認機能
  React.useEffect(() => {
    if (!calculationResult) return

    const confirmMessage = '計算結果が失われます。このページを離れてもよろしいですか？\n\n「OK」を押すと結果が削除され、他のページに移動します。'

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // モダンブラウザでは returnValue の設定が必要
      e.preventDefault()
      e.returnValue = confirmMessage
      return confirmMessage
    }

    // ブラウザの戻る/進むボタン対応
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [calculationResult])

  const handleDownloadReport = async () => {
    if (!calculationResult || !formData) {
      alert('計算結果がありません。')
      return
    }

    try {
      setIsGeneratingReport(true)

      // ROIData型に変換（CSVジェネレーターが期待する形式）
      const roiData = {
        ...calculationResult,
        industry: formData.industry,
        companySize: formData.companySize,
        aiToolType: formData.aiToolType,
        annualNetProfit: calculationResult.totalSavings - calculationResult.aiCosts.annualCost,
        currentMetrics: {
          ...calculationResult.currentMetrics,
          salesTeamSize: formData.salesTeamSize,
          salesCost: formData.salesCost,
          averageDealSize: formData.averageDealSize,
          conversionRate: formData.conversionRate,
          salesCycleLength: formData.salesCycleLength
        }
      }

      // AI分析結果を取得（もしあれば）
      let aiAnalysis = null
      try {
        const response = await fetch('/api/ai-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roiData),
        })
        if (response.ok) {
          aiAnalysis = await response.json()
        }
      } catch (error) {
        console.log('AI分析の取得をスキップ:', error)
      }

      // PDFレポート生成
      const { PDFReportGenerator } = await import('@/lib/report/pdf-generator')
      await PDFReportGenerator.generateReport(calculationResult, aiAnalysis)
    } catch (error) {
      console.error('PDFレポート生成エラー:', error)
      alert('PDFレポートの生成に失敗しました。もう一度お試しください。')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  // ナビゲーション確認機能
  const handleNavigation = (href: string) => {
    if (calculationResult) {
      const confirmed = window.confirm(
        '計算結果が失われます。このページを離れてもよろしいですか？\n\n「OK」を押すと結果が削除され、他のページに移動します。'
      )
      if (confirmed) {
        clearResults()
        router.push(href)
      }
    } else {
      router.push(href)
    }
  }

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
              {formatPaybackPeriod(calculationResult.paybackPeriod)}
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

        {/* ROI推移グラフ */}
        <ROITrendChart data={calculationResult.monthlyProjection} />
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
                  <span className="text-muted-foreground">平均取引額:</span>
                  <span>¥{formData.averageDealSize.toLocaleString()}</span>
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
                  <span className="font-bold text-blue-600">{formatPaybackPeriod(calculationResult.paybackPeriod)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* データビジュアライゼーション */}
      <div className="space-y-8 mb-12">
        {/* 効果比較ダッシュボード */}
        <ImpactComparisonChart calculationResult={calculationResult} />

        {/* 収益予測と コスト分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevenueForecastChart
            data={calculationResult.monthlyProjection}
            currentSales={calculationResult.currentMetrics.monthlySales}
          />
          <CostAnalysisChart data={calculationResult.monthlyProjection} />
        </div>
      </div>

      {/* AI分析セクション */}
      <AIAnalysisSection
        key={aiAnalysisKey}
        roiData={{
        ...calculationResult,
        industry: formData.industry,
        companySize: formData.companySize,
        aiToolType: formData.aiToolType,
        annualNetProfit: calculationResult.totalSavings - calculationResult.aiCosts.annualCost,
        currentMetrics: {
          ...calculationResult.currentMetrics,
          salesTeamSize: formData.salesTeamSize,
          salesCost: formData.salesCost,
          averageDealSize: formData.averageDealSize,
          conversionRate: formData.conversionRate,
          salesCycleLength: formData.salesCycleLength
        }
      }} />

      {/* アクションボタン - フッターとAI分析の間の中央配置 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center my-8">
        <MintNftButton />
        <Button
          size="lg"
          className="flex items-center gap-2"
          onClick={handleDownloadReport}
          disabled={isGeneratingReport}
        >
          <Download className="h-4 w-4" />
          {isGeneratingReport ? 'PDFレポート生成中...' : 'PDFレポートをダウンロード'}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => handleNavigation('/calculator')}
          className="flex items-center gap-2"
        >
          <Calculator className="h-4 w-4" />
          条件を変更して再計算
        </Button>
      </div>
    </div>
  )
}
