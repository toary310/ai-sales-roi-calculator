/**
 * AI分析セクションコンポーネント
 *
 * このコンポーネントは、ROI計算結果に基づいてAIによる詳細な分析を提供します。
 * 分析結果には、投資効果の予測、リスク評価、改善提案などが含まれます。
 *
 * 主な機能:
 * - ROIデータに基づくAI分析の実行
 * - 分析結果の表示（信頼度レベル付き）
 * - ローディング状態の管理
 * - エラーハンドリング
 *
 * 表示セクション:
 * - 分析概要（リスク分析）
 * - 業界比較
 * - 推奨事項
 * - 市場トレンド
 * - 重要な洞察
 */

"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AIAnalysisResult } from '@/lib/ai/analysis-service'
import { ROIData } from '@/types'
import { AlertTriangle, Brain, Lightbulb, Target, TrendingUp, Zap } from "lucide-react"
import { useEffect, useState } from 'react'

/**
 * AIAnalysisSectionコンポーネントのプロパティ
 * @interface
 * @property {ROIData} roiData - ROI計算結果データ
 */
interface AIAnalysisSectionProps {
  roiData: ROIData
}

/**
 * AI分析セクションコンポーネントの実装
 *
 * @param props - コンポーネントのプロパティ
 * @param props.roiData - ROI計算結果データ
 * @returns {JSX.Element} AI分析結果を表示するコンポーネント
 */
export function AIAnalysisSection({ roiData }: AIAnalysisSectionProps) {
  // 状態管理
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ROIデータが変更されたら分析を実行
  useEffect(() => {
    generateAnalysis()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roiData]) // generateAnalysisは安定した関数なので依存関係に含めない

  /**
   * AI分析を実行する関数
   *
   * APIを呼び出してAI分析を実行し、結果を状態に保存します。
   * エラーハンドリングとパフォーマンス計測も行います。
   */
  const generateAnalysis = async () => {
    const startTime = Date.now()
    try {
      setLoading(true)
      setError(null)

      console.log('🎯 UI: AI分析リクエスト開始')

      // API呼び出し
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roiData),
      })

      if (!response.ok) {
        throw new Error(`分析生成に失敗しました: ${response.status}`)
      }

      const result = await response.json()
      const duration = Date.now() - startTime

      console.log('✅ UI: AI分析完了:', {
        duration: `${duration}ms`,
        confidenceLevel: result.confidenceLevel,
        hasRecommendations: result.recommendations?.length > 0,
        timestamp: new Date().toISOString()
      })

      setAnalysis(result)
    } catch (err) {
      const duration = Date.now() - startTime
      console.error('❌ UI: AI分析エラー:', {
        error: err instanceof Error ? err.message : 'Unknown error',
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      })
      setError(err instanceof Error ? err.message : '分析生成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  /**
   * 信頼度レベルに基づいて背景色を決定する関数
   *
   * @param {number} confidence - 信頼度レベル（0-100）
   * @returns {string} Tailwind CSSのカラークラス名
   */
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500'
    if (confidence >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  // ローディング中の表示
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[150px] w-full" />
      </div>
    )
  }

  // エラー時の表示
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    )
  }

  // 分析結果がない場合の表示
  if (!analysis) {
    return (
      <Alert>
        <AlertDescription>
          分析結果が見つかりません。
        </AlertDescription>
      </Alert>
    )
  }

  // 分析結果の表示
  return (
    <div className="space-y-6">
      {/* リスク分析カード */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            リスク分析
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Badge variant="outline" className={getConfidenceColor(analysis.confidenceLevel)}>
              信頼度: {analysis.confidenceLevel}%
            </Badge>
            分析生成日時: {new Date().toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {analysis.riskAnalysis}
          </p>
        </CardContent>
      </Card>

      {/* 業界比較カード */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            業界比較
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {analysis.industryComparison}
          </p>
        </CardContent>
      </Card>

      {/* 市場トレンドカード */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            市場トレンド
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {analysis.marketTrends}
          </p>
        </CardContent>
      </Card>

      {/* 重要な洞察カード */}
      {analysis.keyInsights && analysis.keyInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              重要な洞察
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {analysis.keyInsights.map((insight, index) => (
                <li key={index} className="text-muted-foreground">
                  {insight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 推奨事項カード */}
      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              推奨事項
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="text-muted-foreground">
                  {rec}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
