/**
 * フォーム入力データの型定義
 * ユーザーがROI計算フォームで入力する全ての情報を含む
 */
export interface ROIFormData {
  // 現在の営業データ（企業の現状を表す指標）
  salesTeamSize: number        // 営業担当者数（人）
  monthlySales: number         // 月間売上（円）
  salesCost: number           // 月間営業コスト（円）
  averageDealSize: number     // 平均取引額（円）
  conversionRate: number      // 成約率（%）
  salesCycleLength: number    // 営業サイクル長（日）

  // AI導入計画（導入予定のAIツールに関する情報）
  aiToolType: string          // AIツールの種類（CRM、SFA等）
  initialCost: number         // 初期導入費用（円）
  monthlyCost: number         // 月額運用費用（円）
  implementationPeriod: number // 導入完了までの期間（ヶ月）

  // 期待効果（AI導入による改善効果の予測値）
  efficiencyImprovement: number[]   // 営業効率向上率（%）
  conversionImprovement: number[]   // 成約率改善率（%）
  timeReduction: number[]          // 時間削減率（%）

  // その他の企業情報
  industry: string            // 業界（technology, finance等）
  companySize: string         // 企業規模（startup, small, medium等）
  hasExistingCrm: boolean     // 既存CRMの有無
  additionalNotes?: string | undefined  // 追加メモ（オプション）
}

/**
 * ROI計算結果の型定義
 * ROI計算エンジンが出力する全ての計算結果を含む
 */
export interface ROICalculationResult {
  // 基本ROI指標（最も重要な3つの指標）
  roi: number                    // ROI（投資収益率）(%)
  paybackPeriod: number          // 投資回収期間（ヶ月）
  totalSavings: number           // 年間総効果（AIコスト差し引き前）（円）
  monthlySavings: number         // 月間純削減額（AIコスト差し引き後）（円）

  // 効果分析（AI導入による具体的な改善効果）
  efficiencyGain: number         // 営業効率向上率 (%)
  revenueIncrease: number        // 売上増加率 (%)
  costReduction: number          // コスト削減額（円）
  timeReductionHours: number     // 削減時間（時間/月）

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
