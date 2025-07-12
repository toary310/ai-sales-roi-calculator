/**
 * AI分析APIルート
 *
 * このファイルは、ROI計算結果を基にAIによる詳細分析を提供するAPIエンドポイントです。
 * OpenAI APIを使用して、ROIデータを分析し、ビジネス洞察と推奨事項を生成します。
 *
 * エンドポイント:
 * - POST /api/ai-analysis: ROIデータを分析し、AI洞察を生成
 * - GET /api/ai-analysis: APIの動作確認用
 *
 * 主な機能:
 * - ROIデータの受信と検証
 * - OpenAI APIを使用したAI分析
 * - エラーハンドリングとログ出力
 * - リクエストIDによる追跡
 *
 * 使用例:
 * ```javascript
 * // POST リクエスト
 * const response = await fetch('/api/ai-analysis', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     industry: 'technology',
 *     roi: 150,
 *     paybackPeriod: 8
 *   })
 * })
 *
 * // GET リクエスト（動作確認）
 * const response = await fetch('/api/ai-analysis')
 * ```
 */
import { AIAnalysisService } from '@/lib/ai/analysis-service'
import { ROIData } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST リクエストハンドラー
 *
 * ROIデータを受け取り、AI分析を実行して結果を返します。
 * リクエストIDを使用してログを追跡し、エラーハンドリングを提供します。
 *
 * 処理の流れ:
 * 1. リクエストIDの生成（ログ追跡用）
 * 2. OpenAI APIキーの確認
 * 3. リクエストボディの解析と検証
 * 4. AI分析サービスの呼び出し
 * 5. 結果の返却
 *
 * @param request - Next.jsのリクエストオブジェクト
 * @returns AI分析結果またはエラーレスポンス
 */
export async function POST(request: NextRequest) {
  // リクエストIDを生成（ログ追跡とデバッグ用）
  const requestId = Math.random().toString(36).substring(2, 11)
  console.log(`🚀 API Route [${requestId}]: AI分析リクエスト受信`)

  try {
    // OpenAI APIキーの設定状況を確認
    const hasApiKey = !!process.env.OPENAI_API_KEY
    console.log(`🔑 API Route [${requestId}]: APIキー設定状況:`, hasApiKey ? '✅ 設定済み' : '❌ 未設定')

    // APIキーが未設定の場合はエラーを返す
    if (!hasApiKey) {
      console.log(`❌ API Route [${requestId}]: APIキー未設定のためエラー応答`)
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    // リクエストボディからROIデータを取得
    const roiData: ROIData = await request.json()
    console.log(`📊 API Route [${requestId}]: 受信データ:`, {
      industry: roiData.industry,
      roi: roiData.roi,
      paybackPeriod: roiData.paybackPeriod
    })

    // 入力データの基本的な検証
    // ROIデータが存在し、roiプロパティが数値であることを確認
    if (!roiData || typeof roiData.roi !== 'number') {
      return NextResponse.json(
        { error: 'Invalid ROI data provided' },
        { status: 400 }
      )
    }

    // AI分析サービスの呼び出し
    console.log(`🤖 API Route [${requestId}]: AI分析サービス呼び出し開始`)
    const analysis = await AIAnalysisService.generateAnalysis(roiData)

    // 成功レスポンスの返却
    console.log(`✅ API Route [${requestId}]: AI分析完了、レスポンス送信`)
    return NextResponse.json(analysis)
  } catch (error) {
    // エラーログの出力（デバッグと監視用）
    console.error(`❌ API Route [${requestId}]: AI分析API エラー:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })

    // エラーレスポンスの返却
    return NextResponse.json(
      {
        error: 'AI分析の生成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET リクエストハンドラー
 *
 * APIの動作確認用のエンドポイントです。
 * ヘルスチェックやAPIの可用性確認に使用できます。
 *
 * @returns APIの動作確認メッセージ
 */
export async function GET() {
  return NextResponse.json(
    { message: 'AI Analysis API is running' },
    { status: 200 }
  )
}
