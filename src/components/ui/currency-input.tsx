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

    // 初期値設定
    React.useEffect(() => {
      if (value === 0) {
        setDisplayValue('')
      } else {
        setDisplayValue(value.toString())
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value

      // 数値のみ許可
      const cleanValue = inputValue.replace(/[^\d]/g, '')

      setDisplayValue(cleanValue)

      const numericValue = cleanValue === '' ? 0 : parseInt(cleanValue, 10)
      onChange?.(numericValue)
    }

    return (
      <div className="relative">
        <Input
          type="text"
          className={cn("no-spinner pr-8", className)}
          ref={ref}
          value={displayValue}
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
