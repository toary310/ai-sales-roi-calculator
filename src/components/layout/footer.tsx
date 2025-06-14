import { Separator } from "@/components/ui/separator"
import { Calculator, Github, Mail, Twitter } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* ブランド情報 */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Calculator className="h-6 w-6" />
              <span className="font-bold text-lg">AI Sales ROI Calculator</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI導入による営業効果とROIを簡単に計算できるツールです。
              データドリブンな意思決定をサポートします。
            </p>
          </div>

          {/* ナビゲーション */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">ナビゲーション</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                  ROI計算
                </Link>
              </li>
              <li>
                <Link href="/results" className="text-muted-foreground hover:text-foreground transition-colors">
                  結果表示
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  サービス説明
                </Link>
              </li>
            </ul>
          </div>

          {/* 機能 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">機能</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">ROI計算</li>
              <li className="text-muted-foreground">効果分析</li>
              <li className="text-muted-foreground">レポート出力</li>
              <li className="text-muted-foreground">データ比較</li>
            </ul>
          </div>

          {/* お問い合わせ */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">お問い合わせ</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} AI Sales ROI Calculator. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              利用規約
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
