"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthlyProjection } from "@/types/roi"
import { DollarSign } from "lucide-react"
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"

interface CostAnalysisChartProps {
  data: MonthlyProjection[]
  title?: string
  description?: string
}

export function CostAnalysisChart({
  data,
  title = "コスト分析",
  description = "AI導入コストと削減効果の推移"
}: CostAnalysisChartProps) {
  // データを整形
  const chartData = data.map((item, index) => ({
    month: `${item.month}ヶ月目`,
    aiCosts: Math.round(item.aiCosts / 10000), // 万円単位
    operationalCosts: Math.round(item.costs / 10000), // 万円単位
    cumulativeAICosts: Math.round(((index + 1) * item.aiCosts) / 10000), // 累積AIコスト
    cumulativeSavings: Math.round(item.cumulativeSavings / 10000), // 累積削減額
    netBenefit: Math.round(item.netBenefit / 10000), // 純利益
    breakEven: item.cumulativeSavings >= ((index + 1) * item.aiCosts) // 損益分岐点
  }))

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-red-600">
              <span className="font-medium">AIコスト:</span> ¥{data.aiCosts.toLocaleString()}万円/月
            </p>
            <p className="text-blue-600">
              <span className="font-medium">運営コスト:</span> ¥{data.operationalCosts.toLocaleString()}万円/月
            </p>
            <p className="text-orange-600">
              <span className="font-medium">累積AIコスト:</span> ¥{data.cumulativeAICosts.toLocaleString()}万円
            </p>
            <p className="text-green-600">
              <span className="font-medium">累積削減額:</span> ¥{data.cumulativeSavings.toLocaleString()}万円
            </p>
            <p className={`font-semibold ${data.netBenefit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span className="font-medium">純利益:</span> {data.netBenefit >= 0 ? '+' : ''}¥{data.netBenefit.toLocaleString()}万円
            </p>
            {data.breakEven && (
              <p className="text-purple-600 font-semibold">
                ✓ 損益分岐点到達
              </p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  // 損益分岐点を見つける
  const breakEvenMonth = chartData.findIndex(item => item.breakEven) + 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="benefitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
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
              <Area
                type="monotone"
                dataKey="cumulativeAICosts"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#costGradient)"
                name="累積AIコスト"
              />
              <Area
                type="monotone"
                dataKey="cumulativeSavings"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#savingsGradient)"
                name="累積削減額"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 分析サマリー */}
        <div className="mt-4 space-y-4">
          {/* 凡例 */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>累積AIコスト</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>累積削減額</span>
            </div>
          </div>

          {/* 重要指標 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">損益分岐点</p>
              <p className="text-lg font-semibold text-purple-600">
                {breakEvenMonth > 0 ? `${breakEvenMonth}ヶ月目` : '12ヶ月以降'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">年間AIコスト</p>
              <p className="text-lg font-semibold text-red-600">
                {(chartData[0]?.aiCosts * 12 || 0).toLocaleString()}万円
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">年間削減額</p>
              <p className="text-lg font-semibold text-green-600">
                {(chartData[chartData.length - 1]?.cumulativeSavings || 0).toLocaleString()}万円
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">年間純利益</p>
              <p className={`text-lg font-semibold ${
                chartData[chartData.length - 1]?.netBenefit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {chartData[chartData.length - 1]?.netBenefit >= 0 ? '+' : ''}
                {chartData.reduce((sum, item) => sum + item.netBenefit, 0).toLocaleString()}万円
              </p>
            </div>
          </div>

          {/* 損益分岐点の説明 */}
          {breakEvenMonth > 0 && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>損益分岐点:</strong> {breakEvenMonth}ヶ月目に累積削減額が累積AIコストを上回り、投資が回収されます。
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
