import { ROICalculator } from '@/lib/calculations/roi-calculator'
import { ROICalculationResult, ROIFormData } from '@/types/roi'
import { create } from 'zustand'

interface ROIStore {
  // 状態
  formData: ROIFormData | null
  calculationResult: ROICalculationResult | null
  isCalculating: boolean
  error: string | null

  // アクション
  setFormData: (data: ROIFormData) => void
  calculateROI: (data: ROIFormData) => Promise<void>
  clearResults: () => void
  clearError: () => void
}

// デフォルトのフォームデータ（完璧なROI推移: -1%開始、1年回収、安定成長を実現）
const defaultFormData: ROIFormData = {
  salesTeamSize: 5,
  monthlySales: 2800000,      // 280万円（より小規模な企業レベル）
  salesCost: 840000,          // 30%（業界標準的な営業コスト比率）
  averageDealSize: 470000,    // 47万円（B2B平均的な取引額）
  conversionRate: 14,         // 14%（より保守的な成約率）
  salesCycleLength: 50,       // 50日（B2B標準的な営業サイクル）
  aiToolType: 'crm-ai',
  initialCost: 600000,        // 60万円（初期費用をさらに増加）
  monthlyCost: 55000,         // 5.5万円（月額費用も増加）
  implementationPeriod: 4,    // 4ヶ月（導入期間を延長）
  efficiencyImprovement: [5],  // 5%（さらに保守的な効率改善）
  conversionImprovement: [1],  // 1%（さらに保守的な成約率改善）
  timeReduction: [6],          // 6%（さらに保守的な時間削減）
  industry: 'other',          // 業界係数の影響を抑制
  companySize: 'small',       // 小企業に変更（係数の影響を抑制）
  hasExistingCrm: false,
  additionalNotes: 'サンプルデータ: 現実的なAI導入シナリオ（-1%開始、1年回収、安定成長）'
}

export const useROIStore = create<ROIStore>()((set, get) => ({
  // 初期状態
  formData: null,
  calculationResult: null,
  isCalculating: false,
  error: null,

  // フォームデータを設定
  setFormData: (data: ROIFormData) => {
    set({ formData: data, error: null })
  },

  // ROI計算を実行
  calculateROI: async (data: ROIFormData) => {
    set({ isCalculating: true, error: null })

    try {
      // 計算処理をシミュレート（実際の処理時間）
      await new Promise(resolve => setTimeout(resolve, 1000))

      const calculator = new ROICalculator(data)
      const result = calculator.calculate()

      set({
        formData: data,
        calculationResult: result,
        isCalculating: false,
        error: null
      })
    } catch (error) {
      console.error('ROI calculation error:', error)
      set({
        isCalculating: false,
        error: error instanceof Error ? error.message : '計算中にエラーが発生しました'
      })
    }
  },

  // 結果をクリア
  clearResults: () => {
    set({
      formData: null,
      calculationResult: null,
      error: null
    })
  },

  // エラーをクリア
  clearError: () => {
    set({ error: null })
  }
}))

// サンプルデータでROI計算を実行するヘルパー関数
export const calculateSampleROI = async () => {
  const store = useROIStore.getState()

  console.log('🎯 サンプルデータ計算開始')
  console.log('📊 サンプルデータ:', defaultFormData)

  // ローカルストレージを完全にクリア（古いpersistデータを削除）
  try {
    localStorage.removeItem('roi-calculator-storage')
    console.log('🗑️ ローカルストレージをクリア')
  } catch (error) {
    console.log('ローカルストレージのクリアをスキップ:', error)
  }

  // 既存の結果をクリアしてからサンプルデータで計算
  store.clearResults()
  console.log('🔄 ストア結果をクリア')

  await store.calculateROI(defaultFormData)
  console.log('✅ サンプルデータ計算完了')
}

// フォームデータの検証
export const validateFormData = (data: Partial<ROIFormData>): string[] => {
  const errors: string[] = []

  if (!data.salesTeamSize || data.salesTeamSize < 1) {
    errors.push('営業チーム規模は1以上である必要があります')
  }

  if (!data.monthlySales || data.monthlySales < 0) {
    errors.push('月間売上は0以上である必要があります')
  }

  if (!data.salesCost || data.salesCost < 0) {
    errors.push('営業コストは0以上である必要があります')
  }

  if (!data.averageDealSize || data.averageDealSize < 0) {
    errors.push('平均取引額は0以上である必要があります')
  }

  if (!data.conversionRate || data.conversionRate < 0 || data.conversionRate > 100) {
    errors.push('成約率は0-100%の範囲で入力してください')
  }

  if (!data.initialCost || data.initialCost < 0) {
    errors.push('初期費用は0以上である必要があります')
  }

  if (!data.monthlyCost || data.monthlyCost < 0) {
    errors.push('月額費用は0以上である必要があります')
  }

  if (!data.implementationPeriod || data.implementationPeriod < 1) {
    errors.push('導入期間は1ヶ月以上である必要があります')
  }

  if (!data.aiToolType) {
    errors.push('AIツールタイプを選択してください')
  }

  if (!data.industry) {
    errors.push('業界を選択してください')
  }

  if (!data.companySize) {
    errors.push('会社規模を選択してください')
  }

  return errors
}
