import { AIAnalysisService } from '@/lib/ai/analysis-service'
import { ROIData } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 11)
  console.log(`🚀 API Route [${requestId}]: AI分析リクエスト受信`)

  try {
    // APIキーの確認
    const hasApiKey = !!process.env.OPENAI_API_KEY
    console.log(`🔑 API Route [${requestId}]: APIキー設定状況:`, hasApiKey ? '✅ 設定済み' : '❌ 未設定')

    if (!hasApiKey) {
      console.log(`❌ API Route [${requestId}]: APIキー未設定のためエラー応答`)
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const roiData: ROIData = await request.json()
    console.log(`📊 API Route [${requestId}]: 受信データ:`, {
      industry: roiData.industry,
      roi: roiData.roi,
      paybackPeriod: roiData.paybackPeriod
    })

    // 入力データの基本的な検証
    if (!roiData || typeof roiData.roi !== 'number') {
      return NextResponse.json(
        { error: 'Invalid ROI data provided' },
        { status: 400 }
      )
    }

    // AI分析の実行
    console.log(`🤖 API Route [${requestId}]: AI分析サービス呼び出し開始`)
    const analysis = await AIAnalysisService.generateAnalysis(roiData)

    console.log(`✅ API Route [${requestId}]: AI分析完了、レスポンス送信`)
    return NextResponse.json(analysis)
  } catch (error) {
    console.error(`❌ API Route [${requestId}]: AI分析API エラー:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      {
        error: 'AI分析の生成に失敗しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'AI Analysis API is running' },
    { status: 200 }
  )
}
