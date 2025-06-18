import { CompanySizeMultiplier, IndustryBenchmark, MonthlyProjection, ROICalculationResult, ROIFormData } from '@/types/roi'

// 業界別ベンチマークデータ
const INDUSTRY_BENCHMARKS: Record<string, IndustryBenchmark> = {
  technology: {
    industry: 'IT・テクノロジー',
    averageConversionRate: 25,
    averageDealSize: 800000,
    averageSalesCycle: 45,
    aiAdoptionRate: 0.8,
    expectedEfficiencyGain: 35
  },
  manufacturing: {
    industry: '製造業',
    averageConversionRate: 18,
    averageDealSize: 1200000,
    averageSalesCycle: 60,
    aiAdoptionRate: 0.6,
    expectedEfficiencyGain: 28
  },
  finance: {
    industry: '金融・保険',
    averageConversionRate: 22,
    averageDealSize: 600000,
    averageSalesCycle: 35,
    aiAdoptionRate: 0.7,
    expectedEfficiencyGain: 32
  },
  healthcare: {
    industry: '医療・ヘルスケア',
    averageConversionRate: 20,
    averageDealSize: 900000,
    averageSalesCycle: 50,
    aiAdoptionRate: 0.5,
    expectedEfficiencyGain: 25
  },
  retail: {
    industry: '小売・EC',
    averageConversionRate: 15,
    averageDealSize: 300000,
    averageSalesCycle: 25,
    aiAdoptionRate: 0.9,
    expectedEfficiencyGain: 40
  },
  other: {
    industry: 'その他',
    averageConversionRate: 20,
    averageDealSize: 500000,
    averageSalesCycle: 40,
    aiAdoptionRate: 0.6,
    expectedEfficiencyGain: 30
  }
}

// 会社規模別係数
const COMPANY_SIZE_MULTIPLIERS: Record<string, CompanySizeMultiplier> = {
  startup: {
    size: 'スタートアップ',
    efficiencyMultiplier: 1.2,
    costMultiplier: 0.8,
    implementationMultiplier: 0.5
  },
  small: {
    size: '小企業',
    efficiencyMultiplier: 1.1,
    costMultiplier: 0.9,
    implementationMultiplier: 0.7
  },
  medium: {
    size: '中企業',
    efficiencyMultiplier: 1.0,
    costMultiplier: 1.0,
    implementationMultiplier: 1.0
  },
  large: {
    size: '大企業',
    efficiencyMultiplier: 0.9,
    costMultiplier: 1.1,
    implementationMultiplier: 1.3
  },
  enterprise: {
    size: '大手企業',
    efficiencyMultiplier: 0.8,
    costMultiplier: 1.2,
    implementationMultiplier: 1.5
  }
}

export class ROICalculator {
  private formData: ROIFormData
  private industryBenchmark: IndustryBenchmark
  private sizeMultiplier: CompanySizeMultiplier

  constructor(formData: ROIFormData) {
    this.formData = this.validateAndNormalizeFormData(formData)
    this.industryBenchmark = INDUSTRY_BENCHMARKS[formData.industry] ?? INDUSTRY_BENCHMARKS.other!
    this.sizeMultiplier = COMPANY_SIZE_MULTIPLIERS[formData.companySize] ?? COMPANY_SIZE_MULTIPLIERS.medium!
  }

  // 入力データの妥当性検証と正規化
  private validateAndNormalizeFormData(formData: ROIFormData): ROIFormData {
    const normalized = { ...formData }

    // 営業チーム規模の妥当性チェック
    if (normalized.salesTeamSize < 1 || normalized.salesTeamSize > 10000) {
      console.warn(`営業チーム規模が異常値です: ${normalized.salesTeamSize}人`)
      normalized.salesTeamSize = Math.max(1, Math.min(normalized.salesTeamSize, 10000))
    }

    // 売上とコストの妥当性チェック
    if (normalized.salesCost > normalized.monthlySales * 0.8) {
      console.warn(`営業コストが売上の80%を超えています: ${normalized.salesCost}円`)
      normalized.salesCost = normalized.monthlySales * 0.8
    }

    // 成約率の妥当性チェック（0.1% - 80%の範囲）
    if (normalized.conversionRate < 0.1 || normalized.conversionRate > 80) {
      console.warn(`成約率が異常値です: ${normalized.conversionRate}%`)
      normalized.conversionRate = Math.max(0.1, Math.min(normalized.conversionRate, 80))
    }

    // 平均取引額の妥当性チェック
    const estimatedDeals = normalized.monthlySales / normalized.averageDealSize
    if (estimatedDeals < 0.1 || estimatedDeals > 10000) {
      console.warn(`平均取引額から算出される月間取引数が異常です: ${estimatedDeals}件`)
      normalized.averageDealSize = normalized.monthlySales / Math.max(1, Math.min(estimatedDeals, 1000))
    }

    // AI改善率の妥当性チェック
    normalized.efficiencyImprovement = normalized.efficiencyImprovement.map(val =>
      Math.max(0, Math.min(val, 100))
    )
    normalized.conversionImprovement = normalized.conversionImprovement.map(val =>
      Math.max(0, Math.min(val, 100))
    )
    normalized.timeReduction = normalized.timeReduction.map(val =>
      Math.max(0, Math.min(val, 90))
    )

    return normalized
  }

  // メイン計算メソッド
  calculate(): ROICalculationResult {
    const currentMetrics = this.calculateCurrentMetrics()
    const projectedMetrics = this.calculateProjectedMetrics(currentMetrics)
    const aiCosts = this.calculateAICosts()
    const monthlyProjection = this.calculateMonthlyProjection(currentMetrics, projectedMetrics, aiCosts)

    // 月間削減額の計算（AIコストを差し引いた実質的な削減額）
    const monthlyBenefit = projectedMetrics.monthlySales - currentMetrics.monthlySales +
                          (currentMetrics.monthlyCost - projectedMetrics.monthlyCost)
    const monthlySavings = monthlyBenefit - aiCosts.monthlyCost // AIコストを差し引く

    const totalSavings = monthlyBenefit * 12 // 年間総効果（AIコスト差し引き前）
    const annualNetSavings = monthlySavings * 12 // 年間純削減額（AIコスト差し引き後）
    const roi = this.calculateROI(totalSavings, aiCosts.totalCostYear1) // 修正: 総効果を使用
    const paybackPeriod = this.calculatePaybackPeriod(aiCosts.totalCostYear1, monthlySavings)

    return {
      roi,
      paybackPeriod,
      totalSavings,
      monthlySavings,
      efficiencyGain: (this.formData.efficiencyImprovement?.[0] || 0),
      revenueIncrease: this.calculateRevenueIncrease(currentMetrics, projectedMetrics),
      costReduction: currentMetrics.monthlyCost - projectedMetrics.monthlyCost,
      timeReductionHours: this.calculateTimeReduction(),
      currentMetrics,
      projectedMetrics,
      aiCosts,
      monthlyProjection,
      calculationParams: {
        efficiencyImprovement: this.formData.efficiencyImprovement?.[0] || 0,
        conversionImprovement: this.formData.conversionImprovement?.[0] || 0,
        timeReduction: this.formData.timeReduction?.[0] || 0,
        implementationPeriod: this.formData.implementationPeriod
      }
    }
  }

  // 現在の営業指標を計算
  private calculateCurrentMetrics() {
    // ゼロ除算を防ぐためのチェック（計算用の最小値設定）
    const averageDealSize = Math.max(this.formData.averageDealSize || 1, 1) // 最小値1
    const salesTeamSize = Math.max(this.formData.salesTeamSize || 1, 1) // 最小値1人

    const dealsPerMonth = this.formData.monthlySales / averageDealSize
    const salesPerPerson = this.formData.monthlySales / salesTeamSize

    return {
      monthlySales: this.formData.monthlySales,
      monthlyCost: this.formData.salesCost,
      dealsPerMonth,
      salesPerPerson
    }
  }

  // AI導入後の予測指標を計算
  private calculateProjectedMetrics(currentMetrics: ReturnType<typeof this.calculateCurrentMetrics>) {
    // 業界ベンチマークを考慮した改善率計算
    const baseEfficiencyGain = this.formData.efficiencyImprovement?.[0] || 0
    const baseConversionImprovement = this.formData.conversionImprovement?.[0] || 0
    const baseTimeReduction = this.formData.timeReduction?.[0] || 0

    // 会社規模係数を適切に適用（改善率の種類に応じて）
    const efficiencyGain = baseEfficiencyGain * this.sizeMultiplier.efficiencyMultiplier / 100
    const conversionImprovement = baseConversionImprovement / 100 // 成約率改善は規模係数を適用しない
    const timeReduction = baseTimeReduction * this.sizeMultiplier.efficiencyMultiplier / 100

    // 業界ベンチマークとの比較による現実性チェック
    const industryConversionRate = this.industryBenchmark.averageConversionRate / 100
    const currentConversionRate = Math.max(
      (this.formData.conversionRate || this.industryBenchmark.averageConversionRate) / 100,
      industryConversionRate * 0.3 // 業界平均の30%を最小値とする
    )

    // 成約率向上による売上増加（業界ベンチマーク考慮）
    const maxReasonableConversionRate = industryConversionRate * 1.5 // 業界平均の150%を上限
    const improvedConversionRate = Math.min(
      currentConversionRate * (1 + conversionImprovement),
      maxReasonableConversionRate
    )
    const conversionMultiplier = improvedConversionRate / currentConversionRate

    // 効率向上による処理能力増加
    const efficiencyMultiplier = 1 + efficiencyGain

    const projectedMonthlySales = currentMetrics.monthlySales * conversionMultiplier * efficiencyMultiplier
    const projectedDealsPerMonth = currentMetrics.dealsPerMonth * conversionMultiplier * efficiencyMultiplier

    // コスト削減（時間削減による人件費削減）
    // 業界・会社規模に応じた人件費比率を動的計算
    const laborCostRatio = this.calculateLaborCostRatio()
    const costReductionFromTimeReduction = currentMetrics.monthlyCost * timeReduction * laborCostRatio
    const projectedMonthlyCost = currentMetrics.monthlyCost - costReductionFromTimeReduction

    return {
      monthlySales: projectedMonthlySales,
      monthlyCost: projectedMonthlyCost,
      dealsPerMonth: projectedDealsPerMonth,
      salesPerPerson: projectedMonthlySales / Math.max(this.formData.salesTeamSize || 1, 1)
    }
  }

  // AI導入コストを計算
  private calculateAICosts() {
    const adjustedInitialCost = this.formData.initialCost * this.sizeMultiplier.costMultiplier
    const adjustedMonthlyCost = this.formData.monthlyCost * this.sizeMultiplier.costMultiplier
    const annualCost = adjustedMonthlyCost * 12
    const totalCostYear1 = adjustedInitialCost + annualCost

    return {
      initialCost: adjustedInitialCost,
      monthlyCost: adjustedMonthlyCost,
      annualCost,
      totalCostYear1
    }
  }

  // ROIを計算
  private calculateROI(totalBenefit: number, totalCost: number): number {
    if (totalCost === 0) return 0
    return Math.round(((totalBenefit - totalCost) / totalCost) * 100)
  }

  // 投資回収期間を計算（ヶ月）
  private calculatePaybackPeriod(totalCost: number, monthlySavings: number): number {
    if (monthlySavings <= 0) return 999 // 回収不可能
    if (totalCost <= 0) return 0 // コストがない場合は即座に回収

    const paybackMonths = Math.ceil(totalCost / monthlySavings)

    // 異常に長い期間の場合は999に制限
    if (paybackMonths > 999) return 999

    return paybackMonths
  }

  // 売上増加率を計算
  private calculateRevenueIncrease(
    currentMetrics: ReturnType<typeof this.calculateCurrentMetrics>,
    projectedMetrics: ReturnType<typeof this.calculateProjectedMetrics>
  ): number {
    const currentSales = currentMetrics.monthlySales

    // 現在の売上が0の場合は、新規売上創出として扱う
    if (currentSales === 0) {
      // 予測売上がある場合は、それを売上創出効果として表現
      return projectedMetrics.monthlySales > 0 ? 100 : 0 // 100%は新規売上創出を意味
    }

    return Math.round(((projectedMetrics.monthlySales - currentSales) / currentSales) * 100)
  }

  // 業界・会社規模に応じた人件費比率を計算
  private calculateLaborCostRatio(): number {
    // 業界別基準人件費比率
    const industryLaborRatios: Record<string, number> = {
      technology: 0.65,      // IT業界は人件費比率が高い
      manufacturing: 0.45,   // 製造業は設備費が多い
      finance: 0.70,         // 金融は人件費中心
      healthcare: 0.60,      // 医療は人件費とシステム費
      retail: 0.50,          // 小売は人件費と物流費
      other: 0.55            // その他の平均
    }

    // 会社規模による調整
    const sizeAdjustments: Record<string, number> = {
      startup: 0.8,      // スタートアップは人件費比率が高い
      small: 0.9,        // 小企業も人件費中心
      medium: 1.0,       // 中企業は標準
      large: 1.1,        // 大企業は若干高い
      enterprise: 1.2    // 大手企業は管理費も含む
    }

    const baseRatio = industryLaborRatios[this.formData.industry] ?? industryLaborRatios.other!
    const sizeAdjustment = sizeAdjustments[this.formData.companySize] ?? sizeAdjustments.medium!

    return Math.min(baseRatio * sizeAdjustment, 0.85) // 最大85%に制限
  }

  // 時間削減量を計算（時間/月）
  private calculateTimeReduction(): number {
    const timeReductionRate = (this.formData.timeReduction?.[0] || 0) / 100

    // 業界・会社規模に応じた実労働時間を計算
    const baseWorkingHours = this.calculateRealWorkingHours()
    const workingHoursPerMonth = Math.max(this.formData.salesTeamSize || 1, 1) * baseWorkingHours

    return Math.round(workingHoursPerMonth * timeReductionRate)
  }

  // 実労働時間を業界・会社規模に応じて計算
  private calculateRealWorkingHours(): number {
    // 業界別基準労働時間（月間）
    const industryWorkingHours: Record<string, number> = {
      technology: 180,     // IT業界は長時間労働傾向
      manufacturing: 170,  // 製造業は標準的
      finance: 175,        // 金融は若干長め
      healthcare: 165,     // 医療は規制が厳しい
      retail: 160,         // 小売は標準的
      other: 170           // その他の平均
    }

    // 会社規模による調整
    const sizeAdjustments: Record<string, number> = {
      startup: 1.15,     // スタートアップは長時間労働
      small: 1.05,       // 小企業は若干長め
      medium: 1.0,       // 中企業は標準
      large: 0.95,       // 大企業は労働環境が整備
      enterprise: 0.90   // 大手企業は最も規制が厳しい
    }

    const baseHours = industryWorkingHours[this.formData.industry] ?? industryWorkingHours.other!
    const sizeAdjustment = sizeAdjustments[this.formData.companySize] ?? sizeAdjustments.medium!

    return Math.round(baseHours * sizeAdjustment)
  }

  // 月別推移を計算
  private calculateMonthlyProjection(
    currentMetrics: ReturnType<typeof this.calculateCurrentMetrics>,
    projectedMetrics: ReturnType<typeof this.calculateProjectedMetrics>,
    aiCosts: ReturnType<typeof this.calculateAICosts>
  ): MonthlyProjection[] {
    const monthlyData: MonthlyProjection[] = []
    const implementationPeriod = this.formData.implementationPeriod

    for (let month = 1; month <= 12; month++) {
      // 導入期間中は段階的に効果が現れる
      const effectivenessFactor = month <= implementationPeriod
        ? month / implementationPeriod
        : 1

      const sales = currentMetrics.monthlySales +
        (projectedMetrics.monthlySales - currentMetrics.monthlySales) * effectivenessFactor

      const costs = currentMetrics.monthlyCost -
        (currentMetrics.monthlyCost - projectedMetrics.monthlyCost) * effectivenessFactor

      const grossBenefit = (sales - currentMetrics.monthlySales) +
        (currentMetrics.monthlyCost - costs) // AIコスト差し引き前の総効果
      const netBenefit = grossBenefit - aiCosts.monthlyCost // AIコスト差し引き後

      const cumulativeSavings = monthlyData.reduce((sum, data) => sum + data.netBenefit, 0) + netBenefit
      const cumulativeGrossBenefit = monthlyData.reduce((sum, data) => sum + data.grossBenefit, 0) + grossBenefit

      // 月別ROI: 累積投資額に対する累積効果
      const cumulativeInvestment = aiCosts.initialCost + (aiCosts.monthlyCost * month)
      const cumulativeROI = cumulativeInvestment > 0
        ? Math.round(((cumulativeGrossBenefit - cumulativeInvestment) / cumulativeInvestment) * 100)
        : 0

      monthlyData.push({
        month,
        sales: Math.round(sales),
        costs: Math.round(costs),
        aiCosts: aiCosts.monthlyCost,
        grossBenefit: Math.round(grossBenefit),
        netBenefit: Math.round(netBenefit),
        cumulativeROI,
        cumulativeSavings: Math.round(cumulativeSavings)
      })
    }

    return monthlyData
  }
}
