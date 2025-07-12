/**
 * ROI（投資収益率）計算エンジン
 *
 * このファイルは、AI営業ツール導入のROIを包括的に計算するエンジンを提供します。
 * 業界ベンチマーク、企業規模、現実的な制約を考慮した精密な計算を実行し、
 * 投資判断に必要な詳細な分析結果を生成します。
 *
 * 主な機能:
 * - 業界別ベンチマークデータに基づく計算
 * - 企業規模別の効率性・コスト・実装期間の調整
 * - 現在の営業指標とAI導入後の予測指標の比較
 * - ROI、回収期間、月次予測の算出
 * - 入力データの妥当性検証と正規化
 *
 * 計算項目:
 * - ROI（投資収益率）
 * - 回収期間（月数）
 * - 年間総削減額
 * - 月次削減額
 * - 効率性向上率
 * - 売上増加額
 * - コスト削減額
 * - 時間削減（時間）
 *
 * 使用例:
 * ```tsx
 * const calculator = new ROICalculator(formData)
 * const result = calculator.calculate()
 *
 * console.log(`ROI: ${result.roi}%`)
 * console.log(`回収期間: ${result.paybackPeriod}ヶ月`)
 * console.log(`年間削減額: ${result.totalSavings}円`)
 * ```
 */
import { CompanySizeMultiplier, IndustryBenchmark, MonthlyProjection, ROICalculationResult, ROIFormData } from '@/types/roi'

/**
 * 業界別ベンチマークデータ
 *
 * 各業界の平均的な営業指標とAI導入効果を定義します。
 * これらの値は業界調査データに基づいて設定されており、
 * より現実的で信頼性の高いROI計算を可能にします。
 *
 * 各業界の特徴:
 * - IT・テクノロジー: 高い成約率、中程度の取引額、AI導入率が高い
 * - 製造業: 中程度の成約率、高額取引、長い営業サイクル
 * - 金融・保険: 高い成約率、中程度の取引額、短い営業サイクル
 * - 医療・ヘルスケア: 中程度の成約率、高額取引、中程度の営業サイクル
 * - 小売・EC: 低い成約率、低額取引、短い営業サイクル、AI導入率が最も高い
 * - その他: デフォルト値として使用
 */
const INDUSTRY_BENCHMARKS: Record<string, IndustryBenchmark> = {
  technology: {
    industry: 'IT・テクノロジー',
    averageConversionRate: 25,    // 平均成約率25%
    averageDealSize: 800000,      // 平均取引額80万円
    averageSalesCycle: 45,        // 平均営業サイクル45日
    aiAdoptionRate: 0.8,          // AI導入率80%
    expectedEfficiencyGain: 35    // 期待効率向上率35%
  },
  manufacturing: {
    industry: '製造業',
    averageConversionRate: 18,    // 平均成約率18%
    averageDealSize: 1200000,     // 平均取引額120万円
    averageSalesCycle: 60,        // 平均営業サイクル60日
    aiAdoptionRate: 0.6,          // AI導入率60%
    expectedEfficiencyGain: 28    // 期待効率向上率28%
  },
  finance: {
    industry: '金融・保険',
    averageConversionRate: 22,    // 平均成約率22%
    averageDealSize: 600000,      // 平均取引額60万円
    averageSalesCycle: 35,        // 平均営業サイクル35日
    aiAdoptionRate: 0.7,          // AI導入率70%
    expectedEfficiencyGain: 32    // 期待効率向上率32%
  },
  healthcare: {
    industry: '医療・ヘルスケア',
    averageConversionRate: 20,    // 平均成約率20%
    averageDealSize: 900000,      // 平均取引額90万円
    averageSalesCycle: 50,        // 平均営業サイクル50日
    aiAdoptionRate: 0.5,          // AI導入率50%
    expectedEfficiencyGain: 25    // 期待効率向上率25%
  },
  retail: {
    industry: '小売・EC',
    averageConversionRate: 15,    // 平均成約率15%
    averageDealSize: 300000,      // 平均取引額30万円
    averageSalesCycle: 25,        // 平均営業サイクル25日
    aiAdoptionRate: 0.9,          // AI導入率90%
    expectedEfficiencyGain: 40    // 期待効率向上率40%
  },
  other: {
    industry: 'その他',
    averageConversionRate: 20,    // 平均成約率20%
    averageDealSize: 500000,      // 平均取引額50万円
    averageSalesCycle: 40,        // 平均営業サイクル40日
    aiAdoptionRate: 0.6,          // AI導入率60%
    expectedEfficiencyGain: 30    // 期待効率向上率30%
  }
}

/**
 * 会社規模別係数
 *
 * 企業規模によるAI導入の効率性、コスト、実装期間の違いを反映します。
 * 一般的に、大企業ほど効率改善は小さいが、コストは高く、実装期間は長い傾向があります。
 *
 * 各規模の特徴:
 * - スタートアップ: 高い効率改善、低コスト、短期実装
 * - 小企業: 中程度の効率改善、低コスト、短期実装
 * - 中企業: 標準的な効率改善、標準コスト、標準実装期間
 * - 大企業: 低い効率改善、高コスト、長期実装
 * - 大手企業: 最も低い効率改善、最高コスト、最長期実装
 */
const COMPANY_SIZE_MULTIPLIERS: Record<string, CompanySizeMultiplier> = {
  startup: {
    size: 'スタートアップ',
    efficiencyMultiplier: 1.2,    // 効率改善係数120%（高い改善効果）
    costMultiplier: 0.8,          // コスト係数80%（低コスト）
    implementationMultiplier: 0.5 // 実装期間係数50%（短期実装）
  },
  small: {
    size: '小企業',
    efficiencyMultiplier: 1.1,    // 効率改善係数110%（中程度の改善効果）
    costMultiplier: 0.9,          // コスト係数90%（低コスト）
    implementationMultiplier: 0.7 // 実装期間係数70%（短期実装）
  },
  medium: {
    size: '中企業',
    efficiencyMultiplier: 1.0,    // 効率改善係数100%（標準的な改善効果）
    costMultiplier: 1.0,          // コスト係数100%（標準コスト）
    implementationMultiplier: 1.0 // 実装期間係数100%（標準実装期間）
  },
  large: {
    size: '大企業',
    efficiencyMultiplier: 0.9,    // 効率改善係数90%（低い改善効果）
    costMultiplier: 1.1,          // コスト係数110%（高コスト）
    implementationMultiplier: 1.3 // 実装期間係数130%（長期実装）
  },
  enterprise: {
    size: '大手企業',
    efficiencyMultiplier: 0.8,    // 効率改善係数80%（最も低い改善効果）
    costMultiplier: 1.2,          // コスト係数120%（最高コスト）
    implementationMultiplier: 1.5 // 実装期間係数150%（最長期実装）
  }
}

/**
 * ROI計算エンジンクラス
 *
 * AI営業ツール導入のROI（投資収益率）を包括的に計算するメインクラスです。
 * 業界ベンチマーク、企業規模、現実的な制約を考慮した精密な計算を実行し、
 * 投資判断に必要な詳細な分析結果を生成します。
 *
 * 計算の流れ:
 * 1. 入力データの妥当性検証と正規化
 * 2. 現在の営業指標の計算
 * 3. AI導入後の予測指標の計算
 * 4. AI導入コストの計算
 * 5. ROI、回収期間、月次予測の算出
 *
 * 主要メソッド:
 * - calculate(): メイン計算メソッド
 * - calculateCurrentMetrics(): 現在の営業指標を計算
 * - calculateProjectedMetrics(): AI導入後の予測指標を計算
 * - calculateAICosts(): AI導入コストを計算
 * - calculateROI(): ROIを計算
 * - calculatePaybackPeriod(): 回収期間を計算
 */
export class ROICalculator {
  private formData: ROIFormData              // 入力されたフォームデータ
  private industryBenchmark: IndustryBenchmark  // 業界ベンチマークデータ
  private sizeMultiplier: CompanySizeMultiplier  // 企業規模別係数

  /**
   * ROI計算エンジンのコンストラクタ
   *
   * 入力データを受け取り、業界ベンチマークと企業規模係数を設定します。
   * 入力データの妥当性検証と正規化も実行します。
   *
   * @param formData - ユーザーが入力したROI計算用データ
   */
  constructor(formData: ROIFormData) {
    // 入力データの妥当性検証と正規化
    this.formData = this.validateAndNormalizeFormData(formData)

    // 業界ベンチマークの設定（該当なしの場合は'other'を使用）
    this.industryBenchmark = INDUSTRY_BENCHMARKS[formData.industry] ?? INDUSTRY_BENCHMARKS.other!

    // 企業規模別係数の設定（該当なしの場合は'medium'を使用）
    this.sizeMultiplier = COMPANY_SIZE_MULTIPLIERS[formData.companySize] ?? COMPANY_SIZE_MULTIPLIERS.medium!
  }

  /**
   * 入力データの妥当性検証と正規化
   *
   * ユーザーが入力したデータが現実的な範囲内にあるかをチェックし、
   * 異常値の場合は適切な範囲内に調整します。
   * これにより、計算結果の信頼性を保ちます。
   *
   * @param formData - 検証・正規化対象のフォームデータ
   * @returns 正規化されたフォームデータ
   */
  private validateAndNormalizeFormData(formData: ROIFormData): ROIFormData {
    const normalized = { ...formData }

    // 営業チーム規模の妥当性チェック（1人〜10,000人の範囲）
    if (normalized.salesTeamSize < 1 || normalized.salesTeamSize > 10000) {
      console.warn(`営業チーム規模が異常値です: ${normalized.salesTeamSize}人`)
      normalized.salesTeamSize = Math.max(1, Math.min(normalized.salesTeamSize, 10000))
    }

    // 売上とコストの妥当性チェック（営業コストが売上の80%を超えないように）
    if (normalized.salesCost > normalized.monthlySales * 0.8) {
      console.warn(`営業コストが売上の80%を超えています: ${normalized.salesCost}円`)
      normalized.salesCost = normalized.monthlySales * 0.8
    }

    // 成約率の妥当性チェック（0.1% - 80%の範囲）
    if (normalized.conversionRate < 0.1 || normalized.conversionRate > 80) {
      console.warn(`成約率が異常値です: ${normalized.conversionRate}%`)
      normalized.conversionRate = Math.max(0.1, Math.min(normalized.conversionRate, 80))
    }

    // 平均取引額の妥当性チェック（月間取引数が現実的な範囲内かチェック）
    const estimatedDeals = normalized.monthlySales / normalized.averageDealSize
    if (estimatedDeals < 0.1 || estimatedDeals > 10000) {
      console.warn(`平均取引額から算出される月間取引数が異常です: ${estimatedDeals}件`)
      normalized.averageDealSize = normalized.monthlySales / Math.max(1, Math.min(estimatedDeals, 1000))
    }

    // AI改善率の妥当性チェック（各改善率を適切な範囲内に制限）
    normalized.efficiencyImprovement = normalized.efficiencyImprovement.map(val =>
      Math.max(0, Math.min(val, 100))  // 0% - 100%の範囲
    )
    normalized.conversionImprovement = normalized.conversionImprovement.map(val =>
      Math.max(0, Math.min(val, 100))  // 0% - 100%の範囲
    )
    normalized.timeReduction = normalized.timeReduction.map(val =>
      Math.max(0, Math.min(val, 90))   // 0% - 90%の範囲（100%削減は現実的でない）
    )

    return normalized
  }

  /**
   * メイン計算メソッド
   *
   * ROI計算の全体的な流れを実行し、包括的な分析結果を返します。
   * 現在の指標、予測指標、AIコスト、月次予測を計算し、
   * ROI、回収期間、削減額などの最終結果を算出します。
   *
   * @returns 包括的なROI計算結果
   */
  calculate(): ROICalculationResult {
    // 現在の営業指標を計算
    const currentMetrics = this.calculateCurrentMetrics()

    // AI導入後の予測指標を計算
    const projectedMetrics = this.calculateProjectedMetrics(currentMetrics)

    // AI導入コストを計算
    const aiCosts = this.calculateAICosts()

    // 月次予測を計算
    const monthlyProjection = this.calculateMonthlyProjection(currentMetrics, projectedMetrics, aiCosts)

    // 月間削減額の計算（AIコストを差し引いた実質的な削減額）
    const monthlyBenefit = projectedMetrics.monthlySales - currentMetrics.monthlySales +
                          (currentMetrics.monthlyCost - projectedMetrics.monthlyCost)
    const monthlySavings = monthlyBenefit - aiCosts.monthlyCost // AIコストを差し引く

    // 年間の総効果を計算
    const totalSavings = monthlyBenefit * 12 // 年間総効果（AIコスト差し引き前）
    const annualNetSavings = monthlySavings * 12 // 年間純削減額（AIコスト差し引き後）

    // ROI計算は純削減額を使用（より現実的）
    const roi = this.calculateROI(annualNetSavings, aiCosts.totalCostYear1)
    const paybackPeriod = this.calculatePaybackPeriod(aiCosts.totalCostYear1, monthlySavings)

    // 包括的な結果を返す
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

    // 🔧 修正: 改善効果の適用方法を現実的に調整
    // 成約率向上による売上増加（業界ベンチマーク考慮）
    const maxReasonableConversionRate = industryConversionRate * 1.5 // 業界平均の150%を上限
    const improvedConversionRate = Math.min(
      currentConversionRate * (1 + conversionImprovement),
      maxReasonableConversionRate
    )
    const conversionMultiplier = improvedConversionRate / currentConversionRate

    // 効率向上は処理能力増加ではなく、より控えめに適用
    const efficiencyMultiplier = 1 + (efficiencyGain * 0.5) // 50%の効果に調整（より保守的）

    // 🔧 修正: 改善効果の重複を避け、より保守的な計算
    // 成約率改善と効率改善の複合効果を制限
    const combinedMultiplier = Math.min(
      conversionMultiplier * efficiencyMultiplier,
      1.3 // 最大30%の売上増加に制限（保守的）
    )

    const projectedMonthlySales = currentMetrics.monthlySales * combinedMultiplier
    const projectedDealsPerMonth = currentMetrics.dealsPerMonth * combinedMultiplier

    // コスト削減（時間削減による人件費削減）
    // 業界・会社規模に応じた人件費比率を動的計算（保守的に調整）
    const laborCostRatio = this.calculateLaborCostRatio() * 0.7 // 70%に調整（保守的）
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

    const rawROI = ((totalBenefit - totalCost) / totalCost) * 100

    // 🔧 保守的なROI上限を設定（300%を上限とする）
    const cappedROI = Math.min(rawROI, 300)

    return Math.round(cappedROI)
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
      // 導入期間中は段階的に効果が現れる（現実的な成長曲線）
      const effectivenessFactor = month <= implementationPeriod
        ? Math.min((month / implementationPeriod) * 0.5, 0.5) // 導入期間中は最大50%
        : Math.min(0.5 + ((month - implementationPeriod) / (12 - implementationPeriod)) * 0.5, 1.0) // 段階的に100%へ

      const sales = currentMetrics.monthlySales +
        (projectedMetrics.monthlySales - currentMetrics.monthlySales) * effectivenessFactor

      const costs = currentMetrics.monthlyCost -
        (currentMetrics.monthlyCost - projectedMetrics.monthlyCost) * effectivenessFactor

      const grossBenefit = (sales - currentMetrics.monthlySales) +
        (currentMetrics.monthlyCost - costs) // AIコスト差し引き前の総効果
      const netBenefit = grossBenefit - aiCosts.monthlyCost // AIコスト差し引き後

      const cumulativeSavings = monthlyData.reduce((sum, data) => sum + data.netBenefit, 0) + netBenefit
      const cumulativeGrossBenefit = monthlyData.reduce((sum, data) => sum + data.grossBenefit, 0) + grossBenefit

      // 月別ROI: 正しいROI計算式 = (利益 - 投資額) / 投資額 * 100
      const cumulativeInvestment = aiCosts.initialCost + (aiCosts.monthlyCost * month)
      const cumulativeROI = cumulativeInvestment > 0
        ? Math.round(((cumulativeSavings - cumulativeInvestment) / cumulativeInvestment) * 100)
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
