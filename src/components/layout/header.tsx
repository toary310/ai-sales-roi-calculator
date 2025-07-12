/**
 * ヘッダーコンポーネント
 *
 * このコンポーネントは、アプリケーションの上部に表示される固定ヘッダーを実装します。
 * ロゴ、ナビゲーションメニュー、ウォレット接続ボタンなどの主要な操作要素を含みます。
 *
 * 特徴:
 * - 固定位置（sticky）でスクロール時も表示
 * - レスポンシブデザイン（モバイル対応）
 * - 半透明な背景とブラー効果
 * - アクセシビリティ対応のナビゲーション
 *
 * 主要セクション:
 * 1. ロゴ（ホームへのリンク）
 * 2. ナビゲーションメニュー（PC表示のみ）
 * 3. アクションボタン（計算開始、ウォレット接続）
 */

"use client"

import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from "@/components/ui/connect-wallet-button"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList
} from "@/components/ui/navigation-menu"

import { BarChart3, Calculator, Info } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

/**
 * ヘッダーコンポーネントの実装
 *
 * @returns {JSX.Element} ヘッダー要素
 */
export function Header() {
  // 現在のパス名を取得（条件付きレンダリングに使用）
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* ロゴセクション - ホームへのリンクとアプリ名 */}
        <Link href="/" className="flex items-center space-x-2">
          <Calculator className="h-6 w-6" />
          <span className="font-bold text-xl">AI Sales ROI Calculator</span>
        </Link>

        {/* ナビゲーションメニュー - PCサイズ以上で表示 */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {/* ホームリンク */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  ホーム
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* ROI計算リンク */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/calculator" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  <Calculator className="mr-2 h-4 w-4" />
                  ROI計算
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* 結果表示リンク */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/results" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  結果表示
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* サービス説明リンク */}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  <Info className="mr-2 h-4 w-4" />
                  サービス説明
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* アクションボタンセクション */}
        <div className="flex items-center space-x-2">
          {/* 計算開始ボタン - 計算ページ以外で表示 */}
          {pathname !== '/calculator' && (
            <Button asChild className="hidden sm:inline-flex">
              <Link href="/calculator">
                <Calculator className="mr-2 h-4 w-4" />
                計算開始
              </Link>
            </Button>
          )}
          {/* ウォレット接続ボタン */}
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  )
}
