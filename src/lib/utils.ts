/**
 * 共通ユーティリティ関数
 *
 * このファイルは、アプリケーション全体で使用される汎用的なユーティリティ関数を提供します。
 * 主にスタイリング、数値フォーマット、入力値の処理に関する機能を含みます。
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * CSSクラス名を結合・最適化する関数
 *
 * この関数は、複数のCSSクラス名を安全に結合し、Tailwind CSSの競合を解決します。
 * clsxでクラス名を結合し、tailwind-mergeで重複や競合を解決します。
 *
 * @param inputs - 結合したいCSSクラス名（文字列、配列、オブジェクト等）
 * @returns 最適化されたCSSクラス名の文字列
 *
 * 使用例:
 * ```tsx
 * // 基本的な使用
 * cn('text-red-500', 'bg-blue-500') // 'text-red-500 bg-blue-500'
 *
 * // 条件付きクラス
 * cn('base-class', isActive && 'active-class') // isActiveがtrueなら'base-class active-class'
 *
 * // 配列やオブジェクト
 * cn(['class1', 'class2'], { 'conditional': true }) // 'class1 class2 conditional'
 *
 * // Tailwindの競合解決
 * cn('text-red-500', 'text-blue-500') // 'text-blue-500' (後者が優先)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 数値を日本語形式のカンマ区切り文字列に変換する関数
 *
 * 数値や文字列を日本語の数値フォーマット（カンマ区切り）に変換します。
 * 空値や無効な値の場合は空文字列を返します。
 *
 * @param value - フォーマット対象の数値または文字列
 * @returns カンマ区切りの文字列、または空文字列
 *
 * 使用例:
 * ```tsx
 * formatNumber(1234567) // '1,234,567'
 * formatNumber('1234567') // '1,234,567'
 * formatNumber('') // ''
 * formatNumber(null) // ''
 * formatNumber('invalid') // ''
 * ```
 */
export function formatNumber(value: number | string): string {
  // 空値やnull、undefinedの場合は空文字列を返す
  if (value === '' || value === null || value === undefined) return ''

  // 文字列の場合は数値に変換
  const numValue = typeof value === 'string' ? parseFloat(value) : value

  // 数値変換に失敗した場合は空文字列を返す
  if (isNaN(numValue)) return ''

  // 日本語形式でカンマ区切りに変換
  return numValue.toLocaleString('ja-JP')
}

/**
 * カンマ区切りの文字列を数値に変換する関数
 *
 * カンマが含まれる文字列から数値を抽出し、数値型に変換します。
 * 無効な値の場合は0を返します。
 *
 * @param value - 変換対象の文字列
 * @returns 変換された数値、または0
 *
 * 使用例:
 * ```tsx
 * parseNumber('1,234,567') // 1234567
 * parseNumber('1234567') // 1234567
 * parseNumber('') // 0
 * parseNumber('invalid') // 0
 * ```
 */
export function parseNumber(value: string): number {
  // 空文字列の場合は0を返す
  if (!value) return 0

  // カンマを除去して数値に変換
  const cleanValue = value.replace(/,/g, '')
  const numValue = parseFloat(cleanValue)

  // 数値変換に失敗した場合は0を返す
  return isNaN(numValue) ? 0 : numValue
}

/**
 * 入力値を表示用にフォーマットする関数
 *
 * ユーザーが入力した値を、表示用のカンマ区切り形式に変換します。
 * 数値以外の文字は除去し、カンマ区切りで表示します。
 *
 * @param value - フォーマット対象の入力文字列
 * @returns フォーマットされた文字列、または空文字列
 *
 * 使用例:
 * ```tsx
 * formatInputValue('1234567') // '1,234,567'
 * formatInputValue('abc123def456') // '123,456'
 * formatInputValue('1,234,567') // '1,234,567'
 * formatInputValue('') // ''
 * formatInputValue('abc') // ''
 * ```
 */
export function formatInputValue(value: string): string {
  // 空文字列の場合は空文字列を返す
  if (!value) return ''

  // 数値以外の文字（カンマ以外）を除去
  // 正規表現 [^\d,] は、数字とカンマ以外の文字を表す
  const cleanValue = value.replace(/[^\d,]/g, '')

  // カンマを一旦除去して数値のみを抽出
  const numberOnly = cleanValue.replace(/,/g, '')

  // 数値が存在しない場合は空文字列を返す
  if (!numberOnly) return ''

  // 数値に変換してカンマ区切りで表示
  const numValue = parseInt(numberOnly, 10)
  if (isNaN(numValue)) return ''

  // 日本語形式でカンマ区切りに変換
  return numValue.toLocaleString('ja-JP')
}
