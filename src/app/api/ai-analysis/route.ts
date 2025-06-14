import { NextRequest, NextResponse } from 'next/server'
import { AIAnalysisService } from '@/lib/ai/analysis-service'
import { ROIData } from '@/types/roi'

export async function POST(request: NextRequest) {
  try {
    // APIキーの確認
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const roiData: ROIData = await request.json()

    // 入力データの基本的な検証
    if (!roiData || typeof roiData.roi !== 'number') {
      return NextResponse.json(
        { error: 'Invalid ROI data provided' },
        { status: 400 }
      )
    }

    // AI分析の実行
    const analysis = await AIAnalysisService.generateAnalysis(roiData)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('AI分析API エラー:', error)
    
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
