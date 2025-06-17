"use client"

import { Input } from "@/components/ui/input"
import { cn, formatInputValue, parseNumber } from "@/lib/utils"
import * as React from "react"

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number
  onChange?: (value: number) => void
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = 0, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>('')

    // 初期値の設定
    React.useEffect(() => {
      if (value !== undefined && value !== null) {
        if (value === 0) {
          setDisplayValue('')
        } else {
          setDisplayValue(formatInputValue(value.toString()))
        }
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value

      // 空の場合
      if (!inputValue) {
        setDisplayValue('')
        onChange?.(0)
        return
      }

      // 数値とカンマのみ許可
      const cleanValue = inputValue.replace(/[^\d,]/g, '')

      // 完全に空になった場合
      if (!cleanValue) {
        setDisplayValue('')
        onChange?.(0)
        return
      }

      // カンマを除去して数値に変換
      const numberValue = parseNumber(cleanValue)

      // 表示値を更新（リアルタイムフォーマット）
      setDisplayValue(cleanValue)

      // 親コンポーネントに数値を渡す
      onChange?.(numberValue)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // フォーカス時はカンマを除去した値を表示（編集しやすくする）
      if (displayValue) {
        const numberValue = parseNumber(displayValue)
        if (numberValue > 0) {
          setDisplayValue(numberValue.toString())
        }
      }

      // 元のonFocusイベントも実行
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // フォーカスが外れた時に最終的なフォーマットを適用
      if (displayValue) {
        const numberValue = parseNumber(displayValue)
        if (numberValue > 0) {
          setDisplayValue(formatInputValue(numberValue.toString()))
        } else {
          setDisplayValue('')
          // 空欄の場合は0ではなくundefinedを渡すことを検討
          // ただし、フォームバリデーションとの整合性のため0を維持
          onChange?.(0)
        }
      } else {
        // 完全に空の場合も0を設定
        onChange?.(0)
      }

      // 元のonBlurイベントも実行
      props.onBlur?.(e)
    }

    return (
      <div className="relative">
        <Input
          type="text"
          className={cn("no-spinner pr-8", className)}
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="0"
          {...props}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <span className="text-muted-foreground text-sm">円</span>
        </div>
      </div>
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
