/**
 * 入力フィールドコンポーネント
 *
 * このコンポーネントは、アプリケーション全体で使用される汎用的な入力フィールドUIを提供します。
 * HTMLのinput要素をベースに、Tailwind CSSでスタイリングされた統一されたデザインを実装しています。
 *
 * 主な機能:
 * - 全てのHTML input要素のtypeに対応
 * - アクセシビリティ対応（フォーカス管理、無効状態）
 * - レスポンシブデザイン（モバイルとデスクトップで異なるテキストサイズ）
 * - ファイルアップロード対応
 * - プレースホルダーテキストのスタイリング
 * - 無効状態の自動スタイリング
 *
 * 使用例:
 * ```tsx
 * // 基本的なテキスト入力
 * <Input placeholder="名前を入力してください" />
 *
 * // パスワード入力
 * <Input type="password" placeholder="パスワードを入力" />
 *
 * // 数値入力
 * <Input type="number" placeholder="数量" />
 *
 * // ファイルアップロード
 * <Input type="file" accept="image/*" />
 *
 * // 無効状態
 * <Input disabled placeholder="無効な入力フィールド" />
 *
 * // カスタムクラス名の追加
 * <Input className="w-64" placeholder="幅を指定" />
 * ```
 */
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * 入力フィールドコンポーネント
 *
 * React.forwardRefを使用して、refを適切に転送します。
 * HTML input要素の全ての属性とイベントハンドラーをサポートし、
 * 統一されたスタイリングを適用します。
 *
 * スタイルの特徴:
 * - フレックスレイアウトで幅いっぱいに表示
 * - 角丸の境界線とシャドウ
 * - フォーカス時のリング表示
 * - プレースホルダーテキストの色調整
 * - ファイルアップロード時のスタイル調整
 * - 無効状態の視覚的フィードバック
 * - レスポンシブなテキストサイズ
 *
 * @param className - 追加のCSSクラス名
 * @param type - input要素のtype属性
 * @param props - その他のHTMLInputElementの属性
 * @param ref - 転送されるref
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // 基本スタイル（全ての入力フィールドに適用される共通スタイル）
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
