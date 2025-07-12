/**
 * Tailwind CSS設定ファイル (tailwind.config.js)
 *
 * このファイルは、Tailwind CSSの動作をカスタマイズする設定ファイルです。
 * カラーテーマ、コンテナ設定、カスタムユーティリティ、プラグインなどの設定が含まれています。
 *
 * 主な設定項目:
 * - コンテンツパス: CSSクラスを生成する対象ファイル
 * - テーマ設定: カラー、スペーシング、タイポグラフィ等のカスタマイズ
 * - プラグイン: 追加機能の有効化
 *
 * 参考: https://tailwindcss.com/docs/configuration
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  // ダークモード設定（現在はコメントアウト）
  // 'class'を指定すると、HTML要素のclass属性でダークモードを制御できます。
  // 例: <html class="dark"> でダークモードを有効化
  // darkMode: ['class'],

  // コンテンツパス設定
  // Tailwind CSSがCSSクラスを生成する対象となるファイルを指定します。
  // これらのファイル内で使用されているクラス名がCSSに含まれます。
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',      // pagesディレクトリ内のファイル
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // componentsディレクトリ内のファイル
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',        // appディレクトリ内のファイル（App Router）
  ],

  // テーマ設定
  // Tailwind CSSのデフォルトテーマをカスタマイズします。
  theme: {
    // コンテナ設定
    // .containerクラスの動作をカスタマイズします。
    container: {
      center: true,  // コンテナを中央揃え
      padding: {
        DEFAULT: '1rem',  // デフォルトのパディング（16px）
        sm: '2rem',       // 小さい画面でのパディング（32px）
        lg: '4rem',       // 大きい画面でのパディング（64px）
        xl: '5rem',       // 特大画面でのパディング（80px）
        '2xl': '6rem',    // 2倍特大画面でのパディング（96px）
      },
    },

    // テーマの拡張設定
    // Tailwind CSSのデフォルトテーマを拡張し、カスタムユーティリティを追加します。
    extend: {
      // 背景画像のカスタマイズ
      // カスタムグラデーション背景を定義します。
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',  // 放射状グラデーション
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'  // 円錐グラデーション
      },

      // 角丸のカスタマイズ
      // CSS変数を使用して動的な角丸サイズを定義します。
      borderRadius: {
        lg: 'var(--radius)',                    // 大きい角丸
        md: 'calc(var(--radius) - 2px)',        // 中程度の角丸（-2px）
        sm: 'calc(var(--radius) - 4px)'         // 小さい角丸（-4px）
      },

      // カラーテーマのカスタマイズ
      // CSS変数を使用してダークモード対応のカラーテーマを定義します。
      colors: {
        // 基本カラー
        background: 'hsl(var(--background))',           // 背景色
        foreground: 'hsl(var(--foreground))',           // 前景色（テキスト色）

        // カード関連
        card: {
          DEFAULT: 'hsl(var(--card))',                  // カード背景色
          foreground: 'hsl(var(--card-foreground))'     // カード前景色
        },

        // ポップオーバー関連
        popover: {
          DEFAULT: 'hsl(var(--popover))',               // ポップオーバー背景色
          foreground: 'hsl(var(--popover-foreground))'  // ポップオーバー前景色
        },

        // プライマリカラー
        primary: {
          DEFAULT: 'hsl(var(--primary))',               // プライマリ色
          foreground: 'hsl(var(--primary-foreground))'  // プライマリ前景色
        },

        // セカンダリカラー
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',             // セカンダリ色
          foreground: 'hsl(var(--secondary-foreground))' // セカンダリ前景色
        },

        // ミュートカラー（薄い色）
        muted: {
          DEFAULT: 'hsl(var(--muted))',                 // ミュート色
          foreground: 'hsl(var(--muted-foreground))'    // ミュート前景色
        },

        // アクセントカラー
        accent: {
          DEFAULT: 'hsl(var(--accent))',                // アクセント色
          foreground: 'hsl(var(--accent-foreground))'   // アクセント前景色
        },

        // 破壊的アクション用カラー（削除、エラー等）
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',           // 破壊的色
          foreground: 'hsl(var(--destructive-foreground))' // 破壊的前景色
        },

        // その他のカラー
        border: 'hsl(var(--border))',                   // 境界線色
        input: 'hsl(var(--input))',                     // 入力フィールド色
        ring: 'hsl(var(--ring))',                       // フォーカスリング色

        // チャート用カラー（グラフやチャートで使用）
        chart: {
          '1': 'hsl(var(--chart-1))',                   // チャート色1
          '2': 'hsl(var(--chart-2))',                   // チャート色2
          '3': 'hsl(var(--chart-3))',                   // チャート色3
          '4': 'hsl(var(--chart-4))',                   // チャート色4
          '5': 'hsl(var(--chart-5))'                    // チャート色5
        }
      }
    }
  },

  // プラグイン設定
  // Tailwind CSSの機能を拡張するプラグインを有効にします。
  plugins: [
    require("tailwindcss-animate")  // アニメーション用プラグイン
  ],
}
