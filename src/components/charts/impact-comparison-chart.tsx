"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPaybackPeriod } from "@/lib/utils/format-period"
import { ROICalculationResult } from "@/types/roi"
import { Target } from "lucide-react"
import {
    Cell,
    Pie,
    PieChart,
    RadialBar,
    RadialBarChart,
    ResponsiveContainer,
    Tooltip
} from "recharts"

interface ImpactComparisonChartProps {
  calculationResult: ROICalculationResult
  title?: string
  description?: string
}

export function ImpactComparisonChart({
  calculationResult,
  title = "効果比較ダッシュボード",
  description = "AI導入による各種効果の比較分析"
}: ImpactComparisonChartProps) {
  // 効果分析データ
  const impactData = [
    {
      name: "営業効率向上",
      value: Math.round(calculationResult.efficiencyGain),
      color: "#3b82f6",
      description: "営業プロセスの効率化"
    },
    {
      name: "売上増加",
      value: calculationResult.revenueIncrease,
      color: "#10b981",
      description: "売上の向上率"
    },
    {
      name: "時間削減",
      value: Math.round((calculationResult.timeReductionHours / (calculationResult.currentMetrics.monthlySales > 0 ? 160 : 1)) * 100),
      color: "#f59e0b",
      description: "作業時間の削減率"
    }
  ]

  // コスト分析データ
  const costData = [
    {
      name: "AI導入コスト",
      value: calculationResult.aiCosts.annualCost,
      color: "#ef4444"
    },
    {
      name: "削減コスト",
      value: calculationResult.totalSavings,
      color: "#10b981"
    }
  ]

  // ROI進捗データ
  const roiProgressData = [
    {
      name: "ROI",
      value: calculationResult.roi,
      fill: calculationResult.roi > 100 ? "#10b981" : calculationResult.roi > 50 ? "#f59e0b" : "#ef4444"
    }
  ]

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          {data.description && (
            <p className="text-sm text-gray-600">{data.description}</p>
          )}
          <p className="font-medium" style={{ color: data.color }}>
            {data.name && data.name.includes("コスト") ? `¥${data.value.toLocaleString()}` : `${data.value}%`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 効果分析円グラフ */}
          <div className="space-y-2">
            <h4 className="font-semibold text-center">効果分析</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={impactData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {impactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 text-xs">
              {impactData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* ROI進捗ゲージ */}
          <div className="space-y-2">
            <h4 className="font-semibold text-center">ROI進捗</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="90%"
                  data={roiProgressData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    fill={roiProgressData[0].fill}
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-bold"
                    fill={roiProgressData[0].fill}
                  >
                    {calculationResult.roi}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">投資収益率</p>
              <p className="text-xs text-muted-foreground">
                {calculationResult.roi > 100 ? "優秀" :
                 calculationResult.roi > 50 ? "良好" : "要改善"}
              </p>
            </div>
          </div>

          {/* コスト比較 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-center">コスト分析</h4>
            <div className="h-48 flex flex-col justify-center space-y-4">
              {costData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm font-semibold">
                      ¥{Math.round(item.value / 10000).toLocaleString()}万円
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: item.color,
                        width: `${Math.min((item.value / Math.max(...costData.map(d => d.value))) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center pt-2 border-t">
              <p className="text-sm font-medium">
                純利益: ¥{Math.round((calculationResult.totalSavings - calculationResult.aiCosts.annualCost) / 10000).toLocaleString()}万円
              </p>
              <p className="text-xs text-muted-foreground">
                投資回収期間: {formatPaybackPeriod(calculationResult.paybackPeriod)}
              </p>
            </div>
          </div>
        </div>

        {/* サマリー統計 */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(calculationResult.efficiencyGain)}%
              </p>
              <p className="text-xs text-muted-foreground">効率向上</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {calculationResult.revenueIncrease}%
              </p>
              <p className="text-xs text-muted-foreground">売上増加</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {calculationResult.timeReductionHours}h
              </p>
              <p className="text-xs text-muted-foreground">月間時間削減</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {formatPaybackPeriod(calculationResult.paybackPeriod)}
              </p>
              <p className="text-xs text-muted-foreground">投資回収期間</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
