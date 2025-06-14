// 型定義の再エクスポート
export * from './roi'

// 明示的なエクスポート（Vercel対応）
export type {
  ROIFormData,
  ROICalculationResult,
  ROIData,
  MonthlyProjection,
  IndustryBenchmark,
  CompanySizeMultiplier
} from './roi'
