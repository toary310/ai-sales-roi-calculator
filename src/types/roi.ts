// フォーム入力データの型
export interface ROIFormData {
  // 現在の営業データ
  salesTeamSize: number
  monthlySales: number
  salesCost: number
  averageDealSize: number
  conversionRate: number
  salesCycleLength: number

  // AI導入計画
  aiToolType: string
  initialCost: number
  monthlyCost: number
  implementationPeriod: number

  // 期待効果
  efficiencyImprovement: number[]
  conversionImprovement: number[]
  timeReduction: number[]

  // その他
  industry: string
  companySize: string
  hasExistingCrm: boolean
  additionalNotes?: string | undefined
}

// 計算結果の型
export interface ROICalculationResult {
  // 基本ROI指標
  roi: number // ROI (%)
  paybackPeriod: number // 投資回収期間（ヶ月）
  totalSavings: number // 年間総効果（AIコスト差し引き前）
  monthlySavings: number // 月間純削減額（AIコスト差し引き後）

  // 効果分析
  efficiencyGain: number // 営業効率向上率 (%)
  revenueIncrease: number // 売上増加率 (%)
  costReduction: number // コスト削減額
  timeReductionHours: number // 削減時間（時間/月）

  // 詳細データ
  currentMetrics: {
    monthlySales: number
    monthlyCost: number
    dealsPerMonth: number
    salesPerPerson: number
  }

  projectedMetrics: {
    monthlySales: number
    monthlyCost: number
    dealsPerMonth: number
    salesPerPerson: number
  }

  // AI導入コスト
  aiCosts: {
    initialCost: number
    monthlyCost: number
    annualCost: number
    totalCostYear1: number
  }

  // 月別推移データ（12ヶ月）
  monthlyProjection: MonthlyProjection[]

  // 計算に使用したパラメータ
  calculationParams: {
    efficiencyImprovement: number
    conversionImprovement: number
    timeReduction: number
    implementationPeriod: number
  }
}

// 月別推移データ
export interface MonthlyProjection {
  month: number
  sales: number
  costs: number
  aiCosts: number
  grossBenefit: number
  netBenefit: number
  cumulativeROI: number
  cumulativeSavings: number
}

// 業界別ベンチマーク
export interface IndustryBenchmark {
  industry: string
  averageConversionRate: number
  averageDealSize: number
  averageSalesCycle: number
  aiAdoptionRate: number
  expectedEfficiencyGain: number
}

// 会社規模別係数
export interface CompanySizeMultiplier {
  size: string
  efficiencyMultiplier: number
  costMultiplier: number
  implementationMultiplier: number
}

// AI分析用のROIデータ型（ROICalculationResultの拡張）
export interface ROIData extends ROICalculationResult {
  // フォームデータからの追加情報（重複排除済み）
  industry?: string
  companySize?: string
  aiToolType?: string

  // 計算結果の追加フィールド
  annualNetProfit?: number

  // 現在のメトリクスの拡張
  currentMetrics: {
    monthlySales: number
    monthlyCost: number
    dealsPerMonth: number
    salesPerPerson: number
    salesTeamSize?: number
    salesCost?: number
    averageDealSize?: number
    conversionRate?: number
    salesCycleLength?: number
  }
}
