/**
 * メインレイアウトコンポーネント
 *
 * このコンポーネントは、アプリケーション全体の基本的なページ構造を提供します。
 * ヘッダー、メインコンテンツ、フッターを含む一貫したレイアウトを実装します。
 *
 * 構造:
 * - ヘッダー（固定位置）
 * - メインコンテンツ（フレックス拡大で残りのスペースを占有）
 * - フッター（下部固定）
 *
 * @component
 * @example
 * ```tsx
 * // ページコンポーネントでの使用例
 * export default function HomePage() {
 *   return (
 *     <MainLayout>
 *       <h1>ようこそ</h1>
 *       <p>ページコンテンツ...</p>
 *     </MainLayout>
 *   )
 * }
 * ```
 */

import { Footer } from "./footer"
import { Header } from "./header"

/**
 * MainLayoutコンポーネントのプロパティ
 * @interface
 * @property {React.ReactNode} children - レイアウト内に表示する子要素
 */
interface MainLayoutProps {
  children: React.ReactNode
}

/**
 * メインレイアウトコンポーネントの実装
 *
 * @param props - コンポーネントのプロパティ
 * @param props.children - レイアウト内に表示する子要素
 * @returns {JSX.Element} レイアウト構造を持つReact要素
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
