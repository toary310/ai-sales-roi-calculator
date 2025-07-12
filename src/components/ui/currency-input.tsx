"use client"

/**
 * 通貨入力コンポーネント
 *
 * このコンポーネントは、日本円の金額を入力するための専用入力フィールドです。
 * 数値の自動フォーマット（カンマ区切り）、円マークの表示、数値以外の文字の除去
 * などの機能を提供し、ユーザビリティを向上させます。
 *
 * 主な機能:
 * - 数値の自動カンマ区切り表示
 * - 数値以外の文字の自動除去
 * - 円マークの自動表示
 * - 数値型での値管理
 * - プレースホルダーテキスト
 * - アクセシビリティ対応
 *
 * 使用例:
 * ```tsx
 * // 基本的な使用
 * <CurrencyInput
 *   value={amount}
 *   onChange={setAmount}
 *   placeholder="金額を入力"
 * />
 *
 * // フォームでの使用
 * <form>
 *   <label>月間売上</label>
 *   <CurrencyInput
 *     value={monthlySales}
 *     onChange={setMonthlySales}
 *   />
 * </form>
 *
 * // 無効状態
 * <CurrencyInput
 *   value={amount}
 *   onChange={setAmount}
 *   disabled
 * />
 * ```
 */
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import * as React from "react"

/**
 * 通貨入力コンポーネントのProps型定義
 *
 * HTMLInputElementの標準属性から、onChangeとvalueを除外し、
 * 数値型に特化した型定義に変更しています。
 *
 * @property value - 入力値（数値型）
 * @property onChange - 値変更時のコールバック（数値型の値を渡す）
 */
export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number
  onChange?: (value: number) => void
}

/**
 * 通貨入力コンポーネント
 *
 * 数値をカンマ区切りで表示し、ユーザーが入力した値を数値型で管理します。
 * 円マークを右側に表示し、視覚的に通貨入力であることを明確にします。
 *
 * 処理の流れ:
 * 1. 数値をカンマ区切り文字列に変換して表示
 * 2. ユーザーの入力を数値のみに抽出
 * 3. 抽出した数値を親コンポーネントに通知
 *
 * @param className - 追加のCSSクラス名
 * @param value - 現在の値（数値型）
 * @param onChange - 値変更時のコールバック
 * @param props - その他のHTMLInputElementの属性
 * @param ref - 転送されるref
 */
const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = 0, onChange, ...props }, ref) => {
    /**
     * 数値をカンマ区切り文字列に変換する関数
     *
     * 0の場合は空文字列を返し、それ以外の場合は
     * toLocaleString()を使用してカンマ区切りに変換します。
     *
     * @param num - 変換対象の数値
     * @returns カンマ区切りの文字列、または空文字列
     */
    const formatNumber = (num: number): string => {
      if (num === 0) return ''
      return num.toLocaleString()
    }

    /**
     * 文字列から数値を抽出する関数
     *
     * 数値以外の文字を除去し、残った文字列を数値に変換します。
     * 空文字列の場合は0を返します。
     *
     * @param str - 変換対象の文字列
     * @returns 抽出された数値
     */
    const parseNumber = (str: string): number => {
      // 数値以外の文字を除去（正規表現 [^\d] は数字以外の文字を表す）
      const cleaned = str.replace(/[^\d]/g, '')
      return cleaned === '' ? 0 : parseInt(cleaned, 10)
    }

    /**
     * 入力値変更時のハンドラー
     *
     * ユーザーが入力した値を数値に変換し、
     * 親コンポーネントに通知します。
     *
     * @param e - 入力イベント
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const numericValue = parseNumber(inputValue)
      onChange?.(numericValue)
    }

    return (
      <div className="relative">
        {/* メインの入力フィールド */}
        <Input
          type="text"
          className={cn("no-spinner pr-8", className)}
          ref={ref}
          value={formatNumber(value)}
          onChange={handleChange}
          placeholder="0"
          {...props}
        />
        {/* 円マークの表示（絶対位置で右側に配置） */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-muted-foreground text-sm">円</span>
        </div>
      </div>
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
