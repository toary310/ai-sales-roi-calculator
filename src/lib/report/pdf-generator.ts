import { ROIData } from '@/types/roi'
import { AIAnalysisResult } from '@/lib/ai/analysis-service'

export class PDFReportGenerator {
  static async generateReport(
    roiData: ROIData, 
    aiAnalysis?: AIAnalysisResult
  ): Promise<void> {
    try {
      // 日本語対応のため、CSVレポートとして生成
      const csvContent = this.generateCSVReport(roiData, aiAnalysis)
      this.downloadCSV(csvContent, 'AI営業ROI分析レポート')
    } catch (error) {
      console.error('レポート生成エラー:', error)
      throw new Error('レポートの生成に失敗しました')
    }
  }

  private static generateCSVReport(roiData: ROIData, aiAnalysis?: AIAnalysisResult): string {
    const lines: string[] = []
    
    // BOM付きUTF-8でCSVを生成（Excelで正しく表示されるため）
    lines.push('\uFEFF') // BOM
    
    // ヘッダー
    lines.push('AI営業ROI分析レポート')
    lines.push(`生成日時,${new Date().toLocaleString('ja-JP')}`)
    lines.push('')
    
    // 企業情報
    lines.push('企業情報')
    lines.push(`業界,${roiData.industry || '不明'}`)
    lines.push(`企業規模,${roiData.companySize || '不明'}`)
    lines.push(`営業チーム規模,${roiData.currentMetrics?.salesTeamSize || 0}名`)
    lines.push('')
    
    // 現在の営業データ
    lines.push('現在の営業データ')
    lines.push(`月間売上,${(roiData.currentMetrics?.monthlySales || 0).toLocaleString()}円`)
    lines.push(`月間営業コスト,${(roiData.currentMetrics?.salesCost || 0).toLocaleString()}円`)
    lines.push(`平均取引額,${(roiData.currentMetrics?.averageDealSize || 0).toLocaleString()}円`)
    lines.push(`成約率,${roiData.currentMetrics?.conversionRate || 0}%`)
    lines.push(`営業サイクル,${roiData.currentMetrics?.salesCycleLength || 0}日`)
    lines.push('')
    
    // AI導入計画
    lines.push('AI導入計画')
    lines.push(`AIツールタイプ,${roiData.aiToolType || '不明'}`)
    lines.push(`初期費用,${(roiData.initialCost || 0).toLocaleString()}円`)
    lines.push(`月額費用,${(roiData.monthlyCost || 0).toLocaleString()}円`)
    lines.push(`導入期間,${roiData.implementationPeriod || 0}ヶ月`)
    lines.push('')
    
    // ROI計算結果
    lines.push('ROI計算結果')
    lines.push(`投資収益率(ROI),${roiData.roi || 0}%`)
    lines.push(`投資回収期間,${roiData.paybackPeriod || 0}ヶ月`)
    lines.push(`年間純利益,${(roiData.annualNetProfit || 0).toLocaleString()}円`)
    lines.push('')
    
    // AI分析結果
    if (aiAnalysis) {
      lines.push('AI専門分析')
      lines.push(`リスク分析,"${aiAnalysis.riskAnalysis}"`)
      lines.push(`業界比較,"${aiAnalysis.industryComparison}"`)
      lines.push(`市場トレンド,"${aiAnalysis.marketTrends}"`)
      lines.push(`分析信頼度,${aiAnalysis.confidenceLevel}%`)
      lines.push('')
      
      lines.push('推奨事項')
      aiAnalysis.recommendations.forEach((rec, index) => {
        lines.push(`推奨事項${index + 1},"${rec}"`)
      })
      lines.push('')
      
      lines.push('重要な洞察')
      aiAnalysis.keyInsights.forEach((insight, index) => {
        lines.push(`洞察${index + 1},"${insight}"`)
      })
    }
    
    return lines.join('\n')
  }

  private static downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
