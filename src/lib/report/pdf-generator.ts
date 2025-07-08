import { AIAnalysisResult } from '@/lib/ai/analysis-service'
import { ROICalculationResult } from '@/types/roi'

// jsPDF の型定義拡張
declare module 'jspdf' {
  interface jsPDF {
    // 基本的なjsPDFの型定義は既存のものを使用
  }
}

/**
 * PDFレポート生成クラス
 * ROI計算結果とAI分析結果を基に、プロフェッショナルなPDFレポートを生成
 * jsPDFライブラリを使用し、文字化けを避けるため英語でレポートを作成
 */
export class PDFReportGenerator {
  /**
   * PDFレポートを生成してダウンロードするメインメソッド
   * @param calculationResult - ROI計算結果データ
   * @param aiAnalysis - AI分析結果（オプション）
   */
  static async generateReport(
    calculationResult: ROICalculationResult,
    aiAnalysis?: AIAnalysisResult
  ): Promise<void> {
    try {
      // 動的インポートでjsPDFライブラリを読み込み（バンドルサイズ最適化）
      const { default: jsPDF } = await import('jspdf')

      // A4縦向きのPDFドキュメントを作成
      const doc = new jsPDF({
        orientation: 'portrait',  // 縦向き
        unit: 'mm',              // ミリメートル単位
        format: 'a4'             // A4サイズ
      })

      // PDFコンテンツの生成（テーブル形式レイアウト）
      await this.generatePDFContentWithTables(doc, calculationResult, aiAnalysis)

      // 日付付きファイル名でPDFをダウンロード
      const filename = `AI_Sales_ROI_Report_${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(filename)
    } catch (error) {
      console.error('PDFレポート生成エラー:', error)
      throw new Error('PDFレポートの生成に失敗しました')
    }
  }

  private static async generatePDFContentWithTables(
    doc: any,
    calculationResult: ROICalculationResult,
    aiAnalysis?: AIAnalysisResult
  ): Promise<void> {
    const pageWidth = 210
    const margin = 20
    let yPosition = 20

    // ヘッダー（英語で作成）
    doc.setFontSize(20)
    doc.text('AI Sales ROI Analysis Report', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    doc.setFontSize(10)
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US')}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 20

    // ROI概要セクション
    yPosition = this.addSection(doc, 'ROI Summary', yPosition)

    const roiData = [
      ['ROI (%)', `${calculationResult.roi}%`],
      ['Payback Period (months)', `${calculationResult.paybackPeriod}`],
      ['Annual Total Savings (JPY)', `¥${calculationResult.totalSavings.toLocaleString()}`],
      ['Monthly Net Savings (JPY)', `¥${Math.round(calculationResult.monthlySavings).toLocaleString()}`],
      ['Efficiency Improvement (%)', `${Math.round(calculationResult.efficiencyGain)}%`],
      ['Revenue Increase (%)', `${calculationResult.revenueIncrease}%`]
    ]

    yPosition = this.addTableData(doc, roiData, yPosition, margin)

    // 現在の営業データセクション
    yPosition = this.addSection(doc, 'Current Sales Data', yPosition + 10)

    const currentData = [
      ['Monthly Sales (JPY)', `¥${calculationResult.currentMetrics.monthlySales.toLocaleString()}`],
      ['Monthly Sales Cost (JPY)', `¥${calculationResult.currentMetrics.monthlyCost.toLocaleString()}`],
      ['Deals per Month', `${Math.round(calculationResult.currentMetrics.dealsPerMonth)}`],
      ['Sales per Person (JPY)', `¥${Math.round(calculationResult.currentMetrics.salesPerPerson).toLocaleString()}`]
    ]

    yPosition = this.addTableData(doc, currentData, yPosition, margin)

    // AI導入計画セクション
    yPosition = this.addSection(doc, 'AI Implementation Plan', yPosition + 10)

    const aiPlanData = [
      ['Initial Cost (JPY)', `¥${calculationResult.aiCosts.initialCost.toLocaleString()}`],
      ['Monthly Cost (JPY)', `¥${calculationResult.aiCosts.monthlyCost.toLocaleString()}`],
      ['Annual Cost (JPY)', `¥${calculationResult.aiCosts.annualCost.toLocaleString()}`],
      ['Implementation Period (months)', `${calculationResult.calculationParams.implementationPeriod}`],
      ['Efficiency Improvement (%)', `${calculationResult.calculationParams.efficiencyImprovement}%`],
      ['Conversion Improvement (%)', `${calculationResult.calculationParams.conversionImprovement}%`],
      ['Time Reduction (%)', `${calculationResult.calculationParams.timeReduction}%`]
    ]

    yPosition = this.addTableData(doc, aiPlanData, yPosition, margin)

    // 新しいページが必要かチェック
    if (yPosition > 220) {
      doc.addPage()
      yPosition = 20
    }

    // 月別推移セクション（最初の6ヶ月）
    if (calculationResult.monthlyProjection && calculationResult.monthlyProjection.length > 0) {
      yPosition = this.addSection(doc, 'Monthly Projection (First 6 Months)', yPosition + 10)

      const monthlyData = calculationResult.monthlyProjection.slice(0, 6).map(month => [
        `Month ${month.month}`,
        `¥${month.sales.toLocaleString()}`,
        `¥${month.costs.toLocaleString()}`,
        `${month.cumulativeROI}%`
      ])

      // ヘッダー行
      doc.setFontSize(9)
      doc.setFont(undefined, 'bold')
      doc.text('Month', margin, yPosition)
      doc.text('Sales (JPY)', margin + 40, yPosition)
      doc.text('Costs (JPY)', margin + 80, yPosition)
      doc.text('Cumulative ROI (%)', margin + 120, yPosition)
      yPosition += 8

      // データ行
      doc.setFont(undefined, 'normal')
      monthlyData.forEach(([month, sales, costs, roi]) => {
        doc.text(month, margin, yPosition)
        doc.text(sales, margin + 40, yPosition)
        doc.text(costs, margin + 80, yPosition)
        doc.text(roi, margin + 120, yPosition)
        yPosition += 6
      })

      yPosition += 10
    }

    // AI分析結果（英語での要約表示）
    if (aiAnalysis) {
      if (yPosition > 200) {
        doc.addPage()
        yPosition = 20
      }

      yPosition = this.addSection(doc, 'AI Analysis Summary', yPosition + 10)

      // 基本的な分析情報のみ表示（文字化けリスクを最小化）
      const basicAnalysisData = [
        ['Analysis Confidence Level', `${aiAnalysis.confidenceLevel}%`],
        ['Risk Assessment', 'Detailed analysis available in web interface'],
        ['Industry Comparison', 'Comparative analysis available in web interface'],
        ['Market Trends', 'Trend analysis available in web interface']
      ]

      yPosition = this.addTableData(doc, basicAnalysisData, yPosition, margin)

      // 推奨事項の数のみ表示
      if (aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0) {
        yPosition = this.addSection(doc, 'AI Recommendations', yPosition + 10)

        doc.setFontSize(10)
        doc.text(`Total Recommendations: ${aiAnalysis.recommendations.length}`, margin, yPosition)
        yPosition += 8
        doc.text('Detailed recommendations available in web interface', margin, yPosition)
        yPosition += 8
      }

      // 重要な洞察の数のみ表示
      if (aiAnalysis.keyInsights && aiAnalysis.keyInsights.length > 0) {
        yPosition = this.addSection(doc, 'Key Insights', yPosition + 10)

        doc.setFontSize(10)
        doc.text(`Total Key Insights: ${aiAnalysis.keyInsights.length}`, margin, yPosition)
        yPosition += 8
        doc.text('Detailed insights available in web interface', margin, yPosition)
        yPosition += 8
      }

      // 注記
      yPosition += 10
      doc.setFontSize(9)
      doc.setFont(undefined, 'italic')
      doc.text('Note: Complete AI analysis with detailed text is available', margin, yPosition)
      yPosition += 6
      doc.text('in the web interface to ensure proper character encoding.', margin, yPosition)
      doc.setFont(undefined, 'normal')
    }

    // フッター
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(`Page ${i} / ${pageCount}`, pageWidth - margin, 290, { align: 'right' })
      doc.text('AI Sales ROI Calculator', margin, 290)
    }
  }

  private static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
  }

  private static sanitizeText(text: string, maxLength: number): string {
    // 日本語文字を除去し、英語・数字・基本記号のみを残す
    const sanitized = text
      .replace(/[^\x00-\x7F]/g, '') // 非ASCII文字を除去
      .replace(/\s+/g, ' ') // 複数の空白を1つに
      .trim()

    // 空になった場合は代替テキスト
    if (!sanitized) {
      return 'Analysis data contains non-ASCII characters'
    }

    return this.truncateText(sanitized, maxLength)
  }

  private static addSection(doc: any, title: string, yPosition: number): number {
    doc.setFontSize(14)
    doc.setFont(undefined, 'bold')
    doc.text(title, 20, yPosition)
    doc.setFont(undefined, 'normal')

    // セクション下線
    doc.setLineWidth(0.5)
    doc.line(20, yPosition + 2, 190, yPosition + 2)

    return yPosition + 12
  }

  private static addTableData(doc: any, data: string[][], yPosition: number, margin: number): number {
    doc.setFontSize(10)

    data.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold')
      doc.text(`${label}:`, margin, yPosition)
      doc.setFont(undefined, 'normal')
      doc.text(value, margin + 80, yPosition)
      yPosition += 7
    })

    return yPosition
  }
}
