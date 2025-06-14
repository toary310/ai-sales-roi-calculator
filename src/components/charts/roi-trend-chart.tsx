"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MonthlyProjection } from "@/types/roi"
import { TrendingUp } from "lucide-react"
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"

interface ROITrendChartProps {
  data: MonthlyProjection[]
  title?: string
  description?: string
}

export function ROITrendChart({
  data,
  title = "ROI推移グラフ",
  description = "12ヶ月間のROI推移予測"
}: ROITrendChartProps) {
  // データを整形
  const chartData = data.map((item) => ({
    month: `${item.month}ヶ月目`,
    roi: item.cumulativeROI,
    savings: Math.round(item.cumulativeSavings / 10000), // 万円単位
    netBenefit: Math.round(item.netBenefit / 10000) // 万円単位
  }))

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-blue-600">
              <span className="font-medium">累積ROI:</span> {data.roi}%
            </p>
            <p className="text-green-600">
              <span className="font-medium">累積削減額:</span> {data.savings}万円
            </p>
            <p className="text-purple-600">
              <span className="font-medium">月間純利益:</span> {data.netBenefit}万円
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
          <TrendingUp className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="benefitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
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
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="roi"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#roiGradient)"
                name="累積ROI (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 凡例 */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>累積ROI (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>累積削減額 (万円)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>月間純利益 (万円)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
