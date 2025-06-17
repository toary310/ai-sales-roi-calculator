/**
 * 投資回収期間を年月表記でフォーマットする
 * @param months - 期間（ヶ月）
 * @returns フォーマットされた期間文字列
 */
export function formatPaybackPeriod(months: number): string {
  // NaNや無効な値のチェック
  if (isNaN(months) || months <= 0) {
    return "回収不可能"
  }

  // 999は回収不可能を示す特別な値
  if (months >= 999) {
    return "回収不可能"
  }

  if (months < 12) {
    return `${Math.round(months)}ヶ月`
  }

  const years = Math.floor(months / 12)
  const remainingMonths = Math.round(months % 12)

  if (remainingMonths === 0) {
    return `${years}年`
  }

  return `${years}年${remainingMonths}ヶ月`
}

/**
 * 期間の短縮版表記を取得
 * @param months - 期間（ヶ月）
 * @returns 短縮表記の期間文字列
 */
export function formatPaybackPeriodShort(months: number): string {
  // NaNや無効な値のチェック
  if (isNaN(months) || months <= 0) {
    return "回収不可"
  }

  // 999は回収不可能を示す特別な値
  if (months >= 999) {
    return "回収不可"
  }

  if (months < 12) {
    return `${Math.round(months)}ヶ月`
  }

  const years = Math.floor(months / 12)
  const remainingMonths = Math.round(months % 12)

  if (remainingMonths === 0) {
    return `${years}年`
  }

  return `${years}年${remainingMonths}ヶ月`
}
