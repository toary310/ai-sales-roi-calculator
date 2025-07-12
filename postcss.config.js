/**
 * PostCSS設定ファイル (postcss.config.js)
 *
 * このファイルは、PostCSSの動作を制御する設定ファイルです。
 * PostCSSは、CSSを処理・変換するためのツールで、Tailwind CSSやAutoprefixerなどの
 * プラグインを使用してCSSを最適化します。
 *
 * 主な設定項目:
 * - Tailwind CSS: ユーティリティファーストCSSフレームワーク
 * - Autoprefixer: ベンダープレフィックスの自動追加
 *
 * 参考: https://postcss.org/
 */

module.exports = {
  // PostCSSプラグインの設定
  plugins: {
    // Tailwind CSSプラグイン
    // ユーティリティクラスベースのCSSフレームワークを有効にします。
    // 設定は tailwind.config.js ファイルで管理されます。
    tailwindcss: {},

    // Autoprefixerプラグイン
    // CSSプロパティにベンダープレフィックス（-webkit-, -moz-, -ms-等）を
    // 自動的に追加し、ブラウザ互換性を向上させます。
    // 例: display: flex → display: -webkit-flex; display: -ms-flexbox; display: flex;
    autoprefixer: {},
  },
}
