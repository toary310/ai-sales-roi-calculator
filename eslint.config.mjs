/**
 * ESLint設定ファイル (eslint.config.mjs)
 *
 * このファイルは、ESLintの動作を制御する設定ファイルです。
 * ESLintは、JavaScript/TypeScriptコードの品質を保つための静的解析ツールで、
 * コードの一貫性、バグの早期発見、ベストプラクティスの適用を支援します。
 *
 * 主な設定項目:
 * - TypeScript ESLint: TypeScriptコードの静的解析
 * - React ESLint: Reactコンポーネントのベストプラクティス
 * - グローバル変数: ブラウザ環境のグローバル変数の定義
 *
 * 参考: https://eslint.org/
 */

// 必要なモジュールのインポート
import pluginReact from "eslint-plugin-react"; // React用ESLintプラグイン
import { defineConfig } from "eslint/config"; // ESLint設定定義ヘルパー
import globals from "globals"; // ブラウザ環境のグローバル変数定義
import tseslint from "typescript-eslint"; // TypeScript用ESLint設定

// ESLint設定の定義
export default defineConfig([
  // 基本設定: 全てのJavaScript/TypeScriptファイルに適用
  {
    // 対象ファイルの指定
    // 以下の拡張子のファイルがESLintの解析対象となります
    files: [
      "**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"  // JavaScript、TypeScript、JSX、TSXファイル
    ],

    // 言語オプションの設定
    languageOptions: {
      // ブラウザ環境のグローバル変数を有効化
      // window, document, console, fetch等のブラウザAPIが使用可能になります
      globals: globals.browser
    }
  },

  // TypeScript ESLintの推奨設定を適用
  // TypeScript特有のルール（型チェック、型安全性等）が有効になります
  tseslint.configs.recommended,

  // React ESLintの推奨設定を適用
  // Reactコンポーネントのベストプラクティス（フックのルール、JSX等）が有効になります
  pluginReact.configs.flat.recommended,
]);
