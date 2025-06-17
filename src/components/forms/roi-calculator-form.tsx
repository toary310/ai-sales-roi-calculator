"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { CurrencyInput } from "@/components/ui/currency-input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useROIStore } from "@/lib/store/roi-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calculator, Clock, DollarSign, TrendingUp, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

// フォームスキーマの定義
const formSchema = z.object({
  // 現在の営業データ
  salesTeamSize: z.number().min(1, "営業チーム規模は1以上である必要があります"),
  monthlySales: z.number().min(0, "月間売上は0以上である必要があります"),
  salesCost: z.number().min(0, "営業コストは0以上である必要があります"),
  averageDealSize: z.number().min(0, "平均取引額は0以上である必要があります"),
  conversionRate: z.number().min(0).max(100, "成約率は0-100%の範囲で入力してください"),
  salesCycleLength: z.number().min(1, "営業サイクルは1日以上である必要があります"),

  // AI導入計画
  aiToolType: z.string().min(1, "AIツールタイプを選択してください"),
  initialCost: z.number().min(0, "初期費用は0以上である必要があります"),
  monthlyCost: z.number().min(0, "月額費用は0以上である必要があります"),
  implementationPeriod: z.number().min(1, "導入期間は1ヶ月以上である必要があります"),

  // 期待効果
  efficiencyImprovement: z.array(z.number()).length(1),
  conversionImprovement: z.array(z.number()).length(1),
  timeReduction: z.array(z.number()).length(1),

  // その他
  industry: z.string().min(1, "業界を選択してください"),
  companySize: z.string().min(1, "会社規模を選択してください"),
  hasExistingCrm: z.boolean(),
  additionalNotes: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export function ROICalculatorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { calculateROI, isCalculating } = useROIStore()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salesTeamSize: 10,
      monthlySales: 5000000,
      salesCost: 2500000,
      averageDealSize: 500000,
      conversionRate: 20,
      salesCycleLength: 30,
      aiToolType: "",
      initialCost: 500000,
      monthlyCost: 50000,
      implementationPeriod: 3,
      efficiencyImprovement: [30],
      conversionImprovement: [15],
      timeReduction: [25],
      industry: "",
      companySize: "",
      hasExistingCrm: false,
      additionalNotes: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      // ROI計算を実行
      await calculateROI(data)

      toast({
        title: "計算完了",
        description: "ROI計算が完了しました。結果ページに移動します。",
      })

      // 結果ページに移動
      router.push('/results')

    } catch (error) {
      toast({
        title: "エラー",
        description: "計算中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 現在の営業データ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              現在の営業データ
            </CardTitle>
            <CardDescription>
              現在の営業チームの状況とパフォーマンスを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="salesTeamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>営業チーム規模（人）</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      営業担当者の総数を入力してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlySales"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>月間売上（円）</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      直近の月間売上実績を入力してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salesCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>月間営業コスト（円）</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      人件費、ツール費用等の営業関連コスト
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="averageDealSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>平均取引額（円）</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      1件あたりの平均契約金額
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="conversionRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>現在の成約率（%）</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      リードから成約までの転換率
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salesCycleLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>営業サイクル（日）</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      初回接触から成約までの平均日数
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* AI導入計画 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              AI導入計画
            </CardTitle>
            <CardDescription>
              導入予定のAIツールとコストを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="aiToolType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AIツールタイプ</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="AIツールを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="crm-ai">CRM AI機能</SelectItem>
                        <SelectItem value="sales-automation">営業自動化ツール</SelectItem>
                        <SelectItem value="lead-scoring">リードスコアリング</SelectItem>
                        <SelectItem value="chatbot">営業チャットボット</SelectItem>
                        <SelectItem value="predictive-analytics">予測分析ツール</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="implementationPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>導入期間（ヶ月）</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      完全導入までの予定期間
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="initialCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>初期費用（円）</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      導入時の初期費用（設定費、トレーニング費等）
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>月額費用（円）</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      継続的な月額利用料金
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* 期待効果 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              期待効果の設定
            </CardTitle>
            <CardDescription>
              AI導入による期待される改善効果を設定してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="efficiencyImprovement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>営業効率改善率: {field.value[0]}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    AI導入により期待される営業効率の改善率
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="conversionImprovement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>成約率改善: {field.value[0]}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={50}
                      step={1}
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    現在の成約率からの改善率（%）
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeReduction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>作業時間削減: {field.value[0]}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={80}
                      step={5}
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    事務作業等の時間削減率
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* 会社情報・その他 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              会社情報・その他
            </CardTitle>
            <CardDescription>
              より正確な計算のための追加情報
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>業界</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="業界を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technology">IT・テクノロジー</SelectItem>
                        <SelectItem value="manufacturing">製造業</SelectItem>
                        <SelectItem value="finance">金融・保険</SelectItem>
                        <SelectItem value="healthcare">医療・ヘルスケア</SelectItem>
                        <SelectItem value="retail">小売・EC</SelectItem>
                        <SelectItem value="real-estate">不動産</SelectItem>
                        <SelectItem value="consulting">コンサルティング</SelectItem>
                        <SelectItem value="education">教育</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companySize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>会社規模</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="会社規模を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="startup">スタートアップ（1-10名）</SelectItem>
                        <SelectItem value="small">小企業（11-50名）</SelectItem>
                        <SelectItem value="medium">中企業（51-200名）</SelectItem>
                        <SelectItem value="large">大企業（201-1000名）</SelectItem>
                        <SelectItem value="enterprise">大手企業（1000名以上）</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hasExistingCrm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      既存のCRM/SFAシステムを使用している
                    </FormLabel>
                    <FormDescription>
                      Salesforce、HubSpot等の営業管理システムの利用状況
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>追加情報・特記事項</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="特殊な営業プロセスや考慮すべき要因があれば記入してください"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    計算に影響する可能性のある特殊事情等（任意）
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* 送信ボタン */}
        <div className="flex justify-center">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting || isCalculating}
            className="flex items-center gap-2"
          >
            {isSubmitting || isCalculating ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                計算中...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4" />
                ROIを計算する
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
