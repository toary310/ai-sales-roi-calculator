import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 数値をカンマ区切りの文字列に変換
export function formatNumber(value: number | string): string {
  if (value === '' || value === null || value === undefined) return ''

  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) return ''

  return numValue.toLocaleString('ja-JP')
}

// カンマ区切りの文字列を数値に変換
export function parseNumber(value: string): number {
  if (!value) return 0

  // カンマを除去して数値に変換
  const cleanValue = value.replace(/,/g, '')
  const numValue = parseFloat(cleanValue)

  return isNaN(numValue) ? 0 : numValue
}

// 入力値をフォーマット（表示用）
export function formatInputValue(value: string): string {
  if (!value) return ''

  // 数値以外の文字（カンマ以外）を除去
  const cleanValue = value.replace(/[^\d,]/g, '')

  // カンマを一旦除去
  const numberOnly = cleanValue.replace(/,/g, '')

  if (!numberOnly) return ''

  // 数値に変換してカンマ区切りで表示
  const numValue = parseInt(numberOnly, 10)
  if (isNaN(numValue)) return ''

  return numValue.toLocaleString('ja-JP')
}
