import { ROICalculator } from '@/lib/calculations/roi-calculator'
import { ROICalculationResult, ROIFormData } from '@/types/roi'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

// デフォルトのフォームデータ
const defaultFormData: ROIFormData = {
  salesTeamSize: 10,
  monthlySales: 5000000,
  salesCost: 2500000,
  averageDealSize: 500000,
  conversionRate: 20,
  salesCycleLength: 30,
  aiToolType: 'crm-ai',
  initialCost: 500000,
  monthlyCost: 50000,
  implementationPeriod: 3,
  efficiencyImprovement: [30],
  conversionImprovement: [15],
  timeReduction: [25],
  industry: 'technology',
  companySize: 'medium',
  hasExistingCrm: false,
  additionalNotes: ''
}

export const useROIStore = create<ROIStore>()(
  persist(
    (set, get) => ({
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
    }),
    {
      name: 'roi-calculator-storage',
      // 永続化から除外する項目
      partialize: (state) => ({
        formData: state.formData,
        calculationResult: state.calculationResult
      })
    }
  )
)

// サンプルデータでROI計算を実行するヘルパー関数
export const calculateSampleROI = async () => {
  const store = useROIStore.getState()
  await store.calculateROI(defaultFormData)
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
