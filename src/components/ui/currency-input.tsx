"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import * as React from "react"

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number
  onChange?: (value: number) => void
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = 0, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>('')
    const [isFocused, setIsFocused] = React.useState(false)

    // 初期値の設定（外部からのvalue変更時のみ）
    React.useEffect(() => {
      // フォーカス中は外部からの変更を無視（ユーザー入力を優先）
      if (isFocused) return

      if (value !== undefined && value !== null) {
        if (value === 0) {
          setDisplayValue('')
        } else {
          setDisplayValue(value.toLocaleString('ja-JP'))
        }
      }
    }, [value, isFocused])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value

      // 空の場合
      if (!inputValue) {
        setDisplayValue('')
        onChange?.(0)
        return
      }

      // 数値のみ許可
      const cleanValue = inputValue.replace(/[^\d]/g, '')

      // 完全に空になった場合
      if (!cleanValue) {
        setDisplayValue('')
        onChange?.(0)
        return
      }

      // 数値に変換
      const numberValue = parseInt(cleanValue, 10)
      if (isNaN(numberValue)) {
        setDisplayValue('')
        onChange?.(0)
        return
      }

      // フォーカス中は生の数値、フォーカス外はフォーマット済み
      if (isFocused) {
        setDisplayValue(cleanValue)
      } else {
        setDisplayValue(numberValue.toLocaleString('ja-JP'))
      }

      // 親コンポーネントに数値を渡す
      onChange?.(numberValue)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)

      // フォーカス時はカンマを除去した値を表示（編集しやすくする）
      if (displayValue) {
        const cleanValue = displayValue.replace(/,/g, '')
        if (cleanValue) {
          setDisplayValue(cleanValue)
        }
      }

      // 元のonFocusイベントも実行
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)

      // フォーカスが外れた時に最終的なフォーマットを適用
      if (displayValue) {
        const cleanValue = displayValue.replace(/,/g, '')
        const numberValue = parseInt(cleanValue, 10)
        if (!isNaN(numberValue) && numberValue > 0) {
          setDisplayValue(numberValue.toLocaleString('ja-JP'))
          onChange?.(numberValue)
        } else {
          setDisplayValue('')
          onChange?.(0)
        }
      } else {
        // 完全に空の場合も0を設定
        setDisplayValue('')
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
