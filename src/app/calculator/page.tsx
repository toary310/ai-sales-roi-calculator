import { ROICalculatorForm } from "@/components/forms/roi-calculator-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calculator, Clock, DollarSign, TrendingUp, Users } from "lucide-react"

export default function CalculatorPage() {
  return (
    <div className="container py-8 md:py-12">
      {/* ページヘッダー */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Calculator className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          AI Sales ROI Calculator
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          AI導入による営業効果とROIを簡単に計算できます。
          現在の営業データを入力して、AI導入の効果を可視化しましょう。
        </p>
      </div>

      {/* 計算ステップの説明 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle className="text-lg">Step 1</CardTitle>
            <CardDescription>現在の営業データ入力</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              営業チームの規模、売上、コストなどの基本データを入力します
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle className="text-lg">Step 2</CardTitle>
            <CardDescription>AI導入効果の設定</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              AI導入による効率改善率や期待される効果を設定します
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
            <CardTitle className="text-lg">Step 3</CardTitle>
            <CardDescription>ROI結果の確認</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              計算結果とROI分析をグラフと数値で確認できます
            </p>
          </CardContent>
        </Card>
      </div>

      {/* メイン計算エリア */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            ROI計算を開始
          </CardTitle>
          <CardDescription>
            以下のフォームに必要な情報を入力してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* 現在の営業データセクション */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                現在の営業データ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">営業チーム規模</h4>
                  <p className="text-sm text-muted-foreground">営業担当者数、マネージャー数など</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">売上実績</h4>
                  <p className="text-sm text-muted-foreground">月間売上、年間売上など</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">営業コスト</h4>
                  <p className="text-sm text-muted-foreground">人件費、ツール費用など</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">営業活動時間</h4>
                  <p className="text-sm text-muted-foreground">商談時間、事務作業時間など</p>
                </div>
              </div>
            </div>

            {/* AI導入効果セクション */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI導入効果の設定
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">効率改善率</h4>
                  <p className="text-sm text-muted-foreground">AI導入による作業効率の向上率</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">成約率向上</h4>
                  <p className="text-sm text-muted-foreground">AIによる成約率の改善効果</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">AI導入コスト</h4>
                  <p className="text-sm text-muted-foreground">初期費用、月額費用など</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">導入期間</h4>
                  <p className="text-sm text-muted-foreground">ROI計算の対象期間</p>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    詳細入力フォームを開く
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>ROI計算フォーム</DialogTitle>
                    <DialogDescription>
                      以下のフォームに必要な情報を入力して、AI導入のROIを計算してください。
                    </DialogDescription>
                  </DialogHeader>
                  <ROICalculatorForm />
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                サンプルデータで試す
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 注意事項 */}
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          ※ 入力されたデータは計算にのみ使用され、外部に送信されることはありません。
          ブラウザのローカルストレージに一時的に保存されます。
        </p>
      </div>
    </div>
  )
}
