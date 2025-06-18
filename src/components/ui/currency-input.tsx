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
    // 数値をカンマ区切り文字列に変換
    const formatNumber = (num: number): string => {
      if (num === 0) return ''
      return num.toLocaleString()
    }

    // 文字列から数値を抽出
    const parseNumber = (str: string): number => {
      const cleaned = str.replace(/[^\d]/g, '')
      return cleaned === '' ? 0 : parseInt(cleaned, 10)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const numericValue = parseNumber(inputValue)
      onChange?.(numericValue)
    }

    return (
      <div className="relative">
        <Input
          type="text"
          className={cn("no-spinner pr-8", className)}
          ref={ref}
          value={formatNumber(value)}
          onChange={handleChange}
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
