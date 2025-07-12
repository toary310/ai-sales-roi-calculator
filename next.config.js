/**
 * Next.js設定ファイル (next.config.js)
 *
 * このファイルは、Next.jsアプリケーションのビルドと実行時の動作を制御する設定ファイルです。
 * パフォーマンス最適化、セキュリティ設定、画像最適化などの設定が含まれています。
 *
 * 主な設定項目:
 * - 実験的機能: 最新のNext.js機能の有効化
 * - コンパイラ設定: ビルド時の最適化
 * - 画像最適化: 画像フォーマットとパフォーマンス
 * - セキュリティヘッダー: セキュリティ強化
 *
 * 参考: https://nextjs.org/docs/app/api-reference/file-conventions/next-config
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * 実験的機能の設定
   *
   * Next.js 15の最新機能や実験的な機能を有効にします。
   * これらの機能は将来的に標準機能になる可能性があります。
   */
  experimental: {
    /**
     * パッケージインポートの最適化
     *
     * 指定されたパッケージのインポートを最適化し、
     * バンドルサイズを削減します。
     *
     * - lucide-react: アイコンライブラリ
     * - recharts: チャートライブラリ
     */
    optimizePackageImports: ['lucide-react', 'recharts'],
  },

  /**
   * コンパイラ設定
   *
   * Next.jsのコンパイラによるコード最適化の設定を行います。
   */
  compiler: {
    /**
     * コンソールログの削除
     *
     * 本番環境（production）では、console.log等の
     * デバッグ用コードを自動的に削除します。
     * これにより、バンドルサイズが削減され、パフォーマンスが向上します。
     */
    removeConsole: process.env.NODE_ENV === 'production',
  },

  /**
   * 画像最適化設定
   *
   * Next.jsの画像最適化機能の設定を行います。
   * 自動的な画像フォーマット変換とサイズ最適化を提供します。
   */
  images: {
    /**
     * サポートする画像フォーマット
     *
     * モダンな画像フォーマットを指定することで、
     * ブラウザがサポートしている場合は自動的に変換されます。
     *
     * - image/webp: Googleが開発した高圧縮画像フォーマット
     * - image/avif: 最新の高圧縮画像フォーマット
     */
    formats: ['image/webp', 'image/avif'],
  },

  /**
   * セキュリティヘッダーの設定
   *
   * 全てのページにセキュリティヘッダーを追加し、
   * セキュリティリスクを軽減します。
   *
   * @returns セキュリティヘッダーの設定配列
   */
  async headers() {
    return [
      {
        // 全てのページに適用（正規表現で全パスをマッチ）
        source: '/(.*)',
        headers: [
          {
            /**
             * X-Frame-Options: クリックジャッキング攻撃の防止
             *
             * DENYを指定することで、このサイトをiframe内で
             * 表示することを完全に禁止します。
             */
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            /**
             * X-Content-Type-Options: MIME型スニッフィング攻撃の防止
             *
             * nosniffを指定することで、ブラウザがContent-Typeヘッダーを
             * 無視してファイルの内容からMIME型を推測することを防ぎます。
             */
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            /**
             * Referrer-Policy: リファラー情報の送信制御
             *
             * origin-when-cross-originを指定することで、
             * 同一オリジン内では完全なURLを送信し、
             * クロスオリジンではオリジンのみを送信します。
             */
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

// 設定オブジェクトをエクスポート
module.exports = nextConfig
