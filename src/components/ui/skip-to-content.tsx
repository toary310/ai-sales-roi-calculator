"use client"

import { Button } from "@/components/ui/button"

export function SkipToContent() {
  return (
    <Button
      asChild
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50"
      variant="outline"
    >
      <a href="#main-content">
        メインコンテンツにスキップ
      </a>
    </Button>
  )
}
