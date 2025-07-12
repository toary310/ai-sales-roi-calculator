"use client"

/**
 * ホームページコンポーネント
 *
 * このコンポーネントは、AI Sales ROI Calculatorのランディングページを提供します。
 * アプリケーションの価値提案、主要機能、利用開始への導線を効果的に配置し、
 * ユーザーにサービスを理解してもらい、計算ツールの利用を促進します。
 *
 * ページ構成:
 * 1. ヒーローセクション: メインメッセージとCTAボタン
 * 2. 特徴セクション: サービスの6つの主要機能
 * 3. CTAセクション: 最終的な行動喚起
 *
 * デザインの特徴:
 * - アニメーション効果（StaggerContainer、HoverScale）
 * - グラデーション背景
 * - レスポンシブデザイン
 * - アクセシビリティ対応
 * - ダークモード対応
 */
import { AnimatedContainer, HoverScale, StaggerContainer, StaggerItem } from "@/components/ui/animated-container"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, Calculator, Target, TrendingUp, Users, Zap } from "lucide-react"
import Link from "next/link"

/**
 * ホームページのメインコンポーネント
 *
 * アプリケーションのランディングページとして機能し、
 * ユーザーにサービスの価値を伝え、計算ツールの利用を促進します。
 *
 * @returns ホームページのJSX要素
 */
export default function Home() {
  return (
    <div className="min-h-screen">
      {/*
       * ヒーローセクション
       *
       * ページの最上部に配置され、アプリケーションの主要メッセージと
       * 最も重要なCTA（Call to Action）ボタンを表示します。
       * グラデーション背景とアニメーション効果で視覚的なインパクトを演出。
       */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* 背景グラデーション: 青から紫へのグラデーションで視覚的な魅力を向上 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>

        <div className="container relative z-10">
          {/* メインコンテンツ: 中央揃えで最大幅を制限し、読みやすさを確保 */}
          <AnimatedContainer className="text-center max-w-4xl mx-auto">
            {/* メインタイトル: グラデーションテキストで視覚的なインパクトを演出 */}
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              AI営業ROI計算ツール
            </h1>

            {/* サブタイトル: サービスの価値提案を簡潔に説明 */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              AI導入による営業効果を正確に予測し、<br />
              投資収益率を可視化する次世代ツール
            </p>

            {/* CTAボタン群: 主要アクションとセカンダリアクションを配置 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* プライマリーCTA: 計算開始への導線 */}
              <HoverScale>
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/calculator">
                    <Calculator className="mr-2 h-5 w-5" />
                    今すぐ計算開始
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </HoverScale>

              {/* セカンダリーCTA: 詳細情報への導線 */}
              <HoverScale>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Link href="/about">
                    サービス詳細
                  </Link>
                </Button>
              </HoverScale>
            </div>
          </AnimatedContainer>
        </div>
      </section>

      {/*
       * 特徴セクション
       *
       * サービスの6つの主要機能をカード形式で紹介し、
       * ユーザーにサービスの価値を具体的に伝えます。
       * 各カードにはアイコン、タイトル、説明文が含まれます。
       */}
      <section className="py-20 bg-background">
        <div className="container">
          {/* セクションタイトル: 特徴セクションの導入文 */}
          <AnimatedContainer delay={0.2} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              なぜAI Sales ROI Calculatorなのか？
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              データドリブンな意思決定で、AI投資の成功を確実にします
            </p>
          </AnimatedContainer>

          {/* 特徴カード群: 3列のグリッドレイアウトで6つの機能を紹介 */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 特徴1: 正確な計算エンジン */}
            <StaggerItem>
              <HoverScale>
                <Card className="h-full">
                  <CardHeader>
                    {/* アイコン: 計算機アイコンで機能を視覚的に表現 */}
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                      <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle>正確な計算エンジン</CardTitle>
                    <CardDescription>
                      業界別・企業規模別の詳細な分析により、高精度なROI予測を実現
                    </CardDescription>
                  </CardHeader>
                </Card>
              </HoverScale>
            </StaggerItem>

            {/* 特徴2: 美しいビジュアライゼーション */}
            <StaggerItem>
              <HoverScale>
                <Card className="h-full">
                  <CardHeader>
                    {/* アイコン: グラフアイコンでデータ可視化を表現 */}
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle>美しいビジュアライゼーション</CardTitle>
                    <CardDescription>
                      インタラクティブなチャートで、複雑なデータを直感的に理解
                    </CardDescription>
                  </CardHeader>
                </Card>
              </HoverScale>
            </StaggerItem>

            {/* 特徴3: リアルタイム分析 */}
            <StaggerItem>
              <HoverScale>
                <Card className="h-full">
                  <CardHeader>
                    {/* アイコン: トレンドアップアイコンで成長・分析を表現 */}
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle>リアルタイム分析</CardTitle>
                    <CardDescription>
                      即座に結果を確認し、複数のシナリオを比較検討可能
                    </CardDescription>
                  </CardHeader>
                </Card>
              </HoverScale>
            </StaggerItem>

            {/* 特徴4: チーム効率最適化 */}
            <StaggerItem>
              <HoverScale>
                <Card className="h-full">
                  <CardHeader>
                    {/* アイコン: ユーザーアイコンでチーム・人を表現 */}
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <CardTitle>チーム効率最適化</CardTitle>
                    <CardDescription>
                      営業チームの生産性向上と時間削減効果を定量化
                    </CardDescription>
                  </CardHeader>
                </Card>
              </HoverScale>
            </StaggerItem>

            {/* 特徴5: 高速処理 */}
            <StaggerItem>
              <HoverScale>
                <Card className="h-full">
                  <CardHeader>
                    {/* アイコン: 稲妻アイコンで高速・パフォーマンスを表現 */}
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                      <Zap className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle>高速処理</CardTitle>
                    <CardDescription>
                      複雑な計算も数秒で完了、すぐに意思決定に活用可能
                    </CardDescription>
                  </CardHeader>
                </Card>
              </HoverScale>
            </StaggerItem>

            {/* 特徴6: 戦略的洞察 */}
            <StaggerItem>
              <HoverScale>
                <Card className="h-full">
                  <CardHeader>
                    {/* アイコン: ターゲットアイコンで戦略・目標を表現 */}
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                      <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <CardTitle>戦略的洞察</CardTitle>
                    <CardDescription>
                      投資回収期間や損益分岐点など、重要な指標を明確に提示
                    </CardDescription>
                  </CardHeader>
                </Card>
              </HoverScale>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/*
       * CTA（Call to Action）セクション
       *
       * ページの最後に配置され、ユーザーに最終的な行動を促します。
       * グラデーション背景と白いテキストで視覚的なインパクトを演出し、
       * 計算ツールの利用を強く推奨します。
       */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container">
          <AnimatedContainer delay={0.4} className="text-center text-white">
            {/* 最終的な行動喚起メッセージ */}
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              今すぐAI投資のROIを計算しませんか？
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              無料で利用開始。数分で詳細な分析結果を取得できます。
            </p>

            {/* 最終CTAボタン: 計算開始への直接的な導線 */}
            <HoverScale>
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/calculator">
                  <Calculator className="mr-2 h-5 w-5" />
                  無料で計算開始
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </HoverScale>
          </AnimatedContainer>
        </div>
      </section>
    </div>
  )
}
