/**
 * ルートレイアウトコンポーネント
 *
 * このファイルは、Next.js App Routerのルートレイアウトを定義します。
 * アプリケーション全体の共通レイアウト、メタデータ、プロバイダーの設定を行います。
 *
 * 主な機能:
 * - アプリケーション全体のHTML構造定義
 * - SEO対応のメタデータ設定
 * - フォント設定（Inter）
 * - テーマプロバイダーの設定
 * - Web3プロバイダーの設定
 * - トースト通知の設定
 * - グローバルCSSの読み込み
 *
 * レイアウトの構造:
 * - html: 日本語設定
 * - body: Interフォント適用
 * - Web3Provider: ウォレット接続機能
 * - ThemeProvider: ダーク/ライトテーマ切り替え
 * - MainLayout: ヘッダー・フッター・メインコンテンツ
 * - Toaster: トースト通知表示
 */
import { MainLayout } from '@/components/layout'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Web3Provider } from '@/components/providers/web3-provider'
import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

/**
 * Interフォントの設定
 *
 * Google FontsからInterフォントを読み込み、アプリケーション全体で使用します。
 * サブセットとして'latin'を指定し、ラテン文字のみを読み込んでパフォーマンスを最適化します。
 */
const inter = Inter({ subsets: ['latin'] })

/**
 * アプリケーションのメタデータ設定
 *
 * SEO対策、SNSシェア、検索エンジン最適化のためのメタデータを定義します。
 * 各プロパティは検索エンジンやSNSプラットフォームで適切に表示されるよう設定されています。
 */
export const metadata: Metadata = {
  // 基本的なメタデータ
  title: 'AI Sales ROI Calculator - AI営業投資収益率計算ツール',
  description: 'AI導入による営業効果を正確に予測し、投資収益率を可視化する次世代ツール。業界別・企業規模別の詳細分析で高精度なROI計算を実現。',
  keywords: ['AI', 'ROI', '営業', '投資収益率', '計算ツール', 'セールス', 'ビジネス'],
  authors: [{ name: 'AI Sales ROI Calculator Team' }],
  creator: 'AI Sales ROI Calculator',
  publisher: 'AI Sales ROI Calculator',

  // 自動検出の無効化（電話番号やメールアドレスの自動リンク化を防ぐ）
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // メタデータのベースURL設定
  metadataBase: new URL('http://localhost:3000'),

  // Open Graph（Facebook、Twitter等のSNSシェア用）
  openGraph: {
    title: 'AI Sales ROI Calculator',
    description: 'AI導入による営業効果を正確に予測し、投資収益率を可視化する次世代ツール',
    url: 'http://localhost:3000',
    siteName: 'AI Sales ROI Calculator',
    locale: 'ja_JP',
    type: 'website',
  },

  // Twitter Card設定
  twitter: {
    card: 'summary_large_image',
    title: 'AI Sales ROI Calculator',
    description: 'AI導入による営業効果を正確に予測し、投資収益率を可視化する次世代ツール',
    creator: '@ai_sales_roi',
  },

  // 検索エンジン向け設定
  robots: {
    index: true,        // ページのインデックス化を許可
    follow: true,       // リンクの追跡を許可
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,    // 動画プレビューの最大長
      'max-image-preview': 'large', // 画像プレビューのサイズ
      'max-snippet': -1,          // スニペットの最大長
    },
  },
}

/**
 * ルートレイアウトコンポーネント
 *
 * アプリケーション全体のHTML構造を定義し、必要なプロバイダーを設定します。
 * このレイアウトは全てのページで共通して使用されます。
 *
 * @param children - ページコンポーネント（Next.jsが自動的に注入）
 * @returns アプリケーション全体のHTML構造
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* Web3プロバイダー: ウォレット接続機能を提供 */}
        <Web3Provider>
          {/* テーマプロバイダー: ダーク/ライトテーマの切り替え機能を提供 */}
          <ThemeProvider
            attribute="class"           // CSSクラスでテーマを切り替え
            defaultTheme="light"        // デフォルトテーマ
            enableSystem={false}        // システム設定の自動検出を無効化
            disableTransitionOnChange   // テーマ切り替え時のトランジションを無効化
            suppressHydrationWarning    // ハイドレーション警告を抑制
          >
            {/* メインレイアウト: ヘッダー・フッター・メインコンテンツエリア */}
            <MainLayout>{children}</MainLayout>

            {/* トースト通知: アプリケーション全体で使用される通知システム */}
            <Toaster />
          </ThemeProvider>
        </Web3Provider>
      </body>
    </html>
  )
}
