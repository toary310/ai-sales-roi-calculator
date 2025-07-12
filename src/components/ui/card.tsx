/**
 * カードコンポーネント群
 *
 * このファイルは、情報を整理して表示するためのカードUIコンポーネント群を提供します。
 * 複数のサブコンポーネントを組み合わせることで、構造化された情報表示を実現します。
 *
 * 提供されるコンポーネント:
 * - Card: カードのメインコンテナ
 * - CardHeader: カードのヘッダー部分（タイトルと説明）
 * - CardTitle: カードのタイトル
 * - CardDescription: カードの説明文
 * - CardContent: カードのメインコンテンツ
 * - CardFooter: カードのフッター部分（アクションボタン等）
 *
 * 使用例:
 * ```tsx
 * // 基本的なカード
 * <Card>
 *   <CardHeader>
 *     <CardTitle>カードタイトル</CardTitle>
 *     <CardDescription>カードの説明文</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>カードのメインコンテンツ</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>アクション</Button>
 *   </CardFooter>
 * </Card>
 *
 * // シンプルなカード
 * <Card>
 *   <CardContent>
 *     <p>シンプルなコンテンツ</p>
 *   </CardContent>
 * </Card>
 * ```
 */
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * カードのメインコンテナ
 *
 * 情報を整理して表示するための基本的なカードコンテナです。
 * 角丸の境界線、背景色、シャドウを持ち、統一されたデザインを提供します。
 *
 * @param className - 追加のCSSクラス名
 * @param props - その他のHTMLDivElementの属性
 * @param ref - 転送されるref
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

/**
 * カードのヘッダー部分
 *
 * カードの上部に配置され、タイトルと説明文を含むエリアです。
 * 縦方向のフレックスレイアウトで、タイトルと説明文を適切に配置します。
 *
 * @param className - 追加のCSSクラス名
 * @param props - その他のHTMLDivElementの属性
 * @param ref - 転送されるref
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * カードのタイトル
 *
 * カードの主要な見出しを表示するコンポーネントです。
 * 太字のフォントと適切な行間、文字間隔で視認性を向上させます。
 *
 * @param className - 追加のCSSクラス名
 * @param props - その他のHTMLDivElementの属性
 * @param ref - 転送されるref
 */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/**
 * カードの説明文
 *
 * カードのタイトルを補完する説明文を表示するコンポーネントです。
 * 小さめのフォントサイズと薄い色で、メインコンテンツとの区別を明確にします。
 *
 * @param className - 追加のCSSクラス名
 * @param props - その他のHTMLDivElementの属性
 * @param ref - 転送されるref
 */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * カードのメインコンテンツ
 *
 * カードの主要な情報を表示するエリアです。
 * ヘッダーとの間隔を調整し、適切なパディングを提供します。
 *
 * @param className - 追加のCSSクラス名
 * @param props - その他のHTMLDivElementの属性
 * @param ref - 転送されるref
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/**
 * カードのフッター部分
 *
 * カードの下部に配置され、アクションボタンや補足情報を含むエリアです。
 * 横方向のフレックスレイアウトで、複数の要素を適切に配置します。
 *
 * @param className - 追加のCSSクラス名
 * @param props - その他のHTMLDivElementの属性
 * @param ref - 転送されるref
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }

