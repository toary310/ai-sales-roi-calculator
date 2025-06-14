"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Zap } from "lucide-react"
import { ROIData } from '@/types/roi'
import { AIAnalysisResult } from '@/lib/ai/analysis-service'

interface AIAnalysisSectionProps {
  roiData: ROIData
}

export function AIAnalysisSection({ roiData }: AIAnalysisSectionProps) {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateAnalysis()
  }, [roiData])

  const generateAnalysis = async () => {
    try {
      setLoading(true)
      setError(null)

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
      setAnalysis(result)
    } catch (err) {
      console.error('AI分析エラー:', err)
      setError(err instanceof Error ? err.message : '分析生成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500'
    if (confidence >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return '高信頼度'
    if (confidence >= 60) return '中信頼度'
    return '低信頼度'
  }

  if (loading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <CardTitle>🤖 AI専門分析</CardTitle>
          </div>
          <CardDescription>
            AIがあなたのROI計算結果を分析しています...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <CardTitle>🤖 AI専門分析</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              AI分析の生成中にエラーが発生しました: {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) return null

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <CardTitle>🤖 AI専門分析</CardTitle>
          </div>
          <Badge 
            variant="secondary" 
            className={`${getConfidenceColor(analysis.confidenceLevel)} text-white`}
          >
            {getConfidenceText(analysis.confidenceLevel)} ({analysis.confidenceLevel}%)
          </Badge>
        </div>
        <CardDescription>
          AIがあなたのROI計算結果を多角的に分析し、専門的な洞察を提供します
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* リスク分析 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold">リスク分析</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.riskAnalysis}
            </p>
          </div>

          {/* 業界比較 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">業界比較</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.industryComparison}
            </p>
          </div>

          {/* 市場トレンド */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">市場トレンド</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.marketTrends}
            </p>
          </div>

          {/* 重要な洞察 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold">重要な洞察</h3>
            </div>
            <ul className="space-y-1">
              {analysis.keyInsights.map((insight, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 推奨事項 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">AI推奨事項</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {analysis.recommendations.map((recommendation, index) => (
              <Card key={index} className="p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  {recommendation}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
