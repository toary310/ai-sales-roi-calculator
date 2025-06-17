import { MainLayout } from '@/components/layout'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Sales ROI Calculator - AI営業投資収益率計算ツール',
  description: 'AI導入による営業効果を正確に予測し、投資収益率を可視化する次世代ツール。業界別・企業規模別の詳細分析で高精度なROI計算を実現。',
  keywords: ['AI', 'ROI', '営業', '投資収益率', '計算ツール', 'セールス', 'ビジネス'],
  authors: [{ name: 'AI Sales ROI Calculator Team' }],
  creator: 'AI Sales ROI Calculator',
  publisher: 'AI Sales ROI Calculator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'AI Sales ROI Calculator',
    description: 'AI導入による営業効果を正確に予測し、投資収益率を可視化する次世代ツール',
    url: 'http://localhost:3000',
    siteName: 'AI Sales ROI Calculator',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Sales ROI Calculator',
    description: 'AI導入による営業効果を正確に予測し、投資収益率を可視化する次世代ツール',
    creator: '@ai_sales_roi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          suppressHydrationWarning
        >
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
