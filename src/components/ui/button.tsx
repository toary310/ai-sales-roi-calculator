/**
 * ボタンコンポーネント
 *
 * このコンポーネントは、アプリケーション全体で使用される汎用的なボタンUIを提供します。
 * Radix UIのSlotコンポーネントとclass-variance-authorityを使用して、
 * 様々なバリアントとサイズに対応した柔軟なボタンを実装しています。
 *
 * 主な機能:
 * - 複数のバリアント（default, destructive, outline, secondary, ghost, link）
 * - 複数のサイズ（default, sm, lg, icon）
 * - アクセシビリティ対応（フォーカス管理、キーボードナビゲーション）
 * - 子要素として他のコンポーネントをレンダリング可能（asChild）
 * - 無効状態の自動スタイリング
 *
 * 使用例:
 * ```tsx
 * // 基本的な使用
 * <Button>クリックしてください</Button>
 *
 * // バリアントの指定
 * <Button variant="destructive">削除</Button>
 * <Button variant="outline">キャンセル</Button>
 *
 * // サイズの指定
 * <Button size="sm">小さいボタン</Button>
 * <Button size="lg">大きいボタン</Button>
 *
 * // アイコンボタン
 * <Button size="icon">
 *   <PlusIcon />
 * </Button>
 *
 * // リンクとして使用
 * <Button asChild>
 *   <Link href="/about">詳細へ</Link>
 * </Button>
 * ```
 */
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * ボタンのスタイルバリアント定義
 *
 * class-variance-authorityを使用して、ボタンの見た目を定義します。
 * 各バリアントは異なる用途に適したスタイルを持ちます。
 *
 * バリアントの説明:
 * - default: プライマリアクション用（青い背景）
 * - destructive: 危険なアクション用（赤い背景）
 * - outline: セカンダリアクション用（枠線のみ）
 * - secondary: 補助的なアクション用（グレー背景）
 * - ghost: テキストボタン用（背景なし）
 * - link: リンク風ボタン用（下線付き）
 *
 * サイズの説明:
 * - default: 標準サイズ
 * - sm: 小さいサイズ
 * - lg: 大きいサイズ
 * - icon: アイコン用の正方形サイズ
 */
const buttonVariants = cva(
  // 基本スタイル（全てのボタンに適用される共通スタイル）
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * ボタンコンポーネントのProps型定義
 *
 * HTMLButtonElementの標準属性に加えて、
 * バリアント、サイズ、asChildプロパティを拡張しています。
 *
 * @property asChild - trueの場合、子要素として他のコンポーネントをレンダリング
 * @property variant - ボタンの見た目バリアント
 * @property size - ボタンのサイズ
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * ボタンコンポーネント
 *
 * React.forwardRefを使用して、refを適切に転送します。
 * asChildプロパティがtrueの場合、Slotコンポーネントを使用して
 * 子要素を直接レンダリングします。
 *
 * @param className - 追加のCSSクラス名
 * @param variant - ボタンのバリアント
 * @param size - ボタンのサイズ
 * @param asChild - 子要素としてレンダリングするかどうか
 * @param props - その他のHTMLButtonElementの属性
 * @param ref - 転送されるref
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // asChildがtrueの場合はSlotコンポーネント、そうでなければbutton要素を使用
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
