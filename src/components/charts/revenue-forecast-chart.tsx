"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthlyProjection } from "@/types/roi"
import { BarChart3 } from "lucide-react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"

interface RevenueForecastChartProps {
  data: MonthlyProjection[]
  currentSales: number
  title?: string
  description?: string
}

export function RevenueForecastChart({
  data,
  currentSales,
  title = "月別収益予測",
  description = "AI導入前後の売上比較"
}: RevenueForecastChartProps) {
  // データを整形
  const chartData = data.map((item) => ({
    month: `${item.month}月`,
    currentSales: Math.round(currentSales / 10000), // 万円単位
    projectedSales: Math.round(item.sales / 10000), // 万円単位
    improvement: Math.round((item.sales - currentSales) / 10000), // 改善額
    costs: Math.round(item.costs / 10000), // コスト
    aiCosts: Math.round(item.aiCosts / 10000) // AIコスト
  }))

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-gray-600">
              <span className="font-medium">現在の売上:</span> {data.currentSales}万円
            </p>
            <p className="text-blue-600">
              <span className="font-medium">予測売上:</span> {data.projectedSales}万円
            </p>
            <p className="text-green-600">
              <span className="font-medium">売上改善:</span> +{data.improvement}万円
            </p>
            <p className="text-orange-600">
              <span className="font-medium">営業コスト:</span> {data.costs}万円
            </p>
            <p className="text-red-600">
              <span className="font-medium">AIコスト:</span> {data.aiCosts}万円
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                className="text-xs"
                tick={{ fontSize: 12 }}
                label={{ value: '万円', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="currentSales"
                fill="#94a3b8"
                name="現在の売上"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="projectedSales"
                fill="#3b82f6"
                name="予測売上"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 凡例と統計 */}
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-400 rounded"></div>
              <span>現在の売上</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>AI導入後予測売上</span>
            </div>
          </div>

          {/* 統計サマリー */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">平均売上改善</p>
              <p className="text-lg font-semibold text-green-600">
                +{Math.round(chartData.reduce((sum, item) => sum + item.improvement, 0) / chartData.length)}万円
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">最大売上</p>
              <p className="text-lg font-semibold text-blue-600">
                {Math.max(...chartData.map(item => item.projectedSales))}万円
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">年間改善額</p>
              <p className="text-lg font-semibold text-green-600">
                +{Math.round(chartData.reduce((sum, item) => sum + item.improvement, 0))}万円
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">改善率</p>
              <p className="text-lg font-semibold text-purple-600">
                {Math.round((chartData[chartData.length - 1].projectedSales / chartData[0].currentSales - 1) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
