import { ROIFormData, ROICalculationResult, MonthlyProjection, IndustryBenchmark, CompanySizeMultiplier } from '@/types/roi'

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
    this.formData = formData
    this.industryBenchmark = INDUSTRY_BENCHMARKS[formData.industry] || INDUSTRY_BENCHMARKS.other
    this.sizeMultiplier = COMPANY_SIZE_MULTIPLIERS[formData.companySize] || COMPANY_SIZE_MULTIPLIERS.medium
  }

  // メイン計算メソッド
  calculate(): ROICalculationResult {
    const currentMetrics = this.calculateCurrentMetrics()
    const projectedMetrics = this.calculateProjectedMetrics(currentMetrics)
    const aiCosts = this.calculateAICosts()
    const monthlyProjection = this.calculateMonthlyProjection(currentMetrics, projectedMetrics, aiCosts)
    
    const monthlySavings = projectedMetrics.monthlySales - currentMetrics.monthlySales + 
                         (currentMetrics.monthlyCost - projectedMetrics.monthlyCost)
    const totalSavings = monthlySavings * 12
    const roi = this.calculateROI(totalSavings, aiCosts.totalCostYear1)
    const paybackPeriod = this.calculatePaybackPeriod(aiCosts.totalCostYear1, monthlySavings)

    return {
      roi,
      paybackPeriod,
      totalSavings,
      monthlySavings,
      efficiencyGain: this.formData.efficiencyImprovement[0] * this.sizeMultiplier.efficiencyMultiplier,
      revenueIncrease: this.calculateRevenueIncrease(),
      costReduction: currentMetrics.monthlyCost - projectedMetrics.monthlyCost,
      timeReductionHours: this.calculateTimeReduction(),
      currentMetrics,
      projectedMetrics,
      aiCosts,
      monthlyProjection,
      calculationParams: {
        efficiencyImprovement: this.formData.efficiencyImprovement[0],
        conversionImprovement: this.formData.conversionImprovement[0],
        timeReduction: this.formData.timeReduction[0],
        implementationPeriod: this.formData.implementationPeriod
      }
    }
  }

  // 現在の営業指標を計算
  private calculateCurrentMetrics() {
    const dealsPerMonth = this.formData.monthlySales / this.formData.averageDealSize
    const salesPerPerson = this.formData.monthlySales / this.formData.salesTeamSize

    return {
      monthlySales: this.formData.monthlySales,
      monthlyCost: this.formData.salesCost,
      dealsPerMonth,
      salesPerPerson
    }
  }

  // AI導入後の予測指標を計算
  private calculateProjectedMetrics(currentMetrics: any) {
    const efficiencyGain = this.formData.efficiencyImprovement[0] * this.sizeMultiplier.efficiencyMultiplier / 100
    const conversionImprovement = this.formData.conversionImprovement[0] / 100
    const timeReduction = this.formData.timeReduction[0] / 100

    // 成約率向上による売上増加
    const improvedConversionRate = this.formData.conversionRate + this.formData.conversionImprovement[0]
    const conversionMultiplier = improvedConversionRate / this.formData.conversionRate

    // 効率向上による処理能力増加
    const efficiencyMultiplier = 1 + efficiencyGain

    const projectedMonthlySales = currentMetrics.monthlySales * conversionMultiplier * efficiencyMultiplier
    const projectedDealsPerMonth = currentMetrics.dealsPerMonth * conversionMultiplier * efficiencyMultiplier

    // コスト削減（時間削減による人件費削減）
    const costReductionFromTimeReduction = currentMetrics.monthlyCost * timeReduction * 0.6 // 60%が人件費と仮定
    const projectedMonthlyCost = currentMetrics.monthlyCost - costReductionFromTimeReduction

    return {
      monthlySales: projectedMonthlySales,
      monthlyCost: projectedMonthlyCost,
      dealsPerMonth: projectedDealsPerMonth,
      salesPerPerson: projectedMonthlySales / this.formData.salesTeamSize
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
    return Math.ceil(totalCost / monthlySavings)
  }

  // 売上増加率を計算
  private calculateRevenueIncrease(): number {
    const currentSales = this.formData.monthlySales
    const projectedMetrics = this.calculateProjectedMetrics(this.calculateCurrentMetrics())
    return Math.round(((projectedMetrics.monthlySales - currentSales) / currentSales) * 100)
  }

  // 時間削減量を計算（時間/月）
  private calculateTimeReduction(): number {
    const timeReductionRate = this.formData.timeReduction[0] / 100
    const workingHoursPerMonth = this.formData.salesTeamSize * 160 // 1人あたり160時間/月と仮定
    return Math.round(workingHoursPerMonth * timeReductionRate)
  }

  // 月別推移を計算
  private calculateMonthlyProjection(
    currentMetrics: any, 
    projectedMetrics: any, 
    aiCosts: any
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

      const netBenefit = (sales - currentMetrics.monthlySales) + 
        (currentMetrics.monthlyCost - costs) - aiCosts.monthlyCost

      const cumulativeSavings = monthlyData.reduce((sum, data) => sum + data.netBenefit, 0) + netBenefit
      const cumulativeROI = aiCosts.totalCostYear1 > 0 
        ? Math.round(((cumulativeSavings - aiCosts.initialCost) / aiCosts.totalCostYear1) * 100)
        : 0

      monthlyData.push({
        month,
        sales: Math.round(sales),
        costs: Math.round(costs),
        aiCosts: aiCosts.monthlyCost,
        netBenefit: Math.round(netBenefit),
        cumulativeROI,
        cumulativeSavings: Math.round(cumulativeSavings)
      })
    }

    return monthlyData
  }
}
