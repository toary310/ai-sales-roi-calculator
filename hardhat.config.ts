/**
 * Hardhat設定ファイル (hardhat.config.ts)
 *
 * このファイルは、Hardhatの動作を制御する設定ファイルです。
 * Hardhatは、Ethereumスマートコントラクトの開発、テスト、デプロイのための
 * 開発環境を提供するフレームワークです。
 *
 * 主な設定項目:
 * - Solidityコンパイラ: スマートコントラクトのコンパイル設定
 * - ネットワーク設定: テストネットやメインネットの接続設定
 * - 環境変数: 秘密鍵やRPC URLの管理
 * - TypeScript統合: TypeScriptでの開発サポート
 *
 * 参考: https://hardhat.org/
 */

// 環境変数の読み込み
import { config as loadEnv } from 'dotenv';
// .env.localファイルから環境変数を読み込み
// 秘密鍵やRPC URLなどの機密情報を安全に管理するために使用
loadEnv({ path: '.env.local' });   // ← 必ず最初に実行

// Hardhatツールボックスのインポート
// テスト、デプロイ、検証などの便利な機能を提供
import "@nomicfoundation/hardhat-toolbox";

// Hardhat設定の型定義
import { HardhatUserConfig } from "hardhat/config";

// TypeScript統合のための設定
import { register } from "ts-node";
import "ts-node/register";

// TypeScript設定の登録
// tsconfig.hardhat.jsonファイルを使用してTypeScriptの設定を適用
register({ project: "tsconfig.hardhat.json" })

// 環境変数から設定値を取得
// デフォルト値を設定することで、環境変数が未設定でも動作するようにしています
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"
const AMOY_RPC = process.env.AMOY_RPC || "https://rpc-amoy.polygon.technology"

// Hardhat設定オブジェクトの定義
const config: HardhatUserConfig = {
  // Solidityコンパイラの設定
  solidity: "0.8.24",  // 使用するSolidityのバージョン

  // ネットワーク設定
  // デプロイ先やテスト用のネットワークを定義
  networks: {
    // Amoyテストネット（Polygonのテストネット）
    amoy: {
      url: AMOY_RPC,           // RPCエンドポイントのURL
      chainId: 80002,          // チェーンID（Amoyテストネット）
      accounts: PRIVATE_KEY !== "0x000..." ? [PRIVATE_KEY] : [],  // デプロイ用の秘密鍵
    },
  },
}

// 設定オブジェクトをエクスポート
export default config
